from collections import defaultdict
from typing import Dict, Any, List

def format_semester_schedule(semester_schedule: Dict[str, List[List[Dict[str, Any]]]], processed_data: Any) -> str:
    """
    Formats a semester's timetable data for easy-to-read console output.

    This function organizes the schedule by class, then by week and day. It includes
    detailed lesson information and handles cases where lessons are unassigned.

    Args:
        semester_schedule (Dict[str, List[List[Dict[str, Any]]]]): The semester's schedule data,
                                                                  organized by class, week, and lessons.
        processed_data (Any): The object containing processed data, including maps for
                              (class_map, program_map, subject_map, lecturer_map, slot_order_map).

    Returns:
        str: A formatted string ready to be printed to the console.
    """
    output_lines = []
    
    # Sort class_ids to ensure consistent output order
    sorted_class_ids = sorted(semester_schedule.keys())
    
    # Iterate through each class to format its schedule
    for class_id in sorted_class_ids:
        weekly_schedules = semester_schedule.get(class_id, [])
        cls_info = processed_data.class_map.get(class_id, {})
        program_id = cls_info.get('program_id')
        program_name = processed_data.program_map.get(program_id, {}).get('program_name', program_id)
        
        # Add a header for the current class
        output_lines.append(f"\n===== SEMESTER TIMETABLE FOR CLASS: {class_id} ({program_name}) =====")
        
        if not weekly_schedules:
            output_lines.append("   (No schedule data for this class.)")
            continue
            
        # Iterate through each academic week
        for week_idx, week_lessons in enumerate(weekly_schedules):
            if not week_lessons:
                continue
                
            output_lines.append(f"\n   --- Week {week_idx + 1} ---")
            
            # Group lessons by date
            lessons_by_date = defaultdict(list)
            for lesson in week_lessons:
                lessons_by_date[lesson['date']].append(lesson)
            
            # Sort the dates in order
            sorted_dates = sorted(lessons_by_date.keys())
            
            # Iterate through each day to display the lessons
            for lesson_date in sorted_dates:
                # Find unassigned lessons (lacking a slot_id) to display first
                lessons_with_error = [
                    lesson for lesson in lessons_by_date[lesson_date] 
                    if lesson.get('slot_id') is None
                ]
                if lessons_with_error:
                    output_lines.append(f"   ❗❗ Unassigned lessons on {lesson_date}:")
                    for lesson in lessons_with_error:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        output_lines.append(f"      - Subject: {subject_name} ({lesson['lesson_type']})")
                
                # Sort valid lessons by slot_id order
                def get_slot_order_key(lesson):
                    slot_id = lesson.get('slot_id')
                    return processed_data.slot_order_map.get(slot_id, float('inf'))
                    
                sorted_daily_lessons = sorted(
                    [l for l in lessons_by_date[lesson_date] if l.get('slot_id') is not None], 
                    key=get_slot_order_key
                )
                
                # Only display the date if there are valid lessons
                if sorted_daily_lessons:
                    output_lines.append(f"   Date: {lesson_date}")
                    for lesson in sorted_daily_lessons:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                        
                        output_lines.append(
                            f"       - Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {subject_name} ({lesson['lesson_type']}), "
                            f"Room: {lesson['room_id']}, Lecturer: {lecturer_name}"
                        )
                        
    return "\n".join(output_lines)