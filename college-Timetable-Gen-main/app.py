import tkinter as tk
from tkinter import ttk, messagebox
import random
import json

DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

PERIODS = 6

subjects = [
    "Maths",
    "Physics",
    "Chemistry",
    "English",
    "Computer",
    "Biology"
]

teachers = {
    "Maths": ["Ramesh Sir", "Mahesh Sir"],
    "Physics": ["Ramesh Sir"],
    "Chemistry": ["Suresh Sir"],
    "English": ["Anitha Madam"],
    "Computer": ["Kiran Sir"],
    "Biology": ["Lavanya Madam"]
}

timetable = {}


def generate_timetable():

    global timetable

    timetable.clear()

    for day in DAYS:

        timetable[day] = []

        for period in range(PERIODS):

            subject = random.choice(subjects)

            teacher = random.choice(
                teachers[subject]
            )

            timetable[day].append({
                "subject": subject,
                "teacher": teacher
            })

    display_timetable()

    messagebox.showinfo(
        "Success",
        "Timetable Generated Successfully"
    )


def display_timetable():

    for row in tree.get_children():
        tree.delete(row)

    for day in DAYS:

        values = [day]

        for p in timetable[day]:

            values.append(
                f"{p['subject']}\n{p['teacher']}"
            )

        tree.insert("", tk.END, values=values)


def save_timetable():

    with open("timetable.json", "w") as file:

        json.dump(timetable, file, indent=4)

    messagebox.showinfo(
        "Saved",
        "Timetable Saved Successfully"
    )


def load_timetable():

    global timetable

    try:

        with open("timetable.json", "r") as file:

            timetable = json.load(file)

        display_timetable()

        messagebox.showinfo(
            "Loaded",
            "Timetable Loaded Successfully"
        )

    except:

        messagebox.showerror(
            "Error",
            "No timetable file found"
        )


def replace_teacher():

    day = day_combo.get()

    period = int(period_combo.get()) - 1

    absent_teacher = absent_entry.get()

    current = timetable[day][period]

    subject = current["subject"]

    available = teachers[subject]

    replacement = None

    for t in available:

        if t != absent_teacher:

            replacement = t

            break

    if replacement:

        timetable[day][period]["teacher"] = replacement

        display_timetable()

        messagebox.showinfo(
            "Replacement Done",
            f"{replacement} assigned"
        )

    else:

        messagebox.showerror(
            "Error",
            "No replacement available"
        )


root = tk.Tk()

root.title("College Timetable Generator")

root.geometry("1200x600")

root.config(bg="#1e1e1e")


title = tk.Label(
    root,
    text="ADVANCED COLLEGE TIMETABLE GENERATOR",
    font=("Arial", 20, "bold"),
    bg="#1e1e1e",
    fg="white"
)

title.pack(pady=20)


button_frame = tk.Frame(root, bg="#1e1e1e")

button_frame.pack(pady=10)


generate_btn = tk.Button(
    button_frame,
    text="Generate Timetable",
    command=generate_timetable,
    bg="#4CAF50",
    fg="white",
    width=20,
    height=2
)

generate_btn.grid(row=0, column=0, padx=10)


save_btn = tk.Button(
    button_frame,
    text="Save Timetable",
    command=save_timetable,
    bg="#2196F3",
    fg="white",
    width=20,
    height=2
)

save_btn.grid(row=0, column=1, padx=10)


load_btn = tk.Button(
    button_frame,
    text="Load Timetable",
    command=load_timetable,
    bg="#FF9800",
    fg="white",
    width=20,
    height=2
)

load_btn.grid(row=0, column=2, padx=10)


replace_frame = tk.Frame(root, bg="#1e1e1e")

replace_frame.pack(pady=20)


tk.Label(
    replace_frame,
    text="Day",
    bg="#1e1e1e",
    fg="white"
).grid(row=0, column=0)


day_combo = ttk.Combobox(
    replace_frame,
    values=DAYS,
    width=12
)

day_combo.grid(row=1, column=0, padx=10)


tk.Label(
    replace_frame,
    text="Period",
    bg="#1e1e1e",
    fg="white"
).grid(row=0, column=1)


period_combo = ttk.Combobox(
    replace_frame,
    values=[1, 2, 3, 4, 5, 6],
    width=10
)

period_combo.grid(row=1, column=1, padx=10)


tk.Label(
    replace_frame,
    text="Absent Teacher",
    bg="#1e1e1e",
    fg="white"
).grid(row=0, column=2)


absent_entry = tk.Entry(
    replace_frame,
    width=20
)

absent_entry.grid(row=1, column=2, padx=10)


replace_btn = tk.Button(
    replace_frame,
    text="Replace Teacher",
    command=replace_teacher,
    bg="red",
    fg="white",
    width=18
)

replace_btn.grid(row=1, column=3, padx=10)


columns = [
    "Day",
    "Period 1",
    "Period 2",
    "Period 3",
    "Period 4",
    "Period 5",
    "Period 6"
]

tree = ttk.Treeview(
    root,
    columns=columns,
    show="headings",
    height=10
)

for col in columns:

    tree.heading(col, text=col)

    tree.column(col, width=160)

tree.pack(pady=20)

root.mainloop()