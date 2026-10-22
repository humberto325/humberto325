"""Converts a portrait photo into braille-dot art (2x4 dots per character).

usage: python tools/braille.py <photo> <out.txt> [columns]
Lines are padded with U+2800 (blank braille) so every line has the same glyph count.
"""
import sys

from PIL import Image, ImageFilter, ImageOps

photo, out = sys.argv[1], sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 60

img = Image.open(photo).convert('L')
w, h = img.size
img = img.crop((int(w * .17), int(h * .02), int(w * .83), int(h * .86)))  # head and collar
mask = img.point(lambda v: 255 if v > 28 else 0).filter(ImageFilter.MaxFilter(5))
img = img.point(lambda v: int(255 * (v / 255) ** .75))  # lift the shadowed side of the face
img = ImageOps.equalize(img, mask=mask)
img = img.filter(ImageFilter.UnsharpMask(radius=20, percent=50, threshold=0))  # local contrast
img = img.filter(ImageFilter.UnsharpMask(radius=2, percent=120, threshold=2))  # feature edges
img = Image.composite(img, Image.new('L', img.size, 0), mask)

pw = cols * 2
ph = round(pw * img.size[1] / img.size[0] / 4) * 4  # braille dots are roughly square
small = img.resize((pw, ph), Image.LANCZOS)

# Atkinson dithering: diffuses only 6/8 of the error, so contrast stays high and noise stays low.
buf = [[small.getpixel((x, y)) for x in range(pw)] for y in range(ph)]
dots = [[False] * pw for _ in range(ph)]
for y in range(ph):
    for x in range(pw):
        old = buf[y][x]
        on = old > 127
        dots[y][x] = on
        e = (old - (255 if on else 0)) / 8
        for dx, dy in ((1, 0), (2, 0), (-1, 1), (0, 1), (1, 1), (0, 2)):
            if 0 <= x + dx < pw and y + dy < ph:
                buf[y + dy][x + dx] += e

# Dot numbering of a braille cell -> bit value (Unicode braille block starts at U+2800).
BITS = ((0, 0, 0x01), (0, 1, 0x02), (0, 2, 0x04), (1, 0, 0x08), (1, 1, 0x10), (1, 2, 0x20), (0, 3, 0x40), (1, 3, 0x80))
lines = []
for cy in range(0, ph, 4):
    row = []
    for cx in range(0, pw, 2):
        code = sum(bit for dx, dy, bit in BITS if dots[cy + dy][cx + dx])
        row.append(chr(0x2800 + code))
    lines.append(''.join(row))
open(out, 'w', encoding='utf-8').write('\n'.join(lines) + '\n')
print(f'{cols}x{len(lines)} chars, {pw}x{ph} dots')
