# timetable_ga/ga_components/selection.py
import random

def tournament_selection(population, k=3):
    """
    Selects a parent using tournament selection.
    k: tournament size.
    """
    tournament = random.sample(population, k)
    return max(tournament, key=lambda chromosome: chromosome.fitness)

def roulette_wheel_selection(population):
    """
    Selects a parent using roulette wheel selection.
    Assumes fitness values are non-negative.
    """
    # Xử lý trường hợp tất cả các cá thể đều có fitness rất thấp (hoặc bằng nhau)
    if not population:
        return None
    
    # Dịch chuyển fitness để đảm bảo tất cả đều là số dương
    min_fitness_val = min(c.fitness for c in population)
    
    # Sử dụng list comprehension để tạo danh sách fitness đã dịch chuyển
    shifted_fitnesses = [(c.fitness - min_fitness_val) + 1e-6 for c in population]
    
    total_shifted_fitness = sum(shifted_fitnesses)

    if total_shifted_fitness <= 1e-6:
        # Trường hợp tất cả fitness đều như nhau, chọn ngẫu nhiên
        return random.choice(population)

    pick = random.uniform(0, total_shifted_fitness)
    current = 0
    for i, shifted_f in enumerate(shifted_fitnesses):
        current += shifted_f
        if current > pick:
            return population[i]
            
    # Xử lý trường hợp không chọn được (lỗi số học nhỏ), chọn ngẫu nhiên để tránh lỗi
    return random.choice(population)