'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/context/LanguageContext';

const ambientSounds = [
    { id: 'rain', name: 'Rainfall', icon: '🌧️', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' }, // Placeholder URLs
    { id: 'forest', name: 'Deep Forest', icon: '🌲', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
    { id: 'waves', name: 'Ocean Waves', icon: '🌊', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
    { id: 'lofi', name: 'Lo-Fi Chill', icon: '☕', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3' }
];

export default function MindfulMoments() {
    const { t, isRTL } = useLanguage();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentSound, setCurrentSound] = useState(ambientSounds[0]);
    const [volume, setVolume] = useState(0.5);
    const [breathState, setBreathState] = useState<'Inhale' | 'Exhale' | 'Hold'>('Inhale');
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setBreathState(prev => {
                if (prev === 'Inhale') return 'Hold';
                if (prev === 'Hold') return 'Exhale';
                return 'Inhale';
            });
        }, 4000);
        return () => clearInterval(interval);
    }, []);

    const togglePlay = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div className={`p-8 md:p-12 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] shadow-2xl ${isRTL ? 'font-urdu' : ''}`}>
            <div className="flex flex-col lg:flex-row gap-12 items-center">
                {/* Breathing Visualization */}
                <div className="relative w-64 h-64 flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full bg-blue-500/20 blur-3xl transition-all duration-[4000ms] ${breathState === 'Inhale' ? 'scale-150 opacity-40' : 'scale-100 opacity-20'
                        }`} />
                    <div className={`w-48 h-48 rounded-full border-4 border-white/10 flex items-center justify-center transition-all duration-[4000ms] ease-in-out ${breathState === 'Inhale' ? 'scale-125 bg-white/10' : 'scale-100 bg-white/5'
                        }`}>
                        <span className="text-xl font-black text-white uppercase tracking-widest animate-pulse">
                            {breathState}
                        </span>
                    </div>
                </div>

                {/* Audio Controls */}
                <div className="flex-1 w-full space-y-8">
                    <div>
                        <h2 className="text-3xl font-black text-white tracking-tight mb-2 uppercase">Mindful Moments</h2>
                        <p className="text-white/40 text-sm font-bold tracking-widest uppercase italic border-l-2 border-blue-500 pl-4">
                            Ambient sounds for deep relaxation
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {ambientSounds.map((sound) => (
                            <button
                                key={sound.id}
                                onClick={() => {
                                    setCurrentSound(sound);
                                    setIsPlaying(false);
                                }}
                                className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${currentSound.id === sound.id
                                        ? 'bg-blue-500 border-blue-400 scale-105 shadow-xl shadow-blue-500/20'
                                        : 'bg-white/5 border-white/5 hover:bg-white/10'
                                    }`}
                            >
                                <span className="text-2xl">{sound.icon}</span>
                                <span className="text-[10px] font-black uppercase tracking-tighter text-white/80">{sound.name}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 rounded-full bg-white text-zinc-950 flex items-center justify-center text-2xl hover:scale-110 active:scale-95 transition-all shadow-2xl"
                        >
                            {isPlaying ? '⏸️' : '▶️'}
                        </button>
                        <div className="flex-1 w-full space-y-2">
                            <div className="flex justify-between text-[10px] font-black text-white/40 uppercase">
                                <span>Volume</span>
                                <span>{Math.round(volume * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="0" max="1" step="0.01"
                                value={volume}
                                onChange={(e) => {
                                    setVolume(parseFloat(e.target.value));
                                    if (audioRef.current) audioRef.current.volume = parseFloat(e.target.value);
                                }}
                                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-white"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <audio
                ref={audioRef}
                src={currentSound.url}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                loop
            />
        </div>
    );
}
