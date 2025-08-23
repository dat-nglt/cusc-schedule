import sys
import os
import json
from typing import Dict, Any

def check_hard_constraints(date_str, day_of_week_eng, slot_id, room_id, lecturer_id, class_id, occupied_slots, processed_data):
    """
    Checks all hard constraints for a given lesson.
    Returns True if there are no conflicts, otherwise returns False and prints the reason.

    Args:
        date_str (str): The date of the lesson (e.g., "2025-10-27").
        day_of_week_eng (str): The name of the day of the week (e.g., "Monday").
        slot_id (int): The ID of the time slot.
        room_id (int): The ID of the room.
        lecturer_id (int): The ID of the lecturer.
        class_id (int): The ID of the class.
        occupied_slots (dict): The current schedule, storing assigned slots.
        processed_data (object): An object containing processed data (lecturer_map, etc.).

    Returns:
        bool: True if there are no conflicts, False otherwise.
    """
    reasons = []

    # Constraint 1: Lecturer, room, and class cannot have scheduling conflicts
    # Check if the lecturer is already busy in this slot
    if lecturer_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('lecturers', set()):
        reasons.append("Lecturer is already assigned to another lesson.")
    
    # Check if the room is already in use in this slot
    if room_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('rooms', set()):
        reasons.append("Room is already assigned to another lesson.")
        
    # Check if the class already has a schedule in this slot
    if class_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('classes', set()):
        reasons.append("Class is already assigned to another lesson.")

    # Constraint 2: Lecturer is busy according to a fixed weekly schedule
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    busy_weekly_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in busy_weekly_slots:
        if busy_slot.get('day') == day_of_week_eng and busy_slot.get('slot_id') == slot_id:
            reasons.append("Lecturer is busy according to a fixed weekly schedule.")
            break

    # Constraint 3: Lecturer is busy on a specific date (semester_busy_slots)
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            reasons.append("Lecturer is busy on a specific date.")
            break
    
    # Return result
    if reasons:
        # print(f"Failed: {', '.join(reasons)}")
        return False
    
    # print("Valid!")
    return True