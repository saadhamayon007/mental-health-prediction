import PredictionForm from '@/components/PredictionForm';

export default function PredictionPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-8 md:p-24 bg-zinc-50 dark:bg-zinc-950">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 mb-4">
                        Mental Health Assessment
                    </h1>
                    <p className="text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
                        Complete this confidential assessment to analyze potential risk factors using our deep learning model.
                    </p>
                </div>

                <PredictionForm />
            </div>
        </main>
    );
}
