# modules/add_data.py

import json


def add_subject(subject_name):

    try:
        with open("data/subjects.json", "r") as file:
            subjects = json.load(file)

    except:
        subjects = []

    subjects.append(subject_name)

    with open("data/subjects.json", "w") as file:
        json.dump(subjects, file, indent=4)

    print("Subject Added")


def add_teacher(name, subjects_list):

    try:
        with open("data/teachers.json", "r") as file:
            teachers = json.load(file)

    except:
        teachers = []

    teachers.append({
        "name": name,
        "subjects": subjects_list
    })

    with open("data/teachers.json", "w") as file:
        json.dump(teachers, file, indent=4)

    print("Teacher Added")