from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import joblib
import pandas as pd

# -------------------------
# Create app ONCE
# -------------------------
app = FastAPI(title="Autism Prediction API")

# Static + Templates
app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# -------------------------
# Load model + encoders
# -------------------------
model = joblib.load("best_model.pkl")
encoders = joblib.load("encoders.pkl")


# -------------------------
# Home page
# -------------------------
@app.get("/")
def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"request": request}
    )


# -------------------------
# Input Schema
# -------------------------
class AutismInput(BaseModel):
    A1_Score:int
    A2_Score:int
    A3_Score:int
    A4_Score:int
    A5_Score:int
    A6_Score:int
    A7_Score:int
    A8_Score:int
    A9_Score:int
    A10_Score:int

    age:int

    gender:str
    ethnicity:str
    jaundice:str
    austim:str
    contry_of_res:str
    used_app_before:str
    result:str
    relation:str


# -------------------------
# Prediction API
# -------------------------
@app.post("/predict")
def predict(data: AutismInput):

    try:

        input_data = pd.DataFrame([{
            "A1_Score":data.A1_Score,
            "A2_Score":data.A2_Score,
            "A3_Score":data.A3_Score,
            "A4_Score":data.A4_Score,
            "A5_Score":data.A5_Score,
            "A6_Score":data.A6_Score,
            "A7_Score":data.A7_Score,
            "A8_Score":data.A8_Score,
            "A9_Score":data.A9_Score,
            "A10_Score":data.A10_Score,

            "age":data.age,

            "gender":data.gender,
            "ethnicity":data.ethnicity,
            "jaundice":data.jaundice,
            "austim":data.austim,
            "contry_of_res":data.contry_of_res,
            "used_app_before":data.used_app_before,
            "result":data.result,
            "relation":data.relation
        }])

        # Apply encoders
        for col in encoders:
            if col in input_data.columns:
                try:
                    input_data[col] = encoders[col].transform(
                        input_data[col]
                    )

                except Exception:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Invalid value for {col}. Allowed: {list(encoders[col].classes_)}"
                    )

        prediction = model.predict(input_data)[0]

        return {
            "prediction": int(prediction),
            "result_message":
                "Autism Detected"
                if prediction==1
                else "No Autism Detected"
        }

    except HTTPException:
        raise

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )