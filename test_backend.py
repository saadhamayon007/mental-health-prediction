import requests
import json

# Test data
data = {
    "gender": "Male",
    "age": 22,
    "city": "Lahore",
    "profession": "Student",
    "academic_pressure": 4,
    "work_pressure": 2,
    "cgpa": 7.5,
    "study_satisfaction": 3,
    "job_satisfaction": 0,
    "sleep_duration": "5-6 hours",
    "dietary_habits": "Moderate",
    "degree": "BS",
    "suicidal_thoughts": "No",
    "work_study_hours": 8,
    "financial_stress": 3,
    "family_history": "No"
}

try:
    response = requests.post('http://localhost:8000/predict', json=data)
    print(f"Status Code: {response.status_code}")
    print(f"\nResponse:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
