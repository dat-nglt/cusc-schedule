from collections import defaultdict
from typing import Dict, Any, List

def generate_lecturer_semester_view(semester_schedule_by_class: Dict[str, List[List[Dict[str, Any]]]], processed_data: Any) -> Dict[str, Dict[int, List[Dict[str, Any]]]]:
    """
    Generates a teaching schedule data structure for each lecturer over the entire semester.

    This function iterates through the class-based schedule, extracts lesson information,
    and reorganizes it by lecturer. The data is sorted by week, day, and time slot.

    Args:
        semester_schedule_by_class (Dict[str, List[List[Dict[str, Any]]]]): The semester schedule
                                                                           already grouped by class.
        processed_data (Any): The object containing processed data from the input files, including
                               maps and information about days of the week.

    Returns:
        Dict[str, Dict[int, List[Dict[str, Any]]]]: The lecturer's schedule.
            - Level 1 Key: lecturer_id (string)
            - Level 2 Key: week_num (integer)
            - Value: A sorted list of lessons (List[Dict[str, Any]]) for that week.
    """
    # Use defaultdict to easily build the nested structure
    lecturer_view = defaultdict(lambda: defaultdict(list))

    # Iterate through the class-based schedule
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        # Iterate through each week for the class
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            # Iterate through each lesson in the week
            for lesson in lessons_in_week:
                lecturer_id = lesson.get('lecturer_id')
                # Only process lessons that have an assigned lecturer
                if lecturer_id and lecturer_id != "UNASSIGNED_LECTURER":
                    week_num = week_idx + 1
                    
                    # Create a new dictionary with essential lesson info for the lecturer's view
                    lesson_info_for_lecturer = {
                        'day': lesson['day'],
                        'date': lesson.get('date'),
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'room_id': lesson['room_id'],
                    }
                    lecturer_view[lecturer_id][week_num].append(lesson_info_for_lecturer)

    # Sort each lecturer's lessons by day and slot
    for lecturer_id in lecturer_view:
        for week_num in lecturer_view[lecturer_id]:
            # Check if mapping data exists to prevent errors
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                # If mapping data is missing, use a simpler sort
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
                
    return lecturer_view