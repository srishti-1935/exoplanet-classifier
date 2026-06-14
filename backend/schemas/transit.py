from pydantic import BaseModel
from typing import List

class TransitRecord(BaseModel):
    koi_period: float
    koi_duration: float
    koi_depth: float
    koi_prad: float
    koi_steff: float
    koi_impact: float
    koi_model_snr: float
    koi_srad: float
    koi_teq: float
    koi_insol: float

class PredictionResult(BaseModel):
    label: str
    confidence: float
    top_features: List[dict]

class BatchPredictionResult(BaseModel):
    total_records: int
    predictions: List[dict]