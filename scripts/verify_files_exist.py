import os
import glob
import re

with open('src/data/detections.ts', 'r', encoding='utf-8') as f:
    text = f.read()

sectors = re.findall(r'id:\s*[\'"](sec-[^\'"]+)[\'"].*?category:\s*[\'"]([^\'"]+)[\'"].*?beforeUrl:\s*[\'"]([^\'"]+)[\'"].*?afterUrl:\s*[\'"]([^\'"]+)[\'"].*?maskUrl:\s*[\'"]([^\'"]+)[\'"]', text, re.DOTALL)

print(f"Total sectors parsed: {len(sectors)}")

missing = 0
found = 0
for sec_id, cat, b_url, a_url, m_url in sectors:
    b_path = b_url.lstrip('/')
    a_path = a_url.lstrip('/')
    m_path = m_url.lstrip('/')
    
    b_exists = os.path.exists(b_path)
    a_exists = os.path.exists(a_path)
    m_exists = os.path.exists(m_path)
    
    if not (b_exists and a_exists and m_exists):
        print(f"MISSING files for {sec_id}: b={b_exists}, a={a_exists}, m={m_exists}")
        missing += 1
    else:
        found += 1

print(f"Found: {found}, Missing: {missing}")
