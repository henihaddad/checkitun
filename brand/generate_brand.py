"""
CheckiTun Brand Document & Logo Generator
Mediterranean Precision design philosophy
"""

import math
import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm, cm
from reportlab.pdfgen import canvas as rl_canvas
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from PIL import Image, ImageDraw, ImageFont
import urllib.request

# ── Palette ──────────────────────────────────────────────────────────────────
OLIVE       = HexColor("#1e3a2f")
OLIVE_MID   = HexColor("#2e5442")
OLIVE_LIGHT = HexColor("#4a7c63")
TERRACOTTA  = HexColor("#c4622d")
TERRA_LIGHT = HexColor("#e0835a")
GOLD        = HexColor("#c9943a")
GOLD_LIGHT  = HexColor("#e8b96a")
SAND        = HexColor("#f0e6d3")
SAND_DARK   = HexColor("#ddd0b8")
CREAM       = HexColor("#fdf9f4")
MUTED       = HexColor("#8c8070")
INK         = HexColor("#1c1a17")
WHITE       = HexColor("#ffffff")
BORDER      = HexColor("#e2d9cb")

# ── Download fonts ────────────────────────────────────────────────────────────
FONT_DIR = os.path.join(os.path.dirname(__file__), "fonts")
os.makedirs(FONT_DIR, exist_ok=True)

FONTS = {
    "Playfair-Regular":  "https://github.com/google/fonts/raw/main/ofl/playfairdisplay/PlayfairDisplay%5Bwght%5D.ttf",
    "DMSans-Regular":    "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
    "DMSans-Light":      "https://github.com/google/fonts/raw/main/ofl/dmsans/DMSans%5Bopsz%2Cwght%5D.ttf",
}

def download_font(name, url):
    path = os.path.join(FONT_DIR, f"{name}.ttf")
    if not os.path.exists(path):
        print(f"Downloading {name}…")
        urllib.request.urlretrieve(url, path)
    return path

for name, url in FONTS.items():
    p = download_font(name, url)
    try:
        pdfmetrics.registerFont(TTFont(name, p))
    except Exception:
        pass

# ── Helper: rounded rect ──────────────────────────────────────────────────────
def rounded_rect(c, x, y, w, h, r, fill=None, stroke=None, lw=0):
    p = c.beginPath()
    p.moveTo(x + r, y)
    p.lineTo(x + w - r, y)
    p.arcTo(x + w - r, y, x + w, y + r, startAng=-90, extent=90)
    p.lineTo(x + w, y + h - r)
    p.arcTo(x + w - r, y + h - r, x + w, y + h, startAng=0, extent=90)
    p.lineTo(x + r, y + h)
    p.arcTo(x, y + h - r, x + r, y + h, startAng=90, extent=90)
    p.lineTo(x, y + r)
    p.arcTo(x, y, x + r, y + r, startAng=180, extent=90)
    p.close()
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(lw or 1)
    if fill and stroke:
        c.drawPath(p, fill=1, stroke=1)
    elif fill:
        c.drawPath(p, fill=1, stroke=0)
    elif stroke:
        c.drawPath(p, fill=0, stroke=1)

def circle(c, cx, cy, r, fill=None, stroke=None, lw=1):
    if fill:
        c.setFillColor(fill)
    if stroke:
        c.setStrokeColor(stroke)
        c.setLineWidth(lw)
    if fill and stroke:
        c.circle(cx, cy, r, fill=1, stroke=1)
    elif fill:
        c.circle(cx, cy, r, fill=1, stroke=0)
    else:
        c.circle(cx, cy, r, fill=0, stroke=1)

def checkmark(c, cx, cy, size, color):
    c.setStrokeColor(color)
    c.setLineWidth(size * 0.12)
    c.setLineCap(1)
    p = c.beginPath()
    p.moveTo(cx - size * 0.32, cy)
    p.lineTo(cx - size * 0.05, cy - size * 0.28)
    p.lineTo(cx + size * 0.35, cy + size * 0.3)
    c.drawPath(p, fill=0, stroke=1)


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 1 — Cover
# ══════════════════════════════════════════════════════════════════════════════
def draw_cover(c, W, H):
    # Background
    c.setFillColor(OLIVE)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Subtle grid
    c.setStrokeColor(HexColor("#ffffff"))
    c.setLineWidth(0.25)
    c.setStrokeAlpha(0.04)
    for xi in range(0, int(W), 24):
        c.line(xi, 0, xi, H)
    for yi in range(0, int(H), 24):
        c.line(0, yi, W, yi)
    c.setStrokeAlpha(1.0)

    # Large decorative circle top-right
    c.setStrokeColor(HexColor("#e8b96a"))
    c.setLineWidth(0.5)
    c.setStrokeAlpha(0.12)
    circle(c, W - 40*mm, H - 20*mm, 110*mm, stroke=GOLD_LIGHT)
    c.setStrokeAlpha(0.06)
    circle(c, W - 40*mm, H - 20*mm, 150*mm, stroke=GOLD_LIGHT)
    c.setStrokeAlpha(1.0)

    # Terracotta accent block (left vertical stripe)
    c.setFillColor(TERRACOTTA)
    c.setFillAlpha(0.18)
    c.rect(0, 0, 6*mm, H, fill=1, stroke=0)
    c.setFillAlpha(1.0)

    # Gold accent bar
    c.setFillColor(GOLD)
    c.rect(0, H * 0.38, 6*mm, H * 0.03, fill=1, stroke=0)

    # Logo mark (large, centered-left)
    lx, ly = 28*mm, H * 0.52
    logo_size = 22*mm
    rounded_rect(c, lx, ly, logo_size, logo_size, 5*mm, fill=HexColor("#ffffff"), )
    c.setFillAlpha(0.08)
    rounded_rect(c, lx, ly, logo_size, logo_size, 5*mm, fill=GOLD)
    c.setFillAlpha(1.0)
    checkmark(c, lx + logo_size / 2, ly + logo_size / 2, logo_size * 0.55, OLIVE)

    # "CheckiTun" wordmark
    c.setFillColor(WHITE)
    c.setFont("Playfair-Regular", 42)
    c.drawString(28*mm, H * 0.43, "CheckiTun")

    # Subtitle
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 10)
    c.setFillAlpha(0.85)
    c.drawString(28*mm, H * 0.395, "BRAND IDENTITY GUIDELINES")
    c.setFillAlpha(1.0)

    # Horizontal rule
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.35)
    c.setLineWidth(0.5)
    c.line(28*mm, H * 0.375, W - 28*mm, H * 0.375)
    c.setStrokeAlpha(1.0)

    # Tagline
    c.setFillColor(WHITE)
    c.setFillAlpha(0.45)
    c.setFont("DMSans-Regular", 9.5)
    c.drawString(28*mm, H * 0.348, "Digital guest registration & compliance — built for Tunisia")
    c.setFillAlpha(1.0)

    # Bottom metadata
    c.setFillColor(WHITE)
    c.setFillAlpha(0.3)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, 18*mm, "Version 1.0   ·   2025   ·   checkitun.tn")
    c.setFillAlpha(1.0)

    # Bottom right: small decorative marks
    c.setFillColor(TERRACOTTA)
    c.setFillAlpha(0.7)
    for i in range(5):
        circle(c, W - 28*mm - i * 5*mm, 18*mm, 1.5*mm, fill=TERRACOTTA)
    c.setFillAlpha(1.0)


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 2 — Logo System
# ══════════════════════════════════════════════════════════════════════════════
def draw_logo_page(c, W, H):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Top label bar
    c.setFillColor(OLIVE)
    c.rect(0, H - 14*mm, W, 14*mm, fill=1, stroke=0)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, H - 8.5*mm, "CHECKITUN  ·  LOGO SYSTEM")

    # Section title
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 28)
    c.drawString(28*mm, H - 38*mm, "Logo System")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 9)
    c.drawString(28*mm, H - 46*mm, "Primary mark, variations, and minimum clear space rules.")

    # Rule
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, H - 51*mm, W - 28*mm, H - 51*mm)

    # ── Primary Logo (dark bg) ─────────────────────────────────────────────
    bx, by, bw, bh = 28*mm, H - 130*mm, 73*mm, 70*mm
    rounded_rect(c, bx, by, bw, bh, 4*mm, fill=OLIVE)
    # icon
    ix, iy = bx + bw/2 - 10*mm, by + bh/2 + 4*mm
    rounded_rect(c, ix, iy, 20*mm, 20*mm, 3.5*mm, fill=HexColor("#ffffff"))
    c.setFillAlpha(0.1)
    rounded_rect(c, ix, iy, 20*mm, 20*mm, 3.5*mm, fill=GOLD)
    c.setFillAlpha(1.0)
    checkmark(c, ix + 10*mm, iy + 10*mm, 11*mm, OLIVE)
    # wordmark
    c.setFillColor(WHITE)
    c.setFont("Playfair-Regular", 17)
    text = "CheckiTun"
    tw = c.stringWidth(text, "Playfair-Regular", 17)
    c.drawString(bx + (bw - tw)/2, by + bh/2 - 8*mm, text)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 6.5)
    sub = "DIGITAL GUEST REGISTRATION"
    sw = c.stringWidth(sub, "DMSans-Regular", 6.5)
    c.drawString(bx + (bw - sw)/2, by + bh/2 - 14*mm, sub)
    # label
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7.5)
    c.drawCentredString(bx + bw/2, by - 8*mm, "Primary — Dark")

    # ── Logo on light bg ──────────────────────────────────────────────────
    bx2 = 28*mm + 80*mm
    rounded_rect(c, bx2, by, bw, bh, 4*mm, fill=SAND)
    # icon
    ix2 = bx2 + bw/2 - 10*mm
    rounded_rect(c, ix2, iy - (bx - bx2)*0 + (by - by), 20*mm, 20*mm, 3.5*mm, fill=OLIVE)
    checkmark(c, ix2 + 10*mm, by + bh/2 + 14*mm, 11*mm, GOLD_LIGHT)
    c.setFillColor(OLIVE)
    c.setFont("Playfair-Regular", 17)
    text2 = "CheckiTun"
    tw2 = c.stringWidth(text2, "Playfair-Regular", 17)
    c.drawString(bx2 + (bw - tw2)/2, by + bh/2 - 8*mm, text2)
    c.setFillColor(TERRACOTTA)
    c.setFont("DMSans-Regular", 6.5)
    sw2 = c.stringWidth(sub, "DMSans-Regular", 6.5)
    c.drawString(bx2 + (bw - sw2)/2, by + bh/2 - 14*mm, sub)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7.5)
    c.drawCentredString(bx2 + bw/2, by - 8*mm, "Primary — Light")

    # ── Icon only ─────────────────────────────────────────────────────────
    bx3 = 28*mm + 160*mm
    bwi = 35*mm
    rounded_rect(c, bx3, by + (bh - bwi)/2, bwi, bwi, 4*mm, fill=OLIVE)
    ixi = bx3 + bwi/2 - 8*mm
    iyi = by + (bh - bwi)/2 + (bwi - 16*mm)/2
    rounded_rect(c, ixi, iyi, 16*mm, 16*mm, 2.5*mm, fill=WHITE)
    c.setFillAlpha(0.1)
    rounded_rect(c, ixi, iyi, 16*mm, 16*mm, 2.5*mm, fill=GOLD)
    c.setFillAlpha(1.0)
    checkmark(c, ixi + 8*mm, iyi + 8*mm, 9*mm, OLIVE)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7.5)
    c.drawCentredString(bx3 + bwi/2, by - 8*mm, "Icon Mark")

    # ── Clear space rule ──────────────────────────────────────────────────
    rule_y = H - 200*mm
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, rule_y, "Clear Space")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 8.5)
    c.drawString(28*mm, rule_y - 8*mm, "Always maintain minimum clear space equal to the height of the 'C' in CheckiTun around all logo marks.")

    # Clear space diagram
    dx, dy, dw, dh = 28*mm, rule_y - 55*mm, 50*mm, 40*mm
    c.setStrokeColor(TERRACOTTA)
    c.setStrokeAlpha(0.3)
    c.setDash(3, 3)
    c.setLineWidth(0.5)
    c.rect(dx, dy, dw, dh, fill=0, stroke=1)
    c.setDash()
    c.setStrokeAlpha(1.0)
    # inner logo
    pad = 5*mm
    rounded_rect(c, dx + pad, dy + pad, dw - 2*pad, dh - 2*pad, 2*mm, fill=OLIVE)
    c.setFillColor(WHITE)
    c.setFont("Playfair-Regular", 8)
    c.drawCentredString(dx + dw/2, dy + dh/2 + 2*mm, "CheckiTun")
    # arrows
    c.setStrokeColor(TERRACOTTA)
    c.setLineWidth(0.5)
    # top arrow
    c.line(dx + dw/2, dy + dh, dx + dw/2, dy + dh + 4*mm)
    c.line(dx + dw/2, dy + dh - pad, dx + dw/2, dy + dh)
    # label
    c.setFillColor(TERRACOTTA)
    c.setFont("DMSans-Regular", 6.5)
    c.drawCentredString(dx + dw/2, dy + dh + 6*mm, "x")
    c.drawString(dx + dw + 3*mm, dy + dh/2, "x")

    # ── Don'ts ────────────────────────────────────────────────────────────
    dont_x = 110*mm
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(dont_x, rule_y, "Logo Don'ts")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 8.5)
    c.drawString(dont_x, rule_y - 8*mm, "Never modify the logo in these ways.")

    donts = [
        "Do not stretch or distort",
        "Do not use unapproved colors",
        "Do not add drop shadows",
        "Do not place on busy backgrounds",
    ]
    for i, txt in enumerate(donts):
        dy2 = rule_y - 22*mm - i * 9*mm
        c.setFillColor(TERRACOTTA)
        circle(c, dont_x + 2.5*mm, dy2 + 2*mm, 2*mm, fill=TERRACOTTA)
        c.setFillColor(INK)
        c.setFont("DMSans-Regular", 8)
        c.drawString(dont_x + 7*mm, dy2, txt)

    # Footer
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, 16*mm, W - 28*mm, 16*mm)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawString(28*mm, 10*mm, "CheckiTun Brand Guidelines  ·  2025")
    c.drawRightString(W - 28*mm, 10*mm, "02")


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 3 — Color System
# ══════════════════════════════════════════════════════════════════════════════
def draw_color_page(c, W, H):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Header bar
    c.setFillColor(OLIVE)
    c.rect(0, H - 14*mm, W, 14*mm, fill=1, stroke=0)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, H - 8.5*mm, "CHECKITUN  ·  COLOR SYSTEM")

    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 28)
    c.drawString(28*mm, H - 38*mm, "Color System")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 9)
    c.drawString(28*mm, H - 46*mm, "Mediterranean Precision palette — drawn from Tunisian earth and light.")

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, H - 51*mm, W - 28*mm, H - 51*mm)

    colors_data = [
        (OLIVE,       "#1e3a2f", "Forest Olive",      "Primary brand color. Trust, permanence, nature.",   "CMYK 48·0·19·77",  "Pantone 357 C"),
        (TERRACOTTA,  "#c4622d", "Terracotta",         "Action, warmth, calls-to-action.",                  "CMYK 0·50·77·23",  "Pantone 7527 C"),
        (GOLD,        "#c9943a", "Hammered Gold",      "Quality indicator. Used sparingly.",                "CMYK 0·26·71·21",  "Pantone 124 C"),
        (SAND,        "#f0e6d3", "Desert Sand",        "Background surfaces. Warm neutrality.",             "CMYK 0·5·13·6",    "Pantone 9183 C"),
        (INK,         "#1c1a17", "Ink",                "Primary text and typographic elements.",            "CMYK 0·8·19·89",   "Pantone Black 6 C"),
        (MUTED,       "#8c8070", "Warm Stone",         "Secondary text. Labels. Captions.",                 "CMYK 0·9·21·45",   "Pantone 403 C"),
    ]

    sw = (W - 56*mm) / 3
    sh = 52*mm
    for i, (col, hex_val, name, desc, cmyk, pantone) in enumerate(colors_data):
        row = i // 3
        col_i = i % 3
        cx = 28*mm + col_i * sw
        cy = H - 65*mm - row * (sh + 8*mm) - sh

        # Color swatch
        rounded_rect(c, cx, cy + 22*mm, sw - 6*mm, sh - 22*mm, 3*mm, fill=col)
        # White dot detail on swatch
        if col not in (SAND, CREAM):
            c.setFillColor(WHITE)
            c.setFillAlpha(0.15)
            circle(c, cx + sw - 14*mm, cy + sh - 8*mm, 4*mm, fill=WHITE)
            c.setFillAlpha(1.0)

        # Color name
        c.setFillColor(INK)
        c.setFont("Playfair-Regular", 11)
        c.drawString(cx, cy + 17*mm, name)

        # Hex
        c.setFillColor(TERRACOTTA)
        c.setFont("DMSans-Regular", 8)
        c.drawString(cx, cy + 10*mm, hex_val.upper())

        # Desc
        c.setFillColor(MUTED)
        c.setFont("DMSans-Regular", 7)
        c.drawString(cx, cy + 4*mm, desc)

        # Technical refs
        c.setFillColor(SAND_DARK)
        c.setFont("DMSans-Regular", 6.5)
        c.drawString(cx, cy - 1*mm, f"{cmyk}   ·   {pantone}")

    # Color combinations section
    combo_y = H - 215*mm
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, combo_y, "Approved Combinations")

    combos = [
        (OLIVE, GOLD_LIGHT, "olive + gold", "Hero backgrounds, primary CTAs"),
        (TERRACOTTA, WHITE, "terracotta + white", "Action buttons, alerts"),
        (SAND, INK, "sand + ink", "Content surfaces, cards"),
        (OLIVE, SAND, "olive + sand", "Navigation, footers"),
    ]
    for i, (bg, fg, label, usage) in enumerate(combos):
        bx = 28*mm + i * 37*mm
        bby = combo_y - 30*mm
        rounded_rect(c, bx, bby, 32*mm, 22*mm, 2.5*mm, fill=bg)
        c.setFillColor(fg)
        c.setFont("Playfair-Regular", 9)
        c.drawCentredString(bx + 16*mm, bby + 10*mm, "Aa")
        c.setFillColor(MUTED)
        c.setFont("DMSans-Regular", 6.5)
        c.drawCentredString(bx + 16*mm, bby - 4.5*mm, label)

    # Footer
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, 16*mm, W - 28*mm, 16*mm)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawString(28*mm, 10*mm, "CheckiTun Brand Guidelines  ·  2025")
    c.drawRightString(W - 28*mm, 10*mm, "03")


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 4 — Typography
# ══════════════════════════════════════════════════════════════════════════════
def draw_type_page(c, W, H):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Header bar
    c.setFillColor(OLIVE)
    c.rect(0, H - 14*mm, W, 14*mm, fill=1, stroke=0)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, H - 8.5*mm, "CHECKITUN  ·  TYPOGRAPHY")

    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 28)
    c.drawString(28*mm, H - 38*mm, "Typography")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 9)
    c.drawString(28*mm, H - 46*mm, "A two-typeface system balancing editorial warmth with digital clarity.")

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, H - 51*mm, W - 28*mm, H - 51*mm)

    # ── Playfair Display ──────────────────────────────────────────────────
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 11)
    c.drawString(28*mm, H - 62*mm, "01 — DISPLAY TYPEFACE")
    c.setFillColor(TERRACOTTA)
    c.setFont("Playfair-Regular", 9)
    c.drawString(28*mm, H - 70*mm, "Playfair Display")

    # Large specimen
    c.setFillColor(OLIVE)
    c.setFont("Playfair-Regular", 58)
    c.drawString(28*mm, H - 105*mm, "AaBb")
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, H - 115*mm, "Guest check-in, finally digital.")
    c.setFillColor(MUTED)
    c.setFont("Playfair-Regular", 10)
    c.drawString(28*mm, H - 123*mm, "Zero paperwork. Full compliance.")

    # Usage table
    usages_p = [
        ("H1 — Hero Headline",         "Playfair Display",  "Bold 900",     "clamp(38–64px)"),
        ("H2 — Section Title",          "Playfair Display",  "Bold 800",     "32–52px"),
        ("H3 — Card Title",             "Playfair Display",  "SemiBold 700", "18–22px"),
        ("Italic Accent",               "Playfair Display",  "Italic 700",   "match parent"),
    ]
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.4)
    c.line(28*mm, H - 129*mm, W - 28*mm, H - 129*mm)
    cols_x = [28*mm, 75*mm, 120*mm, 155*mm]
    headers = ["Usage", "Face", "Weight", "Size"]
    for hi, h in enumerate(headers):
        c.setFillColor(MUTED)
        c.setFont("DMSans-Regular", 7)
        c.drawString(cols_x[hi], H - 135*mm, h.upper())
    for ri, row in enumerate(usages_p):
        ry = H - 143*mm - ri * 8*mm
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.3)
        c.line(28*mm, ry - 2*mm, W - 28*mm, ry - 2*mm)
        for ci, val in enumerate(row):
            c.setFillColor(INK if ci == 0 else MUTED)
            c.setFont("DMSans-Regular", 8)
            c.drawString(cols_x[ci], ry + 2*mm, val)

    # ── DM Sans ──────────────────────────────────────────────────────────
    ty2 = H - 190*mm
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 11)
    c.drawString(28*mm, ty2, "02 — BODY TYPEFACE")
    c.setFillColor(TERRACOTTA)
    c.setFont("Playfair-Regular", 9)
    c.drawString(28*mm, ty2 - 8*mm, "DM Sans")

    c.setFillColor(INK)
    c.setFont("DMSans-Regular", 28)
    c.drawString(28*mm, ty2 - 30*mm, "AaBbCcDd 0123")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 9)
    c.drawString(28*mm, ty2 - 40*mm, "Send a WhatsApp or SMS link. Guests fill in their identity info before arrival.")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 8)
    c.drawString(28*mm, ty2 - 49*mm, "All guest data is encrypted in transit and at rest. You control who can access records.")

    usages_d = [
        ("Body copy",         "DM Sans",  "Regular 400",  "15–18px, 1.7 line-height"),
        ("UI labels / caps",  "DM Sans",  "SemiBold 600", "11–13px, 0.08em tracking"),
        ("Captions",          "DM Sans",  "Light 300",    "12–13px"),
        ("Buttons",           "DM Sans",  "Bold 700",     "14–16px"),
    ]
    c.setStrokeColor(BORDER)
    c.line(28*mm, ty2 - 55*mm, W - 28*mm, ty2 - 55*mm)
    for hi, h in enumerate(headers):
        c.setFillColor(MUTED)
        c.setFont("DMSans-Regular", 7)
        c.drawString(cols_x[hi], ty2 - 61*mm, h.upper())
    for ri, row in enumerate(usages_d):
        ry = ty2 - 69*mm - ri * 8*mm
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.3)
        c.line(28*mm, ry - 2*mm, W - 28*mm, ry - 2*mm)
        for ci, val in enumerate(row):
            c.setFillColor(INK if ci == 0 else MUTED)
            c.setFont("DMSans-Regular", 8)
            c.drawString(cols_x[ci], ry + 2*mm, val)

    # Footer
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, 16*mm, W - 28*mm, 16*mm)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawString(28*mm, 10*mm, "CheckiTun Brand Guidelines  ·  2025")
    c.drawRightString(W - 28*mm, 10*mm, "04")


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 5 — Brand Voice & Usage
# ══════════════════════════════════════════════════════════════════════════════
def draw_voice_page(c, W, H):
    c.setFillColor(OLIVE)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Grid overlay
    c.setStrokeColor(WHITE)
    c.setStrokeAlpha(0.03)
    c.setLineWidth(0.3)
    for xi in range(0, int(W), 20):
        c.line(xi, 0, xi, H)
    c.setStrokeAlpha(1.0)

    # Right accent block
    c.setFillColor(TERRACOTTA)
    c.setFillAlpha(0.15)
    c.rect(W - 6*mm, 0, 6*mm, H, fill=1, stroke=0)
    c.setFillAlpha(1.0)
    c.setFillColor(GOLD)
    c.rect(W - 6*mm, H * 0.6, 6*mm, H * 0.03, fill=1, stroke=0)

    # Header
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, H - 22*mm, "CHECKITUN  ·  BRAND VOICE")

    c.setFillColor(WHITE)
    c.setFont("Playfair-Regular", 34)
    c.drawString(28*mm, H - 48*mm, "Brand Voice")

    c.setFillColor(WHITE)
    c.setFillAlpha(0.5)
    c.setFont("DMSans-Regular", 9.5)
    c.drawString(28*mm, H - 57*mm, "How CheckiTun speaks — the personality behind every word.")
    c.setFillAlpha(1.0)

    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(0.3)
    c.setLineWidth(0.5)
    c.line(28*mm, H - 63*mm, W - 34*mm, H - 63*mm)
    c.setStrokeAlpha(1.0)

    # Voice pillars
    pillars = [
        ("Confident",    "We know our product works. We don't hedge or over-qualify. Short sentences. Active voice."),
        ("Warm",         "We treat hosts as partners, not users. The tone is personal — like advice from someone who has been there."),
        ("Clear",        "No jargon. No legalese. If a host in Hammamet on a phone in 2 minutes can't understand it, rewrite it."),
        ("Local",        "Tunisia is in our name. We reference the landscape, the culture, the specific reality of Tunisian hospitality."),
    ]
    for i, (title, body) in enumerate(pillars):
        px = 28*mm
        py = H - 82*mm - i * 32*mm

        # Number
        c.setFillColor(GOLD)
        c.setFillAlpha(0.25)
        c.setFont("Playfair-Regular", 36)
        c.drawString(px, py, f"0{i+1}")
        c.setFillAlpha(1.0)

        c.setFillColor(WHITE)
        c.setFont("Playfair-Regular", 14)
        c.drawString(px + 20*mm, py + 4*mm, title)

        c.setFillColor(WHITE)
        c.setFillAlpha(0.55)
        c.setFont("DMSans-Regular", 8.5)
        c.drawString(px + 20*mm, py - 4*mm, body)
        c.setFillAlpha(1.0)

        c.setStrokeColor(WHITE)
        c.setStrokeAlpha(0.07)
        c.setLineWidth(0.4)
        c.line(28*mm, py - 10*mm, W - 34*mm, py - 10*mm)
        c.setStrokeAlpha(1.0)

    # Do / Don't examples
    ex_y = H - 220*mm
    c.setFillColor(WHITE)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, ex_y, "In Practice")

    examples = [
        ("✓", GOLD_LIGHT,  "Your guest records are ready to submit.",       "Compliant, clear, respectful of the host's time."),
        ("✓", GOLD_LIGHT,  "Share a link. Get compliant records. Done.",    "Headline copy — bold, confident, three beats."),
        ("✗", TERRACOTTA, "Please ensure all required fields are complete.", "Too passive. Too bureaucratic."),
        ("✗", TERRACOTTA, "Utilise our platform to optimise compliance.",    "Jargon. Not how a person speaks."),
    ]
    for i, (mark, col, text, note) in enumerate(examples):
        ey = ex_y - 16*mm - i * 16*mm
        c.setFillColor(col)
        c.setFont("DMSans-Regular", 9)
        c.drawString(28*mm, ey, mark)
        c.setFillColor(WHITE)
        c.setFont("DMSans-Regular", 9)
        c.drawString(35*mm, ey, text)
        c.setFillColor(WHITE)
        c.setFillAlpha(0.35)
        c.setFont("DMSans-Regular", 7.5)
        c.drawString(35*mm, ey - 6*mm, note)
        c.setFillAlpha(1.0)

    # Footer
    c.setStrokeColor(WHITE)
    c.setStrokeAlpha(0.12)
    c.setLineWidth(0.5)
    c.line(28*mm, 16*mm, W - 34*mm, 16*mm)
    c.setStrokeAlpha(1.0)
    c.setFillColor(WHITE)
    c.setFillAlpha(0.3)
    c.setFont("DMSans-Regular", 7)
    c.drawString(28*mm, 10*mm, "CheckiTun Brand Guidelines  ·  2025")
    c.drawRightString(W - 34*mm, 10*mm, "05")
    c.setFillAlpha(1.0)


# ══════════════════════════════════════════════════════════════════════════════
#  PAGE 6 — Spacing, Icons & Digital UI
# ══════════════════════════════════════════════════════════════════════════════
def draw_ui_page(c, W, H):
    c.setFillColor(CREAM)
    c.rect(0, 0, W, H, fill=1, stroke=0)

    # Header bar
    c.setFillColor(OLIVE)
    c.rect(0, H - 14*mm, W, 14*mm, fill=1, stroke=0)
    c.setFillColor(GOLD_LIGHT)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm, H - 8.5*mm, "CHECKITUN  ·  DIGITAL UI & SPACING")

    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 28)
    c.drawString(28*mm, H - 38*mm, "Digital UI & Spacing")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 9)
    c.drawString(28*mm, H - 46*mm, "Component anatomy, spacing scale, and border radius system.")

    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, H - 51*mm, W - 28*mm, H - 51*mm)

    # Spacing scale
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, H - 62*mm, "Spacing Scale (4px base)")
    spaces = [4, 8, 12, 16, 24, 32, 48, 64]
    for i, sp in enumerate(spaces):
        bx = 28*mm + i * 17*mm
        bw = sp * 0.6
        by = H - 78*mm
        c.setFillColor(OLIVE_MID)
        c.rect(bx, by, bw, 6*mm, fill=1, stroke=0)
        c.setFillColor(INK)
        c.setFont("DMSans-Regular", 7)
        c.drawCentredString(bx + bw/2, by - 5*mm, f"{sp}px")

    # Border radius system
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, H - 102*mm, "Border Radius System")
    radii = [(4, "sm"), (8, "md"), (12, "lg"), (20, "xl"), (28, "2xl"), (9999, "full")]
    for i, (r, label) in enumerate(radii):
        bx = 28*mm + i * 24*mm
        by = H - 125*mm
        bsize = 18*mm
        actual_r = min(r, bsize/2) * 0.35 * mm
        rounded_rect(c, bx, by, bsize, bsize, actual_r, fill=SAND, stroke=BORDER, lw=0.5)
        c.setFillColor(MUTED)
        c.setFont("DMSans-Regular", 7)
        c.drawCentredString(bx + bsize/2, by - 5*mm, label)
        r_val = f"{r}px" if r < 9999 else "50%"
        c.drawCentredString(bx + bsize/2, by - 10.5*mm, r_val)

    # Component examples: Button + Card + Input
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, H - 148*mm, "UI Components")

    comp_y = H - 175*mm

    # Primary Button
    bw, bh = 48*mm, 12*mm
    rounded_rect(c, 28*mm, comp_y, bw, bh, 3*mm, fill=OLIVE)
    c.setFillColor(WHITE)
    c.setFont("DMSans-Regular", 8.5)
    label_w = c.stringWidth("Get Early Access", "DMSans-Regular", 8.5)
    c.drawString(28*mm + (bw - label_w)/2, comp_y + 3.8*mm, "Get Early Access")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawCentredString(28*mm + bw/2, comp_y - 5*mm, "Primary Button")

    # Secondary Button
    bx2 = 28*mm + 54*mm
    rounded_rect(c, bx2, comp_y, bw, bh, 3*mm, fill=None, stroke=TERRACOTTA, lw=1)
    c.setFillColor(TERRACOTTA)
    c.setFont("DMSans-Regular", 8.5)
    label2_w = c.stringWidth("Learn More", "DMSans-Regular", 8.5)
    c.drawString(bx2 + (bw - label2_w)/2, comp_y + 3.8*mm, "Learn More")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawCentredString(bx2 + bw/2, comp_y - 5*mm, "Secondary Button")

    # Input field
    bx3 = 28*mm + 108*mm
    iw = 56*mm
    rounded_rect(c, bx3, comp_y, iw, bh, 3*mm, fill=WHITE, stroke=BORDER, lw=0.8)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 8)
    c.drawString(bx3 + 3*mm, comp_y + 3.8*mm, "your@email.com")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawCentredString(bx3 + iw/2, comp_y - 5*mm, "Input Field")

    # Card component
    card_y = comp_y - 50*mm
    cw, ch = 88*mm, 40*mm
    rounded_rect(c, 28*mm, card_y, cw, ch, 4*mm, fill=WHITE, stroke=BORDER, lw=0.5)
    rounded_rect(c, 28*mm + 3*mm, card_y + ch - 13*mm, 9*mm, 9*mm, 1.5*mm, fill=OLIVE)
    c.setFillColor(WHITE)
    c.setFont("DMSans-Regular", 6)
    c.drawCentredString(28*mm + 7.5*mm, card_y + ch - 7.5*mm, "✓")
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 9)
    c.drawString(28*mm + 15*mm, card_y + ch - 8*mm, "Legally compliant by design")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7.5)
    c.drawString(28*mm + 3*mm, card_y + ch - 18*mm, "Forms structured to match Tunisian")
    c.drawString(28*mm + 3*mm, card_y + ch - 24*mm, "Ministry requirements.")
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawCentredString(28*mm + cw/2, card_y - 5*mm, "Feature Card")

    # Elevation shadows note
    c.setFillColor(INK)
    c.setFont("Playfair-Regular", 13)
    c.drawString(28*mm, card_y - 20*mm, "Elevation & Shadow")
    shadows = [
        ("None",    "Default cards, inactive"),
        ("sm",      "0 4px 16px rgba(0,0,0,0.05)"),
        ("md",      "0 8px 32px rgba(0,0,0,0.08) — hover states"),
        ("lg",      "0 20px 60px rgba(0,0,0,0.12) — modals, pricing hero"),
    ]
    for i, (lvl, desc) in enumerate(shadows):
        sy = card_y - 32*mm - i * 8*mm
        c.setFillColor(TERRACOTTA)
        c.setFont("DMSans-Regular", 8)
        c.drawString(28*mm, sy, lvl)
        c.setFillColor(MUTED)
        c.drawString(44*mm, sy, desc)

    # Footer
    c.setStrokeColor(BORDER)
    c.setLineWidth(0.5)
    c.line(28*mm, 16*mm, W - 28*mm, 16*mm)
    c.setFillColor(MUTED)
    c.setFont("DMSans-Regular", 7)
    c.drawString(28*mm, 10*mm, "CheckiTun Brand Guidelines  ·  2025")
    c.drawRightString(W - 28*mm, 10*mm, "06")


# ══════════════════════════════════════════════════════════════════════════════
#  BUILD PDF
# ══════════════════════════════════════════════════════════════════════════════
def build_brand_pdf():
    out = os.path.join(os.path.dirname(__file__), "checkitun-brand-guidelines.pdf")
    W, H = A4
    c = rl_canvas.Canvas(out, pagesize=A4)
    c.setTitle("CheckiTun Brand Guidelines")
    c.setAuthor("CheckiTun")

    draw_cover(c, W, H);     c.showPage()
    draw_logo_page(c, W, H); c.showPage()
    draw_color_page(c, W, H);c.showPage()
    draw_type_page(c, W, H); c.showPage()
    draw_voice_page(c, W, H);c.showPage()
    draw_ui_page(c, W, H);   c.showPage()

    c.save()
    print(f"✓ Brand PDF → {out}")
    return out


# ══════════════════════════════════════════════════════════════════════════════
#  LOGO PNG  (1024 × 1024 — super-sampled for crisp anti-aliasing)
# ══════════════════════════════════════════════════════════════════════════════
def build_logo_png():
    # Draw at 4× resolution, then downsample → clean anti-aliasing
    SCALE = 4
    SIZE = 1024 * SCALE  # 4096 working canvas
    OUT  = 1024

    from PIL.ImageFilter import GaussianBlur

    def rr(draw, x0, y0, x1, y1, r, fill):
        draw.rectangle([x0 + r, y0, x1 - r, y1], fill=fill)
        draw.rectangle([x0, y0 + r, x1, y1 - r], fill=fill)
        draw.ellipse([x0,       y0,       x0+2*r, y0+2*r], fill=fill)
        draw.ellipse([x1-2*r,   y0,       x1,     y0+2*r], fill=fill)
        draw.ellipse([x0,       y1-2*r,   x0+2*r, y1    ], fill=fill)
        draw.ellipse([x1-2*r,   y1-2*r,   x1,     y1    ], fill=fill)

    img = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    d   = ImageDraw.Draw(img)

    # ── Background ────────────────────────────────────────────────────────
    rr(d, 0, 0, SIZE, SIZE, 720, (30, 58, 47, 255))

    # ── Subtle grid ───────────────────────────────────────────────────────
    step = 192
    for xi in range(0, SIZE, step):
        d.line([(xi, 0), (xi, SIZE)], fill=(255, 255, 255, 6), width=2)
    for yi in range(0, SIZE, step):
        d.line([(0, yi), (SIZE, yi)], fill=(255, 255, 255, 6), width=2)

    # ── Decorative rings top-right ────────────────────────────────────────
    for rr_rad, alpha, lw in [(1120, 18, 3), (900, 11, 2), (660, 7, 2)]:
        ri = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
        rd = ImageDraw.Draw(ri)
        cx_r, cy_r = SIZE - 480, 480
        rd.ellipse([cx_r-rr_rad, cy_r-rr_rad, cx_r+rr_rad, cy_r+rr_rad],
                   outline=(232, 185, 106, alpha), width=lw)
        img = Image.alpha_composite(img, ri)
        d = ImageDraw.Draw(img)

    # ── Terracotta glow bottom-left ───────────────────────────────────────
    blob = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    bd = ImageDraw.Draw(blob)
    bd.ellipse([-200, SIZE - 1100, 1100, SIZE + 200], fill=(196, 98, 45, 32))
    blob = blob.filter(GaussianBlur(radius=180))
    img = Image.alpha_composite(img, blob)
    d = ImageDraw.Draw(img)

    # ── Gold glow centre ──────────────────────────────────────────────────
    glow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gcx, gcy, gr = SIZE//2, SIZE//2 - 80, 700
    gd.ellipse([gcx-gr, gcy-gr, gcx+gr, gcy+gr], fill=(201, 148, 58, 14))
    glow = glow.filter(GaussianBlur(radius=200))
    img = Image.alpha_composite(img, glow)
    d = ImageDraw.Draw(img)

    # ── White icon card ───────────────────────────────────────────────────
    card_size = 1240
    card_x = (SIZE - card_size) // 2
    card_y = SIZE // 2 - card_size // 2 - 180
    card_r = 240

    # Drop shadow
    shadow = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    sd = ImageDraw.Draw(shadow)
    rr(sd, card_x + 20, card_y + 40, card_x + card_size + 20, card_y + card_size + 40,
       card_r, (0, 0, 0, 60))
    shadow = shadow.filter(GaussianBlur(radius=80))
    img = Image.alpha_composite(img, shadow)
    d = ImageDraw.Draw(img)

    # White card
    rr(d, card_x, card_y, card_x + card_size, card_y + card_size, card_r, (253, 249, 244, 255))

    # Faint gold tint on card
    ov = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    rr(od, card_x, card_y, card_x + card_size, card_y + card_size, card_r, (201, 148, 58, 14))
    img = Image.alpha_composite(img, ov)
    d = ImageDraw.Draw(img)

    # ── Checkmark (clean polygon approach) ───────────────────────────────
    # Draw at high res with proper line caps → looks smooth after downsample
    ck_cx = SIZE // 2
    ck_cy = card_y + card_size // 2 + 20

    # Checkmark geometry
    sw = 110  # stroke width
    p1 = (ck_cx - 340, ck_cy + 40)
    p2 = (ck_cx - 80,  ck_cy + 300)
    p3 = (ck_cx + 380, ck_cy - 340)

    # Draw with thick joint using polygon fill for each segment
    def thick_line_polygon(p_a, p_b, width, color, draw):
        import math
        dx = p_b[0] - p_a[0]
        dy = p_b[1] - p_a[1]
        length = math.hypot(dx, dy)
        if length == 0:
            return
        nx = -dy / length * width / 2
        ny =  dx / length * width / 2
        poly = [
            (p_a[0] + nx, p_a[1] + ny),
            (p_b[0] + nx, p_b[1] + ny),
            (p_b[0] - nx, p_b[1] - ny),
            (p_a[0] - nx, p_a[1] - ny),
        ]
        draw.polygon(poly, fill=color)
        draw.ellipse([p_a[0]-width//2, p_a[1]-width//2, p_a[0]+width//2, p_a[1]+width//2], fill=color)
        draw.ellipse([p_b[0]-width//2, p_b[1]-width//2, p_b[0]+width//2, p_b[1]+width//2], fill=color)

    ck_color = (30, 58, 47, 255)
    thick_line_polygon(p1, p2, sw, ck_color, d)
    thick_line_polygon(p2, p3, sw, ck_color, d)

    # ── Wordmark ──────────────────────────────────────────────────────────
    try:
        font_path  = os.path.join(FONT_DIR, "Playfair-Regular.ttf")
        font_wm    = ImageFont.truetype(font_path, 460)
        dmsans_path = os.path.join(FONT_DIR, "DMSans-Regular.ttf")
        font_tag   = ImageFont.truetype(dmsans_path, 148)
    except Exception:
        font_wm  = ImageFont.load_default()
        font_tag = font_wm

    word1, word2 = "Checki", "Tun"
    bb1 = d.textbbox((0, 0), word1, font=font_wm)
    bb2 = d.textbbox((0, 0), word2, font=font_wm)
    w1  = bb1[2] - bb1[0]
    w2  = bb2[2] - bb2[0]
    wm_x = (SIZE - w1 - w2) // 2
    wm_y = card_y + card_size + 110

    d.text((wm_x,      wm_y), word1, font=font_wm, fill=(255, 255, 255, 245))
    d.text((wm_x + w1, wm_y), word2, font=font_wm, fill=(196, 98,  45,  255))

    # Tagline
    tag = "DIGITAL GUEST REGISTRATION"
    tb  = d.textbbox((0, 0), tag, font=font_tag)
    tw  = tb[2] - tb[0]
    d.text(((SIZE - tw) // 2, wm_y + 490), tag, font=font_tag, fill=(232, 185, 106, 155))

    # ── Gold accent dots ──────────────────────────────────────────────────
    dot_r = 26
    dot_gap = 56
    n_dots = 5
    dots_w = n_dots * dot_r * 2 + (n_dots - 1) * dot_gap
    dot_start_x = (SIZE - dots_w) // 2
    dot_y_pos = SIZE - 180
    for di in range(n_dots):
        dxp = dot_start_x + di * (dot_r * 2 + dot_gap)
        col = (196, 98, 45, 200) if di == 2 else (232, 185, 106, 110)
        d.ellipse([dxp, dot_y_pos, dxp + dot_r*2, dot_y_pos + dot_r*2], fill=col)

    # ── Downsample to final size ──────────────────────────────────────────
    img = img.resize((OUT, OUT), Image.LANCZOS)

    out_path = os.path.join(os.path.dirname(__file__), "checkitun-logo.png")
    img.save(out_path, "PNG")
    print(f"✓ Logo PNG  → {out_path}")
    return out_path


if __name__ == "__main__":
    build_brand_pdf()
    build_logo_png()
    print("Done.")
