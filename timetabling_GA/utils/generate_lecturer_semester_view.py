from collections import defaultdict


def generate_lecturer_semester_view(semester_schedule_by_class, processed_data):
    """
    Tạo ra một cấu trúc dữ liệu lịch dạy cho từng giảng viên trong cả học kỳ.
    """
    lecturer_view = defaultdict(lambda: defaultdict(list))
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            for lesson in lessons_in_week:
                lecturer_id = lesson.get('lecturer_id')
                if lecturer_id and lecturer_id != "UNASSIGNED_LECTURER":
                    week_num = week_idx + 1
                    lesson_info_for_lecturer = {
                        'day': lesson['day'],
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'room_id': lesson['room_id'],
                    }
                    lecturer_view[lecturer_id][week_num].append(lesson_info_for_lecturer)
    for lecturer_id in lecturer_view:
        for week_num in lecturer_view[lecturer_id]:
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                lecturer_view[lecturer_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
    return lecturer_view