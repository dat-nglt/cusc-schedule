# timetable_ga/ga_components/mutation.py
import random

def mutate_chromosome(chromosome, processed_data, mutation_rate):
    """
    Mutates a chromosome by randomly changing some of its genes.
    A gene mutation involves re-assigning day, slot, room, or lecturer.
    """
    mutated_genes = []
    for gene_idx, original_gene in enumerate(chromosome.genes):
        if random.random() < mutation_rate:
            mutated_gene = original_gene.copy() # Work on a copy

            # Choose what to mutate: day, slot, room, or lecturer
            mutation_type = random.choice(["day", "slot", "room", "lecturer"])

            # Updated logic to handle gene_idx exceeding bounds
            if gene_idx < len(processed_data.required_lessons_weekly):
                lesson_info = processed_data.required_lessons_weekly[gene_idx]
                class_id = lesson_info['class_id']
                subject_id = lesson_info['subject_id']
                lesson_type = lesson_info['type']
                class_size = processed_data.class_map[class_id]['size']

                if mutation_type == "day":
                    mutated_gene['day'] = random.choice(processed_data.data['days_of_week'])
                elif mutation_type == "slot":
                    mutated_gene['slot_id'] = random.choice(processed_data.data['time_slots'])['slot_id']
                elif mutation_type == "room":
                    possible_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
                    if possible_rooms:
                        mutated_gene['room_id'] = random.choice(possible_rooms)
                    else: # fallback if no suitable room, keep original or mark as issue
                        mutated_gene['room_id'] = "UNASSIGNED_ROOM_MUT" 
                elif mutation_type == "lecturer":
                    possible_lecturers = processed_data.get_lecturers_for_subject(subject_id)
                    if possible_lecturers:
                        mutated_gene['lecturer_id'] = random.choice(possible_lecturers)
                    else: # fallback
                        mutated_gene['lecturer_id'] = "UNASSIGNED_LECTURER_MUT"
            else:
                # Handle out-of-bounds gene_idx
                lesson_info = original_gene  # Fallback to original_gene
            
            mutated_genes.append(mutated_gene)
        else:
            mutated_genes.append(original_gene)
            
    chromosome.genes = mutated_genes
    # Fitness will be recalculated