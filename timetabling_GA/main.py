# timetable_ga/main.py
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
from utils.helpers import format_timetable
from utils.exporter import export_semester_schedule_to_excel, export_lecturer_view_to_excel, export_room_view_to_excel


def generate_semester_schedule(best_weekly_chromosome, processed_data):
    """
    Generates a full semester schedule by distributing the lessons from the 
    best weekly chromosome across the semester, respecting weekly quotas.
    
    This function has been revised to correctly populate all lesson details
    (including lecturer and room) before distributing them.
    """
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    
    # Map lessons from the best weekly timetable to a dictionary for easy access
    weekly_lessons_map = defaultdict(list)
    for gene in best_weekly_chromosome.genes:
        weekly_lessons_map[gene['class_id']].append(gene)

    all_semester_lessons_to_distribute = []
    
    for cls_id in processed_data.class_map:
        program_id = processed_data.class_map[cls_id]['program_id']
        semester_ids = processed_data.program_semester_map.get(program_id, [])
        
        if not semester_ids:
            continue
            
        semester_id = semester_ids[0]
        duration_weeks = processed_data.semester_map.get(semester_id, {}).get('duration_weeks', 15)
        
        lessons_for_this_class_weekly = weekly_lessons_map.get(cls_id, [])
        num_weekly_lessons = len(lessons_for_this_class_weekly)

        # Create a full list of lessons for the entire semester for this class
        full_semester_lessons_for_class = []
        for week_num in range(duration_weeks):
            for lesson_template in lessons_for_this_class_weekly:
                new_lesson = lesson_template.copy()
                new_lesson['week'] = week_num + 1
                full_semester_lessons_for_class.append(new_lesson)
        
        # Shuffle lessons for this class to randomize their distribution
        random.shuffle(full_semester_lessons_for_class)
        all_semester_lessons_to_distribute.extend(full_semester_lessons_for_class)
    
    # Distribute all lessons across the semester schedule by class
    for lesson in all_semester_lessons_to_distribute:
        cls_id = lesson['class_id']
        week_num = lesson['week'] - 1
        
        # Ensure week_num is within the valid range
        if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
            semester_schedule_by_class[cls_id][week_num].append(lesson)

    return semester_schedule_by_class

def format_semester_schedule(semester_schedule, processed_data):
    """
    Formats the full semester schedule for display.
    
    Args:
        semester_schedule (dict): A dictionary where keys are class_ids and
                                  values are a list of weekly schedules.
        processed_data (DataProcessor): The processed data object.
    
    Returns:
        str: A formatted string of the full semester schedule.
    """
    output_lines = []
    
    # Sort semester_schedule by class_id to ensure consistent output order
    sorted_class_ids = sorted(semester_schedule.keys())
    
    for class_id in sorted_class_ids:
        weekly_schedules = semester_schedule[class_id]
        
        cls_info = processed_data.class_map.get(class_id)
        program_id = cls_info.get('program_id') if cls_info else None
        
        output_lines.append(f"\n===== SEMESTER SCHEDULE FOR CLASS: {class_id} ({processed_data.program_map.get(program_id, {}).get('program_name', program_id) if program_id else ''}) =====")
        
        if not weekly_schedules:
            output_lines.append("  (No schedule data found for this class.)")
            continue
            
        for week_idx, week_lessons in enumerate(weekly_schedules):
            # Check if there are any lessons in the current week
            if not week_lessons:
                continue

            output_lines.append(f"\n  --- Week {week_idx + 1} ---")
            
            # Sort weekly lessons for better display order
            sorted_week_lessons = sorted(week_lessons, key=lambda g: (
                processed_data.data['days_of_week'].index(g['day']),
                processed_data.slot_order_map[g['slot_id']]
            ))
            
            for lesson in sorted_week_lessons:
                subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                
                output_lines.append(
                    f"    Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {subject_name} ({lesson['lesson_type']}), "
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
            
        ga_log_data.append({
            "generation": generation + 1,
            "best_fitness_gen": population[0].fitness,
            "best_overall_fitness": best_overall_chromosome.fitness
        })

        if population[0].fitness >= 0:
            break

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
def get_data_for_semester(semester_id, full_data):
    """
    Tạo một bản sao của đối tượng DataProcessor, chỉ chứa dữ liệu liên quan
    đến một học kỳ cụ thể.
    """
    # Lấy thông tin về các môn học của học kỳ đó từ semester_map
    related_subject_ids = full_data.semester_map.get(semester_id, {}).get("subject_ids", [])
    if not related_subject_ids:
        # Xử lý trường hợp không tìm thấy học kỳ hoặc môn học
        print(f"Không tìm thấy thông tin môn học cho học kỳ {semester_id}.")
        return None
        
    # Lấy thông tin về các chương trình và lớp học của học kỳ đó
    related_program_ids = [
        prog['program_id'] 
        for prog in full_data.data['programs']
        if semester_id in [s['semester_id'] for s in prog['semesters']]
    ]
    
    # Tạo một bản sao sâu của dữ liệu gốc để chỉnh sửa
    semester_data_dict = copy.deepcopy(full_data.data)

    # Lọc các danh sách trong bản sao dữ liệu
    semester_data_dict['semesters'] = [
        s for s in semester_data_dict['semesters'] if s['semester_id'] == semester_id
    ]
    
    semester_data_dict['classes'] = [
        c for c in semester_data_dict['classes'] if c['program_id'] in related_program_ids
    ]
    
    semester_data_dict['subjects'] = [
        s for s in semester_data_dict['subjects'] if s['subject_id'] in related_subject_ids
    ]
    
    related_lecturer_ids = [
        l['lecturer_id'] for l in semester_data_dict['lecturers']
        if any(sub_id in related_subject_ids for sub_id in l['subjects'])
    ]
    semester_data_dict['lecturers'] = [
        l for l in semester_data_dict['lecturers'] if l['lecturer_id'] in related_lecturer_ids
    ]

    # Tạo một đối tượng DataProcessor mới với dữ liệu đã lọc
    # Note: Hàm này giả định rằng DataProcessor có thể nhận dữ liệu đã lọc.
    # Bạn sẽ cần đảm bảo rằng hàm này cũng có thể tái tạo các map.
    # Tuy nhiên, phiên bản DataProcessor của bạn đã làm điều này trong __init__.
    return DataProcessor(semester_data_dict)

def export_combined_results(all_semester_results, processed_data, output_folder):
    
    # Tạo các file tổng hợp
    log_file_path = os.path.join(output_folder, "all_semesters_ga_summary.txt")
    semester_schedule_txt_path = os.path.join(output_folder, "full_semester_schedule.txt")
    
    # 1. Ghi tóm tắt quá trình GA vào file log
    with open(log_file_path, "w", encoding="utf-8") as f:
        f.write("--- TÓM TẮT KẾT QUẢ THUẬT TOÁN DI TRUYỀN CHO CÁC HỌC KỲ ---\n\n")
        for semester_id, result in all_semester_results.items():
            best_chrom = result["chromosome"]
            f.write(f"Học kỳ: {semester_id}\n")
            program_id = None
            for p_id, s_ids in processed_data.program_semester_map.items():
                if semester_id in s_ids:
                    program_id = p_id
                    break

            f.write(f"  Chương trình: {program_id}\n")
            f.write(f"  Độ thích nghi (Fitness) tốt nhất: {best_chrom.fitness:.2f}\n")
            f.write(f"  Số lượng tiết học được xếp: {len(best_chrom.genes)}\n")
            f.write("  ---------------------------------------\n")
        f.write("\n\n")
        
        # Thêm thông tin lịch sử GA từ mỗi học kỳ vào file
        for semester_id, result in all_semester_results.items():
            f.write(f"Lịch sử GA cho Học kỳ {semester_id}:\n")
            f.write("Thế hệ, Độ_thích_nghi_Tốt_nhất_Gen, Độ_thích_nghi_Tốt_nhất_Tổng_thể\n")
            for log_entry in result['log']:
                f.write(f"{log_entry['generation']},{log_entry['best_fitness_gen']:.2f},{log_entry['best_overall_fitness']:.2f}\n")
            f.write("\n")

    print(f"Tóm tắt GA cho tất cả học kỳ đã được lưu vào: {log_file_path}")

    # 2. Ghi lịch học kỳ đầy đủ vào file văn bản
    with open(semester_schedule_txt_path, "w", encoding="utf-8") as f:
        f.write("--- LỊCH HỌC KỲ TỔNG HỢP --- \n")
        
        # Lặp qua từng học kỳ và xuất lịch
        for semester_id, result in all_semester_results.items():
            best_chrom = result["chromosome"]
            semester_specific_data = get_data_for_semester(semester_id, processed_data)
            
            # Tạo lịch học kỳ từ lịch tuần đã tối ưu
            semester_timetable = generate_semester_schedule(best_chrom, semester_specific_data)
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
        semester_timetable = generate_semester_schedule(best_chrom, semester_specific_data)
        
        # Tạo thư mục con cho mỗi học kỳ
        semester_output_folder = os.path.join(output_folder, semester_id)
        if not os.path.exists(semester_output_folder):
            os.makedirs(semester_output_folder)
            
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
    # DataProcessor giờ đây sẽ chỉ xử lý dữ liệu thô ban đầu
    processed_data = DataProcessor(raw_data)
    
    # Tạo thư mục kết quả nếu chưa tồn tại
    output_folder = "results"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    # Lặp qua từng học kỳ và chạy GA riêng biệt
    all_semester_results = {}
    for semester_id, semester_info in processed_data.semester_map.items():
        print(f"\n--- Bắt đầu tạo lịch cho Học kỳ: {semester_id} ---")
        
        # Gọi hàm con để chạy GA cho từng học kỳ
        best_chromosome, ga_log = run_ga_for_semester(semester_id, processed_data)
        
        if best_chromosome:
            all_semester_results[semester_id] = {
                "chromosome": best_chromosome,
                "log": ga_log
            }
            print(f"Lịch học cho {semester_id} đã được tạo thành công.")
        else:
            print(f"Không thể tạo lịch cho {semester_id}.")

    # Sau khi có kết quả của tất cả các học kỳ, gộp và xuất ra file
    if all_semester_results:
        print("\n--- Tổng hợp và xuất kết quả ---")
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    sys.stdout.flush()
    
if __name__ == "__main__":
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()