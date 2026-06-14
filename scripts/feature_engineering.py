import pandas as pd
import numpy as np
import os

DATA_DIR = "data"

def engineer_kepler_features(df):
    if "koi_depth" in df.columns and "koi_duration" in df.columns:
        df["depth_x_duration"] = df["koi_depth"] * df["koi_duration"]
    if "koi_model_snr" in df.columns and "koi_duration" in df.columns:
        df["snr_ratio"] = df["koi_model_snr"] / (df["koi_duration"] + 1e-9)
    print(f"Kepler features engineered: {df.shape[1]} cols")
    return df

def engineer_tess_features(df):
    if "pl_trandep" in df.columns and "pl_trandurh" in df.columns:
        df["depth_x_duration"] = df["pl_trandep"] * df["pl_trandurh"]
    if "toi_model_snr" in df.columns and "pl_trandurh" in df.columns:
        df["snr_ratio"] = df["toi_model_snr"] / (df["pl_trandurh"] + 1e-9)
    print(f"TESS features engineered: {df.shape[1]} cols")
    return df

if __name__ == "__main__":
    kepler = pd.read_csv(os.path.join(DATA_DIR, "kepler_clean.csv"))
    tess = pd.read_csv(os.path.join(DATA_DIR, "tess_clean.csv"))

    kepler = engineer_kepler_features(kepler)
    tess = engineer_tess_features(tess)

    kepler.to_csv(os.path.join(DATA_DIR, "kepler_features.csv"), index=False)
    tess.to_csv(os.path.join(DATA_DIR, "tess_features.csv"), index=False)

    print("✅ Feature files saved!")