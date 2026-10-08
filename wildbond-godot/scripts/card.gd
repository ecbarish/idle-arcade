extends Control
## A creature's page (Wilddex style): opens when you walk up to one of Maren's three young creatures and press Enter.
## The creature moves on the left, its page on the right: element, a line about it, its role, its six stats, its first
## moves, what it's strong and weak against, and what Maren thinks of it. Two choices: "Choose <name>" or "Not yet".
## Data comes from data/species.json (exported from the browser game, so both versions stay the same).

signal chosen(id: String)
signal closed
signal picked(index: int)                     # with custom buttons (the ranch): which one was pressed
const Figures := preload("res://scripts/figures.gd")
const INK := Color("3e2c20")
const FAINT := Color("8a6e50")
const STATS := [["hp", "Health"], ["pow", "Power"], ["grd", "Guard"], ["spd", "Speed"], ["wit", "Wits"], ["spi", "Spirit"]]
const EL_COL := { "Ember": Color("d8642e"), "Tide": Color("3a8fd8"), "Grove": Color("5d9a3e") }

var id := ""
var info: Dictionary = {}                     # name, el, dex, base, moves, strong, weak, role, maren, look
var sel := 0                                  # 0 choose, 1 not yet (or the custom button picked)
var buttons: Array = []                       # custom choices (the ranch); empty: "Choose <name>" / "Not yet"
var t := 0.0
var font: Font

func _ready() -> void:
	set_anchors_preset(PRESET_FULL_RECT)
	mouse_filter = MOUSE_FILTER_STOP
	font = ThemeDB.fallback_font
	visible = false

func open(creature_id: String, data: Dictionary, btns: Array = []) -> void:
	id = creature_id
	info = data
	buttons = btns
	sel = _count() - 1                         # the last choice ("Not yet") first, so a stray Enter never chooses by accident
	t = 0.0
	visible = true

func _count() -> int:
	return buttons.size() if not buttons.is_empty() else 2

func _pick(i: int) -> void:
	if buttons.is_empty():
		_close(i == 0)
		return
	visible = false
	picked.emit(i)

func _close(choose: bool) -> void:
	visible = false
	if choose:
		chosen.emit(id)
	else:
		closed.emit()

func _input(e: InputEvent) -> void:
	if not visible:
		return
	if e is InputEventKey and e.pressed and not e.echo:
		match e.keycode:
			KEY_LEFT, KEY_A: sel = (sel + _count() - 1) % _count()
			KEY_RIGHT, KEY_D, KEY_TAB: sel = (sel + 1) % _count()
			KEY_ENTER, KEY_KP_ENTER, KEY_SPACE, KEY_E: _pick(sel)
			KEY_ESCAPE, KEY_BACKSPACE: _pick(_count() - 1)
		get_viewport().set_input_as_handled()
	elif e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT:
		var p := get_local_mouse_position()
		for i in _count():
			if _btn(i).has_point(p):
				_pick(i)
		get_viewport().set_input_as_handled()

func _btn(i: int) -> Rect2:
	if _count() == 2:
		return Rect2(196 + i * 82, 182, 76, 16)
	var w := (160.0 - 4.0 * (_count() - 1)) / _count()       # more choices share the same row
	return Rect2(192 + i * (w + 4), 182, w, 16)

func _process(dt: float) -> void:
	if visible:
		t += dt
		queue_redraw()

func _text(s: String, at: Vector2, size: int, col: Color, width := -1.0) -> void:
	draw_string(font, at, s, HORIZONTAL_ALIGNMENT_LEFT if width < 0 else HORIZONTAL_ALIGNMENT_CENTER, width, size, col)

func _para(s: String, at: Vector2, width: float, size: int, col: Color) -> float:
	# wrapped text; returns the y just below it
	draw_multiline_string(font, at, s, HORIZONTAL_ALIGNMENT_LEFT, width, size, -1, col)
	var h := font.get_multiline_string_size(s, HORIZONTAL_ALIGNMENT_LEFT, width, size).y
	return at.y + h

func _draw() -> void:
	if info.is_empty():
		return
	var el_col: Color = EL_COL.get(info.el, FAINT)
	draw_rect(Rect2(0, 0, 384, 216), Color(0.05, 0.04, 0.06, 0.55))
	draw_rect(Rect2(22, 10, 340, 198), Color("4a2e1a"))
	draw_rect(Rect2(24, 12, 336, 194), Color("6e4a2c"))
	draw_rect(Rect2(28, 16, 151, 186), Color("f2e6c8"))
	draw_rect(Rect2(181, 16, 175, 186), Color("f4e9cd"))
	draw_rect(Rect2(176, 16, 8, 186), Color("dccca4"))
	# left page: the creature, four times life size, alive (it wags, blinks and glances at you)
	_text(info.name, Vector2(28, 34), 12, INK, 151)
	draw_rect(Rect2(76, 40, 56, 11), el_col)
	_text(info.el, Vector2(76, 48), 7, Color("fdf6e6"), 56)
	draw_rect(Rect2(66, 134, 76, 4), Color(0, 0, 0, 0.12))
	draw_set_transform(Vector2(68, 86), 0, Vector2(4, 4))
	var pose := { "wag": [1, 0, -1, 0][int(t * 8.0) % 4], "blink": fmod(t, 2.7) < 0.12, "ears_up": true,
		"twitch": int(t * 6.0) % 2 if fmod(t, 4.0) > 3.0 else 0, "bird": info.look.get("kind") == "boar" }
	Figures.creature(self, Vector2.ZERO, true, pose, info.look)
	draw_set_transform(Vector2.ZERO)
	var y := _para(info.dex, Vector2(36, 156), 135, 7, FAINT)
	# right page: what it is like
	y = _para(info.role, Vector2(190, 30), 158, 7, INK) + 2
	for i in STATS.size():
		var k: String = STATS[i][0]
		var v: float = info.base.get(k, 0)
		var col := i % 2
		var row := i / 2
		var sx := 190 + col * 82
		var sy := y + row * 12
		_text(STATS[i][1], Vector2(sx, sy + 7), 6, FAINT)
		draw_rect(Rect2(sx + 30, sy + 2, 44, 5), Color("e4d6b4"))
		draw_rect(Rect2(sx + 30, sy + 2, 44.0 * clampf(v / 80.0, 0.0, 1.0), 5), el_col.darkened(0.1))
	y += 44
	y = _para(info.get("moves_line", "Starts with %s." % preload("res://scripts/rules.gd").words(info.moves)), Vector2(190, y), 158, 7, INK) + 1
	y = _para("Strong against %s, weak to %s." % [info.strong, info.weak], Vector2(190, y), 158, 7, INK) + 3
	_para(info.get("note", "Maren: \"%s\"" % info.get("maren", "")), Vector2(190, y), 158, 7, FAINT)
	# the choices
	for i in _count():
		var r := _btn(i)
		var on := sel == i
		draw_rect(r, INK if on else Color("7a5a3a"))
		if on:
			draw_rect(Rect2(r.position - Vector2(1, 1), r.size + Vector2(2, 2)), Color("f2d24a"), false, 1.0)
		var label: String = buttons[i] if not buttons.is_empty() else (("Choose " + info.name) if i == 0 else "Not yet")
		_text(label, r.position + Vector2(0, 11), 8 if _count() <= 2 else 7, Color("f4e9cd"), r.size.x)
