# timetable_ga/ga_components/fitness.py
from collections import defaultdict
from config import (
    PENALTY_LECTURER_CLASH, PENALTY_ROOM_CLASH, PENALTY_CLASS_CLASH,
    PENALTY_ROOM_TYPE_MISMATCH, PENALTY_ROOM_CAPACITY, PENALTY_LECTURER_BUSY,
    PENALTY_LECTURER_UNQUALIFIED, PENALTY_CONSECUTIVE_HOURS_LECTURER, 
    PENALTY_CONSECUTIVE_HOURS_CLASS, PENALTY_UNASSIGNED_GEN,
    MAX_CONSECUTIVE_SLOTS, PENALTY_DISTRIBUTION_DAYS, PENALTY_GAPS_IN_SCHEDULE
)
from datetime import datetime

class FitnessCalculator:
    def __init__(self, processed_data):
        self.processed_data = processed_data
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(processed_data.data['time_slots'])}

    def calculate_fitness(self, chromosome):
        penalty = 0
        scheduled_events = chromosome.genes

        # Sử dụng key (day, slot_id) để kiểm tra trùng lịch
        slot_occupancy = defaultdict(lambda: defaultdict(lambda: defaultdict(list))) 
        lecturer_slots_per_day = defaultdict(lambda: defaultdict(list))
        class_slots_per_day = defaultdict(lambda: defaultdict(list))

        for gene in scheduled_events:
            day, slot_id = gene.get('day'), gene.get('slot_id')
            lecturer_id, room_id, class_id = gene.get('lecturer_id'), gene.get('room_id'), gene.get('class_id')
            subject_id, lesson_type = gene.get('subject_id'), gene.get('lesson_type')
            
            if not all([day, slot_id, lecturer_id, room_id, class_id, subject_id, lesson_type]):
                penalty += PENALTY_UNASSIGNED_GEN
                continue

            # Kiểm tra các ràng buộc cứng
            if lecturer_id in slot_occupancy[day][slot_id]['lecturers']:
                penalty += PENALTY_LECTURER_CLASH
                # print(f"DEBUG: Trùng lịch giảng viên {lecturer_id}, phạt {PENALTY_LECTURER_CLASH}")
            if room_id in slot_occupancy[day][slot_id]['rooms']:
                penalty += PENALTY_ROOM_CLASH
                # print(f"DEBUG: Trùng lịch phòng {room_id}, phạt {PENALTY_ROOM_CLASH}")
            if class_id in slot_occupancy[day][slot_id]['classes']:
                penalty += PENALTY_CLASS_CLASH
                # print(f"DEBUG: Trùng lịch lớp {class_id}, phạt {PENALTY_CLASS_CLASH}")

            slot_occupancy[day][slot_id]['lecturers'].append(lecturer_id)
            slot_occupancy[day][slot_id]['rooms'].append(room_id)
            slot_occupancy[day][slot_id]['classes'].append(class_id)
            
            room_info = self.processed_data.room_map.get(room_id)
            class_info = self.processed_data.class_map.get(class_id)
            lecturer_info = self.processed_data.lecturer_map.get(lecturer_id)

            if not room_info or room_info['type'] != lesson_type:
                penalty += PENALTY_ROOM_TYPE_MISMATCH
                # print(f"DEBUG: Sai loại phòng cho {room_id}, phạt {PENALTY_ROOM_TYPE_MISMATCH}")
            if class_info and room_info and room_info['capacity'] < class_info['size']:
                penalty += PENALTY_ROOM_CAPACITY
                # print(f"DEBUG: Phòng {room_id} không đủ sức chứa cho {class_id}, phạt {PENALTY_ROOM_CAPACITY}")

            if not lecturer_info or subject_id not in lecturer_info['subjects']:
                penalty += PENALTY_LECTURER_UNQUALIFIED
                # print(f"DEBUG: Giảng viên {lecturer_id} không đủ trình độ cho {subject_id}, phạt {PENALTY_LECTURER_UNQUALIFIED}")
            
            if lecturer_info:
                for busy_slot in lecturer_info.get('busy_slots', []):
                    if busy_slot['day'] == day and busy_slot['slot_id'] == slot_id:
                        penalty += PENALTY_LECTURER_BUSY
                        # print(f"DEBUG: Giảng viên {lecturer_id} bận vào {day}-{slot_id}, phạt {PENALTY_LECTURER_BUSY}")
            
            lecturer_slots_per_day[lecturer_id][day].append(slot_id)
            class_slots_per_day[class_id][day].append(slot_id)


        def _calculate_consecutive_penalty_generic(day_schedule, max_consecutive, penalty_value):
            p = 0
            for entity_id, schedule in day_schedule.items():
                for date, slots in schedule.items():
                    valid_slots = [s for s in slots if s in self.slot_order_map]
                    if len(valid_slots) > 1:
                        sorted_slots = sorted(valid_slots, key=lambda s: self.slot_order_map[s])
                        consecutive_count = 1
                        for i in range(1, len(sorted_slots)):
                            if self.slot_order_map[sorted_slots[i]] == self.slot_order_map[sorted_slots[i-1]] + 1:
                                consecutive_count += 1
                            else:
                                if consecutive_count > max_consecutive:
                                    p += penalty_value * (consecutive_count - max_consecutive)
                                consecutive_count = 1
                        if consecutive_count > max_consecutive:
                            p += penalty_value * (consecutive_count - max_consecutive)
            return p
            
        penalty += _calculate_consecutive_penalty_generic({"class": class_slots_per_day}, MAX_CONSECUTIVE_SLOTS, PENALTY_CONSECUTIVE_HOURS_CLASS)
        penalty += _calculate_consecutive_penalty_generic({"lecturer": lecturer_slots_per_day}, MAX_CONSECUTIVE_SLOTS, PENALTY_CONSECUTIVE_HOURS_LECTURER)

        for class_id, date_schedule in class_slots_per_day.items():
            if date_schedule:
                day_counts = [len(slots) for slots in date_schedule.values()]
                if len(day_counts) > 0:
                    avg_lessons = sum(day_counts) / len(day_counts)
                    variance = sum([(c - avg_lessons)**2 for c in day_counts]) / len(day_counts)
                    penalty += PENALTY_DISTRIBUTION_DAYS * variance

        for class_id, date_schedule in lecturer_slots_per_day.items():
            for date, slots in date_schedule.items():
                valid_slots = [s for s in slots if s in self.slot_order_map]
                if len(valid_slots) > 1:
                    sorted_slots = sorted(valid_slots, key=lambda s: self.slot_order_map[s])
                    gaps = 0
                    for i in range(1, len(sorted_slots)):
                        diff = self.slot_order_map[sorted_slots[i]] - self.slot_order_map[sorted_slots[i-1]]
                        if diff > 1:
                            gaps += (diff - 1)
                    penalty += PENALTY_GAPS_IN_SCHEDULE * gaps

        chromosome.fitness = -penalty
        # print(f"DEBUG: Tổng điểm phạt: {penalty}, Fitness: {chromosome.fitness}")
        return chromosome.fitness