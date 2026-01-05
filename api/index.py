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
        # 1. Convert input to DataFrame (Using model_dump() for Pydantic v2)
        try:
            input_data = pd.DataFrame([data.model_dump()])
        except AttributeError:
            # Fallback for older Pydantic versions
            input_data = pd.DataFrame([data.dict()])

        # 2. Check if preprocessors are ready
        if not preprocessors:
            raise ValueError("AI Preprocessors are not initialized.")

        # 3. Preprocess
        encoders = preprocessors['encoders']
        scaler = preprocessors['scaler']
        categorical_cols = preprocessors['categorical_cols']
        numerical_cols = preprocessors['numerical_cols']

        # Encode categorical
        for col in categorical_cols:
            if col in input_data.columns:
                le = encoders[col]
                input_data[col] = input_data[col].apply(lambda x: le.transform([str(x)])[0] if str(x) in le.classes_ else 0)

        # Scale numerical
        input_data[numerical_cols] = scaler.transform(input_data[numerical_cols])

        # 4. Predict
        probabilities = model.predict_proba(input_data)
        probability = float(probabilities[0][1])
        prediction = int(model.predict(input_data)[0])

        return {
            "status": "success",
            "prediction": prediction,
            "probability": round(probability, 4),
            "risk_level": "High" if prediction == 1 else "Low"
        }

    except Exception as e:
        # Send a clear, readable error message to the frontend
        error_msg = str(e)
        if "scaler" in error_msg.lower():
            error_msg = "Data Scaling Error: The numbers entered are outside the expected range."
        elif "model" in error_msg.lower():
            error_msg = "AI Model Error: The brain of the app had trouble reading this data."
        
        print(f"Prediction Error: {error_msg}")
        raise HTTPException(
            status_code=400, 
            detail={
                "error": "Prediction Failed",
                "message": f"Sorry, our AI system hit a snag: {error_msg}",
                "help": "Please check your inputs and try again."
            }
        )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
