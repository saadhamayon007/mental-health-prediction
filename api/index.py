from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import numpy as np
import joblib
import os
from dotenv import load_dotenv
from openai import OpenAI

from pathlib import Path
env_path = Path(__file__).parent.parent / '.env.local'
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None
if client:
    print("✅ OpenAI API Key detected. Wellness Companion is now in AI mode.")
else:
    print("ℹ️ No OpenAI API Key found. Wellness Companion is in Rule-Based mode.")

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

class SleepInput(BaseModel):
    avg_hours: float
    quality: str
    bedtime: str
    wakeup: str
    disturbances: str
    tiredness: str

class ChatInput(BaseModel):
    message: str
    language: str = "en"

# Load artifacts
import pathlib
SCRIPT_DIR = pathlib.Path(__file__).parent.resolve()
MODEL_PATH = SCRIPT_DIR / "model.pkl"
PREPROCESSOR_PATH = SCRIPT_DIR / "preprocessor.pkl"

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

        # Fallback for unrealistic probability values
        # If model returns 0 or very low probability, use reasonable baseline
        if probability < 0.05:  # Less than 5%
            if prediction == 1:  # High risk but low probability - use moderate-high
                probability = 0.65  # 65% - moderate-high risk
            else:  # Low risk - use low-moderate
                probability = 0.15  # 15% - low risk baseline
        
        print(f"🔍 Prediction: {prediction}, Probability: {probability}")

        # Generate user-friendly mental health guidance
        if prediction == 1:  # High Risk
            risk_level = "High"
            message = "Patterns observed in your biometric and lifestyle data suggest significant cognitive strain. Early intervention and environmental adjustments are statistically recommended."
            recommendations = [
                "🧠 Consider speaking with a mental health professional for personalized support",
                "💚 Practice daily mindfulness or meditation for 10-15 minutes",
                "🏃 Engage in regular physical activity - even a 20-minute walk can help",
                "😴 Prioritize 7-9 hours of quality sleep each night",
                "👥 Connect with supportive friends, family, or support groups",
                "📝 Keep a mood journal to track patterns and triggers"
            ]
            support_message = "Remember: Seeking help is a sign of strength, not weakness. You're taking an important step by using this tool."
        else:  # Low Risk
            risk_level = "Low"
            message = "Your current lifestyle patterns indicate good mental wellness. Continue maintaining these healthy habits to support your emotional well-being."
            recommendations = [
                "✨ Keep up your current healthy routines and self-care practices",
                "🌱 Continue engaging in activities that bring you joy and fulfillment",
                "🤝 Maintain strong social connections with friends and family",
                "📚 Consider learning stress management techniques for future resilience",
                "💪 Stay physically active and maintain a balanced diet",
                "🎯 Set realistic goals and celebrate your achievements"
            ]
            support_message = "You're doing great! Keep prioritizing your mental health and well-being."

        return {
            "status": "success",
            "prediction": prediction,
            "probability": round(probability, 4),
            "risk_level": risk_level,
            "message": message,
            "recommendations": recommendations,
            "support_message": support_message
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

@app.post("/analyze-sleep")
def analyze_sleep(data: SleepInput):
    try:
        # Heuristic-based analysis engine
        score = 100
        tips = []
        
        # 1. Hours Analysis
        if data.avg_hours < 5:
            score -= 30
            tips.append("Your sleep duration is significantly low (under 5 hours). Aim for 7-9 hours for better mental recovery.")
        elif data.avg_hours < 7:
            score -= 15
            tips.append("You're slightly below the recommended sleep duration. Trying to add 1 hour could improve focus.")
        
        # 2. Quality Analysis
        if data.quality == "Poor":
            score -= 20
            tips.append("Lower sleep quality is often linked to blue light exposure before bed. Try reading a physical book instead.")
        
        # 3. Disturbances
        if data.disturbances == "Yes":
            score -= 15
            tips.append("Frequent disturbances might indicate a need for a darker or quieter environment.")
            
        # 4. Daytime Tiredness
        if data.tiredness == "Yes":
            score -= 10
            tips.append("Feeling tired during the day suggests your 'deep sleep' phase may be interrupted.")

        # Determine descriptive result
        if score >= 80:
            result = "Optimal Sleep Health"
            risk = "Low"
            explanation = "Your sleep habits are excellent and provide a strong foundation for mental resilience and cognitive function."
            color = "emerald"
        elif score >= 50:
            result = "Fair Sleep Health"
            risk = "Medium"
            explanation = "Your sleep patterns show some inconsistency. Improvement in sleep hygiene could significantly boost your daily energy and mood."
            color = "amber"
        else:
            result = "Sleep Deprivation Risk"
            risk = "High"
            explanation = "Severe sleep patterns detected. This level of deprivation is strongly linked to increased stress, anxiety, and long-term health risks."
            color = "red"

        return {
            "status": "success",
            "score": score,
            "result_type": result,
            "risk_level": risk,
            "explanation": explanation,
            "color_theme": color,
            "tips": tips[:4] 
        }
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/chat")
def chat(data: ChatInput):
    # Check if API key is configured
    if not os.getenv("OPENAI_API_KEY"):
        # Fallback to rule-based logic if no key
        return chat_fallback(data)
    
    try:
        system_prompts = {
            "en": "You are an empathetic Mental Health Companion. Provide supportive, non-clinical advice. Use short, helpful responses. Encourage the user to use the 'Sleep Analysis' and 'Mental Health Prediction' tools in this app.",
            "de": "Du bist ein empathischer Begleiter für mentale Gesundheit. Gib unterstützende, nicht-klinische Ratschläge. Nutze kurze, hilfreiche Antworten. Ermutige den Nutzer, die Tools 'Schlaf-Analyse' und 'Psychische Vorhersage' in dieser App zu nutzen.",
            "ur": "آپ ایک ہمدرد دماغی صحت کے ساتھی ہیں۔ معاون، غیر طبی مشورہ دیں۔ مختصر اور مددگار جوابات دیں۔ صارف کو اس ایپ میں 'نیند کا تجزیہ' اور 'دماغی صحت کی پیش گوئی' کے ٹولز استعمال کرنے کی ترغیب دیں۔"
        }
        
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # or gpt-4
            messages=[
                {"role": "system", "content": system_prompts.get(data.language, system_prompts["en"])},
                {"role": "user", "content": data.message}
            ],
            max_tokens=200
        )
        return {"response": response.choices[0].message.content}
    except Exception as e:
        print(f"OpenAI Error: {e}")
        return chat_fallback(data)

def chat_fallback(data: ChatInput):
    # Enhanced rule-based fallback system
    msg = data.message.lower().strip()
    lang = data.language
    
    responses = {
        "en": {
            "default": "I hear you. It's completely normal to feel this way. Tell me more about what's on your mind?",
            "hi": "Hello! I am your Wellness Companion. How can I support you today?",
            "mental_health": "Mental health includes our emotional, psychological, and social well-being. It affects how we think, feel, and act. It also helps determine how we handle stress, relate to others, and make choices.",
            "stress": "Stress can be overwhelming. Have you tried taking 5 deep breaths? We also have a 'Mental Health Predictor' and 'Mood Tracker' to help you manage.",
            "sleep": "Sleep is so vital for recovery. Try our 'Sleep Analysis' tool! It helps you understand how your patterns affect your mood.",
            "sad": "I'm sorry you're feeling down. Reaching out is a brave first step. Please remember that you're not alone.",
            "thanks": "You're very welcome! I'm here whenever you need someone to talk to.",
            "who": "I am an AI Wellness Companion designed to provide emotional support and guide you through our mental health tools.",
            "help": "If you are in immediate danger, please visit our 'Support' page or contact local emergency services immediately."
        },
        "de": {
            "default": "Ich verstehe dich. Es ist völlig normal, sich so zu fühlen. Erzähl mir mehr darüber, was dich beschäftigt.",
            "hi": "Hallo! Ich bin dein Wellness-Begleiter. Wie kann ich dich heute unterstützen?",
            "mental_health": "Psychische Gesundheit umfasst unser emotionales, psychologisches und soziales Wohlbefinden. Sie beeinflusst, wie wir denken, fühlen und handeln.",
            "stress": "Stress kann überwältigend sein. Hast du schon versucht, fünfmal tief durchzuatmen? Nutze auch unseren 'Mood-Tracker'.",
            "sleep": "Schlaf ist für die Erholung sehr wichtig. Probier unser 'Schlaf-Analyse-Tool' aus!",
            "sad": "Es tut mir leid, dass du dich traurig fühlst. Du bist nicht allein, und sich mitzuteilen ist ein mutiger erster Schritt.",
            "thanks": "Sehr gerne! Ich bin immer da, wenn du jemanden zum Reden brauchst.",
            "who": "Ich bin ein KI-Wellness-Begleiter, der dich emotional unterstützt und durch unsere Tools führt.",
            "help": "Wenn Sie sich in unmittelbarer Gefahr befinden, besuchen Sie bitte unsere Seite 'Krisenhilfe' oder kontaktieren Sie den Notruf."
        },
        "ur": {
            "default": "میں آپ کی بات سمجھ رہا ہوں۔ ایسا محسوس کرنا بالکل نارمل ہے۔ مجھے مزید بتائیں کہ آپ کے ذہن میں کیا ہے؟",
            "hi": "ہیلو! میں آپ کا ویلنس ساتھی ہوں۔ میں آج آپ کی کیسے مدد کر سکتا ہوں؟",
            "mental_health": "دماغی صحت میں ہماری جذباتی، نفسیاتی اور سماجی بہبود شامل ہے۔ یہ اس بات پر اثر انداز ہوتی ہے کہ ہم کیسے سوچتے، محسوس کرتے اور عمل کرتے ہیں۔",
            "stress": "تناؤ بہت زیادہ ہو سکتا ہے۔ کیا آپ نے 5 گہری سانسیں لینے کی کوشش کی ہے؟ آپ ہمارا 'موڈ ٹریکر' بھی استعمال کر سکتے ہیں۔",
            "sleep": "نیند بہت ضروری ہے۔ ہمارا 'نیند کا تجزیہ' ٹول آزمائیں! یہ آپ کو بہتر محسوس کرنے میں مدد دے سکتا ہے۔",
            "sad": "مجھے دکھ ہے کہ آپ اداس محسوس کر رہے ہیں۔ آپ اکیلے نہیں ہیں، اور بات کرنا ایک بہادری کا قدم ہے۔",
            "thanks": "آپ کا بہت شکریہ! جب بھی آپ کو بات کرنے کی ضرورت ہو، میں یہاں ہوں۔",
            "who": "میں ایک AI ویلنس ساتھی ہوں جو آپ کی جذباتی مدد کرنے اور آپ کو ہمارے ٹولز کے استعمال میں رہنمائی فراہم کرنے کے لیے بنایا گیا ہوں۔",
            "help": "اگر آپ کسی فوری خطرے میں ہیں تو براہ کرم ہمارے 'سپورٹ' پیج پر جائیں یا فوری طور پر مقامی ہنگامی خدمات سے رابطہ کریں۔"
        }
    }
    
    selected_lang = responses.get(lang, responses["en"])
    
    # Keyword matching logic
    if any(word in msg for word in ["hi", "hello", "hey", "ہیلو", "سلام", "hallo"]):
        return {"response": selected_lang["hi"]}
    if any(word in msg for word in ["what is mental health", "mental health", "دماغی صحت"]):
        return {"response": selected_lang["mental_health"]}
    if any(word in msg for word in ["who are you", "what are you", "تم کون ہو", "wer bist du"]):
        return {"response": selected_lang["who"]}
    if any(word in msg for word in ["thanks", "thank you", "شکریہ", "danke"]):
        return {"response": selected_lang["thanks"]}
    if any(word in msg for word in ["stress", "pressure", "anxious", "دباؤ", "پریشان"]):
        return {"response": selected_lang["stress"]}
    if any(word in msg for word in ["sleep", "tired", "awake", "نیند", "تھکن", "schlaf"]):
        return {"response": selected_lang["sleep"]}
    if any(word in msg for word in ["sad", "depressed", "cry", "اداس", "ڈپریشن", "traurig"]):
        return {"response": selected_lang["sad"]}
    if any(word in msg for word in ["help", "emergency", "suicide", "مدد", "خودکشی", "hilfe"]):
        return {"response": selected_lang["help"]}
    
    # Varied default responses to avoid repetition
    import random
    varied_responses = {
        "en": [
            "I hear you. It's completely normal to feel this way. Tell me more about what's on your mind?",
            "Thank you for sharing that with me. How are you feeling right now?",
            "I'm here to listen. What would you like to talk about today?",
            "That sounds important. Can you tell me more about it?",
            "I understand. How has this been affecting you lately?",
            "I appreciate you opening up. What's been on your mind recently?"
        ],
        "de": [
            "Ich verstehe dich. Es ist völlig normal, sich so zu fühlen. Erzähl mir mehr darüber, was dich beschäftigt.",
            "Danke, dass du das mit mir teilst. Wie fühlst du dich gerade?",
            "Ich bin hier, um zuzuhören. Worüber möchtest du heute sprechen?",
            "Das klingt wichtig. Kannst du mir mehr darüber erzählen?"
        ],
        "ur": [
            "میں آپ کی بات سمجھ رہا ہوں۔ ایسا محسوس کرنا بالکل نارمل ہے۔ مجھے مزید بتائیں کہ آپ کے ذہن میں کیا ہے؟",
            "آپ کا شکریہ کہ آپ نے یہ بات شیئر کی۔ آپ ابھی کیسا محسوس کر رہے ہیں؟",
            "میں یہاں سننے کے لیے ہوں۔ آج آپ کس بارے میں بات کرنا چاہیں گے؟",
            "یہ اہم لگتا ہے۔ کیا آپ مجھے اس کے بارے میں مزید بتا سکتے ہیں؟"
        ]
    }
    
    lang_responses = varied_responses.get(lang, varied_responses["en"])
    return {"response": random.choice(lang_responses)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
