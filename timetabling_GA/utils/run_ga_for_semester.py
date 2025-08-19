import random
from typing import Dict, Any, List, Optional, Tuple

# Import các cấu hình và thành phần của GA
from config import (
    POPULATION_SIZE, MAX_GENERATIONS, MUTATION_RATE, CROSSOVER_RATE, ELITISM_COUNT
)
from ga_components.chromosome import Chromosome
from ga_components.population import initialize_population
from ga_components.fitness import FitnessCalculator
from ga_components.selection import tournament_selection
from ga_components.crossover import lesson_based_crossover
from ga_components.mutation import mutate_chromosome
from utils.display_ga_progress import display_ga_progress

# Giả định DataProcessor là một class đã tồn tại
from data_processing.processor import DataProcessor


def run_ga_for_semester(semester_id: str, full_data_processor: DataProcessor) -> Tuple[Optional[Chromosome], Optional[List[Dict[str, Any]]]]:
    """
    Chạy thuật toán Di truyền (Genetic Algorithm) để tìm kiếm lịch trình tuần tối ưu
    cho một học kỳ cụ thể.

    Args:
        semester_id (str): ID của học kỳ cần tạo lịch trình.
        full_data_processor (DataProcessor): Đối tượng xử lý dữ liệu chứa toàn bộ thông tin
                                             đầu vào.

    Returns:
        Tuple[Optional[Chromosome], Optional[List[Dict[str, Any]]]]:
        - best_overall_chromosome: Nhiễm sắc thể có fitness tốt nhất trong suốt quá trình
                                     tiến hóa, hoặc None nếu không tìm thấy.
        - ga_log_data: Dữ liệu log của quá trình GA qua các thế hệ.
    """
    # Lọc dữ liệu chỉ liên quan đến học kỳ hiện tại
    semester_specific_data_processor = full_data_processor.filter_for_semester(semester_id)
    
    # Kiểm tra tính hợp lệ của dữ liệu sau khi lọc
    if not semester_specific_data_processor:
        print(f"Lỗi: Không tìm thấy thông tin cho học kỳ {semester_id}.")
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
        
    # Khởi tạo các đối tượng và dữ liệu cần thiết cho GA
    fitness_calculator = FitnessCalculator(semester_specific_data_processor)
    population = initialize_population(POPULATION_SIZE, semester_specific_data_processor)
    
    # Tính toán fitness ban đầu cho toàn bộ quần thể
    for chrom in population:
        chrom.fitness, _ = fitness_calculator.calculate_fitness(chrom)

    best_overall_chromosome = None
    best_overall_violations = {}
    ga_log_data = []

    # Bắt đầu vòng lặp tiến hóa
    for generation in range(MAX_GENERATIONS):
        # Sắp xếp quần thể để xác định nhiễm sắc thể tốt nhất
        population.sort(key=lambda c: c.fitness, reverse=True)
        current_best_chromosome = population[0]

        # Cập nhật nhiễm sắc thể tốt nhất toàn cục nếu tìm thấy
        if best_overall_chromosome is None or current_best_chromosome.fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = current_best_chromosome
            # Lấy chi tiết vi phạm của nhiễm sắc thể tốt nhất
            _, best_overall_violations = fitness_calculator.calculate_fitness(best_overall_chromosome)
        
        # Lấy chi tiết vi phạm của thế hệ hiện tại để hiển thị tiến trình
        _, current_violations = fitness_calculator.calculate_fitness(current_best_chromosome)

        # Hiển thị tiến trình của thuật toán
        display_ga_progress(
            generation=generation,
            max_generations=MAX_GENERATIONS,
            current_best_fitness=current_best_chromosome.fitness,
            overall_best_fitness=best_overall_chromosome.fitness,
            current_best_violations=current_violations,
            overall_best_violations=best_overall_violations,
            log_interval=1
        )
        
        # Ghi lại dữ liệu log của thế hệ hiện tại
        ga_log_data.append({
            "generation": generation + 1,
            "best_fitness_gen": current_best_chromosome.fitness,
            "best_overall_fitness": best_overall_chromosome.fitness,
            "current_violations": current_violations
        })

        # Dừng nếu tìm thấy giải pháp hoàn hảo (fitness >= 0)
        # if current_best_chromosome.fitness >= 0:
        #     break

        # Tạo quần thể mới cho thế hệ tiếp theo
        new_population = []
        
        # Áp dụng cơ chế elitism: giữ lại các cá thể tốt nhất
        new_population.extend(population[:ELITISM_COUNT])
        
        # Tạo cá thể mới thông qua lai ghép và đột biến
        while len(new_population) < POPULATION_SIZE:
            # Chọn hai cá thể cha mẹ
            parent1 = tournament_selection(population)
            parent2 = tournament_selection(population)

            # Lai ghép (Crossover)
            if random.random() < CROSSOVER_RATE:
                child1, child2 = lesson_based_crossover(parent1, parent2, semester_specific_data_processor)
            else:
                child1, child2 = parent1, parent2

            # Đột biến (Mutation)
            mutate_chromosome(child1, semester_specific_data_processor, MUTATION_RATE)
            mutate_chromosome(child2, semester_specific_data_processor, MUTATION_RATE)
            
            # Tính toán và gán fitness mới cho các cá thể con
            child1.fitness, _ = fitness_calculator.calculate_fitness(child1)
            child2.fitness, _ = fitness_calculator.calculate_fitness(child2)

            # Thêm cá thể con vào quần thể mới
            new_population.append(child1)
            if len(new_population) < POPULATION_SIZE:
                new_population.append(child2)
        
        # Cập nhật quần thể
        population = new_population

    return best_overall_chromosome, ga_log_data