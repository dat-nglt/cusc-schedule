from collections import defaultdict
from datetime import datetime, timedelta
import random
from typing import Dict, Any

# Import functions
from utils.find_new_valid_slot import find_new_valid_slot
from utils.is_lecturer_semester_busy_on_date_and_slot import is_lecturer_semester_busy_on_date_and_slot
from utils.is_lecturer_weekly_busy_on_day_and_slot import is_lecturer_weekly_busy_on_day_and_slot
from utils.get_weekly_lesson_counts import get_weekly_lesson_counts
from utils.get_date_from_week_day import get_date_from_week_day


def generate_semester_schedule(best_weekly_chromosome: Any, processed_data: Any) -> tuple:
    unassignable_lessons = []
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set()}))
    
    days_of_week_index_map = {
        day: i for i, day in enumerate(processed_data.data.get('days_of_week'))
    }
    
    all_semester_lessons_to_distribute = []
    
    # PHASE 1: Expand weekly timetable into a full semester list
    for gene in best_weekly_chromosome.genes:
        cls_id = gene['class_id']
        semester_id_for_class = gene.get('semester_id')
        
        cls_info = processed_data.class_map.get(cls_id)
        if not cls_info: continue
        program = processed_data.program_map.get(cls_info['program_id'])
        if not program: continue
        program_duration_weeks = program.get('duration', 0)
        
        total_slots_key = (cls_id, gene['subject_id'], gene['lesson_type'], semester_id_for_class)
        total_slots_needed = processed_data.total_semester_slots_needed.get(total_slots_key, 0)
        
        if total_slots_needed == 0 or program_duration_weeks == 0: continue
        
        semester_info = processed_data.semester_map.get(semester_id_for_class, {})
        semester_start_date_str = semester_info.get('start_date')
        if not semester_start_date_str: continue
        semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        weekly_counts = get_weekly_lesson_counts(total_slots_needed, program_duration_weeks)

        for week_num, count in enumerate(weekly_counts):
            for _ in range(count):
                new_lesson = gene.copy()
                day_of_week_eng = new_lesson['day']
                day_index_from_gene = days_of_week_index_map.get(day_of_week_eng)
                
                if day_index_from_gene is None or day_index_from_gene == 6:
                    continue
                
                lesson_date = get_date_from_week_day(week_num, day_index_from_gene, semester_start_date)
                
                new_lesson.update({
                    'week': week_num + 1,
                    'date': lesson_date.strftime('%Y-%m-%d'),
                    'day': lesson_date.strftime('%a'), 
                    'semester_id': semester_id_for_class
                })
                all_semester_lessons_to_distribute.append(new_lesson)
    
    random.shuffle(all_semester_lessons_to_distribute)
    
    # PHASE 2 & 3: Distribute, check, and re-assign
    for lesson in all_semester_lessons_to_distribute:
        date_str = lesson['date']
        slot = lesson['slot_id']
        lecturer = lesson['lecturer_id']
        room = lesson['room_id']
        cls_id = lesson['class_id']
        
        unassign_reason = None
        
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            day_of_week_name = date_obj.strftime('%a')
            
            # Check for date mismatch
            is_clash_date = day_of_week_name.lower() != lesson['day'].lower()
            if is_clash_date:
                unassign_reason = f"Date mismatch: expected {lesson['day']} but got {day_of_week_name}"
            
            # Check for resource clashes with already assigned lessons
            is_clash_resources_local = (
                lecturer in occupied_slots[date_str][slot]['lecturers'] or
                room in occupied_slots[date_str][slot]['rooms']
            )
            if is_clash_resources_local and not unassign_reason:
                if lecturer in occupied_slots[date_str][slot]['lecturers']:
                    unassign_reason = f"Lecturer {lecturer} already occupied at {date_str} slot {slot}"
                else:
                    unassign_reason = f"Room {room} already occupied at {date_str} slot {slot}"
            
            # Check for resource clashes with pre-defined busy slots
            is_clash_resources_global = False
            if is_lecturer_weekly_busy_on_day_and_slot(lecturer, day_of_week_name, slot, processed_data):
                is_clash_resources_global = True
                if not unassign_reason:
                    unassign_reason = f"Lecturer {lecturer} has weekly busy schedule on {day_of_week_name} slot {slot}"
            
            if is_lecturer_semester_busy_on_date_and_slot(lecturer, date_str, slot, processed_data):
                is_clash_resources_global = True
                if not unassign_reason:
                    unassign_reason = f"Lecturer {lecturer} has semester busy schedule on {date_str} slot {slot}"

            is_clash = is_clash_date or is_clash_resources_local or is_clash_resources_global
            
        except (ValueError, IndexError) as e:
            print(f"Lỗi xử lý ngày tháng cho buổi học: {lesson}. Lỗi: {e}")
            is_clash = True
            unassign_reason = f"Date processing error: {str(e)}"
        
        if is_clash:
            new_slot_info = find_new_valid_slot(
                lesson, processed_data, occupied_slots,
                program_duration_weeks, semester_start_date
            )
            
            if new_slot_info:
                new_date, new_slot, new_room, new_lecturer = new_slot_info
                
                reassigned_lesson = lesson.copy()
                reassigned_lesson.update({
                    'slot_id': new_slot,
                    'date': new_date,
                    'room_id': new_room,
                    'lecturer_id': new_lecturer
                })
                
                new_week_num = int((datetime.strptime(new_date, '%Y-%m-%d') - semester_start_date).days / 7)
                if 0 <= new_week_num < len(semester_schedule_by_class[cls_id]):
                    semester_schedule_by_class[cls_id][new_week_num].append(reassigned_lesson)
                    occupied_slots[new_date][new_slot]['lecturers'].add(new_lecturer)
                    occupied_slots[new_date][new_slot]['rooms'].add(new_room)
                else:
                    unassign_reason = f"Week number {new_week_num} out of range (0-{len(semester_schedule_by_class[cls_id])-1})"
                    reassigned_lesson['unassign_reason'] = unassign_reason
                    unassignable_lessons.append(reassigned_lesson)
            else:
                if not unassign_reason:
                    unassign_reason = "No valid slot found for reassignment"
                lesson['unassign_reason'] = unassign_reason
                unassignable_lessons.append(lesson)
        else:
            print(f"___________________{lesson}______________________")
            week_num = int((date_obj - semester_start_date).days / 7)
            if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
                semester_schedule_by_class[cls_id][week_num].append(lesson)
                occupied_slots[date_str][slot]['lecturers'].add(lecturer)
                occupied_slots[date_str][slot]['rooms'].add(room)
            else:
                unassign_reason = f"Week number {week_num} out of range (0-{len(semester_schedule_by_class[cls_id])-1})"
                lesson['unassign_reason'] = unassign_reason
                unassignable_lessons.append(lesson)
    
    return semester_schedule_by_class, unassignable_lessons