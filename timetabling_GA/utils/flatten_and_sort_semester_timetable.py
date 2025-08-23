from datetime import datetime
from typing import Dict, Any, List, Tuple

def flatten_and_sort_semester_timetable(semester_timetable: Dict[str, Any], semester_id: str) -> Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, List[Dict[str, Any]]]]:
    """
    Restructures a semester's timetable data into two formats:
    - Sorted by class.
    - Flattened and sorted by semester.

    Args:
        semester_timetable (Dict[str, Any]): The raw semester timetable data,
                                              with a structure like {class_id: [[lesson_1], [lesson_2], ...]}
                                              where each lesson is a dictionary.
        semester_id (str): The ID of the current semester.

    Returns:
        Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, List[Dict[str, Any]]]]:
        - by_class: A dictionary where the key is class_id and the value is a sorted list of lessons.
        - by_semester: A dictionary where the key is semester_id and the value is a sorted list
                       of all lessons in that semester, sorted by date.
    """
    by_class = {}
    all_lessons = []

    # Iterate through each class in the timetable
    for class_id, list_of_lessons in semester_timetable.items():
        # Flatten all sub-lists of lessons into a single flat list
        flat_lessons = [lesson for week_lessons in list_of_lessons for lesson in week_lessons]
        
        # Sort the lessons for this class by date
        flat_lessons_sorted = sorted(
            flat_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
        )
        by_class[class_id] = flat_lessons_sorted
        
        # Add all lessons from this class to the overall list
        all_lessons.extend(flat_lessons)

    # Sort all lessons in the semester by date
    all_lessons_sorted = sorted(
        all_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
    )
    by_semester = {semester_id: all_lessons_sorted}

    return by_class, by_semester