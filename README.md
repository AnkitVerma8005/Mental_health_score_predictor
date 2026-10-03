# 🧠 Mental Health Score Predictor

A machine learning project that predicts a student's **mental health score** based on their social media usage, lifestyle habits, and demographic details. The trained model is served through a **FastAPI** backend and used by a simple **HTML/CSS/JavaScript** frontend.

---

## 📌 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Dataset](#-dataset)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Reference](#-api-reference)
- [Model Details](#-model-details)
- [Future Improvements](#-future-improvements)
- [Disclaimer](#-disclaimer)
- [Author](#-author)

---

## 📖 Overview

Social media is a big part of student life, and excessive use can affect sleep, studies, and emotional well-being. This project analyses the **Student Social Media and Mental Health Impact** dataset and trains a regression model that estimates a student's mental health score from inputs such as:

- Age, gender, country, and academic level
- Most-used social media platform and purpose of use
- Average daily usage hours and daily phone unlocks
- Study hours, physical activity, and sleep hours
- Stress level

The model is exposed as a REST API (FastAPI) and can be used through the included web interface.

---

## ✨ Features

- 📊 Complete data analysis and model training in a Jupyter Notebook
- 🤖 Pre-trained model saved as `mental_health_model.pkl`
- ⚡ Fast REST API built with FastAPI
- ✅ Input validation using Pydantic (age, hours, categories, etc.)
- 🌐 Simple frontend (HTML, CSS, JS) to enter details and view the prediction
- 🔓 CORS enabled so the frontend can talk to the backend

---

## 🛠 Tech Stack

| Category        | Tools                                  |
| --------------- | -------------------------------------- |
| Language        | Python, JavaScript                     |
| ML / Data       | scikit-learn (1.6.1), pandas, numpy    |
| Backend         | FastAPI, Uvicorn, Pydantic, Joblib     |
| Frontend        | HTML, CSS, JavaScript                  |
| Notebook        | Jupyter Notebook                       |

---

## 📁 Project Structure

```
Mental_health_score_predictor/
│
├── .vscode/                                              # Editor settings
├── Mental_Health_score_predictor.ipynb                   # EDA + model training notebook
├── Student Social Media And Mental Health Impact (1).csv # Dataset
├── mental_health_model.pkl                               # Trained ML pipeline
├── main.py                                               # FastAPI backend
├── index.html                                            # Frontend page
├── style.css                                             # Frontend styling
├── script.js                                             # Frontend logic (calls the API)
├── requirements.txt                                      # Python dependencies
├── .gitignore
└── README.md
```

---

## 📂 Dataset

**File:** `Student Social Media And Mental Health Impact (1).csv`

| Feature                    | Description                                                             |
| -------------------------- | ----------------------------------------------------------------------- |
| `Age`                      | Age of the student (10–100)                                             |
| `Gender`                   | Male / Female                                                           |
| `Country`                  | Country of the student (grouped into top countries + Other)             |
| `Academic_Level`           | High School / Undergraduate / Graduate                                  |
| `Most_Used_Platform`       | Instagram, Facebook, TikTok, YouTube, WhatsApp, Snapchat, Twitter, etc. |
| `Purpose_Of_Use`           | Networking / Education / Entertainment / News                           |
| `Avg_Daily_Usage_Hours`    | Average hours spent on social media per day                             |
| `Daily_Unlocks`            | Number of times the phone is unlocked per day                           |
| `Study_Hours`              | Hours spent studying per day                                            |
| `Physical_Activity_Hours`  | Hours of physical activity per day                                      |
| `Sleep_Hours_Per_Night`    | Hours of sleep per night                                                |
| `Stress_Level`             | Low / Medium / High / Very High                                         |
| **Target**                 | Mental health score (predicted value)                                   |

---

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/AnkitVerma8005/Mental_health_score_predictor.git
cd Mental_health_score_predictor
```

### 2. (Optional) Create a virtual environment

```bash
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

> ⚠️ The model was trained with **scikit-learn 1.6.1**. Keep this version to avoid errors while loading the `.pkl` file.

---

## 🚀 Usage

### Run the backend

```bash
uvicorn main:app --reload
```

The API will start at **http://127.0.0.1:8000**

- Interactive docs (Swagger UI): http://127.0.0.1:8000/docs

### Run the frontend

Open `index.html` in your browser (or use the VS Code *Live Server* extension), fill in the form, and click predict.

> Make sure the API URL inside `script.js` matches the address where your backend is running.

### Explore / retrain the model

```bash
jupyter notebook Mental_Health_score_predictor.ipynb
```

---

## 🔌 API Reference

### `GET /`
Health check.

**Response**
```json
"Welcome to the world"
```

### `POST /predict`
Returns the predicted mental health score.

**Request body**
```json
{
  "Age": 20,
  "Gender": "Female",
  "Country": "India",
  "Academic_Level": "Undergraduate",
  "Most_Used_Platform": "Instagram",
  "Purpose_Of_Use": "Entertainment",
  "Avg_Daily_Usage_Hours": 5.5,
  "Daily_Unlocks": 80,
  "Study_Hours": 4,
  "Physical_Activity_Hours": 1,
  "Sleep_Hours_Per_Night": 6.5,
  "Stress_Level": "High"
}
```

**Response**
```json
{
  "prediction_mental_health": 6.42
}
```

**Validation rules**

| Field                                                              | Allowed values                                                                                           |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| `Age`                                                              | Integer between 10 and 100                                                                               |
| `Gender`                                                           | `Male`, `Female`                                                                                         |
| `Academic_Level`                                                   | `High School`, `Undergraduate`, `Graduate`                                                               |
| `Most_Used_Platform`                                               | `Facebook`, `LinkedIn`, `Instagram`, `Snapchat`, `Twitter`, `YouTube`, `TikTok`, `LINE`, `KakaoTalk`, `VKontakte`, `WhatsApp`, `WeChat` |
| `Purpose_Of_Use`                                                   | `Networking`, `Education`, `Entertainment`, `News`                                                       |
| `Avg_Daily_Usage_Hours`, `Study_Hours`, `Physical_Activity_Hours`, `Sleep_Hours_Per_Night` | Number between 0 and 24                                                          |
| `Daily_Unlocks`                                                    | Integer ≥ 0                                                                                              |
| `Stress_Level`                                                     | `Low`, `Medium`, `High`, `Very High`                                                                     |

Countries outside the top list (India, USA, Canada, Australia, UK, Germany, Mexico, Turkey, France) are grouped as **Other**.

---

## 🤖 Model Details

- **Problem type:** Regression (predicting a numeric mental health score)
- **Pipeline:** Preprocessing (encoding of categorical features) + trained regressor, saved with `joblib`
- **Output:** Score rounded to 2 decimal places
- **Algorithm / metrics:** _Add your final model name and evaluation results here (e.g., R², MAE, RMSE)_

| Metric | Value |
| ------ | ----- |
| R²     | –     |
| MAE    | –     |
| RMSE   | –     |

---

## 🔮 Future Improvements

- Deploy the API (Render, Railway, or Hugging Face Spaces) and host the frontend (GitHub Pages / Netlify)
- Add feature-importance and data-visualisation sections
- Try more models and hyperparameter tuning
- Add unit tests for the API
- Dockerise the application

---

## ⚠️ Disclaimer

This project is built **for educational purposes only**. The predicted score is a statistical estimate based on a limited dataset and **must not be used as a medical or psychological diagnosis**. If you or someone you know is struggling with mental health, please consult a qualified professional.

---

## 👤 Author

**Ankit Verma**
GitHub: [@AnkitVerma8005](https://github.com/AnkitVerma8005)

---

⭐ If you found this project useful, consider giving it a star!
