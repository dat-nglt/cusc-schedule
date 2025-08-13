def check_hard_constraints(date_str, day_of_week_eng, slot_id, room_id, lecturer_id, class_id, occupied_slots, processed_data):
    """
    Kiểm tra tất cả các ràng buộc cứng cho một buổi học.
    Trả về True nếu không có xung đột, ngược lại trả về False.
    """
    # Tạo danh sách để lưu các lý do thất bại
    reasons = []

    # Ghi log bắt đầu kiểm tra
    print(f"\r   - Đang kiểm tra ứng viên: Ngày={date_str}, Slot={slot_id}, Phòng={room_id}, GV={lecturer_id}, Lớp={class_id}", end='')
    
    # Ràng buộc 1: Giảng viên, phòng, lớp đã được gán cho slot này trong lịch trình hiện tại
    if lecturer_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('lecturers', set()):
        reasons.append("Giảng viên đã được gán.")
    if room_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('rooms', set()):
        reasons.append("Phòng đã được gán.")
    if class_id in occupied_slots.get(date_str, {}).get(slot_id, {}).get('classes', set()):
        reasons.append("Lớp đã được gán.")

    # Ràng buộc 2: Giảng viên bận theo lịch trình cố định hàng tuần
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    busy_weekly_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in busy_weekly_slots:
        if busy_slot.get('day') == day_of_week_eng and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận theo lịch tuần.")
            break

    # Ràng buộc 3: Giảng viên bận theo lịch trình theo ngày cụ thể (semester_busy_slots)
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot.get('date') == date_str and busy_slot.get('slot_id') == slot_id:
            reasons.append("Giảng viên bận theo lịch cụ thể.")
            break
    
    # Nếu có bất kỳ lý do nào trong danh sách, in ra lỗi và trả về False
    if reasons:
        print(" -> ❌ Thất bại: " + ", ".join(reasons))
        return False

    # Nếu tất cả các kiểm tra đều vượt qua
    print(" -> ✅ Hợp lệ!")
    return True