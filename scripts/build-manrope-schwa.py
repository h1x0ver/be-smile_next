"""Build the missing capital Ə from Manrope's own ə, at its capital O metrics.

Input: official OFL Manrope variable TTF (Google Fonts, version 4.505).
The supplement contains only U+018F and keeps the continuous 200–800 weight axis.
Original font and license remain unchanged; see public/fonts/OFL-Manrope.txt.
Usage: python scripts/build-manrope-schwa.py path/to/Manrope[wght].ttf
"""
import hashlib
import sys
from pathlib import Path

from fontTools import subset
from fontTools.designspaceLib import AxisDescriptor, DesignSpaceDocument, SourceDescriptor
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.ttLib import TTFont
from fontTools.varLib import build
from fontTools.varLib.instancer import instantiateVariableFont

root = Path(__file__).resolve().parents[1]
source = TTFont(sys.argv[1])
masters = root / "outputs" / "doctor-modal" / "font-build"
masters.mkdir(parents=True, exist_ok=True)
space = DesignSpaceDocument()
axis = AxisDescriptor()
axis.name, axis.tag = "Weight", "wght"
axis.minimum, axis.default, axis.maximum = 200, 400, 800
space.addAxis(axis)

for weight in range(200, 801, 100):
    font = instantiateVariableFont(source, {"wght": weight}, inplace=False)
    glyphs = font.getGlyphSet()
    schwa = font.getBestCmap()[0x0259]
    small = font["glyf"][schwa]
    capital = font["glyf"]["O"]
    small.recalcBounds(font["glyf"])
    capital.recalcBounds(font["glyf"])
    advance = font["hmtx"]["O"][0]
    sx = (capital.xMax - capital.xMin) / (small.xMax - small.xMin)
    sy = (capital.yMax - capital.yMin) / (small.yMax - small.yMin)
    dx = capital.xMin - small.xMin * sx
    dy = capital.yMin - small.yMin * sy
    pen = TTGlyphPen(glyphs)
    glyphs[schwa].draw(TransformPen(pen, (sx, 0, 0, sy, dx, dy)))
    name = "uni018F"
    order = list(font.getGlyphOrder())
    font["glyf"][name] = pen.glyph()
    font.setGlyphOrder(order + [name])
    font["hmtx"][name] = (advance, capital.xMin)
    for table in font["cmap"].tables:
        if table.isUnicode():
            table.cmap[0x018F] = name
    for name_id, value in [(1, "BeSmile Manrope Schwa"), (2, "Regular"), (6, f"BeSmileManropeSchwa-{weight}")]:
        font["name"].setName(value, name_id, 3, 1, 0x409)
    options = subset.Options()
    options.recalc_timestamp = False
    subsetter = subset.Subsetter(options=options)
    subsetter.populate(unicodes=[0x018F])
    subsetter.subset(font)
    file = masters / f"schwa-{weight}.ttf"
    font.save(file)
    master = SourceDescriptor()
    master.path, master.name = str(file), f"weight-{weight}"
    master.familyName, master.styleName = "BeSmile Manrope Schwa", "Regular"
    master.location = {"Weight": weight}
    if weight == 400:
        master.copyInfo = master.copyLib = master.copyFeatures = True
    space.addSource(master)

variable, _, _ = build(space)
variable.flavor = "woff2"
temporary = masters / "schwa.woff2"
variable.save(temporary)
data = temporary.read_bytes()
target = root / "public" / "fonts" / f"besmile-manrope-schwa-{hashlib.sha256(data).hexdigest()[:12]}.woff2"
target.write_bytes(data)
check = TTFont(target)
assert check.getBestCmap()[0x018F]
assert any(a.axisTag == "wght" and a.minValue == 200 and a.maxValue == 800 for a in check["fvar"].axes)
print(f"Created {target.name}: {len(data)} bytes; U+018F, variable weight 200-800")
