# timetable_ga/main.py
from datetime import datetime
import random
from utils.get_date_from_week_day import get_date_from_week_day
from utils.check_hard_constraints import check_hard_constraints

def find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date):
    """
    Tìm một khung thời gian trống hợp lệ cho một buổi học bị xung đột,
    chỉ tìm kiếm trong chính tuần mà buổi học đó diễn ra.
    """
    print("\n[BẮT ĐẦU] Tìm vị trí mới cho buổi học:")
    print(f"  - Buổi học: Lớp {lesson['class_id']}, Môn {lesson.get('subject_id')}, Tiết {lesson.get('type')}")
    print(f"  - Ngày bị xung đột: {lesson.get('date')}")
    
    candidate_slots = []
    
    class_id = lesson['class_id']
    subject_id = lesson.get('subject_id') or lesson.get('subject')
    
    if not subject_id:
        print("  ❌ Lỗi: Không tìm thấy ID môn học.")
        return None

    # Lấy loại buổi học từ thông tin môn học thay vì từ lesson
    subject_info = processed_data.subject_map.get(subject_id)
    if not subject_info:
        print(f"  ❌ Lỗi: Không tìm thấy thông tin chi tiết của môn {subject_id}.")
        return None
    lesson_type = 'practice' if subject_info.get('practice_hours', 0) > 0 else 'theory'
    lesson['type'] = lesson_type # Cập nhật lại 'type' cho buổi học

    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        print(f"  ❌ Lỗi: Không tìm thấy giảng viên nào dạy môn {subject_id}")
        return None
        
    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, lesson['size']) # Sử dụng lesson_type đã xác định lại
    if not valid_rooms:
        print("  ❌ Lỗi: Không tìm thấy phòng học phù hợp.")
        return None

    # Lấy tuần và ngày của buổi học ban đầu để giới hạn tìm kiếm
    original_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
    week_num = int((original_date - semester_start_date).days / 7)
    
    weeks_to_search = [week_num]

    search_limit = 1000 
    days_of_week_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week', []))}

    days_to_search = processed_data.data.get('days_of_week', [])
    random.shuffle(days_to_search)
    slots_to_search = [s['slot_id'] for s in processed_data.data['time_slots']]
    random.shuffle(slots_to_search)
    random.shuffle(valid_lecturers)
    random.shuffle(valid_rooms)
    
    print(f"  - Đang tìm kiếm trong tuần {week_num + 1}, {len(days_to_search)} ngày, {len(slots_to_search)} slot, {len(valid_lecturers)} GV, {len(valid_rooms)} phòng.")

    for week in weeks_to_search:
        for day_of_week_eng in days_to_search:
            if day_of_week_eng.lower() == 'chủ nhật' or day_of_week_eng.lower() == 'sun':
                print("Bỏ qua ngày chủ nhật")
                continue
            date = get_date_from_week_day(week, day_of_week_eng, semester_start_date, days_of_week_map)
            date_str = date.strftime('%Y-%m-%d')

            for slot_id in slots_to_search:
                for lecturer in valid_lecturers:
                    for room in valid_rooms:
                        if check_hard_constraints(date_str, day_of_week_eng, slot_id, room, lecturer, class_id, occupied_slots, processed_data):
                            candidate = {
                                'date': date_str,
                                'slot_id': slot_id,
                                'room_id': room,
                                'lecturer_id': lecturer,
                            }
                            candidate_slots.append(candidate)
                            
                            if len(candidate_slots) >= search_limit:
                                print(f"\n[KẾT THÚC] Đã tìm đủ {search_limit} ứng viên. Chọn ngẫu nhiên một ứng viên tốt nhất.")
                                best_candidate = random.choice(candidate_slots)
                                return (best_candidate['date'], best_candidate['slot_id'], best_candidate['room_id'], best_candidate['lecturer_id'])
    
    if not candidate_slots:
        print("\n[KẾT THÚC] 😞 Không tìm thấy ứng viên hợp lệ nào trong tuần này.")
        return None

    print(f"\n[KẾT THÚC] Đã tìm thấy {len(candidate_slots)} ứng viên. Chọn ngẫu nhiên một ứng viên.")
    best_candidate = random.choice(candidate_slots)
    return (best_candidate['date'], best_candidate['slot_id'], best_candidate['room_id'], best_candidate['lecturer_id'])
