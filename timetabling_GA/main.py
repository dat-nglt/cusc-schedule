# timetable_ga/main.py
import sys
import time
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

    for chrom in population:
        fitness_calculator.calculate_fitness(chrom)
    
    print(f"Starting GA for {MAX_GENERATIONS} generations...")
    sys.stdout.flush()
    
    start_time = time.time()
    best_overall_chromosome = None

    for generation in range(MAX_GENERATIONS):
        print(f"GA_PROGRESS_GENERATION:{generation + 1}/{MAX_GENERATIONS}")
        sys.stdout.flush()
        
        population.sort(key=lambda c: c.fitness, reverse=True)

        if best_overall_chromosome is None or population[0].fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = population[0]
        
        print(f"Generation {generation + 1}/{MAX_GENERATIONS} - "
              f"Best Fitness: {population[0].fitness:.2f} "
              f"(Best Overall: {best_overall_chromosome.fitness:.2f})")
        sys.stdout.flush()

        if population[0].fitness >= 0:
            print("Perfect or near-perfect solution found!")
            break

        new_population = []

        new_population.extend(population[:ELITISM_COUNT])

        while len(new_population) < POPULATION_SIZE:
            parent1 = tournament_selection(population)
            parent2 = tournament_selection(population)

            if random.random() < CROSSOVER_RATE:
                child1, child2 = lesson_based_crossover(parent1, parent2, processed_data)
            else:
                child1, child2 = parent1, parent2

            mutate_chromosome(child1, processed_data, MUTATION_RATE)
            mutate_chromosome(child2, processed_data, MUTATION_RATE)
            
            fitness_calculator.calculate_fitness(child1)
            fitness_calculator.calculate_fitness(child2)

            new_population.append(child1)
            if len(new_population) < POPULATION_SIZE:
                new_population.append(child2)
        
        population = new_population

    end_time = time.time()
    print(f"\nGA finished in {end_time - start_time:.2f} seconds.")

    population.sort(key=lambda c: c.fitness, reverse=True)
    final_best_chromosome = population[0]
    if best_overall_chromosome and best_overall_chromosome.fitness > final_best_chromosome.fitness:
        final_best_chromosome = best_overall_chromosome


    print("\nBest timetable found:")
    print(f"Fitness: {final_best_chromosome.fitness:.2f}")
    
    with open("results/best_timetable.txt", "w", encoding="utf-8") as f:
        f.write(f"Best Fitness: {final_best_chromosome.fitness:.2f}\n\n")
        f.write(format_timetable(final_best_chromosome, processed_data))
    print("\nBest timetable saved to results/best_timetable.txt")
    
    print("\n--- Constraint Check for Best Solution ---")
    fitness_calculator.calculate_fitness(final_best_chromosome)
    
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
    
    with open("results/semester_schedule_views.txt", "w", encoding="utf-8") as f:
        f.write("LỊCH DẠY GIẢNG VIÊN:\n")
        f.write(formatted_lecturer_schedule)
        f.write("\n\nLỊCH SỬ DỤNG PHÒNG:\n")
        f.write(formatted_room_schedule)
    print("\nLecturer and Room schedules saved to results/semester_schedule_views.txt")
    
    print("\nGA_PROGRESS_DONE")
    sys.stdout.flush()


if __name__ == "__main__":
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()