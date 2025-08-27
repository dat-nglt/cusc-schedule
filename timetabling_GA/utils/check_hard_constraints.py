from datetime import datetime, timedelta
import random
from utils.get_date_from_week_day import get_date_from_week_day

def check_hard_constraints(date_str, day_of_week_eng, 
slot_id, room_id, lecturer_id, class_id, subject_id, occupied_slots, processed_data):
    """
    Kiểm tra tất cả các ràng buộc cứng cho một buổi học.
    Trả về True nếu không có xung đột, ngược lại trả về False.

    Args:
        date_str (str): Ngày của buổi học (ví dụ: "2025-10-27").
        day_of_week_eng (str): Tên thứ trong tuần (ví dụ: "Monday").
        slot_id (int): ID của khung giờ.
        room_id (int): ID của phòng.
        lecturer_id (int): ID của giảng viên.
        class_id (int): ID của lớp.
        subject_id (int): ID của môn học.
        occupied_slots (dict): Lịch trình hiện tại, lưu các slot đã được gán.
        processed_data (object): Đối tượng chứa dữ liệu đã xử lý.

    Returns:
        bool: True nếu không có xung đột, False nếu có.
    """
    reasons = []

    # Kiểm tra nếu slot này đã tồn tại trong occupied_slots
    if date_str not in occupied_slots:
        occupied_slots[date_str] = {}
    if slot_id not in occupied_slots[date_str]:
        occupied_slots[date_str][slot_id] = {
            'lecturers': set(),
            'rooms': set(),
            'classes': set(),
            'subjects': set()
        }

    current_slot = occupied_slots[date_str][slot_id]

    # Ràng buộc 1: Giảng viên, phòng, lớp và môn học không được xung đột lịch
    if lecturer_id in current_slot['lecturers']:
        reasons.append("Giảng viên đã được phân công cho buổi học khác.")
    
    if room_id in current_slot['rooms']:
        reasons.append("Phòng đã được phân công cho buổi học khác.")
        
    if class_id in current_slot['classes']:
        reasons.append("Lớp đã được phân công cho buổi học khác.")
        
    if subject_id in current_slot['subjects']:
        reasons.append("Môn học đã được dạy trong khung giờ này.")

    # Ràng buộc 2: Giảng viên bận theo lịch cố định hàng tuần
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    busy_weekly_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in busy_weekly_slots:
        if busy_slot.get('day') == day_of_week_eng and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận theo lịch cố định hàng tuần.")
            break

    # Ràng buộc 3: Giảng viên bận vào ngày cụ thể (semester_busy_slots)
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận vào ngày cụ thể này.")
            break
    
    # Trả về kết quả
    if reasons:
        # In ra lý do nếu cần debug
        # print(f"Xung đột: {', '.join(reasons)}")
        return False
    
    return True