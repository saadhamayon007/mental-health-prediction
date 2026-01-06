'use client';

import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import EmergencyModal from "./EmergencyModal";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const pathname = usePathname();
    const { t, isRTL } = useLanguage();
    const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <header className="fixed top-6 left-1/2 -translate-x-1/2 w-[calc(100%-3rem)] max-w-6xl z-50 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="glass-card !rounded-3xl !border-white/5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-3xl overflow-visible">
                <div className={`flex items-center justify-between px-6 h-20 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <Logo />

                    <div className={`flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <nav className={`hidden lg:flex items-center gap-8 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Link href="/" className={`hover:text-blue-400 transition-all ${pathname === '/' ? 'text-blue-400 text-glow-blue' : ''}`}>
                                {t('nav.home')}
                            </Link>
                            <Link href="/predict" className={`hover:text-blue-400 transition-all ${pathname === '/predict' ? 'text-blue-400 text-glow-blue' : ''}`}>
                                {t('nav.predict')}
                            </Link>
                            <Link href="/about" className={`hover:text-blue-400 transition-all ${pathname === '/about' ? 'text-blue-400 text-glow-blue' : ''}`}>
                                {t('nav.about')}
                            </Link>
                            <Link href="/support" className={`hover:text-blue-400 transition-all ${pathname === '/support' ? 'text-blue-400 text-glow-blue' : ''}`}>
                                {t('support.title')}
                            </Link>
                            <button
                                onClick={() => setIsEmergencyOpen(true)}
                                className="px-5 py-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-2xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                            >
                                {t('support.emergency_btn')}
                            </button>
                        </nav>

                        <div className="h-4 w-px bg-white/5 hidden lg:block"></div>

                        <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse' : ''}`}>
                            <Link href="/login" className="px-5 py-2.5 bg-white/5 border border-white/5 rounded-2xl text-[9px] font-black uppercase tracking-widest text-white/60 hover:text-white hover:bg-white/10 transition-all">
                                {t('nav.account')}
                            </Link>
                            <LanguageSwitcher />
                        </div>
                    </div>
                </div>
            </div>

            <EmergencyModal
                isOpen={isEmergencyOpen}
                onClose={() => setIsEmergencyOpen(false)}
            />
        </header>
    );
}
