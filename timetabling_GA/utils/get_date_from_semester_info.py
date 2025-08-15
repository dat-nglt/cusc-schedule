# timetable_ga/data_processing/utils.py
from datetime import datetime, timedelta
import json

def get_date_from_semester_info(day, week_number, start_date_str):
    """
    Tính toán ngày cụ thể từ thông tin tuần, thứ và ngày bắt đầu học kỳ.
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    
    # Số ngày để đến thứ đầu tiên của tuần đầu tiên
    days_to_start_week = (week_number - 1) * 7
    
    # Số ngày để đến thứ trong tuần đã cho
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    days_to_target_day = days_of_week.index(day)
    
    # Giả định tuần bắt đầu từ Mon (0)
    # Cần điều chỉnh nếu ngày bắt đầu học kỳ không phải là thứ Hai
    start_date_weekday = start_date.weekday() # 0 = Mon
    days_offset = days_to_target_day - start_date_weekday
    
    target_date = start_date + timedelta(days=days_to_start_week + days_offset)
    return target_date.strftime("%Y-%m-%d")

def save_schedule_to_json(schedule_genes, file_path):
    """Lưu lịch trình đã tạo vào file JSON."""
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(schedule_genes, f, indent=2, ensure_ascii=False)

def load_schedule_from_json(file_path):
    """Tải lịch trình từ file JSON."""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return None