from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
import pandas as pd
import joblib
import io

router = APIRouter()

try:
    model = joblib.load("models/model.pkl")
except:
    model = None

@router.post("/batch-predict")
async def batch_predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    contents = await file.read()
    df = pd.read_csv(io.StringIO(contents.decode("utf-8")))
    
    predictions = model.predict(df)
    probabilities = model.predict_proba(df)
    confidence_scores = [round(float(max(p)), 4) for p in probabilities]
    
    results = []
    for i in range(len(df)):
        results.append({
            "row": i + 1,
            "label": str(predictions[i]),
            "confidence": confidence_scores[i]
        })
    
    return JSONResponse(content={
        "total_records": len(results),
        "predictions": results
    })