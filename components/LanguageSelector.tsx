'use client';

import React, { useState } from 'react';

const languages = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' }
];

export default function LanguageSelector() {
    const [selectedLang, setSelectedLang] = useState(languages[0]);
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-lg shadow-sm hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors"
            >
                <span className="text-lg">{selectedLang.flag}</span>
                <span className="text-sm font-medium text-zinc-700 dark:text-zinc-200">{selectedLang.name}</span>
                <svg className={`w-4 h-4 text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1">
                        {languages.map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => {
                                    setSelectedLang(lang);
                                    setIsOpen(false);
                                }}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center gap-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 transition-colors ${selectedLang.code === lang.code ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300' : 'text-zinc-700 dark:text-zinc-200'}`}
                            >
                                <span className="text-lg">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
