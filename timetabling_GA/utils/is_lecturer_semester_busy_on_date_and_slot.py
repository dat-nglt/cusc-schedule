def is_lecturer_semester_busy_on_date_and_slot(lecturer_id, date_str, slot_id, processed_data):
    """Kiểm tra xem giảng viên có bận vào một ngày cụ thể trong học kỳ không."""
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot['date'] == date_str and busy_slot['slot_id'] == slot_id:
            return True
    return False