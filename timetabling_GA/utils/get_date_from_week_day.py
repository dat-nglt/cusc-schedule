from datetime import datetime, timedelta
from typing import Dict, Any

def get_date_from_week_day(week: int, day_of_week_str: str, start_date: datetime, days_of_week_map: Dict[str, int]) -> datetime:
    """
    Tính toán ngày cụ thể từ số tuần, thứ trong tuần và ngày bắt đầu học kỳ.

    Hàm này dùng để xác định ngày chính xác của một buổi học trong lịch trình
    bằng cách kết hợp số tuần học, ngày trong tuần và ngày bắt đầu của học kỳ.

    Args:
        week (int): Số tuần trong học kỳ (bắt đầu từ 0).
        day_of_week_str (str): Tên của ngày trong tuần (ví dụ: "Mon", "Tue").
        start_date (datetime): Đối tượng datetime đại diện cho ngày bắt đầu học kỳ.
        days_of_week_map (Dict[str, int]): Một dictionary ánh xạ tên ngày trong tuần
                                          sang một chỉ số (ví dụ: {"Mon": 0, "Tue": 1, ...}).

    Returns:
        datetime: Đối tượng datetime đại diện cho ngày chính xác của buổi học.
    """
    # Lấy chỉ số ngày từ map
    day_offset = days_of_week_map.get(day_of_week_str, 0)
    
    # Tính toán ngày bằng cách cộng số tuần và độ lệch ngày vào ngày bắt đầu
    return start_date + timedelta(weeks=week, days=day_offset)