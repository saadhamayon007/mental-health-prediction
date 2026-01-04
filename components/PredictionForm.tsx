'use client';

import React, { useState } from 'react';
import { PredictionInput, predictMentalHealth, PredictionResult } from '@/lib/api';
import ResultCard from './ResultCard';

const cities = ["Bangalore", "Mumbai", "Delhi", "Chennai", "Hyderabad", "Kolkata", "Pune", "Other"];
const degrees = ["B.Tech", "M.Tech", "B.Sc", "M.Sc", "B.A", "M.A", "PhD", "Other"];
const professions = ["Student", "Software Engineer", "Teacher", "Doctor", "Other"];
const sleepDurations = ["Less than 5 hours", "5-6 hours", "7-8 hours", "More than 8 hours"];
const dietaryHabits = ["Healthy", "Moderate", "Unhealthy"];
const yesNo = ["Yes", "No"];

export default function PredictionForm() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [loadingStage, setLoadingStage] = useState(''); // New state for workflow visualization
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [error, setError] = useState<string | null>(null);

    const initialFormData: PredictionInput = {
        gender: 'Male',
        age: 20,
        city: 'Other',
        profession: 'Student',
        academic_pressure: 3,
        work_pressure: 0,
        cgpa: 7.0,
        study_satisfaction: 3,
        job_satisfaction: 0,
        sleep_duration: '7-8 hours',
        dietary_habits: 'Moderate',
        degree: 'B.Tech',
        suicidal_thoughts: 'No',
        work_study_hours: 6,
        financial_stress: 2,
        family_history: 'No'
    };

    const [formData, setFormData] = useState<PredictionInput>(initialFormData);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: (name.includes('pressure') || name.includes('satisfaction') || name === 'cgpa' || name === 'age' || name === 'work_study_hours' || name === 'financial_stress')
                ? Number(value)
                : value
        }));
    };

    const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    const handleReset = () => {
        setResult(null);
        setStep(1);
        setFormData(initialFormData);
        setError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Visualize Workflow Steps
            setLoadingStage('Cleaning & Preprocessing Data...');
            await wait(1000); // Simulate processing time

            setLoadingStage('Transforming Categorical Inputs...');
            await wait(800);

            setLoadingStage('Running Deep Learning Model...');
            const res = await predictMentalHealth(formData);

            setLoadingStage('Finalizing Prediction...');
            await wait(500);

            setResult(res);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
            setLoadingStage('');
        }
    };

    if (result) {
        return <ResultCard result={result} onReset={handleReset} />;
    }

    if (loading) {
        return (
            <div className="w-full max-w-2xl mx-auto p-12 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
                <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 mb-2">AI Analysis in Progress</h3>
                <p className="text-blue-600 font-medium animate-pulse">{loadingStage}</p>
                <div className="mt-8 w-full max-w-xs bg-zinc-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-blue-600 animate-progress-indeterminate"></div>
                </div>
            </div>
        );
    }

    // Multi-step form logic
    const nextStep = () => setStep(s => s + 1);
    const prevStep = () => setStep(s => s - 1);

    return (
        <div className="w-full max-w-3xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl">
            <div className="mb-8">
                <div className="flex justify-between mb-2 text-sm font-medium text-white/80">
                    <span>Demographics</span>
                    <span>Lifestyle</span>
                    <span>Well-being</span>
                </div>
                <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-white transition-all duration-500 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        style={{ width: `${(step / 3) * 100}%` }}
                    />
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {step === 1 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold mb-4 text-white">Step 1: User Input Interaction (Basic Info)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Age</label>
                                <input type="number" name="age" value={formData.age} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    <option>Male</option>
                                    <option>Female</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">City</label>
                                <select name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {cities.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Profession</label>
                                <select name="profession" value={formData.profession} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {professions.map(p => <option key={p}>{p}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Degree</label>
                                <select name="degree" value={formData.degree} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {degrees.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">CGPA (0-10)</label>
                                <input type="number" step="0.01" max="10" name="cgpa" value={formData.cgpa} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold mb-4 text-white">Step 1: User Input Interaction (Lifestyle)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Sleep Duration</label>
                                <select name="sleep_duration" value={formData.sleep_duration} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {sleepDurations.map(s => <option key={s}>{s}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Dietary Habits</label>
                                <select name="dietary_habits" value={formData.dietary_habits} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {dietaryHabits.map(d => <option key={d}>{d}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Work/Study Hours per Day ({formData.work_study_hours})</label>
                                <input type="range" min="0" max="16" name="work_study_hours" value={formData.work_study_hours} onChange={handleChange} className="w-full accent-white" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Academic Pressure (0-5)</label>
                                <input type="number" min="0" max="5" name="academic_pressure" value={formData.academic_pressure} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Work Pressure (0-5)</label>
                                <input type="number" min="0" max="5" name="work_pressure" value={formData.work_pressure} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <h3 className="text-xl font-bold mb-4 text-white">Step 1: User Input (Psychological Factors)</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Study Satisfaction (0-5)</label>
                                <input type="number" min="0" max="5" name="study_satisfaction" value={formData.study_satisfaction} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Job Satisfaction (0-5)</label>
                                <input type="number" min="0" max="5" name="job_satisfaction" value={formData.job_satisfaction} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Financial Stress (0-5)</label>
                                <input type="number" min="0" max="5" name="financial_stress" value={formData.financial_stress} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Family History of Mental Illness</label>
                                <select name="family_history" value={formData.family_history} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {yesNo.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium mb-1 text-white/90 ml-1">Have you ever had suicidal thoughts?</label>
                                <select name="suicidal_thoughts" value={formData.suicidal_thoughts} onChange={handleChange} className="w-full px-4 py-2 rounded-xl bg-white/20 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-white/50 transition-all [&>option]:text-zinc-900">
                                    {yesNo.map(o => <option key={o}>{o}</option>)}
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="flex justify-between pt-4">
                    {step > 1 ? (
                        <button type="button" onClick={prevStep} className="px-6 py-3 rounded-xl border border-white/20 text-white hover:bg-white/10 transition-colors font-semibold">Back</button>
                    ) : <div></div>}

                    {step < 3 ? (
                        <button type="button" onClick={nextStep} className="px-8 py-3 rounded-xl bg-white text-purple-600 hover:bg-white/90 transition-colors font-bold shadow-lg">Next Step</button>
                    ) : (
                        <button type="submit" disabled={loading} className="px-8 py-3 rounded-xl bg-white text-purple-600 hover:bg-white/90 transition-colors font-bold shadow-lg disabled:opacity-50">
                            {loading ? 'Processing...' : 'Analyze Results'}
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
