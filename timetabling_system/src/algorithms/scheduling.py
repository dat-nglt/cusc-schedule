# scheduling.py
import random
from copy import deepcopy
from ..utils.validator import is_room_available, is_lecturer_available, is_class_available
from src.config import DAYS

def schedule_week(week, weekly_subjects, classes, rooms, lecturers, time_slots):
    schedule = {c.class_id: [] for c in classes}
    class_requirements = {}
    
    # Get requirements for each class
    for c in classes:
        req = {}
        for key, value in weekly_subjects.items():
            if key[0] == c.program_id:
                subject_id = key[1]
                if week <= len(value['theory']):
                    theory_count = value['theory'][week-1]
                    practice_count = value['practice'][week-1]
                    if theory_count > 0:
                        req[subject_id] = req.get(subject_id, {})
                        req[subject_id]['theory'] = theory_count
                    if practice_count > 0:
                        req[subject_id] = req.get(subject_id, {})
                        req[subject_id]['practice'] = practice_count
        class_requirements[c.class_id] = req
    
    # Create session list
    sessions_to_assign = []
    for class_id, req in class_requirements.items():
        for subject_id, types in req.items():
            for session_type, count in types.items():
                for _ in range(count):
                    sessions_to_assign.append((class_id, subject_id, session_type))
    
    # Prioritize practice sessions
    sessions_to_assign.sort(key=lambda x: 0 if x[2]=='practice' else 1)
    random.shuffle(sessions_to_assign)  # Add randomness
    
    # Assignment process
    for session in sessions_to_assign:
        class_id, subject_id, session_type = session
        class_obj = next(c for c in classes if c.class_id == class_id)
        assigned = False
        
        # Get suitable rooms
        suitable_rooms = [
            r for r in rooms 
            if r.type == session_type and r.capacity >= class_obj.size
        ]
        random.shuffle(suitable_rooms)
        
        # Get suitable lecturers
        suitable_lecturers = [
            l for l in lecturers 
            if subject_id in l.subjects
        ]
        random.shuffle(suitable_lecturers)
        
        # Try all possible day-slot combinations
        for day in random.sample(DAYS, len(DAYS)):
            for slot in random.sample(time_slots, len(time_slots)):
                slot_id = slot['slot_id']
                for room in suitable_rooms:
                    if not is_room_available(room.room_id, day, slot_id, schedule):
                        continue
                    for lecturer in suitable_lecturers:
                        if not is_lecturer_available(
                            lecturer.lecturer_id, day, slot_id, lecturers, schedule
                        ):
                            continue
                        if not is_class_available(class_id, day, slot_id, schedule):
                            continue
                            
                        # Assign session
                        session_info = {
                            'day': day,
                            'slot': slot_id,
                            'subject': subject_id,
                            'type': session_type,
                            'lecturer': lecturer.lecturer_id,
                            'room': room.room_id
                        }
                        schedule[class_id].append(session_info)
                        assigned = True
                        break
                    if assigned:
                        break
                if assigned:
                    break
            if assigned:
                break
                
    return schedule