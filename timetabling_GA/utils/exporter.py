import openpyxl, os
from openpyxl.styles import Font, Alignment, Border, Side, PatternFill
from openpyxl.utils import get_column_letter
from openpyxl import Workbook
from collections import defaultdict


def export_lecturer_view_to_excel(lecturer_semester_view, processed_data, output_folder="results"):
    """
    Exports the semester schedule for each lecturer to a single Excel file,
    with each sheet representing a week.
    
    Args:
        lecturer_semester_view (dict): The semester schedule, 
            e.g., {lecturer_id: {week_num: [lesson_list, ...]}}
        processed_data (DataProcessor): The processed data object.
        output_folder (str): Folder to save the Excel files.
    """
    if not lecturer_semester_view:
        print("No lecturer schedule data to export.")
        return
    
    time_slots_info = processed_data.data['time_slots']

    # Lấy thông tin cần thiết từ processed_data (được lưu từ trước)
    days_of_week_map = {"Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4", "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"}
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    
    # Tạo slot_map tạm thời từ dữ liệu có sẵn
    slot_map = {s['slot_id']: s for s in processed_data.data['time_slots']}
    
    excel_main_headers = ["Slot Thời Gian", "Giảng Viên"] + day_column_headers

    # Styles
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="4A86E8", end_color="4A86E8", fill_type="solid")
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    theory_fill = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")
    practice_fill = PatternFill(start_color="FFE699", end_color="FFE699", fill_type="solid")

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
        # Get the maximum week number from the data
        all_weeks_with_data = {week_num for lecturer_data in lecturer_semester_view.values() for week_num in lecturer_data.keys()}
        if all_weeks_with_data:
            max_weeks = max(all_weeks_with_data)

    if max_weeks == 0:
        print("No schedule data found for any week. Exiting.")
        return

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
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        sheet.row_dimensions[current_row_for_header].height = 10
        current_row_for_header += 1

        title_row = current_row_for_header
        sheet.merge_cells(start_row=title_row, start_column=1, end_row=title_row, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=title_row, column=1, value=f"LỊCH DẠY GIẢNG VIÊN - TUẦN {week_num_display}")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[title_row].height = 30
        
        current_excel_row = title_row + 2
        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment_center
            cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35
        current_excel_row += 1
        
        # --- Collect and sort data for the current week ---
        all_lessons_this_week = []
        for lecturer_id, weekly_data in lecturer_semester_view.items():
            if week_num_display in weekly_data:
                # Gán lecturer_id vào mỗi lesson để đảm bảo có thể sort
                for lesson in weekly_data[week_num_display]:
                    lesson['lecturer_id'] = lecturer_id
                all_lessons_this_week.extend(weekly_data[week_num_display])

        if not all_lessons_this_week:
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có giảng viên nào có lịch dạy trong tuần này.")
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center")
            empty_msg_cell.font = Font(italic=True, name="Times New Roman")
            
            for empty_col_idx in range(1, len(excel_main_headers) + 1):
                sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
            continue

        # Sắp xếp danh sách
        all_lessons_this_week.sort(key=lambda x: (processed_data.slot_order_map.get(x['slot_id'], 99), x['lecturer_id']))

        schedule_grid = defaultdict(lambda: defaultdict(dict))
        for lesson in all_lessons_this_week:
            slot_id = lesson['slot_id']
            lecturer_id = lesson['lecturer_id']
            day = lesson['day']
            schedule_grid[(slot_id, lecturer_id)][day] = lesson
        
        sorted_schedule_keys = sorted(schedule_grid.keys(), key=lambda x: (processed_data.slot_order_map.get(x[0], 99), x[1]))

        # --- Populate the sheet with data ---
        previous_slot_id = None
        for slot_id, lecturer_id in sorted_schedule_keys:
            lecturer_name = processed_data.lecturer_map.get(lecturer_id, {}).get('lecturer_name', lecturer_id)
            
            if slot_id != previous_slot_id:
                slot_cell = sheet.cell(row=current_excel_row, column=1, value=f"{slot_id}\n({slot_map.get(slot_id,{}).get('start', '')}-{slot_map.get(slot_id,{}).get('end', '')})")
                slot_cell.font = slot_time_font
                slot_cell.alignment = cell_alignment_wrapped_center
                sheet.row_dimensions[current_excel_row].height = 60
            
            lect_cell = sheet.cell(row=current_excel_row, column=2, value=lecturer_name)
            lect_cell.alignment = cell_alignment_wrapped_center
            
            for col_idx, day_eng in enumerate(schedule_days_eng, start=3):
                lesson_content = schedule_grid[(slot_id, lecturer_id)].get(day_eng)
                cell = sheet.cell(row=current_excel_row, column=col_idx)
                
                if lesson_content:
                    subject_details = processed_data.subject_map.get(lesson_content['subject_id'], {})
                    subject_name = subject_details.get('name', lesson_content['subject_id'])
                    lesson_type_vi = "Lý thuyết" if lesson_content['lesson_type'] == "theory" else "Thực hành"
                    lesson_content_str = (
                        f"Lớp: {lesson_content['class_id']}\n"
                        f"Môn: {subject_name}\n"
                        f"Phòng: {lesson_content['room_id']}\n"
                        f"({lesson_type_vi})"
                    )
                    cell.value = lesson_content_str
                    cell.fill = theory_fill if lesson_content['lesson_type'] == "theory" else practice_fill
                else:
                    cell.value = ""
                
                cell.alignment = cell_alignment_wrapped_center
                cell.border = cell_border
            
            sheet.cell(row=current_excel_row, column=1).border = cell_border
            sheet.cell(row=current_excel_row, column=2).border = cell_border
            
            current_excel_row += 1
            previous_slot_id = slot_id

        # Merge "Slot Thời Gian" cells
        current_row = title_row + 3
        for ts_info in time_slots_info:
            slot_id = ts_info['slot_id']
            start_merge_row = current_row
            
            while current_row <= sheet.max_row and sheet.cell(row=current_row, column=1).value and sheet.cell(row=current_row, column=1).value.startswith(slot_id):
                current_row += 1
            
            if current_row - start_merge_row > 1:
                sheet.merge_cells(start_row=start_merge_row, start_column=1, end_row=current_row - 1, end_column=1)

        # Set column widths
        sheet.column_dimensions[get_column_letter(1)].width = 18 
        sheet.column_dimensions[get_column_letter(2)].width = 25 
        for i in range(3, len(excel_main_headers) + 1):
            sheet.column_dimensions[get_column_letter(i)].width = 30
    
    # Save the file
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    output_filename = os.path.join(output_folder, "TKB_HocKy_GiangVien.xlsx")
    if os.path.exists(output_filename):
        try: 
            os.remove(output_filename)
        except OSError as e:
            print(f"Error removing old lecturer file {output_filename}: {e}. Please close the file if it's open.")
            return

    try:
        workbook_lecturer.save(output_filename)
        print(f"Generated Excel for Lecturer Schedules (all weeks) at {output_filename}")
    except OSError as e:
        print(f"Error saving Excel file {output_filename}: {e}. Please ensure the file is not open elsewhere.")
        
def export_room_view_to_excel(room_semester_view, processed_data, output_folder="results"):
    """
    Xuất lịch sử dụng phòng ra một file Excel, mỗi tuần một sheet.
    
    Args:
        room_semester_view (dict): The semester schedule, 
            e.g., {room_id: {week_num: [lesson_list, ...]}}
        processed_data (DataProcessor): The processed data object.
        output_folder (str): Folder to save the Excel files.
    """
    if not room_semester_view:
        print("No room schedule data to export.")
        return

    days_of_week_map = {"Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4", "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "CN"}
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    
    slot_map = {s['slot_id']: s for s in processed_data.data.get('time_slots', [])}
    time_slots_info = processed_data.data.get('time_slots', [])
    excel_main_headers = ["Slot Thời Gian", "Phòng"] + day_column_headers
    
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="6AA84F", end_color="6AA84F", fill_type="solid")
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    theory_fill = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")
    practice_fill = PatternFill(start_color="FFE699", end_color="FFE699", fill_type="solid")

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

    if max_weeks == 0:
        print("No schedule data found for any week. Exiting.")
        return

    workbook_room = openpyxl.Workbook()
    is_first_room_sheet = True

    for week_num_display in range(1, max_weeks + 1):
        if is_first_room_sheet:
            sheet = workbook_room.active
            sheet.title = f"Phong_Tuan_{week_num_display}"
            is_first_room_sheet = False
        else:
            sheet = workbook_room.create_sheet(title=f"Phong_Tuan_{week_num_display}")

        current_row_for_header = 1
        sheet.cell(row=current_row_for_header, column=1, value=university_header[0]).font = university_header_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 25
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        sheet.row_dimensions[current_row_for_header].height = 10
        current_row_for_header += 1

        title_row = current_row_for_header
        sheet.merge_cells(start_row=title_row, start_column=1, end_row=title_row, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=title_row, column=1, value=f"LỊCH SỬ DỤNG PHÒNG - TUẦN {week_num_display}")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[title_row].height = 30
        
        current_excel_row = title_row + 2
        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment_center
            cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35
        current_excel_row += 1

        all_lessons_this_week = []
        for room_id, weekly_data in room_semester_view.items():
            if week_num_display in weekly_data:
                for lesson in weekly_data[week_num_display]:
                    lesson['room_id'] = room_id
                    lecturer_id = lesson.get('lecturer_id')
                    lecturer_name = processed_data.lecturer_map.get(lecturer_id, {}).get('lecturer_name', lecturer_id)
                    lesson['lecturer_name'] = lecturer_name
                    
                all_lessons_this_week.extend(weekly_data[week_num_display])

        if not all_lessons_this_week:
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có phòng nào được sử dụng trong tuần này.")
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center")
            empty_msg_cell.font = Font(italic=True, name="Times New Roman")
            
            for empty_col_idx in range(1, len(excel_main_headers) + 1):
                sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
            continue

        all_lessons_this_week.sort(key=lambda x: (processed_data.slot_order_map.get(x['slot_id'], 99), x['room_id']))

        schedule_grid = defaultdict(lambda: defaultdict(dict))
        for lesson in all_lessons_this_week:
            slot_id = lesson['slot_id']
            room_id = lesson['room_id']
            day = lesson['day']
            schedule_grid[(slot_id, room_id)][day] = lesson

        sorted_schedule_keys = sorted(schedule_grid.keys(), key=lambda x: (processed_data.slot_order_map.get(x[0], 99), x[1]))

        previous_slot_id = None
        for slot_id, room_id in sorted_schedule_keys:
            if slot_id != previous_slot_id:
                slot_cell = sheet.cell(row=current_excel_row, column=1, value=f"{slot_id}\n({slot_map.get(slot_id, {}).get('start', '')}-{slot_map.get(slot_id, {}).get('end', '')})")
                slot_cell.font = slot_time_font
                slot_cell.alignment = cell_alignment_wrapped_center
                sheet.row_dimensions[current_excel_row].height = 60
            
            room_cell = sheet.cell(row=current_excel_row, column=2, value=room_id)
            room_cell.alignment = cell_alignment_wrapped_center
            
            for col_idx, day_eng in enumerate(schedule_days_eng, start=3):
                lesson_content = schedule_grid[(slot_id, room_id)].get(day_eng)
                cell = sheet.cell(row=current_excel_row, column=col_idx)
                
                if lesson_content:
                    subject_details = processed_data.subject_map.get(lesson_content['subject_id'], {})
                    subject_name = subject_details.get('name', lesson_content['subject_id'])
                    lesson_type_vi = "Lý thuyết" if lesson_content['lesson_type'] == "theory" else "Thực hành"
                    lesson_content_str = (
                        f"Lớp: {lesson_content['class_id']}\n"
                        f"Môn: {subject_name}\n"
                        # Dòng này sẽ không còn lỗi vì 'lecturer_name' đã được thêm vào
                        f"GV: {lesson_content['lecturer_name']}\n" 
                        f"({lesson_type_vi})"
                    )
                    cell.value = lesson_content_str
                    cell.fill = theory_fill if lesson_content['lesson_type'] == "theory" else practice_fill
                else:
                    cell.value = ""
                
                cell.alignment = cell_alignment_wrapped_center
                cell.border = cell_border
            
            sheet.cell(row=current_excel_row, column=1).border = cell_border
            sheet.cell(row=current_excel_row, column=2).border = cell_border
            
            current_excel_row += 1
            previous_slot_id = slot_id

        current_row = title_row + 3
        for ts_info in time_slots_info:
            slot_id = ts_info['slot_id']
            start_merge_row = current_row
            
            while current_row <= sheet.max_row and sheet.cell(row=current_row, column=1).value and sheet.cell(row=current_row, column=1).value.startswith(slot_id):
                current_row += 1
            
            if current_row - start_merge_row > 1:
                sheet.merge_cells(start_row=start_merge_row, start_column=1, end_row=current_row - 1, end_column=1)

        sheet.column_dimensions[get_column_letter(1)].width = 18 
        sheet.column_dimensions[get_column_letter(2)].width = 15
        for i in range(3, len(excel_main_headers) + 1):
            sheet.column_dimensions[get_column_letter(i)].width = 30
    
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    output_filename = os.path.join(output_folder, "TKB_HocKy_PhongHoc.xlsx")
    if os.path.exists(output_filename):
        try: 
            os.remove(output_filename)
        except OSError as e:
            print(f"Error removing old room file {output_filename}: {e}. Please close the file if it's open.")
            return

    try:
        workbook_room.save(output_filename)
        print(f"Generated Excel for Room Schedules (all weeks) at {output_filename}")
    except OSError as e:
        print(f"Error saving Excel file {output_filename}: {e}. Please ensure the file is not open elsewhere.")
        
def export_semester_schedule_to_excel(semester_schedule_by_class, processed_data, output_folder="results"):
    """
    Exports the semester schedule to a single Excel file with multiple sheets (one for each week).
    
    Args:
        semester_schedule_by_class (dict): The semester schedule, 
            e.g., {class_id: [week_0_lessons, week_1_lessons, ...]}
        processed_data (DataProcessor): The processed data object.
        output_folder (str): Folder to save the Excel files.
    """
    if not semester_schedule_by_class:
        print("No semester schedule data to export.")
        return

    # Lấy thông tin cần thiết từ processed_data (được lưu từ trước)
    days_of_week_map = {
        "Mon": "Thứ 2", "Tue": "Thứ 3", "Wed": "Thứ 4",
        "Thu": "Thứ 5", "Fri": "Thứ 6", "Sat": "Thứ 7", "Sun": "Chủ Nhật"
    }
    
    # Tạo slot_map tạm thời từ dữ liệu có sẵn
    slot_map = {s['slot_id']: s for s in processed_data.data['time_slots']}
    
    schedule_days_eng = processed_data.data.get('days_of_week', ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"])
    day_column_headers = [days_of_week_map.get(day_eng, day_eng) for day_eng in schedule_days_eng]
    excel_main_headers = ["Slot Thời Gian", "Lớp", "SL SV"] + day_column_headers
    
    # Định nghĩa các Styles để tái sử dụng
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    header_fill = PatternFill(start_color="4A86E8", end_color="4A86E8", fill_type="solid")
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    cell_alignment_wrapped_center = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment_center = Alignment(horizontal='center', vertical='center', wrap_text=True)
    thin_border_side = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border_side, right=thin_border_side, top=thin_border_side, bottom=thin_border_side)
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    theory_fill = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")
    practice_fill = PatternFill(start_color="FFE699", end_color="FFE699", fill_type="solid")
    
    university_header = [
        "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
        "CANTHO UNIVERSITY SOFTWARE CENTER",
        "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
    ]
    university_header_font = Font(name="Times New Roman", size=12, bold=True)
    university_subheader_font = Font(name="Times New Roman", size=11)
    university_contact_font = Font(name="Times New Roman", size=10)

    # Xác định số tuần tối đa
    max_weeks = 0
    if semester_schedule_by_class:
        for schedules in semester_schedule_by_class.values():
            max_weeks = max(max_weeks, len(schedules))
    
    if max_weeks == 0:
        # Nếu semester_schedule_by_class rỗng, lấy số tuần từ data ban đầu
        max_weeks = max(
            (processed_data.semester_map.get(s['semester_id'], {}).get('duration_weeks', 0)
            for prog in processed_data.data.get('programs', [])
            for s in prog.get('semesters', [])), default=0
        )
    
    if max_weeks == 0:
        print("Could not determine semester duration. Export aborted.")
        return
        
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
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[1]).font = university_subheader_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        
        sheet.cell(row=current_row_for_header, column=1, value=university_header[2]).font = university_contact_font
        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        sheet.cell(row=current_row_for_header, column=1).alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 20
        current_row_for_header += 1
        sheet.row_dimensions[current_row_for_header].height = 10
        current_row_for_header += 1

        sheet.merge_cells(start_row=current_row_for_header, start_column=1, end_row=current_row_for_header, end_column=len(excel_main_headers))
        title_cell = sheet.cell(row=current_row_for_header, column=1, value=f"THỜI KHÓA BIỂU TUẦN {week_num_display}")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        sheet.row_dimensions[current_row_for_header].height = 30
        
        current_excel_row = current_row_for_header + 2 

        for col_idx, header_text in enumerate(excel_main_headers, start=1):
            cell = sheet.cell(row=current_excel_row, column=col_idx, value=header_text)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = header_alignment_center
            cell.border = cell_border
        sheet.row_dimensions[current_excel_row].height = 35
        current_excel_row += 1

        all_lessons_this_week = []
        for class_id_key, weekly_schedules_val in semester_schedule_by_class.items():
            if week_idx < len(weekly_schedules_val) and weekly_schedules_val[week_idx]:
                all_lessons_this_week.extend(weekly_schedules_val[week_idx])

        if not all_lessons_this_week:
            empty_msg_cell = sheet.cell(row=current_excel_row, column=1, value="Không có lịch học trong tuần này.")
            empty_msg_cell.font = Font(italic=True, name="Times New Roman", size=11)
            sheet.merge_cells(start_row=current_excel_row, start_column=1, end_row=current_excel_row, end_column=len(excel_main_headers))
            empty_msg_cell.alignment = Alignment(horizontal="center")
            
            for empty_col_idx in range(1, len(excel_main_headers) + 1):
                 sheet.cell(row=current_excel_row, column=empty_col_idx).border = cell_border
            continue
        
        all_lessons_this_week.sort(key=lambda x: (processed_data.slot_order_map[x['slot_id']], x['class_id']))
        
        schedule_grid = defaultdict(lambda: defaultdict(dict))
        for lesson in all_lessons_this_week:
            slot_id = lesson['slot_id']
            class_id = lesson['class_id']
            day = lesson['day']
            schedule_grid[(slot_id, class_id)][day] = lesson

        sorted_schedule_keys = sorted(schedule_grid.keys(), key=lambda x: (processed_data.slot_order_map[x[0]], x[1]))

        for slot_id, class_id in sorted_schedule_keys:
            class_info = processed_data.class_map.get(class_id, {})
            class_size = class_info.get('size', 'N/A')
            
            slot_cell = sheet.cell(row=current_excel_row, column=1, value=f"{slot_id}\n({slot_map[slot_id]['start']}-{slot_map[slot_id]['end']})")
            slot_cell.font = slot_time_font
            slot_cell.alignment = cell_alignment_wrapped_center
            sheet.row_dimensions[current_excel_row].height = 60
            
            class_cell = sheet.cell(row=current_excel_row, column=2, value=class_id)
            slsv_cell = sheet.cell(row=current_excel_row, column=3, value=class_size)
            class_cell.alignment = cell_alignment_wrapped_center
            slsv_cell.alignment = cell_alignment_wrapped_center
            
            for col_idx, day_eng in enumerate(schedule_days_eng, start=4):
                lesson_content = schedule_grid[(slot_id, class_id)].get(day_eng)
                cell = sheet.cell(row=current_excel_row, column=col_idx)
                
                if lesson_content:
                    subject_details = processed_data.subject_map.get(lesson_content['subject_id'], {})
                    lecturer_details = processed_data.lecturer_map.get(lesson_content['lecturer_id'], {})
                    subject_name = subject_details.get('name', lesson_content['subject_id'])
                    lecturer_name = lecturer_details.get('lecturer_name', lesson_content['lecturer_id'])
                    lesson_type_vi = "Lý thuyết" if lesson_content['lesson_type'] == "theory" else "Thực hành"
                    lesson_content_str = (
                        f"{subject_name}\n"
                        f"({lesson_type_vi})\n"
                        f"Phòng: {lesson_content['room_id']}\n"
                        f"GV: {lecturer_name}"
                    )
                    cell.value = lesson_content_str
                    cell.fill = theory_fill if lesson_content['lesson_type'] == "theory" else practice_fill
                else:
                    cell.value = ""
                
                cell.alignment = cell_alignment_wrapped_center
                cell.border = cell_border
            
            sheet.cell(row=current_excel_row, column=1).border = cell_border
            sheet.cell(row=current_excel_row, column=2).border = cell_border
            sheet.cell(row=current_excel_row, column=3).border = cell_border
            
            current_excel_row += 1

        current_row = 8
        for slot_info in processed_data.data['time_slots']:
            slot_id = slot_info['slot_id']
            start_merge_row = current_row
            end_merge_row = start_merge_row
            
            while end_merge_row <= sheet.max_row and sheet.cell(row=end_merge_row, column=1).value and sheet.cell(row=end_merge_row, column=1).value.startswith(f"{slot_id}\n"):
                end_merge_row += 1
            
            if end_merge_row - start_merge_row > 1:
                sheet.merge_cells(start_row=start_merge_row, start_column=1, end_row=end_merge_row - 1, end_column=1)
            
            current_row = end_merge_row
            
        sheet.column_dimensions[get_column_letter(1)].width = 20 
        sheet.column_dimensions[get_column_letter(2)].width = 15 
        sheet.column_dimensions[get_column_letter(3)].width = 8 
        for i in range(4, len(excel_main_headers) + 1):
            sheet.column_dimensions[get_column_letter(i)].width = 28
            
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
        
    output_filename = os.path.join(output_folder, "TKB_Semester_Schedule.xlsx")
    if os.path.exists(output_filename):
        os.remove(output_filename)

    workbook.save(output_filename)
    print(f"Generated Excel file with all weeks at {output_filename}")