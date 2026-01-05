'use client';

import React, { useEffect, useState } from 'react';

interface HistoryItem {
    id: string;
    date: string;
    risk_level: string;
    age: number;
    profession: string;
}

export default function HistoryTable() {
    const [history, setHistory] = useState<HistoryItem[]>([]);

    useEffect(() => {
        const savedHistory = localStorage.getItem('assessment_history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
    }, []);

    const clearHistory = () => {
        if (confirm('Are you sure you want to delete all past results?')) {
            localStorage.removeItem('assessment_history');
            setHistory([]);
        }
    };

    if (history.length === 0) return null;

    return (
        <section className="mt-12 w-full max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white">Your Past Assessments</h2>
                <button
                    onClick={clearHistory}
                    className="text-xs font-semibold text-white/50 hover:text-red-400 transition-colors underline underline-offset-4"
                >
                    Clear All
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-white/10">
                            <th className="py-4 px-2 text-xs font-bold text-white/50 uppercase tracking-widest">Date</th>
                            <th className="py-4 px-2 text-xs font-bold text-white/50 uppercase tracking-widest">Category</th>
                            <th className="py-4 px-2 text-xs font-bold text-white/50 uppercase tracking-widest">Age</th>
                            <th className="py-4 px-2 text-xs font-bold text-white/50 uppercase tracking-widest text-right">Result</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {history.map((item) => (
                            <tr key={item.id} className="group hover:bg-white/5 transition-colors">
                                <td className="py-4 px-2 text-sm text-white/90">
                                    {new Date(item.date).toLocaleDateString()}
                                </td>
                                <td className="py-4 px-2 text-sm text-white/90">
                                    {item.profession} Assessment
                                </td>
                                <td className="py-4 px-2 text-sm text-white/90">
                                    {item.age}
                                </td>
                                <td className="py-4 px-2 text-right">
                                    <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase border ${item.risk_level === 'High'
                                            ? 'bg-red-500/20 border-red-500/30 text-red-200'
                                            : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-200'
                                        }`}>
                                        {item.risk_level} Risk
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <p className="mt-6 text-[10px] text-white/40 text-center italic">
                These results are saved locally in your browser for privacy.
            </p>
        </section>
    );
}
