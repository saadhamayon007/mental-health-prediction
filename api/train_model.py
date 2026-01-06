import pandas as pd
import numpy as np
from sklearn.neural_network import MLPClassifier
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.metrics import accuracy_score
import joblib
import os

# Define file paths
DATASET_PATH = "student_depression_dataset_to_use_final.csv"
MODEL_PATH = "model.pkl" # Changed extension for sklearn
PREPROCESSOR_PATH = "preprocessor.pkl"

def train():
    if not os.path.exists(DATASET_PATH):
        print(f"Error: Dataset not found at {DATASET_PATH}")
        return

    print("Loading dataset...")
    df = pd.read_csv(DATASET_PATH)

    # Rename columns to match API expectation (snake_case)
    column_mapping = {
        'Gender': 'gender',
        'Age': 'age',
        'City': 'city',
        'Profession': 'profession',
        'Academic Pressure': 'academic_pressure',
        'Work Pressure': 'work_pressure',
        'CGPA': 'cgpa',
        'Study Satisfaction': 'study_satisfaction',
        'Job Satisfaction': 'job_satisfaction',
        'Sleep Duration': 'sleep_duration',
        'Dietary Habits': 'dietary_habits',
        'Degree': 'degree',
        'Have you ever had suicidal thoughts ?': 'suicidal_thoughts',
        'Work/Study Hours': 'work_study_hours',
        'Financial Stress': 'financial_stress',
        'Family History of Mental Illness': 'family_history',
        'Depression': 'depression'
    }
    df = df.rename(columns=column_mapping)
    
    # Drop ID/Name if present
    if 'id' in df.columns:
        df = df.drop(columns=['id'])

    # Separate features and target
    X = df.drop(columns=['depression'])
    y = df['depression']

    # Identify Categorical and Numerical columns
    categorical_cols = ['gender', 'city', 'profession', 'sleep_duration', 'dietary_habits', 'degree', 'suicidal_thoughts', 'family_history']
    numerical_cols = ['age', 'academic_pressure', 'work_pressure', 'cgpa', 'study_satisfaction', 'job_satisfaction', 'work_study_hours', 'financial_stress']

    # Replace '?' with NaN and handle missing values
    X = X.replace('?', np.nan)
    
    # Preprocessing
    encoders = {}
    # Impute missing values
    # For categorical, use mode
    for col in categorical_cols:
        X[col] = X[col].fillna(X[col].mode()[0])
        le = LabelEncoder()
        X[col] = le.fit_transform(X[col].astype(str))
        encoders[col] = le

    # For numerical, use mean
    for col in numerical_cols:
        X[col] = pd.to_numeric(X[col], errors='coerce') # Ensure numeric
        X[col] = X[col].fillna(X[col].mean())

    scaler = StandardScaler()
    X[numerical_cols] = scaler.fit_transform(X[numerical_cols])

    # Split data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    print("Building model (MLPClassifier)...")
    # Enhanced configuration for better probability predictions
    model = MLPClassifier(
        hidden_layer_sizes=(128, 64, 32),  # Deeper network
        activation='relu',
        solver='adam',
        alpha=0.0001,  # L2 regularization
        learning_rate='adaptive',
        max_iter=1000,  # More iterations
        early_stopping=True,  # Prevent overfitting
        validation_fraction=0.1,
        random_state=42,
        verbose=True
    )

    print("Training model...")
    model.fit(X_train, y_train)

    predictions = model.predict(X_test)
    probabilities = model.predict_proba(X_test)
    accuracy = accuracy_score(y_test, predictions)
    
    print(f"\n{'='*50}")
    print(f"Test Accuracy: {accuracy:.4f}")
    print(f"Sample Probabilities (first 5):")
    for i in range(min(5, len(probabilities))):
        print(f"  Sample {i+1}: Class 0: {probabilities[i][0]:.4f}, Class 1: {probabilities[i][1]:.4f} | Actual: {y_test.iloc[i]}")
    print(f"{'='*50}\n")

    # Save artifacts
    print("Saving artifacts...")
    joblib.dump(model, MODEL_PATH)
    
    preprocessors = {
        'encoders': encoders,
        'scaler': scaler,
        'categorical_cols': categorical_cols,
        'numerical_cols': numerical_cols
    }
    joblib.dump(preprocessors, PREPROCESSOR_PATH)
    print("✅ Model training complete! Files saved:")
    print(f"   - {MODEL_PATH}")
    print(f"   - {PREPROCESSOR_PATH}")

if __name__ == "__main__":
    train()
