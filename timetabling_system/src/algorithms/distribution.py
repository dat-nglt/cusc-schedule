# distribution.py
import math

def distribute_subjects(programs):
    distribution = {}
    for program in programs:
        for subject in program.subjects:
            theory_slots = math.ceil(subject.theory_hours / 2)
            practice_slots = math.ceil(subject.practice_hours / 2)
            
            weekly_theory = [0] * program.duration
            weekly_practice = [0] * program.duration
            
            for i in range(theory_slots):
                weekly_theory[i % program.duration] += 1
                
            for i in range(practice_slots):
                weekly_practice[i % program.duration] += 1
            
            distribution[(program.program_id, subject.subject_id)] = {
                'theory': weekly_theory,
                'practice': weekly_practice
            }
    return distribution