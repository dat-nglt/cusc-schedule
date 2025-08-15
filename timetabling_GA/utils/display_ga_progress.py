# import json
# from typing import Dict, List, Any, Optional

# def display_ga_progress(
#     generation: int, 
#     max_generations: int, 
#     current_best_fitness: float, 
#     overall_best_fitness: float,
#     log_interval: int = 10, # In ra console mỗi N thế hệ
#     return_json: bool = False # Nếu True, sẽ trả về dict thay vì in ra
# ) -> Optional[Dict[str, Any]]:
#     """
#     Hiển thị tiến trình và các thông số của thuật toán di truyền.
#     Có thể in ra console hoặc trả về dữ liệu JSON để FE xử lý.

#     Args:
#         generation (int): Thế hệ hiện tại (bắt đầu từ 0 hoặc 1).
#         max_generations (int): Tổng số thế hệ tối đa.
#         current_best_fitness (float): Fitness tốt nhất của thế hệ hiện tại.
#         overall_best_fitness (float): Fitness tốt nhất tìm được cho đến nay.
#         log_interval (int): Khoảng cách các thế hệ để in ra console.
#                             Nếu là 1, in mỗi thế hệ. Nếu là 0 hoặc số âm, chỉ in thế hệ đầu/cuối.
#         return_json (bool): Nếu True, hàm sẽ trả về một dictionary chứa dữ liệu
#                             thay vì in ra console. Mặc định là False.

#     Returns:
#         Optional[Dict[str, Any]]: Dictionary chứa các thông số tiến trình nếu return_json là True,
#                                   ngược lại là None (in ra console).
#     """

#     # Chuẩn bị dữ liệu cho log/hiển thị
#     progress_data = {
#         "generation": generation,
#         "progress_percentage": round((generation / max_generations) * 100, 2),
#         "current_best_fitness": round(current_best_fitness, 2),
#         "overall_best_fitness": round(overall_best_fitness, 2),
#         # Có thể thêm các thông số khác nếu cần, ví dụ:
#         # "average_fitness": round(average_fitness, 2) 
#         # "num_hard_constraint_violations": num_hard_violations,
#     }

#     if return_json:
#         # Trả về dữ liệu dưới dạng dictionary, FE có thể chuyển thành JSON
#         return progress_data
#     else:
#         # In ra console để theo dõi trực tiếp
#         progress_bar_length = 50
#         num_hashes = int(progress_data["progress_percentage"] / 100 * progress_bar_length)
#         progress_bar = "#" * num_hashes + "-" * (progress_bar_length - num_hashes)

#                 # Ví dụ về cách định nghĩa màu
#         RED = "\033[91m"
#         GREEN = "\033[92m"
#         YELLOW = "\033[93m"
#         BLUE = "\033[94m"
#         RESET = "\033[0m" # Đặt lại màu về mặc định

#         # Định nghĩa F_current và F_overall để so sánh và đổi màu
#         f_current = progress_data['current_best_fitness']
#         f_overall = progress_data['overall_best_fitness']

#         # Tùy thuộc vào giá trị, đổi màu cho F_current và F_overall
#         f_current_color = GREEN if f_current >= f_overall else YELLOW
#         f_overall_color = GREEN

#         print(f"\r{BLUE}[{progress_bar}]{RESET} {progress_data['progress_percentage']:.2f}% "
#             f"F_curr: {f_current_color}{f_current:.2f}{RESET} "
#             f"F_overall: {f_overall_color}{f_overall:.2f}{RESET}", end='', flush=True)
#         return None
    
    
import json
from typing import Dict, List, Any, Optional

def display_ga_progress(
    generation: int, 
    max_generations: int, 
    current_best_fitness: float, 
    overall_best_fitness: float,
    current_best_violations: Dict[str, Any], # Thêm tham số mới
    overall_best_violations: Dict[str, Any], # Thêm tham số mới
    log_interval: int = 10,
    return_json: bool = False
) -> Optional[Dict[str, Any]]:
    """
    Hiển thị tiến trình và các thông số của thuật toán di truyền, bao gồm chi tiết vi phạm.
    
    Args:
        ... (các tham số cũ) ...
        current_best_violations (Dict[str, Any]): Dictionary vi phạm của thế hệ hiện tại.
        overall_best_violations (Dict[str, Any]): Dictionary vi phạm của giải pháp tốt nhất toàn cục.
    """

    # Chuẩn bị dữ liệu cho log/hiển thị
    progress_data = {
        "generation": generation,
        "progress_percentage": round((generation / max_generations) * 100, 2),
        "current_best_fitness": round(current_best_fitness, 2),
        "overall_best_fitness": round(overall_best_fitness, 2),
        "current_best_violations": current_best_violations,
        "overall_best_violations": overall_best_violations
    }

    if return_json:
        return progress_data
    else:
        # Kiểm tra điều kiện để in log ra console
        if log_interval > 0 and generation % log_interval == 0:
            progress_bar_length = 50
            num_hashes = int(progress_data["progress_percentage"] / 100 * progress_bar_length)
            progress_bar = "#" * num_hashes + "-" * (progress_bar_length - num_hashes)
            
            RED = "\033[91m"
            GREEN = "\033[92m"
            YELLOW = "\033[93m"
            BLUE = "\033[94m"
            RESET = "\033[0m"

            f_current = progress_data['current_best_fitness']
            f_overall = progress_data['overall_best_fitness']

            f_current_color = GREEN if f_current >= f_overall else YELLOW
            f_overall_color = GREEN
            
            print(f"\r{BLUE}[{progress_bar}]{RESET} {progress_data['progress_percentage']:.2f}% "
                  f"F_curr: {f_current_color}{f_current:.2f}{RESET} "
                  f"F_overall: {f_overall_color}{f_overall:.2f}{RESET}", end='', flush=True)

        # In chi tiết vi phạm khi có cải tiến
        # Đây là cách hiệu quả để không làm quá tải màn hình
        if current_best_fitness == overall_best_fitness and overall_best_violations:
            print("\n" + "="*50)
            print(f"🎉 Cải tiến ở thế hệ {generation+1}! Điểm fitness tốt nhất: {overall_best_fitness:.2f}")
            for violation, count in overall_best_violations.items():
                has_violations = any(count > 0 for count in overall_best_violations.values())
                print("="*50)

                if has_violations:
                    print("Chi tiết vi phạm của giải pháp tốt nhất:")
                    for violation, count in overall_best_violations.items():
                        if count > 0:
                            print(f"  - ❌ {violation.replace('_', ' ').title()}: {int(count)} lần")
                else:
                    print("✅ Tất cả các vi phạm đã được giải quyết!")
                print("="*50 + "\n")
            
        return None