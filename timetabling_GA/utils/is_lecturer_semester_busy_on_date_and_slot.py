from typing import Dict, Any

def is_lecturer_semester_busy_on_date_and_slot(lecturer_id: str, date_str: str, slot_id: int, processed_data: Any) -> bool:
    """
    Checks if a lecturer is busy on a specific date and time slot during the semester.

    This function iterates through the lecturer's pre-defined list of busy slots
    and compares it with the date and slot of the lesson.

    Args:
        lecturer_id (str): The ID of the lecturer to check.
        date_str (str): The date of the lesson in 'YYYY-MM-DD' format.
        slot_id (int): The ID of the time slot to check.
        processed_data (Any): The object containing processed data, including the
                              lecturer information map.

    Returns:
        bool: True if the lecturer is busy, False otherwise.
    """
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    
    # Iterate through each of the lecturer's busy slots to check for a match
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            return True
            
    return False