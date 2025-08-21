import sys
import os
import json
from typing import Dict, Any

# Import main components
from data_processing.loader import load_data
from data_processing.processor import DataProcessor
from utils.run_ga_for_semester import run_ga_for_semester
from utils.export_combined_results import export_combined_results


def genetic_algorithm():
    """
    Main function to run the genetic algorithm for creating semester schedules.
    The process includes:
    1. Loading and processing input data.
    2. Running the GA separately for each semester.
    3. Consolidating and exporting the final results.
    """
    print("Loading data...")
    # Load data from a JSON file
    raw_data = load_data("input_data.json")
    if not raw_data:
        print("khong co json data")
        return

    print("Processing data...")
    # Process data to create useful structures
    processed_data = DataProcessor(raw_data)
    
    # Create the 'results' directory if it doesn't exist
    output_folder = "results"
    if not os.path.exists(output_folder):
        os.makedirs(output_folder)

    all_semester_results = {}
    
    # Run GA for each semester
    for semester_id, semester_info in processed_data.semester_map.items():
        print(f"\n--- Starting to generate schedule for Semester: {semester_id} ---")
        
        # Run the genetic algorithm and get the best chromosome and log
        best_chromosome, ga_log = run_ga_for_semester(semester_id, processed_data)
        
        if best_chromosome:
            # Save the best result and log for each semester
            all_semester_results[semester_id] = {
                "chromosome": best_chromosome,
                "log": ga_log
            }
            print()
            print(f"The optimal schedule for {semester_id} has been created successfully.")
        else:
            print(f"Failed to create a schedule for {semester_id}.")

    # Consolidate and export results if available
    if all_semester_results:
        print("\n--- Consolidating and exporting results ---")
        export_combined_results(all_semester_results, processed_data, output_folder)
        
    print("\nGA_PROGRESS_DONE")
    # Ensure all output is flushed to the console
    sys.stdout.flush()
    
if __name__ == "__main__":
    # Ensure the results folder exists before running
    if not os.path.exists("results"):
        os.makedirs("results")
    genetic_algorithm()