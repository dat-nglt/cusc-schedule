import io
import json
import os
import sys
from typing import Dict, Any, List
from datetime import datetime
from pprint import pprint

# Utility functions imported from other files
from utils.generate_semester_schedule import generate_semester_schedule
from utils.export_semester_schedule_to_excel import export_semester_schedule_to_excel
from utils.flatten_and_sort_semester_timetable import flatten_and_sort_semester_timetable
from utils.get_data_for_semester import get_data_for_semester

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

def export_combined_results(all_semester_results: Dict[str, Any], processed_data: Any, output_folder: str) -> None:
    """
    Exports the generated timetables for all semesters to JSON and Excel files.
    Optimized for FE processing with clear structure and progress tracking.
    """
    
    # Tạo thư mục output nếu chưa tồn tại
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    
    # Xác định đường dẫn đến thư mục C:\Users\ngltd\REPO\cusc-schedule\be\results
    # Đi lên 2 cấp từ thư mục hiện tại (timetabling_GA) để đến REPO, rồi vào be/results
    current_dir = os.path.dirname(os.path.abspath(__file__))
    repo_root = os.path.dirname(os.path.dirname(current_dir))  # Đi lên 2 cấp từ timetabling_GA
    be_results_dir = os.path.join(repo_root, 'be', 'results')
    
    if not os.path.exists(be_results_dir):
        os.makedirs(be_results_dir, exist_ok=True)
        print(f"\nEXPORT_EVENT:{json.dumps({
            'event_type': 'DIRECTORY_CREATED',
            'directory_path': be_results_dir,
            'message': 'Đã tạo thư mục /be/results'
        })}")
    
    # Metadata for export process
    export_metadata = {
        "export_start_time": datetime.now().isoformat(),
        "total_semesters": len(all_semester_results),
        "status": "in_progress"
    }
    
    print(f"\nEXPORT_EVENT:{json.dumps({
        'event_type': 'EXPORT_STARTED',
        'metadata': export_metadata,
        'message': f'Bắt đầu xuất dữ liệu cho {len(all_semester_results)} học kỳ'
    })}")

    combined_data = {
        "metadata": {
            "version": "1.0",
            "export_date": datetime.now().isoformat(),
            "total_semesters": len(all_semester_results),
            "semester_ids": list(all_semester_results.keys())
        },
        "semesters": []
    }

    total_semesters = len(all_semester_results)
    processed_count = 0

    for semester_id, result in all_semester_results.items():
        processed_count += 1
        progress_percentage = round((processed_count / total_semesters) * 100, 2)
        
        # SEMESTER PROCESSING START
        print(f"\nEXPORT_EVENT:{json.dumps({
            'event_type': 'SEMESTER_PROCESSING_START',
            'semester_id': semester_id,
            'progress': {
                'current': processed_count,
                'total': total_semesters,
                'percentage': progress_percentage
            },
            'timestamp': datetime.now().isoformat()
        })}")

        try:
            # Get semester data and generate schedule
            best_chrom = result["chromosome"]
            semester_specific_data = get_data_for_semester(semester_id, processed_data)
            semester_timetable, unassignable_lessons = generate_semester_schedule(best_chrom, semester_specific_data)
            
            # Flatten timetable for easier processing
            by_class, by_teacher = flatten_and_sort_semester_timetable(semester_timetable, semester_id)

            # Create semester directory
            semester_output_folder = os.path.join(output_folder, semester_id)
            os.makedirs(semester_output_folder, exist_ok=True)

            # Prepare semester data for combined JSON
            semester_entry = {
                "semester_id": semester_id,
                "metadata": {
                    "total_classes": len(by_class),
                    "total_teachers": len(by_teacher),
                    "unassignable_lessons": len(unassignable_lessons),
                    "generated_at": datetime.now().isoformat()
                },
                "classes": [],
                "teachers": [],
                "unassignable_lessons": unassignable_lessons
            }

            # Process classes data
            for class_id, class_schedule in by_class.items():
                class_info = semester_specific_data.class_map.get(class_id, {})
                semester_entry["classes"].append({
                    "id": class_id,
                    "program_name": class_info.get("program_name", "Unknown"),
                    "schedule": class_schedule,
                    "total_lessons": len(class_schedule)
                })

            # Process teachers data (if needed for FE)
            for teacher_id, teacher_schedule in by_teacher.items():
                semester_entry["teachers"].append({
                    "id": teacher_id,
                    "schedule": teacher_schedule,
                    "total_lessons": len(teacher_schedule)
                })

            combined_data["semesters"].append(semester_entry)

            # Export debug JSON
            debug_file = os.path.join(semester_output_folder, f"debug_{semester_id}.json")
            with open(debug_file, "w", encoding="utf-8") as f:
                json.dump({
                    "timetable": semester_timetable,
                    "by_class": by_class,
                    "by_teacher": by_teacher,
                    "unassignable_lessons": unassignable_lessons
                }, f, indent=2, ensure_ascii=False)

            # Export Excel file
            excel_file_path = export_semester_schedule_to_excel(
                semester_schedule_json=semester_timetable,
                output_folder=semester_output_folder,
                semester_id=semester_id
            )

            # SEMESTER PROCESSING SUCCESS
            print(f"\nEXPORT_EVENT:{json.dumps({
                'event_type': 'SEMESTER_PROCESSING_SUCCESS',
                'semester_id': semester_id,
                'progress': {
                    'current': processed_count,
                    'total': total_semesters,
                    'percentage': progress_percentage
                },
                'files': {
                    'excel': os.path.basename(excel_file_path),
                    'debug_json': os.path.basename(debug_file)
                },
                'stats': {
                    'total_classes': len(by_class),
                    'total_teachers': len(by_teacher),
                    'unassignable_lessons': len(unassignable_lessons)
                },
                'timestamp': datetime.now().isoformat()
            })}")

        except Exception as e:
            # SEMESTER PROCESSING ERROR
            print(f"\nEXPORT_EVENT:{json.dumps({
                'event_type': 'SEMESTER_PROCESSING_ERROR',
                'semester_id': semester_id,
                'progress': {
                    'current': processed_count,
                    'total': total_semesters,
                    'percentage': progress_percentage
                },
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            })}")
            continue

    # Export combined JSON - CẢ HAI VỊ TRÍ
    combined_file_output = os.path.join(output_folder, "combined_timetables.json")
    combined_file_be = os.path.join(be_results_dir, "combined_timetables.json")
    
    try:
        # Xuất file trong output_folder (thư mục kết quả chính)
        with open(combined_file_output, "w", encoding="utf-8") as f:
            json.dump(combined_data, f, indent=2, ensure_ascii=False)
        
        # Xuất file trong /be/results (cho web app)
        with open(combined_file_be, "w", encoding="utf-8") as f:
            json.dump(combined_data, f, indent=2, ensure_ascii=False)
        
        # EXPORT COMPLETE
        print(f"\nEXPORT_EVENT:{json.dumps({
            'event_type': 'EXPORT_COMPLETE',
            'metadata': {
                'total_processed': processed_count,
                'successful_semesters': len(combined_data["semesters"]),
                'output_folder': output_folder,
                'be_results_folder': be_results_dir,
                'combined_files': [
                    {
                        'path': combined_file_output,
                        'name': os.path.basename(combined_file_output)
                    },
                    {
                        'path': combined_file_be,
                        'name': os.path.basename(combined_file_be)
                    }
                ],
                'completion_time': datetime.now().isoformat()
            },
            'message': 'Xuất dữ liệu hoàn tất thành công - File đã được lưu ở cả hai vị trí'
        })}")
        
    except Exception as e:
        print(f"\nEXPORT_EVENT:{json.dumps({
            'event_type': 'COMBINED_EXPORT_ERROR',
            'error': str(e),
            'timestamp': datetime.now().isoformat()
        })}")

    print("\n--- Quá trình xuất file hoàn tất ---")