import os
import re
import json
import hashlib
import cv2
import numpy as np

OUT_DIR = "public/images/satellite/sectors"
os.makedirs(OUT_DIR, exist_ok=True)

TARGET_SIZE = (1200, 960)

# Base images
BASE_IMAGES = {
    'mining': [
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_before_sat_1793117204333.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_after_sat_1793117232380.jpg'
        ),
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_hill_1793119290992.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\mining_red_after_1793119331124.jpg'
        )
    ],
    'sandmining': [
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_before_sat_1793117367326.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_after_sat_1793117390978.jpg'
        ),
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_sat_1793119365980.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\sand_palar_after_1793119407204.jpg'
        )
    ],
    'construction': [
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_before_sat_1793117267686.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\construct_after_sat_1793117303778.jpg'
        )
    ],
    'wetland': [
        (
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\wetland_before_sat_1793117426414.jpg',
            r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d\wetland_after_sat_1793117488405.jpg'
        )
    ],
    'deforestation': [
        (
            'public/images/satellite/deforestation_before.png',
            'public/images/satellite/deforestation_after.png'
        ),
        (
            'public/images/satellite/deforestation_aerial_before.png',
            'public/images/satellite/deforestation_aerial_after.png'
        )
    ]
}

CATEGORY_COLORS = {
    'mining': (239, 68, 68),
    'deforestation': (34, 197, 94),
    'construction': (249, 115, 22),
    'sandmining': (59, 130, 246),
    'wetland': (168, 85, 247)
}

# Cache base images
loaded_bases = {}
for cat, pool in BASE_IMAGES.items():
    loaded_bases[cat] = []
    for (b_path, a_path) in pool:
        im_b = cv2.imread(b_path)
        im_a = cv2.imread(a_path)
        if im_b is not None and im_a is not None:
            loaded_bases[cat].append((im_b, im_a))

with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    full_content = f.read()

# Extract sector blocks
# Matches from "id: 'sec-..." to the closing "}"
blocks = re.findall(r'{\s*id:\s*[\'"](sec-[^\'"]+)[\'"].*?description:\s*[\'"][^\'"]*[\'"]\s*}', full_content, re.DOTALL)
print(f"Found {len(blocks)} sector IDs")

def get_field(block, key):
    m = re.search(r'' + key + r':\s*[\'"]([^\'"]+)[\'"]', block)
    return m.group(1) if m else ''

def get_float(block, key):
    m = re.search(r'' + key + r':\s*([0-9\.]+)', block)
    return float(m.group(1)) if m else 0.0

def get_center(block):
    m = re.search(r'center:\s*\[([0-9\.\-]+),\s*([0-9\.\-]+)\]', block)
    if m:
        return float(m.group(1)), float(m.group(2))
    return 11.0, 78.0

# Split sectors by category and process
sector_blocks = re.findall(r'({\s*id:\s*[\'"]sec-[^\'"]+[\'"].*?description:\s*[\'"][^\'"]*[\'"]\s*})', full_content, re.DOTALL)
print(f"Total sector blocks matched: {len(sector_blocks)}")

generated_count = 0
for blk in sector_blocks:
    sec_id = get_field(blk, 'id')
    cat = get_field(blk, 'category')
    dist = get_field(blk, 'district')
    title = get_field(blk, 'title')
    area_ha = get_float(blk, 'areaHa')
    lat, lng = get_center(blk)
    
    # If sec-nilgiris-deforest-01, preserve the authentic user images
    if sec_id == 'sec-nilgiris-deforest-01':
        # Copy direct
        b_img = cv2.imread('public/images/satellite/deforestation_before.png')
        a_img = cv2.imread('public/images/satellite/deforestation_after.png')
        m_img = cv2.imread('public/images/satellite/deforestation_mask.png')
        cv2.imwrite(f"{OUT_DIR}/{sec_id}_before.png", b_img)
        cv2.imwrite(f"{OUT_DIR}/{sec_id}_after.png", a_img)
        cv2.imwrite(f"{OUT_DIR}/{sec_id}_mask.png", m_img)
        generated_count += 1
        continue
    
    h_val = int(hashlib.md5(sec_id.encode('utf-8')).hexdigest(), 16)
    pool = loaded_bases.get(cat, [])
    if not pool:
        continue
    
    # Base selection
    base_idx = h_val % len(pool)
    base_b, base_a = pool[base_idx]
    
    bh, bw = base_b.shape[:2]
    
    # Variable zoom per sector
    crop_scale = 0.65 + ((h_val % 100) / 100.0) * 0.25
    cw = int(bw * crop_scale)
    ch = int(bh * crop_scale)
    
    max_x = bw - cw
    max_y = bh - ch
    
    cx = int(((h_val >> 4) % 1000) / 1000.0 * max_x)
    cy = int(((h_val >> 8) % 1000) / 1000.0 * max_y)
    
    sub_b = base_b[cy:cy+ch, cx:cx+cw].copy()
    sub_a = base_a[cy:cy+ch, cx:cx+cw].copy()
    
    flip_code = (h_val >> 12) % 4
    if flip_code == 1:
        sub_b = cv2.flip(sub_b, 1)
        sub_a = cv2.flip(sub_a, 1)
    elif flip_code == 2:
        sub_b = cv2.flip(sub_b, 0)
        sub_a = cv2.flip(sub_a, 0)
        
    # Rotate slightly (-12 to +12 degrees)
    rot_angle = (((h_val >> 14) % 25) - 12)
    if abs(rot_angle) > 2:
        M = cv2.getRotationMatrix2D((cw/2, ch/2), rot_angle, 1.0)
        sub_b = cv2.warpAffine(sub_b, M, (cw, ch), borderMode=cv2.BORDER_REFLECT)
        sub_a = cv2.warpAffine(sub_a, M, (cw, ch), borderMode=cv2.BORDER_REFLECT)
        
    # District soil & mineral color grading
    tint_r = 1.0 + (((h_val >> 18) % 30) - 15) / 100.0
    tint_g = 1.0 + (((h_val >> 22) % 30) - 15) / 100.0
    tint_b = 1.0 + (((h_val >> 26) % 30) - 15) / 100.0
    
    sub_b = np.clip(sub_b.astype(np.float32) * [tint_b, tint_g, tint_r], 0, 255).astype(np.uint8)
    sub_a = np.clip(sub_a.astype(np.float32) * [tint_b, tint_g, tint_r], 0, 255).astype(np.uint8)
    
    res_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
    res_a = cv2.resize(sub_a, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
    
    # Telemetry HUD
    hud = f"S2-MSI L2A | {dist.upper()} [{lat:.4f} N, {lng:.4f} E] | {area_ha} HA"
    cv2.putText(res_b, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(res_b, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (230, 240, 255), 1, cv2.LINE_AA)
    cv2.putText(res_a, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (0, 0, 0), 3, cv2.LINE_AA)
    cv2.putText(res_a, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (230, 240, 255), 1, cv2.LINE_AA)
    
    # Mask
    diff = cv2.absdiff(res_b, res_a)
    gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, thresh = cv2.threshold(gray, 20, 255, cv2.THRESH_BINARY)
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (7, 7))
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
    thresh = cv2.morphologyEx(thresh, cv2.MORPH_OPEN, kernel)
    
    mask_vis = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0], 3), dtype=np.uint8)
    mask_vis[:, :] = (15, 23, 42)
    for x in range(0, TARGET_SIZE[0], 40): cv2.line(mask_vis, (x, 0), (x, TARGET_SIZE[1]), (30, 41, 59), 1)
    for y in range(0, TARGET_SIZE[1], 40): cv2.line(mask_vis, (0, y), (TARGET_SIZE[0], y), (30, 41, 59), 1)
    
    col = CATEGORY_COLORS.get(cat, (255, 255, 255))
    bgr_col = (col[2], col[1], col[0])
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        if cv2.contourArea(cnt) > 400:
            cv2.drawContours(mask_vis, [cnt], -1, bgr_col, -1)
            cv2.drawContours(mask_vis, [cnt], -1, (255, 255, 255), 2)
            
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_before.png", res_b)
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_after.png", res_a)
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_mask.png", mask_vis)
    generated_count += 1

print(f"Generated distinct imagery files for {generated_count} sectors in {OUT_DIR}/!")
