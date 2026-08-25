#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""灶台帮 logo 概念稿: A 炭火徽章 / B 朱红印章 / C 极简渐变"""
import math
from PIL import Image, ImageDraw, ImageFont

SIZE = 512
FONT = "/usr/share/fonts/truetype/wqy/wqy-zenhei.ttc"
OUT = "/home/ubuntu/projects/miao-todos-front/logo-concepts"

def font(sz):
    return ImageFont.truetype(FONT, sz)

def flame(d, cx, base_y, tip_y, hw, color, core_color=None, core_hw=None):
    """水滴形火苗: 下部椭圆 + 上部尖三角"""
    h = base_y - tip_y
    y0 = base_y - int(h * 0.72)          # 椭圆顶边
    d.ellipse([cx - hw, y0, cx + hw, base_y], fill=color)
    d.polygon([(cx - hw, y0), (cx + hw, y0), (cx, tip_y)], fill=color)
    if core_color and core_hw:
        ch = base_y - 8 - tip_y
        cy0 = base_y - 8 - int(ch * 0.72)
        d.ellipse([cx - core_hw, cy0, cx + core_hw, base_y - 8], fill=core_color)
        d.polygon([(cx - core_hw, cy0), (cx + core_hw, cy0), (cx, tip_y + 46)], fill=core_color)

# ---------- A: 炭火徽章 ----------
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.ellipse([8, 8, 504, 504], fill=(43, 35, 32, 255))          # 深炭底
d.ellipse([22, 22, 490, 490], outline=(217, 164, 65, 255), width=5)  # 金边
# 火焰(先画, 锅后画盖住底部 → 锅里窜火)
flame(d, 256, 380, 100, 86, (232, 93, 31, 255), (247, 168, 27, 255), 53)
flame(d, 256, 350, 205, 30, (255, 224, 138, 255))
# 炒锅
d.pieslice([126, 260, 386, 440], 180, 360, fill=(63, 63, 63, 255))
d.arc([126, 260, 386, 440], 180, 360, fill=(154, 154, 154, 255), width=5)
d.rounded_rectangle([386, 344, 452, 386], radius=10, fill=(63, 63, 63, 255))
d.ellipse([442, 350, 468, 380], fill=(85, 85, 85, 255))
# 文字
f = font(64)
d.text((256, 480), "灶台帮", font=f, fill=(217, 164, 65, 255), anchor="mm")
img.save(f"{OUT}/logo-A-carbon.png")
img.resize((144, 144), Image.LANCZOS).save(f"{OUT}/logo-A-carbon-144.png")

# ---------- B: 朱红印章 ----------
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
d.rounded_rectangle([16, 16, 496, 496], radius=96, fill=(250, 243, 225, 255))  # 米白底
RED = (200, 55, 47, 255)
d.ellipse([48, 48, 464, 464], outline=RED, width=9)
d.ellipse([66, 66, 446, 446], outline=RED, width=3)
f = font(104)
d.text((256, 236), "灶台帮", font=f, fill=RED, anchor="mm")
# 火苗
d.ellipse([226, 322, 286, 378], fill=RED)
d.polygon([(226, 342), (286, 342), (256, 292)], fill=RED)
img.save(f"{OUT}/logo-B-seal.png")
img.resize((144, 144), Image.LANCZOS).save(f"{OUT}/logo-B-seal-144.png")

# ---------- C: 极简渐变 ----------
img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
d = ImageDraw.Draw(img)
c1, c2 = (255, 106, 43), (200, 55, 47)
r = 252
for y in range(SIZE):
    t = y / SIZE
    col = tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))
    half = math.sqrt(max(0, r * r - (y - 256) ** 2))
    if half > 0:
        d.line([256 - half, y, 256 + half, y], fill=col + (255,))
d.ellipse([4, 4, 508, 508], outline=(255, 255, 255, 255), width=4)
# 白色火焰
flame(d, 256, 402, 96, 92, (255, 255, 255, 255), (200, 55, 47, 255), 40)
# 锅沿弧线
d.arc([96, 330, 416, 500], 180, 360, fill=(255, 255, 255, 255), width=22)
img.save(f"{OUT}/logo-C-minimal.png")
img.resize((144, 144), Image.LANCZOS).save(f"{OUT}/logo-C-minimal-144.png")

print("done:", OUT)
