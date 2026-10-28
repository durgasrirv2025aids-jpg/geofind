import cv2
import glob
import os

images = [
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_before_sat_1793117204333.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_after_sat_1793117232380.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_hill_1793119290992.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_after_1793119331124.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_before_sat_1793117367326.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_after_sat_1793117390978.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_sat_1793119365980.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_after_1793119407204.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_before_sat_1793117267686.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_after_sat_1793117303778.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\wetland_before_sat_1793117426414.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\wetland_after_sat_1793117488405.jpg',
    r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\deforest_mountain_sat_1793119437910.jpg',
    'public/images/satellite/deforestation_before.png',
    'public/images/satellite/deforestation_after.png',
]

for p in images:
    if os.path.exists(p):
        im = cv2.imread(p)
        print(f"{os.path.basename(p)}: shape={im.shape}")
    else:
        print(f"NOT FOUND: {p}")
