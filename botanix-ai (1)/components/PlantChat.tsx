
import React, { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';
import { PlantIdentification, Language, ChatMessage } from '../types';
import { getBotanistChatResponse } from '../services/geminiService';

interface PlantChatProps {
  plantData: PlantIdentification;
  onUpdateHistory: (history: ChatMessage[]) => void;
  language: Language;
}

export const PlantChat: React.FC<PlantChatProps> = ({ plantData, onUpdateHistory, language }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(plantData.chatHistory || []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: Date.now() };
    const updatedHistory = [...messages, userMsg];
    setMessages(updatedHistory);
    setInput("");
    setIsLoading(true);

    try {
      const responseText = await getBotanistChatResponse(plantData, updatedHistory, input, language);
      const botMsg: ChatMessage = { role: 'model', text: responseText, timestamp: Date.now() };
      const finalHistory = [...updatedHistory, botMsg];
      setMessages(finalHistory);
      onUpdateHistory(finalHistory);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[500px] bg-white rounded-3xl shadow-glass border border-nature-100 overflow-hidden">
      <div className="p-4 bg-nature-50 border-b border-nature-100 flex items-center gap-3">
        <div className="p-2 bg-white rounded-full text-nature-600 shadow-sm">
          <Icons.MessageCircle size={20} />
        </div>
        <div>
          <h3 className="font-bold text-nature-900">Botanist Assistant</h3>
          <p className="text-xs text-nature-500">Ask about {plantData.commonNames[0]}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="text-center text-nature-400 mt-10">
            <Icons.Sprout size={40} className="mx-auto mb-2 opacity-50" />
            <p className="text-sm">Ask me anything about watering, soil, or care!</p>
          </div>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-nature-600 text-white rounded-br-none' : 'bg-nature-50 text-nature-800 rounded-bl-none'}`}>
              {m.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
             <div className="bg-nature-50 p-3 rounded-2xl rounded-bl-none flex gap-1">
               <div className="w-2 h-2 bg-nature-400 rounded-full animate-bounce"></div>
               <div className="w-2 h-2 bg-nature-400 rounded-full animate-bounce delay-100"></div>
               <div className="w-2 h-2 bg-nature-400 rounded-full animate-bounce delay-200"></div>
             </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      <div className="p-3 border-t border-nature-100 bg-white flex gap-2">
        <input 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type your question..."
          className="flex-1 bg-nature-50 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-nature-200"
        />
        <button onClick={handleSend} disabled={isLoading} className="p-2 bg-nature-600 text-white rounded-full hover:bg-nature-700 transition-colors disabled:opacity-50">
          <Icons.Send size={18} />
        </button>
      </div>
    </div>
  );
};
