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
    df = pd.read_csv(os.path.join(DATA_DIR, "k2_oi.csv"), comment="#")
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

if __name__ == "__main__":
    kepler = load_and_clean_kepler()
    k2 = load_and_clean_k2()
    tess = load_and_clean_tess()

    kepler.to_csv(os.path.join(DATA_DIR, "kepler_clean.csv"), index=False)
    k2.to_csv(os.path.join(DATA_DIR, "k2_clean.csv"), index=False)
    tess.to_csv(os.path.join(DATA_DIR, "tess_clean.csv"), index=False)

    print("✅ Clean files saved!")