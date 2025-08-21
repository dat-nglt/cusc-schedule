from collections import defaultdict
from typing import Dict, Any, List

def generate_room_semester_view(semester_schedule_by_class: Dict[str, List[List[Dict[str, Any]]]], processed_data: Any) -> Dict[str, Dict[int, List[Dict[str, Any]]]]:
    """
    Generates a usage schedule data structure for each classroom over the entire semester.

    This function iterates through the class-based schedule, extracts lesson information,
    and reorganizes it by room. The data is sorted by week, day, and time slot for easy tracking.

    Args:
        semester_schedule_by_class (Dict[str, List[List[Dict[str, Any]]]]): The semester schedule
                                                                           already grouped by class.
        processed_data (Any): The object containing processed data from the input files, including
                               maps and information about days of the week.

    Returns:
        Dict[str, Dict[int, List[Dict[str, Any]]]]: The room's schedule.
            - Level 1 Key: room_id (string)
            - Level 2 Key: week_num (integer)
            - Value: A sorted list of lessons (List[Dict[str, Any]]) for that week.
    """
    # Use defaultdict to easily build the nested structure
    room_view = defaultdict(lambda: defaultdict(list))

    # Iterate through the class-based schedule
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        # Iterate through each week for the class
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            # Iterate through each lesson in the week
            for lesson in lessons_in_week:
                room_id = lesson.get('room_id')
                # Only process lessons that have an assigned room
                if room_id and room_id != "UNASSIGNED_ROOM":
                    week_num = week_idx + 1
                    
                    # Create a new dictionary with essential lesson info for the room's view
                    lesson_info_for_room = {
                        'day': lesson['day'],
                        'date': lesson.get('date'),
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'lecturer_id': lesson['lecturer_id'],
                    }
                    room_view[room_id][week_num].append(lesson_info_for_room)

    # Sort each room's lessons by day and slot
    for room_id in room_view:
        for week_num in room_view[room_id]:
            # Check if mapping data exists to prevent errors
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                room_view[room_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                # If mapping data is missing, use a simpler sort
                room_view[room_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
                
    return room_view