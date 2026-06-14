# 🔭 Kepler Vision
### Autonomous Exoplanet Discovery Platform
> Real-Time AI Transit Signal Analysis & Hyperparameter Optimization for Cross-Mission Exploration

---

## 🌐 Live Demo

Frontend: https://exoplanet-classifier-drab.vercel.app

Backend API: https://exoplanet-classifier-api.onrender.com

---

## 📖 What is Kepler Vision?

NASA space telescopes produce tens of thousands of transit signals, forcing scientists to manually review observations to distinguish real planets from noise. Kepler Vision solves this by automatically classifying telescope observations as:

- ✅ **CONFIRMED** — A real exoplanet
- 🟡 **CANDIDATE** — A potential exoplanet requiring follow-up
- ❌ **FALSE POSITIVE** — Noise or a non-planetary signal

Kepler Vision is trained on 21,544 rows of cleaned, aligned transit telemetry from NASA's Kepler KOI, K2, and TESS missions, achieving **83.6% accuracy** and **95.1% ROC-AUC**, with a targeted **91% recall on confirmed exoplanets** — ensuring real discoveries are almost never missed.

---

## 🏗️ System Architecture

```
NASA Exoplanet Archive (Kepler KOI / K2 / TESS TOI)
        ↓
  Data Pipeline (Python — clean, align, feature engineer)
        ↓
  ML Model (Random Forest + SMOTE + SHAP)
        ↓
  FastAPI Backend (REST API — /predict, /batch-predict, /model-stats, /retrain)
        ↓
  React Frontend (Dashboard, Classify, Insights, Hyperparameter Lab)
```

---

## 👥 Team

| Member | Role |
|---|---|
| Akshata Shrivastava | ML Engineer |
| Srishti Srivastava | Backend Engineer |
| Malavika Nair | Frontend Engineer |
| Palak Lohia | Data Engineer |
| Aarushi Chowdhury | PM / Pitch Lead |

---

## 🛠️ Tech Stack

| Layer | Tools |
|---|---|
| ML | Python, scikit-learn, XGBoost, SMOTE, SHAP, joblib |
| Backend | FastAPI, Uvicorn, Pydantic, Pandas |
| Frontend | React (Vite), Recharts / Plotly |
| Data | NASA Exoplanet Archive, Pandas, NumPy |

---

## 📁 Project Structure

```
exoplanet-classifier/
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   ├── models/
│   │   └── model.pkl         # Trained ML model (not in git — see setup)
│   ├── data/
│   │   └── metrics.json      # Model evaluation metrics
│   ├── routers/
│   │   ├── predict.py        # /predict endpoint
│   │   ├── batch.py          # /batch-predict endpoint
│   │   ├── stats.py          # /model-stats endpoint
│   │   └── retrain.py        # /retrain endpoint
│   └── schemas/
│       └── transit.py        # Pydantic request/response models
├── frontend/                 # React frontend
├── data/                     # Raw and cleaned datasets
│   ├── kepler_koi.csv
│   ├── k2_oi.csv
│   ├── tess_toi.csv
│   └── kepler_features.csv
├── notebooks/                # Jupyter demo notebook
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
Make sure you have the following installed:
- Python 3.10 or higher → [Download](https://www.python.org/downloads/)
- Node.js 18 or higher → [Download](https://nodejs.org/)
- Git → [Download](https://git-scm.com/)

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/srishti-1935/exoplanet-classifier.git
cd exoplanet-classifier
```

---

### Step 2 — Get the Model File

The `model.pkl` file is too large for GitHub (47MB). Download it from the shared link and place it here:

```
exoplanet-classifier/backend/models/model.pkl
```

> ⚠️ The backend will not work without this file.

---

### Step 3 — Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

**Run the backend server:**

```bash
uvicorn main:app --reload --reload-exclude venv --port 8000
```

The API will be live at: `http://localhost:8000`

Interactive API docs at: `http://localhost:8000/docs`

---

### Step 4 — Frontend Setup

```bash
# From the root folder, navigate to frontend
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be live at: `http://localhost:5173`

---

### Step 5 — Verify Everything is Working

1. Open `http://localhost:8000/docs` — you should see 4 endpoints listed
2. Open `http://localhost:5173` — you should see the Kepler Vision dashboard
3. Try classifying a star using the Classify page

---

## 🔌 API Endpoints

### `POST /predict`
Classify a single star's transit data.

**Request body:**
```json
{
  "koi_period": 9.48,
  "koi_duration": 2.1,
  "koi_depth": 615.0,
  "koi_prad": 2.3,
  "koi_steff": 5500.0,
  "koi_impact": 0.2,
  "koi_model_snr": 25.3,
  "koi_srad": 1.0,
  "koi_teq": 800.0,
  "koi_insol": 50.0
}
```

**Response:**
```json
{
  "label": "CONFIRMED",
  "confidence": 0.94,
  "top_features": [
    {"feature": "koi_model_snr", "importance": 0.1812},
    {"feature": "koi_prad", "importance": 0.1155}
  ]
}
```

---

### `POST /batch-predict`
Upload a CSV file and get predictions for all rows.

**Request:** Multipart form upload of a `.csv` file

**Response:**
```json
{
  "total_records": 100,
  "predictions": [
    {"row": 1, "label": "CONFIRMED", "confidence": 0.94},
    {"row": 2, "label": "FALSE POSITIVE", "confidence": 0.88}
  ]
}
```

---

### `GET /model-stats`
Get current model performance metrics.

**Response:**
```json
{
  "accuracy": 0.8357,
  "precision": 0.8379,
  "recall": 0.8357,
  "f1": 0.8354,
  "roc_auc": 0.9512,
  "confusion_matrix": [[883, 60, 25], [81, 799, 88], [46, 177, 745]]
}
```

---

### `POST /retrain`
Trigger model retraining with updated hyperparameters.

---

## 📊 Model Performance

| Metric | Score |
|---|---|
| Accuracy | 83.6% |
| Precision | 83.8% |
| Macro F1 | 0.835 |
| ROC-AUC | 0.951 |
| Recall (Confirmed) | 91% |

**Top Features (SHAP Analysis):**
1. `koi_model_snr` — Signal-to-noise ratio (most powerful predictor)
2. `koi_prad` — Planetary radius
3. `snr_ratio` — Custom engineered feature (SNR / duration)

---

## 📦 Data Sources

All datasets sourced from the [NASA Exoplanet Archive](https://exoplanetarchive.ipac.caltech.edu/):

| Dataset | Mission | Rows |
|---|---|---|
| Kepler KOI | Kepler | ~9,500 |
| K2 OI | K2 | ~8,000 |
| TESS TOI | TESS | ~4,000 |

See `data/DATA.md` for full column descriptions, licenses, and download links.

---

## 🚀 Future Roadmap

- **Streaming Pipelines** — Apache Kafka integration for real-time telescope feeds
- **Deep Learning** — CNN models to evaluate raw light curves directly
- **Cross-Mission Expansion** — Support for future space observation fleets

---

## 📬 Contact

GitHub: [https://github.com/srishti-1935/exoplanet-classifier](https://github.com/srishti-1935/exoplanet-classifier)
