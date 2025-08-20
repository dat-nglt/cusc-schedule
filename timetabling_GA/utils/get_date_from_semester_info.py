from datetime import datetime, timedelta
import json
from typing import Dict, Any, List, Optional

def get_date_from_semester_info(day: str, week_number: int, start_date_str: str) -> str:
    """
    Tính toán ngày cụ thể từ thông tin tuần, thứ và ngày bắt đầu học kỳ.

    Hàm này xác định ngày trong tuần (thứ hai, thứ ba,...) và số tuần trong học kỳ
    để tính toán ngày chính xác của một buổi học. Nó giả định tuần bắt đầu từ
    Thứ Hai (Mon).

    Args:
        day (str): Viết tắt của ngày trong tuần (ví dụ: "Mon", "Tue").
        week_number (int): Số tuần trong học kỳ (bắt đầu từ 1).
        start_date_str (str): Ngày bắt đầu của học kỳ theo định dạng 'YYYY-MM-DD'.

    Returns:
        str: Ngày chính xác của buổi học theo định dạng 'YYYY-MM-DD'.
    """
    start_date = datetime.strptime(start_date_str, "%Y-%m-%d")
    
    # Danh sách các ngày trong tuần
    days_of_week = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
    
    # Tính toán độ lệch ngày
    start_date_weekday = start_date.weekday()  # Lấy chỉ số ngày (0=Mon, 6=Sun)
    try:
        target_day_index = days_of_week.index(day)
    except ValueError:
        raise ValueError(f"Ngày '{day}' không hợp lệ. Vui lòng sử dụng các giá trị: {', '.join(days_of_week)}")

    # Tổng số ngày từ ngày bắt đầu học kỳ đến buổi học mục tiêu
    # Bước 1: Tính số ngày từ tuần đầu tiên đến tuần mục tiêu
    total_days = (week_number - 1) * 7
    # Bước 2: Thêm độ lệch ngày trong tuần
    total_days += (target_day_index - start_date_weekday)
    
    target_date = start_date + timedelta(days=total_days)
    return target_date.strftime("%Y-%m-%d")


def save_schedule_to_json(schedule_genes: List[Dict[str, Any]], file_path: str):
    """
    Lưu lịch trình đã tạo vào file JSON với định dạng dễ đọc.

    Args:
        schedule_genes (List[Dict[str, Any]]): Danh sách các buổi học cần lưu.
        file_path (str): Đường dẫn tới file JSON để lưu.
    """
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(schedule_genes, f, indent=2, ensure_ascii=False)


def load_schedule_from_json(file_path: str) -> Optional[List[Dict[str, Any]]]:
    """
    Tải lịch trình từ file JSON.

    Args:
        file_path (str): Đường dẫn tới file JSON.

    Returns:
        Optional[List[Dict[str, Any]]]: Dữ liệu lịch trình đã tải, hoặc None nếu file không tồn tại.
    """
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Lỗi: Không tìm thấy file tại đường dẫn '{file_path}'.")
        return None
    except json.JSONDecodeError:
        print(f"Lỗi: File '{file_path}' không phải là một file JSON hợp lệ.")
        return None