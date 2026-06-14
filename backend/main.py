from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import predict, batch, stats, retrain

app = FastAPI(title="Exoplanet Classifier API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000", "https://exoplanet-classifier-drab.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predict.router)
app.include_router(batch.router)
app.include_router(stats.router)
app.include_router(retrain.router)

@app.get("/")
def root():
    return {"message": "Exoplanet Classifier API is running"}