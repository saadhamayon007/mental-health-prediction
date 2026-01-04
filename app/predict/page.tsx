import PredictionForm from '@/components/PredictionForm';

export default function PredictionPage() {
    return (
        <main className="flex min-h-screen flex-col items-center p-4 pt-24 md:p-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <div className="z-10 w-full max-w-4xl items-center justify-between font-mono text-sm animate-in fade-in zoom-in duration-500">
                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-black text-white mb-2 drop-shadow-md">
                        Mental Health Assessment
                    </h1>
                    <p className="text-white/90 text-lg max-w-2xl mx-auto">
                        Complete this confidential assessment to analyze potential risk factors using our deep learning model.
                    </p>
                </div>

                <PredictionForm />
            </div>
        </main>
    );
}
