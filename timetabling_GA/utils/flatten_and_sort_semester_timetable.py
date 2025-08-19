from datetime import datetime


def flatten_and_sort_semester_timetable(semester_timetable, semester_id):
    """
    Trả về 2 đối tượng:
    - by_class: dict {class_id: [lessons sorted]}
    - by_semester: dict {semester_id: [lessons sorted]}
    """
    by_class = {}
    all_lessons = []

    for class_id, list_of_lessons in semester_timetable.items():
        # Gộp tất cả list con thành 1 list phẳng cho class đó
        flat_lessons = [lesson for lessons in list_of_lessons for lesson in lessons]
        # Sort theo ngày
        flat_lessons_sorted = sorted(
            flat_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
        )
        by_class[class_id] = flat_lessons_sorted
        all_lessons.extend(flat_lessons)

    # Sort toàn bộ lessons theo ngày, group theo semester_id
    all_lessons_sorted = sorted(
        all_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
    )
    by_semester = {semester_id: all_lessons_sorted}

    return by_class, by_semester
