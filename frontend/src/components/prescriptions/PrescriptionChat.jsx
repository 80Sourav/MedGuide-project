import React, { useState, useEffect, useRef } from 'react';
import { Send, Bot, User, Sparkles, ShieldAlert, Loader2 } from 'lucide-react';
import * as prescriptionService from '../../services/prescriptionService';

const PrescriptionChat = ({ prescriptionId }) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!prescriptionId) return;
      try {
        const history = await prescriptionService.getPrescriptionChatHistory(prescriptionId);
        setMessages(Array.isArray(history) ? history : []);
      } catch (err) {
        console.error('Failed to load chat history:', err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchChatHistory();
  }, [prescriptionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query || !query.trim() || loading) return;

    const userMessage = { role: 'user', content: query.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setLoading(true);

    try {
      const response = await prescriptionService.sendPrescriptionChatMessage(prescriptionId, query.trim());
      if (response && response.answer) {
        const assistantMessage = { role: 'assistant', content: response.answer, timestamp: new Date() };
        setMessages((prev) => [...prev, assistantMessage]);
      }
    } catch (err) {
      console.error('Failed to send chat message:', err);
      const errorMessage = {
        role: 'assistant',
        content: 'I apologize, but I am currently unable to answer this question. Please try again or consult your doctor.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const suggestionChips = [
    'What is this medicine for?',
    'When should I take this medicine?',
    'How many times daily should I take it?',
    'What precautions should I follow?',
  ];

  return (
    <div className="med-card overflow-hidden flex flex-col h-[520px] bg-white border border-slate-200 shadow-sm rounded-2xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 bg-slate-50/80 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              Prescription AI Assistant
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                <Sparkles className="w-3 h-3 mr-1" /> Context-Aware
              </span>
            </h3>
            <p className="text-xs text-slate-500">Ask questions about your uploaded prescription</p>
          </div>
        </div>
      </div>

      {/* Safety Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-200/60 px-4 py-2 flex items-center space-x-2 text-xs text-amber-900 font-medium">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0" />
        <span>
          Assistant explains your prescription details. It does not diagnose diseases or change doctor dosages.
        </span>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/40">
        {initialLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
            <Loader2 className="w-6 h-6 animate-spin text-teal-600" />
            <p className="text-xs">Loading prescription chat context...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 mx-auto flex items-center justify-center">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Have questions about this prescription?</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                Ask about medicine usage, dosage timings, or precautions. Responses are tailored to your uploaded prescription.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 pt-2">
              {suggestionChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(chip)}
                  className="px-3 py-1.5 rounded-xl bg-white border border-teal-200 text-teal-800 hover:bg-teal-50 text-xs font-semibold shadow-2xs transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-start space-x-3 max-w-[85%] ${
                msg.role === 'user' ? 'ml-auto flex-row-reverse space-x-reverse' : ''
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-teal-700 text-white'
                    : 'bg-teal-100 text-teal-800 border border-teal-200'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-teal-600 text-white font-medium rounded-tr-none'
                    : 'bg-white text-slate-800 border border-slate-200 shadow-2xs rounded-tl-none'
                }`}
              >
                <p className="whitespace-pre-wrap">{msg.content}</p>
                <span
                  className={`block text-[10px] mt-1.5 text-right font-medium ${
                    msg.role === 'user' ? 'text-teal-100' : 'text-slate-400'
                  }`}
                >
                  {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}

        {loading && (
          <div className="flex items-center space-x-3 max-w-[80%]">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-800 border border-teal-200 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-slate-500 text-xs flex items-center space-x-2">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>Analyzing prescription context...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Footer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="p-3 border-t border-slate-200 bg-white flex items-center space-x-2"
      >
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Ask a question about this prescription..."
          disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-teal-600 focus:bg-white"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center space-x-1 shadow-xs disabled:opacity-50 transition-colors"
        >
          <span>Send</span>
          <Send className="w-3.5 h-3.5 ml-1" />
        </button>
      </form>
    </div>
  );
};

export default PrescriptionChat;
