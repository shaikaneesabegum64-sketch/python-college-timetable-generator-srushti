# generator.py

import random

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

PERIODS = 6


def generate_timetable(subjects, teachers):

    timetable = {}

    teacher_schedule = {}

    for teacher in teachers:
        teacher_schedule[teacher.name] = {}

    for day in DAYS:

        timetable[day] = []

        used_subjects = []

        for period in range(PERIODS):

            available_subjects = [
                s for s in subjects
                if used_subjects.count(s) < 2
            ]

            subject = random.choice(available_subjects)

            available_teachers = []

            for teacher in teachers:

                if subject in teacher.subjects:

                    if period not in teacher_schedule[teacher.name].get(day, []):

                        available_teachers.append(teacher)

            if available_teachers:

                teacher = random.choice(available_teachers)

                if day not in teacher_schedule[teacher.name]:
                    teacher_schedule[teacher.name][day] = []

                teacher_schedule[teacher.name][day].append(period)

                teacher_name = teacher.name

            else:
                teacher_name = "No Teacher"

            timetable[day].append({
                "subject": subject,
                "teacher": teacher_name
            })

            used_subjects.append(subject)

    return timetable