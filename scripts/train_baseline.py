import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import cross_val_score, StratifiedKFold
from sklearn.metrics import confusion_matrix, classification_report
from xgboost import XGBClassifier
from preprocess import load_and_preprocess

# Load and preprocess data
path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\kepler_features.csv"
X_train, X_test, y_train, y_test, scaler, imputer = load_and_preprocess(path)

cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)

print("\n🌲 Training Random Forest...")
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf_scores = cross_val_score(rf, X_train, y_train, cv=cv, scoring='f1_macro')
print(f"RF F1 (macro): {rf_scores.mean():.3f} ± {rf_scores.std():.3f}")

print("\n⚡ Training XGBoost...")
xgb = XGBClassifier(eval_metric='mlogloss', random_state=42)
xgb_scores = cross_val_score(xgb, X_train, y_train, cv=cv, scoring='f1_macro')
print(f"XGB F1 (macro): {xgb_scores.mean():.3f} ± {xgb_scores.std():.3f}")

# Fit best model on full train set and evaluate on test
print("\n📊 Evaluating on test set...")
rf.fit(X_train, y_train)
y_pred = rf.predict(X_test)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred, 
      target_names=['CONFIRMED', 'CANDIDATE', 'FALSE POSITIVE']))