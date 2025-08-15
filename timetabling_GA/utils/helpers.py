import os
from collections import defaultdict

def format_timetable(chromosome, processed_data):
    """
    Formats a single weekly timetable (chromosome) for display.
    Sorts lessons by class, day, and time slot for readability.
    
    Args:
        chromosome (Chromosome): The best chromosome from the GA.
        processed_data (DataProcessor): The processed data object containing mappings.
    
    Returns:
        str: A formatted string of the weekly timetable.
    """
    output = []
    
    # Sort lessons by class, then by day, then by time slot
    sorted_genes = sorted(chromosome.genes, key=lambda g: (
        g['class_id'],
        processed_data.data['days_of_week'].index(g['day']),
        processed_data.slot_order_map[g['slot_id']]
    ))

    for gene in sorted_genes:
        # Fetch human-readable names for subjects and lecturers if available
        subject_name = processed_data.subject_map.get(gene['subject_id'], {}).get('name', gene['subject_id'])
        lecturer_name = processed_data.lecturer_map.get(gene['lecturer_id'], {}).get('name', gene['lecturer_id'])
        
        output.append(
            f"Class: {gene['class_id']}, Subject: {subject_name} ({gene['lesson_type']}), "
            f"Day: {gene['day']}, Slot: {gene['slot_id']}, "
            f"Room: {gene['room_id']}, Lecturer: {lecturer_name}"
        )
    return "\n".join(output)