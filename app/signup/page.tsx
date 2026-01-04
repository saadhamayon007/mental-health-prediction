'use client';

import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Signup functionality to be implemented!");
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-4">
            <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl animate-in fade-in zoom-in duration-500">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">Create Account</h1>
                    <p className="text-white/80">Join us to start assessing your well-being</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1 ml-1">Full Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1 ml-1">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-white/90 mb-1 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/10 text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all"
                            placeholder="Create a strong password"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-white text-pink-600 font-bold text-lg hover:bg-opacity-90 hover:scale-[1.02] transition-all shadow-lg"
                    >
                        Create Account
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <p className="text-white/80">
                        Already have an account?{' '}
                        <Link href="/login" className="text-white font-bold hover:underline decoration-2 underline-offset-4">
                            Sign In
                        </Link>
                    </p>
                </div>

                <div className="mt-4 text-center">
                    <Link href="/" className="text-white/60 text-sm hover:text-white transition-colors">
                        ← Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
