'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Language } from '@/lib/translations';

const languages: { code: Language; name: string; flag: string; label: string }[] = [
    { code: 'en', name: 'English', flag: 'GB', label: 'English' },
    { code: 'de', name: 'Deutsch', flag: 'DE', label: 'German' },
    { code: 'ur', name: 'اردو', flag: 'PK', label: 'Urdu' }
];

export default function LanguageSwitcher() {
    const { language, setLanguage, isRTL } = useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const currentLang = languages.find(l => l.code === language) || languages[0];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-all text-white font-bold text-sm min-w-[120px]"
            >
                <span className="text-[10px] opacity-40 uppercase font-black">{currentLang.flag}</span>
                <span className="flex-1 text-left">{currentLang.name}</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-4 w-4 opacity-40 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className={`absolute top-full mt-2 w-48 bg-zinc-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200 ${isRTL ? 'left-0' : 'right-0'}`}>
                    <div className="py-2">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setLanguage(lang.code);
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-5 py-3 hover:bg-white/5 transition-colors text-left ${language === lang.code ? 'text-blue-400 bg-white/5' : 'text-white/70'
                                    }`}
                            >
                                <span className="text-[10px] opacity-40 uppercase font-black w-6">{lang.flag}</span>
                                <span className={`font-bold text-sm ${lang.code === 'ur' ? 'font-urdu' : ''}`}>{lang.name}</span>
                                {language === lang.code && (
                                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-400" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
