def is_lecturer_weekly_busy_on_day_and_slot(lecturer_id, day, slot_id, processed_data):
    """Kiểm tra xem giảng viên có bận vào khung giờ cố định hàng tuần không."""
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    weekly_busy_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in weekly_busy_slots:
        if busy_slot['day'] == day and busy_slot['slot_id'] == slot_id:
            return True
    return False