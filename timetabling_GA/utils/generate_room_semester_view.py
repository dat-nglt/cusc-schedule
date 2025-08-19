from collections import defaultdict
from typing import Dict, Any, List

def generate_room_semester_view(semester_schedule_by_class: Dict[str, List[List[Dict[str, Any]]]], processed_data: Any) -> Dict[str, Dict[int, List[Dict[str, Any]]]]:
    """
    Tạo một cấu trúc dữ liệu lịch sử dụng cho từng phòng học trong suốt học kỳ.

    Hàm này lặp qua lịch trình theo lớp, trích xuất thông tin buổi học và tổ chức
    lại theo từng phòng. Dữ liệu được sắp xếp theo tuần, ngày và khung giờ để dễ theo dõi.

    Args:
        semester_schedule_by_class (Dict[str, List[List[Dict[str, Any]]]]): Lịch trình học kỳ
            đã được nhóm theo lớp học.
        processed_data (Any): Đối tượng chứa dữ liệu đã được xử lý từ file đầu vào, bao gồm
            các ánh xạ (maps) và thông tin về ngày trong tuần.

    Returns:
        Dict[str, Dict[int, List[Dict[str, Any]]]]: Lịch trình của phòng học.
            - Key cấp 1: room_id (string)
            - Key cấp 2: week_num (integer)
            - Value: Danh sách các buổi học (List[Dict[str, Any]]) trong tuần đó, đã được sắp xếp.
    """
    # Sử dụng defaultdict để xây dựng cấu trúc lồng nhau một cách dễ dàng
    room_view = defaultdict(lambda: defaultdict(list))

    # Lặp qua lịch trình theo lớp
    for class_id, weekly_schedules_for_class in semester_schedule_by_class.items():
        # Lặp qua từng tuần của lớp học
        for week_idx, lessons_in_week in enumerate(weekly_schedules_for_class):
            # Lặp qua từng buổi học trong tuần
            for lesson in lessons_in_week:
                room_id = lesson.get('room_id')
                # Chỉ xử lý các buổi học đã được gán phòng
                if room_id and room_id != "UNASSIGNED_ROOM":
                    week_num = week_idx + 1
                    
                    # Tạo dictionary mới với thông tin buổi học cần thiết cho phòng
                    lesson_info_for_room = {
                        'day': lesson['day'],
                        'date': lesson.get('date'),
                        'slot_id': lesson['slot_id'],
                        'class_id': lesson['class_id'],
                        'subject_id': lesson['subject_id'],
                        'lesson_type': lesson['lesson_type'],
                        'lecturer_id': lesson['lecturer_id'],
                    }
                    room_view[room_id][week_num].append(lesson_info_for_room)

    # Sắp xếp các buổi học của mỗi phòng theo ngày và slot
    for room_id in room_view:
        for week_num in room_view[room_id]:
            # Kiểm tra xem dữ liệu ánh xạ có tồn tại không để tránh lỗi
            if processed_data.data.get('days_of_week') and processed_data.slot_order_map:
                room_view[room_id][week_num].sort(key=lambda x: (
                    processed_data.data['days_of_week'].index(x['day']), 
                    processed_data.slot_order_map[x['slot_id']]
                ))
            else:
                # Trường hợp không có dữ liệu ánh xạ, sắp xếp đơn giản hơn
                room_view[room_id][week_num].sort(key=lambda x: (x['day'], x['slot_id']))
                
    return room_view