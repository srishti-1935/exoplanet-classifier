import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler
from sklearn.impute import SimpleImputer
from imblearn.over_sampling import SMOTE
from sklearn.model_selection import train_test_split

FEATURES = ['koi_period','koi_duration','koi_depth','koi_prad',
            'koi_steff','koi_impact','koi_model_snr','koi_srad',
            'koi_teq','koi_insol','depth_x_duration','snr_ratio']

TARGET = 'koi_disposition'

LABEL_MAP = {'CONFIRMED': 0, 'CANDIDATE': 1, 'FALSE POSITIVE': 2}

def load_and_preprocess(path):
    # Load data
    df = pd.read_csv(path)
    print(f"✅ Loaded: {df.shape}")

    # Keep only labeled rows
    df = df[df[TARGET].isin(LABEL_MAP.keys())]
    print(f"✅ After filtering labels: {df.shape}")

    # Features and target
    X = df[FEATURES]
    y = df[TARGET].map(LABEL_MAP)

    # Impute nulls with median
    imputer = SimpleImputer(strategy='median')
    X_imputed = imputer.fit_transform(X)
    print(f"✅ Nulls imputed")

    # Normalize
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X_imputed)
    print(f"✅ Features normalized")

    # SMOTE for class imbalance
    sm = SMOTE(random_state=42)
    X_res, y_res = sm.fit_resample(X_scaled, y)
    print(f"✅ SMOTE applied — new shape: {X_res.shape}")
    print(f"   Class counts after SMOTE: {pd.Series(y_res).value_counts().to_dict()}")

    # Train/test split
    X_train, X_test, y_train, y_test = train_test_split(
        X_res, y_res, test_size=0.2, random_state=42, stratify=y_res
    )
    print(f"✅ Train: {X_train.shape} | Test: {X_test.shape}")

    return X_train, X_test, y_train, y_test, scaler, imputer


if __name__ == "__main__":
    path = r"c:\Users\prabh\exoplanet-hackathon\exoplanet-classifier\data\kepler_features.csv"
    X_train, X_test, y_train, y_test, scaler, imputer = load_and_preprocess(path)
    print("\n🎉 Preprocessing complete!")