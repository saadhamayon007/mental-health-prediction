'use client';

import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function LoginPage() {
    const router = useRouter();
    const { t, isRTL } = useLanguage();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError(t('form.error_api'));
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push("/");
            router.refresh();
        }
    };

    return (
        <div className={`min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 p-4 ${isRTL ? 'font-urdu' : ''}`}>
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <form onSubmit={handleLogin} className="space-y-6">
                    {error && (
                        <div className={`p-3 rounded-lg bg-red-500/20 border border-red-500/50 text-red-200 text-xs font-bold animate-in shake duration-300 ${isRTL ? 'text-right' : 'text-left'}`}>
                            {error}
                        </div>
                    )}
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
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 rounded-2xl bg-white text-indigo-600 font-black text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? t('auth.btn_authenticating') : t('auth.btn_login')}
                    </button>

                    <div className="relative">
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
                        {t('auth.new_here')}{' '}
                        <Link href="/signup" className="text-white hover:underline decoration-white/30 underline-offset-8">
                            {t('auth.signup_title')}
                        </Link>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">
                        {isRTL ? '← ' + t('auth.back_home') : '← ' + t('auth.back_home')}
                    </Link>
                </div>
            </div>
        </div>
    );
}
