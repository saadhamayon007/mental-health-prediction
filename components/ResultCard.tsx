import React, { useMemo } from 'react';
import { PredictionResult, PredictionInput } from '@/lib/api';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

interface ResultCardProps {
    result: PredictionResult;
    formData: PredictionInput;
    onReset: () => void;
}

export default function ResultCard({ result, formData, onReset }: ResultCardProps) {
    const { t, isRTL } = useLanguage();
    const isHighRisk = result.prediction === 1;
    const probability = result.probability * 100;

    // Generate static clinical metadata
    const clinicalId = useMemo(() => `MH-${Math.random().toString(36).substr(2, 9).toUpperCase()}`, []);
    const timestamp = useMemo(() => new Date().toLocaleString(), []);

    // Radial Gauge Calculations
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (probability / 100) * circumference;

    // Categorized Impact Data
    const impactScores = useMemo(() => [
        { label: t('support.results.academic'), score: (formData.academic_pressure / 5) * 100, color: 'bg-blue-500' },
        { label: t('support.results.financial'), score: (formData.financial_stress / 5) * 100, color: 'bg-purple-500' },
        { label: t('support.results.lifestyle'), score: (formData.sleep_duration.includes('Less') ? 90 : 30), color: 'bg-pink-500' }
    ], [formData, t]);

    const handleDownload = () => {
        window.print();
    };

    return (
        <div className="glass-card w-full max-w-4xl mx-auto p-1 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <div className="p-8 md:p-14">

                {/* Clinical Header */}
                <div className={`flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 pb-8 border-b border-white/5 ${isRTL ? 'md:flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h2 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
                            {t('support.results.wellness_score')}
                        </h2>
                        <div className={`flex gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <span>{t('support.results.reference_id')}: <span className="text-white/60">{clinicalId}</span></span>
                            <span className="w-px h-3 bg-white/10" />
                            <span>{t('support.results.timestamp')}: <span className="text-white/60">{timestamp}</span></span>
                        </div>
                    </div>
                    <div className="px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-widest animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                        Neural Engine Active
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-16">
                    {/* Visual Gauge Component */}
                    <div className="flex justify-center relative">
                        <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full" />
                        <svg className="w-64 h-64 transform -rotate-90 relative z-10">
                            {/* Background Circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                stroke="currentColor"
                                strokeWidth="20"
                                fill="transparent"
                                className="text-white/5"
                            />
                            {/* Progress Circle */}
                            <circle
                                cx="128"
                                cy="128"
                                r={radius}
                                stroke={isHighRisk ? '#ef4444' : '#3b82f6'}
                                strokeWidth="20"
                                strokeDasharray={circumference}
                                strokeDashoffset={offset}
                                strokeLinecap="round"
                                fill="transparent"
                                className="transition-all duration-[2000ms] ease-out drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                                style={{
                                    stroke: isHighRisk ? '#ef4444' : '#3b82f6',
                                    filter: `drop-shadow(0 0 12px ${isHighRisk ? '#ef444488' : '#3b82f688'})`
                                }}
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                            <span className="text-6xl font-black text-white tracking-tighter text-glow-blue">
                                {Math.round(probability)}%
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                                Risk Indices
                            </span>
                        </div>
                    </div>

                    {/* Impact Analysis Charts */}
                    <div className="space-y-8">
                        <div>
                            <h3 className={`text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-8 ${isRTL ? 'text-right' : ''}`}>
                                {t('support.results.impact_analysis')}
                            </h3>
                            <div className="space-y-6">
                                {impactScores.map((impact, idx) => (
                                    <div key={idx} className="space-y-3">
                                        <div className={`flex justify-between text-[10px] font-black uppercase tracking-[0.2em] ${isRTL ? 'flex-row-reverse' : ''}`}>
                                            <span className="text-white/40">{impact.label}</span>
                                            <span className="text-white">{Math.round(impact.score)}%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${impact.color} transition-all duration-[1500ms] ease-out shadow-[0_0_10px_rgba(255,255,255,0.1)]`}
                                                style={{ width: `${impact.score}%` }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {/* Print-only CSS */}
                <style jsx global>{`
                    @media print {
                        nav, header, footer, .no-print {
                            display: none !important;
                        }
                        body {
                            background: white !important;
                            color: black !important;
                        }
                        .glass-card {
                            border: none !important;
                            box-shadow: none !important;
                            background: white !important;
                            margin: 0 !important;
                            padding: 0 !important;
                        }
                        .text-white { color: #000 !important; }
                        .text-white\\/40 { color: #666 !important; }
                        .text-white\\/30 { color: #999 !important; }
                        .text-glow-blue { text-shadow: none !important; }
                        .bg-white\\/5 { background: #f3f4f6 !important; }
                    }
                `}</style>


                {/* Clinical Interpretation */}
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 border border-white/5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">
                            {t('support.results.clinical_note')}
                        </h3>
                    </div>
                    <div className={`p-10 rounded-[2.5rem] border bg-zinc-950/20 backdrop-blur-3xl ${isHighRisk ? 'border-red-500/20' : 'border-blue-500/20'
                        } shadow-2xl shadow-black/50 transition-all duration-1000`}>
                        <p className={`text-xl md:text-2xl font-bold leading-relaxed italic ${isHighRisk ? 'text-red-200/80' : 'text-blue-100/80'
                            } ${isRTL ? 'text-right' : ''}`}>
                            "{result.message || (isHighRisk
                                ? "Patterns observed in your biometric and lifestyle data suggest significant cognitive strain. Early intervention and environmental adjustments are statistically recommended."
                                : "The stochastic profile of your reports indicates high mental resilience. Current lifestyle patterns are highly effective in mitigating environmental stressors.")}"
                        </p>
                    </div>

                    {/* Personalized Recommendations */}
                    {result.recommendations && result.recommendations.length > 0 && (
                        <div className="mt-12">
                            <h3 className={`text-xs font-black text-white/40 uppercase tracking-[0.2em] mb-6 ${isRTL ? 'text-right' : ''}`}>
                                💡 Personalized Recommendations
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.recommendations.map((rec, idx) => (
                                    <div
                                        key={idx}
                                        className={`p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300 ${isRTL ? 'text-right' : 'text-left'}`}
                                    >
                                        <p className="text-sm text-white/80 font-medium leading-relaxed">
                                            {rec}
                                        </p>
                                    </div>
                                ))}
                            </div>
                            {result.support_message && (
                                <div className={`mt-6 p-6 rounded-2xl bg-gradient-to-r ${isHighRisk ? 'from-red-500/10 to-orange-500/10 border-red-500/20' : 'from-blue-500/10 to-green-500/10 border-blue-500/20'} border backdrop-blur-sm`}>
                                    <p className={`text-base text-white/90 font-semibold text-center ${isRTL ? 'text-right' : ''}`}>
                                        💚 {result.support_message}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Professional Action Footer */}
                <div className="mt-12 flex flex-col gap-8">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 no-print">
                        <button
                            onClick={onReset}
                            className="premium-button-outline"
                        >
                            Execute New Session
                        </button>
                        <button
                            onClick={handleDownload}
                            className="premium-button !bg-emerald-600 !text-white shadow-[0_0_30px_rgba(16,185,129,0.3)]"
                        >
                            {t('support.results.download_report')}
                        </button>
                        <Link
                            href="/support"
                            className="premium-button !bg-blue-600 !text-white shadow-[0_0_30px_rgba(37,99,235,0.3)]"
                        >
                            Get Professional Support
                        </Link>
                    </div>

                    <p className={`text-[9px] text-white/20 font-black uppercase tracking-[0.3em] text-center max-w-2xl mx-auto leading-relaxed`}>
                        {t('support.results.professional_disclaimer')}
                    </p>
                </div>

            </div>
        </div>
    );
}
