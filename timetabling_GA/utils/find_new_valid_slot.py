# timetable_ga/main.py

from datetime import datetime
import random
from utils.get_date_from_week_day import get_date_from_week_day
from utils.check_hard_constraints import check_hard_constraints


def find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date):
    """
    Tìm một khung thời gian trống hợp lệ cho một buổi học bị xung đột,
    tìm kiếm trong tuần hiện tại và các tuần kế tiếp nếu cần.
    """

    print(f"\n[BẮT ĐẦU] Tìm vị trí mới cho buổi học lớp {lesson['class_id']}, môn {lesson.get('subject_id')}")

    # DEBUG: In thông tin lesson đầu vào
    print(f"  - Lesson input: {lesson}")

    candidate_slots = []
    class_id = lesson['class_id']
    subject_id = lesson.get('subject_id') or lesson.get('subject')

    if not subject_id:
        print("  ❌ Lỗi: Không tìm thấy ID môn học.")
        return None

    # Lấy thông tin môn học
    subject_info = processed_data.subject_map.get(subject_id)
    if not subject_info:
        print(f"  ❌ Lỗi: Không tìm thấy thông tin môn {subject_id}.")
        return None

    # Xác định loại buổi học - DEBUG THÊM
    print(f"  - Thông tin môn học: practice_hours={subject_info.get('practice_hours', 0)}, theory_hours={subject_info.get('theory_hours', 0)}")
    lesson_type = 'practice' if subject_info.get('practice_hours', 0) > 0 else 'theory'
    print(f"  - Loại buổi học xác định: {lesson_type}")
    lesson['type'] = lesson_type

    # Lấy giảng viên phù hợp
    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        print(f"  ❌ Lỗi: Không tìm thấy giảng viên dạy môn {subject_id}")
        return None
    print(f"  - Giảng viên hợp lệ: {valid_lecturers}")

    # Lấy phòng phù hợp
    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, lesson.get('size', 30))
    if not valid_rooms:
        print("  ❌ Lỗi: Không tìm thấy phòng học phù hợp.")
        return None
    print(f"  - Phòng hợp lệ: {valid_rooms}")

    # Tuần bắt đầu tìm - DEBUG THÊM
    original_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
    start_week = int((original_date - semester_start_date).days / 7)
    print(f"  - Ngày gốc: {original_date}, Tuần bắt đầu: {start_week}")

    # Tham số tìm kiếm
    search_limit = 1000
    max_weeks_to_search = 3
    days_of_week_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week', []))}

    # DEBUG: Kiểm tra mapping
    print(f"  - days_of_week_map: {days_of_week_map}")
    print(f"  - Ngày bắt đầu học kỳ: {semester_start_date}")

    # Chuẩn bị dữ liệu
    days_to_search = processed_data.data.get('days_of_week', [])[:]
    random.shuffle(days_to_search)
    print(f"  - Days to search: {days_to_search}")

    slots_to_search = [s['slot_id'] for s in processed_data.data['time_slots']]
    random.shuffle(slots_to_search)

    valid_lecturers_copy = valid_lecturers[:]
    random.shuffle(valid_lecturers_copy)

    valid_rooms_copy = valid_rooms[:]
    random.shuffle(valid_rooms_copy)

    print(f"  - Tìm kiếm từ tuần {start_week + 1}, tối đa {max_weeks_to_search} tuần")

    # Bắt đầu tìm kiếm
    for week_offset in range(max_weeks_to_search):
        current_week = start_week + week_offset

        # Nếu vượt thời lượng chương trình thì dừng
        if current_week >= program_duration_weeks:
            print(f"  - Dừng: Vượt quá thời lượng chương trình ({program_duration_weeks} tuần)")
            break

        print(f"  - Đang tìm trong tuần {current_week + 1}...")

        stop_flag = False

        for day_of_week_eng in days_to_search:
            if day_of_week_eng.lower() in ['chủ nhật', 'sun', 'sunday']:
                continue

            date = get_date_from_week_day(current_week, day_of_week_eng, semester_start_date, days_of_week_map)
            
            # DEBUG QUAN TRỌNG: Kiểm tra ngày và thứ
            actual_day_name = date.strftime('%a')
            expected_day_short = day_of_week_eng[:3]
            print(f"    - Tính: Tuần {current_week}, thứ '{day_of_week_eng}' -> {date} (thực tế: {actual_day_name})")
            
            if actual_day_name != expected_day_short:
                print(f"    ❌ LỖI NGHIÊM TRỌNG: Không khớp! Mong đợi {expected_day_short}, thực tế {actual_day_name}")
                # Có thể cần sửa hàm get_date_from_week_day hoặc logic mapping

            date_str = date.strftime('%Y-%m-%d')

            for slot_id in slots_to_search:
                for lecturer in valid_lecturers_copy:
                    for room in valid_rooms_copy:
                        if check_hard_constraints(date_str, day_of_week_eng, slot_id, room,
                                                  lecturer, class_id, occupied_slots, processed_data):
                            candidate_slots.append({
                                'date': date_str,
                                'slot_id': slot_id,
                                'room_id': room,
                                'lecturer_id': lecturer,
                                'week': current_week
                            })

                            if len(candidate_slots) >= search_limit:
                                print(f"  - Đã tìm đủ {search_limit} ứng viên, dừng tìm kiếm")
                                stop_flag = True
                                break
                    if stop_flag: break
                if stop_flag: break
            if stop_flag: break

        if candidate_slots:
            print(f"  - Tìm thấy {len(candidate_slots)} ứng viên trong tuần {current_week + 1}")
            break

    # Kết quả
    if not candidate_slots:
        print("\n[KẾT THÚC] ❌ Không tìm thấy vị trí phù hợp sau khi tìm kiếm")
        return None

    same_week_candidates = [c for c in candidate_slots if c['week'] == start_week]
    if same_week_candidates:
        best_candidate = random.choice(same_week_candidates)
        print(f"  - Ưu tiên chọn ứng viên trong cùng tuần {start_week + 1}")
    else:
        best_candidate = random.choice(candidate_slots)
        print(f"  - Chọn ứng viên từ tuần {best_candidate['week'] + 1}")

    print("  - ✅ Tìm thấy vị trí mới:")
    print(f"      Ngày: {best_candidate['date']}")
    print(f"      Slot: {best_candidate['slot_id']}")
    print(f"      Phòng: {best_candidate['room_id']}")
    print(f"      Giảng viên: {best_candidate['lecturer_id']}")

    return (
        best_candidate['date'],
        best_candidate['slot_id'],
        best_candidate['room_id'],
        best_candidate['lecturer_id']
    )