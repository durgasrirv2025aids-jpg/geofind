import cv2
import numpy as np
import os
import math

OUT_DIR = "public/images/satellite/sectors_test"
os.makedirs(OUT_DIR, exist_ok=True)

# Load base pairs
b_sand1 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_before_sat_1793117367326.jpg')
a_sand1 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_after_sat_1793117390978.jpg')
b_sand2 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_sat_1793119365980.jpg')
a_sand2 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_after_1793119407204.jpg')

b_mine1 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_before_sat_1793117204333.jpg')
a_mine1 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_after_sat_1793117232380.jpg')
b_mine2 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_hill_1793119290992.jpg')
a_mine2 = cv2.imread(r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_after_1793119331124.jpg')

TARGET_SIZE = (1200, 960)

def extract_dredge_feature(a_img, b_img):
    # Extracts the dredged excavation pits with water reflection
    diff = cv2.absdiff(a_img, b_img)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, mask = cv2.threshold(gray, 30, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)
    return mask

def synthesize_sand_sector(sector_idx, district_name, lat, lng, area_ha):
    # Choose base: 0: Cauvery, 1: Palar, 2: Hybrid
    mode = sector_idx % 4
    
    if mode == 0:
        base_b = b_sand1.copy()
        base_a = a_sand1.copy()
        # Crop region 1
        cw, ch = 800, 600
        cx = int((sector_idx * 73) % (base_b.shape[1] - cw))
        cy = int((sector_idx * 59) % (base_b.shape[0] - ch))
        sub_b = base_b[cy:cy+ch, cx:cx+cw]
        sub_a = base_a[cy:cy+ch, cx:cx+cw]
    elif mode == 1:
        base_b = b_sand2.copy()
        base_a = a_sand2.copy()
        # Crop region 2
        cw, ch = 750, 560
        cx = int((sector_idx * 89) % (base_b.shape[1] - cw))
        cy = int((sector_idx * 47) % (base_b.shape[0] - ch))
        sub_b = base_b[cy:cy+ch, cx:cx+cw]
        sub_a = base_a[cy:cy+ch, cx:cx+cw]
    elif mode == 2:
        # Rotated 90 degrees (vertical river!)
        base_b = cv2.rotate(b_sand1, cv2.ROTATE_90_CLOCKWISE)
        base_a = cv2.rotate(a_sand1, cv2.ROTATE_90_CLOCKWISE)
        cw, ch = 600, 800
        cx = int((sector_idx * 67) % (base_b.shape[1] - cw))
        cy = int((sector_idx * 83) % (base_b.shape[0] - ch))
        sub_b = base_b[cy:cy+ch, cx:cx+cw]
        sub_a = base_a[cy:cy+ch, cx:cx+cw]
    else:
        # Flipped Palar with diagonal orientation
        base_b = cv2.flip(b_sand2, 1)
        base_a = cv2.flip(a_sand2, 1)
        cw, ch = 850, 640
        cx = int((sector_idx * 53) % (base_b.shape[1] - cw))
        cy = int((sector_idx * 71) % (base_b.shape[0] - ch))
        sub_b = base_b[cy:cy+ch, cx:cx+cw]
        sub_a = base_a[cy:cy+ch, cx:cx+cw]

    sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
    sub_a = cv2.resize(sub_a, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)

    # Procedural dredging pit placement to guarantee unique scars
    # Generate 1 to 3 distinct excavator scars on sub_a
    scar_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
    num_scars = 2 + (sector_idx % 3)
    
    np.random.seed(sector_idx * 137 + 42)
    for i in range(num_scars):
        sc_x = int(TARGET_SIZE[0] * (0.3 + 0.4 * np.random.rand()))
        sc_y = int(TARGET_SIZE[1] * (0.35 + 0.35 * np.random.rand()))
        rad_x = int(60 + 50 * np.random.rand())
        rad_y = int(30 + 25 * np.random.rand())
        angle = int(np.random.rand() * 180)
        cv2.ellipse(scar_mask, (sc_x, sc_y), (rad_x, rad_y), angle, 0, 360, 255, -1)
        # Vehicle track lines
        for _ in range(3):
            tx1 = sc_x + int((np.random.rand()-0.5) * 100)
            ty1 = sc_y + int((np.random.rand()-0.5) * 50)
            tx2 = tx1 + int((np.random.rand()-0.5) * 200)
            ty2 = ty1 + int((np.random.rand()-0.5) * 120)
            cv2.line(scar_mask, (tx1, ty1), (tx2, ty2), 255, 4)

    feather = cv2.GaussianBlur(scar_mask, (25, 25), 0) / 255.0
    feather_3c = np.dstack([feather, feather, feather])
    
    # Excavation colors: deep dredged pit (dark water / dark wet sand / exposed clay)
    excavation_tint = np.array([45, 60, 75], dtype=np.uint8) # Dark dredged silt
    if sector_idx % 2 == 0:
        excavation_tint = np.array([65, 45, 30], dtype=np.uint8) # Dark river water pool
        
    dredged_patch = np.zeros_like(sub_a)
    dredged_patch[:] = excavation_tint
    # Add texture noise
    noise = np.random.randint(-15, 15, dredged_patch.shape, dtype=np.int16)
    dredged_patch = np.clip(dredged_patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)

    # Blend excavation scars into sub_a
    sub_a = (sub_a * (1.0 - feather_3c * 0.85) + dredged_patch * (feather_3c * 0.85)).astype(np.uint8)

    # Telemetry HUD
    hud = f"SENTINEL-2 MSI L2A | {district_name.upper()} [{lat:.4f} N, {lng:.4f} E] | {area_ha} HA"
    cv2.putText(sub_b, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(sub_b, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (230, 240, 255), 1, cv2.LINE_AA)
    cv2.putText(sub_a, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(sub_a, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (230, 240, 255), 1, cv2.LINE_AA)

    # Mask
    mask_vis = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0], 3), dtype=np.uint8)
    mask_vis[:, :] = (15, 23, 42)
    for x in range(0, TARGET_SIZE[0], 40): cv2.line(mask_vis, (x, 0), (x, TARGET_SIZE[1]), (30, 41, 59), 1)
    for y in range(0, TARGET_SIZE[1], 40): cv2.line(mask_vis, (0, y), (TARGET_SIZE[0], y), (30, 41, 59), 1)
    
    diff = cv2.absdiff(sub_b, sub_a)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, m_thresh = cv2.threshold(diff_gray, 22, 255, cv2.THRESH_BINARY)
    m_thresh = cv2.morphologyEx(m_thresh, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    
    contours, _ = cv2.findContours(m_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        if cv2.contourArea(cnt) > 300:
            cv2.drawContours(mask_vis, [cnt], -1, (246, 130, 59), -1) # Blue in BGR
            cv2.drawContours(mask_vis, [cnt], -1, (255, 255, 255), 2)

    return sub_b, sub_a, mask_vis

for s_idx in range(4):
    b, a, m = synthesize_sand_sector(s_idx, f"Sand_District_{s_idx}", 11.0 + s_idx*0.2, 78.0 + s_idx*0.2, 12.5 + s_idx*2)
    cv2.imwrite(f"{OUT_DIR}/sand_test_{s_idx}_b.png", b)
    cv2.imwrite(f"{OUT_DIR}/sand_test_{s_idx}_a.png", a)
    cv2.imwrite(f"{OUT_DIR}/sand_test_{s_idx}_m.png", m)

print("4 test sand mining sectors generated!")
