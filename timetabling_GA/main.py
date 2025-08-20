import sys
import os
import json
from typing import Dict, Any

# Import các thành phần chính
from data_processing.loader import load_data
from data_processing.processor import DataProcessor
from utils.run_ga_for_semester import run_ga_for_semester
from utils.export_combined_results import export_combined_results


def genetic_algorithm():
    """
    Chức năng chính để chạy thuật toán di truyền nhằm tạo lịch trình học kỳ.
    Quy trình bao gồm:
    1. Tải và xử lý dữ liệu đầu vào.
    2. Chạy thuật toán GA riêng biệt cho từng học kỳ.
    3. Tổng hợp và xuất kết quả cuối cùng.
    """
    print("Loading data...")
    # Tải dữ liệu từ file JSON
    raw_data = load_data("input_data.json")
    if not raw_data:
        return

    print("Processing data...")
    # Xử lý dữ liệu để tạo các cấu trúc tiện ích
    processed_data = DataProcessor(raw_data)
    
    print(f"Số lượng tiết học hàng tuần cần xếp lịch: {len(processed_data.required_lessons_weekly)}")
    
    # Tạo thư mục 'results' nếu chưa tồn tại
    output_folder = "results"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    all_semester_results = {}
    
    # Chạy GA cho từng học kỳ
    for semester_id, semester_info in processed_data.semester_map.items():
        print(f"\n--- Bắt đầu tạo lịch cho Học kỳ: {semester_id} ---")
        
        # Chạy thuật toán GA và lấy nhiễm sắc thể tốt nhất cùng log
        best_chromosome, ga_log = run_ga_for_semester(semester_id, processed_data)
        
        if best_chromosome:
            # Lưu kết quả tốt nhất và log của từng học kỳ
            all_semester_results[semester_id] = {
                "chromosome": best_chromosome,
                "log": ga_log
            }
            print()
            print(f"Lịch học tối ưu nhất cho {semester_id} đã được tạo thành công.")
        else:
            print(f"Không thể tạo lịch cho {semester_id}.")

    # Tổng hợp và xuất kết quả nếu có
    if all_semester_results:
        print("\n--- Tổng hợp và xuất kết quả ---")
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    # Đảm bảo tất cả output được ghi ra console
    sys.stdout.flush()
    
if __name__ == "__main__":
    # Đảm bảo thư mục kết quả tồn tại trước khi chạy
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()