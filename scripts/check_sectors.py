import re

with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    text = f.read()

sectors = re.findall(r'id:\s*[\'"](sec-[^\'"]+)[\'"].*?category:\s*[\'"]([^\'"]+)[\'"].*?beforeUrl:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)
print(f"Total sectors found with beforeUrl: {len(sectors)}")

cat_counts = {}
for sec_id, cat, url in sectors:
    cat_counts[cat] = cat_counts.get(cat, 0) + 1

for cat, count in cat_counts.items():
    print(f"Category {cat}: {count} sectors")

# Print first 5 of each category
for cat in cat_counts:
    print(f"\n--- Category: {cat} ---")
    cat_sectors = [s for s in sectors if s[1] == cat]
    for s in cat_sectors[:4]:
        print(s)
