# timetable_ga/ga_components/population.py
from .chromosome import create_random_chromosome

def initialize_population(size, processed_data):
    """Initializes a population of random chromosomes."""
    return [create_random_chromosome(processed_data) for _ in range(size)]