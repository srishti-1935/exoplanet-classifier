import pandas as pd
import os

DATA_DIR = "data"

def load_and_clean_kepler():
    df = pd.read_csv(os.path.join(DATA_DIR, "kepler_koi.csv"), comment="#")
    df.columns = df.columns.str.strip().str.lower()
    df = df.drop_duplicates()
    df["mission"] = "kepler"
    print(f"Kepler: {df.shape[0]} rows, {df.shape[1]} cols")
    return df

def load_and_clean_k2():
    df = pd.read_csv(os.path.join(DATA_DIR, "k2_oi.csv"), comment="#", low_memory=False)
    df.columns = df.columns.str.strip().str.lower()
    df = df.drop_duplicates()
    df["mission"] = "k2"
    print(f"K2: {df.shape[0]} rows, {df.shape[1]} cols")
    return df

def load_and_clean_tess():
    df = pd.read_csv(os.path.join(DATA_DIR, "tess_toi.csv"), comment="#")
    df.columns = df.columns.str.strip().str.lower()
    df = df.drop_duplicates()
    df["mission"] = "tess"
    print(f"TESS: {df.shape[0]} rows, {df.shape[1]} cols")
    return df

def align_k2_to_kepler(k2_df, kepler_df):
    column_map = {
        "pl_orbper": "koi_period",
        "pl_trandep": "koi_depth",
        "pl_trandurh": "koi_duration",
        "pl_rade": "koi_prad",
        "st_teff": "koi_steff",
        "st_logg": "koi_slogg",
        "st_rad": "koi_srad",
        "pl_eqt": "koi_teq",
        "st_mass": "koi_smass",
    }

    k2_aligned = k2_df.rename(columns=column_map)
    common_cols = [c for c in kepler_df.columns if c in k2_aligned.columns]
    k2_aligned = k2_aligned[common_cols]

    print(f"K2 aligned: {k2_aligned.shape[0]} rows, {k2_aligned.shape[1]} common cols")
    return k2_aligned

if __name__ == "__main__":
    kepler = load_and_clean_kepler()
    k2 = load_and_clean_k2()
    tess = load_and_clean_tess()

    kepler.to_csv(os.path.join(DATA_DIR, "kepler_clean.csv"), index=False)
    k2.to_csv(os.path.join(DATA_DIR, "k2_clean.csv"), index=False)
    tess.to_csv(os.path.join(DATA_DIR, "tess_clean.csv"), index=False)

    k2_aligned = align_k2_to_kepler(k2, kepler)
    k2_aligned.to_csv(os.path.join(DATA_DIR, "k2_aligned.csv"), index=False)

    print("✅ Clean files saved!")