import os
from PIL import Image

assets_dir = 'public/assets'
png_files = [f for f in os.listdir(assets_dir) if f.lower().endswith('.png') and not f.startswith('.')]

print(f"Converting and optimizing {len(png_files)} images...")
total_orig_size = 0
total_webp_size = 0
total_new_png_size = 0

for idx, f in enumerate(png_files):
    png_path = os.path.join(assets_dir, f)
    base_name = os.path.splitext(f)[0]
    webp_path = os.path.join(assets_dir, f"{base_name}.webp")
    
    orig_size = os.path.getsize(png_path)
    total_orig_size += orig_size
    
    try:
        with Image.open(png_path) as img:
            # Handle CMYK or P modes
            if img.mode == 'CMYK':
                img = img.convert('RGBA')
            elif img.mode != 'RGBA' and 'transparency' in img.info:
                img = img.convert('RGBA')
            elif img.mode not in ('RGB', 'RGBA'):
                img = img.convert('RGBA')

            w, h = img.size
            
            # Special case for logo: max 280 width
            if f.startswith('logo'):
                max_dim = 280
            else:
                max_dim = 450
            
            img_resized = img.copy()
            if w > max_dim or h > max_dim:
                img_resized.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
            
            # 1. Save WebP
            img_resized.save(webp_path, format='WEBP', quality=82, method=6)
            webp_size = os.path.getsize(webp_path)
            total_webp_size += webp_size
            
            # 2. Also save optimized smaller PNG
            tmp_png = png_path + '.tmp'
            img_resized.save(tmp_png, format='PNG', optimize=True)
            if os.path.getsize(tmp_png) < orig_size:
                os.replace(tmp_png, png_path)
            else:
                if os.path.exists(tmp_png):
                    os.remove(tmp_png)
            
            new_png_size = os.path.getsize(png_path)
            total_new_png_size += new_png_size

    except Exception as e:
        print(f"Error processing {f}: {e}")

print(f"\nOptimization Finished!")
print(f"Original total PNG payload: {total_orig_size / (1024*1024):.2f} MB")
print(f"New total WebP payload:     {total_webp_size / (1024*1024):.2f} MB")
print(f"New total PNG payload:      {total_new_png_size / (1024*1024):.2f} MB")
print(f"Savings via WebP:           {(total_orig_size - total_webp_size) / (1024*1024):.2f} MB ({100 - (total_webp_size/total_orig_size)*100:.1f}%)")

