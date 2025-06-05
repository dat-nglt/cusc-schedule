import openpyxl, os
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from openpyxl.utils import get_column_letter
from collections import defaultdict

def export_lecturer_view_to_excel(lecturer_semester_view, processed_data, output_folder="results"):
    """Xuất lịch dạy của giảng viên ra một file Excel, mỗi tuần một sheet."""
    if not lecturer_semester_view: 
        print("No lecturer schedule data to export.")
        return

    days_of_week_map = {"Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4", "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"}
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    
    time_slots_info = processed_data.data['time_slots']
    excel_main_headers = ["Slot Thời Gian", "Giảng Viên"] + day_column_headers

    # Styles
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="4A86E8", end_color="4A86E8", fill_type="solid") # Blue for lecturer
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    
    university_header = [
        "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
        "CANTHO UNIVERSITY SOFTWARE CENTER",
        "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
    ]
    university_header_font = Font(name="Times New Roman", size=12, bold=True)
    university_subheader_font = Font(name="Times New Roman", size=11)
    university_contact_font = Font(name="Times New Roman", size=10)

    max_weeks = 0
    if lecturer_semester_view:
        all_weeks_with_data = [week_num for lecturer_data in lecturer_semester_view.values() for week_num in lecturer_data.keys()]
        if all_weeks_with_data:
            max_weeks = max(all_weeks_with_data) 

    workbook_lecturer = openpyxl.Workbook()
    is_first_lecturer_sheet = True

    for week_num_display in range(1, max_weeks + 1):
        if is_first_lecturer_sheet:
            sheet = workbook_lecturer.active
            sheet.title = f"GV_Tuan_{week_num_display}"
            is_first_lecturer_sheet = False
        else:
            sheet = workbook_lecturer.create_sheet(title=f"GV_Tuan_{week_num_display}")

        # Add University Header
        current_row_for_header = 1
        sheet.cell(row=current_row_for_header, column=1, value=university_header[0]).font = university_header_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 25
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        sheet.row_dimensions[current_row_for_header].height = 10 # Empty row
        current_row_for_header+=1

        title_row = current_row_for_header
        sheet.merge_cells(start_row=title_row, start_column=1, end_row=title_row, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=title_row, column=1, value=f"LỊCH DẠY GIẢNG VIÊN - TUẦN {week_num_display}")
        title_cell.font = sheet_title_font; title_cell.alignment = Alignment(horizontal="center", vertical="center"); sheet.row_dimensions[title_row].height = 30
        
        current_excel_row = title_row + 2
        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text)
            cell.font = header_font; cell.fill = header_fill; cell.alignment = header_alignment_center; cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35
        current_excel_row += 1

        lessons_this_week_by_lecturer_slot_day = defaultdict(list)
        lecturers_active_this_week = set()
        for lecturer_id, weekly_data in lecturer_semester_view.items():
            if week_num_display in weekly_data:
                for lesson in weekly_data[week_num_display]:
                    lessons_this_week_by_lecturer_slot_day[(lecturer_id, lesson['slot_id'], lesson['day'])].append(lesson)
                    lecturers_active_this_week.add(lecturer_id)
        
        if not lecturers_active_this_week:
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có giảng viên nào có lịch dạy trong tuần này.")
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center"); empty_msg_cell.font = Font(italic=True, name="Times New Roman")
        else:
            row_start_for_current_slot_merge = current_excel_row
            for ts_info in time_slots_info:
                slot_id_current = ts_info['slot_id']
                slot_display_text = f"{ts_info['slot_id']}\n({ts_info['start']}-{ts_info['end']})"
                
                lecturers_in_this_slot_this_week = sorted(list(set(
                    lect_id for (lect_id, sl_id, day), lessons in lessons_this_week_by_lecturer_slot_day.items() 
                    if sl_id == slot_id_current and lect_id in lecturers_active_this_week
                )))

                if not lecturers_in_this_slot_this_week:
                    slot_cell_empty = sheet.cell(row=current_excel_row, column=1, value=slot_display_text); slot_cell_empty.alignment = cell_alignment_wrapped_center; slot_cell_empty.border = cell_border; slot_cell_empty.font = slot_time_font
                    for empty_col_idx in range(2, len(excel_main_headers) + 1): sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
                    sheet.row_dimensions[current_excel_row].height = 45; current_excel_row += 1; row_start_for_current_slot_merge = current_excel_row
                    continue

                for i, lecturer_id in enumerate(lecturers_in_this_slot_this_week):
                    if i == 0: slot_cell = sheet.cell(row=current_excel_row, column=1, value=slot_display_text); slot_cell.font = slot_time_font
                    else: slot_cell = sheet.cell(row=current_excel_row, column=1, value="")
                    slot_cell.alignment = cell_alignment_wrapped_center; slot_cell.border = cell_border
                    
                    lect_cell = sheet.cell(row=current_excel_row, column=2, value=lecturer_id); lect_cell.alignment = cell_alignment_wrapped_center; lect_cell.border = cell_border; lect_cell.font = Font(name="Times New Roman", size=11)

                    current_data_col = 3 
                    for day_eng in schedule_days_eng:
                        lesson_content_str = ""
                        lessons_for_cell = lessons_this_week_by_lecturer_slot_day.get((lecturer_id, slot_id_current, day_eng), [])
                        if lessons_for_cell: 
                            lesson = lessons_for_cell[0] 
                            subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                            lesson_content_str = f"Lớp: {lesson['class_id']}\nMôn: {subject_name} ({lesson['lesson_type']})\nPhòng: {lesson['room_id']}"
                        
                        data_cell = sheet.cell(row=current_excel_row, column=current_data_col, value=lesson_content_str); data_cell.alignment = cell_alignment_wrapped_center; data_cell.border = cell_border; data_cell.font = Font(name="Times New Roman", size=10)
                        current_data_col += 1
                    sheet.row_dimensions[current_excel_row].height = 75; current_excel_row += 1
                
                if lecturers_in_this_slot_this_week:
                    num_lects_in_slot = len(lecturers_in_this_slot_this_week)
                    if num_lects_in_slot > 1: sheet.merge_cells(start_row=row_start_for_current_slot_merge, start_column=1, end_row=row_start_for_current_slot_merge + num_lects_in_slot - 1, end_column=1)
                    row_start_for_current_slot_merge = current_excel_row
            
        sheet.column_dimensions[get_column_letter(1)].width = 20 
        sheet.column_dimensions[get_column_letter(2)].width = 18 
        for i in range(3, len(excel_main_headers) + 1): sheet.column_dimensions[get_column_letter(i)].width = 30

    output_filename_lecturer = f"{output_folder}/TKB_HocKy_GiangVien.xlsx"
    if os.path.exists(output_filename_lecturer):
        try: os.remove(output_filename_lecturer)
        except OSError as e: print(f"Error removing old lecturer file {output_filename_lecturer}: {e}. Please close the file if it's open."); return # Return to avoid saving error
    try:
        workbook_lecturer.save(output_filename_lecturer)
        print(f"Generated Excel for Lecturer Schedules (all weeks) at {output_filename_lecturer}")
    except OSError as e:
        print(f"Error saving Excel file {output_filename_lecturer}: {e}. Please ensure the file is not open elsewhere.")

def export_room_view_to_excel(room_semester_view, processed_data, output_folder="results"):
    """Xuất lịch sử dụng phòng ra một file Excel, mỗi tuần một sheet."""
    if not room_semester_view: 
        print("No room schedule data to export.")
        return

    days_of_week_map = {"Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4", "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"}
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    
    time_slots_info = processed_data.data['time_slots']
    excel_main_headers = ["Slot Thời Gian", "Phòng"] + day_column_headers
    
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="6AA84F", end_color="6AA84F", fill_type="solid") # Green for room
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)

    university_header = [
        "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
        "CANTHO UNIVERSITY SOFTWARE CENTER",
        "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
    ]
    university_header_font = Font(name="Times New Roman", size=12, bold=True)
    university_subheader_font = Font(name="Times New Roman", size=11)
    university_contact_font = Font(name="Times New Roman", size=10)

    max_weeks = 0
    if room_semester_view:
        all_weeks_with_data = [week_num for room_data in room_semester_view.values() for week_num in room_data.keys()]
        if all_weeks_with_data:
            max_weeks = max(all_weeks_with_data)

    workbook_room = openpyxl.Workbook()
    is_first_room_sheet = True

    for week_num_display in range(1, max_weeks + 1):
        if is_first_room_sheet:
            sheet = workbook_room.active
            sheet.title = f"Phong_Tuan_{week_num_display}"
            is_first_room_sheet = False
        else:
            sheet = workbook_room.create_sheet(title=f"Phong_Tuan_{week_num_display}")

        # Add University Header
        current_row_for_header = 1
        sheet.cell(row=current_row_for_header, column=1, value=university_header[0]).font = university_header_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 25
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        sheet.row_dimensions[current_row_for_header].height = 10
        current_row_for_header+=1

        title_row = current_row_for_header
        sheet.merge_cells(start_row=title_row, start_column=1, end_row=title_row, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=title_row, column=1, value=f"LỊCH SỬ DỤNG PHÒNG - TUẦN {week_num_display}"); title_cell.font = sheet_title_font; title_cell.alignment = Alignment(horizontal="center", vertical="center"); sheet.row_dimensions[title_row].height = 30
        
        current_excel_row = title_row + 2
        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text); cell.font = header_font; cell.fill = header_fill; cell.alignment = header_alignment_center; cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35; current_excel_row += 1

        lessons_this_week_by_room_slot_day = defaultdict(list)
        rooms_active_this_week = set()
        for room_id, weekly_data in room_semester_view.items():
            if week_num_display in weekly_data:
                for lesson in weekly_data[week_num_display]:
                    lessons_this_week_by_room_slot_day[(room_id, lesson['slot_id'], lesson['day'])].append(lesson)
                    rooms_active_this_week.add(room_id)

        if not rooms_active_this_week:
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có phòng nào được sử dụng trong tuần này.")
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center"); empty_msg_cell.font = Font(italic=True, name="Times New Roman")
        else:
            row_start_for_current_slot_merge = current_excel_row
            for ts_info in time_slots_info:
                slot_id_current = ts_info['slot_id']; slot_display_text = f"{ts_info['slot_id']}\n({ts_info['start']}-{ts_info['end']})"
                rooms_in_this_slot_this_week = sorted(list(set(r_id for (r_id, sl_id, day), lessons in lessons_this_week_by_room_slot_day.items() if sl_id == slot_id_current and r_id in rooms_active_this_week)))

                if not rooms_in_this_slot_this_week:
                    slot_cell_empty = sheet.cell(row=current_excel_row, column=1, value=slot_display_text); slot_cell_empty.alignment = cell_alignment_wrapped_center; slot_cell_empty.border = cell_border; slot_cell_empty.font = slot_time_font
                    for empty_col_idx in range(2, len(excel_main_headers) + 1): sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
                    sheet.row_dimensions[current_excel_row].height = 45; current_excel_row += 1; row_start_for_current_slot_merge = current_excel_row
                    continue

                for i, room_id in enumerate(rooms_in_this_slot_this_week):
                    if i == 0: slot_cell = sheet.cell(row=current_excel_row, column=1, value=slot_display_text); slot_cell.font = slot_time_font
                    else: slot_cell = sheet.cell(row=current_excel_row, column=1, value="")
                    slot_cell.alignment = cell_alignment_wrapped_center; slot_cell.border = cell_border
                    
                    room_cell = sheet.cell(row=current_excel_row, column=2, value=room_id); room_cell.alignment = cell_alignment_wrapped_center; room_cell.border = cell_border; room_cell.font = Font(name="Times New Roman", size=11)

                    current_data_col = 3 
                    for day_eng in schedule_days_eng:
                        lesson_content_str = ""
                        lessons_for_cell = lessons_this_week_by_room_slot_day.get((room_id, slot_id_current, day_eng), [])
                        if lessons_for_cell: 
                            lesson = lessons_for_cell[0]
                            subject_name = processed_data.subject_map.get(lesson['subject_id'], {}).get('name', lesson['subject_id'])
                            lesson_content_str = f"Lớp: {lesson['class_id']}\nMôn: {subject_name} ({lesson['lesson_type']})\nGV: {lesson['lecturer_id']}"
                        
                        data_cell = sheet.cell(row=current_excel_row, column=current_data_col, value=lesson_content_str); data_cell.alignment = cell_alignment_wrapped_center; data_cell.border = cell_border; data_cell.font = Font(name="Times New Roman", size=10)
                        current_data_col += 1
                    sheet.row_dimensions[current_excel_row].height = 75; current_excel_row += 1 
                
                if rooms_in_this_slot_this_week:
                    num_rooms_in_slot = len(rooms_in_this_slot_this_week)
                    if num_rooms_in_slot > 1: sheet.merge_cells(start_row=row_start_for_current_slot_merge, start_column=1, end_row=row_start_for_current_slot_merge + num_rooms_in_slot - 1, end_column=1)
                    row_start_for_current_slot_merge = current_excel_row

        sheet.column_dimensions[get_column_letter(1)].width = 20 
        sheet.column_dimensions[get_column_letter(2)].width = 15 
        for i in range(3, len(excel_main_headers) + 1): sheet.column_dimensions[get_column_letter(i)].width = 30

    output_filename_room = f"{output_folder}/TKB_HocKy_PhongHoc.xlsx"
    if os.path.exists(output_filename_room):
        try: os.remove(output_filename_room)
        except OSError as e: print(f"Error removing old room file {output_filename_room}: {e}. Please close the file if it's open."); return
    try:
        workbook_room.save(output_filename_room)
        print(f"Generated Excel for Room Schedules (all weeks) at {output_filename_room}")
    except OSError as e:
        print(f"Error saving Excel file {output_filename_room}: {e}. Please ensure the file is not open elsewhere.")

def export_semester_schedule_to_excel(semester_schedule_by_class, processed_data, output_folder="results"):
    """
    Exports the semester schedule to multiple Excel files, one for each week,
    with days of the week as columns and enhanced formatting.

    Args:
        semester_schedule_by_class (dict): The semester schedule, 
            e.g., {class_id: [week_0_lessons, week_1_lessons, ...]}
        processed_data (DataProcessor): The processed data object.
        output_folder (str): Folder to save the Excel files.
    """
    if not semester_schedule_by_class:
        print("No semester schedule data to export.")
        return

    days_of_week_map = {
        "Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4",
        "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "Chủ Nhật"
    }
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    # Tạo tiêu đề cột cho các Thứ trong tuần
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    
    time_slots_info = processed_data.data['time_slots']
    
    # Tiêu đề chính cho bảng Excel
    excel_main_headers = ["Slot Thời Gian", "Lớp", "SL SV"] + day_column_headers

    # Định nghĩa các Styles để tái sử dụng
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="4A86E8", end_color="4A86E8", fill_type="solid") # Màu xanh dương nhạt hơn
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    
    # Define colors for lesson types
    theory_fill = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")  # Light blue for theory
    practice_fill = PatternFill(start_color="FFE699", end_color="FFE699", fill_type="solid")  # Light orange for practice

    # University header information
    university_header = [
        "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
        "CANTHO UNIVERSITY SOFTWARE CENTER",
        "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
    ]
    university_header_font = Font(name="Times New Roman", size=12, bold=True)
    university_subheader_font = Font(name="Times New Roman", size=11)
    university_contact_font = Font(name="Times New Roman", size=10)

    # Xác định số tuần tối đa cần tạo file
    max_weeks = 0
    if semester_schedule_by_class: 
        if any(s for s_list in semester_schedule_by_class.values() for s in s_list): # Check if any lesson exists
            max_weeks = max(len(schedules) for schedules in semester_schedule_by_class.values() if schedules)
        if max_weeks == 0 and processed_data.class_map:
             max_weeks = max(cls.get('program_duration_weeks', 0) for cls in processed_data.class_map.values())

    # Create a single workbook for all weeks
    workbook = openpyxl.Workbook()
    is_first_sheet = True

    for week_idx in range(max_weeks):
        week_num_display = week_idx + 1
        if is_first_sheet:
            sheet = workbook.active
            sheet.title = f"Tuan_{week_num_display}"
            is_first_sheet = False
        else:
            sheet = workbook.create_sheet(title=f"Tuan_{week_num_display}")

        current_row_for_header = 1
        sheet.cell(row=current_row_for_header, column=1, value=university_header[0]).font = university_header_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 25
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header+=1
        sheet.row_dimensions[current_row_for_header].height = 10
        current_row_for_header+=1

        # --- Bắt đầu định dạng ---

        # 1. Tiêu đề chính của Sheet (moved to row 5)
        sheet.merge_cells(start_row=5, start_column=1, end_row=5, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=5, column=1, value=f"THỜI KHÓA BIỂU TUẦN {week_num_display}")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[5].height = 30
        
        current_excel_row = 7  # Adjusted starting row due to added headers

        # 2. Ghi dòng tiêu đề chính của bảng (Slot Thời Gian, Lớp, SL SV, Thứ 2, Thứ 3, ...)
        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment_center
            cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35 
        current_excel_row += 1

        # Thu thập tất cả các tiết học của tuần này để xử lý
        all_lessons_this_week = []
        for class_id_key, weekly_schedules_val in semester_schedule_by_class.items():
            if week_idx < len(weekly_schedules_val) and weekly_schedules_val[week_idx]:
                all_lessons_this_week.extend(weekly_schedules_val[week_idx])
        
        if not all_lessons_this_week: 
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có lịch học trong tuần này.")
            empty_msg_cell.font = Font(italic=True, name="Times New Roman", size=11)
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center")
            continue

        # 3. Lặp qua từng Slot Thời Gian để điền dữ liệu
        row_start_for_current_slot_merge = current_excel_row 
        for ts_info in time_slots_info:
            slot_id_current = ts_info['slot_id']
            slot_display_text = f"{ts_info['slot_id']}\n({ts_info['start']}-{ts_info['end']})"
            
            # Lấy danh sách các lớp có lịch vào Slot Thời Gian này (đã sắp xếp)
            classes_in_this_slot = sorted(list(set(
                l['class_id'] for l in all_lessons_this_week if l['slot_id'] == slot_id_current
            )))

            if not classes_in_this_slot: 
                # Option: Ghi dòng cho slot trống hoặc bỏ qua
                # Ghi dòng cho slot trống:
                slot_cell_empty = sheet.cell(row=current_excel_row, column=1, value=slot_display_text)
                slot_cell_empty.alignment = cell_alignment_wrapped_center
                slot_cell_empty.border = cell_border
                slot_cell_empty.font = slot_time_font
                # Áp dụng border cho các ô còn lại trong dòng slot trống
                for empty_col_idx in range(2, len(excel_main_headers) + 1):
                    sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
                sheet.row_dimensions[current_excel_row].height = 45
                current_excel_row += 1
                row_start_for_current_slot_merge = current_excel_row # Cập nhật cho slot tiếp theo
                continue

            for i, class_id in enumerate(classes_in_this_slot):
                class_info = processed_data.class_map.get(class_id, {})
                class_size = class_info.get('size', 'N/A')
                
                # Cột "Slot Thời Gian"
                if i == 0: 
                    slot_cell = sheet.cell(row=current_excel_row, column=1, value=slot_display_text)
                    slot_cell.font = slot_time_font # In đậm Slot
                else: 
                    slot_cell = sheet.cell(row=current_excel_row, column=1, value="") 
                slot_cell.alignment = cell_alignment_wrapped_center
                slot_cell.border = cell_border


                # Cột "Lớp"
                class_cell = sheet.cell(row=current_excel_row, column=2, value=class_id)
                class_cell.alignment = cell_alignment_wrapped_center
                class_cell.border = cell_border
                class_cell.font = Font(name="Times New Roman", size=11)

                # Cột "SL SV"
                slsv_cell = sheet.cell(row=current_excel_row, column=3, value=class_size)
                slsv_cell.alignment = cell_alignment_wrapped_center
                slsv_cell.border = cell_border
                slsv_cell.font = Font(name="Times New Roman", size=11)

                # Các cột Thứ trong tuần
                current_data_col = 4 
                for day_eng in schedule_days_eng:
                    lesson_content_str = ""
                    found_lesson_for_day_slot_class = None
                    
                    for lesson in all_lessons_this_week:
                        if lesson['class_id'] == class_id and \
                           lesson['slot_id'] == slot_id_current and \
                           lesson['day'] == day_eng:
                            found_lesson_for_day_slot_class = lesson
                            break 
                    
                    if found_lesson_for_day_slot_class:
                        subject_details = processed_data.subject_map.get(found_lesson_for_day_slot_class['subject_id'], {})
                        subject_name = subject_details.get('name', found_lesson_for_day_slot_class['subject_id'])
                        
                        lesson_type_vi = "Lý thuyết" if found_lesson_for_day_slot_class['lesson_type'] == "theory" else "Thực hành"
                        lesson_content_str = (
                            f"{subject_name}\n"
                            f"({lesson_type_vi})\n"
                            f"Phòng: {found_lesson_for_day_slot_class['room_id']}\n"
                            f"GV: {found_lesson_for_day_slot_class['lecturer_name']}"
                        )

                        # Apply color based on lesson type
                        lesson_fill = theory_fill if found_lesson_for_day_slot_class['lesson_type'] == "theory" else practice_fill
                    
                    data_cell = sheet.cell(row=current_excel_row, column=current_data_col, value=lesson_content_str)
                    data_cell.alignment = cell_alignment_wrapped_center
                    data_cell.border = cell_border
                    data_cell.font = Font(name="Times New Roman", size=10)
                    if found_lesson_for_day_slot_class:
                        data_cell.fill = lesson_fill
                    current_data_col += 1
                
                sheet.row_dimensions[current_excel_row].height = 60 
                current_excel_row += 1
            
            if classes_in_this_slot:
                num_classes_in_slot = len(classes_in_this_slot)
                if num_classes_in_slot > 1:
                    sheet.merge_cells(start_row=row_start_for_current_slot_merge, start_column=1,
                                      end_row=row_start_for_current_slot_merge + num_classes_in_slot - 1, end_column=1)
                row_start_for_current_slot_merge = current_excel_row 

        # 4. Điều chỉnh độ rộng cột
        sheet.column_dimensions[get_column_letter(1)].width = 20 # Slot Thời Gian
        sheet.column_dimensions[get_column_letter(2)].width = 15 # Lớp
        sheet.column_dimensions[get_column_letter(3)].width = 8  # SL SV
        for i in range(4, len(excel_main_headers) + 1): # Các cột Thứ
            sheet.column_dimensions[get_column_letter(i)].width = 28 
        
    # Save the workbook to a single file
    output_filename = f"{output_folder}/TKB_Semester_Schedule.xlsx"

    # Delete the old file if it exists
    if os.path.exists(output_filename):
        os.remove(output_filename)

    # Save the new file
    workbook.save(output_filename)
    print(f"Generated Excel file with all weeks at {output_filename}")