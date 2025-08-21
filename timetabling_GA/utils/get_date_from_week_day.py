from datetime import datetime, timedelta
from typing import Dict, Any

def get_date_from_week_day(week: int, day_of_week_str: str, start_date: datetime, days_of_week_map: Dict[str, int]) -> datetime:
    """
    Calculates the specific date from the week number, day of the week, and semester start date.

    This function is used to determine the exact date of a lesson in a schedule
    by combining the academic week number, the day of the week, and the semester's start date.

    Args:
        week (int): The week number in the semester (starting from 0).
        day_of_week_str (str): The name of the day of the week (e.g., "Mon", "Tue").
        start_date (datetime): A datetime object representing the semester's start date.
        days_of_week_map (Dict[str, int]): A dictionary that maps the day name
                                           to an index (e.g., {"Mon": 0, "Tue": 1, ...}).

    Returns:
        datetime: A datetime object representing the exact date of the lesson.
    """
    # Get the day index from the map
    day_offset = days_of_week_map.get(day_of_week_str, 0)
    
    # Calculate the date by adding the weeks and day offset to the start date
    return start_date + timedelta(weeks=week, days=day_offset)