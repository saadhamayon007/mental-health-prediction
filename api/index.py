from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import pandas as pd
import numpy as np
# import tensorflow as tf # Uncomment when model is available
# import joblib # For scaler

app = FastAPI()

# Define input data model matching the dataset features
class PredictionInput(BaseModel):
    gender: str
    age: int
    city: str
    profession: str
    academic_pressure: float
    work_pressure: float
    cgpa: float
    study_satisfaction: float
    job_satisfaction: float
    sleep_duration: str
    dietary_habits: str
    degree: str
    suicidal_thoughts: str
    work_study_hours: float
    financial_stress: float
    family_history: str

@app.get("/")
def read_root():
    return {"message": "Mental Health Prediction API is running"}

@app.post("/predict")
def predict(data: PredictionInput):
    try:
        # TODO: Load actual model and scaler here
        # model = tf.keras.models.load_model('model.h5')
        # scaler = joblib.load('scaler.pkl')

        # Mock Logic for demonstration
        # This logic mimics the trends found in the dataset analysis (e.g. high pressure -> higher risk)
        
        risk_score = 0
        
        # Pressure factors
        risk_score += (data.academic_pressure * 0.1)
        risk_score += (data.work_pressure * 0.1)
        risk_score += (data.financial_stress * 0.15)
        
        # Satisfaction (inverse)
        risk_score -= (data.study_satisfaction * 0.05)
        risk_score -= (data.job_satisfaction * 0.05)
        
        # Sleep
        if "Less than 5" in data.sleep_duration:
            risk_score += 0.3
        elif "7-8" in data.sleep_duration:
            risk_score -= 0.1
            
        # History
        if data.family_history == "Yes":
            risk_score += 0.2
            
        if data.suicidal_thoughts == "Yes":
            risk_score += 0.4

        # Normalize to probability 0-1 (rough heuristic)
        # Base probability around 0.2
        probability = 0.2 + risk_score
        probability = max(0.0, min(1.0, probability))
        
        prediction = 1 if probability > 0.5 else 0

        return {
            "prediction": prediction,
            "probability": round(probability, 4),
            "risk_level": "High" if prediction == 1 else "Low"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
