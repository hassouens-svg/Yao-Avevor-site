"""Détoure le portrait (rembg) -> PNG transparent.

Usage : python scripts/cutout.py _sources/yao-portrait.png public/images/portrait-cutout.png
"""
import sys
from PIL import Image
from rembg import remove, new_session

src, dst = sys.argv[1], sys.argv[2]
session = new_session("birefnet-portrait" if len(sys.argv) > 3 else "isnet-general-use")
img = Image.open(src).convert("RGB")
out = remove(img, session=session, alpha_matting=True,
             alpha_matting_foreground_threshold=240,
             alpha_matting_background_threshold=15,
             alpha_matting_erode_size=8)
out.save(dst)
print("ok", out.size)
