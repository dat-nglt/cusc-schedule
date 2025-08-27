from datetime import timedelta


def get_date_from_week_day(week: int, day_of_week_str: str, start_date: datetime, days_of_week_map: Dict[str, int]) -> datetime:
    """
    Calculates the specific date from the week number, day of the week, and semester start date.
    """
    if day_of_week_str not in days_of_week_map:
        return start_date  # Fallback
    
    # Xác định thứ của ngày bắt đầu học kỳ (0=Mon, 1=Tue, ..., 6=Sun)
    start_weekday = start_date.weekday()
    
    # Xác định index của target day trong map
    target_index = days_of_week_map[day_of_week_str]
    
    # Tính số ngày cần thêm để đến target day trong tuần ĐẦU TIÊN
    days_to_add = target_index - start_weekday
    if days_to_add < 0:
        days_to_add += 7  # Chuyển sang tuần sau nếu target day đã qua trong tuần này
    
    # Tính ngày đầu tiên xảy ra target day
    first_occurrence = start_date + timedelta(days=days_to_add)
    
    # Tính ngày trong tuần mong muốn
    target_date = first_occurrence + timedelta(weeks=week)
    
    return target_date