import json

with open("./data/content.json", "r") as file:
    data = json.load(file)
    print(data)

new_item = dict()

new_item["name"] = input("Vnesite klinično prezentacijo (kakšna okužba, kako povzročena): ")
new_item["culprits"] = dict()

while True:
    povzročitelj = input("Vnesite možnega povzročitelja ('' za prekinitev): ")
    if povzročitelj != '':
        prevalenca = input("Kako pogosto se pojavlja? (samo številka v odsotkih): ")
        new_item["culprits"][povzročitelj] = prevalenca
    else:
        break

data.append(new_item)
with open("./data/content.json", "w") as file:
    json.dump(data, file, indent=4)
