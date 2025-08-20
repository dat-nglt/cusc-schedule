from typing import List

def get_weekly_lesson_counts(total_slots_needed: int, total_weeks: int) -> List[int]:
    """
    Tính toán và phân bổ số tiết học đều đặn cho mỗi tuần trong một học kỳ.

    Hàm này phân chia tổng số tiết cần thiết cho một môn học thành các tuần
    sao cho số tiết mỗi tuần gần bằng nhau nhất có thể. Các tiết học "lẻ"
    sẽ được phân bổ thêm vào các tuần đầu tiên.

    Args:
        total_slots_needed (int): Tổng số tiết học cần thiết cho môn học.
        total_weeks (int): Tổng số tuần của học kỳ.

    Returns:
        List[int]: Một danh sách chứa số tiết học của mỗi tuần.
                    Ví dụ: [2, 2, 2, 2, 1, 1, ...] nếu tổng số tiết là 10
                    và tổng số tuần là 6.
    """
    # Xử lý trường hợp đặc biệt khi tổng số tuần bằng 0
    if total_weeks <= 0:
        return []

    # Số tiết cơ bản mỗi tuần
    base_weekly = total_slots_needed // total_weeks
    # Số tiết còn lại sau khi chia đều
    extra_slots = total_slots_needed % total_weeks
    
    # Tạo danh sách số tiết mỗi tuần
    # Các tuần đầu sẽ có thêm 1 tiết cho đến khi hết số tiết lẻ
    counts = [base_weekly + 1] * extra_slots + [base_weekly] * (total_weeks - extra_slots)
    
    return counts