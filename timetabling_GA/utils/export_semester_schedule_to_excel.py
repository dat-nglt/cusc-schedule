import os
from datetime import datetime, timedelta
from collections import defaultdict
from pprint import pprint
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter


def export_semester_schedule_to_excel(semester_schedule_json, output_folder="results"):
    """
    Xuất lịch trình học kỳ từ JSON ra file Excel với logic chính xác:
    - Tuần học tính từ thứ 2 đến chủ nhật
    - Chỉ hiển thị lịch học từ ngày bắt đầu học kỳ
    - Các ngày trước ngày bắt đầu trong tuần đầu để trống
    - Tô màu đỏ nhạt cho tiết thực hành
    """
    
    
    if not semester_schedule_json:
        print("Không có dữ liệu lịch trình học kỳ để xuất. Đã dừng thao tác.")
        return

    # --- Cấu hình ánh xạ và kiểu dáng ---
    days_of_week_index_map = {
        "Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3,
        "Fri": 4, "Sat": 5, "Sun": 6
    }
    
    index_to_day_name_map = {
        0: "Thứ 2", 1: "Thứ 3", 2: "Thứ 4", 3: "Thứ 5",
        4: "Thứ 6", 5: "Thứ 7", 6: "Chủ Nhật"
    }

    # Tìm ngày bắt đầu học kỳ (ngày đầu tiên có lịch học)
    start_date = None
    for class_schedules in semester_schedule_json.values():
        for week_schedule in class_schedules:
            for lesson in week_schedule:
                if lesson.get('date'):
                    lesson_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
                    if start_date is None or lesson_date < start_date:
                        start_date = lesson_date
    
    if not start_date:
        print("Không tìm thấy ngày học nào trong dữ liệu.")
        return

    print(f"Ngày bắt đầu học kỳ: {start_date.strftime('%d/%m/%Y')}")

    # Xác định thứ của ngày bắt đầu
    start_day_of_week = start_date.strftime('%a')
    
    # Tính ngày thứ 2 của tuần chứa ngày bắt đầu
    days_to_monday = days_of_week_index_map.get(start_day_of_week, 0)
    week_start_date = start_date - timedelta(days=days_to_monday)
    
    # Tìm ngày cuối cùng có lịch học
    last_lesson_date = start_date
    for class_schedules in semester_schedule_json.values():
        for week_schedule in class_schedules:
            for lesson in week_schedule:
                if lesson.get('date'):
                    lesson_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
                    if lesson_date > last_lesson_date:
                        last_lesson_date = lesson_date

    # Tạo danh sách các tuần học (từ thứ 2 đến chủ nhật)
    weeks = []
    current_week_start = week_start_date
    while current_week_start <= last_lesson_date:
        week_end_date = current_week_start + timedelta(days=6)
        weeks.append((current_week_start, week_end_date))
        current_week_start += timedelta(days=7)

    # --- Tạo workbook Excel ---
    workbook = openpyxl.Workbook()
    if len(workbook.worksheets) > 0:
        workbook.remove(workbook.worksheets[0])

    # --- Định nghĩa kiểu dáng ---
    header_font = Font(bold=True, color="FFFFFF", name="Times New Roman", size=11)
    sheet_title_font = Font(bold=True, size=16, name="Times New Roman")
    slot_time_font = Font(bold=True, name="Times New Roman", size=11)
    university_header_font = Font(name="Times New Roman", size=12, bold=True)
    university_subheader_font = Font(name="Times New Roman", size=11)
    university_contact_font = Font(name="Times New Roman", size=10)

    header_fill = PatternFill(start_color="4A86E8", end_color="4A86E8", fill_type="solid")
    theory_fill = PatternFill(start_color="BDD7EE", end_color="BDD7EE", fill_type="solid")
    practice_fill = PatternFill(start_color="FFCCCB", end_color="FFCCCB", fill_type="solid")

    cell_alignment = Alignment(wrap_text=True, horizontal='center', vertical='center')
    header_alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)

    thin_border = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border, right=thin_border, top=thin_border, bottom=thin_border)

    # --- Tạo các sheet cho từng tuần ---
    for week_num, (week_start, week_end) in enumerate(weeks, 1):
        sheet = workbook.create_sheet(title=f"Tuần_{week_num}")
        
        # --- Header trường đại học ---
        current_row = 1
        university_header = [
            "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
            "CANTHO UNIVERSITY SOFTWARE CENTER",
            "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
        ]
        
        for i, line in enumerate(university_header):
            sheet.cell(row=current_row, column=1, value=line)
            sheet.cell(row=current_row, column=1).font = university_header_font if i == 0 else university_subheader_font if i == 1 else university_contact_font
            sheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=7)
            sheet.cell(row=current_row, column=1).alignment = Alignment(horizontal="center", vertical="center")
            current_row += 1
        
        current_row += 1
        
        # --- Tiêu đề sheet ---
        sheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=7)
        title_cell = sheet.cell(row=current_row, column=1, value=f"THỜI KHÓA BIỂU TUẦN {week_num}")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        current_row += 2
        
       # --- Tiêu đề cột và ngày (gộp làm 1 dòng) ---
        current_date = week_start
        headers = ["Slot Thời Gian", "Lớp", "SL SV"] + list(index_to_day_name_map.values())

        for col_idx, header in enumerate(headers, 1):
            if col_idx <= 3:  # Các cột thông tin cơ bản
                cell = sheet.cell(row=current_row, column=col_idx, value=header)
                cell.fill = header_fill
            else:  # Các cột ngày trong tuần
                day_display = f"{header}\n{current_date.strftime('%d/%m')}"
                cell = sheet.cell(row=current_row, column=col_idx, value=day_display)
                
                # Tô màu header dù là ngày trước hay sau ngày bắt đầu
                cell.fill = header_fill
                current_date += timedelta(days=1)
            
            cell.font = header_font
            cell.alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
            cell.border = cell_border

        # Điều chỉnh chiều cao dòng cho phù hợp
        sheet.row_dimensions[current_row].height = 40
        current_row += 1
        # --- Lấy dữ liệu lịch học trong tuần này ---
        week_lessons = []
        current_date = week_start
        while current_date <= week_end:
            if current_date >= start_date:  # Chỉ lấy từ ngày bắt đầu học kỳ
                date_str = current_date.strftime('%Y-%m-%d')
                day_name = current_date.strftime('%a')
                
                for class_id, class_schedules in semester_schedule_json.items():
                    for week_schedule in class_schedules:
                        for lesson in week_schedule:
                            if lesson.get('date') == date_str and lesson['day'] == day_name:
                                lesson_copy = lesson.copy()
                                lesson_copy['class_id'] = class_id
                                week_lessons.append(lesson_copy)
            current_date += timedelta(days=1)
        
        # --- Nhóm dữ liệu theo slot và lớp ---
        schedule_grid = defaultdict(lambda: defaultdict(dict))
        for lesson in week_lessons:
            schedule_grid[(lesson['slot_id'], lesson['class_id'])][lesson['day']] = lesson
        
        # --- Đổ dữ liệu vào sheet ---
        for (slot_id, class_id), day_lessons in sorted(schedule_grid.items()):
            # Lấy sĩ số lớp
            class_size = next((l['size'] for l in week_lessons if l['class_id'] == class_id), 'N/A')
            
            # Ghi thông tin slot, lớp, sĩ số
            sheet.cell(row=current_row, column=1, value=slot_id).font = slot_time_font
            sheet.cell(row=current_row, column=2, value=class_id)
            sheet.cell(row=current_row, column=3, value=class_size)
            
            # Ghi lịch học từng ngày
            current_date = week_start
            for col_idx in range(4, 11):
                day_name = current_date.strftime('%a')
                if day_name in day_lessons and current_date >= start_date:
                    lesson = day_lessons[day_name]
                    # print(f"Tiết học: {lesson}")
                    lesson_type = "Lý thuyết" if lesson['lesson_type'] == "theory" else "Thực hành"
                    content = f"{lesson['subject_id']}\n({lesson_type})\nPhòng: {lesson['room_id']}\nGV: {lesson['lecturer_id']}"
                    
                    cell = sheet.cell(row=current_row, column=col_idx, value=content)
                    cell.fill = theory_fill if lesson['lesson_type'] == "theory" else practice_fill
                
                # Áp dụng kiểu dáng chung
                sheet.cell(row=current_row, column=col_idx).alignment = cell_alignment
                sheet.cell(row=current_row, column=col_idx).border = cell_border
                
                current_date += timedelta(days=1)
            
            # Áp dụng kiểu dáng cho các cột cơ bản
            for col in [1, 2, 3]:
                sheet.cell(row=current_row, column=col).alignment = cell_alignment
                sheet.cell(row=current_row, column=col).border = cell_border
            
            sheet.row_dimensions[current_row].height = 60
            current_row += 1

        # --- Hợp nhất các ô slot thời gian giống nhau ---
        merge_slot_cells(sheet, date_row=current_row - len(schedule_grid))
        
        # --- Điều chỉnh độ rộng cột ---
        sheet.column_dimensions['A'].width = 15  # Slot
        sheet.column_dimensions['B'].width = 12  # Lớp
        sheet.column_dimensions['C'].width = 8   # Sĩ số
        for col in ['D', 'E', 'F', 'G', 'H', 'I', 'J']:
            sheet.column_dimensions[col].width = 25

    # --- Lưu file Excel ---
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, "TKB_Hoc_Ky.xlsx")
    
    try:
        if os.path.exists(output_path):
            os.remove(output_path)
        workbook.save(output_path)
        print(f"🎉 Đã xuất thành công file Excel tại: {output_path}")
    except Exception as e:
        print(f"❌ Lỗi khi lưu file Excel: {str(e)}")

def merge_slot_cells(sheet, date_row):
    """Hợp nhất các ô slot thời gian giống nhau"""
    current_slot = None
    merge_start = date_row
    
    for row in range(date_row, sheet.max_row + 1):
        slot_value = sheet.cell(row=row, column=1).value
        
        if slot_value != current_slot:
            if current_slot is not None and row - merge_start > 1:
                sheet.merge_cells(start_row=merge_start, start_column=1, end_row=row-1, end_column=1)
            merge_start = row
            current_slot = slot_value
    
    if sheet.max_row >= merge_start + 1:
        sheet.merge_cells(start_row=merge_start, start_column=1, end_row=sheet.max_row, end_column=1)