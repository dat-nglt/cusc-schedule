import os
from datetime import datetime, timedelta
from collections import defaultdict
from typing import Dict, Any
from pprint import pprint
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter

def export_semester_schedule_to_excel(semester_schedule_json: Dict[str, Any], output_folder: str = "results") -> None:
    """
    Xuất lịch trình học kỳ từ dữ liệu JSON ra file Excel, mỗi tuần một sheet.

    Hàm này tạo một workbook Excel, sau đó tạo một sheet cho mỗi tuần học.
    Nó điền các ô với thông tin chi tiết về buổi học như tên môn học, loại tiết học,
    phòng và giảng viên. Các ô được định dạng với màu sắc và viền để dễ đọc hơn.

    Args:
        semester_schedule_json (Dict[str, Any]): Dữ liệu lịch trình của một học kỳ dưới dạng JSON.
        output_folder (str): Đường dẫn đến thư mục để lưu file Excel.
    """
    if not semester_schedule_json:
        print("Không có dữ liệu lịch trình học kỳ để xuất. Đã dừng thao tác.")
        return

    # --- Cấu hình ánh xạ và kiểu dáng ---
    # Ánh xạ tên ngày tiếng Anh sang chỉ số và tên tiếng Việt
    days_of_week_index_map = {
        "Mon": 0, "Tue": 1, "Wed": 2, "Thu": 3,
        "Fri": 4, "Sat": 5, "Sun": 6
    }
    index_to_day_name_map = {
        0: "Thứ 2", 1: "Thứ 3", 2: "Thứ 4", 3: "Thứ 5",
        4: "Thứ 6", 5: "Thứ 7", 6: "Chủ Nhật"
    }

    # Tìm ngày bắt đầu và kết thúc của học kỳ
    all_dates = []
    for class_schedules in semester_schedule_json.values():
        for week_schedule in class_schedules:
            for lesson in week_schedule:
                if 'date' in lesson:
                    all_dates.append(datetime.strptime(lesson['date'], '%Y-%m-%d'))
    
    if not all_dates:
        print("Không tìm thấy ngày học nào trong dữ liệu.")
        return

    start_date = min(all_dates)
    last_lesson_date = max(all_dates)
    
    print(f"Ngày bắt đầu học kỳ: {start_date.strftime('%d/%m/%Y')}")

    # Tính ngày thứ 2 của tuần đầu tiên có lịch học
    days_to_monday = days_of_week_index_map.get(start_date.strftime('%a'), 0)
    week_start_date = start_date - timedelta(days=days_to_monday)
    
    # Tạo danh sách các tuần học (từ thứ Hai đến Chủ Nhật)
    weeks = []
    current_week_start = week_start_date
    while current_week_start <= last_lesson_date:
        week_end_date = current_week_start + timedelta(days=6)
        weeks.append((current_week_start, week_end_date))
        current_week_start += timedelta(days=7)

    # --- Tạo workbook Excel ---
    workbook = openpyxl.Workbook()
    # Xóa sheet mặc định
    if len(workbook.worksheets) > 0:
        workbook.remove(workbook.worksheets[0])

    # --- Định nghĩa kiểu dáng cho các ô ---
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
    thin_border = Side(style='thin', color="000000")
    cell_border = Border(left=thin_border, right=thin_border, top=thin_border, bottom=thin_border)

    # --- Tạo các sheet cho từng tuần ---
    for week_num, (week_start, week_end) in enumerate(weeks, 1):
        sheet = workbook.create_sheet(title=f"Tuần_{week_num}")
        
        # --- Header trường đại học và tiêu đề sheet ---
        current_row = 1
        university_header = [
            "TRUNG TÂM CÔNG NGHỆ PHẦN MỀM ĐẠI HỌC CẦN THƠ",
            "CANTHO UNIVERSITY SOFTWARE CENTER",
            "Khu III, Đại học Cần Thơ - 01 Lý Tự Trọng, TP. Cần Thơ - Tel: 0292.3731072 & Fax: 0292.3731071 - Email: cusc@ctu.edu.vn"
        ]
        
        for i, line in enumerate(university_header):
            sheet.cell(row=current_row, column=1, value=line)
            sheet.cell(row=current_row, column=1).font = (
                university_header_font if i == 0 else 
                university_subheader_font if i == 1 else 
                university_contact_font
            )
            sheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=10)
            sheet.cell(row=current_row, column=1).alignment = Alignment(horizontal="center", vertical="center")
            current_row += 1
        
        current_row += 1
        
        sheet.merge_cells(start_row=current_row, start_column=1, end_row=current_row, end_column=10)
        title_cell = sheet.cell(row=current_row, column=1, value=f"THỜI KHÓA BIỂU TUẦN {week_num} ({week_start.strftime('%d/%m/%Y')} - {week_end.strftime('%d/%m/%Y')})")
        title_cell.font = sheet_title_font
        title_cell.alignment = Alignment(horizontal="center", vertical="center")
        current_row += 2
        
        # --- Tiêu đề các cột (Slot, Lớp, Sĩ số, và các ngày trong tuần) ---
        headers = ["Slot Thời Gian", "Lớp", "SL SV"]
        current_date = week_start
        for i in range(7):
            day_display = f"{index_to_day_name_map[i]}\n{current_date.strftime('%d/%m')}"
            headers.append(day_display)
            current_date += timedelta(days=1)

        for col_idx, header in enumerate(headers, 1):
            cell = sheet.cell(row=current_row, column=col_idx, value=header)
            cell.font = header_font
            cell.fill = header_fill
            cell.alignment = cell_alignment
            cell.border = cell_border
        
        # Điều chỉnh chiều cao dòng cho header
        sheet.row_dimensions[current_row].height = 40
        current_row += 1
        
        # --- Nhóm dữ liệu theo slot và lớp để sắp xếp và hiển thị ---
        schedule_grid = defaultdict(lambda: defaultdict(dict))
        for class_id, class_schedules in semester_schedule_json.items():
            for week_schedule in class_schedules:
                for lesson in week_schedule:
                    if 'date' in lesson:
                        lesson_date = datetime.strptime(lesson['date'], '%Y-%m-%d')
                        # Chỉ xử lý các buổi học trong tuần hiện tại
                        if week_start <= lesson_date <= week_end:
                            schedule_grid[(lesson['slot_id'], class_id)][lesson['day']] = lesson

        # --- Đổ dữ liệu lịch trình vào sheet ---
        sorted_keys = sorted(schedule_grid.keys())
        for slot_id, class_id in sorted_keys:
            day_lessons = schedule_grid[(slot_id, class_id)]
            
            # Lấy sĩ số lớp
            class_size = next((l.get('size', 'N/A') for l in day_lessons.values()), 'N/A')
            
            # Ghi thông tin cơ bản: Slot, Lớp, Sĩ số
            sheet.cell(row=current_row, column=1, value=slot_id).font = slot_time_font
            sheet.cell(row=current_row, column=2, value=class_id)
            sheet.cell(row=current_row, column=3, value=class_size)
            
            # Ghi lịch học từng ngày
            current_date = week_start
            for col_idx in range(4, 11):
                day_name = current_date.strftime('%a')
                if day_name in day_lessons and current_date >= start_date:
                    lesson = day_lessons[day_name]
                    lesson_type = "Lý thuyết" if lesson['lesson_type'] == "theory" else "Thực hành"
                    content = f"{lesson['subject_id']}\n({lesson_type})\nPhòng: {lesson['room_id']}\nGV: {lesson['lecturer_id']}"
                    
                    cell = sheet.cell(row=current_row, column=col_idx, value=content)
                    cell.fill = theory_fill if lesson['lesson_type'] == "theory" else practice_fill
                else:
                    # Ghi một chuỗi rỗng để đảm bảo ô không bị bỏ qua
                    cell = sheet.cell(row=current_row, column=col_idx, value="")

                cell.alignment = cell_alignment
                cell.border = cell_border
                current_date += timedelta(days=1)
            
            # Áp dụng kiểu dáng cho các cột cơ bản
            for col in [1, 2, 3]:
                sheet.cell(row=current_row, column=col).alignment = cell_alignment
                sheet.cell(row=current_row, column=col).border = cell_border
            
            sheet.row_dimensions[current_row].height = 60
            current_row += 1

        # Hợp nhất các ô slot thời gian giống nhau
        merge_slot_cells(sheet, date_row=current_row - len(sorted_keys))
        
        # Điều chỉnh độ rộng cột
        sheet.column_dimensions['A'].width = 15
        sheet.column_dimensions['B'].width = 12
        sheet.column_dimensions['C'].width = 8
        for col_idx in range(4, 11):
            sheet.column_dimensions[get_column_letter(col_idx)].width = 25

    # --- Lưu file Excel ---
    os.makedirs(output_folder, exist_ok=True)
    output_path = os.path.join(output_folder, "TKB_Hoc_Ky.xlsx")
    
    try:
        # Xóa file cũ nếu tồn tại để tránh lỗi
        if os.path.exists(output_path):
            os.remove(output_path)
        workbook.save(output_path)
        print(f"🎉 Đã xuất thành công file Excel tại: {output_path}")
    except Exception as e:
        print(f"❌ Lỗi khi lưu file Excel: {str(e)}")

def merge_slot_cells(sheet: openpyxl.worksheet.worksheet.Worksheet, start_row: int) -> None:
    """
    Hợp nhất các ô trong cột 'Slot Thời Gian' có giá trị giống nhau.

    Args:
        sheet (openpyxl.worksheet.worksheet.Worksheet): Sheet Excel cần xử lý.
        start_row (int): Dòng bắt đầu của bảng dữ liệu.
    """
    if sheet.max_row < start_row:
        return

    current_slot = None
    merge_start = start_row
    
    for row in range(start_row, sheet.max_row + 2):  # Thêm 1 dòng để xử lý trường hợp cuối
        slot_value = sheet.cell(row=row, column=1).value
        
        if slot_value != current_slot:
            if current_slot is not None and row - merge_start > 1:
                sheet.merge_cells(start_row=merge_start, start_column=1, end_row=row - 1, end_column=1)
            merge_start = row
            current_slot = slot_value