def check_hard_constraints(date_str, day_of_week_eng, slot_id, room_id, lecturer_id, class_id, occupied_slots, processed_data):
    """
    Kiểm tra tất cả các ràng buộc cứng cho một buổi học.
    Trả về True nếu không có xung đột, ngược lại trả về False và in ra lý do.
    
    Args:
        date_str (str): Ngày của buổi học (vd: "2025-10-27").
        day_of_week_eng (str): Tên ngày trong tuần bằng tiếng Anh (vd: "Monday").
        slot_id (int): ID của khung thời gian.
        room_id (int): ID của phòng học.
        lecturer_id (int): ID của giảng viên.
        class_id (int): ID của lớp học.
        occupied_slots (dict): Lịch trình hiện tại, lưu trữ các slot đã được gán.
        processed_data (object): Đối tượng chứa dữ liệu đã được xử lý (lecturer_map, v.v.).

    Returns:
        bool: True nếu không có xung đột, False nếu có.
    """
    reasons = []

    # Ràng buộc 1: Giảng viên, phòng, lớp không được trùng lịch
    # Kiểm tra xem giảng viên đã bận trong slot này chưa
    if lecturer_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('lecturers', set()):
        reasons.append("Giảng viên đã được gán cho một buổi học khác.")
    
    # Kiểm tra xem phòng đã được sử dụng trong slot này chưa
    if room_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('rooms', set()):
        reasons.append("Phòng đã được gán cho một buổi học khác.")
        
    # Kiểm tra xem lớp đã có lịch trong slot này chưa
    if class_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('classes', set()):
        reasons.append("Lớp đã được gán cho một buổi học khác.")

    # Ràng buộc 2: Giảng viên bận theo lịch trình cố định hàng tuần
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    busy_weekly_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in busy_weekly_slots:
        if busy_slot.get('day') == day_of_week_eng and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận theo lịch trình cố định hàng tuần.")
            break

    # Ràng buộc 3: Giảng viên bận theo lịch trình theo ngày cụ thể (semester_busy_slots)
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận theo lịch trình cụ thể.")
            break
    
    # Trả về kết quả
    if reasons:
        print(f"❌ Thất bại: {', '.join(reasons)}")
        return False
    
    print("✅ Hợp lệ!")
    return True