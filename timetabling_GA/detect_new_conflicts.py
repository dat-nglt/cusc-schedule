import json
import datetime
from collections import defaultdict
import copy

# Giả định các hàm này đã được định nghĩa và có thể import
from data_processing.processor import DataProcessor
from utils.find_new_valid_slot import find_new_valid_slot
from utils.get_data_for_semester import get_data_for_semester

def build_occupied_slots_from_schedule(schedule, new_constraints):
    """
    Tạo một dictionary chứa các khung giờ đã bị chiếm dụng từ lịch trình và các ràng buộc mới.
    """
    occupied = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set(), 'classes': set()}))

    # Thêm các ràng buộc mới
    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            occupied[slot['date']][slot['slot_id']]['lecturers'].add(lecturer_id)
            
    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            occupied[slot['date']][slot['slot_id']]['rooms'].add(room_id)

    # Thêm dữ liệu từ lịch trình đã có (cập nhật để phù hợp với cấu trúc mới)
    for semester in schedule.get('semesters', []):
        for cls in semester.get('classes', []):
            cls_id = cls['class_id']
            # Lặp trực tiếp qua các buổi học trong mảng schedule
            for lesson in cls.get('schedule', []):
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                
                if lecturer_id: occupied[date][slot_id]['lecturers'].add(lecturer_id)
                if room_id: occupied[date][slot_id]['rooms'].add(room_id)
                occupied[date][slot_id]['classes'].add(cls_id)
    return occupied

def detect_new_conflicts(semester_schedule, new_constraints):
    """
    Xác định các buổi học trong lịch trình bị vi phạm bởi các ràng buộc mới.
    """
    conflicting_lessons = []
    
    new_lecturer_busy_slots = set()
    new_room_unavailable_slots = set()

    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            new_lecturer_busy_slots.add((lecturer_id, slot['date'], slot['slot_id']))

    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            new_room_unavailable_slots.add((room_id, slot['date'], slot['slot_id']))
            
    for semester in semester_schedule.get('semesters', []):
        semester_id = semester.get('semester_id')
        for cls in semester.get('classes', []):
            cls_id = cls.get('class_id')
            # Lặp trực tiếp qua các buổi học
            for lesson in cls.get('schedule', []):
                lecturer_id = lesson.get('lecturer_id')
                room_id = lesson.get('room_id')
                date = lesson.get('date')
                slot_id = lesson.get('slot_id')
                
                is_conflicted = False

                if (lecturer_id, date, slot_id) in new_lecturer_busy_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                    is_conflicted = True

                if not is_conflicted and (room_id, date, slot_id) in new_room_unavailable_slots:
                    lesson_with_context = copy.deepcopy(lesson)
                    lesson_with_context['class_id'] = cls_id
                    lesson_with_context['semester_id'] = semester_id
                    conflicting_lessons.append(lesson_with_context)
                        
    return conflicting_lessons

def update_schedule(schedule, old_lesson, new_lesson_info):
    """
    Tìm và xóa buổi học cũ, sau đó chèn buổi học mới vào vị trí đã tìm thấy.
    """
    new_date, new_slot_id, new_room_id, new_lecturer_id = new_lesson_info
    
    # Tạo một bản sao của old_lesson và cập nhật các trường
    updated_lesson = copy.deepcopy(old_lesson)
    updated_lesson['slot_id'] = new_slot_id
    updated_lesson['room_id'] = new_room_id
    updated_lesson['lecturer_id'] = new_lecturer_id
    updated_lesson['date'] = new_date
    updated_lesson['day'] = datetime.datetime.strptime(new_date, "%Y-%m-%d").strftime("%a")
    
    # Tìm và xóa buổi học cũ
    for semester in schedule['semesters']:
        if semester['semester_id'] == old_lesson['semester_id']:
            for cls in semester['classes']:
                if cls['class_id'] == old_lesson['class_id']:
                    # Lọc bỏ buổi học cũ
                    cls['schedule'] = [
                        l for l in cls['schedule'] 
                        if not (l['lesson_id'] == old_lesson['lesson_id'] and l['slot_id'] == old_lesson['slot_id'] and l['date'] == old_lesson['date'])
                    ]
                    break
            break

    # Thêm buổi học đã cập nhật vào lịch trình
    for semester in schedule['semesters']:
        if semester['semester_id'] == old_lesson['semester_id']:
            for cls in semester['classes']:
                if cls['class_id'] == old_lesson['class_id']:
                    cls['schedule'].append(updated_lesson)
                    break
            break
        
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
    
    lessons_to_fix = detect_new_conflicts(semester_schedule, new_constraints)

    if lessons_to_fix:
        print("Phát hiện các buổi học bị xung đột do ràng buộc mới:")
        for i, lesson in enumerate(lessons_to_fix):
            print(f"--- Buổi học #{i+1} ---")
            print(f"  Học kỳ: {lesson.get('semester_id')}")
            print(f"  Lớp: {lesson.get('class_id')}")
            print(f"  Môn học: {lesson.get('subject_id')}") # Sửa 'subject' thành 'subject_id'
            print(f"  Tiết: {lesson.get('lesson_type')}") # Sửa 'type' thành 'lesson_type'
            print(f"  Ngày: {lesson.get('date')} ({lesson.get('day')})")
            print(f"  Khung giờ: {lesson.get('slot_id')}") # Sửa 'slot' thành 'slot_id'
            print(f"  Giảng viên: {lesson.get('lecturer_id')}")
            print(f"  Phòng: {lesson.get('room_id')}") # Sửa 'room' thành 'room_id'
        
        print("\nBắt đầu tìm vị trí mới cho các buổi học này...")
        
        occupied_slots = build_occupied_slots_from_schedule(semester_schedule, new_constraints)
        
        unfixable_lessons = []
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
                print(f"  > Buổi học của lớp {lesson['class_id']} - môn {lesson['subject_id']} đã được chuyển sang ngày {new_slot_info[0]} tại khung giờ {new_slot_info[1]}.")
                update_schedule(semester_schedule, lesson, new_slot_info)
                
                # Cập nhật occupied_slots
                old_date, old_slot = lesson['date'], lesson['slot_id']
                new_date, new_slot_id, new_room_id, new_lecturer_id = new_slot_info
                occupied_slots[old_date][old_slot]['lecturers'].discard(lesson['lecturer_id'])
                occupied_slots[old_date][old_slot]['rooms'].discard(lesson['room_id'])
                occupied_slots[old_date][old_slot]['classes'].discard(lesson['class_id'])
                
                occupied_slots[new_date][new_slot_id]['lecturers'].add(new_lecturer_id)
                occupied_slots[new_date][new_slot_id]['rooms'].add(new_room_id)
                occupied_slots[new_date][new_slot_id]['classes'].add(lesson['class_id'])
            else:
                print(f"  > Cảnh báo: Không tìm được vị trí mới cho buổi học của lớp {lesson['class_id']} - môn {lesson['subject_id']}.")
                unfixable_lessons.append(lesson)

        with open('updated_all_schedules.json', 'w', encoding='utf-8') as f:
            json.dump(semester_schedule, f, indent=4, ensure_ascii=False)
        print("\nLịch trình đã được cập nhật thành công và lưu vào 'updated_all_schedules.json'.")

        if unfixable_lessons:
            print("\nLưu ý: Có một số buổi học không thể sắp xếp lại. Vui lòng xử lý thủ công.")
            for lesson in unfixable_lessons:
                print(f"  - Lớp: {lesson.get('class_id')}, Môn: {lesson.get('subject_id')}, Ngày: {lesson.get('date')}")
    else:
        print("Không có buổi học nào bị xung đột với các ràng buộc mới.")