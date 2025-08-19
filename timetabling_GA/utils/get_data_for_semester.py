import copy
from typing import Dict, Any, Optional

# Giả định DataProcessor là một class đã tồn tại
from data_processing.processor import DataProcessor

def get_data_for_semester(semester_id: str, full_data: DataProcessor) -> Optional[DataProcessor]:
    """
    Tạo một bản sao của đối tượng DataProcessor, chỉ chứa dữ liệu liên quan
    đến một học kỳ cụ thể để tối ưu hóa việc xử lý cho thuật toán GA.

    Args:
        semester_id (str): ID của học kỳ cần tách dữ liệu.
        full_data (DataProcessor): Đối tượng DataProcessor chứa toàn bộ dữ liệu gốc.

    Returns:
        Optional[DataProcessor]: Một đối tượng DataProcessor mới chỉ chứa dữ liệu
                                 của học kỳ đã chọn, hoặc None nếu không tìm thấy dữ liệu.
    """
    # Lấy thông tin về các môn học của học kỳ đó từ semester_map
    semester_info = full_data.semester_map.get(semester_id, {})
    related_subject_ids = semester_info.get("subject_ids", [])
    
    if not related_subject_ids:
        print(f"Không tìm thấy thông tin môn học cho học kỳ {semester_id}.")
        return None
        
    # Tạo một bản sao sâu của dữ liệu gốc để chỉnh sửa
    semester_data_dict = copy.deepcopy(full_data.data)

    # 1. Lọc danh sách các học kỳ, chỉ giữ lại học kỳ được chọn
    semester_data_dict['semesters'] = [
        s for s in semester_data_dict['semesters'] if s['semester_id'] == semester_id
    ]
    
    # 2. Lọc danh sách các môn học, chỉ giữ lại các môn thuộc học kỳ này
    semester_data_dict['subjects'] = [
        s for s in semester_data_dict['subjects'] if s['subject_id'] in related_subject_ids
    ]
    
    # 3. Lọc các chương trình và học kỳ bên trong chương trình
    filtered_programs = []
    related_program_ids = set()
    for prog in semester_data_dict['programs']:
        # Kiểm tra nếu chương trình có chứa học kỳ cần tìm
        has_target_semester = any(s['semester_id'] == semester_id for s in prog['semesters'])
        if has_target_semester:
            # Tạo bản sao của chương trình và chỉ giữ lại học kỳ đã chọn
            prog_copy = copy.deepcopy(prog)
            prog_copy['semesters'] = [s for s in prog_copy['semesters'] if s['semester_id'] == semester_id]
            filtered_programs.append(prog_copy)
            related_program_ids.add(prog['program_id'])
            
    semester_data_dict['programs'] = filtered_programs
    
    # 4. Lọc các lớp học, chỉ giữ lại các lớp thuộc chương trình đã lọc
    semester_data_dict['classes'] = [
        c for c in semester_data_dict['classes'] if c['program_id'] in related_program_ids
    ]
    
    # 5. Lọc các giảng viên, chỉ giữ lại những người dạy các môn học đã lọc
    related_lecturer_ids = {
        l['lecturer_id'] for l in semester_data_dict['lecturers']
        if any(sub_id in related_subject_ids for sub_id in l['subjects'])
    }
    semester_data_dict['lecturers'] = [
        l for l in semester_data_dict['lecturers'] if l['lecturer_id'] in related_lecturer_ids
    ]

    # Tạo một đối tượng DataProcessor mới với dữ liệu đã lọc
    return DataProcessor(semester_data_dict)