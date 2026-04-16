import re

with open('C:/Users/anton/.gemini/antigravity/brain/e08ca2e2-5037-472f-8afb-fc43305c7e3a/.system_generated/logs/overview.txt', 'r', encoding='utf-8') as f:
    txt = f.read()

match = re.search(r'<svg id="section-map-base"[\s\S]*?</svg>', txt)
if match:
    with open('C:/Users/anton/.gemini/antigravity/scratch/lumina-chepauk/src/assets/blueprint.svg', 'w', encoding='utf-8') as out:
        out.write(match.group(0))
    print("SUCCESS")
else:
    print("NOT FOUND")
