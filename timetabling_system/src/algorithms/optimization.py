# optimization.py
def optimize_schedule(schedule, classes, rooms, lecturers):
    # Simple optimization: Avoid consecutive 4+ sessions
    for class_id, sessions in schedule.items():
        day_groups = {}
        for session in sessions:
            day = session['day']
            if day not in day_groups:
                day_groups[day] = []
            day_groups[day].append(session)
        
        for day, day_sessions in day_groups.items():
            if len(day_sessions) > 3:
                # Try to move sessions to other days
                movable = find_movable_session(day_sessions, schedule, class_id)
                if movable:
                    new_day = find_available_day(movable, schedule, class_id)
                    if new_day:
                        schedule[class_id].remove(movable)
                        movable['day'] = new_day
                        schedule[class_id].append(movable)
    return schedule

def find_movable_session(sessions, schedule, class_id):
    # Find session without dependencies
    for session in sessions:
        if session['type'] == 'theory':  # Practice might have room constraints
            return session
    return None

def find_available_day(session, schedule, class_id):
    for day in DAYS:
        if day == session['day']:
            continue
        if is_class_available(class_id, day, session['slot'], schedule):
            return day
    return None