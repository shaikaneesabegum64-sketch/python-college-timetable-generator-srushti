import tkinter as tk
from tkinter import messagebox
import random
from openpyxl import Workbook

class TimeTableGenerator:
    def __init__(self, subjects, teachers, days, periods):
        self.subjects = subjects
        self.teachers = teachers
        self.days = days
        self.periods = periods
        self.timetable = {}

    def generate(self):
        for day in self.days:
            daily_schedule = []
            used = []

            for _ in range(self.periods):
                subject = random.choice(self.subjects)

                while subject in used:
                    subject = random.choice(self.subjects)

                used.append(subject)
                teacher = self.teachers[subject]
                daily_schedule.append((subject, teacher))

            self.timetable[day] = daily_schedule

    def save_to_file(self, filename="timetable.txt"):
        with open(filename, "w") as f:
            for day, schedule in self.timetable.items():
                f.write(f"{day}:\n")
                for i, (sub, teacher) in enumerate(schedule, 1):
                    f.write(f"  Period {i}: {sub} ({teacher})\n")
                f.write("\n")

    def export_to_excel(self, filename="timetable.xlsx"):
        wb = Workbook()
        ws = wb.active
        ws.title = "Timetable"

        # Header row
        headers = ["Day"] + [f"Period {i}" for i in range(1, self.periods+1)]
        ws.append(headers)

        # Data rows
        for day, schedule in self.timetable.items():
            row = [day]
            for sub, teacher in schedule:
                row.append(f"{sub}\n({teacher})")
            ws.append(row)

        wb.save(filename)


class App:
    def __init__(self, root):
        self.root = root
        self.root.title("College Timetable Generator")

        self.entries = []

        tk.Label(root, text="Enter 6 Subjects and Teachers").grid(row=0, column=0, columnspan=2)

        for i in range(6):
            sub_entry = tk.Entry(root)
            sub_entry.grid(row=i+1, column=0)
            sub_entry.insert(0, f"Subject {i+1}")

            teacher_entry = tk.Entry(root)
            teacher_entry.grid(row=i+1, column=1)
            teacher_entry.insert(0, f"Teacher {i+1}")

            self.entries.append((sub_entry, teacher_entry))

        tk.Button(root, text="Generate Timetable", command=self.generate).grid(row=7, column=0)
        tk.Button(root, text="Save as Text", command=self.save_text).grid(row=7, column=1)
        tk.Button(root, text="Export to Excel", command=self.export_excel).grid(row=8, column=0, columnspan=2)

        self.output = tk.Text(root, width=60, height=20)
        self.output.grid(row=9, column=0, columnspan=2)

        self.tt = None

    def generate(self):
        subjects = []
        teachers = {}

        for sub_entry, teacher_entry in self.entries:
            sub = sub_entry.get()
            teacher = teacher_entry.get()

            subjects.append(sub)
            teachers[sub] = teacher

        days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

        self.tt = TimeTableGenerator(subjects, teachers, days, 6)
        self.tt.generate()

        self.display()

    def display(self):
        self.output.delete("1.0", tk.END)

        for day, schedule in self.tt.timetable.items():
            self.output.insert(tk.END, f"{day}:\n")
            for i, (sub, teacher) in enumerate(schedule, 1):
                self.output.insert(tk.END, f"  Period {i}: {sub} ({teacher})\n")
            self.output.insert(tk.END, "\n")

    def save_text(self):
        if self.tt:
            self.tt.save_to_file()
            messagebox.showinfo("Success", "Saved as timetable.txt")
        else:
            messagebox.showwarning("Warning", "Generate timetable first!")

    def export_excel(self):
        if self.tt:
            self.tt.export_to_excel()
            messagebox.showinfo("Success", "Exported as timetable.xlsx")
        else:
            messagebox.showwarning("Warning", "Generate timetable first!")


if __name__ == "__main__":
    root = tk.Tk()
    app = App(root)
    root.mainloop()