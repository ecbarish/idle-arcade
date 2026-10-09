extends SceneTree
## Paints Wildbond's own world tiles (Evan, 2026-10-09: "Our own tiles", so Wildbond stops looking like the other
## games). Writes assets/env/wild/floor.png, nature.png and house.png with the cells laid out where main.gd and
## battle.gd already look for them (the same 16 x 16 grid as the old pack), so the game only swaps the files.
## Everything here is drawn by this script: original art, ours to change. Run it again after changing a colour:
##   godot --headless --path wildbond-godot -s tools/paint_tiles.gd
## Part 1 (2026-10-09): grass, paths, sand, flowers, tall grass, bushes, two kinds of tree, the cottage and Maren's
## barn. Water and the battle backdrops still use the pack (part 2).

const OUT := "res://assets/env/wild/"
const INK := Color("1e1a22")                   # the outline every Wildbond figure has (figures.gd OUTLINE)

# the valley's own palette: cooler, deeper greens than the pack, slate roofs, whitewash and timber
const GRASS := [Color("4f8a50"), Color("5c9a5a"), Color("6aa862"), Color("7cb86c")]
const PATH := [Color("a8875a"), Color("bb9a6a"), Color("ccad7c"), Color("dcc092")]
const SAND := [Color("d2b886"), Color("e0c896"), Color("ead6a8")]
const LEAF := [Color("24503e"), Color("2f6a4a"), Color("3f8558"), Color("5ea26a"), Color("8ccf7e")]
const PINE := [Color("1f4a44"), Color("2a5e54"), Color("37766a"), Color("4f9480")]
const BARK := [Color("4a3426"), Color("6a4a32"), Color("8a6444")]
const SLATE := [Color("33465e"), Color("435a78"), Color("56708f"), Color("7290ad")]
const WASH := [Color("cfc4ac"), Color("e6dcc6"), Color("f4eddc")]
const RED := [Color("6e2620"), Color("8e342c"), Color("ab463a"), Color("c45e4e")]

var img: Image
var seed_n := 1

func _initialize() -> void:
	DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(OUT))
	_floor()
	_nature()
	_house()
	print("Painted Wildbond's tiles into ", OUT)
	quit()

# ---------------------------------------------------------------- helpers
func _new(w: int, h: int) -> void:
	img = Image.create(w, h, false, Image.FORMAT_RGBA8)
	img.fill(Color(0, 0, 0, 0))

## A steady "random" number for a pixel, so the tiles come out the same every run.
func _h(x: int, y: int, k := 0) -> float:
	var n := (x * 374761393 + y * 668265263 + (k + seed_n) * 2147483647) & 0x7fffffff
	n = (n ^ (n >> 13)) * 1274126177 & 0x7fffffff
	return float(n % 1000) / 1000.0

func _px(x: int, y: int, c: Color) -> void:
	if x >= 0 and y >= 0 and x < img.get_width() and y < img.get_height():
		img.set_pixel(x, y, c)

func _rect(x: int, y: int, w: int, h: int, c: Color) -> void:
	for j in h:
		for i in w:
			_px(x + i, y + j, c)

func _at(x: int, y: int) -> Color:
	if x < 0 or y < 0 or x >= img.get_width() or y >= img.get_height():
		return Color(0, 0, 0, 0)
	return img.get_pixel(x, y)

## A filled blob (an ellipse) shaded from the top-left: light, mid, dark bands by height.
func _blob(cx: float, cy: float, rx: float, ry: float, cols: Array, lit := true) -> void:
	for y in range(int(cy - ry) - 1, int(cy + ry) + 2):
		for x in range(int(cx - rx) - 1, int(cx + rx) + 2):
			var dx := (x + 0.5 - cx) / rx
			var dy := (y + 0.5 - cy) / ry
			var d := dx * dx + dy * dy
			if d > 1.0:
				continue
			var shade := 0.55 - dy * 0.35 - dx * 0.15 + (_h(x, y) - 0.5) * 0.25
			if not lit:
				shade = 0.4
			var i := clampi(int(shade * cols.size()), 0, cols.size() - 1)
			_px(x, y, cols[i])

## Draws the outline around everything painted inside a box (any empty pixel touching a painted one).
func _outline(x0: int, y0: int, w: int, h: int) -> void:
	var edge: Array[Vector2i] = []
	for y in range(y0, y0 + h):
		for x in range(x0, x0 + w):
			if _at(x, y).a > 0.0:
				continue
			for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, 1), Vector2i(0, -1)]:
				var q: Vector2i = Vector2i(x, y) + d
				if q.x >= x0 and q.y >= y0 and q.x < x0 + w and q.y < y0 + h and _at(q.x, q.y).a > 0.0 and _at(q.x, q.y) != INK:
					edge.append(Vector2i(x, y))
					break
	for p in edge:
		_px(p.x, p.y, INK)

func _save(name: String) -> void:
	img.save_png(ProjectSettings.globalize_path(OUT + name))

# ---------------------------------------------------------------- ground (floor.png)
func _grass(cx: int, cy: int, tufts: int) -> void:
	var ox := cx * 16
	var oy := cy * 16
	for y in 16:
		for x in 16:
			var v := _h(x + cx * 3, y, 1)
			_px(ox + x, oy + y, GRASS[1] if v < 0.62 else (GRASS[0] if v < 0.8 else GRASS[2]))
	for k in tufts:                             # little blades and clover
		var x := 2 + int(_h(cx, k, 2) * 11)
		var y := 3 + int(_h(cx, k, 3) * 10)
		if k % 3 == 2:
			_px(ox + x, oy + y, GRASS[3])
			_px(ox + x + 1, oy + y, GRASS[3])
			_px(ox + x, oy + y - 1, GRASS[3])
		else:
			_px(ox + x, oy + y, GRASS[0])
			_px(ox + x + 1, oy + y - 1, GRASS[2])
			_px(ox + x - 1, oy + y - 1, GRASS[2])

func _path(cx: int, cy: int, up: bool, down: bool, left: bool, right: bool) -> void:
	## Packed earth with flat stones; grass curls over any side where the path ends.
	var ox := cx * 16
	var oy := cy * 16
	for y in 16:
		for x in 16:
			var v := _h(x + cx * 5, y + cy * 7, 4)
			_px(ox + x, oy + y, PATH[1] if v < 0.6 else (PATH[2] if v < 0.85 else PATH[0]))
	if _h(cx, cy, 5) < 0.5:                      # now and then a flat stone pressed into the earth
		var sx := 3 + int(_h(cx, cy, 6) * 8)
		var sy := 3 + int(_h(cy, cx, 6) * 8)
		_rect(ox + sx, oy + sy, 4, 2, PATH[3])
		_rect(ox + sx, oy + sy + 2, 4, 1, PATH[0])
	for y in 16:
		for x in 16:
			var edge := 99
			if not up: edge = mini(edge, y)
			if not down: edge = mini(edge, 15 - y)
			if not left: edge = mini(edge, x)
			if not right: edge = mini(edge, 15 - x)
			var wob := int(_h(x, y, 7) * 2.0)
			if edge + wob < 2:
				_px(ox + x, oy + y, GRASS[1])
			elif edge + wob == 2:
				_px(ox + x, oy + y, GRASS[2])

func _floor() -> void:
	_new(256, 208)
	for k in 5:
		seed_n = 10 + k
		_grass(11 + k, 12, 0 if k == 0 else 2 + k)
	# the 3x3 path set at (11..13, 7..9): the middle is open on every side
	for j in 3:
		for i in 3:
			seed_n = 30 + i + j * 3
			_path(11 + i, 7 + j, j > 0, j < 2, i > 0, i < 2)
	seed_n = 40
	_path(12, 8, true, true, true, true)
	# sand (1, 1)
	for y in 16:
		for x in 16:
			var v := _h(x, y, 8)
			_px(16 + x, 16 + y, SAND[1] if v < 0.7 else (SAND[0] if v < 0.88 else SAND[2]))
	_save("floor.png")

# ---------------------------------------------------------------- nature (nature.png)
## A broadleaf tree, 32 x 32: a round, layered crown on a short trunk.
func _oak(ox: int, oy: int) -> void:
	_rect(ox + 13, oy + 20, 6, 10, BARK[1])
	_rect(ox + 13, oy + 20, 2, 10, BARK[2])
	_rect(ox + 17, oy + 20, 2, 10, BARK[0])
	_rect(ox + 11, oy + 29, 10, 2, BARK[0])
	_blob(ox + 16, oy + 14, 14, 11, LEAF.slice(0, 4))
	for c in [[9, 10, 6, 5], [20, 9, 6, 5], [15, 6, 6, 4], [11, 17, 5, 4], [21, 16, 5, 4]]:
		_blob(ox + c[0], oy + c[1], c[2], c[3], LEAF.slice(1, 5))
	_outline(ox, oy, 32, 32)

## A valley pine, 32 x 32: three tiers of dark teal, narrowing upward.
func _pine(ox: int, oy: int) -> void:
	_rect(ox + 14, oy + 24, 4, 7, BARK[1])
	_rect(ox + 14, oy + 24, 1, 7, BARK[2])
	for tier in 3:
		var top := oy + 2 + tier * 7
		var half := 6 + tier * 3
		for y in 10:
			var w := int(half * (y + 1) / 10.0)
			for x in range(-w, w + 1):
				var c: Color = PINE[1] if x < 0 else PINE[0]
				if x < -w + 2 and y > 3: c = PINE[2]
				if y == 9: c = PINE[0]
				if _h(x + tier, y, 9) > 0.92: c = PINE[3]
				_px(ox + 16 + x, top + y, c)
	_outline(ox, oy, 32, 32)

func _bush(ox: int, oy: int, berries: bool) -> void:
	_blob(ox + 8, oy + 9, 7, 6, LEAF.slice(1, 5))
	_blob(ox + 5, oy + 7, 3, 3, LEAF.slice(2, 5))
	if berries:
		for p in [[5, 10], [10, 8], [9, 12], [12, 11]]:
			_px(ox + p[0], oy + p[1], Color("d0484a"))
	_outline(ox, oy, 16, 16)

func _tall_grass(ox: int, oy: int, k: int) -> void:
	## A dense clump of long blades, dark at the root and pale at the tips, with a dark green edge so a meadow of it
	## reads at a glance as the place wild creatures hide.
	for b in 7:
		var x := 2 + b * 2 - (k % 2)
		var h := 9 + int(_h(b, k, 11) * 5) - absi(b - 3)
		var lean := 1 if (b + k) % 2 == 0 else -1
		for y in h:
			var px := x + (lean if y > h - 4 else 0)
			var c: Color = LEAF[1] if y < 4 else (GRASS[2] if y < h - 2 else GRASS[3])
			_px(ox + px, oy + 15 - y, c)
			_px(ox + px + 1, oy + 15 - y, LEAF[2] if y < 4 else GRASS[1])
	for y in 16:                                # the clump's edge, in dark leaf rather than ink: softer than a figure
		for x in 16:
			if _at(ox + x, oy + y).a > 0.0:
				continue
			for d in [Vector2i(1, 0), Vector2i(-1, 0), Vector2i(0, -1)]:
				var q: Color = _at(ox + x + d.x, oy + y + d.y)
				if q.a > 0.0 and q != LEAF[0] and x + d.x >= 0 and x + d.x < 16 and y + d.y >= 0:
					_px(ox + x, oy + y, LEAF[0])
					break

## A clump of flowers: leaves at the foot and three blooms of four petals round a heart.
func _flower(ox: int, oy: int, petal: Color, heart: Color) -> void:
	_blob(ox + 8, oy + 12, 6, 3, [LEAF[1], LEAF[2], LEAF[3]])
	for p in [[4, 7], [11, 5], [8, 10]]:
		_rect(ox + p[0], oy + p[1] + 2, 1, 4, LEAF[1])          # stems
		_rect(ox + p[0] - 2, oy + p[1] - 1, 2, 2, petal)
		_rect(ox + p[0] + 1, oy + p[1] - 1, 2, 2, petal)
		_rect(ox + p[0] - 2, oy + p[1] + 1, 2, 2, petal)
		_rect(ox + p[0] + 1, oy + p[1] + 1, 2, 2, petal)
		_px(ox + p[0], oy + p[1], heart)
		_px(ox + p[0], oy + p[1] + 1, heart)
	_outline(ox, oy, 16, 16)

func _nature() -> void:
	_new(128, 192)
	_oak(0, 0)
	_pine(32, 0)
	_oak(64, 0)
	_pine(96, 0)
	# row 10: bushes (0, 1) and tall grass (4, 5)
	_bush(0, 160, false)
	_bush(16, 160, true)
	_tall_grass(64, 160, 0)
	_tall_grass(80, 160, 1)
	# row 11: three kinds of flowers (0, 3, 6)
	_flower(0, 176, Color("7a86e0"), Color("f4eddc"))            # bluebells
	_flower(48, 176, Color("e05a4a"), Color("3a2a20"))           # poppies
	_flower(96, 176, Color("f4eddc"), Color("e8c040"))           # daisies
	_save("nature.png")

# ---------------------------------------------------------------- buildings (house.png)
## A cottage, 64 x 48 (4 x 3 tiles): a steep slate roof with a chimney over whitewashed walls and dark timbers, the
## door in the second column.
func _cottage(ox: int, oy: int) -> void:
	# walls (the bottom 18 pixels)
	_rect(ox + 3, oy + 30, 58, 18, WASH[1])
	_rect(ox + 3, oy + 30, 58, 2, WASH[0])
	for x in [3, 31, 59]:
		_rect(ox + x, oy + 30, 2, 18, BARK[1])                    # timber posts
	_rect(ox + 3, oy + 38, 58, 1, BARK[1])
	# the door (column 2: x 16 to 31) with a round top
	_rect(ox + 19, oy + 35, 10, 13, BARK[0])
	_rect(ox + 20, oy + 34, 8, 1, BARK[0])
	_rect(ox + 20, oy + 36, 4, 12, BARK[1])
	_px(ox + 26, oy + 42, Color("e8c040"))
	# two lit windows with green shutters
	for wx in [37, 49]:
		_rect(ox + wx, oy + 33, 8, 7, Color("f2d080"))
		_rect(ox + wx + 3, oy + 33, 1, 7, BARK[0])
		_rect(ox + wx, oy + 36, 8, 1, BARK[0])
		_rect(ox + wx - 2, oy + 33, 2, 7, Color("4a7a5a"))
		_rect(ox + wx + 8, oy + 33, 2, 7, Color("4a7a5a"))
	# the roof: rows of slates from the eaves up, darker at the bottom
	for y in range(0, 31):
		var inset := maxi(0, 6 - y / 2)
		for x in range(inset, 64 - inset):
			var row := y / 3
			var c: Color = SLATE[2] if row % 2 == 0 else SLATE[1]
			if (x + (row % 2) * 3) % 6 == 0: c = SLATE[0]           # the joins between slates
			if y < 3: c = SLATE[3]                                   # the ridge catches the light
			if y > 27: c = SLATE[0]                                  # the eaves' shadow
			_px(ox + x, oy + 2 + y, c)
	# a stone chimney
	_rect(ox + 46, oy, 7, 9, Color("8a8478"))
	_rect(ox + 46, oy, 7, 2, Color("aaa498"))
	_rect(ox + 47, oy + 4, 5, 1, Color("6a665c"))
	_outline(ox, oy, 64, 48)

## Maren's barn, 64 x 80 (4 x 5 tiles): a tall red barn with a gambrel roof, white trim, a hayloft door and the big
## doors in the second column.
func _barn(ox: int, oy: int) -> void:
	# the roof: steep lower slopes, a gentler top (a gambrel), dark shingles
	for y in 44:
		var half: int
		if y < 14:
			half = 10 + y * 1                                         # the gentle top
		else:
			half = 24 + (y - 14) / 3                                  # the steep sides
		half = mini(half, 31)
		for x in range(32 - half, 32 + half):
			var c := Color("5a3e38") if (y / 3) % 2 == 0 else Color("4a322e")
			if (x + (y / 3 % 2) * 2) % 5 == 0: c = Color("3a2624")
			if y < 2: c = Color("7a5650")
			_px(ox + x, oy + 2 + y, c)
	# the gable wall below the roof, red boards with white trim
	_rect(ox + 2, oy + 40, 60, 40, RED[2])
	for x in range(2, 62, 4):
		_rect(ox + x, oy + 40, 1, 40, RED[1])
	_rect(ox + 2, oy + 40, 60, 2, WASH[2])
	_rect(ox + 2, oy + 40, 2, 40, WASH[2])
	_rect(ox + 60, oy + 40, 2, 40, WASH[2])
	# the hayloft door with its X brace, and a little window
	_rect(ox + 26, oy + 44, 12, 10, RED[1])
	for k in 10:
		_px(ox + 27 + k, oy + 44 + k, WASH[2])
		_px(ox + 36 - k, oy + 44 + k, WASH[2])
	_rect(ox + 25, oy + 43, 14, 1, WASH[2])
	_rect(ox + 25, oy + 54, 14, 1, WASH[2])
	_rect(ox + 46, oy + 58, 8, 6, Color("f2d080"))
	_rect(ox + 49, oy + 58, 1, 6, WASH[2])
	# the big doors in column 2 (x 16 to 31), standing open on the dark inside
	_rect(ox + 16, oy + 62, 16, 18, Color("1e1612"))
	_rect(ox + 14, oy + 61, 20, 1, WASH[2])
	_rect(ox + 14, oy + 61, 2, 19, WASH[2])
	_rect(ox + 32, oy + 61, 2, 19, WASH[2])
	_rect(ox + 6, oy + 62, 8, 18, RED[1])                         # one door swung open against the wall
	for k in 8:
		_px(ox + 6 + k, oy + 62 + k * 2, WASH[2])
	_outline(ox, oy, 64, 80)

func _house() -> void:
	_new(464, 304)
	_cottage(0, 0)
	_barn(400, 224)
	_save("house.png")
