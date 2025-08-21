from typing import List

def get_weekly_lesson_counts(total_slots_needed: int, total_weeks: int) -> List[int]:
    """
    Calculates and distributes the number of lessons evenly across each week in a semester.

    This function divides the total number of required lessons for a subject among
    the weeks so that the number of lessons per week is as equal as possible. Any
    "extra" lessons are allocated to the first weeks.

    Args:
        total_slots_needed (int): The total number of lessons required for the subject.
        total_weeks (int): The total number of weeks in the semester.

    Returns:
        List[int]: A list containing the number of lessons for each week.
                   Example: [2, 2, 2, 2, 1, 1, ...] if the total lessons is 10
                   and the total weeks is 6.
    """
    # Handle the special case where the total number of weeks is zero or less
    if total_weeks <= 0:
        return []

    # The base number of lessons per week
    base_weekly = total_slots_needed // total_weeks
    # The remaining lessons after even distribution
    extra_slots = total_slots_needed % total_weeks
    
    # Create the list of weekly lesson counts
    # The first weeks will have an extra lesson until all remaining slots are allocated
    counts = [base_weekly + 1] * extra_slots + [base_weekly] * (total_weeks - extra_slots)
    
    return counts