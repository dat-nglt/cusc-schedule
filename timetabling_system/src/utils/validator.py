# validator.py
def is_room_available(room_id, day, slot, schedule):
    for class_schedule in schedule.values():
        for session in class_schedule:
            if session['room'] == room_id and session['day'] == day and session['slot'] == slot:
                return False
    return True

def is_lecturer_available(lecturer_id, day, slot, lecturers, schedule):
    # Check lecturer's busy slots
    lecturer = next((l for l in lecturers if l.lecturer_id == lecturer_id), None)
    if not lecturer:
        return False
    
    for busy in lecturer.busy_slots:
        if busy['day'] == day and busy['slot'] == slot:
            return False
    
    # Check if lecturer is already scheduled
    for class_schedule in schedule.values():
        for session in class_schedule:
            if session['lecturer'] == lecturer_id and session['day'] == day and session['slot'] == slot:
                return False
    return True

def is_class_available(class_id, day, slot, schedule):
    if class_id not in schedule:
        return True
    for session in schedule[class_id]:
        if session['day'] == day and session['slot'] == slot:
            return False
    return True
