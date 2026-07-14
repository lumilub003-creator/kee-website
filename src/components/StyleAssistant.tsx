import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, ArrowRight, Loader2, HelpCircle, AlertCircle, ShoppingBag, Languages } from 'lucide-react';
import { Product } from '../types';

interface StyleAssistantProps {
  productsList: Product[];
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product, size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL', color: any, qty: number) => void;
}

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function StyleAssistant({ productsList, onSelectProduct, onAddToCart }: StyleAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Greetings, Esteemed Madam. ⚜️ Welcome to the KEE! Style Atelier.\n\nI am your dedicated **KEE! Style Assistant**. I am delighted to assist you with choosing the perfect raw silk sizes, curated outfit recommendations, answering boutique shipping policies, or finding gorgeous ensembles within your budget.\n\nI am fluent in both **English** and **தமிழ்**. How may I elevate your style experience today?",
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'presets'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      setTimeout(scrollToBottom, 100);
    }
  }, [messages, isOpen, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}`,
      role: 'user',
      text: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      // Map message history to server format
      const history = messages.map((m) => ({
        role: m.role,
        text: m.text,
      }));

      const response = await fetch('/api/style-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          history: history,
          products: productsList,
        }),
      });

      if (!response.ok) {
        throw new Error('Network error calling AI assistant');
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: `msg-${Date.now()}-assistant`,
        role: 'model',
        text: data.text || 'I apologize, but I am unable to connect with the atelier servers right now. Please connect via our WhatsApp concierge!',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Style Assistant API Error:', error);
      const errorMessage: Message = {
        id: `msg-${Date.now()}-error`,
        role: 'model',
        text: 'I apologize, Madam. It seems my connection to our main archives is slightly congested. Please click on our **WhatsApp Concierge** for instant help from our senior design tailor!',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePresetClick = (prompt: string) => {
    setActiveTab('chat');
    handleSendMessage(prompt);
  };

  // Helper to parse and extract mentioned products from the assistant text
  const getProductReferences = (text: string): Product[] => {
    const references: Product[] = [];
    productsList.forEach((product) => {
      // Look for product ID (e.g. KEE-RS01) or part of the product name
      if (text.includes(product.id)) {
        if (!references.some((r) => r.id === product.id)) {
          references.push(product);
        }
      }
    });
    return references;
  };

  // Format the response text with bolding and bullet points nicely
  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Replace Markdown bold **text** with styled bold elements
      let processed = line;
      const boldRegex = /\*\*(.*?)\*\*/g;
      const parts = [];
      let lastIdx = 0;
      let match;

      while ((match = boldRegex.exec(processed)) !== null) {
        if (match.index > lastIdx) {
          parts.push(processed.substring(lastIdx, match.index));
        }
        parts.push(<strong key={`bold-${match.index}`} className="font-bold text-amber-900">{match[1]}</strong>);
        lastIdx = boldRegex.lastIndex;
      }
      
      if (lastIdx < processed.length) {
        parts.push(processed.substring(lastIdx));
      }

      const finalContent = parts.length > 0 ? parts : processed;

      if (line.trim().startsWith('-') || line.trim().startsWith('*')) {
        return (
          <li key={index} className="list-disc ml-4 pl-1 text-[12px] leading-relaxed text-neutral-800 mb-1.5">
            {line.trim().substring(1).trim()}
          </li>
        );
      }
      return (
        <p key={index} className="text-[12px] leading-relaxed text-neutral-800 mb-2.5">
          {finalContent}
        </p>
      );
    });
  };

  return (
    <>
      {/* FLOATING SPARKLE CHAT TRIGGER BUTTON */}
      <div className="fixed bottom-6 left-6 z-40 group flex flex-col items-start gap-2.5">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-neutral-900 hover:bg-neutral-850 text-[#DFD1B7] p-4 shadow-2xl transition-all duration-300 transform hover:scale-115 flex items-center justify-center relative border border-amber-600/30 rounded-full"
          aria-label="KEE! Style Assistant"
          id="kee-style-assistant-btn"
        >
          <Sparkles className="w-6 h-6 text-[#DFD1B7] animate-pulse" />
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-amber-500"></span>
          </span>
        </button>

        {/* Floating text label */}
        <div className="opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-300 bg-neutral-950 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-2 border border-neutral-800 pointer-events-none whitespace-nowrap shadow-xl">
          ✨ KEE! Style Assistant
        </div>
      </div>

      {/* FULL-SCREEN SLIDE-UP ASSISTANT DRAWER */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end justify-start pointer-events-none md:p-6">
            {/* Backdrop for mobile, click to close */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.4 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/60 pointer-events-auto block md:hidden"
            />

            {/* Main Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 100, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 100, scale: 0.95 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="bg-[#FCFCF9] border-t md:border border-neutral-200 shadow-2xl w-full md:w-[420px] h-[100dvh] md:h-[620px] flex flex-col pointer-events-auto z-10 md:rounded-2xl overflow-hidden"
            >
              {/* Luxury Header */}
              <div className="bg-neutral-950 px-5 py-4 border-b border-amber-600/20 flex justify-between items-center relative">
                <div className="flex items-center gap-3">
                  <div className="bg-amber-950/40 p-2 border border-amber-600/30 rounded-full">
                    <Sparkles className="w-4 h-4 text-[#DFD1B7]" />
                  </div>
                  <div>
                    <h3 className="font-serif text-[13px] font-bold text-white tracking-widest uppercase flex items-center gap-2">
                      KEE! Style Assistant
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                    </h3>
                    <p className="text-[9px] text-[#DFD1B7]/70 uppercase tracking-widest font-medium">Bespoke Fashion Advisor</p>
                  </div>
                </div>
                
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-neutral-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-full"
                >
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              {/* Sub-navigation tabs */}
              <div className="flex border-b border-neutral-200 bg-neutral-50 px-4 py-1">
                <button
                  onClick={() => setActiveTab('chat')}
                  className={`px-4 py-2 text-[10px] uppercase tracking-wider font-bold transition-all border-b-2 ${
                    activeTab === 'chat'
                      ? 'border-amber-700 text-amber-800'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Consultation
                </button>
                <button
                  onClick={() => setActiveTab('presets')}
                  className={`px-4 py-2 text-[10px] uppercase tracking-wider font-bold transition-all border-b-2 ${
                    activeTab === 'presets'
                      ? 'border-amber-700 text-amber-800'
                      : 'border-transparent text-neutral-500 hover:text-neutral-800'
                  }`}
                >
                  Bespoke Topics
                </button>
              </div>

              {/* Chat Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FCFCF9] min-h-0">
                {activeTab === 'chat' ? (
                  <>
                    {messages.map((msg) => {
                      const isAI = msg.role === 'model';
                      const refs = isAI ? getProductReferences(msg.text) : [];

                      return (
                        <div key={msg.id} className={`flex ${isAI ? 'justify-start' : 'justify-end'} gap-2.5 items-start`}>
                          {isAI && (
                            <div className="w-7 h-7 rounded-full bg-neutral-900 border border-amber-600/30 flex items-center justify-center shrink-0 mt-0.5">
                              <Bot className="w-3.5 h-3.5 text-[#DFD1B7]" />
                            </div>
                          )}

                          <div className="max-w-[82%] flex flex-col gap-1.5">
                            <div
                              className={`p-3.5 rounded-none shadow-sm text-neutral-800 text-[12px] border ${
                                isAI
                                  ? 'bg-[#FAF9F5] border-[#E8E2D5] rounded-tr-xl rounded-br-xl rounded-bl-sm'
                                  : 'bg-neutral-900 text-[#FCFCF9] border-neutral-800 rounded-tl-xl rounded-bl-xl rounded-br-sm'
                              }`}
                            >
                              {isAI ? formatMessageText(msg.text) : <p className="leading-relaxed">{msg.text}</p>}
                            </div>

                            {/* Render Interactive Clickable Product Cards referenced in the chat! */}
                            {refs.length > 0 && (
                              <div className="mt-2 space-y-2 border-l-2 border-amber-500/50 pl-3.5">
                                <p className="text-[9px] uppercase tracking-widest text-neutral-400 font-bold">Suggested Garments:</p>
                                {refs.map((product) => (
                                  <div
                                    key={product.id}
                                    className="bg-white border border-neutral-200/60 p-2 flex gap-3 hover:border-amber-600 transition-colors duration-200 cursor-pointer"
                                    onClick={() => {
                                      onSelectProduct(product);
                                      setIsOpen(false);
                                    }}
                                  >
                                    <img
                                      src={product.images[0]}
                                      alt={product.name}
                                      className="w-12 h-12 object-cover shrink-0"
                                    />
                                    <div className="min-w-0 flex-1 flex flex-col justify-between">
                                      <h4 className="text-[11px] font-bold text-neutral-900 truncate tracking-tight">{product.name}</h4>
                                      <div className="flex justify-between items-center mt-1">
                                        <p className="text-[10px] font-semibold text-amber-800">₹{product.price}</p>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onAddToCart(product, product.sizes[0], product.colors[0], 1);
                                          }}
                                          disabled={product.stock === 0}
                                          className={`px-2 py-0.5 text-[8px] uppercase font-bold tracking-wider ${
                                            product.stock === 0
                                              ? 'bg-neutral-100 text-neutral-400'
                                              : 'bg-neutral-900 text-white hover:bg-amber-800'
                                          }`}
                                        >
                                          {product.stock === 0 ? 'Sold Out' : 'Add'}
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          {!isAI && (
                            <div className="w-7 h-7 rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center shrink-0 mt-0.5">
                              <User className="w-3.5 h-3.5 text-neutral-600" />
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {isLoading && (
                      <div className="flex justify-start gap-2.5 items-start">
                        <div className="w-7 h-7 rounded-full bg-neutral-900 border border-amber-600/30 flex items-center justify-center shrink-0 mt-0.5 animate-spin">
                          <Loader2 className="w-3.5 h-3.5 text-[#DFD1B7]" />
                        </div>
                        <div className="bg-[#FAF9F5] border border-[#E8E2D5] p-3 rounded-tr-xl rounded-br-xl rounded-bl-sm max-w-[80%] shadow-sm">
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <span className="w-1.5 h-1.5 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <span className="w-1.5 h-1.5 bg-amber-800 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </>
                ) : (
                  /* Presets Topics Tab */
                  <div className="space-y-6 py-2">
                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-neutral-400 mb-3 flex items-center gap-1.5">
                        <Languages className="w-3.5 h-3.5" /> 📐 Sizing & Customization
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handlePresetClick('What size is best for a 36" bust?')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Find my exact size for a 36&quot; bust <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                        <button
                          onClick={() => handlePresetClick('எனது அளவு என்ன? மார்பளவு 40 அங்குலம் (Tamil sizing help)')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          மார்பளவு 40&quot; - தமிழ் அளவு வழிகாட்டி <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                        <button
                          onClick={() => handlePresetClick('Do you offer custom sleeve or height tailoring?')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Bespoke height/sleeve length tailoring options <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-neutral-400 mb-3 flex items-center gap-1.5">
                        <ShoppingBag className="w-3.5 h-3.5" /> 👗 Outfit Suggestions & Budgets
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handlePresetClick('Recommend a premium outfit for a grand wedding reception')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Outfit for wedding reception/grand celebrations <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                        <button
                          onClick={() => handlePresetClick('What luxury ensembles do you have under ₹5000?')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Show me luxury outfits under ₹5,000 <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                        <button
                          onClick={() => handlePresetClick('Suggest an elegant Co-ord Set in rich raw silk')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Recommend raw silk Co-ord sets <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-[10px] uppercase tracking-widest font-black text-neutral-400 mb-3 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5" /> 🚚 Boutique Policies & Delivery
                      </h4>
                      <div className="grid grid-cols-1 gap-2">
                        <button
                          onClick={() => handlePresetClick('Do you ship across India? How long does delivery take?')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          Shipping timelines & courier partners in India <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                        <button
                          onClick={() => handlePresetClick('What is your return and exchange policy?')}
                          className="w-full text-left p-3 text-[11px] font-medium text-neutral-700 bg-white border border-neutral-200 hover:border-amber-600 hover:bg-amber-50/20 transition-all flex items-center justify-between"
                        >
                          7-Day premium return and size exchanges <ArrowRight className="w-3 h-3 opacity-60" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Input Footer */}
              {activeTab === 'chat' && (
                <div className="p-3 bg-neutral-50 border-t border-neutral-200">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage(inputText);
                    }}
                    className="flex gap-2"
                  >
                    <input
                      type="text"
                      value={inputText}
                      onChange={(e) => setInputText(e.target.value)}
                      placeholder="Consult style assistant..."
                      disabled={isLoading}
                      className="flex-1 bg-white border border-neutral-300 p-2.5 text-[12px] focus:outline-hidden focus:border-amber-700 text-neutral-800 shadow-inner rounded-none"
                    />
                    <button
                      type="submit"
                      disabled={isLoading || !inputText.trim()}
                      className="bg-neutral-900 text-[#DFD1B7] hover:bg-neutral-850 p-2.5 aspect-square flex items-center justify-center transition-colors shadow-md disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none shrink-0"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <p className="text-[9px] text-neutral-400 mt-1.5 text-center tracking-wide">
                    ⚜️ KEE! Style Advisor supports <strong>English</strong> &amp; <strong>தமிழ்</strong>
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
