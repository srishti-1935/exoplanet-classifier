from fastapi import APIRouter

router = APIRouter()

@router.post("/retrain")
def retrain():
    return {"status": "Retraining not yet implemented", "message": "Coming Jun 14"}