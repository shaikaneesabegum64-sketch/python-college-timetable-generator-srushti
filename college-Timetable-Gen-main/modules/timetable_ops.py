# modules/timetable_ops.py

def display_timetable(timetable):

    for day, periods in timetable.items():

        print(f"\n===== {day} =====")

        for i, p in enumerate(periods, start=1):
            print(
                f"Period {i}: "
                f"{p['subject']} "
                f"({p['teacher']})"
            )


def modify_timetable(timetable, day, period, new_subject, new_teacher):

    if day not in timetable:
        return f"Error: {day} not found in timetable"

    if period < 0 or period >= len(timetable[day]):
        return f"Error: Period {period + 1} is invalid"

    timetable[day][period] = {
        "subject": new_subject,
        "teacher": new_teacher
    }

    return "Timetable Updated"