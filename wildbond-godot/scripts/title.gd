extends Control
## The first page when a journey is saved: continue it, or start a new one. Same book style as the register.
## Arrow keys and Enter, or the mouse.

signal chosen(choice: String)                  # "continue" or "new"
const INK := Color("3e2c20")
const FAINT := Color("8a6e50")

var summary := ""                              # e.g. "Rowan and Ripplet, in Thornwood. 1 badge, 6 in the Wilddex."
var sel := 0
var confirm_new := false                       # starting over asks twice, so a stray key never loses a journey
var font: Font

func _ready() -> void:
	set_anchors_preset(PRESET_FULL_RECT)
	mouse_filter = MOUSE_FILTER_STOP
	font = ThemeDB.fallback_font
	visible = summary != ""                    # stays shut unless it was opened already

func open(text: String) -> void:
	summary = text
	sel = 0
	confirm_new = false
	visible = true
	queue_redraw()

func _pick(i: int) -> void:
	if i == 0:
		visible = false
		chosen.emit("continue")
	elif not confirm_new:
		confirm_new = true
		queue_redraw()
	else:
		visible = false
		chosen.emit("new")

func _btn(i: int) -> Rect2:
	return Rect2(112, 118 + i * 24, 160, 18)

func _input(e: InputEvent) -> void:
	if not visible:
		return
	if e is InputEventKey and e.pressed and not e.echo:
		match e.keycode:
			KEY_UP, KEY_W: sel = 0
			KEY_DOWN, KEY_S: sel = 1
			KEY_ENTER, KEY_KP_ENTER, KEY_SPACE, KEY_E: _pick(sel)
			KEY_ESCAPE: confirm_new = false
		get_viewport().set_input_as_handled()
		queue_redraw()
	elif e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT:
		var p := get_local_mouse_position()
		for i in 2:
			if _btn(i).has_point(p):
				sel = i
				_pick(i)
		get_viewport().set_input_as_handled()
		queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(0, 0, 384, 216), Color("121418"))
	draw_rect(Rect2(72, 36, 240, 150), Color("4a2e1a"))
	draw_rect(Rect2(76, 40, 232, 142), Color("f4e9cd"))
	draw_string(font, Vector2(76, 62), "Wildbond", HORIZONTAL_ALIGNMENT_CENTER, 232, 14, INK)
	draw_multiline_string(font, Vector2(90, 80), summary, HORIZONTAL_ALIGNMENT_CENTER, 204, 7, -1, FAINT)
	var labels := ["Continue your journey", "Start a new journey" if not confirm_new else "Really start over? Press again"]
	for i in 2:
		var r := _btn(i)
		draw_rect(r, INK if sel == i else Color("d8c8a0"))
		draw_string(font, r.position + Vector2(0, 13), labels[i], HORIZONTAL_ALIGNMENT_CENTER, r.size.x, 8, Color("f4e9cd") if sel == i else INK)
