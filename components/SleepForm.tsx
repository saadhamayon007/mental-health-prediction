'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { analyzeSleepPattern, SleepResult } from '@/lib/api';

export default function SleepForm() {
    const { t, isRTL } = useLanguage();
    const [formData, setFormData] = useState({
        avg_hours: '',
        quality: '',
        bedtime: '',
        wakeup: '',
        disturbances: '',
        tiredness: ''
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<SleepResult | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors: Record<string, string> = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (!value) {
                newErrors[key] = t('form.required');
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            setLoading(true);
            try {
                const sleepData = {
                    ...formData,
                    avg_hours: parseFloat(formData.avg_hours)
                };
                const res = await analyzeSleepPattern(sleepData);
                setResult(res);
            } catch (error) {
                console.error('Sleep Analysis Error:', error);
                setErrors({ submit: t('form.error_api') });
            } finally {
                setLoading(false);
            }
        }
    };

    // Color theme mapping for Tailwind class extraction
    const themeColors = {
        emerald: {
            bg: 'bg-emerald-500',
            bgSubtle: 'bg-emerald-500/10',
            bgMuted: 'bg-emerald-500/20',
            text: 'text-emerald-500',
            textMuted: 'text-emerald-400',
            border: 'border-emerald-500',
            shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.2)]'
        },
        amber: {
            bg: 'bg-amber-500',
            bgSubtle: 'bg-amber-500/10',
            bgMuted: 'bg-amber-500/20',
            text: 'text-amber-500',
            textMuted: 'text-amber-400',
            border: 'border-amber-500',
            shadow: 'shadow-[0_0_40px_rgba(245,158,11,0.2)]'
        },
        red: {
            bg: 'bg-red-500',
            bgSubtle: 'bg-red-500/10',
            bgMuted: 'bg-red-500/20',
            text: 'text-red-500',
            textMuted: 'text-red-400',
            border: 'border-red-500',
            shadow: 'shadow-[0_0_40px_rgba(239,68,68,0.2)]'
        }
    };

    if (result) {
        const theme = themeColors[result.color_theme as keyof typeof themeColors] || themeColors.emerald;
        return (
            <div className={`w-full max-w-4xl mx-auto animate-in zoom-in duration-500 ${isRTL ? 'font-urdu' : ''}`}>
                {/* Patient Sleep Report Header */}
                <div className={`mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 ${isRTL ? 'md:flex-row-reverse text-right' : 'text-left'}`}>
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase mb-2">
                            {t('sleep_form.report_title_part1')} <span className="text-emerald-500">{t('sleep_form.report_title_part2')}</span>
                        </h2>
                        <p className="text-white/40 font-bold uppercase tracking-widest text-xs border-l-2 border-emerald-500 pl-3">
                            Patient ID: SLEEP-{Math.floor(Math.random() * 10000)} • {new Date().toLocaleDateString()}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Score & Risk */}
                    <div className="lg:col-span-1 space-y-8">
                        {/* Score Card */}
                        <div className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem] relative overflow-hidden group">
                            <div className={`absolute top-0 right-0 w-32 h-32 ${theme.bgSubtle} blur-[60px]`} />

                            <div className="relative flex flex-col items-center text-center">
                                <div className={`w-32 h-32 rounded-full border-[10px] mb-6 flex items-center justify-center transition-all duration-1000 ${theme.border} ${theme.shadow}`}>
                                    <span className="text-4xl font-black text-white">{result.score}%</span>
                                </div>
                                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-1">{result.result_type}</h3>
                                <div className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${theme.bgMuted} ${theme.textMuted} mb-4`}>
                                    {t('sleep_form.risk_level')}: {result.risk_level}
                                </div>
                            </div>
                        </div>

                        {/* Summary Stats */}
                        <div className="p-8 bg-zinc-900 border border-white/10 rounded-[2.5rem]">
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-6">{t('sleep_form.input_summary')}</h4>
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <span className="text-white/60 text-sm font-medium">{t('sleep_form.avg_hours_label')}</span>
                                    <span className="text-white font-black">{formData.avg_hours}h</span>
                                </div>
                                <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(Math.min(parseFloat(formData.avg_hours), 10) / 100) * 1000}%` }} />
                                </div>
                                <div className="flex items-center justify-between pt-2">
                                    <span className="text-white/60 text-sm font-medium">{t('sleep_form.quality_label')}</span>
                                    <span className={`${theme.textMuted} font-black`}>{formData.quality}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Explanation and Tips */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Explanation Card */}
                        <div className="p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] relative overflow-hidden">
                            <div className="absolute top-4 right-8 opacity-5">
                                <svg className="w-24 h-24 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                                </svg>
                            </div>
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest mb-4">{t('sleep_form.explanation_label')}</h4>
                            <p className="text-xl text-white/80 font-medium leading-relaxed italic">
                                "{result.explanation}"
                            </p>
                        </div>

                        {/* Tips Selection */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black text-white/40 uppercase tracking-widest ml-4">{t('sleep_form.suggestions_label')}</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {result.tips.map((tip, i) => (
                                    <div key={i} className={`p-6 bg-zinc-900/50 border border-white/5 rounded-3xl flex items-start gap-4 hover:border-emerald-500/50 transition-all ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}>
                                        <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm text-white/70 font-medium leading-relaxed">{tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className={`flex flex-col sm:flex-row gap-4 pt-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
                            <button
                                onClick={() => setResult(null)}
                                className="flex-1 py-5 bg-white text-zinc-950 font-black rounded-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest shadow-2xl shadow-white/5"
                            >
                                {t('predict.reset_all')}
                            </button>
                            <button
                                onClick={() => window.print()}
                                className="flex-1 py-5 bg-zinc-800 text-white font-black rounded-2xl hover:bg-zinc-700 transition-all text-sm uppercase tracking-widest border border-white/10"
                            >
                                {t('sleep_form.download_pdf')}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`max-w-2xl mx-auto p-8 md:p-12 bg-zinc-900/50 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] shadow-2xl ${isRTL ? 'font-urdu' : ''}`}>
            <div className={`mb-10 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">{t('sleep_form.title')}</h2>
                <p className="text-white/40 text-sm font-bold tracking-widest uppercase italic border-l-2 border-emerald-500 pl-4">
                    {t('predict.progress')}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Sleep Hours */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.avg_hours')}
                        </label>
                        <input
                            type="number"
                            name="avg_hours"
                            value={formData.avg_hours}
                            onChange={handleChange}
                            placeholder={t('sleep_form.placeholder_hours')}
                            min="0"
                            max="24"
                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.avg_hours ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                        {errors.avg_hours && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.avg_hours}</p>}
                    </div>

                    {/* Sleep Quality */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.quality')}
                        </label>
                        <select
                            name="quality"
                            value={formData.quality}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 rounded-2xl bg-zinc-800 border ${errors.quality ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold appearance-none ${isRTL ? 'text-right pr-5 pl-10' : 'text-left'}`}
                        >
                            <option value="" disabled>{t('form.select_habit')}</option>
                            <option value="Poor" className="bg-zinc-900">{t('sleep_form.options_quality.poor')}</option>
                            <option value="Average" className="bg-zinc-900">{t('sleep_form.options_quality.average')}</option>
                            <option value="Good" className="bg-zinc-900">{t('sleep_form.options_quality.good')}</option>
                        </select>
                        {errors.quality && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.quality}</p>}
                    </div>

                    {/* Bedtime */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.bedtime')}
                        </label>
                        <input
                            type="time"
                            name="bedtime"
                            value={formData.bedtime}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.bedtime ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                        {errors.bedtime && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.bedtime}</p>}
                    </div>

                    {/* Wakeup Time */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.wakeup')}
                        </label>
                        <input
                            type="time"
                            name="wakeup"
                            value={formData.wakeup}
                            onChange={handleChange}
                            className={`w-full px-5 py-4 rounded-2xl bg-white/5 border ${errors.wakeup ? 'border-red-500/50' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                        />
                        {errors.wakeup && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.wakeup}</p>}
                    </div>

                    {/* Disturbances */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.disturbances')}
                        </label>
                        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {['Yes', 'No'].map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'disturbances', value: option } } as any)}
                                    className={`flex-1 py-4 rounded-2xl border font-bold transition-all ${formData.disturbances === option
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                >
                                    {option === 'Yes' ? t('sleep_form.options_yes_no.yes') : t('sleep_form.options_yes_no.no')}
                                </button>
                            ))}
                        </div>
                        {errors.disturbances && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.disturbances}</p>}
                    </div>

                    {/* Daytime Tiredness */}
                    <div className="space-y-2">
                        <label className={`block text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {t('sleep_form.tiredness')}
                        </label>
                        <div className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            {['Yes', 'No'].map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => handleChange({ target: { name: 'tiredness', value: option } } as any)}
                                    className={`flex-1 py-4 rounded-2xl border font-bold transition-all ${formData.tiredness === option
                                        ? 'bg-emerald-500 border-emerald-400 text-white'
                                        : 'bg-white/5 border-white/10 text-white/60 hover:bg-white/10'}`}
                                >
                                    {option === 'Yes' ? t('sleep_form.options_yes_no.yes') : t('sleep_form.options_yes_no.no')}
                                </button>
                            ))}
                        </div>
                        {errors.tiredness && <p className={`text-red-400 text-[10px] font-black uppercase tracking-widest animate-in fade-in slide-in-from-left-2 ${isRTL ? 'text-right' : 'text-left'}`}>{errors.tiredness}</p>}
                    </div>
                </div>

                <div className="pt-6">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-5 bg-white text-zinc-950 font-black rounded-2xl hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-emerald-500/10 uppercase tracking-widest text-sm flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <div className="w-5 h-5 border-4 border-zinc-950/20 border-t-zinc-950 rounded-full animate-spin" />
                                {t('predict.analyzing')}
                            </>
                        ) : (
                            <>
                                {t('sleep_form.submit')}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isRTL ? 'rotate-180 order-first' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </>
                        )}
                    </button>
                    {errors.submit && <p className="text-red-400 text-center text-[10px] font-black uppercase tracking-widest mt-4 animate-in shake">{errors.submit}</p>}
                </div>
            </form>
        </div>
    );
}
