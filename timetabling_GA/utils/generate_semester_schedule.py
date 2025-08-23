from collections import defaultdict
from datetime import datetime, timedelta
import random

from utils.find_new_valid_slot import find_new_valid_slot
from utils.is_lecturer_semester_busy_on_date_and_slot import is_lecturer_semester_busy_on_date_and_slot
from utils.is_lecturer_weekly_busy_on_day_and_slot import is_lecturer_weekly_busy_on_day_and_slot
from utils.get_weekly_lesson_counts import get_weekly_lesson_counts


def generate_semester_schedule(best_weekly_chromosome, processed_data):
    unassignable_lessons = []
    semester_schedule_by_class = defaultdict(lambda: [[] for _ in range(16)])

    # Các map tiện ích
    days_of_week_index_map = {
        day: i for i, day in enumerate(processed_data.data.get('days_of_week'))
    }
    semester_info_map = {
        sem['semester_id']: sem for sem in processed_data.data.get('semesters', [])
    }

    weekday_map = {
        0: "Mon", 1: "Tue", 2: "Wed",
        3: "Thu", 4: "Fri", 5: "Sat", 6: "Sun"
    }

    # =========================
    # GIAI ĐOẠN 1: Tạo danh sách tiết học cho cả học kỳ
    # =========================
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

        if total_slots_needed == 0 or program_duration_weeks == 0:
            continue

        # Ngày bắt đầu học kỳ
        semester_info = semester_info_map.get(semester_id_for_class, {})
        semester_start_date_str = semester_info.get('start_date')
        if not semester_start_date_str:
            continue

        semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')

        # Số tiết học mỗi tuần
        weekly_counts = get_weekly_lesson_counts(total_slots_needed, program_duration_weeks)

        # Mở rộng thành danh sách học kỳ
        for week_num, count in enumerate(weekly_counts):
            for _ in range(count):
                new_lesson = gene.copy()
                day_of_week_eng = new_lesson['day']
                day_offset_from_gene = days_of_week_index_map.get(day_of_week_eng)

                if day_offset_from_gene is None:
                    continue
                if day_of_week_eng.lower() in ['chủ nhật', 'sun', 'sunday']:
                    continue  # bỏ qua CN

                lesson_date = semester_start_date + timedelta(weeks=week_num, days=day_offset_from_gene)

                new_lesson.update({
                    'week': week_num + 1,
                    'date': lesson_date.strftime('%Y-%m-%d'),
                    'day': weekday_map.get(lesson_date.weekday()),
                    'semester_id': semester_id_for_class
                })
                all_semester_lessons_to_distribute.append(new_lesson)

    random.shuffle(all_semester_lessons_to_distribute)

    # =========================
    # GIAI ĐOẠN 2 & 3: Kiểm tra xung đột, phân phối và sắp xếp lại
    # =========================
    occupied_slots = defaultdict(lambda: defaultdict(lambda: {'lecturers': set(), 'rooms': set()}))

    for lesson in all_semester_lessons_to_distribute:
        date = lesson['date']
        slot = lesson['slot_id']
        lecturer = lesson['lecturer_id']
        room = lesson['room_id']
        cls_id = lesson['class_id']

        try:
            weekday_index = datetime.strptime(date, '%Y-%m-%d').weekday()
            day_of_week = processed_data.data['days_of_week'][weekday_index]
        except IndexError:
            unassignable_lessons.append(lesson)
            continue

        if day_of_week.lower() in ['chủ nhật', 'sun', 'sunday']:
            unassignable_lessons.append(lesson)
            continue

        # Kiểm tra xung đột
        is_clash = (
            lecturer in occupied_slots[date][slot]['lecturers'] or
            room in occupied_slots[date][slot]['rooms'] or
            is_lecturer_weekly_busy_on_day_and_slot(lecturer, day_of_week, slot, processed_data) or
            is_lecturer_semester_busy_on_date_and_slot(lecturer, date, slot, processed_data)
        )

        if is_clash:
            # Sắp xếp lại
            new_slot_info = find_new_valid_slot(
                lesson, processed_data, occupied_slots,
                program_duration_weeks, semester_start_date
            )
            if new_slot_info:
                new_date, new_slot, new_room, new_lecturer = new_slot_info

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
            week_num = lesson['week'] - 1
            if 0 <= week_num < len(semester_schedule_by_class[cls_id]):
                semester_schedule_by_class[cls_id][week_num].append(lesson)
                occupied_slots[date][slot]['lecturers'].add(lecturer)
                occupied_slots[date][slot]['rooms'].add(room)

    return semester_schedule_by_class, unassignable_lessons
