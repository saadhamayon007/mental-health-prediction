'use client';

import React, { useState } from 'react';
import { PredictionInput, predictMentalHealth, PredictionResult } from '@/lib/api';
import ResultCard from './ResultCard';
import { useLanguage } from '@/context/LanguageContext';

const locationData: Record<string, string[]> = {
    "India": ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Kolkata", "Pune", "Other"],
    "Pakistan": ["Karachi", "Lahore", "Islamabad", "Faisalabad", "Rawalpindi", "Other"],
    "USA": ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Other"],
    "UK": ["London", "Birmingham", "Manchester", "Glasgow", "Liverpool", "Other"],
    "Canada": ["Toronto", "Montreal", "Vancouver", "Ottawa", "Calgary", "Other"],
    "Other": ["Other"]
};

const stepFieldMapping: Record<number, string[]> = {
    1: ['age', 'gender', 'country', 'city', 'cgpa'],
    2: ['sleep_duration', 'dietary_habits', 'work_study_hours', 'academic_pressure', 'work_pressure'],
    3: ['study_satisfaction', 'financial_stress', 'family_history']
};
const sleepDurations = ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"];
const dietaryHabits = ["Healthy", "Moderate", "Unhealthy"];

export default function PredictionForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState('');
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const { t, isRTL } = useLanguage();

    const initialFormData: PredictionInput = {
        gender: '',
        age: '' as any,
        country: '',
        city: '',
        profession: 'Student',
        academic_pressure: '' as any,
        work_pressure: 0,
        cgpa: '' as any,
        study_satisfaction: '' as any,
        job_satisfaction: 0,
        sleep_duration: '',
        dietary_habits: '',
        degree: 'B.Tech',
        suicidal_thoughts: 'No',
        work_study_hours: 6,
        financial_stress: '' as any,
        family_history: ''
    };

    const [formData, setFormData] = useState<PredictionInput>(initialFormData);

    const validateField = (name: string, value: any) => {
        let errorMsg = '';
        if (value === '' || value === null || value === undefined) {
            errorMsg = t('form.required');
        } else if (name === 'age') {
            if (value < 10 || value > 100) errorMsg = t('form.age_range');
        } else if (name === 'cgpa') {
            if (value < 0 || value > 10) errorMsg = t('form.cgpa_range');
        } else if (['academic_pressure', 'work_pressure', 'study_satisfaction', 'job_satisfaction', 'financial_stress'].includes(name)) {
            if (value < 0 || value > 5) errorMsg = t('form.pressure_range');
        }

        setErrors(prev => ({ ...prev, [name]: errorMsg }));
        return errorMsg === '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        let val: any = value;

        if (['age', 'cgpa', 'academic_pressure', 'work_pressure', 'study_satisfaction', 'job_satisfaction', 'financial_stress', 'work_study_hours'].includes(name)) {
            val = value === '' ? '' : Number(value);
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: val };
            // Reset city if country changes
            if (name === 'country') {
                newData.city = '';
            }
            return newData;
        });
        validateField(name, val);
    };

    const handleClearStep = () => {
        const fieldsToClear = stepFieldMapping[step] || [];
        setFormData(prev => {
            const newData = { ...prev };
            fieldsToClear.forEach(field => {
                (newData as any)[field] = (initialFormData as any)[field];
            });
            return newData;
        });
        // Clear errors only for those fields
        const newErrors = { ...errors };
        fieldsToClear.forEach(field => delete newErrors[field]);
        setErrors(newErrors);
    };

    const handleResetAll = () => {
        setResult(null);
        setStep(1);
        setFormData(initialFormData);
        setError(null);
        setErrors({});
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Final Validation Check
        let isValid = true;
        const requiredFields = Object.keys(initialFormData);
        const newErrors: Record<string, string> = {};

        requiredFields.forEach(field => {
            const value = (formData as any)[field];
            if (value === '' || value === null || value === undefined) {
                newErrors[field] = 'Required';
                isValid = false;
            }
        });

        if (!isValid) {
            setErrors(newErrors);
            setError(t('form.fill_all'));
            return;
        }

        setLoading(true);
        setError(null);

        try {
            setLoadingStage(t('predict.analyzing'));
            const res = await predictMentalHealth(formData);
            setResult(res);

            const historyItem = {
                id: Date.now().toString(),
                date: new Date().toISOString(),
                risk_level: res.risk_level,
                age: formData.age,
                profession: formData.profession
            };

            const existingHistory = JSON.parse(localStorage.getItem('assessment_history') || '[]');
            const newHistory = [historyItem, ...existingHistory].slice(0, 10);
            localStorage.setItem('assessment_history', JSON.stringify(newHistory));

        } catch (err: any) {
            setError(t('form.error_api'));
        } finally {
            setLoading(false);
            setLoadingStage('');
        }
    };

    if (result) {
        return <ResultCard result={result} formData={formData} onReset={handleResetAll} />;
    }

    const nextStep = () => {
        // Validate current step before proceeding
        let stepFields: string[] = [];
        if (step === 1) stepFields = ['age', 'gender', 'country', 'city', 'cgpa'];
        if (step === 2) stepFields = ['sleep_duration', 'dietary_habits', 'academic_pressure', 'work_pressure'];

        let stepValid = true;
        const newErrors = { ...errors };
        stepFields.forEach(f => {
            if (!(formData as any)[f] && (formData as any)[f] !== 0) {
                newErrors[f] = 'Required';
                stepValid = false;
            }
        });

        if (!stepValid) {
            setErrors(newErrors);
            return;
        }
        setStep(s => s + 1);
    };
    const prevStep = () => setStep(s => s - 1);

    const hasErrors = Object.values(errors).some(err => err !== '');
    const isStepInvalid = () => {
        if (step === 1) return !formData.age || !formData.gender || !formData.country || !formData.city || errors.age || errors.cgpa;
        if (step === 2) return !formData.sleep_duration || !formData.dietary_habits || errors.academic_pressure;
        if (step === 3) return !formData.family_history || errors.financial_stress || errors.study_satisfaction;
        return false;
    };

    return (
        <div className="w-full max-w-3xl mx-auto p-1 bg-white/5 dark:bg-zinc-900/50 backdrop-blur-2xl border border-white/10 dark:border-white/5 rounded-[2.5rem] shadow-2xl transition-all overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="p-8 md:p-10">
                {/* Header & Reset */}
                <div className={`flex justify-between items-center mb-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{t('predict.step')} {step} {t('predict.of')} 3</h2>
                        <p className="text-white/50 text-xs font-bold uppercase tracking-widest">{t('predict.progress')}</p>
                    </div>
                    <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <button
                            type="button"
                            onClick={handleClearStep}
                            disabled={loading}
                            className={`px-3 py-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-white/10 disabled:opacity-20 group ${isRTL ? 'flex-row-reverse' : ''}`}
                            title={t('predict.clear_page')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            {t('predict.clear_page')}
                        </button>
                        <div className="w-px h-6 bg-white/10 my-auto mx-1" />
                        <button
                            type="button"
                            onClick={handleResetAll}
                            disabled={loading}
                            className={`px-3 py-2 hover:bg-white/5 rounded-xl transition-all text-white/40 hover:text-white flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border border-transparent hover:border-white/10 disabled:opacity-20 group ${isRTL ? 'flex-row-reverse' : ''}`}
                            title={t('predict.reset_all')}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                            </svg>
                            {t('predict.reset_all')}
                        </button>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-12 relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-700 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    {step === 1 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.age')}</label>
                                    <input type="number" name="age" value={formData.age} onChange={handleChange}
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.age ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.age && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.age}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.gender')}</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{t('form.select_gender')}</option>
                                        <option value="Male">{t('form.options.male')}</option>
                                        <option value="Female">{t('form.options.female')}</option>
                                        <option value="Other">{t('form.options.other')}</option>
                                    </select>
                                    {errors.gender && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.gender}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.country')}</label>
                                    <select name="country" value={formData.country} onChange={handleChange} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{t('form.select_country')}</option>
                                        {Object.keys(locationData).map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.country && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.country}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.city')}</label>
                                    <select name="city" value={formData.city} onChange={handleChange} disabled={!formData.country} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{formData.country ? t('form.select_city') : t('form.select_country_first')}</option>
                                        {formData.country && locationData[formData.country].map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                    {errors.city && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.city}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.cgpa')}</label>
                                    <input type="number" step="0.1" name="cgpa" value={formData.cgpa} onChange={handleChange} placeholder="e.g. 7.5"
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.cgpa ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.cgpa && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.cgpa}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.sleep')}</label>
                                    <select name="sleep_duration" value={formData.sleep_duration} onChange={handleChange} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{t('form.select_duration')}</option>
                                        {sleepDurations.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    {errors.sleep_duration && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.sleep_duration}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.diet')}</label>
                                    <select name="dietary_habits" value={formData.dietary_habits} onChange={handleChange} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{t('form.select_habit')}</option>
                                        {dietaryHabits.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                    {errors.dietary_habits && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.dietary_habits}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-4">
                                    <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
                                        <label className={`text-xs font-black text-white/40 uppercase tracking-widest ml-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                            {t('form.work_study_hours')}: <span className="text-white">{formData.work_study_hours || 0} Hours</span>
                                        </label>
                                    </div>
                                    <input type="range" min="0" max="16" name="work_study_hours" value={formData.work_study_hours || 0} onChange={handleChange} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 transition-all" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.academic_pressure')}</label>
                                    <input type="number" min="0" max="5" name="academic_pressure" value={formData.academic_pressure} onChange={handleChange} placeholder="1-5"
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.academic_pressure ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.academic_pressure && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.academic_pressure}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.work_pressure')}</label>
                                    <input type="number" min="0" max="5" name="work_pressure" value={formData.work_pressure} onChange={handleChange} placeholder="1-5"
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.work_pressure ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.work_pressure && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.work_pressure}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.study_sat')}</label>
                                    <input type="number" min="0" max="5" name="study_satisfaction" value={formData.study_satisfaction} onChange={handleChange} placeholder="1-5"
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.study_satisfaction ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.study_satisfaction && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.study_satisfaction}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.financial_stress')}</label>
                                    <input type="number" min="0" max="5" name="financial_stress" value={formData.financial_stress} onChange={handleChange} placeholder="1-5"
                                        className={`w-full px-6 py-4 rounded-2xl bg-white/5 border ${errors.financial_stress ? 'border-red-500' : 'border-white/10'} text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`} />
                                    {errors.financial_stress && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.financial_stress}</p>}
                                </div>
                                <div className="col-span-1 md:col-span-2 space-y-2">
                                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">{t('form.family_history')}</label>
                                    <select name="family_history" value={formData.family_history} onChange={handleChange} className={`w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all font-bold [&>option]:text-zinc-900 cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}>
                                        <option value="" disabled>{t('form.select_response')}</option>
                                        <option value="No">{t('form.options.no_history')}</option>
                                        <option value="Yes">{t('form.options.yes_history')}</option>
                                    </select>
                                    {errors.family_history && <p className={`text-[10px] text-red-400 mt-1 font-bold ${isRTL ? 'mr-1' : 'ml-1'}`}>{errors.family_history}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className={`bg-red-500/10 border border-red-500/20 p-5 rounded-2xl flex items-start gap-4 animate-in shake duration-500 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 flex-shrink-0">⚠️</div>
                            <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                                <p className="text-sm font-black text-red-200">{t('form.attention')}</p>
                                <p className="text-xs text-white/60 font-medium leading-relaxed">{error}</p>
                            </div>
                        </div>
                    )}

                    <div className={`flex justify-between items-center pt-8 border-t border-white/5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={loading}
                                className={`px-8 py-4 rounded-2xl border border-white/10 text-white hover:bg-white/5 transition-all font-bold text-sm flex items-center gap-2 group disabled:opacity-30 disabled:cursor-not-allowed ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 group-hover:-translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                {t('predict.back')}
                            </button>
                        ) : <div />}

                        {step < 3 ? (
                            <button
                                type="button"
                                onClick={nextStep}
                                disabled={!!isStepInvalid()}
                                className={`px-10 py-4 rounded-2xl bg-white text-zinc-950 hover:bg-blue-50 transition-all font-black text-sm shadow-xl shadow-blue-500/5 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2 group active:scale-95 ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                {t('predict.continue')}
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 group-hover:translate-x-1 transition-transform ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </button>
                        ) : (
                            <button
                                type="submit"
                                disabled={loading || hasErrors}
                                className={`px-10 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white transition-all font-black text-sm shadow-2xl shadow-purple-500/30 disabled:opacity-50 flex items-center gap-3 overflow-hidden active:scale-95 relative group ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                                {loading && (
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                )}
                                {loading ? loadingStage : t('predict.predict')}
                                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
