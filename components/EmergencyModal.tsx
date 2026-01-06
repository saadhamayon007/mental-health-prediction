'use client';

import React from 'react';
import { useLanguage } from '@/context/LanguageContext';

interface EmergencyModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function EmergencyModal({ isOpen, onClose }: EmergencyModalProps) {
    const { t, isRTL } = useLanguage();
    const [selectedCountry, setSelectedCountry] = React.useState('Pakistan');

    if (!isOpen) return null;

    const countryData: Record<string, { police: string, ambulance: string, crisis: string }> = {
        'Pakistan': { police: '15', ambulance: '1122', crisis: '0311-7786264' },
        'Germany': { police: '110', ambulance: '112', crisis: '0800 1110111' },
        'United Kingdom': { police: '999', ambulance: '999', crisis: '116 123' },
        'United States': { police: '911', ambulance: '911', crisis: '988' }
    };

    const currentData = countryData[selectedCountry] || countryData['Pakistan'];

    const emergencyNumbers = [
        { label: t('support.emergency_modal.police'), number: currentData.police, icon: '🚓', color: 'bg-blue-600' },
        { label: t('support.emergency_modal.ambulance'), number: currentData.ambulance, icon: '🚑', color: 'bg-red-600' },
        { label: t('support.emergency_modal.crisis'), number: currentData.crisis, icon: '☎️', color: 'bg-zinc-700' }
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-zinc-950/90 backdrop-blur-xl animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className={`relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 fade-in duration-300 ${isRTL ? 'font-urdu' : ''}`}>
                <div className="p-8 md:p-10 text-center">
                    <div className="flex justify-center mb-6">
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-red-500 cursor-pointer"
                        >
                            {Object.keys(countryData).map(c => (
                                <option key={c} value={c} className="bg-zinc-900">{c}</option>
                            ))}
                        </select>
                    </div>

                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                        <span className="text-3xl">🚨</span>
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-white mb-3 tracking-tighter uppercase">
                        {t('support.emergency_modal.title')}
                    </h2>

                    <p className="text-zinc-400 text-sm font-medium leading-relaxed mb-8 max-w-xs mx-auto">
                        {t('support.emergency_modal.subtitle')}
                    </p>

                    <div className="space-y-3">
                        {emergencyNumbers.map((item, idx) => (
                            <a
                                key={idx}
                                href={`tel:${item.number}`}
                                className={`flex items-center justify-between p-5 rounded-2xl ${item.color} text-white hover:scale-[1.02] active:scale-95 transition-all shadow-xl group`}
                            >
                                <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                    <span className="text-xl">{item.icon}</span>
                                    <span className="font-black uppercase tracking-widest text-xs">{item.label}</span>
                                </div>
                                <span className="text-lg font-black tracking-widest">{item.number}</span>
                            </a>
                        ))}
                    </div>

                    <button
                        onClick={onClose}
                        className="mt-10 text-zinc-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors"
                    >
                        {t('support.emergency_modal.close')}
                    </button>
                </div>

                {/* Warning Border Decoration */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-orange-500 to-red-600" />
            </div>
        </div>
    );
}
