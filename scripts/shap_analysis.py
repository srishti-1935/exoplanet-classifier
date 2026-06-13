import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import shap
from sklearn.ensemble import RandomForestClassifier
from preprocess import load_and_preprocess

# Load and preprocess data
path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\kepler_features.csv"
X_train, X_test, y_train, y_test, scaler, imputer = load_and_preprocess(path)

FEATURES = ['koi_period','koi_duration','koi_depth','koi_prad',
            'koi_steff','koi_impact','koi_model_snr','koi_srad',
            'koi_teq','koi_insol','depth_x_duration','snr_ratio']

# Train best model from Step 4
print("\n🌲 Training best model...")
best_model = RandomForestClassifier(
    n_estimators=200,
    max_depth=20,
    min_samples_split=2,
    class_weight='balanced',
    random_state=42
)
best_model.fit(X_train, y_train)
print("✅ Model trained!")

# SHAP values
print("\n🔍 Computing SHAP values (takes a minute)...")
explainer = shap.TreeExplainer(best_model)
shap_values = explainer.shap_values(X_test[:500])
print(f"SHAP values shape: {shap_values.shape}")

# Plot top 10 features for CONFIRMED class (class 0)
print("📊 Generating SHAP plot...")
shap.summary_plot(
    shap_values[:, :, 0],
    X_test[:500],
    feature_names=FEATURES,
    max_display=10,
    show=False
)
plt.title("Top 10 Features — CONFIRMED Exoplanets")
plt.tight_layout()

output_path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\shap_top10_features.png"
plt.savefig(output_path, dpi=150, bbox_inches='tight')
print("✅ SHAP chart saved to data/shap_top10_features.png")
plt.show()