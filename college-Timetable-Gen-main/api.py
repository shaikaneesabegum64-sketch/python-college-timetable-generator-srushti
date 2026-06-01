from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import json
import os
from generator import generate_timetable as core_generate
from models import Teacher
from utils import save_timetable as core_save, load_timetable as core_load
from modules.replacement import replace_teacher as core_replace
from modules.reports import teacher_workload as core_workload
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_data():
    with open("data/subjects.json", "r") as f:
        subjects = json.load(f)
    with open("data/teachers.json", "r") as f:
        teachers_data = json.load(f)
        teachers = [Teacher(t["name"], t["subjects"]) for t in teachers_data]
    return subjects, teachers

class ReplaceRequest(BaseModel):
    day: str
    period: int
    absentTeacher: str

class TeacherUpdate(BaseModel):
    oldName: str
    newName: str
    subjects: list[str]

@app.get("/generate")
async def generate():
    subjects, teachers = get_data()
    timetable = core_generate(subjects, teachers)
    core_save(timetable)
    return timetable

@app.get("/load")
async def load():
    try:
        timetable = core_load()
        return timetable
    except:
        return {}

@app.get("/workload")
async def get_workload():
    try:
        timetable = core_load()
        if not timetable:
            return {}
        workload = {}
        for day in timetable:
            for period in timetable[day]:
                teacher = period["teacher"]
                workload[teacher] = workload.get(teacher, 0) + 1
        return workload
    except:
        return {}

@app.get("/config")
async def get_config():
    subjects, teachers = get_data()
    return {
        "subjects": subjects,
        "teachers": [{"name": t.name, "subjects": t.subjects} for t in teachers]
    }

@app.post("/save")
async def save(timetable: dict):
    core_save(timetable)
    return {"status": "success"}

@app.post("/update_teacher")
async def update_teacher(req: TeacherUpdate):
    with open("data/teachers.json", "r") as f:
        teachers = json.load(f)
    
    found = False
    for t in teachers:
        if t["name"] == req.oldName:
            t["name"] = req.newName
            t["subjects"] = req.subjects
            found = True
            break
    
    if not found:
        return {"status": "error", "message": "Teacher not found"}
        
    with open("data/teachers.json", "w") as f:
        json.dump(teachers, f, indent=4)
        
    return {"status": "success"}

@app.post("/replace")
async def replace(req: ReplaceRequest):
    subjects_list, teachers_list = get_data()
    timetable = core_load()
    
    # Core replace expects 0-based period
    result_message = core_replace(
        timetable, 
        req.day, 
        req.period - 1, 
        req.absentTeacher, 
        teachers_list
    )
    
    if "Replacement done" in result_message:
        core_save(timetable)
        return {"status": "success", "message": result_message}
    else:
        return {"status": "error", "message": result_message}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
