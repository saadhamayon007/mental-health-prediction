import React from 'react';
import { PredictionResult } from '@/lib/api';

interface ResultCardProps {
    result: PredictionResult;
    onReset: () => void;
}

export default function ResultCard({ result, onReset }: ResultCardProps) {
    const isHighRisk = result.prediction === 1;

    return (
        <div className="w-full max-w-md mx-auto p-6 bg-white dark:bg-zinc-800 rounded-xl shadow-xl border border-zinc-200 dark:border-zinc-700 animate-in fade-in zoom-in duration-500">
            <h2 className="text-2xl font-bold text-center mb-6 text-zinc-800 dark:text-zinc-100">Assessment Result</h2>

            <div className="flex flex-col items-center justify-center mb-8">
                <div className={`relative w-40 h-40 rounded-full flex items-center justify-center border-8 ${isHighRisk ? 'border-red-500/20' : 'border-green-500/20'}`}>
                    <div className={`absolute inset-0 rounded-full border-8 ${isHighRisk ? 'border-red-500' : 'border-green-500'} border-t-transparent animate-spin-slow`} />
                    <div className="text-center">
                        <span className={`text-3xl font-bold ${isHighRisk ? 'text-red-500' : 'text-green-500'}`}>
                            {result.risk_level}
                        </span>
                        <p className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Risk Level</p>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <p className="text-center text-zinc-600 dark:text-zinc-300">
                    Based on the analysis of your provided data, the model predicts a
                    <span className={`font-semibold ${isHighRisk ? 'text-red-600' : 'text-green-600'}`}>
                        {' '}{Math.round(result.probability * 100)}% probability
                    </span> of potential depression risk.
                </p>

                {isHighRisk && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-100 dark:border-red-900/50">
                        <p className="text-sm text-red-800 dark:text-red-200 font-medium flex items-center gap-2">
                            ⚠️ Recommendation
                        </p>
                        <p className="text-sm text-red-600 dark:text-red-300 mt-1">
                            Please consider consulting with a mental health professional for a proper clinical assessment.
                        </p>
                    </div>
                )}
            </div>

            <button
                onClick={onReset}
                className="w-full py-3 px-4 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg transition-colors font-medium dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900"
            >
                Start New Assessment
            </button>
        </div>
    );
}
