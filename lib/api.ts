export interface PredictionInput {
    gender: string;
    age: number;
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
}

export async function predictMentalHealth(data: PredictionInput): Promise<PredictionResult> {
    // In a real scenario, this matches the hostname/port of the backend
    // For dev, we assume localhost:8000
    const response = await fetch('http://localhost:8000/predict', {
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
