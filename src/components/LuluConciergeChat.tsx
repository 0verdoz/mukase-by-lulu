import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, ChefHat, ShieldCheck, ArrowRight, CornerDownLeft, Sparkles } from 'lucide-react';
import { useOrder } from '../context/OrderContext';
import { LULU_CASHAPP_TAG, LULU_ZELLE_CONTACT, LULU_PHONE_NUMBER } from '../utils/checkout';

export const LuluConciergeChat: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatMessages, sendUserMessage, setCurrentView, setTrackingOrderId } = useOrder();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [chatMessages, isChatOpen]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim()) return;
    sendUserMessage(inputText.trim());
    setInputText('');
  };

  const handleQuickReply = (text: string) => {
    if (text.includes('Track') || text.includes('MUK-')) {
      const match = text.match(/MUK-\d{4}/i);
      if (match) {
        setTrackingOrderId(match[0].toUpperCase());
        setCurrentView('track');
        setIsChatOpen(false);
        return;
      }
    }
    sendUserMessage(text);
  };

  if (!isChatOpen) {
    return (
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-amber-600 hover:bg-amber-700 active:scale-95 text-white rounded-2xl shadow-xl shadow-amber-600/30 font-medium text-xs sm:text-sm transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
        aria-label="Open Lulu Concierge Assistant"
      >
        <div className="relative">
          <ChefHat className="w-5 h-5 text-amber-100" />
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-amber-600" />
        </div>
        <span className="font-semibold font-display">Lulu Concierge</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-96 max-h-[600px] h-[85vh] bg-white rounded-2xl shadow-2xl border border-stone-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
      
      {/* Chat Header */}
      <div className="p-3.5 bg-stone-900 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-600 flex items-center justify-center text-white">
            <ChefHat className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold font-display leading-none">Lulu Concierge Bot</h3>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-0.5">
              <span>●</span> Direct Kitchen Assistant
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsChatOpen(false)}
          className="w-7 h-7 rounded-lg hover:bg-stone-800 text-stone-400 hover:text-white flex items-center justify-center transition-colors"
          aria-label="Close Chat"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#faf8f5]">
        {chatMessages.map(msg => {
          const isBot = msg.sender === 'bot';
          return (
            <div key={msg.id} className={`flex flex-col ${isBot ? 'items-start' : 'items-end'}`}>
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                  isBot
                    ? 'bg-white text-stone-800 border border-stone-200/90 shadow-sm rounded-tl-sm'
                    : 'bg-amber-600 text-white shadow-sm rounded-tr-sm font-medium'
                }`}
              >
                <p className="whitespace-pre-line">{msg.text}</p>
                <span
                  className={`text-[9px] block mt-1 ${
                    isBot ? 'text-stone-400' : 'text-amber-200'
                  }`}
                >
                  {msg.timestamp}
                </span>
              </div>

              {/* Quick Reply Chips if provided */}
              {isBot && msg.quickReplies && msg.quickReplies.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5 max-w-[95%]">
                  {msg.quickReplies.map((reply, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleQuickReply(reply)}
                      className="px-2.5 py-1 text-[11px] font-semibold bg-white hover:bg-amber-50 text-amber-900 border border-amber-200/80 rounded-lg shadow-2xs hover:border-amber-300 transition-colors"
                    >
                      {reply}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white border-t border-stone-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            placeholder="Ask about menu, payment memo, or tracking..."
            className="flex-1 px-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="w-8 h-8 rounded-xl bg-amber-600 disabled:opacity-40 hover:bg-amber-700 text-white flex items-center justify-center transition-colors shrink-0"
            aria-label="Send message"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>

        <div className="mt-2 flex items-center justify-between text-[10px] text-stone-400">
          <span>Official line: +1 {LULU_PHONE_NUMBER}</span>
          <a
            href={`https://wa.me/${LULU_PHONE_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="text-emerald-700 hover:underline font-semibold"
          >
            Open in WhatsApp ↗
          </a>
        </div>
      </div>

    </div>
  );
};
