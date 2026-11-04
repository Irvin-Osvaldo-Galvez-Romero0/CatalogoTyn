import os
from PIL import Image

assets_dir = 'public/assets'
png_files = [f for f in os.listdir(assets_dir) if f.lower().endswith('.png') and not f.startswith('.')]

total_saved = 0
processed = 0

print(f"Checking {len(png_files)} PNG files for optimization...")

for f in png_files:
    path = os.path.join(assets_dir, f)
    orig_size = os.path.getsize(path)
    if orig_size < 300 * 1024:
        # Smaller than 300KB, skip to avoid touching already small assets
        continue
    
    try:
        with Image.open(path) as img:
            w, h = img.size
            if w > 900 or h > 900:
                img.thumbnail((900, 900), Image.Resampling.LANCZOS)
                tmp_path = path + '.tmp'
                img.save(tmp_path, format='PNG', optimize=True)
                new_size = os.path.getsize(tmp_path)
                if new_size < orig_size:
                    os.replace(tmp_path, path)
                    saved = orig_size - new_size
                    total_saved += saved
                    processed += 1
                    print(f"Optimized {f}: {orig_size/1024:.0f}KB -> {new_size/1024:.0f}KB (saved {saved/1024:.0f}KB)")
                else:
                    if os.path.exists(tmp_path):
                        os.remove(tmp_path)
    except Exception as e:
        print(f"Error processing {f}: {e}")

print(f"\nDone! Processed and optimized {processed} files.")
print(f"Total payload saved: {total_saved / (1024 * 1024):.2f} MB")
