# timetable_ga/config.py

# GA Parameters
POPULATION_SIZE = 1500  # Kích thước quần thể
MAX_GENERATIONS = 50
MUTATION_RATE = 0.1
CROSSOVER_RATE = 0.8
ELITISM_COUNT = 10      # Giữ lại N cá thể tốt nhất cho thế hệ sau

# Fitness Penalties
# Hard constraints (nên có giá trị lớn)
PENALTY_LECTURER_CLASH = 1000
PENALTY_ROOM_CLASH = 1000
PENALTY_CLASS_CLASH = 1000
PENALTY_INSUFFICIENT_LESSONS = 1500  # Rất quan trọng
PENALTY_ROOM_TYPE_MISMATCH = 1000
PENALTY_ROOM_CAPACITY = 1000
PENALTY_LECTURER_BUSY = 1000
PENALTY_LECTURER_UNQUALIFIED = 1000  # Giảng viên không dạy được môn
PENALTY_UNASSIGNED_GEN = 2000        # MỚI: Phạt rất nặng cho gen chưa được gán tài nguyên

# Soft constraints
PENALTY_CONSECUTIVE_HOURS_LECTURER = 20 # Phạt cho mỗi giờ dạy liên tục vượt quá giới hạn
PENALTY_CONSECUTIVE_HOURS_CLASS = 20     # Phạt cho mỗi giờ học liên tục vượt quá giới hạn
MAX_CONSECUTIVE_SLOTS = 2               # Tối đa 2 slot liên tiếp (4 giờ)
PENALTY_DISTRIBUTION_DAYS = 10          # Phạt cho sự phân bố không đều
PENALTY_GAPS_IN_SCHEDULE = 5            # Phạt cho mỗi tiết trống xen kẽ

HOURS_PER_SLOT = 2 # Số giờ mỗi tiết học căn cứ vào time_slots (ví dụ 7h-9h là 2 giờ)