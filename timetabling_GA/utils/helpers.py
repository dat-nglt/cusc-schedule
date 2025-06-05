# timetable_ga/utils/helpers.py
# Ví dụ:
def format_timetable(chromosome, processed_data):
    # Sắp xếp thời khóa biểu để dễ đọc hơn
    # (theo lớp, rồi theo ngày, rồi theo slot)
    # ... (logic sắp xếp)
    output = []
    # Sắp xếp các gene để hiển thị
    sorted_genes = sorted(chromosome.genes, key=lambda g: (
        g['class_id'], 
        processed_data.data['days_of_week'].index(g['day']), 
        processed_data.slot_order_map[g['slot_id']]
    ))

    for gene in sorted_genes:
        output.append(
            f"Class: {gene['class_id']}, Subject: {gene['subject_id']} ({gene['lesson_type']}), "
            f"Day: {gene['day']}, Slot: {gene['slot_id']}, "
            f"Room: {gene['room_id']}, Lecturer: {gene['lecturer_id']}"
        )
    return "\n".join(output)