from collections import defaultdict
import numpy as np
from config import (
    PENALTY_LECTURER_CLASH, PENALTY_ROOM_CLASH, PENALTY_CLASS_CLASH,
    PENALTY_ROOM_TYPE_MISMATCH, PENALTY_ROOM_CAPACITY, PENALTY_LECTURER_BUSY,
    PENALTY_LECTURER_UNQUALIFIED, PENALTY_CONSECUTIVE_HOURS_LECTURER, 
    PENALTY_CONSECUTIVE_HOURS_CLASS, PENALTY_UNASSIGNED_GEN,
    MAX_CONSECUTIVE_SLOTS, PENALTY_DISTRIBUTION_DAYS, PENALTY_GAPS_IN_SCHEDULE,
    PENALTY_WEEKEND_CLASH
)

class FitnessCalculator:
    def __init__(self, processed_data):
        self.processed_data = processed_data
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(processed_data.data['time_slots'])}
        
        # Cache dữ liệu
        self.room_map = processed_data.room_map
        self.class_map = processed_data.class_map
        self.lecturer_map = processed_data.lecturer_map

    def calculate_fitness(self, chromosome):
        penalty = 0
        violations = defaultdict(int)
        scheduled_events = chromosome.genes

        # Data structures for tracking
        slot_occupancy = defaultdict(lambda: defaultdict(lambda: defaultdict(list)))
        lecturer_slots_per_day = defaultdict(lambda: defaultdict(list))
        class_slots_per_day = defaultdict(lambda: defaultdict(list))

        # Cache for frequently accessed data
        room_map = self.room_map
        class_map = self.class_map
        lecturer_map = self.lecturer_map

        for gene in scheduled_events:
            # Extract data once
            day = gene.get('day')
            slot_id = gene.get('slot_id')
            lecturer_id = gene.get('lecturer_id')
            room_id = gene.get('room_id')
            class_id = gene.get('class_id')
            subject_id = gene.get('subject_id')
            lesson_type = gene.get('lesson_type')

            # Check for missing data first
            if not all([day, slot_id, lecturer_id, room_id, class_id, subject_id, lesson_type]):
                penalty += PENALTY_UNASSIGNED_GEN
                violations['Class not scheduled yet'] += 1
                continue

            # Check Sunday constraint - optimized
            if day and day.lower() in ['sun', 'sunday', 'chủ nhật', 'cn']:
                penalty += PENALTY_WEEKEND_CLASH
                violations['Classes fall on Sunday'] += 1

            # Check hard constraints
            current_slot = slot_occupancy[day][slot_id]
            if lecturer_id in current_slot['lecturers']:
                penalty += PENALTY_LECTURER_CLASH
                violations['Lecturer has overlapping schedule'] += 1
            if room_id in current_slot['rooms']:
                penalty += PENALTY_ROOM_CLASH
                violations['Classroom schedule overlap'] += 1
            if class_id in current_slot['classes']:
                penalty += PENALTY_CLASS_CLASH
                violations['Class schedule overlap'] += 1

            # Update occupancy
            current_slot['lecturers'].append(lecturer_id)
            current_slot['rooms'].append(room_id)
            current_slot['classes'].append(class_id)
            
            # Check room and lecturer constraints
            room_info = room_map.get(room_id)
            class_info = class_map.get(class_id)
            lecturer_info = lecturer_map.get(lecturer_id)

            if room_info:
                if room_info['type'] != lesson_type:
                    penalty += PENALTY_ROOM_TYPE_MISMATCH
                    violations['Wrong type of classroom'] += 1
                if class_info and room_info['capacity'] < class_info['size']:
                    penalty += PENALTY_ROOM_CAPACITY
                    violations['Room capacity if not enough'] += 1

            if lecturer_info:
                if subject_id not in lecturer_info['subjects']:
                    penalty += PENALTY_LECTURER_UNQUALIFIED
                    violations['The lecturer cannot teach the subject'] += 1
                
                # Check busy slots
                for busy_slot in lecturer_info.get('busy_slots', []):
                    if busy_slot['day'] == day and busy_slot['slot_id'] == slot_id:
                        penalty += PENALTY_LECTURER_BUSY
                        violations['Lecturer busy with fixed schedule'] += 1

            # Track for soft constraints
            lecturer_slots_per_day[lecturer_id][day].append(slot_id)
            class_slots_per_day[class_id][day].append(slot_id)

        # Calculate soft constraints penalties
        penalty += self._calculate_consecutive_penalty(class_slots_per_day, MAX_CONSECUTIVE_SLOTS, 
                                                     PENALTY_CONSECUTIVE_HOURS_CLASS, 'class')
        penalty += self._calculate_consecutive_penalty(lecturer_slots_per_day, MAX_CONSECUTIVE_SLOTS,
                                                     PENALTY_CONSECUTIVE_HOURS_LECTURER, 'lecturer')
        
        penalty += self._calculate_distribution_penalty(class_slots_per_day)
        penalty += self._calculate_gaps_penalty(lecturer_slots_per_day)

        chromosome.fitness = -penalty
        return chromosome.fitness, violations

    def _calculate_consecutive_penalty(self, schedule, max_consecutive, penalty_value, entity_type):
        """Optimized consecutive penalty calculation"""
        total_penalty = 0
        violations_key = f'{entity_type.capitalize()} too many hours in a row'
        
        for entity_id, day_schedule in schedule.items():
            for day, slots in day_schedule.items():
                valid_slots = [s for s in slots if s in self.slot_order_map]
                if len(valid_slots) <= max_consecutive:
                    continue
                    
                sorted_slots = sorted(valid_slots, key=lambda s: self.slot_order_map[s])
                consecutive_count = 1
                
                for i in range(1, len(sorted_slots)):
                    if self.slot_order_map[sorted_slots[i]] == self.slot_order_map[sorted_slots[i-1]] + 1:
                        consecutive_count += 1
                    else:
                        if consecutive_count > max_consecutive:
                            excess = consecutive_count - max_consecutive
                            total_penalty += penalty_value * excess
                        consecutive_count = 1
                
                if consecutive_count > max_consecutive:
                    excess = consecutive_count - max_consecutive
                    total_penalty += penalty_value * excess
        
        return total_penalty

    def _calculate_distribution_penalty(self, class_schedule):
        """Calculate distribution penalty using numpy"""
        total_penalty = 0
        for class_id, day_schedule in class_schedule.items():
            if day_schedule:
                day_counts = [len(slots) for slots in day_schedule.values()]
                if len(day_counts) > 1:
                    variance = np.var(day_counts)
                    total_penalty += PENALTY_DISTRIBUTION_DAYS * variance
        return total_penalty

    def _calculate_gaps_penalty(self, lecturer_schedule):
        """Calculate gaps penalty"""
        total_penalty = 0
        for lecturer_id, day_schedule in lecturer_schedule.items():
            for day, slots in day_schedule.items():
                valid_slots = [s for s in slots if s in self.slot_order_map]
                if len(valid_slots) > 1:
                    sorted_slots = sorted(valid_slots, key=lambda s: self.slot_order_map[s])
                    gaps = sum(self.slot_order_map[sorted_slots[i]] - self.slot_order_map[sorted_slots[i-1]] - 1 
                             for i in range(1, len(sorted_slots)) 
                             if self.slot_order_map[sorted_slots[i]] > self.slot_order_map[sorted_slots[i-1]] + 1)
                    total_penalty += PENALTY_GAPS_IN_SCHEDULE * gaps
        return total_penalty