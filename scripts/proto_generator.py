import cv2
import numpy as np
import os
import math

# Load high-res bases
sand_cauvery = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_before_sat_1793117367326.jpg')
sand_palar = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_sat_1793119365980.jpg')
mining_grey = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_before_sat_1793117204333.jpg')
mining_red = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_hill_1793119290992.jpg')
construct_b = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_before_sat_1793117267686.jpg')
construct_a = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_after_sat_1793117303778.jpg')

print("Bases ready for prototyping!")
