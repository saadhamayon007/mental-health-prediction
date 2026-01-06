'use client';

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { supabase } from '@/lib/supabase';

interface MoodLog {
    id: string;
    mood: string;
    note: string;
    created_at: string;
}

const moodEmojis: Record<string, string> = {
    happy: '😊',
    calm: '😌',
    stressed: '😫',
    sad: '😢',
    anxious: '😰',
    energetic: '⚡'
};

export default function MoodTracker() {
    const { t, isRTL } = useLanguage();
    const [selectedMood, setSelectedMood] = useState<string | null>(null);
    const [note, setNote] = useState('');
    const [history, setHistory] = useState<MoodLog[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('mood_logs')
                .select('*')
                .order('created_at', { ascending: false })
                .limit(5);

            if (data) setHistory(data);
        } catch (err) {
            console.error('Error fetching mood history:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!selectedMood) return;
        setIsSaving(true);
        try {
            const { error } = await supabase
                .from('mood_logs')
                .insert([{
                    mood: selectedMood,
                    note: note,
                    created_at: new Date().toISOString()
                }]);

            if (!error) {
                setSelectedMood(null);
                setNote('');
                fetchHistory();
            }
        } catch (err) {
            console.error('Error saving mood:', err);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className={`p-10 glass-card !border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 ${isRTL ? 'font-urdu' : ''}`}>
            <div className={`mb-12 ${isRTL ? 'text-right' : 'text-left'}`}>
                <h2 className="text-3xl font-black text-white tracking-tighter mb-3 uppercase">{t('mood_tracker.title')}</h2>
                <p className="text-white/40 text-[10px] font-black tracking-[0.3em] uppercase italic border-l-2 border-blue-500 pl-4">
                    {t('mood_tracker.subtitle')}
                </p>
            </div>

            {/* Mood Selection Grid */}
            <div className="grid grid-cols-3 md:grid-cols-6 gap-5 mb-10">
                {Object.keys(moodEmojis).map((moodKey) => (
                    <button
                        key={moodKey}
                        onClick={() => setSelectedMood(moodKey)}
                        className={`group p-6 glass-card !rounded-2xl border transition-all flex flex-col items-center gap-3 ${selectedMood === moodKey
                            ? 'bg-blue-600 !border-blue-400 scale-105 shadow-[0_0_30px_rgba(37,99,235,0.3)]'
                            : 'hover:!bg-white/10 !border-white/5'
                            }`}
                    >
                        <span className="text-4xl group-hover:scale-110 transition-transform">{moodEmojis[moodKey]}</span>
                        <span className={`text-[9px] font-black uppercase tracking-widest ${selectedMood === moodKey ? 'text-white' : 'text-white/40'}`}>
                            {t(`mood_tracker.moods.${moodKey}` as any)}
                        </span>
                    </button>
                ))}
            </div>

            {/* Note Input */}
            <div className="space-y-6 mb-12">
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder={t('mood_tracker.placeholder')}
                    className="premium-input !h-32 !py-6 !px-8 resize-none"
                />
                <button
                    onClick={handleSave}
                    disabled={!selectedMood || isSaving}
                    className="premium-button w-full !bg-white !text-zinc-950 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
                >
                    {isSaving ? t('auth.btn_authenticating') : t('mood_tracker.save')}
                </button>
            </div>

            {/* Mini History */}
            <div className="pt-10 border-t border-white/5">
                <h3 className={`text-[10px] font-black text-white/20 uppercase tracking-[0.3em] mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
                    {t('mood_tracker.history')}
                </h3>
                <div className="space-y-4">
                    {history.map((log) => (
                        <div key={log.id} className={`p-6 glass-card !rounded-2xl !border-white/5 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                                <span className="text-3xl">{moodEmojis[log.mood] || '❓'}</span>
                                <div className={isRTL ? 'text-right' : 'text-left'}>
                                    <p className="text-[9px] text-white/20 font-black uppercase tracking-widest mb-1">{new Date(log.created_at).toLocaleDateString()}</p>
                                    <p className="text-sm text-white/80 font-bold tracking-tight truncate max-w-[200px]">{log.note || 'No notes'}</p>
                                </div>
                            </div>
                            <div className="px-4 py-1.5 glass-card !rounded-full text-[9px] text-white/40 font-black uppercase tracking-widest !border-white/5">
                                {t(`mood_tracker.moods.${log.mood}` as any)}
                            </div>
                        </div>
                    ))}
                    {history.length === 0 && !isLoading && (
                        <p className="text-center text-white/20 text-[10px] font-black uppercase tracking-[0.3em] py-8">No session reports found</p>
                    )}
                </div>
            </div>
        </div>
    );
}
