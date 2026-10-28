import re

with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    content = f.read()

def replacer(match):
    full_block = match.group(0)
    id_match = re.search(r"id:\s*['\"](sec-[^'\"]+)['\"]", full_block)
    if not id_match:
        return full_block
    sec_id = id_match.group(1)
    
    if sec_id == 'sec-nilgiris-deforest-01':
        return full_block
        
    new_images = f"images: {{ beforeUrl: '/images/satellite/sectors/{sec_id}_before.png', afterUrl: '/images/satellite/sectors/{sec_id}_after.png', maskUrl: '/images/satellite/sectors/{sec_id}_mask.png' }}"
    
    updated_block = re.sub(
        r"images:\s*\{[^\}]+\}",
        new_images,
        full_block
    )
    return updated_block

new_content = re.sub(r"\{\s*id:\s*['\"]sec-[^'\"]+['\"].*?description:\s*['\"][^'\"]*['\"]\s*\}", replacer, content, flags=re.DOTALL)

with open('src/data/detections.ts', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Updated detections.ts with sector-specific image URLs!")
