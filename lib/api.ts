export interface PredictionInput {
    gender: string;
    age: number;
    country: string;
    city: string;
    profession: string;
    academic_pressure: number;
    work_pressure: number;
    cgpa: number;
    study_satisfaction: number;
    job_satisfaction: number;
    sleep_duration: string;
    dietary_habits: string;
    degree: string;
    suicidal_thoughts: string;
    work_study_hours: number;
    financial_stress: number;
    family_history: string;
}

export interface PredictionResult {
    prediction: number;
    probability: number;
    risk_level: string;
    confidence_score?: number;
}

export async function predictMentalHealth(data: PredictionInput): Promise<PredictionResult> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/predict`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        const errorDetails = await response.text();
        throw new Error(`Prediction failed: ${response.status} ${response.statusText} - ${errorDetails}`);
    }

    return response.json();
}
