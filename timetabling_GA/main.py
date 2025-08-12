# timetable_ga/main.py
from datetime import datetime, timedelta
import sys
import time
import copy
import random
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
from utils.get_date_from_week_day import get_date_from_week_day
from utils.exporter import export_semester_schedule_to_excel, export_lecturer_view_to_excel, export_room_view_to_excel
from utils.output_parser import create_json_from_ga_results, export_to_json_file
from utils.display_ga_progress import display_ga_progress
from utils.check_hard_constraints import check_hard_constraints


def find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date):
    """
    Tìm một khung thời gian trống hợp lệ cho một buổi học bị xung đột,
    sử dụng ngày bắt đầu học kỳ để tính toán chính xác và xem xét tất cả các ràng buộc.
    """
    print("\n[BẮT ĐẦU] Tìm vị trí mới cho buổi học:")
    print(f"  - Buổi học: Lớp {lesson['class_id']}, Môn {lesson.get('subject')}, Tiết {lesson.get('type')}")
    print(f"  - Học kỳ bắt đầu: {semester_start_date.strftime('%Y-%m-%d')}, Kéo dài {program_duration_weeks} tuần.")

    candidate_slots = []
    
    class_id = lesson['class_id']
    subject_id = lesson.get('subject_id') or lesson.get('subject') 
    
    if not subject_id:
        print("  ❌ Lỗi: Không tìm thấy ID môn học.")
        return None

    
    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        print("  ❌ Lỗi: Không tìm thấy giảng viên nào dạy môn này.")
        return None
        
    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson['type'], lesson['size'])
    if not valid_rooms:
        print("  ❌ Lỗi: Không tìm thấy phòng học phù hợp.")
        return None

    search_limit = 1000 
    days_of_week_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week', []))}

    weeks_to_search = list(range(program_duration_weeks))
    random.shuffle(weeks_to_search)
    days_to_search = processed_data.data.get('days_of_week', [])
    random.shuffle(days_to_search)
    slots_to_search = [s['slot_id'] for s in processed_data.data['time_slots']]
    random.shuffle(slots_to_search)
    random.shuffle(valid_lecturers)
    random.shuffle(valid_rooms)
    
    print(f"  - Đang tìm kiếm trong {len(weeks_to_search)} tuần, {len(days_to_search)} ngày, {len(slots_to_search)} slot, {len(valid_lecturers)} GV, {len(valid_rooms)} phòng.")

    for week in weeks_to_search:
        for day_of_week_eng in days_to_search:
            date = get_date_from_week_day(week, day_of_week_eng, semester_start_date, days_of_week_map)
            date_str = date.strftime('%Y-%m-%d')

            for slot_id in slots_to_search:
                for lecturer in valid_lecturers:
                    for room in valid_rooms:
                        # Kiểm tra các ràng buộc cứng
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
        print("\n[KẾT THÚC] 😞 Không tìm thấy ứng viên hợp lệ nào sau khi đã thử hết tất cả các khả năng.")
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
    """
    Tạo lịch trình học kỳ đầy đủ từ lịch trình tuần tối ưu,
    đồng thời sửa các xung đột phát sinh và phân bổ dựa trên thời gian
    của từng chương trình học.

    Args:
        best_weekly_chromosome (Chromosome): Nhiễm sắc thể có fitness tốt nhất từ thuật toán GA,
                                             đại diện cho lịch trình hàng tuần tối ưu.
        processed_data (DataProcessor): Đối tượng chứa toàn bộ dữ liệu đã được xử lý (lớp, môn học,
                                        giảng viên, phòng học, v.v.).

    Returns:
        tuple: Một tuple chứa hai giá trị:
            - semester_schedule_by_class (defaultdict): Lịch trình học kỳ đã được sắp xếp,
                                                         ánh xạ class_id tới một list chứa các tuần,
                                                         và mỗi tuần chứa list các buổi học.
            - unassignable_lessons (list): Danh sách các buổi học không thể sắp xếp lại do
                                           không tìm thấy vị trí trống hợp lệ.
    """
    # Khởi tạo danh sách để lưu các buổi học không thể gán
    unassignable_lessons = []
    
    # Khởi tạo lịch trình học kỳ. defaultdict giúp tự động tạo list rỗng cho một lớp mới.
    # Kích thước 16 tuần ban đầu có thể cần được điều chỉnh nếu thời lượng chương trình
    # lớn hơn.
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
        
        # Tìm semester_id của lớp học này dựa vào program_id
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
                day_offset = days_of_week_index_map.get(day_of_week_eng, 0)
                # Tính ngày cụ thể của buổi học trong học kỳ
                lesson_date = semester_start_date + timedelta(weeks=week_num, days=day_offset)

                new_lesson['week'] = week_num + 1
                new_lesson['date'] = lesson_date.strftime('%Y-%m-%d')
                new_lesson['semester_id'] = semester_id_for_class
                full_semester_lessons_for_class.append(new_lesson)
        
        # Xáo trộn các buổi học của một lớp để phân bổ ngẫu nhiên, giúp tránh xung đột ban đầu
        random.shuffle(full_semester_lessons_for_class)
        all_semester_lessons_to_distribute.extend(full_semester_lessons_for_class)
    
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
        day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
        
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
            
    # Trả về cả lịch trình đã hoàn thiện và danh sách các buổi học không thể gán
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
            output_lines.append(f"\n   --- Week {week_idx + 1} ---")
            lessons_by_date = defaultdict(list)
            for lesson in week_lessons:
                lessons_by_date[lesson['date']].append(lesson)
            sorted_dates = sorted(lessons_by_date.keys())
            for lesson_date in sorted_dates:
                output_lines.append(f"     Date: {lesson_date}")
                sorted_daily_lessons = sorted(lessons_by_date[lesson_date], key=lambda g: processed_data.slot_order_map[g['slot_id']])

                for lesson in sorted_daily_lessons:
                    subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                    # Kiểm tra và xử lý tên giảng viên
                    lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                    output_lines.append(
                        f"       - Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {subject_name} ({lesson['lesson_type']}), "

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
    
    for chrom in population:
        fitness_calculator.calculate_fitness(chrom)

    best_overall_chromosome = None
    ga_log_data = []

    for generation in range(MAX_GENERATIONS):
        population.sort(key=lambda c: c.fitness, reverse=True)
        
        if best_overall_chromosome is None or population[0].fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = population[0]
          
        display_ga_progress(
            generation=generation,
            max_generations=MAX_GENERATIONS,
            current_best_fitness=population[0].fitness,
            overall_best_fitness=best_overall_chromosome.fitness,
            log_interval=1 # Ví dụ: in chi tiết mỗi 50 thế hệ
        )  
        
        ga_log_data.append({
            "generation": generation + 1,
            "best_fitness_gen": population[0].fitness,
            "best_overall_fitness": best_overall_chromosome.fitness
        })

        # if population[0].fitness >= 0:
        #     break

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
            
            fitness_calculator.calculate_fitness(child1)
            fitness_calculator.calculate_fitness(child2)

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

def export_combined_results(all_semester_results, processed_data, output_folder):
    
    # Tạo các file tổng hợp
    log_file_path = os.path.join(output_folder, "all_semesters_ga_summary.txt")
    semester_schedule_txt_path = os.path.join(output_folder, "full_semester_schedule.txt")
    
    # 1. Ghi tóm tắt quá trình GA vào file log
    # with open(log_file_path, "w", encoding="utf-8") as f:
    #     f.write("--- TÓM TẮT KẾT QUẢ THUẬT TOÁN DI TRUYỀN CHO CÁC HỌC KỲ ---\n\n")
    #     for semester_id, result in all_semester_results.items():
    #         best_chrom = result["chromosome"]
    #         f.write(f"Học kỳ: {semester_id}\n")
    #         program_id = None
    #         for p_id, s_ids in processed_data.program_semester_map.items():
    #             if semester_id in s_ids:
    #                 program_id = p_id
    #                 break

    #         f.write(f"  Chương trình: {program_id}\n")
    #         f.write(f"  Độ thích nghi (Fitness) tốt nhất: {best_chrom.fitness:.2f}\n")
    #         f.write(f"  Số lượng tiết học được xếp: {len(best_chrom.genes)}\n")
    #         f.write("  ---------------------------------------\n")
    #     f.write("\n\n")
        
    #     # Thêm thông tin lịch sử GA từ mỗi học kỳ vào file
    #     for semester_id, result in all_semester_results.items():
    #         f.write(f"Lịch sử GA cho Học kỳ {semester_id}:\n")
    #         f.write("Thế hệ, Độ_thích_nghi_Tốt_nhất_Gen, Độ_thích_nghi_Tốt_nhất_Tổng_thể\n")
    #         for log_entry in result['log']:
    #             f.write(f"{log_entry['generation']},{log_entry['best_fitness_gen']:.2f},{log_entry['best_overall_fitness']:.2f}\n")
    #         f.write("\n")

    # print(f"Tóm tắt GA cho tất cả học kỳ đã được lưu vào: {log_file_path}")

    # 2. Ghi lịch học kỳ đầy đủ vào file văn bản
    with open(semester_schedule_txt_path, "w", encoding="utf-8") as f:
        f.write("--- LỊCH HỌC KỲ TỔNG HỢP --- \n")
        
        # Lặp qua từng học kỳ và xuất lịch
        for semester_id, result in all_semester_results.items():
            best_chrom = result["chromosome"]
            semester_specific_data = get_data_for_semester(semester_id, processed_data)
            
            # Tạo lịch học kỳ từ lịch tuần đã tối ưu
            semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, processed_data)
            if unassignable_lessons:
                print("\n⚠️ Cảnh báo: Một số buổi học không thể sắp xếp lại. Vui lòng kiểm tra thủ công:")
                for lesson in unassignable_lessons:
                    print(f"  - Lớp: {lesson['class_id']}, Môn: {lesson['subject_id']}, Ngày bị xung đột: {lesson['date']}")
            else:
                print("\n✅ Tất cả các buổi học đều đã được sắp xếp thành công!")
                
            formatted_schedule = format_semester_schedule(semester_timetable, semester_specific_data)
            
            f.write(f"\n===== LỊCH HỌC KỲ CHO: {semester_id} =====\n")
            f.write(formatted_schedule)
            f.write("\n" + "="*80 + "\n")
            
    print(f"Lịch học kỳ tổng hợp đã được lưu vào: {semester_schedule_txt_path}")
    
    # 3. Xuất file Excel cho từng học kỳ
    print("\n--- Bắt đầu xuất lịch ra file Excel ---")
    for semester_id, result in all_semester_results.items():
        best_chrom = result["chromosome"]
        semester_specific_data = get_data_for_semester(semester_id, processed_data)
        semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, semester_specific_data)
        
        # Tạo thư mục con cho mỗi học kỳ
        semester_output_folder = os.path.join(output_folder, semester_id)
        if not os.path.exists(semester_output_folder):
            os.makedirs(semester_output_folder)
            
        print()
        print(f"  Xuất Excel cho Học kỳ: {semester_id}...")
        
        export_semester_schedule_to_excel(semester_timetable, semester_specific_data, output_folder=semester_output_folder)
        
        lecturer_semester_view = generate_lecturer_semester_view(semester_timetable, semester_specific_data)
        room_semester_view = generate_room_semester_view(semester_timetable, semester_specific_data)
        
        export_lecturer_view_to_excel(lecturer_semester_view, semester_specific_data, output_folder=semester_output_folder)
        export_room_view_to_excel(room_semester_view, semester_specific_data, output_folder=semester_output_folder)
        print(f"  Đã hoàn tất xuất file Excel cho {semester_id} trong thư mục '{semester_output_folder}'")
        
    print("\n--- Đã hoàn thành xuất tất cả các file Excel. ---")

def genetic_algorithm():
    print("Loading data...")
    raw_data = load_data("input_data.json")
    if not raw_data:
        return

    print("Processing data...")
    processed_data = DataProcessor(raw_data)
    
    print(f"Số lượng tiết học hàng tuần cần xếp lịch: {len(processed_data.required_lessons_weekly)}")
    print(f"Danh sách các tiết học đầu tiên: {processed_data.required_lessons_weekly[:5]}")
    
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
            print(f"Lịch học tối ưu nhất cho {semester_id} đã được tạo thành công.")
        else:
            print(f"Không thể tạo lịch cho {semester_id}.")

    if all_semester_results:
        print("\n--- Tổng hợp và xuất kết quả ---")
        
        # 1. Xuất file JSON tổng hợp
        json_data = create_json_from_ga_results(all_semester_results, processed_data)
        export_to_json_file(json_data, "all_schedules.json", output_folder)

        # 2. Xuất file Excel (nếu cần, bạn vẫn có thể giữ lại hàm này)
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    sys.stdout.flush()
    
if __name__ == "__main__":
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()