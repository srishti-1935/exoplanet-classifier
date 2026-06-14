from fastapi import APIRouter, HTTPException
from schemas.transit import TransitRecord, PredictionResult
import joblib
import pandas as pd

router = APIRouter()

try:
    model = joblib.load("models/model.pkl")
except:
    model = None

@router.post("/predict", response_model=PredictionResult)
def predict(record: TransitRecord):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded yet")
    
    data = record.dict()
    data['depth_x_duration'] = data['koi_depth'] * data['koi_duration']
    data['snr_ratio'] = data['koi_model_snr'] / data['koi_duration'] if data['koi_duration'] != 0 else 0
    
    df = pd.DataFrame([data])
    prediction = model.predict(df)[0]
    probabilities = model.predict_proba(df)[0]
    confidence = float(max(probabilities))
    
    label_map = {0: "CONFIRMED", 1: "CANDIDATE", 2: "FALSE POSITIVE"}
    
    top_features = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        feature_names = df.columns.tolist()
        pairs = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        top_features = [{"feature": f, "importance": round(float(i), 4)} for f, i in pairs[:5]]
    
    return PredictionResult(
        label=label_map.get(int(prediction), str(prediction)),
        confidence=round(confidence, 4),
        top_features=top_features
    )