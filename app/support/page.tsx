'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { crisisResources, SupportResource } from '@/lib/crisis_data';
import SearchBar from '@/components/SearchBar';

export default function SupportPage() {
    const { t, isRTL, language } = useLanguage();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCountry, setSelectedCountry] = useState('all');

    // Extract unique countries from resources
    const allUniqueCountries = Array.from(new Set(crisisResources.flatMap(res => res.countries))).sort();

    const filteredResources = crisisResources.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            res.description[language as any]?.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesCountry = selectedCountry === 'all' ||
            res.countries.includes(selectedCountry);

        return matchesSearch && matchesCountry;
    });

    return (
        <main className={`min-h-screen transition-colors duration-500 pt-32 pb-24 px-4 ${isRTL ? 'text-right' : 'text-left'}`}>
            <div className="max-w-5xl mx-auto">
                {/* Header ... */}
                <div className="text-center mb-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">
                        {t('support.title')}
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                        {t('support.subtitle')}
                    </p>
                </div>

                {/* Immediate Danger Warning ... */}
                <div className="mb-16 p-10 glass-card bg-red-500/5 border-red-500/20 flex flex-col md:flex-row items-center gap-8 animate-in zoom-in duration-700 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
                    <div className="w-20 h-20 rounded-[2rem] bg-red-500 flex items-center justify-center text-white text-4xl shrink-0 animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.5)]">
                        ⚠️
                    </div>
                    <p className="text-red-200/90 font-black text-xl md:text-2xl text-center md:text-left leading-relaxed">
                        {t('support.warning')}
                    </p>
                </div>

                {/* Search and Filters */}
                <div className="mb-12 flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                        <SearchBar
                            value={searchQuery}
                            onChange={setSearchQuery}
                        />
                    </div>
                    <div className="md:w-72 relative">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="premium-input !py-4 appearance-none cursor-pointer pr-12"
                        >
                            <option value="all" className="bg-zinc-950">{t('support.all_countries')}</option>
                            {allUniqueCountries.map(country => (
                                <option key={country} value={country} className="bg-zinc-950">{country}</option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* Resources Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredResources.map((res) => (
                        <div key={res.id} className="p-10 glass-card hover:border-blue-500/30 group">
                            <div className={`flex justify-between items-start mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] ${res.category === 'emergency' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                            }`}>
                                            {res.category === 'emergency' ? 'Emergency' : 'Helpline'}
                                        </span>
                                        {res.countries.map(c => (
                                            <span key={c} className="px-4 py-1.5 glass-card !rounded-full text-[9px] text-white/40 font-black uppercase tracking-widest !border-white/5">
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-blue-400 transition-colors">{res.name}</h3>
                                </div>
                                <a
                                    href={`tel:${res.phone}`}
                                    className="w-14 h-14 rounded-2xl glass-card !border-white/5 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all duration-500"
                                >
                                    📞
                                </a>
                            </div>
                            <p className="text-white/40 font-bold uppercase tracking-widest text-xs leading-relaxed mb-8 italic">
                                "{res.description[language as any] || res.description.en}"
                            </p>
                            <a
                                href={`tel:${res.phone}`}
                                className="premium-button !py-4 !px-6 !text-[10px] !bg-white/5 !text-white border border-white/10 hover:!bg-white hover:!text-black"
                            >
                                <span className="flex items-center gap-2">
                                    {t('support.call_now')}: {res.phone}
                                    <span className={isRTL ? 'rotate-180' : ''}>→</span>
                                </span>
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
