from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all origins for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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

# Load artifacts
MODEL_PATH = "model.pkl"
PREPROCESSOR_PATH = "preprocessor.pkl"

model = None
preprocessors = None

if os.path.exists(MODEL_PATH) and os.path.exists(PREPROCESSOR_PATH):
    try:
        model = joblib.load(MODEL_PATH)
        preprocessors = joblib.load(PREPROCESSOR_PATH)
        print("Model and preprocessors loaded successfully.")
    except Exception as e:
        print(f"Error loading model: {e}")
else:
    print("Warning: Model or preprocessor not found. API will fail on predict.")

@app.get("/")
def read_root():
    return {"message": "Mental Health Prediction API is running"}

@app.post("/predict")
def predict(data: PredictionInput):
    if not model or not preprocessors:
        raise HTTPException(status_code=500, detail="Model not loaded")

    try:
        # Convert input to DataFrame
        input_data = pd.DataFrame([data.dict()])

        # Preprocess
        encoders = preprocessors['encoders']
        scaler = preprocessors['scaler']
        categorical_cols = preprocessors['categorical_cols']
        numerical_cols = preprocessors['numerical_cols']

        # Encode categorical
        for col in categorical_cols:
            if col in input_data.columns:
                le = encoders[col]
                # Handle unseen labels by assigning fallback (0)
                input_data[col] = input_data[col].apply(lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else 0)

        # Scale numerical
        input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])

        # Predict
        # MLPClassifier provides predict_proba
        probabilities = model.predict_proba(input_data)
        probability = probabilities[0][1] # Probability of class 1 (Depression)
        prediction = int(model.predict(input_data)[0])

        return {
            "prediction": prediction,
            "probability": round(float(probability), 4),
            "risk_level": "High" if prediction == 1 else "Low"
        }

    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
