'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import NewsSection from '@/components/NewsSection';
import SearchBar from '@/components/SearchBar';
import { useLanguage } from '@/context/LanguageContext';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
    const { t, isRTL } = useLanguage();

    const checkApi = async () => {
        try {
            const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const res = await fetch(baseUrl, { method: 'GET' });
            if (res.ok) setApiStatus('online');
            else setApiStatus('offline');
        } catch {
            setApiStatus('offline');
        }
    };

    useEffect(() => {
        checkApi();
    }, []);

    const features = [
        { title: t('home.features.dl.title'), desc: t('home.features.dl.desc'), icon: "🧠" },
        { title: t('home.features.privacy.title'), desc: t('home.features.privacy.desc'), icon: "🛡️" },
        { title: t('home.features.insights.title'), desc: t('home.features.insights.desc'), icon: "⚡" }
    ];

    return (
        <main className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 transition-colors duration-500 ${isRTL ? 'text-right' : 'text-left'}`}>
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute -top-[10%] ${isRTL ? '-right-[10%]' : '-left-[10%]'} w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px] animate-pulse`} />
                <div className={`absolute top-[20%] ${isRTL ? '-left-[10%]' : '-right-[10%]'} w-[35%] h-[35%] bg-purple-500/10 rounded-full blur-[120px] animate-pulse delay-700`} />
            </div>

            <div className="relative pt-32 pb-12 px-4">
                {/* Hero Section */}
                <div className="max-w-5xl mx-auto text-center mb-20 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    <div className="flex flex-col items-center gap-6 mb-8">
                        <div className={`flex justify-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 text-xs font-bold tracking-wider uppercase border border-blue-200/50 dark:border-blue-800/30 backdrop-blur-sm">
                                {t('home.system_name')}
                            </div>
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase border backdrop-blur-sm transition-all duration-500 ${apiStatus === 'online'
                                ? 'bg-emerald-100/50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 border-emerald-200/50 dark:border-emerald-800/30'
                                : apiStatus === 'offline'
                                    ? 'bg-red-100/50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200/50 dark:border-red-800/30'
                                    : 'bg-zinc-100/50 dark:bg-zinc-800/20 text-zinc-500 animate-pulse border-zinc-200/50'
                                }`}>
                                <span className={`w-1.5 h-1.5 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]' :
                                    apiStatus === 'offline' ? 'bg-red-500' : 'bg-zinc-400'
                                    }`} />
                                {apiStatus === 'online' ? t('home.api_online') : apiStatus === 'offline' ? t('home.api_offline') : t('home.api_checking')}
                            </div>
                        </div>
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tight leading-[1.1]">
                        <span className="block text-zinc-900 dark:text-white">{t('home.title_part1')}</span>
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-violet-600 to-purple-600 animate-gradient-x">
                            {t('home.title_part2')}
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
                        {t('home.subtitle')}
                    </p>

                    <div className={`flex flex-col md:flex-row items-center justify-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link
                            href="/predict"
                            className="group relative px-10 py-5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-950 font-bold rounded-2xl transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-blue-500/20 overflow-hidden"
                        >
                            <span className={`relative z-10 flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {t('home.cta_start')}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </Link>

                        <Link
                            href="/about"
                            className="px-10 py-5 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white font-bold rounded-2xl border border-zinc-200 dark:border-zinc-800 transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800/50 hover:scale-105 active:scale-95 shadow-xl"
                        >
                            {t('home.cta_how')}
                        </Link>
                    </div>
                </div>

                {/* Features Highlight */}
                <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-24 ${isRTL ? 'rtl' : ''}`}>
                    {features.map((feature, i) => (
                        <div key={i} className={`p-8 bg-white/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-zinc-200/50 dark:border-zinc-800/50 rounded-3xl hover:border-blue-500/50 transition-all group ${isRTL ? 'text-right' : 'text-left'}`}>
                            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
                            <h3 className="text-xl font-bold mb-2 text-zinc-900 dark:text-white uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm font-medium">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Content Section */}
                <div className="max-w-7xl mx-auto">
                    <div className={`flex flex-col md:flex-row items-center justify-between mb-12 gap-8 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                        <h2 className="text-3xl font-black text-zinc-900 dark:text-white">{t('home.landscape')}</h2>
                        <div className="w-full max-w-md">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                    <NewsSection searchQuery={searchQuery} />
                </div>
            </div>
        </main>
    );
}
