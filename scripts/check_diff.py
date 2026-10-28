import cv2
import numpy as np

img0 = cv2.imread('public/images/satellite/sectors_test/sand_test_0_b.png')
img1 = cv2.imread('public/images/satellite/sectors_test/sand_test_1_b.png')
img2 = cv2.imread('public/images/satellite/sectors_test/sand_test_2_b.png')
img3 = cv2.imread('public/images/satellite/sectors_test/sand_test_3_b.png')

diff01 = np.mean(np.abs(img0.astype(float) - img1.astype(float)))
diff12 = np.mean(np.abs(img1.astype(float) - img2.astype(float)))
diff23 = np.mean(np.abs(img2.astype(float) - img3.astype(float)))
diff03 = np.mean(np.abs(img0.astype(float) - img3.astype(float)))

print(f"Mean pixel diffs: 0 vs 1 = {diff01:.1f}, 1 vs 2 = {diff12:.1f}, 2 vs 3 = {diff23:.1f}, 0 vs 3 = {diff03:.1f}")
