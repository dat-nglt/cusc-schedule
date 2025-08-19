from typing import Dict, Any

def is_lecturer_semester_busy_on_date_and_slot(lecturer_id: str, date_str: str, slot_id: int, processed_data: Any) -> bool:
    """
    Kiểm tra xem một giảng viên có bận vào một ngày và khung giờ cụ thể trong học kỳ hay không.

    Hàm này duyệt qua danh sách các khung giờ bận đã được định nghĩa trước cho giảng viên
    và so sánh với ngày và khung giờ của buổi học.

    Args:
        lecturer_id (str): ID của giảng viên cần kiểm tra.
        date_str (str): Ngày của buổi học theo định dạng 'YYYY-MM-DD'.
        slot_id (int): ID của khung giờ (slot) cần kiểm tra.
        processed_data (Any): Đối tượng chứa dữ liệu đã được xử lý, bao gồm map
                              thông tin của giảng viên.

    Returns:
        bool: True nếu giảng viên bận, False nếu không bận.
    """
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    
    # Duyệt qua từng khung giờ bận của giảng viên để kiểm tra
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            return True
            
    return False