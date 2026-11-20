import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';

/**
 * OCR Service Module using Tesseract.js
 * Extracts raw medical text from uploaded prescription images or documents.
 */
export const extractTextFromImage = async (filePath) => {
  try {
    const absolutePath = path.resolve(filePath);

    if (!fs.existsSync(absolutePath)) {
      console.warn(`[OCR Service] File does not exist at path: ${absolutePath}`);
      return 'Prescription image file not found on server.';
    }

    console.log(`[Tesseract OCR] Extracting text from: ${absolutePath}`);

    const result = await Tesseract.recognize(absolutePath, 'eng', {
      logger: (m) => {
        if (m.status === 'recognizing text' && m.progress % 0.25 === 0) {
          console.log(`[Tesseract OCR] Progress: ${Math.round(m.progress * 100)}%`);
        }
      },
    });

    const rawText = result.data && result.data.text ? result.data.text.trim() : '';

    console.log(`[Tesseract OCR] Text extraction complete (${rawText.length} characters)`);

    if (!rawText || rawText.length < 5) {
      return 'Extracted prescription text is empty or unreadable. Please ensure the image is clear.';
    }

    return rawText;
  } catch (error) {
    console.error('[Tesseract OCR Error]:', error.message);
    return `OCR extraction notice: Unable to parse text automatically (${error.message}).`;
  }
};
