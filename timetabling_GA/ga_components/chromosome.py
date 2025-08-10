import random
from collections import defaultdict
from datetime import datetime, timedelta
import copy

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
    Tạo một cá thể ban đầu bằng cách gán ngẫu nhiên các tiết học hàng tuần
    vào các tài nguyên hợp lệ.
    """
    genes = []
    
    # Sử dụng set để theo dõi các tài nguyên đã được sử dụng trong cá thể này
    used_slots_per_lecturer = defaultdict(set)
    used_slots_per_room = defaultdict(set)
    used_slots_per_class = defaultdict(set)
    
    # Ánh xạ tên ngày sang chỉ số ngày trong tuần (Mon=0, ..., Sun=6)
    day_mapping = {day: i for i, day in enumerate(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'])}

    # Tạo một bản sao để tránh làm thay đổi danh sách gốc khi xáo trộn
    required_lessons_to_schedule = copy.deepcopy(processed_data.required_lessons_weekly)
    random.shuffle(required_lessons_to_schedule)

    # Lặp qua từng tiết học cần xếp lịch cho MỘT TUẦN
    for required_lesson in required_lessons_to_schedule:
        class_id = required_lesson['class_id']
        subject_id = required_lesson['subject_id']
        lesson_type = required_lesson['lesson_type']
        class_size = processed_data.class_map.get(class_id, {}).get('size', 0)
        
        # --- DEBUG: IN TÀI NGUYÊN HỢP LỆ BAN ĐẦU ---
        valid_lecturers = processed_data.get_lecturers_for_subject(subject_id)
        valid_rooms = processed_data.get_rooms_for_type_and_capacity(lesson_type, class_size)
        # print(f"\n--- Xử lý gen: {required_lesson['lesson_id']} ---")
        # print(f"Lớp: {class_id}, Môn: {subject_id}, Loại: {lesson_type}, Sĩ số: {class_size}")
        # print(f"Giảng viên hợp lệ: {valid_lecturers}")
        # print(f"Phòng hợp lệ: {valid_rooms}")
        
        selected_lecturer = None
        selected_room = None
        selected_day = None
        selected_slot = None
        
        all_time_slots = [(d, s['slot_id']) for d in processed_data.data['days_of_week'] for s in processed_data.data['time_slots']]
        random.shuffle(all_time_slots)

        found_slot = False
        for day, slot_id in all_time_slots:
            is_class_slot_used = (day, slot_id) in used_slots_per_class[class_id]
            if is_class_slot_used:
                continue

            possible_lecturers_in_slot = [
                l for l in valid_lecturers
                if (day, slot_id) not in processed_data.lecturer_map.get(l, {}).get('busy_slots', [])
            ]
            
            # Lọc giảng viên và phòng đang bận trong slot này
            available_lecturers = [l for l in possible_lecturers_in_slot if (day, slot_id) not in used_slots_per_lecturer[l]]
            available_rooms = [r for r in valid_rooms if (day, slot_id) not in used_slots_per_room[r]]

            if not available_lecturers or not available_rooms:
                continue

            # Nếu tìm thấy, gán ngẫu nhiên và thoát
            selected_lecturer = random.choice(available_lecturers)
            selected_room = random.choice(available_rooms)
            selected_day, selected_slot = day, slot_id
            found_slot = True
            
            # Cập nhật các tài nguyên đã sử dụng trong nhiễm sắc thể
            used_slots_per_lecturer[selected_lecturer].add((selected_day, selected_slot))
            used_slots_per_room[selected_room].add((selected_day, selected_slot))
            used_slots_per_class[class_id].add((selected_day, selected_slot))
            
            # print(f"-> Gán thành công cho {class_id}: Ngày {selected_day}, Tiết {selected_slot}, Phòng {selected_room}, Giảng viên {selected_lecturer}")
            break
        
        if not found_slot:
            # --- DEBUG: IN THÔNG BÁO THẤT BẠI ---
            print(f"!!! KHÔNG THỂ TÌM THẤY TỔ HỢP HỢP LỆ NÀO CHO TIẾT HỌC {required_lesson['lesson_id']} !!!")

        # Thêm gen vào nhiễm sắc thể, kể cả khi không tìm thấy slot hợp lệ
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
            "lecturer_id": selected_lecturer,
        })
    
    # print(f"Trong hàm create_random_chromosome, số lượng gen được tạo ra: {len(genes)}")
    return Chromosome(genes)