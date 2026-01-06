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
    message?: string;
    recommendations?: string[];
    support_message?: string;
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

export interface SleepInput {
    avg_hours: number;
    quality: string;
    bedtime: string;
    wakeup: string;
    disturbances: string;
    tiredness: string;
}

export interface SleepResult {
    status: string;
    score: number;
    result_type: string;
    risk_level: string;
    explanation: string;
    color_theme: string;
    tips: string[];
}

export async function analyzeSleepPattern(data: SleepInput): Promise<SleepResult> {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    const response = await fetch(`${baseUrl}/analyze-sleep`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Sleep analysis failed');
    }

    return response.json();
}
