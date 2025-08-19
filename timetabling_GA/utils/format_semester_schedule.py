from collections import defaultdict
from typing import Dict, Any, List

def format_semester_schedule(semester_schedule: Dict[str, List[List[Dict[str, Any]]]], processed_data: Any) -> str:
    """
    Định dạng dữ liệu thời khóa biểu của một học kỳ để hiển thị dễ đọc trên console.

    Hàm này tổ chức lịch trình theo lớp, sau đó theo tuần và ngày. Nó bao gồm
    các thông tin chi tiết về buổi học và xử lý các trường hợp buổi học bị lỗi.

    Args:
        semester_schedule (Dict[str, List[List[Dict[str, Any]]]]): Dữ liệu lịch trình
                                                                    của học kỳ, được tổ chức
                                                                    theo lớp, tuần, và các buổi học.
        processed_data (Any): Đối tượng chứa dữ liệu đã được xử lý, bao gồm các map
                              (class_map, program_map, subject_map, lecturer_map, slot_order_map).

    Returns:
        str: Một chuỗi đã được định dạng sẵn sàng để in ra console.
    """
    output_lines = []
    
    # Sắp xếp các class_id để đảm bảo thứ tự đầu ra nhất quán
    sorted_class_ids = sorted(semester_schedule.keys())
    
    # Lặp qua từng lớp học để định dạng lịch trình của nó
    for class_id in sorted_class_ids:
        weekly_schedules = semester_schedule.get(class_id, [])
        cls_info = processed_data.class_map.get(class_id, {})
        program_id = cls_info.get('program_id')
        program_name = processed_data.program_map.get(program_id, {}).get('program_name', program_id)
        
        # Thêm tiêu đề cho lớp học hiện tại
        output_lines.append(f"\n===== THỜI KHÓA BIỂU HỌC KỲ CHO LỚP: {class_id} ({program_name}) =====")
        
        if not weekly_schedules:
            output_lines.append("   (Không có dữ liệu lịch trình cho lớp này.)")
            continue
            
        # Lặp qua từng tuần học
        for week_idx, week_lessons in enumerate(weekly_schedules):
            if not week_lessons:
                continue
                
            output_lines.append(f"\n   --- Tuần {week_idx + 1} ---")
            
            # Nhóm các buổi học theo ngày
            lessons_by_date = defaultdict(list)
            for lesson in week_lessons:
                lessons_by_date[lesson['date']].append(lesson)
            
            # Sắp xếp các ngày theo thứ tự
            sorted_dates = sorted(lessons_by_date.keys())
            
            # Lặp qua từng ngày để hiển thị các buổi học
            for lesson_date in sorted_dates:
                # Tìm các buổi học bị lỗi (thiếu slot_id) để hiển thị trước
                lessons_with_error = [
                    lesson for lesson in lessons_by_date[lesson_date] 
                    if lesson.get('slot_id') is None
                ]
                if lessons_with_error:
                    output_lines.append(f"   ❗❗ Các buổi học không có slot_id vào ngày {lesson_date}:")
                    for lesson in lessons_with_error:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        output_lines.append(f"      - Môn: {subject_name} ({lesson['lesson_type']})")
                
                # Sắp xếp các buổi học hợp lệ theo thứ tự của slot_id
                def get_slot_order_key(lesson):
                    slot_id = lesson.get('slot_id')
                    return processed_data.slot_order_map.get(slot_id, float('inf'))
                    
                sorted_daily_lessons = sorted(
                    [l for l in lessons_by_date[lesson_date] if l.get('slot_id') is not None], 
                    key=get_slot_order_key
                )
                
                # Chỉ hiển thị ngày nếu có buổi học hợp lệ
                if sorted_daily_lessons:
                    output_lines.append(f"   Ngày: {lesson_date}")
                    for lesson in sorted_daily_lessons:
                        subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                        lecturer_name = processed_data.lecturer_map.get(lesson['lecturer_id'], {}).get('name', lesson['lecturer_id'])
                        
                        output_lines.append(
                            f"      - Thứ: {lesson['day']}, Slot: {lesson['slot_id']}, Môn: {subject_name} ({lesson['lesson_type']}), "
                            f"Phòng: {lesson['room_id']}, Giảng viên: {lecturer_name}"
                        )
                        
    return "\n".join(output_lines)