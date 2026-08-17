"""Builds the email route-line animation.

One continuous journey along a single route line, at constant speed. The mode
changes by thirds: the truck runs the first third, then vanishes and the plane
picks up from exactly that point, then the ship takes the last third. Nothing
ever stops — the motion is linear end to end, and the vehicle enters and exits
off-canvas so the loop has no visible seam.

Renders every frame as one tall spritesheet in Chrome (crisp SVG artwork), then
slices it into an animated GIF with Pillow.

  python3 scripts/build-email-strip.py html   # write strip.html
  <screenshot with headless Chrome at 1120 x (104 * TOTAL)>
  python3 scripts/build-email-strip.py gif    # write route.gif
"""

import sys
from pathlib import Path

OUT = Path(__file__).parent
W, H = 1120, 104          # 2x of 560x52 display size
TOTAL = 66
FRAME_MS = 90             # 66 x 90ms -> a touch under 6s per lap

ROUTE = "#861B28"         # brand maroon: the route line and every vehicle
BAND = "#f6f8fc"          # surface-soft band

BASELINE = 70             # y of the route line
LINE_H = 2                # 1px once displayed at half size

# Side-view silhouettes, each drawn on a 120x44 box sitting at y=44.
TRUCK = """
  <path d="M2 8 H58 V36 H2 Z"/>
  <path d="M60 18 H78 L90 28 V36 H60 Z"/>
  <circle cx="18" cy="38" r="6"/>
  <circle cx="76" cy="38" r="6"/>
"""

PLANE = """
  <path d="M13 27 C13 22 23 19 39 19 L95 19 C107 19 115 22 118 24.5 C115 27 107 30 95 30 L27 30 C17 30 13 28.5 13 27 Z"/>
  <path d="M17 21 L7 3 H18 L31 21 Z"/>
  <path d="M52 29 H74 L60 43 H42 Z"/>
  <path d="M15 23 L4 17 H13 L24 23 Z"/>
"""

SHIP = """
  <path d="M4 28 H116 L106 40 H14 Z"/>
  <path d="M16 16 H36 V28 H16 Z"/>
  <path d="M40 10 H62 V28 H40 Z"/>
  <path d="M66 18 H82 V28 H66 Z"/>
  <path d="M88 8 H102 V28 H88 Z"/>
  <path d="M94 2 H96 V8 H94 Z"/>
"""

# (paths, width, lift) — lift clears the route line: road and sea ride on it,
# air flies above it.
TRUCK_V = (TRUCK, 96, 0)
PLANE_V = (PLANE, 116, 7)
SHIP_V = (SHIP, 116, 0)

WIDEST = 116


def vehicle_for(nose: float):
    """Mode by thirds of the visible band — swapped in place, mid-stride."""
    if nose < W / 3:
        return TRUCK_V
    if nose < W * 2 / 3:
        return PLANE_V
    return SHIP_V


def vehicle_markup(nose: float) -> str:
    paths, vw, lift = vehicle_for(nose)
    scale = vw / 120
    vh = 44 * scale
    return (
        f"""<g transform="translate({nose - vw:.2f},{BASELINE - vh - lift:.2f}) """
        f"""scale({scale:.4f})" fill="{ROUTE}">{paths}</g>"""
    )


def frame_markup(index: int) -> str:
    # Linear: constant speed, no easing anywhere, so nothing reads as a stop.
    nose = W * (index / TOTAL)
    # A second copy one band ahead means the ship is still sliding off the right
    # edge while the truck is already entering from the left — the lap has no
    # empty beat, and the loop point is invisible. Anything off-canvas is
    # clipped by the viewBox.
    bodies = vehicle_markup(nose) + vehicle_markup(nose + W)

    return f"""
    <div class="f">
      <svg width="{W}" height="{H}" viewBox="0 0 {W} {H}" xmlns="http://www.w3.org/2000/svg">
        <rect width="{W}" height="{H}" fill="{BAND}"/>
        <rect x="0" y="{BASELINE - LINE_H // 2}" width="{W}" height="{LINE_H}" fill="{ROUTE}"/>
        {bodies}
      </svg>
    </div>"""


def build_html() -> str:
    rows = "".join(frame_markup(i) for i in range(TOTAL))
    return f"""<!doctype html><html><head><meta charset="utf-8"><style>
      *{{margin:0;padding:0}} body{{background:#fff}}
      .f{{width:{W}px;height:{H}px;display:block;overflow:hidden}}
    </style></head><body>{rows}</body></html>"""


def slice_to_gif(sheet_path: Path, gif_path: Path) -> None:
    from PIL import Image

    sheet = Image.open(sheet_path).convert("RGB")
    frames = [sheet.crop((0, i * H, W, (i + 1) * H)) for i in range(TOTAL)]
    # Outlook on Windows renders only the first frame. Open mid-band so it sees
    # a vehicle on the route rather than an empty line.
    start = TOTAL // 4
    frames = frames[start:] + frames[:start]
    frames = [f.resize((W // 2, H // 2), Image.LANCZOS) for f in frames]
    # Two flat colours, so a tiny palette keeps the file small.
    frames = [f.quantize(colors=16, method=Image.MEDIANCUT, dither=Image.NONE) for f in frames]
    frames[0].save(
        gif_path,
        save_all=True,
        append_images=frames[1:],
        duration=FRAME_MS,
        loop=0,
        optimize=True,
        disposal=2,
    )


if __name__ == "__main__":
    if sys.argv[1] == "html":
        (OUT / "strip.html").write_text(build_html())
        print(f"wrote strip.html — {TOTAL} frames, sheet {W}x{H * TOTAL}")
    else:
        slice_to_gif(OUT / "sheet.png", OUT / "route.gif")
        size = (OUT / "route.gif").stat().st_size
        print(f"wrote route.gif — {TOTAL} frames, {TOTAL * FRAME_MS / 1000:.1f}s lap, {size / 1024:.1f} KB")
