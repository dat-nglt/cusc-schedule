from collections import defaultdict
from datetime import datetime, timedelta
from pprint import pprint
import random

from utils.find_new_valid_slot import find_new_valid_slot
from utils.is_lecturer_semester_busy_on_date_and_slot import is_lecturer_semester_busy_on_date_and_slot
from utils.is_lecturer_weekly_busy_on_day_and_slot import is_lecturer_weekly_busy_on_day_and_slot
from utils.get_weekly_lesson_counts import get_weekly_lesson_counts

def generate_semester_schedule(best_weekly_chromosome, processed_data):
    unassignable_lessons = []
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    
    # Tạo các map tiện ích để truy cập dữ liệu nhanh hơn
    days_of_week_index_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week'))}
    semester_info_map = {sem['semester_id']: sem for sem in processed_data.data.get('semesters', [])}
    
    weekday_map = {
        0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu",
        4: "Fri", 5: "Sat", 6: "Sun"
    }

    # GIAI ĐOẠN 1: TẠO DANH SÁCH TIẾT HỌC CHÍNH XÁC CHO CẢ HỌC KỲ
    all_semester_lessons_to_distribute = []
   
    for gene in best_weekly_chromosome.genes:
        cls_id = gene['class_id']
        subject_id = gene['subject_id']
        lesson_type = gene['lesson_type']
        
        cls_info = processed_data.class_map.get(cls_id)
        if not cls_info:
            continue
        
        program = processed_data.program_map.get(cls_info['program_id'])
        if not program:
            continue
        
        program_duration_weeks = program.get('duration', 0)
        semester_id_for_class = gene.get('semester_id')
        
        total_slots_key = (cls_id, subject_id, lesson_type, semester_id_for_class)
        total_slots_needed = processed_data.total_semester_slots_needed.get(total_slots_key, 0)
        
        print(f"DEBUG {total_slots_needed}  -  {program_duration_weeks}")
        if total_slots_needed == 0 or program_duration_weeks == 0:
            continue

        # Lấy thông tin về ngày bắt đầu học kỳ
        semester_info = semester_info_map.get(semester_id_for_class, {})
        semester_start_date_str = semester_info.get('start_date')
        if not semester_start_date_str:
            continue
        semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        
        # Sử dụng hàm phụ trợ để lấy số tiết học tuần chính xác
        weekly_counts = get_weekly_lesson_counts(total_slots_needed, program_duration_weeks)
        
        pprint(f"weekly_counts {weekly_counts}")
        
        # Mở rộng lịch trình tuần thành lịch trình học kỳ dựa trên số tiết đã tính
        for week_num, count in enumerate(weekly_counts):
            for _ in range(count):
                # Tạo một bản sao của gen để tránh thay đổi dữ liệu gốc
                new_lesson = gene.copy()
                day_of_week_eng = new_lesson['day']
                day_offset_from_gene = days_of_week_index_map.get(day_of_week_eng)
                
                if day_offset_from_gene is None:
                    continue
                
                lesson_date = semester_start_date + timedelta(weeks=week_num, days=day_offset_from_gene)

                new_lesson.update({
                    'week': week_num + 1,
                    'date': lesson_date.strftime('%Y-%m-%d'),
                    'day': weekday_map.get(lesson_date.weekday()),
                    'semester_id': semester_id_for_class
                })
                all_semester_lessons_to_distribute.append(new_lesson)
    
    random.shuffle(all_semester_lessons_to_distribute)

    # GIAI ĐOẠN 2 & 3: KIỂM TRA, PHÂN PHỐI VÀ SẮP XẾP LẠI (được gộp lại)
    occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set()}))
    
    for lesson in all_semester_lessons_to_distribute:
        date = lesson['date']
        slot = lesson['slot_id']
        lecturer = lesson['lecturer_id']
        room = lesson['room_id']
        cls_id = lesson['class_id']
        
        try:
            day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
        except IndexError:
            unassignable_lessons.append(lesson)
            continue

        is_clash = (
            lecturer in occupied_slots[date][slot]['lecturers'] or
            room in occupied_slots[date][slot]['rooms'] or
            is_lecturer_weekly_busy_on_day_and_slot(lecturer, day_of_week, slot, processed_data) or
            is_lecturer_semester_busy_on_date_and_slot(lecturer, date, slot, processed_data)
        )

        if is_clash:
            # SẮP XẾP LẠI: Gọi hàm tìm kiếm một vị trí mới
            new_slot_info = find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date)            
            if new_slot_info:
                new_date, new_slot, new_room, new_lecturer = new_slot_info
                
                # Cập nhật thông tin buổi học và gán vào lịch trình
                lesson.update({
                    'slot_id': new_slot,
                    'date': new_date,
                    'room_id': new_room,
                    'lecturer_id': new_lecturer
                })
                
                new_week_num = int((datetime.strptime(new_date, '%Y-%m-%d') - semester_start_date).days / 7)
                if 0 <= new_week_num < len(semester_schedule_by_class[cls_id]):
                    semester_schedule_by_class[cls_id][new_week_num].append(lesson)
                    occupied_slots[new_date][new_slot]['lecturers'].add(new_lecturer)
                    occupied_slots[new_date][new_slot]['rooms'].add(new_room)
                else:
                    unassignable_lessons.append(lesson)
            else:
                unassignable_lessons.append(lesson)
        else:
            # GÁN BÌNH THƯỜNG
            week_num = lesson['week'] - 1
            if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
                semester_schedule_by_class[cls_id][week_num].append(lesson)
                occupied_slots[date][slot]['lecturers'].add(lecturer)
                occupied_slots[date][slot]['rooms'].add(room)
    
    # pprint(f"semester_schedule_by_class {semester_schedule_by_clas    s}")
    
    return semester_schedule_by_class, unassignable_lessons

# def generate_semester_schedule(best_weekly_chromosome, processed_data):
#     unassignable_lessons = []
#     # Khởi tạo lịch trình học kỳ theo lớp với 16 tuần
#     semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])
    
#     # Ánh xạ class_id tới các buổi học hàng tuần của nó
#     weekly_lessons_map = defaultdict(list)
#     for gene in best_weekly_chromosome.genes:
#         weekly_lessons_map[gene['class_id']].append(gene)
    
#     # Danh sách chứa tất cả các buổi học của toàn bộ học kỳ trước khi phân phối
#     all_semester_lessons_to_distribute = []
    
#     # Tạo các map tiện ích để truy cập dữ liệu nhanh hơn
#     days_of_week_index_map = {day: i for i, day in enumerate(processed_data.data.get('days_of_week'))}
#     semester_info_map = {sem['semester_id']: sem for sem in processed_data.data.get('semesters', [])}
#     subject_info_map = {sub['subject_id']: sub for sub in processed_data.data.get('subjects', [])}

#     # Cần một map để ánh xạ chỉ số ngày (0-6) sang tên ngày
#     weekday_map = {
#         0: "Mon", 1: "Tue", 2: "Wed", 3: "Thu",
#         4: "Fri", 5: "Sat", 6: "Sun"
#     }
    
#     # Tạo một dictionary để lưu thông tin chương trình và học kỳ cho mỗi lớp học
#     class_program_info = {}
    
#     # --- GIAI ĐOẠN 1: MỞ RỘNG LỊCH TRÌNH TUẦN THÀNH LỊCH TRÌNH HỌC KỲ ---
#     for cls_id, lessons_for_this_class_weekly in weekly_lessons_map.items():
#         cls_info = processed_data.class_map.get(cls_id)
#         if not cls_info:
#             continue
        
#         program = processed_data.program_map.get(cls_info['program_id'])
#         if not program:
#             continue

#         program_duration_weeks = program.get('duration', 0)
        
#         # Tìm semester_id của lớp học này
#         semester_id_for_class = next((s['semester_id'] for s in program['semesters'] if any(cls_id == c['class_id'] for c in processed_data.data['classes'] if c['program_id'] == program['program_id'])), None)
#         if not semester_id_for_class:
#             continue

#         semester_info = semester_info_map.get(semester_id_for_class, {})
#         semester_start_date_str = semester_info.get('start_date')
        
#         if not semester_start_date_str:
#             continue
            
#         semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        
#         # Lưu thông tin học kỳ của lớp vào dictionary
#         class_program_info[cls_id] = {
#             'program_duration_weeks': program_duration_weeks,
#             'semester_start_date': semester_start_date,
#             'semester_id': semester_id_for_class
#         }
        
#         full_semester_lessons_for_class = []
#         # Nhân bản các buổi học hàng tuần để tạo ra lịch trình cho cả học kỳ
#         for week_num in range(program_duration_weeks):
#             for lesson_template in lessons_for_this_class_weekly:
#                 new_lesson = lesson_template.copy()
#                 day_of_week_eng = new_lesson['day']
                
#                 # Lấy chỉ số ngày tương ứng từ gen
#                 day_offset_from_gene = days_of_week_index_map.get(day_of_week_eng, None)
                
#                 if day_offset_from_gene is None:
#                     continue

#                 # Tính ngày cụ thể của buổi học trong học kỳ dựa trên day_offset từ gen
#                 lesson_date = semester_start_date + timedelta(weeks=week_num, days=day_offset_from_gene)

#                 # 💡 SỬA LỖI: Cập nhật trường 'day' để khớp với ngày thực tế
#                 new_lesson['day'] = weekday_map.get(lesson_date.weekday())

#                 new_lesson['week'] = week_num + 1
#                 new_lesson['date'] = lesson_date.strftime('%Y-%m-%d')
#                 new_lesson['semester_id'] = semester_id_for_class

#                 subject_id = new_lesson['subject_id']
#                 subject_info = subject_info_map.get(subject_id)
#                 if subject_info:
#                     lesson_type = 'practice' if subject_info.get('practice_hours', 0) > 0 else 'theory'
#                     new_lesson['lesson_type'] = lesson_type
                
#                 full_semester_lessons_for_class.append(new_lesson)
        
#         random.shuffle(full_semester_lessons_for_class)
#         all_semester_lessons_to_distribute.extend(full_semester_lessons_for_class)
        
#         # In ra gọn gàng để kiểm tra
#         data_sorted = sorted(full_semester_lessons_for_class, key=lambda x: datetime.strptime(x['date'], "%Y-%m-%d"))
#         print("\n--- LỊCH TRÌNH HỌC KỲ CHO LỚP", cls_id, "---")
#         # for d in data_sorted:
#         #     print(f"{d} \n")
#         # break
    
#     # Dictionary để theo dõi các slot đã bị chiếm dụng (theo ngày, slot, giảng viên/phòng)
#     occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set()}))
#     # Danh sách các buổi học bị xung đột cần sắp xếp lại
#     lessons_needing_reassignment = []

#     # --- GIAI ĐOẠN 2: KIỂM TRA VÀ PHÂN PHỐI CÁC BUỔI HỌC BAN ĐẦU ---
#     for lesson in all_semester_lessons_to_distribute:
#         date = lesson['date']
#         slot = lesson['slot_id']
#         lecturer = lesson['lecturer_id']
#         room = lesson['room_id']
#         cls_id = lesson['class_id']
#         week_num = lesson['week'] - 1
#         # day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
#         try:
#             day_of_week = processed_data.data['days_of_week'][datetime.strptime(date, '%Y-%m-%d').weekday()]
#         except IndexError:
#             # Xử lý trường hợp chỉ số không tồn tại (ngày Chủ Nhật)
#             lesson['clash_reason'] = "Ngày không hợp lệ (Chủ Nhật)"
#             lessons_needing_reassignment.append(lesson)
#             continue
#         # --- LOGIC KIỂM TRA RÀNG BUỘC CỨNG ---
#         is_clash = (
#             lecturer in occupied_slots[date][slot]['lecturers'] or
#             room in occupied_slots[date][slot]['rooms'] or
#             is_lecturer_weekly_busy_on_day_and_slot(lecturer, day_of_week, slot, processed_data) or
#             is_lecturer_semester_busy_on_date_and_slot(lecturer, date, slot, processed_data)
#         )

#         if is_clash:
#             # Nếu có xung đột, đưa buổi học vào danh sách cần sắp xếp lại
#             lessons_needing_reassignment.append(lesson)
#         else:
#             # Nếu không có xung đột, gán buổi học vào lịch trình
#             if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
#                 semester_schedule_by_class[cls_id][week_num].append(lesson)
#                 # Cập nhật các tài nguyên đã chiếm dụng
#                 occupied_slots[date][slot]['lecturers'].add(lecturer)
#                 occupied_slots[date][slot]['rooms'].add(room)

#     # --- GIAI ĐOẠN 3: SẮP XẾP LẠI CÁC BUỔI HỌC BỊ XUNG ĐỘT ---
#     for lesson in lessons_needing_reassignment:
#         cls_info = processed_data.class_map.get(lesson['class_id'])
#         if not cls_info or cls_info['class_id'] not in class_program_info:
#             continue
            
#         info = class_program_info[cls_info['class_id']]
#         program_duration_weeks = info['program_duration_weeks']
#         semester_start_date = info['semester_start_date']
        
#         # Gọi hàm tìm kiếm một vị trí mới
#         new_slot_info = find_new_valid_slot(lesson, processed_data, occupied_slots, program_duration_weeks, semester_start_date)
        
#         if new_slot_info:
#             # Nếu tìm thấy vị trí mới, cập nhật thông tin buổi học
#             new_date, new_slot, new_room, new_lecturer = new_slot_info
            
#             lesson['slot_id'] = new_slot
#             lesson['date'] = new_date
#             lesson['room_id'] = new_room
#             lesson['lecturer_id'] = new_lecturer
            
#             # Tính số tuần mới của buổi học
#             new_week_num = int((datetime.strptime(new_date, '%Y-%m-%d') - semester_start_date).days / 7)
            
#             # Gán buổi học đã sửa vào lịch trình và cập nhật occupied_slots
#             semester_schedule_by_class[lesson['class_id']][new_week_num].append(lesson)
#             occupied_slots[new_date][new_slot]['lecturers'].add(new_lecturer)
#             occupied_slots[new_date][new_slot]['rooms'].add(new_room)
#         else:
#             # Nếu không tìm thấy, thêm buổi học vào danh sách không thể gán
#             unassignable_lessons.append(lesson)
            
#     pprint(semester_schedule_by_class)
#     return semester_schedule_by_class, unassignable_lessons
