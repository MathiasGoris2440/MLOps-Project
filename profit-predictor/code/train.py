import argparse
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.ensemble import GradientBoostingRegressor
import pickle
import os

parser = argparse.ArgumentParser()
parser.add_argument("--data", type=str)
parser.add_argument("--model_output", type=str)

args = parser.parse_args()

df = pd.read_csv(args.data)
df = df.drop(columns=['outcome_damage_inc', 'outcome_damage_amount'])

def main():
    df_shuffle = df.sample(frac=1, random_state=42)

    X = df_shuffle.drop(columns='outcome_profit')
    y = df_shuffle['outcome_profit']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    params = {
        'criterion': 'squared_error',
        'learning_rate': 0.32,
        'loss': 'huber',
        'max_depth': 3,
        'max_features': 'sqrt',
        'max_leaf_nodes': 120,
        'min_samples_leaf': 11,
        'min_samples_split': 7,
        'n_estimators': 367
    }
    model = GradientBoostingRegressor(**params, random_state=42)
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    print("Mean Squared Error:", mean_squared_error(y_test, y_pred))
    print("Mean Absolute Error:", mean_absolute_error(y_test, y_pred))
    print("R^2 Score:", r2_score(y_test, y_pred))

    os.makedirs(args.model_output, exist_ok=True)
    with open(os.path.join(args.model_output, "model.pkl"), "wb") as f:
        pickle.dump(model, f)

if __name__ == "__main__":
    main()
