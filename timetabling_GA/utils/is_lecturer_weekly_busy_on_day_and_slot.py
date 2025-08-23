from typing import Dict, Any

def is_lecturer_weekly_busy_on_day_and_slot(lecturer_id: str, day: str, slot_id: int, processed_data: Any) -> bool:
    """
    Checks if a lecturer is busy on a fixed, recurring weekly day and time slot.

    This function iterates through the list of fixed weekly busy slots for a lecturer
    as stored in the input data.

    Args:
        lecturer_id (str): The ID of the lecturer to check.
        day (str): The day of the week (e.g., 'Mon', 'Tue').
        slot_id (int): The ID of the time slot to check.
        processed_data (Any): The object containing processed data, including the
                              lecturer information map.

    Returns:
        bool: True if the lecturer is busy, False otherwise.
    """
    # Get the lecturer's information from the map
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    
    # Get the list of fixed weekly busy slots
    weekly_busy_slots = lecturer_info.get('busy_slots', [])
    
    # Iterate through each busy slot to check for a match
    for busy_slot in weekly_busy_slots:
        if busy_slot.get('day') == day and busy_slot.get('slot_id') == slot_id:
            return True
            
    return False