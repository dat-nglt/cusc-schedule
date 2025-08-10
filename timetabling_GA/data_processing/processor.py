import math
import copy
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
        
        self.program_semester_map = defaultdict(list)
        for program in data['programs']:
            for semester in program['semesters']:
                self.program_semester_map[program['program_id']].append(semester['semester_id'])
                
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(data['time_slots'])}
        
        # Hàm tính toán tổng số tiết học cho toàn học kỳ đã được sửa
        self.total_semester_slots_needed = self._calculate_total_semester_slots()
        
        # Hàm tạo danh sách tiết học hàng tuần đã được sửa
        self.required_lessons_weekly = self._generate_required_lessons_weekly()

    def _calculate_total_semester_slots(self):
        total_slots = {}
        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = self.program_map.get(program_id)
            if not program:
                continue
            
            # Lặp qua các học kỳ trong dữ liệu đã được lọc
            for semester in program['semesters']:
                for subject_id in semester['subject_ids']:
                    subject = self.subject_map.get(subject_id)
                    if not subject:
                        continue
                    
                    num_theory_slots_semester = math.ceil(subject['theory_hours'] / HOURS_PER_SLOT)
                    if num_theory_slots_semester > 0:
                        total_slots[(cls['class_id'], subject_id, 'theory', semester['semester_id'])] = num_theory_slots_semester
                    
                    num_practice_slots_semester = math.ceil(subject['practice_hours'] / HOURS_PER_SLOT)
                    if num_practice_slots_semester > 0:
                        total_slots[(cls['class_id'], subject_id, 'practice', semester['semester_id'])] = num_practice_slots_semester
        return total_slots

    def _generate_required_lessons_weekly(self):
        weekly_lessons = []
        lesson_id_counter = 0

        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = self.program_map.get(program_id)
            if not program:
                continue
            
            program_duration_weeks = program.get('duration', 0)
            if program_duration_weeks == 0:
                continue

            # Lặp qua các học kỳ trong dữ liệu đã được lọc
            for semester in program['semesters']:
                for subject_id in semester['subject_ids']:
                    total_theory_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject_id, 'theory', semester['semester_id']), 0)
                    total_practice_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject_id, 'practice', semester['semester_id']), 0)
                    
                    if program_duration_weeks > 0:
                        num_weekly_theory_slots = math.ceil(total_theory_slots_semester / program_duration_weeks)
                        num_weekly_practice_slots = math.ceil(total_practice_slots_semester / program_duration_weeks)
                    else:
                        num_weekly_theory_slots = 0
                        num_weekly_practice_slots = 0

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
    
    def filter_for_semester(self, semester_id):
        filtered_data = copy.deepcopy(self.data)
        
        # 1. Lấy thông tin của học kỳ được chọn
        semester_info = next((s for s in self.data['semesters'] if s['semester_id'] == semester_id), None)
        if not semester_info:
            # Nếu không tìm thấy học kỳ, trả về None
            return None
        
        related_subject_ids = semester_info['subject_ids']
        
        # 2. Lọc danh sách các học kỳ, chỉ giữ lại học kỳ được chọn
        filtered_data['semesters'] = [semester_info]
        
        # 3. Lọc danh sách các môn học, chỉ giữ lại các môn thuộc học kỳ này
        filtered_data['subjects'] = [s for s in self.data['subjects'] if s['subject_id'] in related_subject_ids]

        # 4. Lọc các chương trình, chỉ giữ lại các chương trình có học kỳ này
        related_program_info = next((p for p in self.data['programs'] if semester_id in [s['semester_id'] for s in p['semesters']]), None)
        if not related_program_info:
            filtered_data['programs'] = []
        else:
            # Quan trọng: Sửa đổi chương trình để chỉ chứa học kỳ đã lọc
            new_program_info = copy.deepcopy(related_program_info)
            new_program_info['semesters'] = [s for s in related_program_info['semesters'] if s['semester_id'] == semester_id]
            filtered_data['programs'] = [new_program_info]

        # 5. Lọc các lớp học, chỉ giữ lại các lớp thuộc chương trình đã lọc
        related_program_ids = [p['program_id'] for p in filtered_data['programs']]
        filtered_data['classes'] = [c for c in self.data['classes'] if c['program_id'] in related_program_ids]
        
        # 6. Lọc các giảng viên, chỉ giữ lại những người dạy các môn học đã lọc
        related_lecturer_ids = [l['lecturer_id'] for l in self.data['lecturers'] if any(sub in related_subject_ids for sub in l['subjects'])]
        filtered_data['lecturers'] = [l for l in self.data['lecturers'] if l['lecturer_id'] in related_lecturer_ids]
        
        # 7. Tạo một DataProcessor mới với dữ liệu đã được lọc
        return DataProcessor(filtered_data)
    
    def get_lessons_for_class_weekly(self, class_id):
        return [lesson for lesson in self.required_lessons_weekly if lesson.get('class_id') == class_id]

    def get_lecturers_for_subject(self, subject_id):
        return [lecturer['lecturer_id'] for lecturer in self.data['lecturers'] if subject_id in lecturer['subjects']]

    def get_rooms_for_type_and_capacity(self, lesson_type, class_size):
        suitable_rooms = []
        for room in self.data['rooms']:
            if room['type'] == lesson_type and room['capacity'] >= class_size:
                suitable_rooms.append(room['room_id'])
        return suitable_rooms