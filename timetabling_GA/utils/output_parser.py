import json
import os
from collections import defaultdict
from datetime import datetime, timedelta

def create_json_from_ga_results(all_semester_results, data_processor):
    """
    Chuyển đổi kết quả của thuật toán di truyền thành cấu trúc JSON,
    nhóm các tiết học theo ngày cụ thể cho từng tuần trong học kỳ.
    """
    json_output = {
        "semesters": []
    }

    # Giả sử days_of_week_map là một ánh xạ từ tên ngày ('Mon') sang chỉ số (0)
    # để tính toán ngày
    days_of_week_map = {day: i for i, day in enumerate(data_processor.data.get('days_of_week'))}

    for semester_id in sorted(all_semester_results.keys()):
        result = all_semester_results[semester_id]
        if not result or "chromosome" not in result:
            continue
            
        best_chromosome = result["chromosome"]
        
        # Giả sử GA chromosome chỉ chứa lịch trình cho một tuần,
        # cần lặp lại để tạo lịch trình cho cả học kỳ
        weekly_schedule = best_chromosome.genes

        # Lấy thông tin học kỳ để tính toán ngày
        semester_info = data_processor.semester_map.get(semester_id, {})
        semester_start_date_str = semester_info.get('start_date')
        num_weeks = semester_info.get('num_weeks', 15) # Mặc định là 15 tuần

        if not semester_start_date_str:
            print(f"Không tìm thấy ngày bắt đầu cho học kỳ {semester_id}. Bỏ qua...")
            continue
        
        semester_start_date = datetime.strptime(semester_start_date_str, '%Y-%m-%d')
        
        # Cấu trúc để nhóm các tiết học theo lớp và ngày
        classes_data = defaultdict(lambda: defaultdict(list))
        
        # Duyệt qua từng tuần của học kỳ
        for week_index in range(num_weeks):
            for lesson in weekly_schedule:
                class_id = lesson.get('class_id')
                day_of_week = lesson.get('day')
                
                if not class_id or not day_of_week:
                    continue
                
                # Tính toán ngày cụ thể
                day_offset = days_of_week_map.get(day_of_week, 0)
                date_for_lesson = semester_start_date + timedelta(weeks=week_index, days=day_offset)
                date_str = date_for_lesson.strftime('%Y-%m-%d')

                # Chuẩn bị thông tin tiết học
                lesson_info = {
                    "slot": lesson.get('slot_id', 'N/A'),
                    "subject_id": lesson.get('subject_id'),
                    "subject": data_processor.subject_map.get(lesson.get('subject_id'), {}).get('name', 'N/A'),
                    "type": lesson.get('lesson_type', 'N/A'),
                    "room": lesson.get('room_id', 'N/A'),
                    "lecturer_id": lesson.get('lecturer_id'),
                    "lecturer": data_processor.lecturer_map.get(lesson.get('lecturer_id'), {}).get('lecturer_name', 'N/A'),
                    "size":lesson.get('size', 'N/A'),
                    "class_id":lesson.get('class_id', 'N/A'),
                }
                
                # Thêm tiết học vào cấu trúc nhóm
                classes_data[class_id][date_str].append(lesson_info)

        final_classes_list = []
        for class_id in sorted(classes_data.keys()):
            # Lấy thông tin lớp và chương trình đào tạo
            class_info = data_processor.class_map.get(class_id, {})
            program_id = class_info.get('program_id')
            program_name = data_processor.program_map.get(program_id, {}).get('program_name', 'N/A')

            class_schedule_list = []
            # Sắp xếp các ngày và tạo danh sách lịch trình
            for date_str in sorted(classes_data[class_id].keys()):
                date_obj = datetime.strptime(date_str, '%Y-%m-%d')
                day_of_week = date_obj.strftime('%a')
                
                # Sắp xếp các tiết học trong ngày theo slot
                sorted_lessons = sorted(classes_data[class_id][date_str], 
                                        key=lambda x: data_processor.slot_order_map.get(x['slot'], 99))
                
                class_schedule_list.append({
                    "date": date_str,
                    "day": day_of_week,
                    "lessons": sorted_lessons
                })
            
            final_classes_list.append({
                "class_id": class_id,
                "program_name": program_name,
                "schedule": class_schedule_list
            })
        
        json_output["semesters"].append({
            "semester_id": semester_id,
            "classes": final_classes_list
        })
            
    return json_output

def export_to_json_file(data, filename, output_folder="results"):
    """
    Lưu dữ liệu Python dict vào file JSON.
    """
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    filepath = os.path.join(output_folder, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)
    print(f"  --> Đã xuất dữ liệu JSON vào file: {filepath}")