from collections import defaultdict


def format_semester_schedule(semester_schedule, processed_data):
    output_lines = []
    # Sort semester_schedule by class_id to ensure consistent output order
    sorted_class_ids = sorted(semester_schedule.keys())
    for class_id in sorted_class_ids:
        weekly_schedules = semester_schedule[class_id]
        cls_info = processed_data.class_map.get(class_id)
        program_id = cls_info.get('program_id') if cls_info else None
        output_lines.append(f"\n===== SEMESTER SCHEDULE FOR CLASS: {class_id} ({processed_data.program_map.get(program_id, {}).get('program_name', program_id) if program_id else ''}) =====")
        if not weekly_schedules:
            output_lines.append("   (No schedule data found for this class.)")
            continue
        for week_idx, week_lessons in enumerate(weekly_schedules):
            if not week_lessons:
                continue
            output_lines.append(f"\n    --- Week {week_idx + 1} ---")
            lessons_by_date = defaultdict(list)
            for lesson in week_lessons:
                lessons_by_date[lesson['date']].append(lesson)
            sorted_dates = sorted(lessons_by_date.keys())
            for lesson_date in sorted_dates:
                # Kiểm tra và in ra các buổi học bị lỗi
                lessons_with_error = [g for g in lessons_by_date[lesson_date] if g.get('slot_id') is None]
                if lessons_with_error:
                    output_lines.append(f"     ❗❗ Lessons with missing slot_id on {lesson_date}:")
                    for lesson in lessons_with_error:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        output_lines.append(f"       - Subject: {subject_name} ({lesson['lesson_type']})")

                output_lines.append(f"      Date: {lesson_date}")
                
                # Sắp xếp các buổi học có slot_id hợp lệ
                def get_slot_order_key(lesson):
                    slot_id = lesson.get('slot_id')
                    if slot_id is not None and slot_id in processed_data.slot_order_map:
                        return processed_data.slot_order_map[slot_id]
                    return float('inf')  # Đẩy các buổi học không có slot_id xuống cuối danh sách

                sorted_daily_lessons = sorted(lessons_by_date[lesson_date], key=get_slot_order_key)

                for lesson in sorted_daily_lessons:
                    # Bỏ qua các buổi học có slot_id là None
                    if lesson.get('slot_id') is None:
                        print(f"Đây: {lesson}")
                        break
                        continue
                        
                    subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                    lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                    output_lines.append(
                        f"        - Day: {lesson['day']}, Slot: {lesson['slot_id']}, Subject: {subject_name} ({lesson['lesson_type']}), "
                        f"Room: {lesson['room_id']}, Lecturer: {lecturer_name}"
                    )
    return "\n".join(output_lines)
