import React from 'react';
import { PredictionResult } from '@/lib/api';

import Link from 'next/link';

interface ResultCardProps {
    result: PredictionResult;
    onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
    const isHighRisk = result.prediction === 1;

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold text-center mb-6 text-white">Step 5: Final Prediction</h2>

            <div className="flex flex-col items-center justify-center mb-8">
                <div className={`relative w-48 h-48 rounded-full flex items-center justify-center border-8 ${isHighRisk ? 'border-red-500/30' : 'border-green-500/30'}`}>
                    <div className={`absolute inset-0 rounded-full border-8 ${isHighRisk ? 'border-red-400' : 'border-green-400'} border-t-transparent animate-spin-slow`} />
                    <div className="text-center">
                        <span className={`text-4xl font-black ${isHighRisk ? 'text-red-400' : 'text-green-400'} drop-shadow-sm`}>
                            {result.risk_level}
                        </span>
                        <p className="text-sm text-white/80 uppercase tracking-wider mt-2 font-semibold">Risk Predicted</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <div className="bg-white/20 p-4 rounded-xl text-center border border-white/10">
                    <p className="text-sm text-white/80 mb-1">AI Model Confidence</p>
                    <p className="text-3xl font-bold text-white">{Math.round(result.probability * 100)}%</p>
                    <p className="text-xs text-white/60">Probability of Depression Risk</p>
                </div>

                <p className="text-center text-white/90 text-sm leading-relaxed">
                    Based on the analysis of your lifestyle and academic patterns, the deep learning model has generated this assessment.
                </p>

                <div className="bg-white/10 p-5 rounded-2xl border border-white/20">
                    <p className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                        <span>📝</span> Assessment Summary
                    </p>
                    <p className="text-sm text-white/90 leading-relaxed italic">
                        {isHighRisk
                            ? "Your results indicate potential symptoms of depression. We recommend seeking professional support to effectively manage these feelings and explore helpful strategies. Remember, you're not alone, and help is available."
                            : "Based on your assessment, your mental health appears to be in a healthy range. Continue prioritizing your well-being through positive habits, self-care, and meaningful connections. We're here if you ever need another check-in."
                        }
                    </p>
                </div>

                {isHighRisk && (
                    <div className="bg-red-500/20 p-4 rounded-xl border border-red-500/30">
                        <p className="text-sm text-red-100 font-bold flex items-center gap-2 mb-1">
                            ⚠️ Professional Recommendation
                        </p>
                        <p className="text-sm text-white/90">
                            Please consider consulting with a mental health professional for a proper clinical assessment.
                        </p>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-3">
                <button
                    onClick={onReset}
                    className="w-full py-3.5 px-4 bg-white hover:bg-white/90 text-purple-600 rounded-xl transition-all font-bold shadow-lg hover:scale-[1.02]"
                >
                    Start New Assessment
                </button>
                <Link
                    href="/"
                    className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all font-semibold text-center border border-white/20"
                >
                    Finish & Back to Home
                </Link>
            </div>
        </div>
    );
}
