'use client';

import React from 'react';
import SleepForm from '@/components/SleepForm';
import MindfulMoments from '@/components/MindfulMoments';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';

export default function SleepPage() {
    const { t, isRTL } = useLanguage();

    return (
        <main className={`min-h-screen bg-zinc-950 text-white pt-32 pb-20 px-4 ${isRTL ? 'font-urdu' : ''}`}>
            {/* Ambient Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className={`absolute top-0 ${isRTL ? '-right-[10%]' : '-left-[10%]'} w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]`} />
                <div className={`absolute bottom-0 ${isRTL ? '-left-[10%]' : '-right-[10%]'} w-[35%] h-[35%] bg-cyan-500/10 rounded-full blur-[120px]`} />
            </div>

            <div className="relative max-w-4xl mx-auto space-y-20">
                <div className={isRTL ? 'text-right' : 'text-left'}>
                    <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest flex items-center gap-2 mb-8">
                        {isRTL ? '← ' + t('auth.back_home') : '← ' + t('auth.back_home')}
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter uppercase leading-tight">
                        {t('home.sleep_analysis.title')}
                    </h1>
                    <p className="text-xl text-zinc-400 leading-relaxed font-medium max-w-2xl">
                        {t('home.sleep_analysis.description')}
                    </p>
                </div>

                <div className="animate-in fade-in slide-in-from-bottom-12 duration-1000">
                    <SleepForm />
                </div>

                <div className="pt-20 border-t border-white/5">
                    <MindfulMoments />
                </div>
            </div>
        </main>
    );
}
