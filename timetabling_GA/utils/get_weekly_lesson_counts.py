def get_weekly_lesson_counts(total_slots_needed, total_weeks):
    # Trả về danh sách số tiết mỗi tuần (ví dụ: [2, 2, 2, 2, 1, 1, ...])
    
    print("DEBUG")
    
    if total_weeks == 0:
        return []
    base_weekly = total_slots_needed // total_weeks
    extra_slots = total_slots_needed % total_weeks
    
    counts = [base_weekly + 1] * extra_slots + [base_weekly] * (total_weeks - extra_slots)
    return counts