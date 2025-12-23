import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="z-10 max-w-5xl w-full text-center">
                <h1 className="text-6xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600">
                    Mental Health Prediction
                </h1>
                <p className="text-xl text-zinc-600 dark:text-zinc-400 mb-12 max-w-2xl mx-auto">
                    Early detection is key to better mental health. Our AI-powered tool helps identify potential risks based on lifestyle and demographic factors.
                </p>

                <Link
                    href="/predict"
                    className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-full transition-all hover:scale-105 shadow-lg shadow-blue-500/30"
                >
                    Start Assessment
                </Link>
            </div>
        </main>
    );
}
