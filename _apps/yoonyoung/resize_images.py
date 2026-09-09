import os
from PIL import Image

SRC_DIR = 'src/assets'
DST_DIR = 'src/assets/optimized'
MAX_SIZE = 1200  # pixels
EXCLUDE = {'react.svg'}

os.makedirs(DST_DIR, exist_ok=True)

for fname in os.listdir(SRC_DIR):
    if fname in EXCLUDE or not fname.lower().endswith((".jpg", ".jpeg", ".png")):
        continue
    src_path = os.path.join(SRC_DIR, fname)
    dst_path = os.path.join(DST_DIR, os.path.splitext(fname)[0] + '.jpg')
    try:
        with Image.open(src_path) as img:
            w, h = img.size
            if max(w, h) > MAX_SIZE:
                scale = MAX_SIZE / max(w, h)
                new_size = (int(w * scale), int(h * scale))
                img = img.resize(new_size, Image.LANCZOS)
                print(f"Resized {fname}: {w}x{h} -> {new_size[0]}x{new_size[1]}")
            else:
                print(f"Skipped {fname}: already {w}x{h}")
            img = img.convert('RGB')
            img.save(dst_path, 'JPEG', quality=85, optimize=True)
    except Exception as e:
        print(f"Error processing {fname}: {e}")
print("Done.") 