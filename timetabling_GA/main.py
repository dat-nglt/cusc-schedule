# timetable_ga/main.py
import sys
import os
from data_processing.loader import load_data
from data_processing.processor import DataProcessor
from utils.run_ga_for_semester import run_ga_for_semester
from utils.export_combined_results import export_combined_results

def genetic_algorithm():
    print("Loading data...")
    raw_data = load_data("input_data.json")
    if not raw_data:
        return

    print("Processing data...")
    processed_data = DataProcessor(raw_data)
    
    print(f"Số lượng tiết học hàng tuần cần xếp lịch: {len(processed_data.required_lessons_weekly)}")
    
    output_folder = "results"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    all_semester_results = {}
    for semester_id, semester_info in processed_data.semester_map.items():
        print(f"\n--- Bắt đầu tạo lịch cho Học kỳ: {semester_id} ---")
        
        # Hàm run_ga_for_semester giờ đây sẽ trả về một list các tiết học
        # đã được tối ưu
        best_chromosome, ga_log = run_ga_for_semester(semester_id, processed_data)
        
        if best_chromosome:
            # best_chromosome là một list các lessons dictionary
            all_semester_results[semester_id] = {
                "chromosome": best_chromosome,
                "log": ga_log
            }
            print()
            print(f"Lịch học tối ưu nhất cho {semester_id} đã được tạo thành công.")
        else:
            print(f"Không thể tạo lịch cho {semester_id}.")

    if all_semester_results:
        print("\n--- Tổng hợp và xuất kết quả ---")
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    sys.stdout.flush()
    
if __name__ == "__main__":
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()