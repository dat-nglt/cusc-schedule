import os
import json
from datetime import datetime
from .config import INPUT_PATH, OUTPUT_PATH, DAYS
from .algorithms.distribution import distribute_subjects
from .algorithms.scheduling import schedule_week
from .algorithms.optimization import optimize_schedule
from .utils.file_io import read_input, write_output
from .models import Class, Lecturer, Room, Program, Subject

def main():
    # Create output directories
    os.makedirs(os.path.join(OUTPUT_PATH, "weekly"), exist_ok=True)
    os.makedirs(os.path.join(OUTPUT_PATH, "class_full"), exist_ok=True)
    
    # Read input data
    input_data = read_input(INPUT_PATH)
    
    # Distribute subjects across weeks
    weekly_subjects = distribute_subjects(input_data['programs'])
    
    # Initialize full schedules
    full_schedules = {c.class_id: [] for c in input_data['classes']}
    
    # Get max weeks
    max_weeks = max(p.duration for p in input_data['programs'])
    
    # Process each week
    for week in range(1, max_weeks + 1):
        print(f"🔁 Scheduling week {week}/{max_weeks}")
        
        # Generate weekly schedule
        weekly_schedule = schedule_week(
            week=week,
            weekly_subjects=weekly_subjects,
            classes=input_data['classes'],
            rooms=input_data['rooms'],
            lecturers=input_data['lecturers'],
            time_slots=input_data['time_slots']
        )
        
        # Optimize schedule
        optimized_schedule = optimize_schedule(
            weekly_schedule,
            input_data['classes'],
            input_data['rooms'],
            input_data['lecturers']
        )
        
        # Save weekly output
        weekly_output = {
            "week": week,
            "schedule": {
                class_id: [s.__dict__ if hasattr(s, '__dict__') else s for s in sessions]
                for class_id, sessions in optimized_schedule.items()
            }
        }
        write_output(
            weekly_output,
            os.path.join(OUTPUT_PATH, "weekly", f"week_{week}_schedule.json")
        )
        
        # Update full schedules
        for class_id, sessions in optimized_schedule.items():
            full_schedules[class_id].append({
                "week": week,
                "slots": [
                    {k: v for k, v in session.items()} 
                    for session in sessions
                ]
            })
    
    # Save class full schedules
    for class_id, full_schedule in full_schedules.items():
        class_output = {
            "class_id": class_id,
            "full_schedule": full_schedule
        }
        write_output(
            class_output,
            os.path.join(OUTPUT_PATH, "class_full", f"{class_id}_full_schedule.json")
        )
    
    print("✅ Timetable generation completed!")

if __name__ == "__main__":
    main()