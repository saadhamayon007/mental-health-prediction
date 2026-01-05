'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function AboutPage() {
    const { t, isRTL } = useLanguage();

    return (
        <main className={`min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4 ${isRTL ? 'font-urdu' : ''}`}>
            <div className="max-w-4xl mx-auto">
                <div className={`mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700 ${isRTL ? 'text-right' : 'text-left'}`}>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
                        {t('about.title_part1')} <span className="text-blue-500">{t('about.title_part2')}</span>
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed font-medium">
                        {t('about.description')}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-20">
                    <div className={`p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400 text-2xl ${isRTL ? 'mr-0 ml-auto' : ''}`}>🤖</div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{t('about.model_title')}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            {t('about.model_desc')}
                        </p>
                    </div>

                    <div className={`p-8 bg-zinc-900/50 border border-white/5 rounded-[2.5rem] space-y-4 ${isRTL ? 'text-right' : 'text-left'}`}>
                        <div className={`w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center text-purple-400 text-2xl ${isRTL ? 'mr-0 ml-auto' : ''}`}>📊</div>
                        <h3 className="text-2xl font-black uppercase tracking-tight">{t('about.data_title')}</h3>
                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                            {t('about.data_desc')}
                        </p>
                    </div>
                </div>

                <div className="space-y-12 mb-20">
                    <h2 className={`text-3xl font-black uppercase tracking-tighter ${isRTL ? 'text-right' : 'text-left'}`}>{t('about.stack_title')}</h2>
                    <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${isRTL ? 'grid-flow-row-dense' : ''}`}>
                        {[
                            { name: "Next.js 14", type: "Frontend" },
                            { name: "FastAPI", type: "Backend" },
                            { name: "Scikit-Learn", type: "AI Engine" },
                            { name: "Tailwind CSS", type: "Styling" }
                        ].map(tech => (
                            <div key={tech.name} className="p-6 bg-white/5 border border-white/5 rounded-2xl text-center">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-1">{tech.type}</p>
                                <p className="font-bold text-white">{tech.name}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-center">
                    <Link
                        href="/predict"
                        className="px-12 py-5 bg-white text-zinc-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all shadow-2xl shadow-blue-500/10 uppercase tracking-widest text-sm"
                    >
                        {t('about.cta')}
                    </Link>
                </div>
            </div>
        </main>
    );
}
