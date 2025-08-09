# timetable_ga/ga_components/chromosome.py
import random
from collections import defaultdict

class Chromosome:
    """
    Biểu diễn một lịch trình tiềm năng.
    Mỗi gene là một dictionary mô tả một tiết học đã được xếp lịch.
    """
    def __init__(self, genes=None):
        self.genes = genes if genes is not None else []
        self.fitness = float('-inf')

    def __str__(self):
        return f"Fitness: {self.fitness:.2f}, Genes: {len(self.genes)} scheduled"

    def __lt__(self, other):
        """Sắp xếp theo fitness, giá trị cao hơn sẽ ưu tiên hơn."""
        return self.fitness > other.fitness

def create_random_chromosome(processed_data):
    """
    Tạo một cá thể ban đầu bằng cách gán các tiết học vào các tài nguyên
    phù hợp để giảm thiểu các vi phạm cứng.
    """
    genes = []
    
    # Sử dụng set để theo dõi các tài nguyên đã được sử dụng trong cá thể này
    used_slots_per_lecturer = defaultdict(set)
    used_slots_per_room = defaultdict(set)
    used_slots_per_class = defaultdict(set)

    # Lặp qua từng tiết học cần xếp lịch
    for required_lesson in processed_data.required_lessons_weekly:
        class_id = required_lesson['class_id']
        subject_id = required_lesson['subject_id']
        lesson_type = required_lesson['lesson_type']
        class_size = processed_data.class_map.get(class_id, {}).get('size', 0)

        # Lọc các lựa chọn hợp lệ
        valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
        valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
        
        # Tạo danh sách tất cả các tổ hợp day-slot có thể
        all_time_slots = [(d, s['slot_id']) for d in processed_data.data['days_of_week'] for s in processed_data.data['time_slots']]

        selected_lecturer = "UNASSIGNED_LECTURER"
        selected_room = "UNASSIGNED_ROOM"
        selected_day = "UNASSIGNED_DAY"
        selected_slot = "UNASSIGNED_SLOT"

        # Cố gắng tìm một tổ hợp hợp lệ
        random.shuffle(all_time_slots) # Xáo trộn để có thêm sự đa dạng
        for day, slot_id in all_time_slots:
            is_valid_combo = True
            
            # Lọc các giảng viên có thể dạy vào slot này
            possible_lecturers_in_slot = [l for l in valid_lecturers 
                                          if (day, slot_id) not in used_slots_per_lecturer.get(l, set())
                                          and not any(busy['day'] == day and busy['slot_id'] == slot_id 
                                                      for busy in processed_data.lecturer_map.get(l, {}).get('busy_slots', []))]
            
            if not possible_lecturers_in_slot:
                is_valid_combo = False
            
            # Lọc các phòng trống vào slot này
            possible_rooms_in_slot = [r for r in valid_rooms 
                                      if (day, slot_id) not in used_slots_per_room.get(r, set())]
            
            if not possible_rooms_in_slot:
                is_valid_combo = False

            # Kiểm tra lớp học
            if (day, slot_id) in used_slots_per_class.get(class_id, set()):
                is_valid_combo = False
            
            if is_valid_combo:
                selected_lecturer = random.choice(possible_lecturers_in_slot)
                selected_room = random.choice(possible_rooms_in_slot)
                selected_day, selected_slot = day, slot_id
                break

        # Cập nhật các tài nguyên đã sử dụng
        if selected_lecturer != "UNASSIGNED_LECTURER":
            used_slots_per_lecturer[selected_lecturer].add((selected_day, selected_slot))
        if selected_room != "UNASSIGNED_ROOM":
            used_slots_per_room[selected_room].add((selected_day, selected_slot))
        if selected_day != "UNASSIGNED_DAY":
            used_slots_per_class[class_id].add((selected_day, selected_slot))

        genes.append({
            "lesson_id": required_lesson['lesson_id'],
            "class_id": class_id,
            "subject_id": subject_id,
            "lesson_type": lesson_type,
            "program_id": required_lesson['program_id'],
            "group_id": required_lesson['group_id'],
            "day": selected_day,
            "slot_id": selected_slot,
            "room_id": selected_room,
            "lecturer_id": selected_lecturer
        })
    return Chromosome(genes)