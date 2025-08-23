from datetime import datetime, timedelta
import json
from typing import Dict, Any, List, Optional

def get_date_from_semester_info(day: str, week_number: int, start_date_str: str) -> str:
    """
    Calculates the specific date from the week number, day of the week, and semester start date.

    This function determines the day of the week (Monday, Tuesday, etc.) and the week number
    in the semester to calculate the exact date of a lesson. It assumes the week starts on
    Monday.

    Args:
        day (str): Abbreviation of the day of the week (e.g., "Mon", "Tue").
        week_number (int): The week number in the semester (starting from 1).
        start_date_str (str): The start date of the semester in 'YYYY-MM-DD' format.

    Returns:
        str: The exact date of the lesson in 'YYYY-MM-DD' format.
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    
    # List of days of the week
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Calculate the day offset
    start_date_weekday = start_date.weekday()  # Get the day index (0=Mon, 6=Sun)
    try:
        target_day_index = days_of_week.index(day)
    except ValueError:
        raise ValueError(f"Invalid day '{day}'. Please use one of the following: {', '.join(days_of_week)}")

    # Total number of days from the semester start date to the target lesson
    # Step 1: Calculate the number of days from the first week to the target week
    total_days = (week_number - 1) * 7
    # Step 2: Add the day of the week offset
    total_days += (target_day_index - start_date_weekday)
    
    target_date = start_date + timedelta(days=total_days)
    return target_date.strftime("%Y-%m-%d")


def save_schedule_to_json(schedule_genes: List[Dict[str, Any]], file_path: str):
    """
    Saves the generated schedule to a JSON file in a human-readable format.

    Args:
        schedule_genes (List[Dict[str, Any]]): A list of lessons to be saved.
        file_path (str): The path to the JSON file for saving.
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(schedule_genes, f, indent=2, ensure_ascii=False)


def load_schedule_from_json(file_path: str) -> Optional[List[Dict[str, Any]]]:
    """
    Loads a schedule from a JSON file.

    Args:
        file_path (str): The path to the JSON file.

    Returns:
        Optional[List[Dict[str, Any]]]: The loaded schedule data, or None if the file does not exist.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found at path '{file_path}'.")
        return None
    except json.JSONDecodeError:
        print(f"Error: File '{file_path}' is not a valid JSON file.")
        return None