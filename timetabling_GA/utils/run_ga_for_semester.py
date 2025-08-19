# timetable_ga/main.py
import random
from config import (
    POPULATION_SIZE, MAX_GENERATIONS, MUTATION_RATE, CROSSOVER_RATE, ELITISM_COUNT
)
from ga_components.population import initialize_population
from ga_components.fitness import FitnessCalculator
from ga_components.selection import tournament_selection
from ga_components.crossover import lesson_based_crossover
from ga_components.mutation import mutate_chromosome
from utils.display_ga_progress import display_ga_progress

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
