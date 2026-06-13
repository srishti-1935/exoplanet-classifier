from sklearn.ensemble import RandomForestClassifier
import joblib
import numpy as np

X = np.random.rand(100, 12)
y = np.random.choice(["CONFIRMED", "CANDIDATE", "FALSE POSITIVE"], 100)

model = RandomForestClassifier()
model.fit(X, y)

joblib.dump(model, "models/model.pkl")
print("Dummy model saved!")