import { GoogleGenerativeAI } from '@google/generative-ai';
import Groq from 'groq-sdk';

/**
 * Initialize AI Providers (Google Gemini & Groq)
 */
const getGeminiClient = () => {
  const key = process.env.GEMINI_API_KEY;
  if (!key) return null;
  return new GoogleGenerativeAI(key);
};

const getGroqClient = () => {
  const key = process.env.GROQ_API_KEY;
  if (!key) return null;
  return new Groq({ apiKey: key });
};

/**
 * Helper to clean and parse JSON response from AI text output
 */
const parseAIJSONResponse = (rawContent) => {
  try {
    let cleanText = rawContent.trim();
    // Remove markdown code fences if present (e.g. ```json ... ```)
    if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/^```(json)?\n?/, '').replace(/\n?```$/, '').trim();
    }
    return JSON.parse(cleanText);
  } catch (err) {
    console.error('[AI Service] Failed to parse JSON response:', err.message, rawContent);
    return null;
  }
};

/**
 * Analyze OCR extracted medical text into structured JSON prescription data
 */
export const simplifyMedicalText = async (extractedText) => {
  const promptText = `
You are MedGuide's medical prescription analysis assistant.
Analyze the following raw OCR extracted prescription text.

Raw Prescription Text:
"""
${extractedText}
"""

Return ONLY a valid JSON object matching this exact structure:
{
  "doctorName": "Doctor Name if mentioned, or 'Not specified'",
  "hospitalName": "Hospital or Clinic Name if mentioned, or 'Not specified'",
  "datePrescribed": "YYYY-MM-DD or 'Not specified'",
  "simpleSummary": "A clear 2-3 sentence explanation of what this prescription is for in simple, easy-to-understand terms.",
  "medicines": [
    {
      "name": "Medicine name (e.g. Amoxicillin)",
      "dosage": "Dosage (e.g. 500mg, 1 tablet)",
      "frequency": "Frequency (e.g. 3 times daily, twice daily)",
      "timing": "Timing (e.g. After meals, Before meals, With water)",
      "duration": "Duration (e.g. 7 days, 5 days, Continuous)",
      "purpose": "Purpose or condition treated (e.g. Bacterial infection, Fever relief)"
    }
  ],
  "precautions": [
    "Important caution 1",
    "Important caution 2"
  ]
}

Rule: If any field value is missing, unclear, or unavailable from the text, return "Not specified" for that string field. Never leave medicine fields empty, null, or missing. Do not add any text before or after the JSON.
`;

  // 1. Try Gemini API first if configured
  const genAI = getGeminiClient();
  if (genAI) {
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of candidateModels) {
      try {
        console.log(`[Gemini AI] Attempting analysis with model: ${modelName}`);
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: 'application/json' },
        });
        const result = await model.generateContent(promptText);
        const responseText = result.response.text();
        const parsed = parseAIJSONResponse(responseText);
        if (parsed) {
          console.log(`[Gemini AI] Analysis successful with model ${modelName}`);
          return parsed;
        }
      } catch (err) {
        console.warn(`[Gemini AI] Model ${modelName} call failed:`, err.message);
      }
    }
  }

  // 2. Try Groq SDK fallback if Gemini is unconfigured or failed
  const groq = getGroqClient();
  if (groq) {
    try {
      console.log('[Groq AI] Attempting analysis with llama-3.1-8b-instant...');
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: 'You are a medical prescription analysis assistant. Return ONLY valid JSON format without markdown.',
          },
          { role: 'user', content: promptText },
        ],
        response_format: { type: 'json_object' },
      });

      const responseText = completion.choices[0].message.content;
      const parsed = parseAIJSONResponse(responseText);
      if (parsed) {
        console.log('[Groq AI] Analysis successful');
        return parsed;
      }
    } catch (err) {
      console.error('[Groq AI Error]:', err.message);
    }
  }

  // 3. Graceful fallback response if all AI services fail or are unconfigured
  console.warn('[AI Service] All AI APIs failed/unconfigured. Returning structured fallback parsing.');
  return {
    doctorName: 'Not specified',
    hospitalName: 'Not specified',
    datePrescribed: new Date().toISOString().split('T')[0],
    simpleSummary: 'Prescription text recorded. Automatic AI breakdown is currently processing or offline.',
    medicines: [
      {
        name: 'Prescription Item (See raw text)',
        dosage: 'Not specified',
        frequency: 'As directed by physician',
        timing: 'Not specified',
        duration: 'Not specified',
        purpose: 'Medical treatment',
      },
    ],
    precautions: ['Take medicines strictly as prescribed by your doctor.', 'Consult a pharmacist or physician if instructions are unclear.'],
  };
};

/**
 * AI Prescription Assistant Chat logic with Medical Safety rules
 */
export const chatAboutPrescription = async (prescriptionContext, userMessage, chatHistory = []) => {
  const systemPrompt = `
You are MedGuide's Prescription Assistant.
You are helping a patient understand their specific prescription.

Prescription Context:
- Doctor: ${prescriptionContext.doctorName || 'Not specified'}
- Hospital: ${prescriptionContext.hospitalName || 'Not specified'}
- Summary: ${prescriptionContext.simpleSummary || 'No summary'}
- Medicines: ${JSON.stringify(prescriptionContext.medicines || [])}
- Extracted Prescription Text: """${prescriptionContext.extractedText || ''}"""

Medical Safety & Guardrails:
1. You may explain medicines, dosages, frequencies, timings, precautions, and medical terms based on the prescription context.
2. DO NOT diagnose diseases or health conditions.
3. DO NOT prescribe new medicines or modify the doctor's prescribed dosages.
4. If the user asks about emergency, severe, or life-threatening symptoms (e.g. severe chest pain, extreme shortness of breath, severe allergic reaction), advise them immediately to contact emergency services or seek immediate medical care.
5. Keep your tone helpful, empathetic, clear, and easy to understand for non-medical users.
`;

  // Build message history for AI context
  const messages = [{ role: 'system', content: systemPrompt }];

  // Include up to 6 recent historical messages for contextual continuity
  if (Array.isArray(chatHistory) && chatHistory.length > 0) {
    chatHistory.slice(-6).forEach((msg) => {
      messages.push({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content || msg.text || '',
      });
    });
  }

  messages.push({ role: 'user', content: userMessage });

  // 1. Gemini AI Chat attempt
  const genAI = getGeminiClient();
  if (genAI) {
    const candidateModels = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    for (const modelName of candidateModels) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        // Format prompt string combining system prompt + last messages
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}`;
        const result = await model.generateContent(fullPrompt);
        const answer = result.response.text();
        if (answer) return answer.trim();
      } catch (err) {
        console.warn(`[Gemini Chat AI] Model ${modelName} call failed:`, err.message);
      }
    }
  }

  // 2. Groq AI Chat attempt
  const groq = getGroqClient();
  if (groq) {
    try {
      const completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
      });
      const answer = completion.choices[0].message.content;
      if (answer) return answer.trim();
    } catch (err) {
      console.error('[Groq Chat AI Error]:', err.message);
    }
  }

  // 3. Fallback response
  return "I am currently unable to analyze this question about your prescription. Please consult your physician or pharmacist directly for instructions.";
};