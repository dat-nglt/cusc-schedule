from datetime import datetime, timedelta
import random
from utils.get_date_from_week_day import get_date_from_week_day
from utils.check_hard_constraints import check_hard_constraints


def find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date):
    """
    Tìm một khung thời gian trống hợp lệ cho một buổi học bị xung đột,
    tìm kiếm trong tuần hiện tại và các tuần kế tiếp nếu cần.
    """

    print(f"\n[BẮT ĐẦU] Tìm vị trí mới cho buổi học lớp {lesson['class_id']}, môn {lesson.get('subject_id')}, loại {lesson['lesson_type']}")

    candidate_slots = []
    class_id = lesson['class_id']
    subject_id = lesson.get('subject_id') or lesson.get('subject')

    if not subject_id:
        print(" ❌ Lỗi: Không tìm thấy ID môn học.")
        return None

    subject_info = processed_data.subject_map.get(subject_id)
    if not subject_info:
        print(f" ❌ Lỗi: Không tìm thấy thông tin môn {subject_id}.")
        return None

    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        print(f" ❌ Lỗi: Không tìm thấy giảng viên dạy môn {subject_id}")
        return None

    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson['lesson_type'], lesson.get('size', 30))
    if not valid_rooms:
        print(" ❌ Lỗi: Không tìm thấy phòng học phù hợp.")
        return None

    original_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
    days_diff = (original_date - semester_start_date).days
    start_week_offset = days_diff // 7  # Sử dụng offset tuần (bắt đầu từ 0)
    
    # FIX: ĐẢM BẢO KHÔNG TÌM KIẾM TRONG TUẦN ÂM
    start_week_offset = max(0, start_week_offset)  # Quan trọng: không cho phép tuần âm

    search_limit = 1000
    max_weeks_to_search = 3

    # Lấy danh sách chỉ số ngày (0-6)
    days_to_search = list(range(7))
    random.shuffle(days_to_search)

    slots_to_search = [s['slot_id'] for s in processed_data.data['time_slots']]
    random.shuffle(slots_to_search)

    valid_lecturers_copy = valid_lecturers[:]
    random.shuffle(valid_lecturers_copy)

    valid_rooms_copy = valid_rooms[:]
    random.shuffle(valid_rooms_copy)

    print(f" - Bắt đầu tìm kiếm từ tuần {start_week_offset + 1}, tối đa {max_weeks_to_search} tuần")

    stop_flag = False

    for week_offset in range(max_weeks_to_search):
        current_week = start_week_offset + week_offset

        # FIX: THÊM KIỂM TRA TUẦN HIỆN TẠI CÓ HỢP LỆ KHÔNG
        if current_week < 0:  # Bỏ qua tuần âm
            continue
        if current_week >= program_duration_weeks:
            print(f" - Dừng: Vượt quá thời lượng chương trình ({program_duration_weeks} tuần)")
            break
        
        print(f" - Đang tìm trong tuần {current_week + 1}...")

        for day_index in days_to_search:
            # Bỏ qua Chủ nhật (index = 6)
            if day_index == 6:
                continue

            # Sử dụng hàm get_date_from_week_day đã được sửa
            date = get_date_from_week_day(current_week, day_index, semester_start_date)
            date_str = date.strftime('%Y-%m-%d')
            
            # Lấy tên ngày trong tuần tiếng Anh để truyền vào check_hard_constraints
            day_of_week_name = date.strftime('%a')

            for slot_id in slots_to_search:
                for room in valid_rooms_copy:
                    for lecturer in valid_lecturers_copy:
                        if check_hard_constraints(date_str, day_of_week_name, slot_id, room,
                                                  lecturer, class_id, occupied_slots, processed_data):
                            candidate_slots.append({
                                'date': date_str,
                                'slot_id': slot_id,
                                'room_id': room,
                                'lecturer_id': lecturer,
                                'week': current_week,
                                'day_of_week': day_of_week_name  # THÊM THÔNG TIN NGÀY VÀO ĐÂY
                            })
                            if len(candidate_slots) >= search_limit:
                                stop_flag = True
                                break
                    if stop_flag: break
                if stop_flag: break
            if stop_flag: break

    # FIX: LỌC CÁC ỨNG VIÊN TRONG PHẠM VI HỢP LỆ (0 đến program_duration_weeks-1)
    valid_candidates = [c for c in candidate_slots if 0 <= c['week'] < program_duration_weeks]
    
    if not valid_candidates:
        print("\n[KẾT THÚC] ❌ Không tìm thấy vị trí phù hợp sau khi tìm kiếm")
        return None

    same_week_candidates = [c for c in valid_candidates if c['week'] == start_week_offset]
    if same_week_candidates:
        best_candidate = random.choice(same_week_candidates)
        print(f" - Ưu tiên chọn ứng viên trong cùng tuần {start_week_offset + 1}")
    else:
        best_candidate = random.choice(valid_candidates)
        print(f" - Chọn ứng viên từ tuần {best_candidate['week'] + 1}")

    print(" - ✅ Tìm thấy vị trí mới:")
    print(f"      Ngày: {best_candidate['date']}")
    print(f"      Thứ: {best_candidate['day_of_week']}")
    print(f"      Slot: {best_candidate['slot_id']}")
    print(f"      Phòng: {best_candidate['room_id']}")
    print(f"      Giảng viên: {best_candidate['lecturer_id']}")

    return (
        best_candidate['date'],
        best_candidate['slot_id'],
        best_candidate['room_id'],
        best_candidate['lecturer_id']
    )