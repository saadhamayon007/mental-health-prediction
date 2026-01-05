'use client';

import Link from "next/link";
import Logo from "./Logo";
import LanguageSwitcher from "./LanguageSwitcher";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
    const pathname = usePathname();
    const { t, isRTL } = useLanguage();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <header className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50 animate-in slide-in-from-top duration-500">
            <div className={`max-w-7xl mx-auto px-4 h-20 flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                <Logo />

                <div className={`flex items-center gap-10 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <nav className={`hidden md:flex items-center gap-8 text-xs font-black uppercase tracking-widest text-zinc-600 dark:text-zinc-400 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link href="/" className={`hover:text-blue-600 dark:hover:text-blue-500 transition-all ${pathname === '/' ? 'text-blue-600 dark:text-blue-500' : ''}`}>
                            {t('nav.home')}
                        </Link>
                        <Link href="/predict" className={`hover:text-blue-600 dark:hover:text-blue-500 transition-all ${pathname === '/predict' ? 'text-blue-600 dark:text-blue-500' : ''}`}>
                            {t('nav.predict')}
                        </Link>
                        <Link href="/about" className={`hover:text-blue-600 dark:hover:text-blue-500 transition-all ${pathname === '/about' ? 'text-blue-600 dark:text-blue-500' : ''}`}>
                            {t('nav.about')}
                        </Link>
                    </nav>

                    <div className="h-4 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

                    <div className={`flex items-center gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Link href="/login" className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 bg-white/5 border border-white/5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-all">
                            {t('nav.account')}
                        </Link>
                        <LanguageSwitcher />
                    </div>
                </div>
            </div>
        </header>
    );
}
