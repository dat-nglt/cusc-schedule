import json
import datetime
from collections import defaultdict
import copy
from typing import Dict, Any, List, Tuple, Set

# Giả định các hàm này đã được định nghĩa và có thể import
from data_processing.processor import DataProcessor
from utils.find_new_valid_slot import find_new_valid_slot
from utils.get_data_for_semester import get_data_for_semester

def build_occupied_slots_from_schedule(schedule: Dict[str, Any], new_constraints: Dict[str, Any]) -> Dict[str, Dict[str, Dict[str, Set[str]]]]:
    """
    Tạo một dictionary chứa các khung giờ đã bị chiếm dụng từ lịch trình hiện có
    và các ràng buộc mới được thêm vào.

    Args:
        schedule (Dict[str, Any]): Lịch trình học kỳ hiện tại.
        new_constraints (Dict[str, Any]): Các ràng buộc mới (giảng viên bận, phòng không dùng được).

    Returns:
        Dict[str, Dict[str, Dict[str, Set[str]]]]: Một dictionary lồng nhau
            biểu diễn các tài nguyên đã bị chiếm dụng theo ngày và khung giờ.
    """
    occupied = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set(), 'classes': set()}))

    # Thêm các ràng buộc mới vào occupied slots
    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            occupied[slot['date']][slot['slot_id']]['lecturers'].add(lecturer_id)
            
    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            occupied[slot['date']][slot['slot_id']]['rooms'].add(room_id)

    # Thêm dữ liệu từ lịch trình đã có vào occupied slots
    for semester in schedule.get('semesters', []):
        for cls in semester.get('classes', []):
            cls_id = cls['class_id']
            for lesson in cls.get('schedule', []):
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                
                if date and slot_id:
                    if lecturer_id: occupied[date][slot_id]['lecturers'].add(lecturer_id)
                    if room_id: occupied[date][slot_id]['rooms'].add(room_id)
                    occupied[date][slot_id]['classes'].add(cls_id)
                    
    return occupied

def detect_new_conflicts(semester_schedule: Dict[str, Any], new_constraints: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Xác định các buổi học trong lịch trình hiện tại bị vi phạm bởi các ràng buộc mới.

    Args:
        semester_schedule (Dict[str, Any]): Lịch trình học kỳ đã có.
        new_constraints (Dict[str, Any]): Các ràng buộc mới cần kiểm tra.

    Returns:
        List[Dict[str, Any]]: Danh sách các buổi học bị xung đột, bao gồm
                              thông tin chi tiết.
    """
    conflicting_lessons = []
    
    # Tạo các set để tra cứu nhanh các ràng buộc mới
    new_lecturer_busy_slots = set()
    new_room_unavailable_slots = set()

    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            new_lecturer_busy_slots.add((lecturer_id, slot.get('date'), slot.get('slot_id')))

    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            new_room_unavailable_slots.add((room_id, slot.get('date'), slot.get('slot_id')))
            
    # Duyệt qua toàn bộ lịch trình để tìm xung đột
    for semester in semester_schedule.get('semesters', []):
        semester_id = semester.get('semester_id')
        for cls in semester.get('classes', []):
            cls_id = cls.get('class_id')
            for lesson in cls.get('schedule', []):
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                
                # Kiểm tra xung đột với ràng buộc giảng viên
                if (lecturer_id, date, slot_id) in new_lecturer_busy_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                    
                # Kiểm tra xung đột với ràng buộc phòng học (chỉ khi chưa có xung đột)
                elif (room_id, date, slot_id) in new_room_unavailable_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                        
    return conflicting_lessons

def update_schedule(schedule: Dict[str, Any], old_lesson: Dict[str, Any], new_lesson_info: Tuple[str, str, str, str]):
    """
    Tìm và xóa buổi học cũ khỏi lịch trình, sau đó chèn buổi học đã cập nhật vào.
    
    Args:
        schedule (Dict[str, Any]): Lịch trình học kỳ gốc.
        old_lesson (Dict[str, Any]): Thông tin chi tiết của buổi học cũ.
        new_lesson_info (Tuple[str, str, str, str]): Tuple chứa thông tin mới:
                                                     (date, slot_id, room_id, lecturer_id).
    """
    new_date, new_slot_id, new_room_id, new_lecturer_id = new_lesson_info
    
    # Tạo một bản sao của old_lesson và cập nhật các trường
    updated_lesson = copy.deepcopy(old_lesson)
    updated_lesson.update({
        'slot_id': new_slot_id,
        'room_id': new_room_id,
        'lecturer_id': new_lecturer_id,
        'date': new_date,
        'day': datetime.datetime.strptime(new_date, "%Y-%m-%d").strftime("%a")
    })
    
    # Lặp qua lịch trình để tìm và thay thế buổi học
    for semester in schedule.get('semesters', []):
        if semester.get('semester_id') == old_lesson.get('semester_id'):
            for cls in semester.get('classes', []):
                if cls.get('class_id') == old_lesson.get('class_id'):
                    # Tạo danh sách mới loại bỏ buổi học cũ
                    cls['schedule'] = [
                        l for l in cls['schedule'] 
                        if not (l.get('lesson_id') == old_lesson.get('lesson_id') and l.get('slot_id') == old_lesson.get('slot_id') and l.get('date') == old_lesson.get('date'))
                    ]
                    # Thêm buổi học đã cập nhật vào
                    cls['schedule'].append(updated_lesson)
                    return # Kết thúc sớm khi đã tìm thấy và cập nhật

if __name__ == "__main__":
    try:
        with open('results/all_semesters.json', 'r', encoding='utf-8') as f:
            semester_schedule = json.load(f)
        with open('input_data.json', 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            
        full_processed_data = DataProcessor(raw_data)
        
    except FileNotFoundError:
        print("Lỗi: Không tìm thấy tệp dữ liệu 'all_semesters.json' hoặc 'input_data.json'.")
        exit()

    # Định nghĩa các ràng buộc mới
    new_constraints = {
        'lecturers': {
            'GV001': [
                {'date': '2025-08-16', 'slot_id': 'S1'}
            ]
        },
        'rooms': {
            'R104': [
                {'date': '2025-11-20', 'slot_id': 'S2'}
            ]
        }
    }
    
    # Bước 1: Phát hiện các buổi học bị xung đột
    lessons_to_fix = detect_new_conflicts(semester_schedule, new_constraints)

    if lessons_to_fix:
        print("Phát hiện các buổi học bị xung đột do ràng buộc mới:")
        for i, lesson in enumerate(lessons_to_fix):
            print(f"--- Buổi học #{i+1} ---")
            print(f"  Học kỳ: {lesson.get('semester_id')}")
            print(f"  Lớp: {lesson.get('class_id')}")
            print(f"  Môn học: {lesson.get('subject_id')}")
            print(f"  Tiết: {lesson.get('lesson_type')}")
            print(f"  Ngày: {lesson.get('date')} ({lesson.get('day')})")
            print(f"  Khung giờ: {lesson.get('slot_id')}")
            print(f"  Giảng viên: {lesson.get('lecturer_id')}")
            print(f"  Phòng: {lesson.get('room_id')}")
        
        print("\nBắt đầu tìm vị trí mới cho các buổi học này...")
        
        # Bước 2: Xây dựng occupied_slots từ lịch trình cũ và ràng buộc mới
        occupied_slots = build_occupied_slots_from_schedule(semester_schedule, new_constraints)
        
        unfixable_lessons = []
        # Bước 3: Tìm vị trí mới và cập nhật lịch trình
        for lesson in lessons_to_fix:
            semester_id = lesson.get('semester_id')
            semester_data = get_data_for_semester(semester_id, full_processed_data)
                
            if not semester_data:
                unfixable_lessons.append(lesson)
                continue
                
            class_id = lesson.get('class_id')
            class_info = semester_data.class_map.get(class_id)
            program_id = class_info.get('program_id') if class_info else None
            program_info = semester_data.program_map.get(program_id)
            program_duration_weeks = program_info.get('duration') if program_info else 0
                
            semester_info = semester_data.semester_map.get(semester_id)
            semester_start_date_str = semester_info.get('start_date') if semester_info else None
            
            if not semester_start_date_str:
                unfixable_lessons.append(lesson)
                continue
                    
            semester_start_date = datetime.datetime.strptime(semester_start_date_str, '%Y-%m-%d')
                
            new_slot_info = find_new_valid_slot(lesson, semester_data, occupied_slots, program_duration_weeks, semester_start_date)
            
            if new_slot_info:
                print(f"  > Buổi học của lớp {lesson['class_id']} - môn {lesson['subject_id']} đã được chuyển sang ngày {new_slot_info[0]} tại khung giờ {new_slot_info[1]}.")
                update_schedule(semester_schedule, lesson, new_slot_info)
                
                # Cập nhật occupied_slots để tránh xung đột với các buổi học tiếp theo
                old_date, old_slot = lesson['date'], lesson['slot_id']
                new_date, new_slot_id, new_room_id, new_lecturer_id = new_slot_info
                
                occupied_slots[old_date][old_slot]['lecturers'].discard(lesson.get('lecturer_id'))
                occupied_slots[old_date][old_slot]['rooms'].discard(lesson.get('room_id'))
                occupied_slots[old_date][old_slot]['classes'].discard(lesson.get('class_id'))
                
                occupied_slots[new_date][new_slot_id]['lecturers'].add(new_lecturer_id)
                occupied_slots[new_date][new_slot_id]['rooms'].add(new_room_id)
                occupied_slots[new_date][new_slot_id]['classes'].add(lesson.get('class_id'))
            else:
                print(f"  > Cảnh báo: Không tìm được vị trí mới cho buổi học của lớp {lesson['class_id']} - môn {lesson['subject_id']}.")
                unfixable_lessons.append(lesson)

        # Ghi lịch trình đã cập nhật vào file
        with open('updated_all_schedules.json', 'w', encoding='utf-8') as f:
            json.dump(semester_schedule, f, indent=4, ensure_ascii=False)
        print("\nLịch trình đã được cập nhật thành công và lưu vào 'updated_all_schedules.json'.")

        if unfixable_lessons:
            print("\nLưu ý: Có một số buổi học không thể sắp xếp lại. Vui lòng xử lý thủ công:")
            for lesson in unfixable_lessons:
                print(f"  - Lớp: {lesson.get('class_id')}, Môn: {lesson.get('subject_id')}, Ngày: {lesson.get('date')}")
    else:
        print("Không có buổi học nào bị xung đột với các ràng buộc mới.")