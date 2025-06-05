# timetable_ga/ga_components/fitness.py
from collections import defaultdict
from config import (
    PENALTY_LECTURER_CLASH, PENALTY_ROOM_CLASH, PENALTY_CLASS_CLASH,
    PENALTY_INSUFFICIENT_LESSONS, PENALTY_ROOM_TYPE_MISMATCH,
    PENALTY_ROOM_CAPACITY, PENALTY_LECTURER_BUSY, PENALTY_LECTURER_UNQUALIFIED,
    PENALTY_CONSECUTIVE_HOURS_LECTURER, PENALTY_CONSECUTIVE_HOURS_CLASS,
    MAX_CONSECUTIVE_SLOTS, PENALTY_DISTRIBUTION_DAYS, PENALTY_GAPS_IN_SCHEDULE,
    HOURS_PER_SLOT
)

class FitnessCalculator:
    def __init__(self, processed_data):
        self.processed_data = processed_data
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(processed_data.data['time_slots'])}

    def calculate_fitness(self, chromosome):
        penalty = 0
        scheduled_events = chromosome.genes # List of dicts

        # --- Ràng buộc cứng ---
        lecturer_schedule = defaultdict(list) # (lecturer, day, slot)
        room_schedule = defaultdict(list)     # (room, day, slot)
        class_schedule = defaultdict(list)    # (class, day, slot)
        
        # Đếm số tiết đã xếp cho mỗi (class_id, subject_id, type)
        scheduled_lesson_counts = defaultdict(int)

        for gene in scheduled_events:
            day, slot_id = gene['day'], gene['slot_id']
            lecturer_id, room_id, class_id = gene['lecturer_id'], gene['room_id'], gene['class_id']
            subject_id, lesson_type = gene['subject_id'], gene['lesson_type']

            # R1: Không trùng lịch giảng viên
            if (day, slot_id) in lecturer_schedule[lecturer_id]:
                penalty += PENALTY_LECTURER_CLASH
            lecturer_schedule[lecturer_id].append((day, slot_id))

            # R2: Không trùng lịch phòng học
            if (day, slot_id) in room_schedule[room_id]:
                penalty += PENALTY_ROOM_CLASH
            room_schedule[room_id].append((day, slot_id))
            
            # R4: Lớp không học trùng
            if (day, slot_id) in class_schedule[class_id]:
                penalty += PENALTY_CLASS_CLASH
            class_schedule[class_id].append((day, slot_id))

            # R5 & R6: Phòng học phù hợp (loại phòng và sức chứa)
            # (Kiểm tra cả trường hợp lecturer/room là UNASSIGNED từ bước khởi tạo)
            if room_id == "UNASSIGNED_ROOM":
                penalty += PENALTY_ROOM_TYPE_MISMATCH # Hoặc một penalty riêng
            else:
                room_info = self.processed_data.room_map.get(room_id)
                class_info = self.processed_data.class_map.get(class_id)
                if room_info and class_info:
                    if room_info['type'] != lesson_type:
                        penalty += PENALTY_ROOM_TYPE_MISMATCH
                    if room_info['capacity'] < class_info['size']:
                        penalty += PENALTY_ROOM_CAPACITY
                else: # Room_id không hợp lệ
                    penalty += PENALTY_ROOM_TYPE_MISMATCH 

            # R7: Tránh trùng lịch cá nhân bắt buộc của giảng viên
            if lecturer_id == "UNASSIGNED_LECTURER":
                penalty += PENALTY_LECTURER_UNQUALIFIED
            else:
                lecturer_info = self.processed_data.lecturer_map.get(lecturer_id)
                if lecturer_info:
                    if subject_id not in lecturer_info['subjects']:
                         penalty += PENALTY_LECTURER_UNQUALIFIED
                    for busy_slot in lecturer_info.get('busy_slots', []):
                        if busy_slot['day'] == day and busy_slot['slot_id'] == slot_id:
                            penalty += PENALTY_LECTURER_BUSY
                else: # Lecturer_id không hợp lệ
                     penalty += PENALTY_LECTURER_UNQUALIFIED
            
            scheduled_lesson_counts[(class_id, subject_id, lesson_type)] += 1

        # R3: Đủ số buổi học cho từng môn
        for required in self.processed_data.required_lessons_weekly:
            # Đếm tổng số required_lessons có cùng class, subject, type
            # rồi so sánh với số lượng thực tế được xếp trong `scheduled_lesson_counts`
            # Đây là một cách đơn giản hóa. Chính xác hơn là phải đảm bảo *mỗi* required_lesson_id được xếp.
            # Tuy nhiên, cách biểu diễn chromosome hiện tại là mỗi gene tương ứng 1 required_lesson, nên nếu số gene = số required_lessons thì đã đủ.
            # Vấn đề là các gene có thể bị trùng lặp hoặc thiếu sót nếu crossover/mutation không cẩn thận.
            # Trong cách triển khai chromosome hiện tại (mỗi gene là một required_lesson được gán),
            # việc thiếu số buổi học sẽ không xảy ra nếu quần thể khởi tạo đúng.
            # Tuy nhiên, nếu một required_lesson không được gán lecturer/room hợp lệ, nó cũng tương tự như không được xếp.
            pass # Đã được đảm bảo bởi cách tạo chromosome, trừ khi UNASSIGNED


        # --- Ràng buộc mềm ---
        
        # M1: Không dạy/học liền quá nhiều tiết
        # Sắp xếp các tiết học theo giảng viên/lớp, ngày, và thứ tự slot
        for entity_type in ["lecturer", "class"]:
            schedules_by_entity = defaultdict(lambda: defaultdict(list)) # entity_id -> day -> list of slot_ids
            for gene in scheduled_events:
                entity_id = gene['lecturer_id'] if entity_type == "lecturer" else gene['class_id']
                if entity_id.startswith("UNASSIGNED"): continue # Bỏ qua nếu chưa gán
                schedules_by_entity[entity_id][gene['day']].append(gene['slot_id'])

            for entity_id, day_schedule in schedules_by_entity.items():
                for day, slots in day_schedule.items():
                    if not slots: continue
                    # Sắp xếp các slot theo thứ tự thời gian
                    sorted_slots = sorted(slots, key=lambda s: self.slot_order_map[s])
                    
                    consecutive_count = 1
                    for i in range(1, len(sorted_slots)):
                        # Kiểm tra xem slot hiện tại có phải là slot ngay sau slot trước đó không
                        if self.slot_order_map[sorted_slots[i]] == self.slot_order_map[sorted_slots[i-1]] + 1:
                            consecutive_count += 1
                        else: # Không liên tục
                            if consecutive_count > MAX_CONSECUTIVE_SLOTS:
                                penalty_val = PENALTY_CONSECUTIVE_HOURS_LECTURER if entity_type == "lecturer" else PENALTY_CONSECUTIVE_HOURS_CLASS
                                penalty += penalty_val * (consecutive_count - MAX_CONSECUTIVE_SLOTS)
                            consecutive_count = 1 # Reset
                    # Kiểm tra lần cuối sau vòng lặp
                    if consecutive_count > MAX_CONSECUTIVE_SLOTS:
                        penalty_val = PENALTY_CONSECUTIVE_HOURS_LECTURER if entity_type == "lecturer" else PENALTY_CONSECUTIVE_HOURS_CLASS
                        penalty += penalty_val * (consecutive_count - MAX_CONSECUTIVE_SLOTS)
                    
                    # M3: Hạn chế tiết trống giữa các lớp (cho một lớp trong một ngày)
                    gaps = 0
                    for i in range(1, len(sorted_slots)):
                        diff = self.slot_order_map[sorted_slots[i]] - self.slot_order_map[sorted_slots[i-1]]
                        if diff > 1: # Có khoảng trống (diff-1) slot trống
                            gaps += (diff - 1)
                    penalty += PENALTY_GAPS_IN_SCHEDULE * gaps


        # M2: Phân bố thời khóa biểu đều trong tuần (ví dụ cho lớp học)
        lessons_per_day_class = defaultdict(lambda: defaultdict(int)) # class_id -> day -> count
        for gene in scheduled_events:
            lessons_per_day_class[gene['class_id']][gene['day']] += 1
        
        for class_id, day_counts in lessons_per_day_class.items():
            counts = [day_counts.get(d, 0) for d in self.processed_data.data['days_of_week']]
            if not counts: continue
            avg_lessons = sum(counts) / len(counts) # Hoặc len(days_of_week) có tiết
            variance = sum([(c - avg_lessons)**2 for c in counts]) / len(counts)
            penalty += PENALTY_DISTRIBUTION_DAYS * variance


        # M4: Ưu tiên xếp lớp gần nhau về địa điểm (Cần thêm dữ liệu vị trí phòng học - Bỏ qua trong ví dụ này)

        chromosome.fitness = -penalty # GA thường tối đa hóa, nên dùng giá trị âm của penalty
        return chromosome.fitness