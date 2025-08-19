import json
from typing import Dict, List, Any, Optional

def display_ga_progress(
    generation: int, 
    max_generations: int, 
    current_best_fitness: float, 
    overall_best_fitness: float,
    current_best_violations: Dict[str, Any],
    overall_best_violations: Dict[str, Any],
    log_interval: int = 10,
    return_json: bool = False
) -> Optional[Dict[str, Any]]:
    """
    Hiển thị tiến trình và các thông số của thuật toán di truyền, bao gồm chi tiết vi phạm.
    Có thể in ra console hoặc trả về dữ liệu JSON để giao diện người dùng (frontend) xử lý.
    
    Args:
        generation (int): Thế hệ hiện tại.
        max_generations (int): Tổng số thế hệ tối đa.
        current_best_fitness (float): Fitness tốt nhất của thế hệ hiện tại.
        overall_best_fitness (float): Fitness tốt nhất tìm được cho đến nay.
        current_best_violations (Dict[str, Any]): Dictionary chi tiết vi phạm của thế hệ hiện tại.
        overall_best_violations (Dict[str, Any]): Dictionary chi tiết vi phạm của giải pháp tốt nhất toàn cục.
        log_interval (int): Khoảng cách các thế hệ để in ra console.
                            Nếu là 1, in mỗi thế hệ. Nếu là 0 hoặc số âm, chỉ in thế hệ đầu/cuối.
        return_json (bool): Nếu True, hàm sẽ trả về một dictionary chứa dữ liệu thay vì in ra console.
                            Mặc định là False.

    Returns:
        Optional[Dict[str, Any]]: Dictionary chứa các thông số tiến trình nếu return_json là True,
                                  ngược lại là None (in ra console).
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

    # Trả về JSON nếu được yêu cầu
    if return_json:
        return progress_data
    
    # In ra console để theo dõi trực tiếp
    # Chỉ in khi đạt đến log_interval, thế hệ đầu tiên hoặc thế hệ cuối cùng
    should_print = (
        (log_interval > 0 and (generation % log_interval == 0)) or
        (generation == 0) or
        (generation == max_generations - 1)
    )

    if should_print:
        # Định nghĩa màu sắc cho console
        RED = "\033[91m"
        GREEN = "\033[92m"
        YELLOW = "\033[93m"
        BLUE = "\033[94m"
        RESET = "\033[0m"

        # Hiển thị thanh tiến trình và các chỉ số chính
        progress_bar_length = 50
        num_hashes = int(progress_data["progress_percentage"] / 100 * progress_bar_length)
        progress_bar = "#" * num_hashes + "-" * (progress_bar_length - num_hashes)
        
        f_current_color = GREEN if current_best_fitness >= overall_best_fitness else YELLOW
        f_overall_color = GREEN

        print(f"\r{BLUE}[{progress_bar}]{RESET} {progress_data['progress_percentage']:.2f}% "
              f"Thế hệ: {generation + 1}/{max_generations} "
              f"F_curr: {f_current_color}{current_best_fitness:.2f}{RESET} "
              f"F_overall: {f_overall_color}{overall_best_fitness:.2f}{RESET}", end='', flush=True)

    # In chi tiết vi phạm nếu có cải tiến đáng kể (fitness tốt hơn)
    if current_best_fitness >= overall_best_fitness and overall_best_violations:
        print("\n" + "="*80)
        print(f"🎉 Cải tiến ở thế hệ {generation + 1}! Điểm fitness tốt nhất: {overall_best_fitness:.2f}")

        # Kiểm tra xem có vi phạm nào không
        has_violations = any(count > 0 for count in overall_best_violations.values())
        
        if has_violations:
            print("Chi tiết vi phạm của giải pháp tốt nhất hiện tại:")
            for violation, count in overall_best_violations.items():
                if count > 0:
                    print(f"  - ❌ {violation.replace('_', ' ').title()}: {int(count)} lần")
        else:
            print(f"{GREEN}✅ Đã tìm thấy một lịch trình không vi phạm ràng buộc cứng!{RESET}")
            
        print("="*80 + "\n")
    
    return None