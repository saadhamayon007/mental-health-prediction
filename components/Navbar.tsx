'use client';

import Link from "next/link";
import Logo from "./Logo";
import LanguageSelector from "./LanguageSelector";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const pathname = usePathname();
    const isAuthPage = pathname === '/login' || pathname === '/signup';

    if (isAuthPage) return null;

    return (
        <header className="fixed top-0 w-full bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 z-50 animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                <Logo />

                <div className="flex items-center gap-6">
                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600 dark:text-zinc-400">
                        <Link href="/" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            Home
                        </Link>
                        <Link href="/predict" className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${pathname === '/predict' ? 'text-blue-600 dark:text-blue-400' : ''}`}>
                            Prediction
                        </Link>
                    </nav>

                    <div className="h-6 w-px bg-zinc-200 dark:bg-zinc-800 hidden md:block"></div>

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-medium text-zinc-600 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Sign In
                        </Link>
                        <LanguageSelector />
                    </div>
                </div>
            </div>
        </header>
    );
}
