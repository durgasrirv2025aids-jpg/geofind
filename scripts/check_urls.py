import re

with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Find all sector IDs
all_ids = re.findall(r"id:\s*['\"]([^'\"]+)['\"]", text)
# Find all images lines
images_lines = re.findall(r"images:\s*\{[^}]+\}", text)

print(f"Total sector IDs found: {len(all_ids)}")
print(f"Total images lines found: {len(images_lines)}")

# How many images lines point to generic files?
generic_images = [img for img in images_lines if '/sectors/' not in img]
sector_images = [img for img in images_lines if '/sectors/' in img]

print(f"Generic images lines: {len(generic_images)}")
print(f"Sector-specific images lines: {len(sector_images)}")

if generic_images:
    print("\nSample generic images lines:")
    for g in generic_images[:5]:
        print("  ", g)
