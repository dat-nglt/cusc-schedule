import json
import datetime
from collections import defaultdict
import copy

# Giả định các hàm này đã được định nghĩa trong một tệp khác và có thể import
# Ví dụ: từ 'main.py' hoặc các module tương ứng.
# Lưu ý: 'timetabling_GA.main' là một giả định, bạn cần thay bằng tên file thực tế.
from data_processing.processor import DataProcessor
from main import (
    find_new_valid_slot,
    get_data_for_semester
)

# --- CÁC HÀM HỖ TRỢ CỤ THỂ CHO VIỆC CẬP NHẬT LỊCH TRÌNH ---

def build_occupied_slots_from_schedule(schedule, new_constraints):
    """
    Tạo một dictionary chứa các khung giờ đã bị chiếm dụng từ lịch trình và các ràng buộc mới.
    """
    occupied = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set(), 'classes': set()}))

    # Thêm các ràng buộc mới vào occupied_slots
    for lecturer_id, busy_slots_list in new_constraints.get('lecturers', {}).items():
        for slot in busy_slots_list:
            occupied[slot['date']][slot['slot_id']]['lecturers'].add(lecturer_id)
            
    for room_id, unavailable_slots_list in new_constraints.get('rooms', {}).items():
        for slot in unavailable_slots_list:
            occupied[slot['date']][slot['slot_id']]['rooms'].add(room_id)

    # Thêm dữ liệu từ lịch trình đã có
    for semester in schedule.get('semesters', []):
        for cls in semester.get('classes', []):
            cls_id = cls['class_id']
            for day_entry in cls.get('schedule', []):
                date = day_entry['date']
                for lesson in day_entry.get('lessons', []):
                    slot_id = lesson['slot']
                    lecturer_id = lesson.get('lecturer_id')
                    room_id = lesson.get('room_id')
                    
                    if lecturer_id: occupied[date][slot_id]['lecturers'].add(lecturer_id)
                    if room_id: occupied[date][slot_id]['rooms'].add(room_id)
                    occupied[date][slot_id]['classes'].add(cls_id)
    return occupied

def detect_new_conflicts(semester_schedule, new_constraints):
    """
    Xác định các buổi học trong lịch trình bị vi phạm bởi các ràng buộc mới,
    thêm thông tin semester_id và subject_id vào các buổi học bị xung đột.
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
            for day_schedule in cls.get('schedule', []):
                for lesson in day_schedule.get('lessons', []):
                    # print(lesson)
                    lecturer_id = lesson.get('lecturer_id')
                    room_id = lesson.get('room_id')
                    date = day_schedule.get('date')
                    slot_id = lesson.get('slot')
                    
                    # Cờ để tránh thêm một buổi học hai lần nếu nó có cả xung đột GV và Phòng
                    is_conflicted = False

                    # Kiểm tra xung đột giảng viên
                    if (lecturer_id, date, slot_id) in new_lecturer_busy_slots:
                        lesson_with_context = lesson.copy()
                        lesson_with_context['class_id'] = cls.get('class_id')
                        lesson_with_context['date'] = date
                        lesson_with_context['day'] = day_schedule.get('day')
                        lesson_with_context['semester_id'] = semester_id
                        
                        # Thêm subject_id vào đây
                        lesson_with_context['subject_id'] = lesson.get('subject_id')
                        
                        conflicting_lessons.append(lesson_with_context)
                        is_conflicted = True

                    # Kiểm tra xung đột phòng học (chỉ khi chưa bị xung đột bởi giảng viên)
                    if not is_conflicted and (room_id, date, slot_id) in new_room_unavailable_slots:
                        lesson_with_context = lesson.copy()
                        lesson_with_context['class_id'] = cls.get('class_id')
                        lesson_with_context['date'] = date
                        lesson_with_context['day'] = day_schedule.get('day')
                        lesson_with_context['semester_id'] = semester_id
                        
                        # Thêm subject_id vào đây
                        lesson_with_context['subject_id'] = lesson.get('subject_id')
                        
                        conflicting_lessons.append(lesson_with_context)
                        
    return conflicting_lessons

def update_schedule(schedule, old_lesson, new_lesson_info):
    """
    Tìm và xóa buổi học cũ, sau đó chèn buổi học mới vào vị trí đã tìm thấy.
    """
    new_date, new_slot_id, new_room_id, new_lecturer_id = new_lesson_info
    
    new_lesson = old_lesson.copy()
    new_lesson['date'] = new_date
    new_lesson['day'] = datetime.datetime.strptime(new_date, "%Y-%m-%d").strftime("%a")
    new_lesson['slot'] = new_slot_id
    new_lesson['room_id'] = new_room_id
    new_lesson['lecturer_id'] = new_lecturer_id
    
    for semester in schedule['semesters']:
        for cls in semester['classes']:
            if cls['class_id'] == old_lesson['class_id']:
                for day_schedule in cls['schedule']:
                    if day_schedule['date'] == old_lesson['date']:
                        day_schedule['lessons'] = [
                            l for l in day_schedule['lessons'] 
                            if not (l['slot'] == old_lesson['slot'] and l['subject'] == old_lesson['subject'])
                        ]
                        break
                break
    
    for semester in schedule['semesters']:
        for cls in semester['classes']:
            if cls['class_id'] == new_lesson['class_id']:
                found_date = False
                for day_schedule in cls['schedule']:
                    if day_schedule['date'] == new_lesson['date']:
                        day_schedule['lessons'].append(new_lesson)
                        found_date = True
                        break
                if not found_date:
                    cls['schedule'].append({
                        "date": new_lesson['date'],
                        "day": new_lesson['day'],
                        "lessons": [new_lesson]
                    })
                break

if __name__ == "__main__":
    try:
        with open('all_schedules.json', 'r', encoding='utf-8') as f:
            semester_schedule = json.load(f)
        with open('input_data.json', 'r', encoding='utf-8') as f:
            raw_data = json.load(f)
            
        full_processed_data = DataProcessor(raw_data)
        
        
    except FileNotFoundError:
        print("Lỗi: Không tìm thấy tệp dữ liệu 'all_schedules.json' hoặc 'input_data.json'.")
        exit()

    new_constraints = {
        'lecturers': {
            'GV03': [
                {'date': '2025-09-08', 'slot_id': 'C1'}
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
            print(f"  Học kỳ: {lesson.get('semester_id')}")
            print(f"  Lớp: {lesson.get('class_id')}")
            print(f"  Môn học: {lesson.get('subject')}")
            print(f"  Tiết: {lesson.get('type')}")
            print(f"  Ngày: {lesson.get('date')} ({lesson.get('day')})")
            print(f"  Khung giờ: {lesson.get('slot')}")
            print(f"  Giảng viên: {lesson.get('lecturer')} (ID: {lesson.get('lecturer_id')})")
            print(f"  Phòng: {lesson.get('room')} (ID: {lesson.get('room')})")
        
        print("\nBắt đầu tìm vị trí mới cho các buổi học này...")
        
        occupied_slots = build_occupied_slots_from_schedule(semester_schedule, new_constraints)
        
        unfixable_lessons = []
        for lesson in lessons_to_fix:
            semester_id = lesson.get('semester_id')
            semester_data = get_data_for_semester(semester_id, full_processed_data)
            
            if not semester_data:
                unfixable_lessons.append(lesson)
                continue
            
            # Lấy thông tin động từ semester_data
            semester_info = semester_data.semester_map.get(semester_id)
            semester_start_date_str = semester_info.get('start_date') if semester_info else None
            
            class_id = lesson.get('class_id')
            class_info = semester_data.class_map.get(class_id)
            program_id = class_info.get('program_id') if class_info else None
            program_info = semester_data.program_map.get(program_id)
            program_duration_weeks = program_info.get('duration') if program_info else 0
            
            if not semester_start_date_str:
                unfixable_lessons.append(lesson)
                continue
                
            semester_start_date = datetime.datetime.strptime(semester_start_date_str, '%Y-%m-%d')
            
            new_slot_info = find_new_valid_slot(lesson, semester_data, occupied_slots, program_duration_weeks, semester_start_date)
            
            if new_slot_info:
                print(f"  > Buổi học của lớp {lesson['class_id']} - môn {lesson['subject']} đã được chuyển sang ngày {new_slot_info[0]} tại khung giờ {new_slot_info[1]}.")
                
                update_schedule(semester_schedule, lesson, new_slot_info)
                
                old_date, old_slot = lesson['date'], lesson['slot']
                new_date, new_slot_id, new_room_id, new_lecturer_id = new_slot_info
                occupied_slots[old_date][old_slot]['lecturers'].discard(lesson['lecturer_id'])
                occupied_slots[old_date][old_slot]['rooms'].discard(lesson['room'])
                occupied_slots[old_date][old_slot]['classes'].discard(lesson['class_id'])
                
                occupied_slots[new_date][new_slot_id]['lecturers'].add(new_lecturer_id)
                occupied_slots[new_date][new_slot_id]['rooms'].add(new_room_id)
                occupied_slots[new_date][new_slot_id]['classes'].add(lesson['class_id'])
            else:
                print(f"  > Cảnh báo: Không tìm được vị trí mới cho buổi học của lớp {lesson['class_id']} - môn {lesson['subject']}.")
                unfixable_lessons.append(lesson)

        with open('updated_all_schedules.json', 'w', encoding='utf-8') as f:
            json.dump(semester_schedule, f, indent=4, ensure_ascii=False)
        print("\nLịch trình đã được cập nhật thành công và lưu vào 'updated_all_schedules.json'.")

        if unfixable_lessons:
            print("\nLưu ý: Có một số buổi học không thể sắp xếp lại. Vui lòng xử lý thủ công.")
            for lesson in unfixable_lessons:
                print(f"  - Lớp: {lesson.get('class_id')}, Môn: {lesson.get('subject')}, Ngày: {lesson.get('date')}")
    else:
        print("Không có buổi học nào bị xung đột với các ràng buộc mới.")