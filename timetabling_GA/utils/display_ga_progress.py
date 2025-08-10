import json
from typing import Dict, List, Any, Optional

def display_ga_progress(
    generation: int, 
    max_generations: int, 
    current_best_fitness: float, 
    overall_best_fitness: float,
    log_interval: int = 10, # In ra console mỗi N thế hệ
    return_json: bool = False # Nếu True, sẽ trả về dict thay vì in ra
) -> Optional[Dict[str, Any]]:
    """
    Hiển thị tiến trình và các thông số của thuật toán di truyền.
    Có thể in ra console hoặc trả về dữ liệu JSON để FE xử lý.

    Args:
        generation (int): Thế hệ hiện tại (bắt đầu từ 0 hoặc 1).
        max_generations (int): Tổng số thế hệ tối đa.
        current_best_fitness (float): Fitness tốt nhất của thế hệ hiện tại.
        overall_best_fitness (float): Fitness tốt nhất tìm được cho đến nay.
        log_interval (int): Khoảng cách các thế hệ để in ra console.
                            Nếu là 1, in mỗi thế hệ. Nếu là 0 hoặc số âm, chỉ in thế hệ đầu/cuối.
        return_json (bool): Nếu True, hàm sẽ trả về một dictionary chứa dữ liệu
                            thay vì in ra console. Mặc định là False.

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
        # Có thể thêm các thông số khác nếu cần, ví dụ:
        # "average_fitness": round(average_fitness, 2) 
        # "num_hard_constraint_violations": num_hard_violations,
    }

    if return_json:
        # Trả về dữ liệu dưới dạng dictionary, FE có thể chuyển thành JSON
        return progress_data
    else:
        # In ra console để theo dõi trực tiếp
        progress_bar_length = 50
        num_hashes = int(progress_data["progress_percentage"] / 100 * progress_bar_length)
        progress_bar = "#" * num_hashes + "-" * (progress_bar_length - num_hashes)

        # In chi tiết ở thế hệ đầu, cuối hoặc theo log_interval
        if generation == 1 or generation == max_generations or (log_interval > 0 and generation % log_interval == 0):
            print(f"[{progress_bar}] {progress_data['progress_percentage']:.2f}% | "
                  f"Thế hệ: {generation:<4} | "
                  f"F_hiện tại: {progress_data['current_best_fitness']:.2f} | "
                  f"F_tổng thể: {progress_data['overall_best_fitness']:.2f}")
        
        # Nếu muốn cập nhật thanh tiến trình liên tục trên cùng một dòng
        # (chỉ hiển thị được trên console hỗ trợ ký tự \r)
        # print(f"\r[{progress_bar}] {progress_data['progress_percentage']:.2f}% "
        #       f"F_curr: {progress_data['current_best_fitness']:.2f} F_overall: {progress_data['overall_best_fitness']:.2f}", end='', flush=True)
        return None