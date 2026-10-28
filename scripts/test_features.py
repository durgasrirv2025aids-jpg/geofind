import cv2
import numpy as np
import os
import math
import hashlib

def test_feature_generation():
    # Load base images
    sand_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_before_sat_1793117367326.jpg')
    palar_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_sat_1793119365980.jpg')
    mining_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_before_sat_1793117204333.jpg')
    red_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_hill_1793119290992.jpg')
    farm_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_before_sat_1793117267686.jpg')
    
    print("All base images loaded successfully!")

test_feature_generation()
