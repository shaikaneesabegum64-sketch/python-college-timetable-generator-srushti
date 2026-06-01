# modules/replacement.py

def replace_teacher(timetable, day, period, absent_teacher, teachers):

    if day not in timetable:
        return f"Error: {day} not found in timetable"

    if period < 0 or period >= len(timetable[day]):
        return f"Error: Period {period + 1} is invalid"

    current = timetable[day][period]

    if current["teacher"] != absent_teacher:
        return "Teacher not assigned in this period"

    subject = current["subject"]

    for teacher in teachers:
        if subject in teacher.subjects and teacher.name != absent_teacher:
            current["teacher"] = teacher.name
            return f"Replacement done: {teacher.name}"

    return "No replacement available"