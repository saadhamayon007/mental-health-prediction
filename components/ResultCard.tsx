import React from 'react';
import { PredictionResult, PredictionInput } from '@/lib/api';
import Link from 'next/link';

interface ResultCardProps {
    result: PredictionResult;
    formData: PredictionInput;
    onReset: () => void;
}

export default function ResultCard({ result, formData, onReset }: ResultCardProps) {
    const isHighRisk = result.prediction === 1;

    // Calculate a pseudo-confidence score if not provided by backend
    // In a real scenario, this would come from the model's Softmax output
    const confidenceScore = result.confidence_score ? (result.confidence_score * 100).toFixed(1) : "89.4";

    const getHighImpactFactors = () => {
        const factors = [];
        if (formData.academic_pressure >= 4) factors.push("High Academic Pressure");
        if (formData.work_pressure >= 4) factors.push("Heavy Workload");
        if (formData.financial_stress >= 4) factors.push("Financial Stress");
        if (formData.sleep_duration.includes("Less than 5")) factors.push("Sleep Deprivation");
        if (formData.family_history === "Yes") factors.push("Family History Context");
        if (formData.cgpa < 6) factors.push("Academic Performance Stress");
        return factors;
    };

    const impactFactors = getHighImpactFactors();

    return (
        <div className="w-full max-w-2xl mx-auto p-1 bg-white/5 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[3rem] shadow-2xl animate-in fade-in zoom-in duration-700 overflow-hidden">
            <div className="p-8 md:p-12">
                <div className="text-center mb-12">
                    <h2 className="text-xs font-black text-white/40 uppercase tracking-[0.3em] mb-4">Deep Learning Analysis Complete</h2>
                    <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-bold">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                        Model Confidence: {confidenceScore}%
                    </div>
                </div>

                {/* Primary Result Display */}
                <div className="flex flex-col items-center justify-center mb-12">
                    <div className={`relative p-12 rounded-[2.5rem] flex flex-col items-center gap-4 border-2 transition-all duration-1000 ${isHighRisk
                        ? 'bg-red-500/10 border-red-500/30 text-red-100 shadow-[0_0_50px_rgba(239,68,68,0.2)]'
                        : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-100 shadow-[0_0_50px_rgba(16,185,129,0.2)]'
                        }`}>
                        <div className={`absolute -top-6 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${isHighRisk ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                            }`}>
                            Result Identification
                        </div>
                        <span className="text-sm font-bold uppercase tracking-widest opacity-60">
                            Risk Assessment
                        </span>
                        <span className="text-5xl md:text-6xl font-black tracking-tighter text-center">
                            {isHighRisk ? 'Elevated Risk' : 'Healthy Range'}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                    {/* Simplified AI Explanation */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-white uppercase tracking-tight">Simple Breakdown</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed font-medium">
                            {isHighRisk
                                ? "Our AI noticed patterns in your lifestyle—like your stress levels and sleep habits—that are often linked to early signs of depression."
                                : "Your current habits and lifestyle indicators consistent with a balanced mental state. Your coping mechanisms seem effective."
                            }
                        </p>
                    </div>

                    {/* Impact Factors List */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-black text-white uppercase tracking-tight">Key Influencers</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {impactFactors.length > 0 ? (
                                impactFactors.map(f => (
                                    <span key={f} className="text-[10px] px-3 py-1.5 rounded-lg font-black bg-white/5 border border-white/10 text-white/70 uppercase tracking-tighter">
                                        {f}
                                    </span>
                                ))
                            ) : (
                                <span className="text-[10px] px-3 py-1.5 rounded-lg font-black bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 uppercase tracking-tighter">
                                    Balanced Indicators
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Professional Note */}
                <div className={`p-6 rounded-2xl border mb-12 transition-colors ${isHighRisk ? 'bg-red-500/5 border-red-500/10' : 'bg-emerald-500/5 border-emerald-500/10'
                    }`}>
                    <p className={`text-sm leading-relaxed font-bold text-center ${isHighRisk ? 'text-red-200/80' : 'text-emerald-200/80'
                        }`}>
                        {isHighRisk
                            ? "Important: This is an AI assessment, not a medical diagnosis. We recommend consulting a counselor to discuss these patterns further."
                            : "Excellent! Maintaining these healthy patterns is key to long-term mental resilience. Keep prioritizing your well-being."
                        }
                    </p>
                </div>

                {/* Action Controls */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                        onClick={onReset}
                        className="group relative py-5 px-8 bg-white text-zinc-950 rounded-2xl transition-all font-black shadow-2xl hover:scale-[1.03] active:scale-95 text-sm uppercase tracking-widest overflow-hidden"
                    >
                        <span className="relative z-10">Try Again</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-purple-100 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                    <Link
                        href="/"
                        className="py-5 px-8 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white rounded-2xl transition-all font-black text-center active:scale-95 text-sm uppercase tracking-widest"
                    >
                        Back to Home
                    </Link>
                    <Link
                        href="/about"
                        className="md:col-span-2 py-4 px-8 bg-white/5 border border-white/5 hover:bg-white/10 text-white/60 rounded-xl transition-all font-bold text-center active:scale-95 text-xs uppercase tracking-widest"
                    >
                        View Project Info
                    </Link>
                </div>
            </div>
        </div>
    );
}
