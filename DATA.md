# Data Sources

## Datasets Used

### 1. Kepler KOI (Cumulative)
- **Source:** NASA Exoplanet Archive
- **File:** `data/kepler_koi.csv`
- **Rows:** 9,564 | **Cols:** 154
- **Key Columns:** `koi_period`, `koi_depth`, `koi_duration`, `koi_prad`, `koi_disposition`
- **License:** Public Domain (NASA)
- **Download:** https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=cumulative&select=*&format=csv

### 2. K2 Planets and Candidates
- **Source:** NASA Exoplanet Archive
- **File:** `data/k2_oi.csv`
- **Rows:** 4,049 | **Cols:** 363
- **Key Columns:** `pl_orbper`, `pl_trandep`, `pl_trandurh`, `pl_rade`, `st_teff`
- **License:** Public Domain (NASA)
- **Download:** https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=select+*+from+k2pandc&format=csv

### 3. TESS TOI
- **Source:** NASA Exoplanet Archive
- **File:** `data/tess_toi.csv`
- **Rows:** 7,931 | **Cols:** 110
- **Key Columns:** `pl_orbper`, `pl_trandep`, `pl_trandurh`, `tfopwg_disp`
- **License:** Public Domain (NASA)
- **Download:** https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?table=TOI&select=*&format=csv

## Derived Files

| File | Description |
|---|---|
| `kepler_clean.csv` | Kepler with deduplication and standardized columns |
| `k2_clean.csv` | K2 with deduplication and standardized columns |
| `tess_clean.csv` | TESS with deduplication and standardized columns |
| `k2_aligned.csv` | K2 columns mapped to Kepler schema (11 common cols) |
| `kepler_features.csv` | Kepler + engineered features (depth×duration, SNR ratio) |
| `tess_features.csv` | TESS + engineered features (depth×duration, SNR ratio) |
| `tess_holdout.csv` | TESS confirmed/false-positive rows only, with binary label |

## Engineered Features

| Feature | Formula | Description |
|---|---|---|
| `depth_x_duration` | `transit_depth × transit_duration` | Interaction term capturing transit shape |
| `snr_ratio` | `model_snr / transit_duration` | Signal strength per unit time |

## TESS Holdout Labels

| Label | Value | Meaning |
|---|---|---|
| CP | 1 | Confirmed Planet |
| KP | 1 | Known Planet |
| FP | 0 | False Positive |
| FA | 0 | False Alarm |