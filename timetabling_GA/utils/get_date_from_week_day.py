from datetime import timedelta

def get_date_from_week_day(week, day_of_week_str, start_date, days_of_week_map):
    """Tính toán ngày cụ thể từ số tuần, thứ trong tuần và ngày bắt đầu học kỳ."""
    day_offset = days_of_week_map.get(day_of_week_str, 0)
    return start_date + timedelta(weeks=week, days=day_offset)
