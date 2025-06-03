# file_io.py
import json
from ..models import Class, Lecturer, Room, Program, Subject

def read_input(file_path):
    with open(file_path, 'r') as file:
        data = json.load(file)
    
    classes = [Class(**c) for c in data['classes']]
    rooms = [Room(r['room_id'], r['type'], r['capacity']) for r in data['rooms']]
    
    lecturers = [
        Lecturer(
            l['lecturer_id'], 
            l['subjects'], 
            l['busy_slots']
        ) for l in data['lecturers']
    ]
    
    programs = []
    for p in data['programs']:
        subjects = [
            Subject(
                s['subject_id'], 
                s['name'], 
                s['theory_hours'], 
                s['practice_hours']
            ) for s in p['subjects']
        ]
        programs.append(Program(p['program_id'], p['duration'], subjects))
    
    time_slots = data['time_slots']
    
    return {
        'classes': classes,
        'rooms': rooms,
        'lecturers': lecturers,
        'programs': programs,
        'time_slots': time_slots
    }

def write_output(data, file_path):
    with open(file_path, 'w') as file:
        json.dump(data, file, indent=4)