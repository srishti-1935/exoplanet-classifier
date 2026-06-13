import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import joblib
import numpy as np
import pandas as pd
from sklearn.metrics import recall_score, classification_report
from sklearn.impute import SimpleImputer

# Load TESS holdout
print("📂 Loading TESS holdout data...")
df = pd.read_csv(r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\tess_holdout.csv")
print(f"✅ Loaded: {df.shape}")

# Remap TESS dispositions to match Kepler classes
disp_map = {'KP': 0, 'CP': 0, 'FP': 2, 'FA': 2}
df['label_mapped'] = df['tfopwg_disp'].map(disp_map)
df = df.dropna(subset=['label_mapped'])
y_tess = df['label_mapped'].astype(int)
print(f"✅ Remapped labels: {y_tess.value_counts().to_dict()}")

# Map TESS columns to Kepler feature names
df['koi_period']       = df['pl_orbper']
df['koi_duration']     = df['pl_trandurh']
df['koi_depth']        = df['pl_trandep']
df['koi_prad']         = df['pl_rade']
df['koi_steff']        = df['st_teff']
df['koi_impact']       = df['st_logg']
df['koi_srad']         = df['st_rad']
df['koi_teq']          = df['pl_eqt']
df['koi_insol']        = df['pl_insol']
df['depth_x_duration'] = df['pl_trandep'] * df['pl_trandurh']

FEATURES = ['koi_period','koi_duration','koi_depth','koi_prad',
            'koi_steff','koi_impact','koi_model_snr','koi_srad',
            'koi_teq','koi_insol','depth_x_duration','snr_ratio']

# Build feature matrix
X_tess = df[['koi_period','koi_duration','koi_depth','koi_prad',
             'koi_steff','koi_impact','koi_srad','koi_teq',
             'koi_insol','depth_x_duration']].copy()

# Add missing TESS columns as 0
X_tess['koi_model_snr'] = 0
X_tess['snr_ratio']     = 0

# Reorder to match training feature order
X_tess = X_tess[FEATURES]
print(f"✅ Features mapped: {X_tess.shape}")

# Impute remaining nulls
imputer = SimpleImputer(strategy='median')
X_tess_imputed = imputer.fit_transform(X_tess)
print("✅ Nulls imputed")

# Load saved scaler and model
print("\n📦 Loading saved model...")
model  = joblib.load("models/exoplanet_classifier.pkl")
scaler = joblib.load("models/scaler.pkl")
print("✅ Model loaded!")

# Scale
X_tess_scaled = scaler.transform(X_tess_imputed)

# Predict
print("\n🔍 Running predictions...")
y_pred = model.predict(X_tess_scaled)

# Results
recall = recall_score(y_tess, y_pred, average='macro')
print(f"\n✅ TESS Cross-Mission Recall: {recall:.3f}")
print("\nClassification Report:")
print(classification_report(y_tess, y_pred,
      target_names=['CONFIRMED', 'CANDIDATE', 'FALSE POSITIVE']))

# Save to metrics.json
with open("models/metrics.json", "r") as f:
    metrics = json.load(f)

metrics["tess_recall"] = round(recall, 4)

with open("models/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)

print("✅ TESS recall saved to models/metrics.json")
print("\n🎉 Step 7 complete!")