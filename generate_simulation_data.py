import json
import random
from datetime import datetime, timedelta

parameter_sets = ["Alpha", "BetaSet", "Delta v2", "GammaSet"]
statuses = ["completed", "running", "failed", "pending"]

def generate_data(num_points=150):
    data = []
    base_time = datetime(2025, 5, 1, 10, 0)

    for i in range(num_points):
        timestamp = base_time + timedelta(minutes=5 * i)
        value = random.choice([
            round(random.uniform(10, 200), 2),  # valid value
            None,                                # missing value
            "invalid"                            # invalid string
        ])
        entry = {
            "id": f"sim{i+1:03d}",
            "timestamp": timestamp.isoformat() + "Z",
            "value": value,
            "parameter_set": random.choice(parameter_sets),
            "status": random.choice(statuses)
        }
        data.append(entry)

    return data

if __name__ == "__main__":
    data = generate_data()
    with open("public/simulation_data.json", "w") as f:
        json.dump(data, f, indent=2)

    print("File 'simulation_data.json' generato con successo!")
