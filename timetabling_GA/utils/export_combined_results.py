import json
import os
from typing import Dict, Any
from pprint import pprint

# Các hàm tiện ích được import từ các file khác
from utils.generate_semester_schedule import generate_semester_schedule
from utils.export_semester_schedule_to_excel import export_semester_schedule_to_excel
from utils.flatten_and_sort_semester_timetable import flatten_and_sort_semester_timetable
from utils.get_data_for_semester import get_data_for_semester

def export_combined_results(all_semester_results: Dict[str, Any], processed_data: Any, output_folder: str) -> None:
    """
    Xuất kết quả thời khóa biểu của tất cả các học kỳ ra các file JSON và Excel.

    Mỗi học kỳ sẽ được xuất riêng ra một thư mục con, đồng thời một file JSON tổng hợp
    chứa kết quả của tất cả các học kỳ cũng sẽ được tạo.

    Args:
        all_semester_results (Dict[str, Any]): Dictionary chứa kết quả GA tốt nhất cho mỗi học kỳ.
                                                Khóa là semester_id, giá trị là một dictionary chứa 'chromosome'.
        processed_data (Any): Đối tượng chứa dữ liệu đầu vào đã được xử lý.
        output_folder (str): Đường dẫn đến thư mục đầu ra để lưu các file.
    """
    print("\n--- Bắt đầu xuất lịch ra file Excel ---")

    combined_json = {"semesters": []}

    # Lặp qua từng học kỳ để xử lý và xuất file
    for semester_id, result in all_semester_results.items():
        best_chrom = result["chromosome"]
        semester_specific_data = get_data_for_semester(semester_id, processed_data)
        
        # Tạo thời khóa biểu chi tiết từ nhiễm sắc thể (chromosome) tốt nhất
        semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, semester_specific_data)
        
        # Chuyển đổi định dạng thời khóa biểu sang dạng phẳng và sắp xếp theo lớp
        by_class, _ = flatten_and_sort_semester_timetable(semester_timetable, semester_id)

        # Chuẩn bị dữ liệu cho file JSON tổng hợp
        semester_entry = {
            "semester_id": semester_id,
            "classes": []
        }

        # Lặp qua từng lớp để thêm thông tin lịch trình vào JSON
        for class_id, class_schedule in by_class.items():
            class_info = semester_specific_data.class_map.get(class_id, {})
            program_name = class_info.get("program_name", "")

            semester_entry["classes"].append({
                "class_id": class_id,
                "program_name": program_name,
                "schedule": class_schedule
            })

        # Thêm entry của học kỳ hiện tại vào danh sách tổng hợp
        combined_json["semesters"].append(semester_entry)

        # Tạo thư mục đầu ra cho học kỳ cụ thể
        semester_output_folder = os.path.join(output_folder, semester_id)
        if not os.path.exists(semester_output_folder):
            os.makedirs(semester_output_folder)
        
        # Xuất file JSON debug để kiểm tra dữ liệu thô
        debug_file = os.path.join(semester_output_folder, f"debug_{semester_id}_timetable.json")
        try:
            with open(debug_file, "w", encoding="utf-8") as f:
                json.dump(semester_timetable, f, indent=4, ensure_ascii=False)
            print(f"  ✅ Đã lưu dữ liệu thời khóa biểu thô vào: {debug_file}")
        except Exception as e:
            print(f"  ❌ Lỗi khi lưu file debug: {e}")

        # Xuất file Excel thời khóa biểu
        try:
            export_semester_schedule_to_excel(
                semester_schedule_json=semester_timetable,
                output_folder=semester_output_folder
            )
            print(f"  ✅ Đã xuất thời khóa biểu học kỳ thành công vào thư mục: {semester_output_folder}")
        except Exception as e:
            print(f"  ❌ Lỗi khi xuất file Excel: {e}")
            
        print(f"  Đã hoàn tất xuất file cho {semester_id} trong thư mục '{semester_output_folder}'")

    # Xuất JSON tổng hợp sau khi đã xử lý tất cả các học kỳ
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    combined_file = os.path.join(output_folder, "all_semesters.json")
    try:
        with open(combined_file, "w", encoding="utf-8") as f:
            json.dump(combined_json, f, indent=4, ensure_ascii=False)
        print(f"  >> Đã xuất toàn bộ thời khóa biểu ra {combined_file}")
    except Exception as e:
        print(f"  ❌ Lỗi khi xuất file JSON tổng hợp: {e}")
        
    print("\n--- Đã hoàn thành xuất tất cả các file Excel & JSON. ---")