# timetable_ga/ga_components/chromosome.py
import random
import copy
from collections import defaultdict
from config import MAX_ASSIGNMENT_ATTEMPTS

class Chromosome:
    def __init__(self, genes=None):
        self.genes = genes if genes is not None else []
        self.fitness = float('-inf')

    def __str__(self):
        return f"Fitness: {self.fitness:.2f}, Genes: {len(self.genes)} scheduled"

    def __lt__(self, other):
        return self.fitness > other.fitness

def find_available_time_slot_and_resources(processed_data, required_lesson, used_slots_per_lecturer, used_slots_per_room, used_slots_per_class):
    """
    Tìm kiếm ngẫu nhiên một tổ hợp hợp lệ (day, slot, lecturer, room)
    cho một tiết học, có giới hạn số lần thử.
    """
    class_id = required_lesson['class_id']
    subject_id = required_lesson['subject_id']
    lesson_type = required_lesson['lesson_type']
    class_size = processed_data.class_map.get(class_id, {}).get('size', 0)

    # Lấy danh sách tất cả các tài nguyên hợp lệ
    valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
    if not valid_lecturers:
        return None, None, None, None

    valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
    if not valid_rooms:
        return None, None, None, None

    all_time_slots = [(d, s['slot_id']) for d in processed_data.data['days_of_week'] for s in processed_data.data['time_slots']]
    random.shuffle(all_time_slots)

    for _ in range(MAX_ASSIGNMENT_ATTEMPTS):
        day, slot_id = random.choice(all_time_slots)
        
        # Kiểm tra xung đột với các gen đã gán
        if (day, slot_id) in used_slots_per_class[class_id]:
            continue

        # Tìm giảng viên và phòng trống ngẫu nhiên
        available_lecturers = [
            l for l in valid_lecturers 
            if (day, slot_id) not in processed_data.lecturer_map.get(l, {}).get('busy_slots', set())
            and (day, slot_id) not in used_slots_per_lecturer[l]
        ]
        
        available_rooms = [
            r for r in valid_rooms 
            if (day, slot_id) not in used_slots_per_room[r]
        ]

        if available_lecturers and available_rooms:
            selected_lecturer = random.choice(available_lecturers)
            selected_room = random.choice(available_rooms)
            return day, slot_id, selected_lecturer, selected_room

    return None, None, None, None # Không tìm thấy sau số lần thử tối đa


def create_random_chromosome(processed_data):
    """
    Tạo một cá thể ban đầu bằng cách gán ngẫu nhiên các tiết học hàng tuần
    vào các tài nguyên hợp lệ, có giới hạn số lần thử.
    """
    genes = []
    used_slots_per_lecturer = defaultdict(set)
    used_slots_per_room = defaultdict(set)
    used_slots_per_class = defaultdict(set)

    required_lessons_to_schedule = copy.deepcopy(processed_data.required_lessons_weekly)
    random.shuffle(required_lessons_to_schedule)

    for required_lesson in required_lessons_to_schedule:
        day, slot_id, lecturer_id, room_id = find_available_time_slot_and_resources(
            processed_data, required_lesson, used_slots_per_lecturer, used_slots_per_room, used_slots_per_class
        )
        
        # Cập nhật các tài nguyên đã sử dụng nếu tìm thấy
        if all([day, slot_id, lecturer_id, room_id]):
            used_slots_per_lecturer[lecturer_id].add((day, slot_id))
            used_slots_per_room[room_id].add((day, slot_id))
            used_slots_per_class[required_lesson['class_id']].add((day, slot_id))

        # Thêm gen vào nhiễm sắc thể, kể cả khi không tìm thấy slot hợp lệ (giá trị là None)
        genes.append({
            "lesson_id": required_lesson['lesson_id'],
            "class_id": required_lesson['class_id'],
            "subject_id": required_lesson['subject_id'],
            "lesson_type": required_lesson['lesson_type'],
            "program_id": required_lesson['program_id'],
            "group_id": required_lesson['group_id'],
            "day": day,
            "slot_id": slot_id,
            "room_id": room_id,
            "lecturer_id": lecturer_id,
        })
    
    return Chromosome(genes)