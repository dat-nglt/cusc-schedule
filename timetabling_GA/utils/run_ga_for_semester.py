import random
from typing import Dict, Any, List, Optional, Tuple

# Import GA configurations and components
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

# Assuming DataProcessor is an existing class
from data_processing.processor import DataProcessor


def run_ga_for_semester(semester_id: str, full_data_processor: DataProcessor) -> Tuple[Optional[Chromosome], Optional[List[Dict[str, Any]]]]:
    """
    Runs the Genetic Algorithm to find the optimal weekly schedule
    for a specific semester.

    Args:
        semester_id (str): The ID of the semester for which to generate the schedule.
        full_data_processor (DataProcessor): The data processor object containing all
                                             input information.

    Returns:
        Tuple[Optional[Chromosome], Optional[List[Dict[str, Any]]]]:
        - best_overall_chromosome: The chromosome with the best fitness throughout the
                                   evolutionary process, or None if not found.
        - ga_log_data: The log data of the GA process across generations.
    """
    # Filter data to only include the current semester's information
    semester_specific_data_processor = full_data_processor.filter_for_semester(semester_id)
    
    # Check the validity of the filtered data
    if not semester_specific_data_processor:
        print(f"Error: No information found for semester {semester_id}.")
        return None, None
    
    if not semester_specific_data_processor.lecturer_map:
        print(f"Error: Semester {semester_id} has no suitable lecturers.")
        return None, None
        
    if not semester_specific_data_processor.room_map:
        print(f"Error: Semester {semester_id} has no suitable classrooms.")
        return None, None
        
    if not semester_specific_data_processor.required_lessons_weekly:
        print(f"Warning: Semester {semester_id} has no lessons created after filtering.")
        return None, None
        
    # Initialize necessary objects and data for the GA
    fitness_calculator = FitnessCalculator(semester_specific_data_processor)
    population = initialize_population(POPULATION_SIZE, semester_specific_data_processor)
    
    # Calculate initial fitness for the entire population
    for chrom in population:
        chrom.fitness, _ = fitness_calculator.calculate_fitness(chrom)

    best_overall_chromosome = None
    best_overall_violations = {}
    ga_log_data = []

    # Tạo thông tin học kỳ để truyền vào display_ga_progress
    semester_info = {
        'semester_id': semester_id,
        'semester_name': f"Học kỳ {semester_id.split('_')[0]}",
        'academic_year': semester_id.split('_')[-1],
        'total_lessons': len(semester_specific_data_processor.required_lessons_weekly),
        'total_lecturers': len(semester_specific_data_processor.lecturer_map),
        'total_rooms': len(semester_specific_data_processor.room_map)
    }

    # Start the evolutionary loop
    for generation in range(MAX_GENERATIONS):
        # Sort the population to identify the best chromosome
        population.sort(key=lambda c: c.fitness, reverse=True)
        current_best_chromosome = population[0]

        # Update the overall best chromosome if a new one is found
        if best_overall_chromosome is None or current_best_chromosome.fitness > best_overall_chromosome.fitness:
            best_overall_chromosome = current_best_chromosome
            # Get detailed violations for the best chromosome
            _, best_overall_violations = fitness_calculator.calculate_fitness(best_overall_chromosome)
        
        # Get detailed violations for the current generation's best to display progress
        _, current_violations = fitness_calculator.calculate_fitness(current_best_chromosome)

        # Display the algorithm's progress - THÊM semester_info
        display_ga_progress(
            generation=generation,
            max_generations=MAX_GENERATIONS,
            current_best_fitness=current_best_chromosome.fitness,
            overall_best_fitness=best_overall_chromosome.fitness,
            current_best_violations=current_violations,
            overall_best_violations=best_overall_violations,
            semester_info=semester_info,  # THÊM THÔNG TIN HỌC KỲ
            log_interval=1
        )
        
        # Log data for the current generation
        ga_log_data.append({
            "generation": generation + 1,
            "best_fitness_gen": current_best_chromosome.fitness,
            "best_overall_fitness": best_overall_chromosome.fitness,
            "current_violations": current_violations
        })

        # Stop if a perfect solution is found (fitness >= 0)
        # if current_best_chromosome.fitness >= 0:
        #    break

        # Create a new population for the next generation
        new_population = []
        
        # Apply elitism: preserve the best individuals
        new_population.extend(population[:ELITISM_COUNT])
        
        # Create new individuals through crossover and mutation
        while len(new_population) < POPULATION_SIZE:
            # Select two parents
            parent1 = tournament_selection(population)
            parent2 = tournament_selection(population)

            # Crossover
            if random.random() < CROSSOVER_RATE:
                child1, child2 = lesson_based_crossover(parent1, parent2, semester_specific_data_processor)
            else:
                child1, child2 = parent1, parent2

            # Mutation
            mutate_chromosome(child1, semester_specific_data_processor, MUTATION_RATE)
            mutate_chromosome(child2, semester_specific_data_processor, MUTATION_RATE)
            
            # Calculate and assign new fitness to the offspring
            child1.fitness, _ = fitness_calculator.calculate_fitness(child1)
            child2.fitness, _ = fitness_calculator.calculate_fitness(child2)

            # Add offspring to the new population
            new_population.append(child1)
            if len(new_population) < POPULATION_SIZE:
                new_population.append(child2)
        
        # Update the population
        population = new_population

    return best_overall_chromosome, ga_log_data