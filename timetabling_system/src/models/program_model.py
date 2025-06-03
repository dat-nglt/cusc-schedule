class Subject:
    def __init__(self, subject_id, name, theory_hours, practice_hours):
        self.subject_id = subject_id
        self.name = name
        self.theory_hours = theory_hours
        self.practice_hours = practice_hours
        
class Program:
    def __init__(self, program_id, duration, subjects):
        self.program_id = program_id
        self.duration = duration
        self.subjects = subjects
