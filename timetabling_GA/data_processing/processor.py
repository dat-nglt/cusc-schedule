# timetable_ga/data_processing/processor.py
import math
from config import HOURS_PER_SLOT

class DataProcessor:
    def __init__(self, data):
        self.data = data
        self.slot_order_map = {slot['slot_id']: i for i, slot in enumerate(data['time_slots'])}
        
        # Lưu trữ tổng số slot cần cho mỗi môn trong cả học kỳ
        self.total_semester_slots_needed = self._calculate_total_semester_slots()
        
        # required_lessons giờ đây sẽ là số tiết cần xếp cho MỘT TUẦN ĐẠI DIỆN
        self.required_lessons_weekly = self._generate_weekly_required_lessons()

        self.lecturer_map = {lecturer['lecturer_id']: lecturer for lecturer in data['lecturers']}
        self.room_map = {room['room_id']: room for room in data['rooms']}
        self.class_map = {cls['class_id']: cls for cls in data['classes']}
        self.subject_map = {}
        for program in data['programs']:
            for subject in program['subjects']:
                self.subject_map[subject['subject_id']] = subject
        # Thêm thông tin program_duration vào class_map để dễ truy cập
        for cls_id, cls_data in self.class_map.items():
            program = next((p for p in self.data['programs'] if p['program_id'] == cls_data['program_id']), None)
            if program:
                self.class_map[cls_id]['program_duration_weeks'] = program.get('duration', 15) # Mặc định 15 tuần nếu không có

    def _calculate_total_semester_slots(self):
        total_slots = {} # { (class_id, subject_id, type): count }
        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = next((p for p in self.data['programs'] if p['program_id'] == program_id), None)
            if not program:
                continue
            for subject in program['subjects']:
                num_theory_slots_semester = math.ceil(subject['theory_hours'] / HOURS_PER_SLOT)
                if num_theory_slots_semester > 0:
                    total_slots[(cls['class_id'], subject['subject_id'], 'theory')] = num_theory_slots_semester
                
                num_practice_slots_semester = math.ceil(subject['practice_hours'] / HOURS_PER_SLOT)
                if num_practice_slots_semester > 0:
                    total_slots[(cls['class_id'], subject['subject_id'], 'practice')] = num_practice_slots_semester
        return total_slots

    def _generate_weekly_required_lessons(self):
        """
        Generates a flat list of lesson blocks needed for ONE representative WEEK.
        """
        weekly_lessons = []
        lesson_id_counter = 0 # Đảm bảo lesson_id là duy nhất cho các tiết trong tuần
        
        for cls in self.data['classes']:
            program_id = cls['program_id']
            program = next((p for p in self.data['programs'] if p['program_id'] == program_id), None)
            if not program:
                continue
            
            program_duration_weeks = program.get('duration', 1) # Lấy số tuần, mặc định là 1 nếu không có để tránh chia cho 0
            if program_duration_weeks == 0: program_duration_weeks = 1 # Đảm bảo không chia cho 0

            for subject in program['subjects']:
                # Số slot lý thuyết mỗi tuần
                total_theory_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject['subject_id'], 'theory'), 0)
                num_weekly_theory_slots = math.ceil(total_theory_slots_semester / program_duration_weeks)

                for _ in range(num_weekly_theory_slots):
                    weekly_lessons.append({
                        "lesson_id": f"L{lesson_id_counter}", # ID cho tiết học cụ thể trong tuần mẫu
                        "class_id": cls['class_id'],
                        "subject_id": subject['subject_id'],
                        "type": "theory",
                        "program_id": program_id,
                        "group_id": f"{cls['class_id']}_{subject['subject_id']}_theory"
                    })
                    lesson_id_counter += 1

                # Số slot thực hành mỗi tuần
                total_practice_slots_semester = self.total_semester_slots_needed.get((cls['class_id'], subject['subject_id'], 'practice'), 0)
                num_weekly_practice_slots = math.ceil(total_practice_slots_semester / program_duration_weeks)
                
                for _ in range(num_weekly_practice_slots):
                    weekly_lessons.append({
                        "lesson_id": f"L{lesson_id_counter}",
                        "class_id": cls['class_id'],
                        "subject_id": subject['subject_id'],
                        "type": "practice",
                        "program_id": program_id,
                        "group_id": f"{cls['class_id']}_{subject['subject_id']}_practice"
                    })
                    lesson_id_counter += 1
        return weekly_lessons

    # Các hàm get_lecturers_for_subject, get_rooms_for_type_and_capacity giữ nguyên
    def get_lecturers_for_subject(self, subject_id):
        return [lecturer['lecturer_id'] for lecturer in self.data['lecturers'] if subject_id in lecturer['subjects']]

    def get_rooms_for_type_and_capacity(self, lesson_type, class_size):
        suitable_rooms = []
        for room in self.data['rooms']:
            if room['type'] == lesson_type and room['capacity'] >= class_size:
                suitable_rooms.append(room['room_id'])
        return suitable_rooms