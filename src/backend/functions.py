import json

def _get_infections():
    with open("./data/content.json", "r") as file:
        data = json.load(file)

    return [item["name"] for item in data]

def _get_antibiotics():
    with open("./data/antibiotics.json", "r") as file:
        data = json.load(file)

    return [item["name"] for item in data]

def _get_culprits(disease):
    with open("./data/content.json", "r") as file:
        data = json.load(file)

    matched_disease = [item for item in data if item["name"] == disease]
    if not matched_disease:
        return IndexError("Invalid disease parameter. Are you sure the code works?")
    culprits = matched_disease[0]["culprits"]
    culprits = dict(sorted(culprits.items(), key = lambda x: int(x[1]), reverse=True))
    return culprits
