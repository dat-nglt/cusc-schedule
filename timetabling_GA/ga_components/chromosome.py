# timetable_ga/ga_components/chromosome.py
import random

class Chromosome:
    def __init__(self, genes=None):
        # genes is a list of dictionaries, where each dict is a scheduled lesson:
        # {'lesson_id': str, 'class_id': str, 'subject_id': str, 'lesson_type': str,
        #  'day': str, 'slot_id': str, 'room_id': str, 'lecturer_id': str}
        self.genes = genes if genes is not None else []
        self.fitness = float('-inf') # Sẽ được tính toán bởi fitness function

    def __str__(self):
        return f"Fitness: {self.fitness:.2f}, Genes: {len(self.genes)} scheduled"

    def __lt__(self, other): # For sorting by fitness
        return self.fitness > other.fitness # Higher fitness is better

def create_random_chromosome(processed_data):
    """
    Creates a random chromosome (a potential timetable).
    Each required lesson is randomly assigned a day, slot, room, and lecturer.
    This initial assignment might be very invalid.
    """
    genes = []
    for required_lesson in processed_data.required_lessons_weekly:
        class_id = required_lesson['class_id']
        subject_id = required_lesson['subject_id']
        lesson_type = required_lesson['type']

        cls_info = processed_data.class_map[class_id]
        class_size = cls_info['size']

        possible_lecturers = processed_data.get_lecturers_for_subject(subject_id)
        possible_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
        
        # Handle cases where no suitable lecturer or room is found (should ideally not happen with good data)
        if not possible_lecturers:
            # print(f"Warning: No lecturer for subject {subject_id} for lesson {required_lesson['lesson_id']}")
            lecturer_id = "UNASSIGNED_LECTURER" # Placeholder
            lecturer_name = "Unknown"
        else:
            lecturer_id = random.choice(possible_lecturers)
            lecturer_name = next((lecturer['lecturer_name'] for lecturer in processed_data.data['lecturers'] if lecturer['lecturer_id'] == lecturer_id), "Unknown")

        if not possible_rooms:
            # print(f"Warning: No room for lesson {required_lesson['lesson_id']} (type: {lesson_type}, size: {class_size})")
            room_id = "UNASSIGNED_ROOM" # Placeholder
        else:
            room_id = random.choice(possible_rooms)
            
        day = random.choice(processed_data.data['days_of_week'])
        slot_id = random.choice(processed_data.data['time_slots'])['slot_id']

        genes.append({
            "lesson_id": required_lesson['lesson_id'], # Unique ID for this specific teaching instance
            "class_id": class_id,
            "subject_id": subject_id,
            "lesson_type": lesson_type,
            "program_id": required_lesson['program_id'],
            "group_id": required_lesson['group_id'], # Useful for checking consecutive lessons of same subject
            "day": day,
            "slot_id": slot_id,
            "room_id": room_id,
            "lecturer_id": lecturer_id,
            "lecturer_name": lecturer_name,
        })
    return Chromosome(genes)