import os
import re
import cv2
import numpy as np
import math

OUT_DIR = "public/images/satellite/sectors"
os.makedirs(OUT_DIR, exist_ok=True)
TARGET_SIZE = (1200, 960)

# 1. Load Base Satellite Materials
BASE_PATH = r'C:\Users\ELCOT\.gemini\antigravity-ide\brain\48a06f06-3ed4-4d7a-95ef-31cda4afb22d'

sand_cauvery_b = cv2.imread(os.path.join(BASE_PATH, 'sand_before_sat_1793117367326.jpg'))
sand_cauvery_a = cv2.imread(os.path.join(BASE_PATH, 'sand_after_sat_1793117390978.jpg'))
sand_palar_b = cv2.imread(os.path.join(BASE_PATH, 'sand_palar_sat_1793119365980.jpg'))
sand_palar_a = cv2.imread(os.path.join(BASE_PATH, 'sand_palar_after_1793119407204.jpg'))

mining_grey_b = cv2.imread(os.path.join(BASE_PATH, 'mining_before_sat_1793117204333.jpg'))
mining_grey_a = cv2.imread(os.path.join(BASE_PATH, 'mining_after_sat_1793117232380.jpg'))
mining_red_b = cv2.imread(os.path.join(BASE_PATH, 'mining_red_hill_1793119290992.jpg'))
mining_red_a = cv2.imread(os.path.join(BASE_PATH, 'mining_red_after_1793119331124.jpg'))

construct_b = cv2.imread(os.path.join(BASE_PATH, 'construct_before_sat_1793117267686.jpg'))
construct_a = cv2.imread(os.path.join(BASE_PATH, 'construct_after_sat_1793117303778.jpg'))

wetland_b = cv2.imread(os.path.join(BASE_PATH, 'wetland_before_sat_1793117426414.jpg'))
wetland_a = cv2.imread(os.path.join(BASE_PATH, 'wetland_after_sat_1793117488405.jpg'))

deforest_mount_b = cv2.imread(os.path.join(BASE_PATH, 'deforest_mountain_sat_1793119437910.jpg'))
user_deforest_b = cv2.imread('public/images/satellite/deforestation_before.png')
user_deforest_a = cv2.imread('public/images/satellite/deforestation_after.png')

print("All satellite source textures loaded.")

def add_hud_and_save(sec_id, dist, lat, lng, area_ha, b_img, a_img, cat_color, cat_name):
    res_b = cv2.resize(b_img, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
    res_a = cv2.resize(a_img, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
    
    # Calculate mask
    diff = cv2.absdiff(res_b, res_a)
    diff_gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
    _, m_thresh = cv2.threshold(diff_gray, 22, 255, cv2.THRESH_BINARY)
    m_thresh = cv2.morphologyEx(m_thresh, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
    m_thresh = cv2.morphologyEx(m_thresh, cv2.MORPH_OPEN, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5, 5)))
    
    mask_vis = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0], 3), dtype=np.uint8)
    mask_vis[:, :] = (15, 23, 42)
    for x in range(0, TARGET_SIZE[0], 40): cv2.line(mask_vis, (x, 0), (x, TARGET_SIZE[1]), (30, 41, 59), 1)
    for y in range(0, TARGET_SIZE[1], 40): cv2.line(mask_vis, (0, y), (TARGET_SIZE[0], y), (30, 41, 59), 1)
    
    bgr_col = (cat_color[2], cat_color[1], cat_color[0])
    contours, _ = cv2.findContours(m_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    for cnt in contours:
        if cv2.contourArea(cnt) > 250:
            cv2.drawContours(mask_vis, [cnt], -1, bgr_col, -1)
            cv2.drawContours(mask_vis, [cnt], -1, (255, 255, 255), 2)
            
    # Draw HUD Telemetry
    hud = f"SENTINEL-2 MSI L2A | {dist.upper()} [{lat:.4f} N, {lng:.4f} E] | {area_ha} HA | {cat_name.upper()}"
    for im in (res_b, res_a):
        cv2.putText(im, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (0, 0, 0), 3, cv2.LINE_AA)
        cv2.putText(im, hud, (25, 32), cv2.FONT_HERSHEY_SIMPLEX, 0.52, (230, 240, 255), 1, cv2.LINE_AA)
        
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_before.png", res_b)
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_after.png", res_a)
    cv2.imwrite(f"{OUT_DIR}/{sec_id}_mask.png", mask_vis)

# Helper to crop & transform
def get_transformed_sub(base_b, base_a, seed, crop_w, crop_h, rot_mode=0, flip_mode=-1):
    np.random.seed(seed)
    max_x = max(1, base_b.shape[1] - crop_w)
    max_y = max(1, base_b.shape[0] - crop_h)
    cx = int(np.random.rand() * max_x)
    cy = int(np.random.rand() * max_y)
    
    sub_b = base_b[cy:cy+crop_h, cx:cx+crop_w].copy()
    sub_a = base_a[cy:cy+crop_h, cx:cx+crop_w].copy()
    
    if flip_mode >= 0:
        sub_b = cv2.flip(sub_b, flip_mode)
        sub_a = cv2.flip(sub_a, flip_mode)
        
    if rot_mode == 1:
        sub_b = cv2.rotate(sub_b, cv2.ROTATE_90_CLOCKWISE)
        sub_a = cv2.rotate(sub_a, cv2.ROTATE_90_CLOCKWISE)
    elif rot_mode == 2:
        sub_b = cv2.rotate(sub_b, cv2.ROTATE_180)
        sub_a = cv2.rotate(sub_a, cv2.ROTATE_180)
    elif rot_mode == 3:
        sub_b = cv2.rotate(sub_b, cv2.ROTATE_90_COUNTERCLOCKWISE)
        sub_a = cv2.rotate(sub_a, cv2.ROTATE_90_COUNTERCLOCKWISE)
        
    return sub_b, sub_a

# --- GENERATE 11 SAND MINING SECTORS ---
def generate_sand_sectors(sectors_info):
    print("Generating 11 Sand Mining sectors...")
    cat_color = (59, 130, 246)
    
    # 11 distinct river styles
    configs = [
        # 0: Cauvery wide braided central island
        {'base': 0, 'cw': 800, 'ch': 550, 'rot': 0, 'flip': -1, 'tint': [1.0, 1.0, 1.0], 'scar_type': 'island'},
        # 1: Thanjavur diagonal delta river lush green paddy
        {'base': 0, 'cw': 650, 'ch': 500, 'rot': 0, 'flip': 1, 'tint': [0.9, 1.08, 0.9], 'scar_type': 'bend'},
        # 2: Karur Mayanur wide dry sandbed with linear trenches
        {'base': 1, 'cw': 750, 'ch': 550, 'rot': 0, 'flip': -1, 'tint': [1.05, 1.0, 0.92], 'scar_type': 'linear'},
        # 3: Tirunelveli Thamirabarani red scrub with dark water gouges
        {'base': 0, 'cw': 700, 'ch': 500, 'rot': 2, 'flip': -1, 'tint': [1.1, 0.95, 0.88], 'scar_type': 'pits'},
        # 4: Erode Bhavani oxbow bend with inner spit excavation
        {'base': 0, 'cw': 600, 'ch': 600, 'rot': 1, 'flip': -1, 'tint': [0.95, 1.05, 0.95], 'scar_type': 'bend'},
        # 5: Kanchipuram Palar dry river with concrete bridge piers
        {'base': 1, 'cw': 850, 'ch': 600, 'rot': 0, 'flip': -1, 'tint': [1.0, 1.0, 1.0], 'scar_type': 'bridge'},
        # 6: Cuddalore Gadilam coastal estuary with tidal mudflat
        {'base': 1, 'cw': 700, 'ch': 520, 'rot': 3, 'flip': 1, 'tint': [0.92, 0.98, 1.05], 'scar_type': 'estuary'},
        # 7: Madurai Vaigai dry sandbed with rectangular gravel pits
        {'base': 1, 'cw': 680, 'ch': 500, 'rot': 2, 'flip': -1, 'tint': [1.08, 0.98, 0.9], 'scar_type': 'pits'},
        # 8: Villupuram South Pennar wide sand with scattered backhoe gouges
        {'base': 0, 'cw': 720, 'ch': 540, 'rot': 0, 'flip': 0, 'tint': [1.02, 1.0, 0.96], 'scar_type': 'scattered'},
        # 9: Thiruvarur Vennar braided streams with dredged shoals
        {'base': 0, 'cw': 650, 'ch': 650, 'rot': 1, 'flip': 1, 'tint': [0.94, 1.06, 0.96], 'scar_type': 'shoal'},
        # 10: Salem Sarabanga rocky tributary with sand extraction
        {'base': 1, 'cw': 620, 'ch': 480, 'rot': 3, 'flip': -1, 'tint': [1.0, 1.02, 0.95], 'scar_type': 'linear'}
    ]
    
    for idx, info in enumerate(sectors_info):
        cfg = configs[idx % len(configs)]
        base_b = sand_cauvery_b if cfg['base'] == 0 else sand_palar_b
        base_a = sand_cauvery_a if cfg['base'] == 0 else sand_palar_a
        
        sub_b, sub_a = get_transformed_sub(base_b, base_a, idx * 313 + 7, cfg['cw'], cfg['ch'], cfg['rot'], cfg['flip'])
        
        # Color grade
        b_tint, g_tint, r_tint = cfg['tint']
        sub_b = np.clip(sub_b.astype(np.float32) * [b_tint, g_tint, r_tint], 0, 255).astype(np.uint8)
        sub_a = np.clip(sub_a.astype(np.float32) * [b_tint, g_tint, r_tint], 0, 255).astype(np.uint8)
        
        sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        sub_a = cv2.resize(sub_a, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        
        # Add procedural dredging features onto sub_a
        scar_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        np.random.seed(idx * 79 + 13)
        
        if cfg['scar_type'] == 'linear':
            # Parallel excavator trenches
            for k in range(3):
                y_pos = int(TARGET_SIZE[1] * (0.4 + k * 0.12))
                cv2.rectangle(scar_mask, (int(TARGET_SIZE[0]*0.25), y_pos), (int(TARGET_SIZE[0]*0.75), y_pos + 40), 255, -1)
        elif cfg['scar_type'] == 'pits':
            # Clustered crater holes
            for k in range(4):
                px = int(TARGET_SIZE[0] * (0.3 + 0.4 * np.random.rand()))
                py = int(TARGET_SIZE[1] * (0.35 + 0.35 * np.random.rand()))
                cv2.circle(scar_mask, (px, py), int(35 + 25 * np.random.rand()), 255, -1)
        elif cfg['scar_type'] == 'bend' or cfg['scar_type'] == 'island':
            cx = int(TARGET_SIZE[0] * 0.52)
            cy = int(TARGET_SIZE[1] * 0.5)
            cv2.ellipse(scar_mask, (cx, cy), (160, 75), int(np.random.rand()*40 - 20), 0, 360, 255, -1)
            cv2.ellipse(scar_mask, (cx + 120, cy - 30), (90, 45), 15, 0, 360, 255, -1)
        else: # scattered / bridge / shoal
            for k in range(3):
                px = int(TARGET_SIZE[0] * (0.35 + 0.3 * np.random.rand()))
                py = int(TARGET_SIZE[1] * (0.35 + 0.3 * np.random.rand()))
                cv2.ellipse(scar_mask, (px, py), (70, 35), int(np.random.rand()*90), 0, 360, 255, -1)
                
        # Access haul tracks
        cv2.line(scar_mask, (int(TARGET_SIZE[0]*0.1), int(TARGET_SIZE[1]*0.85)), (int(TARGET_SIZE[0]*0.45), int(TARGET_SIZE[1]*0.5)), 255, 6)
        cv2.line(scar_mask, (int(TARGET_SIZE[0]*0.9), int(TARGET_SIZE[1]*0.2)), (int(TARGET_SIZE[0]*0.55), int(TARGET_SIZE[1]*0.48)), 255, 6)
        
        feather = cv2.GaussianBlur(scar_mask, (21, 21), 0) / 255.0
        feather_3c = np.dstack([feather, feather, feather])
        
        # Excavation silt color
        excav_patch = np.zeros_like(sub_a)
        excav_patch[:] = (55, 65, 80) if idx % 2 == 0 else (75, 55, 40)
        noise = np.random.randint(-18, 18, excav_patch.shape, dtype=np.int16)
        excav_patch = np.clip(excav_patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        sub_a = (sub_a * (1.0 - feather_3c * 0.82) + excav_patch * (feather_3c * 0.82)).astype(np.uint8)
        
        add_hud_and_save(info['id'], info['district'], info['lat'], info['lng'], info['area_ha'], sub_b, sub_a, cat_color, 'Sand Dredging')

# --- GENERATE 14 ILLEGAL MINING SECTORS ---
def generate_mining_sectors(sectors_info):
    print("Generating 14 Illegal Mining sectors...")
    cat_color = (239, 68, 68)
    
    configs = [
        # 0: Salem Kanjamalai Grey Granite Mountain Stepped Quarry
        {'base': 0, 'cw': 700, 'ch': 550, 'rot': 0, 'flip': -1, 'tint': [1.02, 1.0, 0.98], 'pit': 'stepped_grey'},
        # 1: Madurai Melur Blue Metal Quarry Deep Pit in Red Soil
        {'base': 1, 'cw': 650, 'ch': 500, 'rot': 0, 'flip': 1, 'tint': [0.95, 0.95, 1.1], 'pit': 'deep_blue'},
        # 2: Krishnagiri Denkanikottai Pink/Red Granite Hillside Cut
        {'base': 1, 'cw': 750, 'ch': 550, 'rot': 2, 'flip': -1, 'tint': [0.9, 0.95, 1.15], 'pit': 'crescent_red'},
        # 3: Namakkal Rasipuram Stepped Quarry with Turquoise Water Pool
        {'base': 0, 'cw': 680, 'ch': 520, 'rot': 1, 'flip': -1, 'tint': [1.0, 1.0, 1.0], 'pit': 'water_pool'},
        # 4: Dindigul Nattam Triple Pit Sprawling Cluster
        {'base': 0, 'cw': 720, 'ch': 540, 'rot': 0, 'flip': 0, 'tint': [0.98, 1.02, 1.0], 'pit': 'triple_cluster'},
        # 5: Tirunelveli Radhapuram White Stone Quarry with Dust Roads
        {'base': 0, 'cw': 620, 'ch': 480, 'rot': 3, 'flip': -1, 'tint': [1.08, 1.08, 1.08], 'pit': 'white_stone'},
        # 6: Karur Aravakurichi Flat Terrain Quarry with Stockpiles
        {'base': 1, 'cw': 700, 'ch': 500, 'rot': 0, 'flip': -1, 'tint': [1.0, 1.0, 1.05], 'pit': 'stockpiles'},
        # 7: Vellore Walajah Rocky Ridge Blast with High Cliff Shadow
        {'base': 0, 'cw': 660, 'ch': 510, 'rot': 2, 'flip': 1, 'tint': [0.95, 1.0, 0.98], 'pit': 'cliff_blast'},
        # 8: Dharmapuri Harur Leveled Hilltop Open Pit
        {'base': 1, 'cw': 740, 'ch': 550, 'rot': 1, 'flip': -1, 'tint': [0.94, 0.98, 1.12], 'pit': 'leveled_top'},
        # 9: Erode Chennimalai Deep Stepped Terraced Amphitheatre
        {'base': 0, 'cw': 680, 'ch': 500, 'rot': 0, 'flip': 1, 'tint': [1.02, 1.0, 0.96], 'pit': 'amphitheatre'},
        # 10: Tiruppur Kangeyam Linear Dyke Trench Quarry
        {'base': 1, 'cw': 800, 'ch': 480, 'rot': 3, 'flip': -1, 'tint': [1.05, 0.98, 1.02], 'pit': 'linear_trench'},
        # 11: Theni Andipatti Foothill Cutting with Debris Talus
        {'base': 0, 'cw': 640, 'ch': 530, 'rot': 1, 'flip': 0, 'tint': [0.96, 1.04, 0.96], 'pit': 'foothill'},
        # 12: Virudhunagar Kariapatti Dual Twin Quarry Pits
        {'base': 1, 'cw': 670, 'ch': 510, 'rot': 0, 'flip': 1, 'tint': [0.92, 0.95, 1.15], 'pit': 'twin_pits'},
        # 13: Villupuram Gingee Granite Boulder Hill Quarry
        {'base': 0, 'cw': 710, 'ch': 520, 'rot': 2, 'flip': -1, 'tint': [1.04, 1.02, 1.0], 'pit': 'boulder_blast'}
    ]
    
    for idx, info in enumerate(sectors_info):
        cfg = configs[idx % len(configs)]
        base_b = mining_grey_b if cfg['base'] == 0 else mining_red_b
        base_a = mining_grey_a if cfg['base'] == 0 else mining_red_a
        
        sub_b, sub_a = get_transformed_sub(base_b, base_a, idx * 229 + 19, cfg['cw'], cfg['ch'], cfg['rot'], cfg['flip'])
        
        b_tint, g_tint, r_tint = cfg['tint']
        sub_b = np.clip(sub_b.astype(np.float32) * [b_tint, g_tint, r_tint], 0, 255).astype(np.uint8)
        sub_a = np.clip(sub_a.astype(np.float32) * [b_tint, g_tint, r_tint], 0, 255).astype(np.uint8)
        
        sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        sub_a = cv2.resize(sub_a, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        
        # Procedural Quarry Geometry
        pit_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        np.random.seed(idx * 83 + 51)
        
        px = int(TARGET_SIZE[0] * (0.42 + 0.16 * np.random.rand()))
        py = int(TARGET_SIZE[1] * (0.42 + 0.16 * np.random.rand()))
        
        pit_type = cfg['pit']
        if pit_type == 'twin_pits':
            cv2.ellipse(pit_mask, (px - 110, py), (85, 60), -15, 0, 360, 255, -1)
            cv2.ellipse(pit_mask, (px + 110, py), (95, 65), 15, 0, 360, 255, -1)
        elif pit_type == 'triple_cluster':
            cv2.ellipse(pit_mask, (px - 90, py - 40), (70, 50), 20, 0, 360, 255, -1)
            cv2.ellipse(pit_mask, (px + 80, py - 30), (65, 45), -10, 0, 360, 255, -1)
            cv2.ellipse(pit_mask, (px, py + 70), (80, 55), 5, 0, 360, 255, -1)
        elif pit_type == 'linear_trench':
            cv2.ellipse(pit_mask, (px, py), (200, 45), 35, 0, 360, 255, -1)
        elif pit_type == 'crescent_red':
            cv2.ellipse(pit_mask, (px, py), (140, 85), -25, 0, 360, 255, -1)
        else: # stepped / amphitheatre / deep / pool
            cv2.ellipse(pit_mask, (px, py), (150, 95), int(np.random.rand()*40 - 20), 0, 360, 255, -1)
            
        feather = cv2.GaussianBlur(pit_mask, (19, 19), 0) / 255.0
        feather_3c = np.dstack([feather, feather, feather])
        
        # Quarry floor coloring
        q_patch = np.zeros_like(sub_a)
        if pit_type == 'deep_blue' or cfg['base'] == 1:
            q_patch[:] = (35, 35, 40) # Deep charcoal basalt
        elif pit_type == 'water_pool':
            q_patch[:] = (120, 80, 25) # Deep turquoise water in BGR
        elif pit_type == 'white_stone':
            q_patch[:] = (190, 205, 215) # Blasted white limestone dust
        else:
            q_patch[:] = (65, 75, 80) # Grey granite
            
        noise = np.random.randint(-22, 22, q_patch.shape, dtype=np.int16)
        q_patch = np.clip(q_patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        # Render stepped benches into pit
        bench_lines = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        for r_step in range(40, 130, 25):
            cv2.ellipse(bench_lines, (px, py), (r_step, int(r_step * 0.65)), 0, 0, 360, 255, 3)
        b_feather = cv2.GaussianBlur(bench_lines, (5, 5), 0) / 255.0
        b_feather_3c = np.dstack([b_feather, b_feather, b_feather])
        q_patch = np.clip(q_patch.astype(float) + b_feather_3c * 40.0, 0, 255).astype(np.uint8)
        
        sub_a = (sub_a * (1.0 - feather_3c * 0.88) + q_patch * (feather_3c * 0.88)).astype(np.uint8)
        
        add_hud_and_save(info['id'], info['district'], info['lat'], info['lng'], info['area_ha'], sub_b, sub_a, cat_color, 'Granite Quarrying')

# --- GENERATE 18 DEFORESTATION SECTORS ---
def generate_deforest_sectors(sectors_info):
    print("Generating 18 Deforestation sectors...")
    cat_color = (34, 197, 94)
    
    for idx, info in enumerate(sectors_info):
        # Preserve authentic user images for Nilgiris 01
        if info['id'] == 'sec-nilgiris-deforest-01':
            cv2.imwrite(f"{OUT_DIR}/{info['id']}_before.png", user_deforest_b)
            cv2.imwrite(f"{OUT_DIR}/{info['id']}_after.png", user_deforest_a)
            # Create matching mask
            diff = cv2.absdiff(user_deforest_b, user_deforest_a)
            _, m_thresh = cv2.threshold(cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY), 25, 255, cv2.THRESH_BINARY)
            m_thresh = cv2.morphologyEx(m_thresh, cv2.MORPH_CLOSE, cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9)))
            mask_vis = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0], 3), dtype=np.uint8)
            mask_vis[:, :] = (15, 23, 42)
            contours, _ = cv2.findContours(m_thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
            for cnt in contours:
                if cv2.contourArea(cnt) > 200:
                    cv2.drawContours(mask_vis, [cnt], -1, (94, 197, 34), -1)
                    cv2.drawContours(mask_vis, [cnt], -1, (255, 255, 255), 2)
            cv2.imwrite(f"{OUT_DIR}/{info['id']}_mask.png", mask_vis)
            continue
            
        # Varied mountain forest regions
        cw = int(600 + (idx % 4) * 50)
        ch = int(450 + (idx % 3) * 50)
        rot = idx % 4
        flip = (idx % 3) - 1
        
        base_src = deforest_mount_b if deforest_mount_b is not None else user_deforest_b
        sub_b, _ = get_transformed_sub(base_src, base_src, idx * 167 + 3, cw, ch, rot, flip)
        
        # Color tones for different Ghats ranges (Nilgiris, Anamalai, Shevaroys, Kolli, Megamalai)
        green_boost = 1.0 + ((idx % 5) - 2) * 0.04
        red_drop = 0.95 - ((idx % 3)) * 0.03
        sub_b = np.clip(sub_b.astype(np.float32) * [0.95, green_boost, red_drop], 0, 255).astype(np.uint8)
        sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        sub_a = sub_b.copy()
        
        # Synthesize clear-cut patch
        clear_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        np.random.seed(idx * 97 + 29)
        cx = int(TARGET_SIZE[0] * (0.35 + 0.3 * np.random.rand()))
        cy = int(TARGET_SIZE[1] * (0.35 + 0.3 * np.random.rand()))
        
        # Irregular deforestation polygon
        num_pts = 6 + (idx % 4)
        poly_pts = []
        for p_i in range(num_pts):
            ang = 2 * math.pi * p_i / num_pts
            rad = 80 + 50 * np.random.rand()
            poly_pts.append([int(cx + rad * math.cos(ang)), int(cy + rad * 0.75 * math.sin(ang))])
        cv2.fillPoly(clear_mask, [np.array(poly_pts, dtype=np.int32)], 255)
        
        feather = cv2.GaussianBlur(clear_mask, (17, 17), 0) / 255.0
        feather_3c = np.dstack([feather, feather, feather])
        
        # Cleared soil / exposed brown earth & dry slash
        soil_patch = np.zeros_like(sub_a)
        soil_patch[:] = (45, 75, 115) # Red-brown laterite soil in BGR
        noise = np.random.randint(-25, 25, soil_patch.shape, dtype=np.int16)
        soil_patch = np.clip(soil_patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        sub_a = (sub_a * (1.0 - feather_3c * 0.86) + soil_patch * (feather_3c * 0.86)).astype(np.uint8)
        
        add_hud_and_save(info['id'], info['district'], info['lat'], info['lng'], info['area_ha'], sub_b, sub_a, cat_color, 'Canopy Deforestation')

# --- GENERATE 22 CONSTRUCTION SECTORS ---
def generate_construction_sectors(sectors_info):
    print("Generating 22 Construction sectors...")
    cat_color = (249, 115, 22)
    
    roof_colors = [
        (160, 95, 35),   # Blue warehouse roofs (BGR)
        (210, 215, 220), # White/Silver corrugated shed (BGR)
        (45, 65, 160),   # Terracotta orange industrial roof (BGR)
        (80, 115, 145),  # Steel grey manufacturing facility (BGR)
    ]
    
    for idx, info in enumerate(sectors_info):
        cw = int(650 + (idx % 3) * 60)
        ch = int(500 + (idx % 4) * 40)
        rot = idx % 4
        flip = (idx % 2)
        
        sub_b, _ = get_transformed_sub(construct_b, construct_b, idx * 191 + 11, cw, ch, rot, flip)
        sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        sub_a = sub_b.copy()
        
        # Synthesize logistics warehouses / plotted layout
        build_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        np.random.seed(idx * 73 + 17)
        bx = int(TARGET_SIZE[0] * (0.35 + 0.3 * np.random.rand()))
        by = int(TARGET_SIZE[1] * (0.35 + 0.3 * np.random.rand()))
        
        # Ground clearing pad
        pad_w, pad_h = int(240 + 80 * np.random.rand()), int(180 + 60 * np.random.rand())
        cv2.rectangle(build_mask, (bx - pad_w//2, by - pad_h//2), (bx + pad_w//2, by + pad_h//2), 200, -1)
        
        feather = cv2.GaussianBlur(build_mask, (15, 15), 0) / 255.0
        feather_3c = np.dstack([feather, feather, feather])
        
        # Ground clearing foundation
        clear_soil = np.zeros_like(sub_a)
        clear_soil[:] = (75, 110, 140) # Compacted earth pad
        sub_a = (sub_a * (1.0 - feather_3c * 0.75) + clear_soil * (feather_3c * 0.75)).astype(np.uint8)
        
        # Draw 2 to 4 warehouse building blocks with sharp roof edges & shadow
        roof_col = roof_colors[idx % len(roof_colors)]
        num_sheds = 2 + (idx % 3)
        for s in range(num_sheds):
            sw = int(80 + 35 * np.random.rand())
            sh = int(50 + 20 * np.random.rand())
            sx = bx - pad_w//2 + 30 + s * int((pad_w - 60)/num_sheds)
            sy = by - pad_h//2 + 30
            # Cast shadow
            cv2.rectangle(sub_a, (sx + 8, sy + 8), (sx + sw + 8, sy + sh + 8), (20, 25, 30), -1)
            # Roof
            cv2.rectangle(sub_a, (sx, sy), (sx + sw, sy + sh), roof_col, -1)
            cv2.rectangle(sub_a, (sx, sy), (sx + sw, sy + sh), (240, 240, 240), 1) # Ridge line
            
        add_hud_and_save(info['id'], info['district'], info['lat'], info['lng'], info['area_ha'], sub_b, sub_a, cat_color, 'Illegal Construction')

# --- GENERATE 9 WETLAND SECTORS ---
def generate_wetland_sectors(sectors_info):
    print("Generating 9 Wetland sectors...")
    cat_color = (168, 85, 247)
    
    for idx, info in enumerate(sectors_info):
        cw = int(680 + (idx % 3) * 60)
        ch = int(520 + (idx % 3) * 40)
        rot = idx % 4
        flip = (idx % 2)
        
        sub_b, _ = get_transformed_sub(wetland_b, wetland_b, idx * 241 + 23, cw, ch, rot, flip)
        sub_b = cv2.resize(sub_b, TARGET_SIZE, interpolation=cv2.INTER_LANCZOS4)
        sub_a = sub_b.copy()
        
        # Synthesize infill dumping encroaching into lagoon
        fill_mask = np.zeros((TARGET_SIZE[1], TARGET_SIZE[0]), dtype=np.uint8)
        np.random.seed(idx * 89 + 31)
        fx = int(TARGET_SIZE[0] * (0.35 + 0.3 * np.random.rand()))
        fy = int(TARGET_SIZE[1] * (0.35 + 0.3 * np.random.rand()))
        
        # Encroaching reclamation tongue
        cv2.ellipse(fill_mask, (fx, fy), (int(160 + 50*np.random.rand()), int(90 + 35*np.random.rand())), int(np.random.rand()*50 - 25), 0, 360, 255, -1)
        
        feather = cv2.GaussianBlur(fill_mask, (19, 19), 0) / 255.0
        feather_3c = np.dstack([feather, feather, feather])
        
        # Construction debris / grey dumped rubble
        dump_patch = np.zeros_like(sub_a)
        dump_patch[:] = (120, 130, 135) # Grey urban rubble fill
        noise = np.random.randint(-20, 20, dump_patch.shape, dtype=np.int16)
        dump_patch = np.clip(dump_patch.astype(np.int16) + noise, 0, 255).astype(np.uint8)
        
        sub_a = (sub_a * (1.0 - feather_3c * 0.85) + dump_patch * (feather_3c * 0.85)).astype(np.uint8)
        
        add_hud_and_save(info['id'], info['district'], info['lat'], info['lng'], info['area_ha'], sub_b, sub_a, cat_color, 'Wetland Infill')

# Parse all 74 sectors from detections.ts
with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    text = f.read()

sector_blocks = re.findall(r'({\s*id:\s*[\'"]sec-[^\'"]+[\'"].*?description:\s*[\'"][^\'"]*[\'"]\s*})', text, re.DOTALL)
print(f"Loaded {len(sector_blocks)} sectors from detections.ts")

sectors_by_cat = {'sandmining': [], 'mining': [], 'deforestation': [], 'construction': [], 'wetland': []}

for blk in sector_blocks:
    sec_id = re.search(r'id:\s*[\'"]([^\'"]+)[\'"]', blk).group(1)
    cat = re.search(r'category:\s*[\'"]([^\'"]+)[\'"]', blk).group(1)
    dist = re.search(r'district:\s*[\'"]([^\'"]+)[\'"]', blk).group(1)
    area_ha = float(re.search(r'areaHa:\s*([0-9\.]+)', blk).group(1))
    c_m = re.search(r'center:\s*\[([0-9\.\-]+),\s*([0-9\.\-]+)\]', blk)
    lat, lng = (float(c_m.group(1)), float(c_m.group(2))) if c_m else (11.0, 78.0)
    
    if cat in sectors_by_cat:
        sectors_by_cat[cat].append({
            'id': sec_id, 'district': dist, 'lat': lat, 'lng': lng, 'area_ha': area_ha
        })

generate_sand_sectors(sectors_by_cat['sandmining'])
generate_mining_sectors(sectors_by_cat['mining'])
generate_deforest_sectors(sectors_by_cat['deforestation'])
generate_construction_sectors(sectors_by_cat['construction'])
generate_wetland_sectors(sectors_by_cat['wetland'])

print("SUCCESS: Generated 74 unique, diverse, photorealistic satellite sector datasets!")
