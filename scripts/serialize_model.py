import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import json
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (accuracy_score, precision_score, 
                             recall_score, f1_score, roc_auc_score)
from preprocess import load_and_preprocess

# Load and preprocess data
path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\kepler_features.csv"
X_train, X_test, y_train, y_test, scaler, imputer = load_and_preprocess(path)

# Train best model
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

# Evaluate
y_pred = best_model.predict(X_test)
y_proba = best_model.predict_proba(X_test)

accuracy  = accuracy_score(y_test, y_pred)
precision = precision_score(y_test, y_pred, average='macro')
recall    = recall_score(y_test, y_pred, average='macro')
f1        = f1_score(y_test, y_pred, average='macro')
roc_auc   = roc_auc_score(y_test, y_proba, multi_class='ovr', average='macro')

print(f"\n📊 Metrics:")
print(f"   Accuracy:  {accuracy:.3f}")
print(f"   Precision: {precision:.3f}")
print(f"   Recall:    {recall:.3f}")
print(f"   F1 Macro:  {f1:.3f}")
print(f"   ROC-AUC:   {roc_auc:.3f}")

# Save model, scaler, imputer
os.makedirs("models", exist_ok=True)
joblib.dump(best_model, "models/exoplanet_classifier.pkl")
joblib.dump(scaler,     "models/scaler.pkl")
joblib.dump(imputer,    "models/imputer.pkl")
print("\n✅ Model saved to models/exoplanet_classifier.pkl")

# Save metrics.json
metrics = {
    "accuracy":  round(accuracy, 4),
    "precision": round(precision, 4),
    "recall":    round(recall, 4),
    "f1_macro":  round(f1, 4),
    "roc_auc":   round(roc_auc, 4),
    "classes":   ["CONFIRMED", "CANDIDATE", "FALSE POSITIVE"]
}
with open("models/metrics.json", "w") as f:
    json.dump(metrics, f, indent=2)
print("✅ Metrics saved to models/metrics.json")
print("\n🎉 Step 6 complete!")