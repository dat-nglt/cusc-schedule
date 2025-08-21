import copy
from typing import Dict, Any, Optional

# Assuming DataProcessor is an existing class
from data_processing.processor import DataProcessor

def get_data_for_semester(semester_id: str, full_data: DataProcessor) -> Optional[DataProcessor]:
    """
    Creates a copy of the DataProcessor object, containing only the data
    relevant to a specific semester to optimize processing for the GA algorithm.

    Args:
        semester_id (str): The ID of the semester to filter data for.
        full_data (DataProcessor): The DataProcessor object containing all the original data.

    Returns:
        Optional[DataProcessor]: A new DataProcessor object containing only the data
                                 for the selected semester, or None if no data is found.
    """
    # Get information about the subjects for that semester from the semester_map
    semester_info = full_data.semester_map.get(semester_id, {})
    related_subject_ids = semester_info.get("subject_ids", [])
    
    if not related_subject_ids:
        print(f"No subject information found for semester {semester_id}.")
        return None
        
    # Create a deep copy of the original data to modify
    semester_data_dict = copy.deepcopy(full_data.data)

    # 1. Filter the list of semesters, keeping only the selected one
    semester_data_dict['semesters'] = [
        s for s in semester_data_dict['semesters'] if s['semester_id'] == semester_id
    ]
    
    # 2. Filter the list of subjects, keeping only those belonging to this semester
    semester_data_dict['subjects'] = [
        s for s in semester_data_dict['subjects'] if s['subject_id'] in related_subject_ids
    ]
    
    # 3. Filter programs and the semesters within them
    filtered_programs = []
    related_program_ids = set()
    for prog in semester_data_dict['programs']:
        # Check if the program contains the target semester
        has_target_semester = any(s['semester_id'] == semester_id for s in prog['semesters'])
        if has_target_semester:
            # Create a copy of the program and keep only the selected semester
            prog_copy = copy.deepcopy(prog)
            prog_copy['semesters'] = [s for s in prog_copy['semesters'] if s['semester_id'] == semester_id]
            filtered_programs.append(prog_copy)
            related_program_ids.add(prog['program_id'])
            
    semester_data_dict['programs'] = filtered_programs
    
    # 4. Filter classes, keeping only those belonging to the filtered programs
    semester_data_dict['classes'] = [
        c for c in semester_data_dict['classes'] if c['program_id'] in related_program_ids
    ]
    
    # 5. Filter lecturers, keeping only those who teach the filtered subjects
    related_lecturer_ids = {
        l['lecturer_id'] for l in semester_data_dict['lecturers']
        if any(sub_id in related_subject_ids for sub_id in l['subjects'])
    }
    semester_data_dict['lecturers'] = [
        l for l in semester_data_dict['lecturers'] if l['lecturer_id'] in related_lecturer_ids
    ]

    # Create a new DataProcessor object with the filtered data
    return DataProcessor(semester_data_dict)