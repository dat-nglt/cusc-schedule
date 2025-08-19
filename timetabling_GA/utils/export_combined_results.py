import json
import os
from pprint import pprint
from utils.generate_semester_schedule import generate_semester_schedule
from utils.export_semester_schedule_to_excel import export_semester_schedule_to_excel
from utils.flatten_and_sort_semester_timetable import flatten_and_sort_semester_timetable
from utils.get_data_for_semester import get_data_for_semester


def export_combined_results(all_semester_results, processed_data, output_folder):
    print("\n--- Bắt đầu xuất lịch ra file Excel ---")

    combined_json = {"semesters": []}

    # Vòng lặp chính để xử lý từng học kỳ
    for semester_id, result in all_semester_results.items():
        best_chrom = result["chromosome"]
        semester_specific_data = get_data_for_semester(semester_id, processed_data)
        semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, semester_specific_data)
        
        by_class, _ = flatten_and_sort_semester_timetable(semester_timetable, semester_id)

        # Tạo entry cho học kỳ hiện tại
        semester_entry = {
            "semester_id": semester_id,
            "classes": []
        }

        # Vòng lặp xử lý từng lớp, nằm gọn trong vòng lặp học kỳ
        for class_id, class_schedule in by_class.items():
            class_info = semester_specific_data.class_map.get(class_id)
            program_name = class_info.get("program_name", "")

            semester_entry["classes"].append({
                "class_id": class_id,
                "program_name": program_name,
                "schedule": class_schedule
            })

        # 💡 SỬA LỖI: Thêm semester_entry vào danh sách ngay khi đã điền đầy đủ
        combined_json["semesters"].append(semester_entry)

        # Xuất Excel theo từng học kỳ
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
        
        # lecturer_semester_view = generate_lecturer_semester_view(semester_timetable, semester_specific_data)
        # room_semester_view = generate_room_semester_view(semester_timetable, semester_specific_data)

        # export_lecturer_view_to_excel(lecturer_semester_view, semester_specific_data, output_folder=semester_output_folder)
        # export_room_view_to_excel(room_semester_view, semester_specific_data, output_folder=semester_output_folder)

        print(f"  Đã hoàn tất xuất file Excel cho {semester_id} trong thư mục '{semester_output_folder}'")

    # ---
    
    # 🔹 Xuất JSON tổng hợp (sau khi đã duyệt hết tất cả các học kỳ)
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    combined_file = os.path.join(output_folder, "all_semesters.json")
    with open(combined_file, "w", encoding="utf-8") as f:
        json.dump(combined_json, f, indent=4, ensure_ascii=False)

    print(f"  >> Đã xuất toàn bộ thời khóa biểu ra {combined_file}")
    print("\n--- Đã hoàn thành xuất tất cả các file Excel & JSON. ---")