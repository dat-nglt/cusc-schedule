# timetable_ga/ga_components/mutation.py
import random
from .chromosome import Chromosome

def mutate_chromosome(chromosome, processed_data, mutation_rate):
    """
    Đột biến một cá thể bằng cách thay đổi một gene.
    Quá trình đột biến cố gắng tìm một giá trị hợp lệ mới để giảm thiểu vi phạm.
    """
    for i in range(len(chromosome.genes)):
        if random.random() < mutation_rate:
            gene = chromosome.genes[i]
            
            mutation_type = random.choice(["day_slot", "room", "lecturer"])
            
            class_id = gene['class_id']
            subject_id = gene['subject_id']
            lesson_type = gene['lesson_type']
            class_size = processed_data.class_map.get(class_id, {}).get('size', 0)
            
            if mutation_type == "day_slot":
                all_time_slots = [(d, s['slot_id']) for d in processed_data.data['days_of_week'] for s in processed_data.data['time_slots']]
                random.shuffle(all_time_slots)

                for new_day, new_slot in all_time_slots:
                    is_valid = True
                    for other_gene in chromosome.genes:
                        if other_gene != gene:
                            if other_gene['lecturer_id'] == gene['lecturer_id'] and other_gene['day'] == new_day and other_gene['slot_id'] == new_slot:
                                is_valid = False
                                break
                            if other_gene['room_id'] == gene['room_id'] and other_gene['day'] == new_day and other_gene['slot_id'] == new_slot:
                                is_valid = False
                                break
                            if other_gene['class_id'] == gene['class_id'] and other_gene['day'] == new_day and other_gene['slot_id'] == new_slot:
                                is_valid = False
                                break
                    if is_valid:
                        gene['day'] = new_day
                        gene['slot_id'] = new_slot
                        break
            
            elif mutation_type == "room":
                possible_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
                valid_rooms = [r for r in possible_rooms 
                               if not any(g['room_id'] == r and g['day'] == gene['day'] and g['slot_id'] == gene['slot_id'] for g in chromosome.genes if g != gene)]
                if valid_rooms:
                    gene['room_id'] = random.choice(valid_rooms)

            elif mutation_type == "lecturer":
                possible_lecturers = processed_data.get_lecturers_for_subject(subject_id)
                valid_lecturers = [l for l in possible_lecturers
                                   if not any(busy['day'] == gene['day'] and busy['slot_id'] == gene['slot_id'] 
                                              for busy in processed_data.lecturer_map.get(l, {}).get('busy_slots', []))
                                   and not any(g['lecturer_id'] == l and g['day'] == gene['day'] and g['slot_id'] == gene['slot_id'] for g in chromosome.genes if g != gene)]
                if valid_lecturers:
                    gene['lecturer_id'] = random.choice(valid_lecturers)

    return chromosome