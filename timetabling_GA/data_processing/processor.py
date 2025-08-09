# timetable_ga/data_processing/processor.py
import math
from collections import defaultdict
from config import HOURS_PER_SLOT

class DataProcessor:
    """
    Xử lý dữ liệu thô từ file JSON để tạo ra các cấu trúc dữ liệu 
    được tối ưu hóa cho thuật toán di truyền.
    """
    def __init__(self, data):
        self.data = data
        self.class_map = {cls['class_id']: cls for cls in data['classes']}
        self.program_map = {prog['program_id']: prog for prog in data['programs']}
        self.subject_map = {subj['subject_id']: subj for subj in data['subjects']}
        self.lecturer_map = {lect['lecturer_id']: lect for lect in data['lecturers']}
        self.room_map = {room['room_id']: room for room in data['rooms']}
        self.semester_map = {sem['semester_id']: sem for sem in data.get('semesters', [])}
        
        # Ánh xạ chương trình học sang danh sách học kỳ
        self.program_semester_map = defaultdict(list)
        for program in data['programs']:
            for semester in program['semesters']:
                self.program_semester_map[program['program_id']].append(semester['semester_id'])
                
        # Ánh xạ thứ tự các slot thời gian
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(data['time_slots'])}
        
        # Sắp xếp lại thứ tự gọi các hàm để đảm bảo tính toán chính xác
        self.total_semester_slots_needed = self._calculate_total_semester_slots()
        self.required_lessons_weekly = self._generate_required_lessons_weekly()

    def _calculate_total_semester_slots(self):
        """
        Tính tổng số tiết học (slot) lý thuyết và thực hành cần thiết cho 
        mỗi môn học trong một học kỳ, dựa trên số giờ học và thời lượng slot.
        """
        total_slots = {}  # { (class_id, subject_id, lesson_type, semester_id): count }
        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = next((p for p in self.data['programs'] if p['program_id'] == program_id), None)
            if not program:
                continue
            
            for semester in program['semesters']:
                for subject_id in semester['subject_ids']:
                    subject = self.subject_map.get(subject_id)
                    if not subject:
                        continue

                    # Tính số slot lý thuyết
                    num_theory_slots_semester = math.ceil(subject['theory_hours'] / HOURS_PER_SLOT)
                    if num_theory_slots_semester > 0:
                        total_slots[(cls['class_id'], subject_id, 'theory', semester['semester_id'])] = num_theory_slots_semester
                    
                    # Tính số slot thực hành
                    num_practice_slots_semester = math.ceil(subject['practice_hours'] / HOURS_PER_SLOT)
                    if num_practice_slots_semester > 0:
                        total_slots[(cls['class_id'], subject_id, 'practice', semester['semester_id'])] = num_practice_slots_semester
        return total_slots

    def _generate_required_lessons_weekly(self):
        """
        Tạo danh sách các tiết học cần xếp cho MỘT TUẦN ĐẠI DIỆN,
        dựa trên tổng số slot học kỳ và thời lượng học kỳ.
        """
        weekly_lessons = []
        lesson_id_counter = 0

        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = next((p for p in self.data['programs'] if p['program_id'] == program_id), None)
            if not program:
                continue

            for semester in program['semesters']:
                for subject_id in semester['subject_ids']:
                    # Lấy số slot lý thuyết mỗi tuần
                    total_theory_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject_id, 'theory', semester['semester_id']), 0)
                    semester_duration_weeks = self.semester_map.get(semester['semester_id'], {}).get('duration_weeks', 15)
                    if semester_duration_weeks == 0: semester_duration_weeks = 1
                    num_weekly_theory_slots = math.ceil(total_theory_slots_semester / semester_duration_weeks)

                    for _ in range(num_weekly_theory_slots):
                        weekly_lessons.append({
                            "lesson_id": f"L{lesson_id_counter}",
                            "class_id": cls['class_id'],
                            "subject_id": subject_id,
                            "lesson_type": "theory",
                            "program_id": program_id,
                            "semester_id": semester['semester_id'],
                            "group_id": f"{cls['class_id']}_{subject_id}_theory_{semester['semester_id']}"
                        })
                        lesson_id_counter += 1

                    # Lấy số slot thực hành mỗi tuần
                    total_practice_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject_id, 'practice', semester['semester_id']), 0)
                    semester_duration_weeks = self.semester_map.get(semester['semester_id'], {}).get('duration_weeks', 15)
                    if semester_duration_weeks == 0: semester_duration_weeks = 1
                    num_weekly_practice_slots = math.ceil(total_practice_slots_semester / semester_duration_weeks)

                    for _ in range(num_weekly_practice_slots):
                        weekly_lessons.append({
                            "lesson_id": f"L{lesson_id_counter}",
                            "class_id": cls['class_id'],
                            "subject_id": subject_id,
                            "lesson_type": "practice",
                            "program_id": program_id,
                            "semester_id": semester['semester_id'],
                            "group_id": f"{cls['class_id']}_{subject_id}_practice_{semester['semester_id']}"
                        })
                        lesson_id_counter += 1
        return weekly_lessons
        
    ## Phương thức bị thiếu đã được bổ sung ##
    def get_lessons_for_class_weekly(self, class_id):
        """
        Lọc và trả về danh sách các tiết học hàng tuần của một lớp học cụ thể.
        """
        return [lesson for lesson in self.required_lessons_weekly if lesson.get('class_id') == class_id]

    def get_lecturers_for_subject(self, subject_id):
        """
        Trả về danh sách các ID giảng viên có thể dạy một môn học cụ thể.
        """
        return [lecturer['lecturer_id'] for lecturer in self.data['lecturers'] if subject_id in lecturer['subjects']]

    def get_rooms_for_type_and_capacity(self, lesson_type, class_size):
        """
        Trả về danh sách các ID phòng phù hợp với loại tiết học và sức chứa.
        """
        suitable_rooms = []
        for room in self.data['rooms']:
            if room['type'] == lesson_type and room['capacity'] >= class_size:
                suitable_rooms.append(room['room_id'])
        return suitable_rooms