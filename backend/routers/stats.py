from fastapi import APIRouter, HTTPException
import json
import os

router = APIRouter()

@router.get("/model-stats")
def model_stats():
    path = "data/metrics.json"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="metrics.json not found. Ask Person 1.")
    
    with open(path, "r") as f:
        metrics = json.load(f)
    
    return metrics