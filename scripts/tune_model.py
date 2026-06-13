import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import GridSearchCV, StratifiedKFold
from sklearn.metrics import classification_report, confusion_matrix
from preprocess import load_and_preprocess

# Load and preprocess data
path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\kepler_features.csv"
X_train, X_test, y_train, y_test, scaler, imputer = load_and_preprocess(path)

# Parameter grid
param_grid = {
    'n_estimators': [100, 200, 300],
    'max_depth': [10, 20, None],
    'min_samples_split': [2, 5],
    'class_weight': ['balanced']
}

print("\n🔍 Running GridSearchCV (this will take a few minutes)...")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
grid = GridSearchCV(
    RandomForestClassifier(random_state=42),
    param_grid,
    cv=cv,
    scoring='recall_macro',
    n_jobs=-1,
    verbose=2
)
grid.fit(X_train, y_train)

print(f"\n✅ Best params: {grid.best_params_}")
print(f"✅ Best recall: {grid.best_score_:.3f}")

# Evaluate best model on test set
print("\n📊 Evaluating best model on test set...")
best_model = grid.best_estimator_
y_pred = best_model.predict(X_test)

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

print("\nClassification Report:")
print(classification_report(y_test, y_pred,
      target_names=['CONFIRMED', 'CANDIDATE', 'FALSE POSITIVE']))