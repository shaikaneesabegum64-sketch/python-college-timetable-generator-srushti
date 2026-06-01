# modules/reports.py

def teacher_workload(timetable):

    workload = {}

    for day in timetable:

        for period in timetable[day]:

            teacher = period["teacher"]

            if teacher in workload:
                workload[teacher] += 1
            else:
                workload[teacher] = 1

    print("\n===== TEACHER WORKLOAD =====")

    for teacher, count in workload.items():
        print(f"{teacher} -> {count} periods")