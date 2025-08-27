from collections import defaultdict
from datetime import datetime, timedelta
import random
from typing import Dict, Any, List

# Import functions
from utils.find_new_valid_slot import find_new_valid_slot
from utils.is_lecturer_semester_busy_on_date_and_slot import is_lecturer_semester_busy_on_date_and_slot
from utils.is_lecturer_weekly_busy_on_day_and_slot import is_lecturer_weekly_busy_on_day_and_slot
from utils.get_weekly_lesson_counts import get_weekly_lesson_counts
from utils.get_date_from_week_day import get_date_from_week_day
from utils.check_hard_constraints import check_hard_constraints

def generate_semester_schedule(best_weekly_chromosome: Any, processed_data: Any) -> tuple:
    unassignable_lessons = []
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    
    # SỬA LỖI: Cập nhật defaultdict để bao gồm khóa 'classes'
    occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set(), 'classes': set()}))
    
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
        
        try:
            semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        except ValueError:
            print(f"Lỗi: Định dạng ngày bắt đầu học kỳ '{semester_start_date_str}' không hợp lệ.")
            continue
        
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
        
        is_clash = False
        
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            day_of_week_name = date_obj.strftime('%a')
            
            semester_info = processed_data.semester_map.get(lesson['semester_id'], {})
            semester_start_date = datetime.strptime(semester_info['start_date'], '%Y-%m-%d')
            
            # Kiểm tra nếu ngày rơi vào trước khai giảng
            if date_obj < semester_start_date:
                is_clash = True
            
            # SỬA LỖI: Sử dụng hàm check_hard_constraints để kiểm tra tất cả các ràng buộc
            if not is_clash:
                if not check_hard_constraints(date_str, day_of_week_name, slot, room, lecturer, cls_id, occupied_slots, processed_data):
                    is_clash = True
            
            if is_clash:
                print(f"❌ Xung đột: Lớp {cls_id}, Môn {lesson['subject_id']}. Tìm vị trí mới...")
                
                program_duration_weeks = processed_data.program_map.get(processed_data.class_map.get(cls_id)['program_id'])['duration']
                new_slot_info = find_new_valid_slot(
                    lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date
                )
                
                if new_slot_info:
                    new_date, new_slot, new_room, new_lecturer = new_slot_info
                    
                    reassigned_lesson = lesson.copy()
                    reassigned_lesson.update({
                        'date': new_date,
                        'slot_id': new_slot,
                        'room_id': new_room,
                        'lecturer_id': new_lecturer,
                        'week': int((datetime.strptime(new_date, '%Y-%m-%d') - semester_start_date).days / 7) + 1,
                        'is_reassigned': True
                    })
                    
                    semester_schedule_by_class[cls_id][reassigned_lesson['week'] - 1].append(reassigned_lesson)
                    
                    # CẬP NHẬT occupied_slots CHO VỊ TRÍ MỚI - Đã bao gồm 'classes'
                    occupied_slots[new_date][new_slot]['lecturers'].add(new_lecturer)
                    occupied_slots[new_date][new_slot]['rooms'].add(new_room)
                    occupied_slots[new_date][new_slot]['classes'].add(cls_id)
                    
                else:
                    print(f"❌ Không tìm thấy vị trí mới cho lớp {cls_id}, môn {lesson['subject_id']}. Buổi học không thể xếp lịch.")
                    unassignable_lessons.append(lesson)
                    
            else:
                week_num = int((date_obj - semester_start_date).days / 7)
                if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
                    semester_schedule_by_class[cls_id][week_num].append(lesson)
                    
                    # CẬP NHẬT occupied_slots CHO VỊ TRÍ GỐC - Đã bao gồm 'classes'
                    occupied_slots[date_str][slot]['lecturers'].add(lecturer)
                    occupied_slots[date_str][slot]['rooms'].add(room)
                    occupied_slots[date_str][slot]['classes'].add(cls_id)
                else:
                    unassignable_lessons.append(lesson)
        
        except Exception as e:
            print(f"Lỗi xử lý buổi học: {e}")
            unassignable_lessons.append(lesson)
            continue
            
    return semester_schedule_by_class, unassignable_lessons