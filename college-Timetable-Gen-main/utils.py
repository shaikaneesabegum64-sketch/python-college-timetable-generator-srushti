# utils.py

import json


def save_timetable(timetable):

    with open("data/timetable.json", "w") as file:
        json.dump(timetable, file, indent=4)

    print("Timetable Saved")


def load_timetable():

    try:
        with open("data/timetable.json", "r") as file:
            return json.load(file)

    except FileNotFoundError:
        return {}