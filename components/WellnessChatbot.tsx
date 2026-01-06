'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface Message {
    id: string;
    text: string;
    sender: 'user' | 'ai';
    timestamp: Date;
}

export default function WellnessChatbot() {
    const { t, isRTL, language } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputText, setInputText] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Initial Welcome Message - only once on mount
    useEffect(() => {
        if (messages.length === 0) {
            setMessages([
                {
                    id: '1',
                    text: t('chatbot.welcome'),
                    sender: 'ai',
                    timestamp: new Date()
                }
            ]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array - only run once

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputText.trim() || isLoading) return;

        const userMsg: Message = {
            id: Date.now().toString(),
            text: inputText,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        const currentInput = inputText;
        setInputText('');
        setIsLoading(true);

        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            console.log('💬 Sending to chatbot:', currentInput);
            const response = await fetch(`${baseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: currentInput, language: language })
            });

            if (!response.ok) throw new Error();

            const data = await response.json();
            console.log('🤖 Chatbot response:', data);
            const aiMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: data.response,
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('❌ Chatbot error:', error);
            const errorMsg: Message = {
                id: (Date.now() + 1).toString(),
                text: t('chatbot.error'),
                sender: 'ai',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={`fixed bottom-8 ${isRTL ? 'left-8' : 'right-8'} z-50 flex flex-col items-end`}>
            {/* Chat Window */}
            {isOpen && (
                <div className={`w-[350px] md:w-[400px] h-[500px] bg-zinc-950/80 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl mb-4 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300 ${isRTL ? 'font-urdu' : ''}`}>
                    {/* Header */}
                    <div className="p-6 border-bottom border-white/5 bg-white/5 flex items-center justify-between">
                        <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                                </svg>
                            </div>
                            <div className={isRTL ? 'text-right' : 'text-left'}>
                                <h3 className="text-sm font-black text-white uppercase tracking-widest">{t('chatbot.title')}</h3>
                                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-tighter">{t('chatbot.status_online')}</p>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white transition-colors">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l18 18" />
                            </svg>
                        </button>
                    </div>

                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                        {messages.map((msg) => (
                            <div key={msg.id} className={`flex ${msg.sender === 'user' ? (isRTL ? 'justify-start' : 'justify-end') : (isRTL ? 'justify-end' : 'justify-start')}`}>
                                <div className={`max-w-[80%] p-4 rounded-3xl text-sm font-medium leading-relaxed ${msg.sender === 'user'
                                    ? 'bg-white text-zinc-950 rounded-tr-none'
                                    : 'bg-zinc-800 text-white/90 rounded-tl-none'
                                    } ${isRTL ? 'text-right' : 'text-left'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className={`flex ${isRTL ? 'justify-end' : 'justify-start'}`}>
                                <div className="bg-zinc-800 p-4 rounded-3xl rounded-tl-none flex gap-1 items-center">
                                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '200ms' }} />
                                    <div className="w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '400ms' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSend} className="p-6 border-t border-white/5 bg-white/5">
                        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <input
                                type="text"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t('chatbot.placeholder')}
                                className={`flex-1 bg-zinc-900 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                            />
                            <button
                                type="submit"
                                disabled={isLoading || !inputText.trim()}
                                className="w-12 h-12 bg-white text-zinc-950 rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shrink-0"
                            >
                                <svg className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Toggle Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 bg-gradient-to-br from-emerald-500 to-cyan-600 rounded-full shadow-2xl flex items-center justify-center text-white hover:scale-110 active:scale-90 transition-all group relative`}
            >
                <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-20 group-hover:block hidden" />
                {isOpen ? (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                ) : (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
