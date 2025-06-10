# timetable_ga/main.py
import time
import random
from collections import defaultdict
from config import (
    POPULATION_SIZE, MAX_GENERATIONS, MUTATION_RATE, CROSSOVER_RATE, ELITISM_COUNT
)
from data_processing.loader import load_data
from data_processing.processor import DataProcessor
from ga_components.population import initialize_population
from ga_components.fitness import FitnessCalculator
from ga_components.selection import tournament_selection # or roulette_wheel_selection
from ga_components.crossover import single_point_crossover # or uniform_crossover
from ga_components.mutation import mutate_chromosome
from utils.helpers import format_timetable # (Tùy chọn)
from utils.exporter import export_semester_schedule_to_excel, export_lecturer_view_to_excel, export_room_view_to_excel

def generate_semester_schedule(best_weekly_chromosome, processed_data):
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(15)])
    slots_scheduled_count_semester = defaultdict(int)

    for cls_id, cls_info in processed_data.class_map.items():
        program_duration_weeks = cls_info.get('program_duration_weeks', 15)
        semester_schedule_by_class[cls_id] = [[] for _ in range(program_duration_weeks)]

        for week_num in range(program_duration_weeks):
            weekly_lessons_for_class = []
            for gene in best_weekly_chromosome.genes:
                if gene['class_id'] == cls_id:
                    class_id = gene['class_id']
                    subject_id = gene['subject_id']
                    lesson_type = gene['lesson_type']

                    total_needed = processed_data.total_semester_slots_needed.get((class_id, subject_id, lesson_type), 0)

                    if slots_scheduled_count_semester[(class_id, subject_id, lesson_type)] < total_needed:
                        lesson_for_semester = gene.copy()
                        lesson_for_semester['week'] = week_num + 1

                        weekly_lessons_for_class.append(lesson_for_semester)
                        slots_scheduled_count_semester[(class_id, subject_id, lesson_type)] += 1

            semester_schedule_by_class[cls_id][week_num] = weekly_lessons_for_class

    return semester_schedule_by_class

def format_semester_schedule(semester_schedule, processed_data):
    output_lines = []
    for class_id, weekly_schedules in semester_schedule.items():
        output_lines.append(f"\n===== SEMESTER SCHEDULE FOR CLASS: {class_id} =====")
        cls_info = processed_data.class_map.get(class_id)
        program_duration = cls_info.get('program_duration_weeks', len(weekly_schedules)) if cls_info else len(weekly_schedules)

        for week_idx in range(program_duration):
            week_lessons = weekly_schedules[week_idx]
            if not week_lessons:
                has_any_lesson_for_class_this_week = any(
                    len(lst) > 0 for w_idx, lst in enumerate(weekly_schedules) if w_idx >= week_idx
                )
                if not has_any_lesson_for_class_this_week and week_idx > 0:
                    break
                output_lines.append(f"\n  --- Week {week_idx + 1} ---")

            if week_lessons:
                output_lines.append(f"\n  --- Week {week_idx + 1} ---")
                sorted_week_lessons = sorted(week_lessons, key=lambda g: (
                    processed_data.data['days_of_week'].index(g['day']),
                    processed_data.slot_order_map[g['slot_id']]
                ))
                for lesson in sorted_week_lessons:
                    output_lines.append(
                        f"    Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {lesson['subject_id']} ({lesson['lesson_type']}), "
                        f"Room: {lesson['room_id']}, Lecturer: {lesson['lecturer_id']}"
                    )
    return "\n".join(output_lines)


def generate_lecturer_semester_view(semester_schedule_by_class, processed_data): # Thêm processed_data
    """
    Tạo ra một cấu trúc dữ liệu lịch dạy cho từng giảng viên trong cả học kỳ.
    Output: {lecturer_id: {week_num: [lesson_details_for_lecturer]}}
    Trong đó lesson_details_for_lecturer là một dict chứa thông tin tiết dạy.
    Cần processed_data để sắp xếp chính xác.
    """
    lecturer_view = defaultdict(lambda: defaultdict(list))
    # semester_schedule_by_class: {class_id: list_of_weeks[list_of_lessons_in_week]}
    # lesson: dict_keys(['lesson_id', 'class_id', 'subject_id', 'lesson_type', 
    # 'program_id', 'group_id', 'day', 'slot_id', 'room_id', 'lecturer_id', 'week'])

    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            for lesson in lessons_in_week:
                lecturer_id = lesson['lecturer_id']
                # week_num đã có trong lesson['week'] (là 1-indexed)
                week_num = lesson['week'] 
                
                lesson_info_for_lecturer = {
                    'day': lesson['day'],
                    'slot_id': lesson['slot_id'],
                    'class_id': lesson['class_id'],
                    'subject_id': lesson['subject_id'],
                    'lesson_type': lesson['lesson_type'],
                    'room_id': lesson['room_id'],
                }
                lecturer_view[lecturer_id][week_num].append(lesson_info_for_lecturer)
    
    # Sắp xếp các tiết học trong mỗi tuần của mỗi giảng viên
    for lecturer_id in lecturer_view:
        for week_num in lecturer_view[lecturer_id]:
            if processed_data.data.get('days_of_week') and processed_data.data.get('slot_order_map'):
                # Correctly access keys in the dictionary
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else: # Fallback nếu processed_data không đủ thông tin
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
            
    return lecturer_view

def generate_room_semester_view(semester_schedule_by_class, processed_data): # Thêm processed_data
    """
    Tạo ra một cấu trúc dữ liệu lịch sử dụng cho từng phòng học trong cả học kỳ.
    Output: {room_id: {week_num: [lesson_details_for_room]}}
    Cần processed_data để sắp xếp chính xác.
    """
    room_view = defaultdict(lambda: defaultdict(list))

    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            for lesson in lessons_in_week:
                room_id = lesson['room_id']
                week_num = lesson['week']
                
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
            if processed_data.data.get('days_of_week') and processed_data.data.get('slot_order_map'):
                room_view[room_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else: # Fallback
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

    for lecturer_id in sorted_lecturer_ids:
        output_lines.append(f"\n\n===== LỊCH DẠY GIẢNG VIÊN: {lecturer_id} =====")
        
        lecturer_schedule = lecturer_view[lecturer_id]
        # Sắp xếp các tuần theo số thứ tự
        sorted_weeks = sorted(lecturer_schedule.keys())

        if not sorted_weeks:
            output_lines.append("  (Không có lịch dạy)")
            continue

        for week_num in sorted_weeks:
            lessons_in_week = lecturer_schedule[week_num]
            if not lessons_in_week:
                continue 

            output_lines.append(f"\n  --- Tuần {week_num} ---")
            for lesson in lessons_in_week:
                # day_vie = days_of_week_map_local.get(lesson['day'], lesson['day'])
                subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                # Thay đổi ở đây: thêm từ khóa rõ ràng
                output_lines.append(
                    f"    Day: {lesson['day']}, Slot: {lesson['slot_id']}, Class: {lesson['class_id']}, "
                    f"Subject: {lesson['subject_id']} ({lesson['lesson_type']}), Room: {lesson['room_id']}"
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

    for room_id in sorted_room_ids:
        output_lines.append(f"\n\n===== LỊCH SỬ DỤNG PHÒNG: {room_id} =====")
        
        room_schedule = room_view[room_id]
        # Sắp xếp các tuần theo số thứ tự
        sorted_weeks = sorted(room_schedule.keys())
        
        if not sorted_weeks:
            output_lines.append("  (Không có lịch sử dụng)")
            continue
            
        for week_num in sorted_weeks:
            lessons_in_week = room_schedule[week_num]
            if not lessons_in_week:
                continue

            output_lines.append(f"\n  --- Tuần {week_num} ---")
            for lesson in lessons_in_week:
                day_vie = days_of_week_map_local.get(lesson['day'], lesson['day'])
                subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                # Thay đổi ở đây: thêm từ khóa rõ ràng
                output_lines.append(
                    f"    Day: {day_vie} ({lesson['day']}), Slot: {lesson['slot_id']}, Lớp: {lesson['class_id']}, "
                    f"Môn: {subject_name} ({lesson['lesson_type']}), GV: {lesson['lecturer_id']}"
                )
    return "\n".join(output_lines)


def genetic_algorithm():
    print("Loading data...")
    raw_data = load_data("input_data.json")
    if not raw_data:
        return

    print("Processing data...")
    processed_data = DataProcessor(raw_data)
    if not processed_data.required_lessons_weekly:
        print("No lessons to schedule. Exiting.")
        return

    fitness_calculator = FitnessCalculator(processed_data)

    print(f"Initializing population of size {POPULATION_SIZE}...")
    population = initialize_population(POPULATION_SIZE, processed_data)

    # Đánh giá quần thể ban đầu
    for chrom in population:
        fitness_calculator.calculate_fitness(chrom)
    
    print(f"Starting GA for {MAX_GENERATIONS} generations...")
    start_time = time.time()

    best_overall_chromosome = None

    for generation in range(MAX_GENERATIONS):
        # Sắp xếp quần thể theo fitness (cao hơn là tốt hơn)
        population.sort(key=lambda c: c.fitness, reverse=True)

        if best_overall_chromosome is None or population[0].fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = population[0]
        
        print(f"Generation {generation + 1}/{MAX_GENERATIONS} - "
              f"Best Fitness: {population[0].fitness:.2f} "
              f"(Best Overall: {best_overall_chromosome.fitness:.2f})")

        if population[0].fitness == 0: # Đã tìm thấy giải pháp hoàn hảo (không vi phạm ràng buộc cứng)
            print("Perfect solution found (zero penalty)!")
            break

        new_population = []

        # Elitism: Giữ lại những cá thể tốt nhất
        new_population.extend(population[:ELITISM_COUNT])

        # Tạo thế hệ mới
        while len(new_population) < POPULATION_SIZE:
            # Chọn lọc
            parent1 = tournament_selection(population)
            parent2 = tournament_selection(population)

            # Lai ghép
            if random.random() < CROSSOVER_RATE:
                child1, child2 = single_point_crossover(parent1, parent2)
            else:
                child1, child2 = parent1, parent2 # Không lai ghép, giữ lại bố mẹ

            # Đột biến
            mutate_chromosome(child1, processed_data, MUTATION_RATE)
            mutate_chromosome(child2, processed_data, MUTATION_RATE)
            
            # Đánh giá cá thể mới
            fitness_calculator.calculate_fitness(child1)
            fitness_calculator.calculate_fitness(child2)

            new_population.append(child1)
            if len(new_population) < POPULATION_SIZE:
                new_population.append(child2)
        
        population = new_population

    end_time = time.time()
    print(f"\nGA finished in {end_time - start_time:.2f} seconds.")

    # Lấy cá thể tốt nhất cuối cùng
    population.sort(key=lambda c: c.fitness, reverse=True)
    final_best_chromosome = population[0]
    if best_overall_chromosome and best_overall_chromosome.fitness > final_best_chromosome.fitness:
        final_best_chromosome = best_overall_chromosome


    print("\nBest timetable found:")
    print(f"Fitness: {final_best_chromosome.fitness:.2f}")
    
    # In chi tiết thời khóa biểu (tùy chọn, có thể rất dài)
    # print(format_timetable(final_best_chromosome, processed_data))
    
    # Lưu vào file (ví dụ)
    with open("results/best_timetable.txt", "w", encoding="utf-8") as f:
        f.write(f"Best Fitness: {final_best_chromosome.fitness:.2f}\n\n")
        f.write(format_timetable(final_best_chromosome, processed_data))
    print("\nBest timetable saved to results/best_timetable.txt")
    
    # In ra các vi phạm của giải pháp tốt nhất (để debug)
    print("\n--- Constraint Check for Best Solution ---")
    # Tạm thời gọi lại fitness để có thể in ra các vi phạm nếu cần
    # (Trong thực tế, hàm fitness nên trả về chi tiết vi phạm)
    # fitness_calculator.calculate_fitness(final_best_chromosome) # Đã được tính
    # Bạn có thể thêm logic vào `FitnessCalculator` để lưu trữ chi tiết vi phạm
    # và truy xuất chúng ở đây. Ví dụ:
    # violations = fitness_calculator.get_last_violations()
    # for v_type, v_count, v_penalty in violations:
    #    print(f"Violation: {v_type}, Count: {v_count}, Penalty: {v_penalty}")

    print("\nGenerating semester schedule...")
    semester_timetable = generate_semester_schedule(final_best_chromosome, processed_data)

    formatted_semester_schedule = format_semester_schedule(semester_timetable, processed_data)
    print(formatted_semester_schedule)

    with open("results/semester_schedule.txt", "w", encoding="utf-8") as f:
        f.write(f"Best Weekly Timetable Fitness: {final_best_chromosome.fitness:.2f}\n")
        f.write("=========================================\n")
        f.write("OPTIMIZED WEEKLY SCHEDULE (TEMPLATE):\n")
        f.write("=========================================\n")
        f.write(format_timetable(final_best_chromosome, processed_data))
        f.write("\n\n=========================================\n")
        f.write("FULL SEMESTER SCHEDULE BY CLASS:\n")
        f.write("=========================================\n")
        f.write(formatted_semester_schedule)
    print("\nFull semester schedule saved to results/semester_schedule.txt")

    print("\nExporting semester schedule to Excel files...")
    export_semester_schedule_to_excel(semester_timetable, processed_data, output_folder="results")
    print("Finished exporting to Excel.")

    print("\nGenerating lecturer and room semester views...")
    lecturer_semester_view = generate_lecturer_semester_view(semester_timetable, processed_data)
    room_semester_view = generate_room_semester_view(semester_timetable, processed_data)
    

    formatted_lecturer_schedule = format_text_lecturer_schedule(lecturer_semester_view, processed_data)
    formatted_room_schedule = format_text_room_schedule(room_semester_view, processed_data)

    export_lecturer_view_to_excel(lecturer_semester_view, processed_data, output_folder="results")
    export_room_view_to_excel(room_semester_view, processed_data, output_folder="results")
    
    # Save to file
    with open("results/semester_schedule_views.txt", "w", encoding="utf-8") as f:
        f.write("LỊCH DẠY GIẢNG VIÊN:\n")
        f.write(formatted_lecturer_schedule)
        f.write("\n\nLỊCH SỬ DỤNG PHÒNG:\n")
        f.write(formatted_room_schedule)
    print("\nLecturer and Room schedules saved to results/semester_schedule_views.txt")


if __name__ == "__main__":
    # Tạo thư mục results nếu chưa có
    import os
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()