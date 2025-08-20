from datetime import datetime
from typing import Dict, Any, List, Tuple

def flatten_and_sort_semester_timetable(semester_timetable: Dict[str, Any], semester_id: str) -> Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, List[Dict[str, Any]]]]:
    """
    Tổ chức lại dữ liệu thời khóa biểu của một học kỳ thành hai định dạng:
    - Sắp xếp theo lớp học.
    - Sắp xếp toàn bộ các buổi học theo học kỳ.

    Args:
        semester_timetable (Dict[str, Any]): Dữ liệu thời khóa biểu thô của học kỳ,
                                             có cấu trúc {class_id: [[lesson_1], [lesson_2], ...]}
                                             trong đó mỗi lesson là một dictionary.
        semester_id (str): ID của học kỳ hiện tại.

    Returns:
        Tuple[Dict[str, List[Dict[str, Any]]], Dict[str, List[Dict[str, Any]]]]:
        - by_class: Dictionary với key là class_id và value là danh sách các buổi học đã được sắp xếp.
        - by_semester: Dictionary với key là semester_id và value là danh sách tất cả các buổi học
                       trong học kỳ đó, đã được sắp xếp theo ngày.
    """
    by_class = {}
    all_lessons = []

    # Lặp qua từng lớp học trong thời khóa biểu
    for class_id, list_of_lessons in semester_timetable.items():
        # Gộp tất cả các danh sách con của các buổi học lại thành một danh sách phẳng
        flat_lessons = [lesson for week_lessons in list_of_lessons for lesson in week_lessons]
        
        # Sắp xếp các buổi học của lớp này theo ngày
        flat_lessons_sorted = sorted(
            flat_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
        )
        by_class[class_id] = flat_lessons_sorted
        
        # Thêm tất cả các buổi học của lớp này vào danh sách chung
        all_lessons.extend(flat_lessons)

    # Sắp xếp toàn bộ các buổi học trong học kỳ theo ngày
    all_lessons_sorted = sorted(
        all_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
    )
    by_semester = {semester_id: all_lessons_sorted}

    return by_class, by_semester