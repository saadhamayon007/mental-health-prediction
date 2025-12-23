# Mental Health Prediction Frontend

## Project Overview
This project aims to create a robust and user-friendly frontend for the Early Mental Health Prediction model. It allows users to input their data and receive predictions regarding their mental health status, leveraging deep learning techniques.

## Features
- **Early Prediction**: Uses Deep Learning models to predict mental health status based on user inputs.
- **Interactive UI**: Clean and responsive interface built with Next.js and Tailwind CSS.
- **Real-time Analysis**: Instant feedback from the backend model.

## Installation

### Prerequisites
- Node.js (v18 or higher)
- Python (v3.8 or higher)
- Git

### Backend Setup
1. **Navigate to the API directory**
   ```bash
   cd api
   ```

2. **Install Python Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Start the Backend Server**
   ```bash
   python index.py
   ```
   The server will start at `http://localhost:8000`.

### Frontend Setup
1. **Navigate to the root directory** (if not already there)
   ```bash
   cd ..
   ```

2. **Install Frontend Dependencies**
   ```bash
   npm install
   ```

3. **Run the Development Server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage
- Navigate to the home page to access the prediction form.
- Fill in the required details and submit to get a prediction.

## Team and Collaboration
This project is developed and maintained by a collaborative team dedicated to leveraging AI for mental health awareness.
- **Team Workflow**: We follow standard git feature-branch workflows.
- **Goal**: To provide accessible mental health insights.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Python, FastAPI
- **Model Integration**: Deep Learning with TensorFlow/Keras (planned)
