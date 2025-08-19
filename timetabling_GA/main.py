# timetable_ga/main.py
from datetime import datetime, timedelta
import json
import sys
import time
import copy
import random
from pprint import pprint
import os
from collections import defaultdict
from config import (
    POPULATION_SIZE, MAX_GENERATIONS, MUTATION_RATE, CROSSOVER_RATE, ELITISM_COUNT
)
from data_processing.loader import load_data
from data_processing.processor import DataProcessor
from ga_components.population import initialize_population
from ga_components.fitness import FitnessCalculator
from ga_components.selection import tournament_selection
from ga_components.crossover import lesson_based_crossover
from ga_components.mutation import mutate_chromosome
from ga_components.chromosome import Chromosome
from utils.exporter import export_semester_schedule_to_excel
from utils.get_date_from_week_day import get_date_from_week_day
from utils.output_parser import create_json_from_ga_results, export_to_json_file
from utils.display_ga_progress import display_ga_progress
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

# --- HÀM PHỤ TRỢ MỚI ---
def is_lecturer_weekly_busy_on_day_and_slot(lecturer_id, day, slot_id, processed_data):
    """Kiểm tra xem giảng viên có bận vào khung giờ cố định hàng tuần không."""
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    weekly_busy_slots = lecturer_info.get('busy_slots', [])
    for busy_slot in weekly_busy_slots:
        if busy_slot['day'] == day and busy_slot['slot_id'] == slot_id:
            return True
    return False

def is_lecturer_semester_busy_on_date_and_slot(lecturer_id, date_str, slot_id, processed_data):
    """Kiểm tra xem giảng viên có bận vào một ngày cụ thể trong học kỳ không."""
    lecturer_info = processed_data.lecturer_map.get(lecturer_id, {})
    semester_busy_slots = lecturer_info.get('semester_busy_slots', [])
    for busy_slot in semester_busy_slots:
        if busy_slot['date'] == date_str and busy_slot['slot_id'] == slot_id:
            return True
    return False

def generate_semester_schedule(best_weekly_chromosome, processed_data):
    unassignable_lessons = []
    # Khởi tạo danh sách để lưu các buổi học không thể gán
    
    # Khởi tạo lịch trình học kỳ theo lớp với 16 tuần
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    
    # Ánh xạ class_id tới các buổi học hàng tuần của nó
    weekly_lessons_map = defaultdict(list)
    for gene in best_weekly_chromosome.genes:
        weekly_lessons_map[gene['class_id']].append(gene)
    
    # Danh sách chứa tất cả các buổi học của toàn bộ học kỳ trước khi phân phối
    all_semester_lessons_to_distribute = []
    
    # Tạo các map tiện ích để truy cập dữ liệu nhanh hơn
    days_of_week_index_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week'))}
    semester_info_map = {sem['semester_id']: sem for sem in processed_data.data.get('semesters', [])}
    subject_info_map = {sub['subject_id']: sub for sub in processed_data.data.get('subjects', [])}

    # Cần một map để ánh xạ chỉ số ngày (0-6) sang tên ngày
    weekday_map = {
        0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu",
        4: "Fri", 5: "Sat", 6: "Sun"
    }
    
    # Tạo một dictionary để lưu thông tin chương trình và học kỳ cho mỗi lớp học
    class_program_info = {}
    
    # --- GIAI ĐOẠN 1: MỞ RỘNG LỊCH TRÌNH TUẦN THÀNH LỊCH TRÌNH HỌC KỲ ---
    for cls_id, lessons_for_this_class_weekly in weekly_lessons_map.items():
        cls_info = processed_data.class_map.get(cls_id)
        if not cls_info:
            continue
        
        program = processed_data.program_map.get(cls_info['program_id'])
        if not program:
            continue

        program_duration_weeks = program.get('duration', 0)
        
        # Tìm semester_id của lớp học này
        semester_id_for_class = next((s['semester_id'] for s in program['semesters'] if any(cls_id == c['class_id'] for c in processed_data.data['classes'] if c['program_id'] == program['program_id'])), None)
        if not semester_id_for_class:
            continue

        semester_info = semester_info_map.get(semester_id_for_class, {})
        semester_start_date_str = semester_info.get('start_date')
        
        if not semester_start_date_str:
            continue
            
        semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        
        # Lưu thông tin học kỳ của lớp vào dictionary
        class_program_info[cls_id] = {
            'program_duration_weeks': program_duration_weeks,
            'semester_start_date': semester_start_date,
            'semester_id': semester_id_for_class
        }
        
        full_semester_lessons_for_class = []
        # Nhân bản các buổi học hàng tuần để tạo ra lịch trình cho cả học kỳ
        for week_num in range(program_duration_weeks):
            for lesson_template in lessons_for_this_class_weekly:
                new_lesson = lesson_template.copy()
                day_of_week_eng = new_lesson['day']
                
                # Lấy chỉ số ngày tương ứng từ gen
                day_offset_from_gene = days_of_week_index_map.get(day_of_week_eng, None)
                
                if day_offset_from_gene is None:
                    continue

                # Tính ngày cụ thể của buổi học trong học kỳ dựa trên day_offset từ gen
                lesson_date = semester_start_date + timedelta(weeks=week_num, days=day_offset_from_gene)

                # 💡 SỬA LỖI: Cập nhật trường 'day' để khớp với ngày thực tế
                new_lesson['day'] = weekday_map.get(lesson_date.weekday())

                new_lesson['week'] = week_num + 1
                new_lesson['date'] = lesson_date.strftime('%Y-%m-%d')
                new_lesson['semester_id'] = semester_id_for_class

                subject_id = new_lesson['subject_id']
                subject_info = subject_info_map.get(subject_id)
                if subject_info:
                    lesson_type = 'practice' if subject_info.get('practice_hours', 0) > 0 else 'theory'
                    new_lesson['lesson_type'] = lesson_type
                
                full_semester_lessons_for_class.append(new_lesson)
        
        random.shuffle(full_semester_lessons_for_class)
        all_semester_lessons_to_distribute.extend(full_semester_lessons_for_class)
        
        # In ra gọn gàng để kiểm tra
        data_sorted = sorted(full_semester_lessons_for_class, key=lambda x: datetime.strptime(x['date'], "%Y-%m-%d"))
        print("\n--- LỊCH TRÌNH HỌC KỲ CHO LỚP", cls_id, "---")
        # for d in data_sorted:
        #     print(f"{d} \n")
        # break
    
    # Dictionary để theo dõi các slot đã bị chiếm dụng (theo ngày, slot, giảng viên/phòng)
    occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set()}))
    # Danh sách các buổi học bị xung đột cần sắp xếp lại
    lessons_needing_reassignment = []

    # --- GIAI ĐOẠN 2: KIỂM TRA VÀ PHÂN PHỐI CÁC BUỔI HỌC BAN ĐẦU ---
    for lesson in all_semester_lessons_to_distribute:
        date = lesson['date']
        slot = lesson['slot_id']
        lecturer = lesson['lecturer_id']
        room = lesson['room_id']
        cls_id = lesson['class_id']
        week_num = lesson['week'] - 1
        # day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
        try:
            day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
        except IndexError:
            # Xử lý trường hợp chỉ số không tồn tại (ngày Chủ Nhật)
            lesson['clash_reason'] = "Ngày không hợp lệ (Chủ Nhật)"
            lessons_needing_reassignment.append(lesson)
            continue
        # --- LOGIC KIỂM TRA RÀNG BUỘC CỨNG ---
        is_clash = (
            lecturer in occupied_slots[date][slot]['lecturers'] or
            room in occupied_slots[date][slot]['rooms'] or
            is_lecturer_weekly_busy_on_day_and_slot(lecturer, day_of_week, slot, processed_data) or
            is_lecturer_semester_busy_on_date_and_slot(lecturer, date, slot, processed_data)
        )

        if is_clash:
            # Nếu có xung đột, đưa buổi học vào danh sách cần sắp xếp lại
            lessons_needing_reassignment.append(lesson)
        else:
            # Nếu không có xung đột, gán buổi học vào lịch trình
            if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
                semester_schedule_by_class[cls_id][week_num].append(lesson)
                # Cập nhật các tài nguyên đã chiếm dụng
                occupied_slots[date][slot]['lecturers'].add(lecturer)
                occupied_slots[date][slot]['rooms'].add(room)

    # --- GIAI ĐOẠN 3: SẮP XẾP LẠI CÁC BUỔI HỌC BỊ XUNG ĐỘT ---
    for lesson in lessons_needing_reassignment:
        cls_info = processed_data.class_map.get(lesson['class_id'])
        if not cls_info or cls_info['class_id'] not in class_program_info:
            continue
            
        info = class_program_info[cls_info['class_id']]
        program_duration_weeks = info['program_duration_weeks']
        semester_start_date = info['semester_start_date']
        
        # Gọi hàm tìm kiếm một vị trí mới
        new_slot_info = find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date)
        
        if new_slot_info:
            # Nếu tìm thấy vị trí mới, cập nhật thông tin buổi học
            new_date, new_slot, new_room, new_lecturer = new_slot_info
            
            lesson['slot_id'] = new_slot
            lesson['date'] = new_date
            lesson['room_id'] = new_room
            lesson['lecturer_id'] = new_lecturer
            
            # Tính số tuần mới của buổi học
            new_week_num = int((datetime.strptime(new_date, '%Y-%m-%d') - semester_start_date).days / 7)
            
            # Gán buổi học đã sửa vào lịch trình và cập nhật occupied_slots
            semester_schedule_by_class[lesson['class_id']][new_week_num].append(lesson)
            occupied_slots[new_date][new_slot]['lecturers'].add(new_lecturer)
            occupied_slots[new_date][new_slot]['rooms'].add(new_room)
        else:
            # Nếu không tìm thấy, thêm buổi học vào danh sách không thể gán
            unassignable_lessons.append(lesson)
            
    # pprint(semester_schedule_by_class)
    return semester_schedule_by_class, unassignable_lessons

def format_semester_schedule(semester_schedule, processed_data):
    output_lines = []
    # Sort semester_schedule by class_id to ensure consistent output order
    sorted_class_ids = sorted(semester_schedule.keys())
    for class_id in sorted_class_ids:
        weekly_schedules = semester_schedule[class_id]
        cls_info = processed_data.class_map.get(class_id)
        program_id = cls_info.get('program_id') if cls_info else None
        output_lines.append(f"\n===== SEMESTER SCHEDULE FOR CLASS: {class_id} ({processed_data.program_map.get(program_id, {}).get('program_name', program_id) if program_id else ''}) =====")
        if not weekly_schedules:
            output_lines.append("   (No schedule data found for this class.)")
            continue
        for week_idx, week_lessons in enumerate(weekly_schedules):
            if not week_lessons:
                continue
            output_lines.append(f"\n    --- Week {week_idx + 1} ---")
            lessons_by_date = defaultdict(list)
            for lesson in week_lessons:
                lessons_by_date[lesson['date']].append(lesson)
            sorted_dates = sorted(lessons_by_date.keys())
            for lesson_date in sorted_dates:
                # Kiểm tra và in ra các buổi học bị lỗi
                lessons_with_error = [g for g in lessons_by_date[lesson_date] if g.get('slot_id') is None]
                if lessons_with_error:
                    output_lines.append(f"     ❗❗ Lessons with missing slot_id on {lesson_date}:")
                    for lesson in lessons_with_error:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        output_lines.append(f"       - Subject: {subject_name} ({lesson['lesson_type']})")

                output_lines.append(f"      Date: {lesson_date}")
                
                # Sắp xếp các buổi học có slot_id hợp lệ
                def get_slot_order_key(lesson):
                    slot_id = lesson.get('slot_id')
                    if slot_id is not None and slot_id in processed_data.slot_order_map:
                        return processed_data.slot_order_map[slot_id]
                    return float('inf')  # Đẩy các buổi học không có slot_id xuống cuối danh sách

                sorted_daily_lessons = sorted(lessons_by_date[lesson_date], key=get_slot_order_key)

                for lesson in sorted_daily_lessons:
                    # Bỏ qua các buổi học có slot_id là None
                    if lesson.get('slot_id') is None:
                        print(f"Đây: {lesson}")
                        break
                        continue
                        
                    subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                    lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                    output_lines.append(
                        f"        - Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {subject_name} ({lesson['lesson_type']}), "
                        f"Room: {lesson['room_id']}, Lecturer: {lecturer_name}"
                    )
    return "\n".join(output_lines)
def generate_lecturer_semester_view(semester_schedule_by_class, processed_data):
    """
    Tạo ra một cấu trúc dữ liệu lịch dạy cho từng giảng viên trong cả học kỳ.
    """
    lecturer_view = defaultdict(lambda: defaultdict(list))
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            for lesson in lessons_in_week:
                lecturer_id = lesson.get('lecturer_id')
                if lecturer_id and lecturer_id != "UNASSIGNED_LECTURER":
                    week_num = week_idx + 1
                    lesson_info_for_lecturer = {
                        'day': lesson['day'],
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'room_id': lesson['room_id'],
                    }
                    lecturer_view[lecturer_id][week_num].append(lesson_info_for_lecturer)
    for lecturer_id in lecturer_view:
        for week_num in lecturer_view[lecturer_id]:
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
    return lecturer_view

def generate_room_semester_view(semester_schedule_by_class, processed_data):
    """
    Tạo ra một cấu trúc dữ liệu lịch sử dụng cho từng phòng học trong cả học kỳ.
    """
    room_view = defaultdict(lambda: defaultdict(list))
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            for lesson in lessons_in_week:
                room_id = lesson.get('room_id')
                if room_id and room_id != "UNASSIGNED_ROOM":
                    week_num = week_idx + 1
                    lesson_info_for_room = {
                        'day': lesson['day'],
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'lecturer_id': lesson['lecturer_id'],
                    }
                    room_view[room_id][week_num].append(lesson_info_for_room)

    for room_id in room_view:
        for week_num in room_view[room_id]:
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                room_view[room_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                room_view[room_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
    return room_view

def format_text_lecturer_schedule(lecturer_view, processed_data):
    """
    Định dạng lịch dạy của giảng viên thành một chuỗi văn bản với các từ khóa rõ ràng.
    """
    output_lines = ["\n\n=========================================",
                    "LỊCH DẠY CỦA GIẢNG VIÊN THEO HỌC KỲ:",
                    "========================================="]
    
    days_of_week_map_local = {
        "Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4",
        "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"
    }

    sorted_lecturer_ids = sorted(lecturer_view.keys())

    if not sorted_lecturer_ids:
        output_lines.append("\n(Không có giảng viên nào được xếp lịch)")
        return "\n".join(output_lines)

    for lecturer_id in sorted_lecturer_ids:
        lecturer_name = processed_data.lecturer_map.get(lecturer_id, {}).get('lecturer_name', lecturer_id)
        output_lines.append(f"\n\n===== LỊCH DẠY GIẢNG VIÊN: {lecturer_id} - {lecturer_name} =====")
        
        lecturer_schedule = lecturer_view[lecturer_id]
        sorted_weeks = sorted(lecturer_schedule.keys())

        for week_num in sorted_weeks:
            lessons_in_week = lecturer_schedule[week_num]
            if not lessons_in_week:
                continue 

            output_lines.append(f"\n  --- Tuần {week_num} ---")
            for lesson in lessons_in_week:
                day_vie = days_of_week_map_local.get(lesson.get('day'), lesson.get('day'))
                subject_name = processed_data.subject_map.get(lesson.get('subject_id'), {}).get('name', lesson.get('subject_id'))
                
                output_lines.append(
                    f"    - Day: {day_vie} ({lesson.get('day')}), Slot: {lesson.get('slot_id')}, Class: {lesson.get('class_id')}"
                )
                output_lines.append(
                    f"      Subject: {subject_name} ({lesson.get('lesson_type')}), Room: {lesson.get('room_id')}"
                )
    return "\n".join(output_lines)

def format_text_room_schedule(room_view, processed_data):
    """
    Định dạng lịch sử dụng phòng học thành một chuỗi văn bản với các từ khóa rõ ràng.
    """
    output_lines = ["\n\n=========================================",
                    "LỊCH SỬ DỤNG PHÒNG HỌC THEO HỌC KỲ:",
                    "========================================="]
    
    days_of_week_map_local = {
        "Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4",
        "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"
    }
    
    sorted_room_ids = sorted(room_view.keys())

    if not sorted_room_ids:
        output_lines.append("\n(Không có phòng học nào được sử dụng)")
        return "\n".join(output_lines)

    for room_id in sorted_room_ids:
        output_lines.append(f"\n\n===== LỊCH SỬ DỤNG PHÒNG: {room_id} =====")
        
        room_schedule = room_view[room_id]
        sorted_weeks = sorted(room_schedule.keys())
        
        for week_num in sorted_weeks:
            lessons_in_week = room_schedule[week_num]
            if not lessons_in_week:
                continue

            output_lines.append(f"\n  --- Tuần {week_num} ---")
            for lesson in lessons_in_week:
                day_vie = days_of_week_map_local.get(lesson.get('day'), lesson.get('day'))
                subject_name = processed_data.subject_map.get(lesson.get('subject_id'), {}).get('name', lesson.get('subject_id'))
                lecturer_name = processed_data.lecturer_map.get(lesson.get('lecturer_id'), {}).get('lecturer_name', lesson.get('lecturer_id'))
                
                output_lines.append(
                    f"    - Day: {day_vie} ({lesson.get('day')}), Slot: {lesson.get('slot_id')}, Class: {lesson.get('class_id')}"
                )
                output_lines.append(
                    f"      Subject: {subject_name} ({lesson.get('lesson_type')}), Lecturer: {lecturer_name}"
                )
    return "\n".join(output_lines)

def run_ga_for_semester(semester_id, full_data_processor):
    # Sử dụng phương thức filter_for_semester của DataProcessor
    semester_specific_data_processor = full_data_processor.filter_for_semester(semester_id)
    
    if not semester_specific_data_processor:
        print(f"Lỗi: Không tìm thấy thông tin cho học kỳ {semester_id}")
        return None, None
    
    if not semester_specific_data_processor.lecturer_map:
        print(f"Lỗi: Học kỳ {semester_id} không có giảng viên phù hợp.")
        return None, None
    if not semester_specific_data_processor.room_map:
        print(f"Lỗi: Học kỳ {semester_id} không có phòng học phù hợp.")
        return None, None        
    if not semester_specific_data_processor.required_lessons_weekly:
        print(f"Cảnh báo: Học kỳ {semester_id} không có tiết học nào được tạo sau khi lọc.")
        return None, None
        
    fitness_calculator = FitnessCalculator(semester_specific_data_processor)
    population = initialize_population(POPULATION_SIZE, semester_specific_data_processor)
    
    # Khởi tạo quần thể và tính toán fitness ban đầu
    for chrom in population:
        chrom.fitness, _ = fitness_calculator.calculate_fitness(chrom) # Gán fitness, bỏ qua chi tiết vi phạm

    best_overall_chromosome = None
    best_overall_violations = {} # Thêm dictionary để lưu chi tiết vi phạm tốt nhất
    ga_log_data = []

    for generation in range(MAX_GENERATIONS):
        # Sắp xếp quần thể dựa trên điểm fitness
        population.sort(key=lambda c: c.fitness, reverse=True)
        
        # Lấy nhiễm sắc thể tốt nhất của thế hệ hiện tại
        current_best_chromosome = population[0]

        # Cập nhật nhiễm sắc thể tốt nhất toàn cục
        if best_overall_chromosome is None or current_best_chromosome.fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = current_best_chromosome
            # Tính toán lại fitness để lấy chi tiết vi phạm
            _, best_overall_violations = fitness_calculator.calculate_fitness(best_overall_chromosome)
        
        # Hiển thị tiến trình GA
        _, current_violations = fitness_calculator.calculate_fitness(current_best_chromosome)

    # Now, call the improved display_ga_progress with the new violation data
        display_ga_progress(
            generation=generation,
            max_generations=MAX_GENERATIONS,
            current_best_fitness=current_best_chromosome.fitness,
            overall_best_fitness=best_overall_chromosome.fitness,
            current_best_violations=current_violations,
            overall_best_violations=best_overall_violations,
            log_interval=1
        )
        
        # Ghi log dữ liệu của từng thế hệ
        # Để lấy chi tiết vi phạm của thế hệ hiện tại, ta phải chạy lại hàm calculate_fitness
        _, current_violations = fitness_calculator.calculate_fitness(current_best_chromosome)

        ga_log_data.append({
            "generation": generation + 1,
            "best_fitness_gen": current_best_chromosome.fitness,
            "best_overall_fitness": best_overall_chromosome.fitness,
            "current_violations": current_violations
        })

        # Dừng nếu tìm thấy giải pháp hoàn hảo
        # if current_best_chromosome.fitness >= 0:
        #     break

        new_population = []
        new_population.extend(population[:ELITISM_COUNT])
        while len(new_population) < POPULATION_SIZE:
            parent1 = tournament_selection(population)
            parent2 = tournament_selection(population)

            if random.random() < CROSSOVER_RATE:
                child1, child2 = lesson_based_crossover(parent1, parent2, semester_specific_data_processor)
            else:
                child1, child2 = parent1, parent2

            mutate_chromosome(child1, semester_specific_data_processor, MUTATION_RATE)
            mutate_chromosome(child2, semester_specific_data_processor, MUTATION_RATE)
            
            # Tính toán và gán fitness mới cho con
            child1.fitness, _ = fitness_calculator.calculate_fitness(child1)
            child2.fitness, _ = fitness_calculator.calculate_fitness(child2)

            new_population.append(child1)
            if len(new_population) < POPULATION_SIZE:
                new_population.append(child2)
        population = new_population

    return best_overall_chromosome, ga_log_data

# main.py
def get_data_for_semester(semester_id, full_data):
    """
    Tạo một bản sao của đối tượng DataProcessor, chỉ chứa dữ liệu liên quan
    đến một học kỳ cụ thể.
    """
    # Lấy thông tin về các môn học của học kỳ đó từ semester_map
    related_subject_ids = full_data.semester_map.get(semester_id, {}).get("subject_ids", [])
    if not related_subject_ids:
        print(f"Không tìm thấy thông tin môn học cho học kỳ {semester_id}.")
        return None
        
    # Tạo một bản sao sâu của dữ liệu gốc để chỉnh sửa
    semester_data_dict = copy.deepcopy(full_data.data)

    # 1. Lọc danh sách các học kỳ, chỉ giữ lại học kỳ được chọn
    semester_data_dict['semesters'] = [
        s for s in semester_data_dict['semesters'] if s['semester_id'] == semester_id
    ]
    
    # 2. Lọc danh sách các môn học, chỉ giữ lại các môn thuộc học kỳ này
    semester_data_dict['subjects'] = [
        s for s in semester_data_dict['subjects'] if s['subject_id'] in related_subject_ids
    ]
    
    # 3. Lọc các chương trình và học kỳ bên trong chương trình
    filtered_programs = []
    for prog in semester_data_dict['programs']:
        if any(s['semester_id'] == semester_id for s in prog['semesters']):
            # Tạo bản sao của chương trình và chỉ giữ lại học kỳ đã chọn
            prog_copy = copy.deepcopy(prog)
            prog_copy['semesters'] = [s for s in prog_copy['semesters'] if s['semester_id'] == semester_id]
            filtered_programs.append(prog_copy)
    semester_data_dict['programs'] = filtered_programs
    
    # 4. Lọc các lớp học, chỉ giữ lại các lớp thuộc chương trình đã lọc
    related_program_ids = [p['program_id'] for p in semester_data_dict['programs']]
    semester_data_dict['classes'] = [
        c for c in semester_data_dict['classes'] if c['program_id'] in related_program_ids
    ]
    
    # 5. Lọc các giảng viên, chỉ giữ lại những người dạy các môn học đã lọc
    related_lecturer_ids = [
        l['lecturer_id'] for l in semester_data_dict['lecturers']
        if any(sub_id in related_subject_ids for sub_id in l['subjects'])
    ]
    semester_data_dict['lecturers'] = [
        l for l in semester_data_dict['lecturers'] if l['lecturer_id'] in related_lecturer_ids
    ]

    # Tạo một đối tượng DataProcessor mới với dữ liệu đã lọc
    return DataProcessor(semester_data_dict)

from datetime import datetime

def flatten_and_sort_semester_timetable(semester_timetable, semester_id):
    """
    Trả về 2 đối tượng:
    - by_class: dict {class_id: [lessons sorted]}
    - by_semester: dict {semester_id: [lessons sorted]}
    """
    by_class = {}
    all_lessons = []

    for class_id, list_of_lessons in semester_timetable.items():
        # Gộp tất cả list con thành 1 list phẳng cho class đó
        flat_lessons = [lesson for lessons in list_of_lessons for lesson in lessons]
        # Sort theo ngày
        flat_lessons_sorted = sorted(
            flat_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
        )
        by_class[class_id] = flat_lessons_sorted
        all_lessons.extend(flat_lessons)

    # Sort toàn bộ lessons theo ngày, group theo semester_id
    all_lessons_sorted = sorted(
        all_lessons, key=lambda x: datetime.strptime(x["date"], "%Y-%m-%d")
    )
    by_semester = {semester_id: all_lessons_sorted}

    return by_class, by_semester


def export_combined_results(all_semester_results, processed_data, output_folder):
    print("\n--- Bắt đầu xuất lịch ra file Excel ---")

    combined_json = {"semesters": []}

    # Vòng lặp chính để xử lý từng học kỳ
    for semester_id, result in all_semester_results.items():
        best_chrom = result["chromosome"]
        semester_specific_data = get_data_for_semester(semester_id, processed_data)
        semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, semester_specific_data)

        # 🔹 Flatten timetable theo class
        by_class, _ = flatten_and_sort_semester_timetable(semester_timetable, semester_id)

        # Tạo entry cho học kỳ hiện tại
        semester_entry = {
            "semester_id": semester_id,
            "classes": []
        }

        # Vòng lặp xử lý từng lớp, nằm gọn trong vòng lặp học kỳ
        for class_id, class_schedule in by_class.items():
            class_info = semester_specific_data.class_map.get(class_id)
            program_name = class_info.get("program_name", "")

            semester_entry["classes"].append({
                "class_id": class_id,
                "program_name": program_name,
                "schedule": class_schedule
            })

        # 💡 SỬA LỖI: Thêm semester_entry vào danh sách ngay khi đã điền đầy đủ
        combined_json["semesters"].append(semester_entry)

        # Xuất Excel theo từng học kỳ
        # Tạo thư mục đầu ra cho học kỳ cụ thể
        semester_output_folder = os.path.join(output_folder, semester_id)
        if not os.path.exists(semester_output_folder):
            os.makedirs(semester_output_folder)
            
        # Xuất file JSON debug để kiểm tra dữ liệu thô
        debug_file = os.path.join(semester_output_folder, f"debug_{semester_id}_timetable.json")
        try:
            with open(debug_file, "w", encoding="utf-8") as f:
                json.dump(semester_timetable, f, indent=4, ensure_ascii=False)
            print(f"  ✅ Đã lưu dữ liệu thời khóa biểu thô vào: {debug_file}")
        except Exception as e:
            print(f"  ❌ Lỗi khi lưu file debug: {e}")

        # Xuất file Excel thời khóa biểu
        try:
            export_semester_schedule_to_excel(
                semester_schedule_json=semester_timetable,
                output_folder=semester_output_folder
            )
            print(f"  ✅ Đã xuất thời khóa biểu học kỳ thành công vào thư mục: {semester_output_folder}")
        except Exception as e:
            print(f"  ❌ Lỗi khi xuất file Excel: {e}")
        
        lecturer_semester_view = generate_lecturer_semester_view(semester_timetable, semester_specific_data)
        room_semester_view = generate_room_semester_view(semester_timetable, semester_specific_data)

        # export_lecturer_view_to_excel(lecturer_semester_view, semester_specific_data, output_folder=semester_output_folder)
        # export_room_view_to_excel(room_semester_view, semester_specific_data, output_folder=semester_output_folder)

        print(f"  Đã hoàn tất xuất file Excel cho {semester_id} trong thư mục '{semester_output_folder}'")

    # ---
    
    # 🔹 Xuất JSON tổng hợp (sau khi đã duyệt hết tất cả các học kỳ)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    combined_file = os.path.join(output_folder, "all_semesters.json")
    with open(combined_file, "w", encoding="utf-8") as f:
        json.dump(combined_json, f, indent=4, ensure_ascii=False)

    print(f"  >> Đã xuất toàn bộ thời khóa biểu ra {combined_file}")
    print("\n--- Đã hoàn thành xuất tất cả các file Excel & JSON. ---")


def genetic_algorithm():
    print("Loading data...")
    raw_data = load_data("input_data.json")
    if not raw_data:
        return

    print("Processing data...")
    processed_data = DataProcessor(raw_data)
    
    print(f"Số lượng tiết học hàng tuần cần xếp lịch: {len(processed_data.required_lessons_weekly)}")
    
    output_folder = "results"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    all_semester_results = {}
    for semester_id, semester_info in processed_data.semester_map.items():
        print(f"\n--- Bắt đầu tạo lịch cho Học kỳ: {semester_id} ---")
        
        # Hàm run_ga_for_semester giờ đây sẽ trả về một list các tiết học
        # đã được tối ưu
        best_chromosome, ga_log = run_ga_for_semester(semester_id, processed_data)
        
        if best_chromosome:
            # best_chromosome là một list các lessons dictionary
            all_semester_results[semester_id] = {
                "chromosome": best_chromosome,
                "log": ga_log
            }
            print()
            print(f"Lịch học tối ưu nhất cho {semester_id} đã được tạo thành công.")
        else:
            print(f"Không thể tạo lịch cho {semester_id}.")

    if all_semester_results:
        print("\n--- Tổng hợp và xuất kết quả ---")
        
        # json_data = create_json_from_ga_results(all_semester_results, processed_data)
        # export_to_json_file(json_data, "all_schedules.json", output_folder)

        # 2. Xuất file Excel (nếu cần, bạn vẫn có thể giữ lại hàm này)
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    sys.stdout.flush()
    
if __name__ == "__main__":
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()