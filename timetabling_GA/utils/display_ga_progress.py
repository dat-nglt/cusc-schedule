import json
from typing import Dict, List, Any, Optional
import sys
from datetime import datetime

def display_ga_progress(
    generation: int, 
    max_generations: int, 
    current_best_fitness: float, 
    overall_best_fitness: float,
    current_best_violations: Dict[str, Any],
    overall_best_violations: Dict[str, Any],
    semester_info: Dict[str, Any],
    population_stats: Optional[Dict[str, Any]] = None,
    execution_time: Optional[float] = None,
    log_interval: int = 10,
    return_json: bool = False
) -> Optional[Dict[str, Any]]:
    """
    Displays comprehensive GA progress information with detailed metrics for FE processing.
    """
    # Ensure violations are not None
    current_best_violations = current_best_violations or {}
    overall_best_violations = overall_best_violations or {}
    population_stats = population_stats or {}
    
    # Calculate metrics
    progress_percentage = round((generation / max_generations) * 100, 2)
    has_improvement = current_best_fitness >= overall_best_fitness
    estimated_time_remaining = None
    
    if execution_time and generation > 0:
        time_per_generation = execution_time / generation
        estimated_time_remaining = time_per_generation * (max_generations - generation)
    
    # Convert boolean values to string for JSON serialization
    def convert_for_json(obj):
        """Convert non-serializable objects to serializable formats"""
        if isinstance(obj, bool):
            return str(obj)
        elif isinstance(obj, (int, float, str)):
            return obj
        elif isinstance(obj, dict):
            return {k: convert_for_json(v) for k, v in obj.items()}
        elif isinstance(obj, list):
            return [convert_for_json(item) for item in obj]
        elif obj is None:
            return None
        else:
            return str(obj)
    
    # Prepare comprehensive progress data for FE
    progress_data = {
        "event_type": "GA_PROGRESS",
        "timestamp": datetime.now().isoformat(),
        "semester_info": convert_for_json(semester_info),
        "generation_info": {
            "current": generation,
            "max": max_generations,
            "progress_percentage": progress_percentage,
            "is_first": str(generation == 0),  # Convert to string
            "is_last": str(generation == max_generations - 1)  # Convert to string
        },
        "fitness_metrics": {
            "current_best": round(current_best_fitness, 4),
            "overall_best": round(overall_best_fitness, 4),
            "has_improvement": str(has_improvement),  # Convert to string
            "improvement_amount": round(current_best_fitness - overall_best_fitness, 4) if has_improvement else 0
        },
        "violation_analysis": {
            "current": {
                "total_violations": sum(current_best_violations.values()),
                "by_type": convert_for_json(current_best_violations),
                "is_feasible": str(sum(current_best_violations.values()) == 0)  # Convert to string
            },
            "overall": {
                "total_violations": sum(overall_best_violations.values()),
                "by_type": convert_for_json(overall_best_violations),
                "is_feasible": str(sum(overall_best_violations.values()) == 0)  # Convert to string
            }
        },
        "performance_metrics": {
            "execution_time_seconds": round(execution_time, 2) if execution_time else None,
            "estimated_time_remaining": round(estimated_time_remaining, 2) if estimated_time_remaining else None,
            "generations_per_second": round(generation / execution_time, 2) if execution_time and execution_time > 0 else None
        },
        "population_stats": convert_for_json(population_stats)
    }
    
    # Send to stdout for FE processing (always)
    try:
        json_output = json.dumps(progress_data, ensure_ascii=False)
        print(f"GA_EVENT:{json_output}")
    except Exception as e:
        # Fallback: try with ensure_ascii=True
        try:
            json_output = json.dumps(progress_data, ensure_ascii=True)
            print(f"GA_EVENT:{json_output}")
        except Exception as e2:
            # Minimal fallback output
            print(f"GA_EVENT_ERROR:Failed to serialize progress data: {str(e2)}")
    
    # Return JSON if requested
    if return_json:
        return progress_data
    
    # Console display logic (for direct monitoring)
    should_display_console = (
        log_interval > 0 and (generation % log_interval == 0) or
        generation == 0 or
        generation == max_generations - 1 or
        has_improvement
    )
    
    if should_display_console:
        # Colors for console output
        COLORS = {
            'RED': "\033[91m",
            'GREEN': "\033[92m",
            'YELLOW': "\033[93m",
            'BLUE': "\033[94m",
            'CYAN': "\033[96m",
            'RESET': "\033[0m"
        }
        
        # Display semester info at first generation
        if generation == 0:
            try:
                semester_name = semester_info.get('semester_name', 'Unknown')
                semester_id = semester_info.get('semester_id', 'Unknown')
                total_lessons = semester_info.get('total_lessons', 0)
                
                print(f"\n{COLORS['CYAN']}=== GA Optimization Started ==={COLORS['RESET']}")
                print(f"{COLORS['BLUE']}Semester: {semester_name} ({semester_id}){COLORS['RESET']}")
                print(f"{COLORS['BLUE']}Lessons: {total_lessons} | Generations: {max_generations}{COLORS['RESET']}")
                print(f"{COLORS['BLUE']}Start Time: {datetime.now().strftime('%H:%M:%S')}{COLORS['RESET']}")
                print()
            except:
                print("\n=== GA Optimization Started ===")
        
        # Progress bar display
        try:
            bar_length = 40
            filled_length = int(bar_length * generation // max_generations)
            bar = '█' * filled_length + '░' * (bar_length - filled_length)
            
            fitness_color = COLORS['GREEN'] if has_improvement else COLORS['YELLOW']
            violation_status = "✓" if sum(current_best_violations.values()) == 0 else "⚠"
            
            progress_text = (
                f"\r{COLORS['BLUE']}[{bar}] {progress_percentage:5.1f}%{COLORS['RESET']} "
                f"Gen: {generation + 1:4d}/{max_generations} "
                f"Fitness: {fitness_color}{current_best_fitness:7.2f}{COLORS['RESET']} "
                f"Best: {COLORS['GREEN']}{overall_best_fitness:7.2f}{COLORS['RESET']} "
                f"Violations: {violation_status} {sum(current_best_violations.values()):3d}"
            )
            
            if execution_time and generation > 0:
                progress_text += f" Time: {execution_time:.1f}s"
                if estimated_time_remaining:
                    progress_text += f" ETA: {estimated_time_remaining:.1f}s"
            
            sys.stdout.write(progress_text)
            sys.stdout.flush()
            
        except:
            # Fallback without colors
            print(f"\rProgress: {progress_percentage:5.1f}% | Gen: {generation + 1}/{max_generations} | "
                  f"Fitness: {current_best_fitness:.2f} | Best: {overall_best_fitness:.2f}", 
                  end='', flush=True)
    
    # Display improvement details
    if has_improvement and overall_best_violations:
        print("\n" + "="*80)
        print(f"IMPROVEMENT at Generation {generation + 1}")
        print(f"New Best Fitness: {overall_best_fitness:.4f}")
        
        if sum(overall_best_violations.values()) == 0:
            print(f"✓ FEASIBLE SOLUTION FOUND - No violations!")
        else:
            print("Violation Details:")
            for violation, count in sorted(overall_best_violations.items()):
                if count > 0:
                    print(f"  • {violation.replace('_', ' ').title()}: {count}")
        
        print("="*80)
    
    # Final generation summary
    if generation == max_generations - 1:
        print("\n\n" + "="*80)
        print(f"=== GA Optimization Completed ===")
        print(f"Final Best Fitness: {overall_best_fitness:.4f}")
        print(f"Total Violations: {sum(overall_best_violations.values())}")
        print(f"Feasible Solution: {'Yes' if sum(overall_best_violations.values()) == 0 else 'No'}")
        
        if execution_time:
            print(f"Total Execution Time: {execution_time:.2f} seconds")
            print(f"Generations per Second: {max_generations/execution_time:.2f}")
        
        print("="*80)
    
    return None