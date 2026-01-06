'use client';

import Link from "next/link";
import { useState, useEffect } from 'react';
import NewsSection from '@/components/NewsSection';
import SearchBar from '@/components/SearchBar';
import MoodTracker from '@/components/MoodTracker';
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
        <main className={`min-h-screen transition-colors duration-500 ${isRTL ? 'text-right' : 'text-left'}`}>
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
                            <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase border backdrop-blur-3xl transition-all duration-500 ${apiStatus === 'online'
                                ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                                : apiStatus === 'offline'
                                    ? 'bg-red-500/10 text-red-500 border-red-500/20'
                                    : 'bg-white/5 text-white/40 animate-pulse border-white/5'
                                }`}>
                                <span className={`w-2 h-2 rounded-full ${apiStatus === 'online' ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]' :
                                    apiStatus === 'offline' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.8)]' : 'bg-white/20'
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
                            className="premium-button !px-12 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
                        >
                            <span className={`relative z-10 flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                {t('home.cta_start')}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRTL ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </span>
                        </Link>

                        <Link
                            href="/about"
                            className="premium-button-outline !px-12"
                        >
                            {t('home.cta_how')}
                        </Link>
                    </div>
                </div>

                {/* Features Highlight */}
                <div className={`max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 mb-32 ${isRTL ? 'rtl' : ''}`}>
                    {features.map((feature, i) => (
                        <div key={i} className="glass-card p-10 hover:border-blue-500/30 group">
                            <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500">{feature.icon}</div>
                            <h3 className="text-xl font-black mb-3 text-white uppercase tracking-tight">{feature.title}</h3>
                            <p className="text-white/40 leading-relaxed text-sm font-bold uppercase tracking-widest">{feature.desc}</p>
                        </div>
                    ))}
                </div>

                {/* Sleep Pattern Analysis Section */}
                <div className="max-w-7xl mx-auto mb-24">
                    <div className="relative group">
                        {/* Glow effect */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500 to-emerald-500 rounded-[2.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                        <div className={`relative p-8 md:p-12 glass-card !rounded-[3rem] border-white/5 flex flex-col md:flex-row items-center gap-12 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
                            <div className="w-full md:w-1/2 space-y-8">
                                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse justify-start' : 'justify-start'}`}>
                                    <div className="w-12 h-12 glass-card !rounded-2xl flex items-center justify-center text-blue-400 text-2xl shadow-[0_0_20px_rgba(59,130,246,0.2)]">🌙</div>
                                    <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase">
                                        {t('home.sleep_analysis.title')}
                                    </h2>
                                </div>
                                <p className="text-lg text-white/40 leading-relaxed font-bold uppercase tracking-widest">
                                    {t('home.sleep_analysis.description')}
                                </p>
                                <div className={`pt-6 ${isRTL ? 'text-right' : 'text-left'}`}>
                                    <Link
                                        href="/sleep"
                                        className="premium-button !bg-blue-600 !text-white !px-10 shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                                    >
                                        <span className={isRTL ? 'order-2' : 'order-1'}>{t('home.sleep_analysis.button')}</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${isRTL ? 'rotate-180 order-1' : 'order-2'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                            <div className="w-full md:w-1/2 relative h-64 md:h-96 rounded-[2.5rem] overflow-hidden glass-card !border-white/5">
                                <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-3xl flex items-center justify-center">
                                    <div className="relative">
                                        <div className="w-32 h-32 md:w-64 md:h-64 bg-blue-500/10 rounded-full animate-pulse-soft absolute inset-0 blur-3xl"></div>
                                        <div className="w-32 h-32 md:w-56 md:h-56 glass-card !rounded-full flex items-center justify-center text-6xl md:text-8xl shadow-[0_0_100px_rgba(59,130,246,0.3)]">
                                            🛌
                                        </div>
                                    </div>
                                </div>
                                {/* Decorative elements */}
                                <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-twinkle"></div>
                                <div className="absolute bottom-10 left-16 w-1.5 h-1.5 bg-blue-400 rounded-full animate-twinkle delay-500"></div>
                                <div className="absolute top-1/2 left-10 w-1 h-1 bg-white rounded-full animate-twinkle delay-1000"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Daily Mood Tracker Section */}
                <div className="max-w-7xl mx-auto mb-24">
                    <MoodTracker />
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
