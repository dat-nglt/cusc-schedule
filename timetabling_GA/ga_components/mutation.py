# timetable_ga/ga_components/mutation.py
from collections import defaultdict
import random
import copy
from .chromosome import Chromosome, find_available_time_slot_and_resources
from config import MAX_ASSIGNMENT_ATTEMPTS

def mutate_chromosome(chromosome, processed_data, mutation_rate):
    """
    Đột biến một cá thể bằng cách thay đổi một gene.
    """
    mutated_genes = copy.deepcopy(chromosome.genes)
    
    # Tạo các từ điển để kiểm tra xung đột một cách hiệu quả
    used_slots_per_lecturer = defaultdict(set)
    used_slots_per_room = defaultdict(set)
    used_slots_per_class = defaultdict(set)
    
    for gene in mutated_genes:
        if all([gene['day'], gene['slot_id'], gene['lecturer_id'], gene['room_id']]):
            used_slots_per_lecturer[gene['lecturer_id']].add((gene['day'], gene['slot_id']))
            used_slots_per_room[gene['room_id']].add((gene['day'], gene['slot_id']))
            used_slots_per_class[gene['class_id']].add((gene['day'], gene['slot_id']))

    for i in range(len(mutated_genes)):
        if random.random() < mutation_rate:
            gene = mutated_genes[i]
            
            # Xóa gen cũ khỏi các set để kiểm tra xung đột
            if all([gene.get('day'), gene.get('slot_id'), gene.get('lecturer_id'), gene.get('room_id')]):
                used_slots_per_lecturer[gene['lecturer_id']].discard((gene['day'], gene['slot_id']))
                used_slots_per_room[gene['room_id']].discard((gene['day'], gene['slot_id']))
                used_slots_per_class[gene['class_id']].discard((gene['day'], gene['slot_id']))

            mutation_type = random.choice(["day_slot", "room", "lecturer"])
            
            class_id = gene['class_id']
            subject_id = gene['subject_id']
            lesson_type = gene['lesson_type']
            class_size = processed_data.class_map.get(class_id, {}).get('size', 0)
            
            if mutation_type == "day_slot":
                # Tìm slot mới
                new_day, new_slot, _, _ = find_available_time_slot_and_resources(
                    processed_data, gene, used_slots_per_lecturer, used_slots_per_room, used_slots_per_class
                )
                gene['day'] = new_day
                gene['slot_id'] = new_slot

            elif mutation_type == "room":
                # Tìm phòng mới
                available_rooms = [
                    r for r in processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
                    if (gene['day'], gene['slot_id']) not in used_slots_per_room[r]
                ]
                if available_rooms:
                    gene['room_id'] = random.choice(available_rooms)
                else:
                    gene['room_id'] = None

            elif mutation_type == "lecturer":
                # Tìm giảng viên mới
                available_lecturers = [
                    l for l in processed_data.get_lecturers_for_subject(subject_id)
                    if (gene['day'], gene['slot_id']) not in processed_data.lecturer_map.get(l, {}).get('busy_slots', set())
                    and (gene['day'], gene['slot_id']) not in used_slots_per_lecturer[l]
                ]
                if available_lecturers:
                    gene['lecturer_id'] = random.choice(available_lecturers)
                else:
                    gene['lecturer_id'] = None
            
            # Sau khi đột biến, cập nhật lại các set
            if all([gene.get('day'), gene.get('slot_id'), gene.get('lecturer_id'), gene.get('room_id')]):
                used_slots_per_lecturer[gene['lecturer_id']].add((gene['day'], gene['slot_id']))
                used_slots_per_room[gene['room_id']].add((gene['day'], gene['slot_id']))
                used_slots_per_class[class_id].add((gene['day'], gene['slot_id']))
    
    return Chromosome(mutated_genes)