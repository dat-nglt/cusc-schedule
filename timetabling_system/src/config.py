import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, 'data')
INPUT_PATH = os.path.join(DATA_DIR, 'input', 'sample_input.json')
OUTPUT_PATH = os.path.join(DATA_DIR, 'output')
DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]