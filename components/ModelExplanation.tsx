import React from 'react';

export default function ModelExplanation() {
    return (
        <section className="mt-16 w-full max-w-4xl mx-auto p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-black text-white mb-8 text-center drop-shadow-md">
                How Does the AI "Think"? 🧠
            </h2>

            <div className="grid md:grid-cols-3 gap-8">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center space-y-4 p-4 hover:bg-white/5 rounded-3xl transition-colors">
                    <div className="w-16 h-16 bg-blue-400/20 rounded-2xl flex items-center justify-center text-3xl border border-blue-400/30">
                        📚
                    </div>
                    <h3 className="text-xl font-bold text-white">1. Reading Stories</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                        Imagine a person who read <strong>27,000 real stories</strong> of students. They learned about their age, sleep, and feelings in school.
                    </p>
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center space-y-4 p-4 hover:bg-white/5 rounded-3xl transition-colors">
                    <div className="w-16 h-16 bg-purple-400/20 rounded-2xl flex items-center justify-center text-3xl border border-purple-400/30">
                        🔍
                    </div>
                    <h3 className="text-xl font-bold text-white">2. Finding Habits</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                        After reading, the AI noticed a secret: Students who sleep very little and have high stress often feel sad. It learned these <strong>hidden habits</strong>.
                    </p>
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center space-y-4 p-4 hover:bg-white/5 rounded-3xl transition-colors">
                    <div className="w-16 h-16 bg-pink-400/20 rounded-2xl flex items-center justify-center text-3xl border border-pink-400/30">
                        🤝
                    </div>
                    <h3 className="text-xl font-bold text-white">3. Helping You</h3>
                    <p className="text-sm text-white/70 leading-relaxed">
                        When you enter your data, the AI looks at the "lessons" it learned from those stories to give you a <strong>friendly prediction</strong>.
                    </p>
                </div>
            </div>

            <div className="mt-10 p-6 bg-white/5 border border-white/10 rounded-2xl text-center">
                <p className="text-xs text-white/50 italic leading-relaxed">
                    *Our AI is built using "Deep Learning," which is a computer brain designed to work like a human brain to find patterns in confusing data.
                </p>
            </div>
        </section>
    );
}
