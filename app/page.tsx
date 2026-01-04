'use client';

import Link from "next/link";
import { useState } from 'react';
import NewsSection from '@/components/NewsSection';
import SearchBar from '@/components/SearchBar';

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');

    return (
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
            <div className="pt-24 pb-12 px-4">
                {/* Hero Section */}
                <div className="max-w-5xl mx-auto text-center mb-16">
                    <div className="inline-block mb-4 px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        Using WHO Mental Health Guidelines
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                        Mental Health Prediction
                    </h1>
                    <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-8 max-w-2xl mx-auto">
                        Early detection is key. Our AI tool identifies potential risks based on lifestyle and demographic factors, aligned with global health standards.
                    </p>

                    <div className="flex flex-col items-center gap-6">
                        <Link
                            href="/predict"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                        >
                            Start Assessment
                        </Link>

                        <div className="w-full max-w-md">
                            <SearchBar value={searchQuery} onChange={setSearchQuery} />
                        </div>
                    </div>
                </div>

                {/* News & Updates Section */}
                <div className="max-w-7xl mx-auto">
                    <NewsSection searchQuery={searchQuery} />
                </div>
            </div>
        </main>
    );
}
