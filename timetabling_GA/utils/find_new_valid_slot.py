import os
import random
from datetime import datetime, timedelta
from typing import Dict, Any, List, Optional, Tuple

# Các hàm tiện ích được import
from utils.get_date_from_week_day import get_date_from_week_day
from utils.check_hard_constraints import check_hard_constraints

def find_new_valid_slot(
    lesson: Dict[str, Any],
    processed_data: Any,
    occupied_slots: Dict[str, Any],
    program_duration_weeks: int,
    semester_start_date: datetime
) -> Optional[Tuple[str, int, int, int]]:
    """
    Tìm một khung thời gian trống hợp lệ cho một buổi học bị xung đột,
    tìm kiếm trong tuần hiện tại và các tuần kế tiếp nếu cần.

    Args:
        lesson (Dict[str, Any]): Thông tin của buổi học bị xung đột.
        processed_data (Any): Đối tượng chứa dữ liệu đã được xử lý (map giảng viên, phòng, v.v.).
        occupied_slots (Dict[str, Any]): Lịch trình hiện tại, lưu trữ các slot đã được gán.
        program_duration_weeks (int): Tổng số tuần của chương trình.
        semester_start_date (datetime): Ngày bắt đầu của học kỳ.

    Returns:
        Optional[Tuple[str, int, int, int]]: Một tuple chứa ngày, slot_id, room_id, lecturer_id
                                              của vị trí mới, hoặc None nếu không tìm thấy.
    """
    print(f"\n[BẮT ĐẦU] Tìm vị trí mới cho buổi học lớp {lesson.get('class_id')}, môn {lesson.get('subject_id') or lesson.get('subject')}")
    
    # Lấy thông tin cần thiết từ buổi học
    class_id = lesson['class_id']
    subject_id = lesson.get('subject_id') or lesson.get('subject')
    
    if not subject_id:
        print(" ❌ Lỗi: Không tìm thấy ID môn học.")
        return None

    # Xác định loại buổi học (lý thuyết/thực hành)
    subject_info = processed_data.subject_map.get(subject_id, {})
    lesson_type = 'practice' if subject_info.get('practice_hours', 0) > 0 else 'theory'
    
    # Lấy danh sách giảng viên và phòng học phù hợp, nếu không có thì dừng
    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        print(f" ❌ Lỗi: Không tìm thấy giảng viên dạy môn {subject_id}")
        return None
        
    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, lesson.get('size', 30))
    if not valid_rooms:
        print(" ❌ Lỗi: Không tìm thấy phòng học phù hợp.")
        return None

    # Xác định tuần bắt đầu tìm kiếm
    original_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
    start_week = int((original_date - semester_start_date).days / 7)
    
    # Cấu hình tìm kiếm
    search_limit = 1000
    max_weeks_to_search = 3  # Giới hạn số tuần tìm kiếm
    days_of_week_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week', []))}

    # Tạo các bản sao ngẫu nhiên của danh sách tìm kiếm để đa dạng hóa
    days_to_search = random.sample(processed_data.data.get('days_of_week', []), k=len(processed_data.data.get('days_of_week', [])))
    slots_to_search = random.sample([s['slot_id'] for s in processed_data.data['time_slots']], k=len(processed_data.data['time_slots']))
    valid_lecturers_copy = random.sample(valid_lecturers, k=len(valid_lecturers))
    valid_rooms_copy = random.sample(valid_rooms, k=len(valid_rooms))

    print(f"  - Bắt đầu tìm kiếm từ tuần {start_week + 1}, tối đa {max_weeks_to_search} tuần.")
    
    candidate_slots = []
    
    # Lặp qua các tuần, ngày, slot, giảng viên và phòng để tìm vị trí trống
    for week_offset in range(max_weeks_to_search):
        current_week = start_week + week_offset
        
        # Ngừng tìm kiếm nếu vượt quá số tuần của chương trình
        if current_week >= program_duration_weeks:
            break
        
        for day_of_week_eng in days_to_search:
            # Bỏ qua Chủ nhật
            if day_of_week_eng.lower() in ['chủ nhật', 'sun', 'sunday']:
                continue
                
            date = get_date_from_week_day(current_week, day_of_week_eng, semester_start_date, days_of_week_map)
            date_str = date.strftime('%Y-%m-%d')

            for slot_id in slots_to_search:
                for lecturer in valid_lecturers_copy:
                    for room in valid_rooms_copy:
                        # Kiểm tra ràng buộc cứng cho vị trí ứng viên
                        if check_hard_constraints(date_str, day_of_week_eng, slot_id, room, lecturer, class_id, occupied_slots, processed_data):
                            candidate_slots.append({
                                'date': date_str,
                                'slot_id': slot_id,
                                'room_id': room,
                                'lecturer_id': lecturer,
                                'week': current_week
                            })
                            
                            # Dừng tìm kiếm nếu đã tìm đủ số lượng ứng viên giới hạn
                            if len(candidate_slots) >= search_limit:
                                print(f"  - Đã tìm đủ {search_limit} ứng viên, dừng tìm kiếm.")
                                break
                    if len(candidate_slots) >= search_limit: break
                if len(candidate_slots) >= search_limit: break
            if len(candidate_slots) >= search_limit: break
    
    # Xử lý kết quả tìm kiếm
    if not candidate_slots:
        print("\n[KẾT THÚC] ❌ Không tìm thấy vị trí phù hợp sau khi tìm kiếm.")
        return None

    # Ưu tiên chọn ứng viên trong cùng tuần ban đầu
    same_week_candidates = [c for c in candidate_slots if c['week'] == start_week]
    if same_week_candidates:
        best_candidate = random.choice(same_week_candidates)
        print(f"  - Ưu tiên chọn ứng viên trong cùng tuần {start_week + 1}.")
    else:
        best_candidate = random.choice(candidate_slots)
        print(f"  - Chọn ứng viên từ tuần {best_candidate['week'] + 1}.")

    print(f"  - ✅ Tìm thấy vị trí mới:")
    print(f"      Ngày: {best_candidate['date']}")
    print(f"      Slot: {best_candidate['slot_id']}")
    print(f"      Phòng: {best_candidate['room_id']}")
    print(f"      Giảng viên: {best_candidate['lecturer_id']}")

    return (best_candidate['date'], best_candidate['slot_id'], best_candidate['room_id'], best_candidate['lecturer_id'])