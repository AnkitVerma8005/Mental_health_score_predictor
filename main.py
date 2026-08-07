import joblib
from fastapi import FastAPI
import sklearn
from pydantic import BaseModel,Field
import pandas as pd 
from typing import Literal
from fastapi.middleware.cors import CORSMiddleware

# Load the trained model with a helpful error message when unpickling fails
try:
    model = joblib.load('mental_health_model.pkl')
except Exception as e:
    print("Failed to load 'mental_health_model.pkl':",e)

# creating app 
app = FastAPI()

# create list of top countries for filter
top_country = ['Other','India','USA','Canada','Australia','UK','Germany','Mexico','Turkey','France']

# for configuring frontend(html) and backend to work with coordination
app.add_middleware(
     CORSMiddleware,
     allow_origins=["*"],
     allow_methods=["*"],
     allow_headers=["*"]
)


# A first pydantic model 
class Studentdata(BaseModel):
        Age                      :int = Field(..., ge=10,le=100)
        Gender                   :Literal['Male','Female']
        Country                  :str
        Academic_Level           :Literal['Undergraduate','Graduate','High School']
        Most_Used_Platform       :Literal['Facebook', 'LinkedIn', 'Instagram', 'Snapchat', 'Twitter',
                                        'YouTube', 'TikTok', 'LINE', 'KakaoTalk', 'VKontakte', 'WhatsApp',
                                        'WeChat']
        Purpose_Of_Use           :Literal['Networking', 'Education', 'Entertainment', 'News']
        Avg_Daily_Usage_Hours    :float = Field(...,ge=0,le=24)
        Daily_Unlocks            :int = Field(...,ge=0)
        Study_Hours              :float = Field(...,ge=0,le=24)
        Physical_Activity_Hours  :float = Field(...,ge=0,le=24)
        Sleep_Hours_Per_Night    :float = Field(...,ge=0,le=24)
        Stress_Level             :str = Literal['Medium', 'Low', 'Very High', 'High']

# Describe what we send -- > Validation of target columns
class PredictionResponse(BaseModel):
     prediction_mental_health:float


@app.get('/')
def greed():
    return "Welcome to the world"


@app.post('/predict',response_model=PredictionResponse)
def predict(data:Studentdata):
    country_group = data.Country if data.Country in top_country else "other"

    input_row = pd.DataFrame([{
        'Age'                      :data.Age,
        'Gender'                   :data.Gender,
        'Country'                  :country_group,
        'Academic_Level'           :data.Academic_Level,
        'Most_Used_Platform'       :data.Most_Used_Platform,
        'Purpose_Of_Use'           :data.Purpose_Of_Use,
        'Avg_Daily_Usage_Hours'    :data.Avg_Daily_Usage_Hours,
        'Daily_Unlocks'            :data.Daily_Unlocks,
        'Study_Hours'              :data.Study_Hours,
        'Physical_Activity_Hours'  :data.Physical_Activity_Hours,
        'Sleep_Hours_Per_Night'    :data.Sleep_Hours_Per_Night,
        'Stress_Level'             :data.Stress_Level,
    }])

    prediction = model.predict(input_row)[0]
    return PredictionResponse(prediction_mental_health=round(float(prediction),2))