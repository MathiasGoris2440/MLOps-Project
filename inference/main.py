from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pickle
import numpy as np
import os
from .schemas import SmurfFeatures


# Set up the FastAPI app
app = FastAPI()

# CORS to allow any frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 Laad het model
model_path = os.path.join("inference", "smurf-regressor", "INPUT_model_path", "model.pkl")

with open(model_path, "rb") as f:
    model = pickle.load(f)

# 🤖 Definieer de API endpoint
@app.post("/predict")
def predict(features: SmurfFeatures):
    input_data = np.array([[
        features.income_am,
        features.profit_last_am,
        features.profit_am,
        features.damage_am,
        features.damage_inc,
        features.crd_lim_rec,
        features.credit_use_ic,
        features.gluten_ic,
        features.lactose_ic,
        features.insurance_ic,
        features.spa_ic,
        features.empl_ic,
        features.cab_requests,
        features.married_cd,
        features.bar_no,
        features.sport_ic,
        features.neighbor_income,
        features.age,
        features.marketing_permit,
        features.urban_ic,
        features.client_segment,
        features.sect_empl,
        features.prev_stay,
        features.prev_all_in_stay,
        features.divorce,
        features.fam_adult_size,
        features.children_no,
        features.tenure_mts,
        features.company_ic,
        features.claims_no,
        features.claims_am,
        features.nights_booked,
        features.shop_am,
        features.shop_use,
        features.retired,
        features.gold_status,
        features.gender_M,
        features.gender_V,
        features.score_pos,
        features.score_neg,
        features.tenure_started_in_season,
        features.dining_ic_False,
        features.dining_ic_True,
        features.dining_ic_missing,
        features.presidential_False,
        features.presidential_True,
        features.presidential_missing,
        features.is_return_customer
    ]], dtype=object)  # dtype=object since bools and floats mixed
    
    prediction = model.predict(input_data)
    return {"predicted_value": float(prediction[0])}

