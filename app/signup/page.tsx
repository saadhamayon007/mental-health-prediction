'use client';

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function SignupPage() {
    const router = useRouter();
    const { t, isRTL } = useLanguage();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError(t('form.error_api'));
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: name,
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className={`min-h-screen w-full flex items-center justify-center bg-zinc-950 p-4 ${isRTL ? 'font-urdu' : ''}`}>
                <div className="w-full max-w-md bg-white/5 border border-white/10 p-10 rounded-3xl text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 text-3xl">✓</div>
                    <h1 className="text-3xl font-black text-white mb-4">{t('auth.check_email')}</h1>
                    <p className="text-white/60 mb-8 leading-relaxed">
                        {t('auth.verify_desc').replace('{email}', email)}
                    </p>
                    <Link href="/login" className="inline-block px-8 py-4 bg-white text-zinc-950 font-black text-sm uppercase tracking-widest rounded-2xl hover:scale-105 transition-all">
                        {t('auth.go_to_login')}
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-4 ${isRTL ? 'font-urdu' : ''}`}>
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">{t('auth.signup_title')}</h1>
                    <p className="text-white/80">{t('auth.signup_subtitle')}</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-5">
                    {error && (
                        <div className={`p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold animate-in shake duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {error}
                        </div>
                    )}
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-2 ml-1">{t('auth.full_name')}</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                            placeholder={t('auth.placeholder_name')}
                            required
                        />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-2 ml-1">{t('auth.email')}</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                            placeholder={t('auth.placeholder_email')}
                            required
                        />
                    </div>
                    <div className={isRTL ? 'text-right' : 'text-left'}>
                        <label className="block text-xs font-black uppercase tracking-widest text-white/60 mb-2 ml-1">{t('auth.password')}</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full px-5 py-4 rounded-2xl bg-white/10 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all font-bold ${isRTL ? 'text-right' : 'text-left'}`}
                            placeholder={t('auth.placeholder_password')}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-white text-pink-600 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('auth.btn_creating') : t('auth.btn_signup')}
                    </button>

                    <div className="relative py-2">
                        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
                        <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest text-white/40"><span className="bg-zinc-900 px-2">{t('auth.or')}</span></div>
                    </div>

                    <Link
                        href="/"
                        className="w-full block text-center py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all"
                    >
                        {t('auth.btn_guest')}
                    </Link>
                </form>

                <div className={`mt-8 text-center ${isRTL ? 'flex flex-row-reverse justify-center gap-1' : ''}`}>
                    <p className="text-sm font-bold text-white/60">
                        {t('auth.already_have')}{' '}
                        <Link href="/login" className="text-white hover:underline decoration-white/30 underline-offset-8">
                            {t('auth.btn_login')}
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
