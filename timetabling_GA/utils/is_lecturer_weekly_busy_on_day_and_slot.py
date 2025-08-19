from typing import Dict, Any

def is_lecturer_weekly_busy_on_day_and_slot(lecturer_id: str, day: str, slot_id: int, processed_data: Any) -> bool:
    """
    Kiểm tra xem một giảng viên có bận vào một ngày và khung giờ cố định hàng tuần không.

    Hàm này duyệt qua danh sách các khung giờ bận cố định hàng tuần của giảng viên
    được lưu trữ trong dữ liệu đầu vào.

    Args:
        lecturer_id (str): ID của giảng viên cần kiểm tra.
        day (str): Ngày trong tuần (ví dụ: 'Mon', 'Tue').
        slot_id (int): ID của khung giờ (slot) cần kiểm tra.
        processed_data (Any): Đối tượng chứa dữ liệu đã được xử lý, bao gồm map
                              thông tin của giảng viên.

    Returns:
        bool: True nếu giảng viên bận, False nếu không bận.
    """
    # Lấy thông tin của giảng viên từ map
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    
    # Lấy danh sách các khung giờ bận cố định hàng tuần
    weekly_busy_slots = lecturer_info.get('busy_slots', [])
    
    # Duyệt qua từng khung giờ bận để kiểm tra sự trùng khớp
    for busy_slot in weekly_busy_slots:
        if busy_slot.get('day') == day and busy_slot.get('slot_id') == slot_id:
            return True
            
    return False