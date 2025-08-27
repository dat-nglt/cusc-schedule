from datetime import datetime, timedelta
from typing import Dict


def get_date_from_week_day(week_offset: int, day_of_week_index: int, semester_start_date: datetime) -> datetime:
    """
    Calculates the specific date based on the week offset, day of the week index, and semester start date.

    Args:
        week_offset (int): The week offset from the start of the semester (0 for the first week).
        day_of_week_index (int): The index of the day (0=Mon, 1=Tue, ..., 6=Sun).
        semester_start_date (datetime): The first day of the semester.

    Returns:
        datetime: The calculated date.
    """
    # Tìm ngày Thứ Hai đầu tiên của tuần chứa ngày bắt đầu học kỳ
    # weekday() trả về 0=Mon, 1=Tue, ..., 6=Sun
    # Lấy timedelta để lùi về thứ Hai
    start_monday_offset = semester_start_date.weekday()
    start_monday = semester_start_date - timedelta(days=start_monday_offset)

    # Tính ngày mục tiêu: start_monday + tuần học + ngày trong tuần
    target_date = start_monday + timedelta(weeks=week_offset, days=day_of_week_index)
    
    return target_date

# semester_start = datetime(2025, 8, 27)

# # Ta muốn tìm ngày Thứ Hai của tuần thứ 2 (offset = 1)
# # Thứ Hai có index là 0
# date_for_week_2_monday = get_date_from_week_day(week_offset=1, day_of_week_index=0, semester_start_date=semester_start)
# print(f"Ngày Thứ Hai của tuần học thứ 2 là: {date_for_week_2_monday.strftime('%A, %Y-%m-%d')}")

# # Ta muốn tìm ngày Thứ Sáu của tuần đầu tiên (offset = 0)
# # Thứ Sáu có index là 4
# date_for_week_1_friday = get_date_from_week_day(week_offset=0, day_of_week_index=4, semester_start_date=semester_start)
# print(f"Ngày Thứ Sáu của tuần học thứ 1 là: {date_for_week_1_friday.strftime('%A, %Y-%m-%d')}")