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
    
    data = pd.DataFrame([record.dict()])
    prediction = model.predict(data)[0]
    probabilities = model.predict_proba(data)[0]
    confidence = float(max(probabilities))
    
    top_features = []
    if hasattr(model, "feature_importances_"):
        importances = model.feature_importances_
        feature_names = data.columns.tolist()
        pairs = sorted(zip(feature_names, importances), key=lambda x: x[1], reverse=True)
        top_features = [{"feature": f, "importance": round(float(i), 4)} for f, i in pairs[:5]]
    
    return PredictionResult(
        label=str(prediction),
        confidence=round(confidence, 4),
        top_features=top_features
    )