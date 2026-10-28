import cv2
import numpy as np
import glob
import os

sand_files = sorted(glob.glob('public/images/satellite/sectors/*sand*_before.png'))
print(f"Found {len(sand_files)} sand mining sectors:")
for i in range(len(sand_files) - 1):
    im1 = cv2.imread(sand_files[i])
    im2 = cv2.imread(sand_files[i+1])
    diff = np.mean(np.abs(im1.astype(float) - im2.astype(float)))
    print(f"  {os.path.basename(sand_files[i])} vs {os.path.basename(sand_files[i+1])}: mean pixel diff = {diff:.1f}")

mining_files = sorted(glob.glob('public/images/satellite/sectors/*mining*_before.png'))
print(f"\nFound {len(mining_files)} illegal mining sectors:")
for i in range(len(mining_files) - 1):
    im1 = cv2.imread(mining_files[i])
    im2 = cv2.imread(mining_files[i+1])
    diff = np.mean(np.abs(im1.astype(float) - im2.astype(float)))
    print(f"  {os.path.basename(mining_files[i])} vs {os.path.basename(mining_files[i+1])}: mean pixel diff = {diff:.1f}")
