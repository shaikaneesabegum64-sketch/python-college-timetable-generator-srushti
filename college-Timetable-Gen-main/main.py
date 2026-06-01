# main.py

import json

from models import Teacher

from generator import generate_timetable

from modules.timetable_ops import (
    display_timetable,
    modify_timetable
)

from modules.replacement import replace_teacher

from modules.reports import teacher_workload

from utils import save_timetable, load_timetable


def load_teachers():

    with open("data/teachers.json", "r") as file:
        data = json.load(file)

    teachers = []

    for t in data:
        teachers.append(
            Teacher(
                t["name"],
                t["subjects"]
            )
        )

    return teachers


def load_subjects():

    with open("data/subjects.json", "r") as file:
        return json.load(file)


teachers = load_teachers()

subjects = load_subjects()

timetable = {}


while True:

    print("\n===== COLLEGE TIMETABLE GENERATOR =====")

    print("1. Generate Timetable")
    print("2. Display Timetable")
    print("3. Modify Timetable")
    print("4. Replace Absent Teacher")
    print("5. Teacher Workload Report")
    print("6. Save Timetable")
    print("7. Load Timetable")
    print("8. Exit")

    choice = input("Enter Choice: ")

    if choice == "1":

        timetable = generate_timetable(
            subjects,
            teachers
        )

        print("\nTimetable Generated Successfully")

    elif choice == "2":

        if timetable:
            display_timetable(timetable)
        else:
            print("Generate timetable first")

    elif choice == "3":

        if not timetable:
            print("Generate timetable first")
            continue

        day = input("Enter Day: ").capitalize()

        period = int(input("Enter Period Number: ")) - 1

        new_subject = input("Enter New Subject: ")

        new_teacher = input("Enter New Teacher: ")

        print(
            modify_timetable(
                timetable,
                day,
                period,
                new_subject,
                new_teacher
            )
        )

    elif choice == "4":

        if not timetable:
            print("Generate timetable first")
            continue

        day = input("Enter Day: ").capitalize()

        period = int(input("Enter Period Number: ")) - 1

        absent_teacher = input("Absent Teacher Name: ")

        result = replace_teacher(
            timetable,
            day,
            period,
            absent_teacher,
            teachers
        )

        print(result)

    elif choice == "5":

        teacher_workload(timetable)

    elif choice == "6":

        save_timetable(timetable)

    elif choice == "7":

        timetable = load_timetable()

        print("Timetable Loaded")

    elif choice == "8":

        print("Exiting Program")

        break

    else:
        print("Invalid Choice")