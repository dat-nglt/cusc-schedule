# timetable_ga/ga_components/crossover.py
import random
from .chromosome import Chromosome

def single_point_crossover(parent1, parent2):
    """
    Performs single-point crossover.
    The genes list contains dicts. We perform crossover on this list.
    """
    if len(parent1.genes) != len(parent2.genes) or len(parent1.genes) < 2 : # Guard clause
        return Chromosome(parent1.genes[:]), Chromosome(parent2.genes[:]) # Return copies

    point = random.randint(1, len(parent1.genes) - 1)
    
    child1_genes = parent1.genes[:point] + parent2.genes[point:]
    child2_genes = parent2.genes[:point] + parent1.genes[point:]
    
    return Chromosome(child1_genes), Chromosome(child2_genes)

def uniform_crossover(parent1, parent2, gene_swap_prob=0.5):
    """
    Performs uniform crossover.
    For each gene, decide randomly whether to take it from parent1 or parent2.
    """
    if len(parent1.genes) != len(parent2.genes): # Guard clause
        return Chromosome(parent1.genes[:]), Chromosome(parent2.genes[:])

    child1_genes = []
    child2_genes = []
    for i in range(len(parent1.genes)):
        if random.random() < gene_swap_prob:
            child1_genes.append(parent2.genes[i])
            child2_genes.append(parent1.genes[i])
        else:
            child1_genes.append(parent1.genes[i])
            child2_genes.append(parent2.genes[i])
            
    return Chromosome(child1_genes), Chromosome(child2_genes)