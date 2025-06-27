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
    Assumes fitness values are non-negative (or shifted to be so).
    Since our fitness is -penalty, higher (less negative) is better.
    We need to map these to probabilities.
    """
    max_fitness = sum(c.fitness for c in population) # This won't work directly for negative fitness
    
    # Shift fitness values to be positive for roulette wheel
    min_fitness_val = min(c.fitness for c in population)
    shifted_fitness = [(c.fitness - min_fitness_val) + 1e-6 for c in population] # Add small epsilon to avoid zero sum
    
    total_shifted_fitness = sum(shifted_fitness)

    if total_shifted_fitness == 0: # All have same min fitness (e.g. all -infinity)
        return random.choice(population)

    pick = random.uniform(0, total_shifted_fitness)
    current = 0
    for i, c_fitness in enumerate(shifted_fitness):
        current += c_fitness
        if current > pick:
            return population[i]
    return random.choice(population) # Fallback