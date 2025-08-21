import json
import datetime
from collections import defaultdict
import copy
from typing import Dict, Any, List, Tuple, Set

# Assuming these functions are already defined and can be imported
from data_processing.processor import DataProcessor
from utils.find_new_valid_slot import find_new_valid_slot
from utils.get_data_for_semester import get_data_for_semester

def build_occupied_slots_from_schedule(schedule: Dict[str, Any], new_constraints: Dict[str, Any]) -> Dict[str, Dict[str, Dict[str, Set[str]]]]:
    """
    Creates a dictionary of occupied time slots from the existing schedule
    and newly added constraints.

    Args:
        schedule (Dict[str, Any]): The current semester schedule.
        new_constraints (Dict[str, Any]): The new constraints (lecturers busy, rooms unavailable).

    Returns:
        Dict[str, Dict[str, Dict[str, Set[str]]]]: A nested dictionary
            representing occupied resources by date and time slot.
    """
    occupied = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set(), 'classes': set()}))

    # Add new constraints to the occupied slots
    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            occupied[slot['date']][slot['slot_id']]['lecturers'].add(lecturer_id)
            
    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            occupied[slot['date']][slot['slot_id']]['rooms'].add(room_id)

    # Add data from the existing schedule to the occupied slots
    for semester in schedule.get('semesters', []):
        for cls in semester.get('classes', []):
            cls_id = cls['class_id']
            for lesson in cls.get('schedule', []):
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                
                if date and slot_id:
                    if lecturer_id: occupied[date][slot_id]['lecturers'].add(lecturer_id)
                    if room_id: occupied[date][slot_id]['rooms'].add(room_id)
                    occupied[date][slot_id]['classes'].add(cls_id)
                    
    return occupied

def detect_new_conflicts(semester_schedule: Dict[str, Any], new_constraints: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Identifies lessons in the current schedule that are in conflict with the new constraints.

    Args:
        semester_schedule (Dict[str, Any]): The existing semester schedule.
        new_constraints (Dict[str, Any]): The new constraints to check against.

    Returns:
        List[Dict[str, Any]]: A list of conflicting lessons, including detailed
                              information.
    """
    conflicting_lessons = []
    
    # Create sets for quick lookup of new constraints
    new_lecturer_busy_slots = set()
    new_room_unavailable_slots = set()

    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            new_lecturer_busy_slots.add((lecturer_id, slot.get('date'), slot.get('slot_id')))

    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            new_room_unavailable_slots.add((room_id, slot.get('date'), slot.get('slot_id')))
            
    # Iterate through the entire schedule to find conflicts
    for semester in semester_schedule.get('semesters', []):
        semester_id = semester.get('semester_id')
        for cls in semester.get('classes', []):
            cls_id = cls.get('class_id')
            for lesson in cls.get('schedule', []):
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                
                # Check for conflict with lecturer constraints
                if (lecturer_id, date, slot_id) in new_lecturer_busy_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                    
                # Check for conflict with room constraints (only if no conflict was found with lecturer)
                elif (room_id, date, slot_id) in new_room_unavailable_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                        
    return conflicting_lessons

def update_schedule(schedule: Dict[str, Any], old_lesson: Dict[str, Any], new_lesson_info: Tuple[str, str, str, str]):
    """
    Finds and removes the old lesson from the schedule, then inserts the updated lesson.
    
    Args:
        schedule (Dict[str, Any]): The original semester schedule.
        old_lesson (Dict[str, Any]): The details of the old lesson.
        new_lesson_info (Tuple[str, str, str, str]): A tuple containing the new information:
                                                     (date, slot_id, room_id, lecturer_id).
    """
    new_date, new_slot_id, new_room_id, new_lecturer_id = new_lesson_info
    
    # Create a copy of old_lesson and update the fields
    updated_lesson = copy.deepcopy(old_lesson)
    updated_lesson.update({
        'slot_id': new_slot_id,
        'room_id': new_room_id,
        'lecturer_id': new_lecturer_id,
        'date': new_date,
        'day': datetime.datetime.strptime(new_date, "%Y-%m-%d").strftime("%a")
    })
    
    # Iterate through the schedule to find and replace the lesson
    for semester in schedule.get('semesters', []):
        if semester.get('semester_id') == old_lesson.get('semester_id'):
            for cls in semester.get('classes', []):
                if cls.get('class_id') == old_lesson.get('class_id'):
                    # Create a new list, excluding the old lesson
                    cls['schedule'] = [
                        l for l in cls['schedule'] 
                        if not (l.get('lesson_id') == old_lesson.get('lesson_id') and l.get('slot_id') == old_lesson.get('slot_id') and l.get('date') == old_lesson.get('date'))
                    ]
                    # Add the updated lesson
                    cls['schedule'].append(updated_lesson)
                    return # Exit early once found and updated

if __name__ == "__main__":
    try:
        with open('results/all_semesters.json', 'r', encoding='utf-8') as f:
            semester_schedule = json.load(f)
        with open('input_data.json', 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            
        full_processed_data = DataProcessor(raw_data)
        
    except FileNotFoundError:
        print("Error: The data file 'all_semesters.json' or 'input_data.json' was not found.")
        exit()

    # Define new constraints
    new_constraints = {
        'lecturers': {
            'GV001': [
                {'date': '2025-08-16', 'slot_id': 'S1'}
            ]
        },
        'rooms': {
            'R104': [
                {'date': '2025-11-20', 'slot_id': 'S2'}
            ]
        }
    }
    
    # Step 1: Detect conflicting lessons
    lessons_to_fix = detect_new_conflicts(semester_schedule, new_constraints)

    if lessons_to_fix:
        print("Found lessons conflicting with new constraints:")
        for i, lesson in enumerate(lessons_to_fix):
            print(f"--- Lesson #{i+1} ---")
            print(f"   Semester: {lesson.get('semester_id')}")
            print(f"   Class: {lesson.get('class_id')}")
            print(f"   Subject: {lesson.get('subject_id')}")
            print(f"   Type: {lesson.get('lesson_type')}")
            print(f"   Date: {lesson.get('date')} ({lesson.get('day')})")
            print(f"   Slot: {lesson.get('slot_id')}")
            print(f"   Lecturer: {lesson.get('lecturer_id')}")
            print(f"   Room: {lesson.get('room_id')}")
        
        print("\nStarting to find new slots for these lessons...")
        
        # Step 2: Build occupied_slots from the old schedule and new constraints
        occupied_slots = build_occupied_slots_from_schedule(semester_schedule, new_constraints)
        
        unfixable_lessons = []
        # Step 3: Find new slots and update the schedule
        for lesson in lessons_to_fix:
            semester_id = lesson.get('semester_id')
            semester_data = get_data_for_semester(semester_id, full_processed_data)
                
            if not semester_data:
                unfixable_lessons.append(lesson)
                continue
                
            class_id = lesson.get('class_id')
            class_info = semester_data.class_map.get(class_id)
            program_id = class_info.get('program_id') if class_info else None
            program_info = semester_data.program_map.get(program_id)
            program_duration_weeks = program_info.get('duration') if program_info else 0
                
            semester_info = semester_data.semester_map.get(semester_id)
            semester_start_date_str = semester_info.get('start_date') if semester_info else None
            
            if not semester_start_date_str:
                unfixable_lessons.append(lesson)
                continue
                    
            semester_start_date = datetime.datetime.strptime(semester_start_date_str, '%Y-%m-%d')
                
            new_slot_info = find_new_valid_slot(lesson, semester_data, occupied_slots, program_duration_weeks, semester_start_date)
            
            if new_slot_info:
                print(f"   > Lesson for class {lesson['class_id']} - subject {lesson['subject_id']} has been moved to {new_slot_info[0]} at slot {new_slot_info[1]}.")
                update_schedule(semester_schedule, lesson, new_slot_info)
                
                # Update occupied_slots to prevent conflicts with subsequent lessons
                old_date, old_slot = lesson['date'], lesson['slot_id']
                new_date, new_slot_id, new_room_id, new_lecturer_id = new_slot_info
                
                occupied_slots[old_date][old_slot]['lecturers'].discard(lesson.get('lecturer_id'))
                occupied_slots[old_date][old_slot]['rooms'].discard(lesson.get('room_id'))
                occupied_slots[old_date][old_slot]['classes'].discard(lesson.get('class_id'))
                
                occupied_slots[new_date][new_slot_id]['lecturers'].add(new_lecturer_id)
                occupied_slots[new_date][new_slot_id]['rooms'].add(new_room_id)
                occupied_slots[new_date][new_slot_id]['classes'].add(lesson.get('class_id'))
            else:
                print(f"   > Warning: A new slot could not be found for the lesson of class {lesson['class_id']} - subject {lesson['subject_id']}.")
                unfixable_lessons.append(lesson)

        # Write the updated schedule to a file
        with open('updated_all_schedules.json', 'w', encoding='utf-8') as f:
            json.dump(semester_schedule, f, indent=4, ensure_ascii=False)
        print("\nSchedule has been successfully updated and saved to 'updated_all_schedules.json'.")

        if unfixable_lessons:
            print("\nNote: Some lessons could not be re-scheduled. Please handle them manually:")
            for lesson in unfixable_lessons:
                print(f"   - Class: {lesson.get('class_id')}, Subject: {lesson.get('subject_id')}, Date: {lesson.get('date')}")
    else:
        print("No lessons were in conflict with the new constraints.")