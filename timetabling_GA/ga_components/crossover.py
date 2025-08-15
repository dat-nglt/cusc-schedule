# timetable_ga/ga_components/crossover.py
import random
from .chromosome import Chromosome

def lesson_based_crossover(parent1, parent2, processed_data):
    """
    Lai ghép dựa trên tiết học. Mỗi gene (tiết học) được chọn từ một trong hai bố mẹ.
    """
    child1_genes, child2_genes = [], []
    
    parent1_map = {gene['lesson_id']: gene for gene in parent1.genes}
    parent2_map = {gene['lesson_id']: gene for gene in parent2.genes}
    
    for lesson in processed_data.required_lessons_weekly:
        lesson_id = lesson['lesson_id']
        gene1 = parent1_map.get(lesson_id)
        gene2 = parent2_map.get(lesson_id)
        
        if gene1 and gene2:
            if random.random() < 0.5:
                child1_genes.append(gene1.copy())
                child2_genes.append(gene2.copy())
            else:
                child1_genes.append(gene2.copy())
                child2_genes.append(gene1.copy())
        else:
            if gene1:
                child1_genes.append(gene1.copy())
                child2_genes.append(gene1.copy())
            elif gene2:
                child1_genes.append(gene2.copy())
                child2_genes.append(gene2.copy())
    
    return Chromosome(child1_genes), Chromosome(child2_genes)