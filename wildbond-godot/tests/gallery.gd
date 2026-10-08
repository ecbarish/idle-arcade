extends SceneTree
## Draws every creature in the game (its family's body plan in its own colour) on one sheet and saves it as
## frames/gallery.png, to check how they look. Needs a window (not --headless):
##   Godot_v4.7.2-stable_win64.exe --path wildbond-godot --script res://tests/gallery.gd
const Figures := preload("res://scripts/figures.gd")
var ids: Array = []
var data: Dictionary
var canvas: Node2D
var frames := 0

func _initialize() -> void:
	var j: JSON = load("res://data/wildbond.json")
	data = j.data
	ids = data.SPECIES.keys()
	ids.sort_custom(func(a, b): return data.SPECIES[a].fam + a < data.SPECIES[b].fam + b)
	root.size = Vector2i(1152, 1080)
	canvas = Node2D.new()
	canvas.draw.connect(_draw_all)
	root.add_child(canvas)

func _draw_all() -> void:
	canvas.draw_rect(Rect2(0, 0, 384, 216), Color("e8e0cc"))
	var big := "--spiders" in OS.get_cmdline_user_args()
	if big:
		ids = ids.filter(func(k): return data.SPECIES[k].fam == "spider")
	for i in ids.size():
		var id: String = ids[i]
		var s: Dictionary = data.SPECIES[id]
		var x := (i % 10) * 38 if not big else (i % 4) * 90
		var y := (i / 10) * 24 if not big else (i / 4) * 70
		var look := Figures.look_for(s)
		var pose := { "wag": [1, 0, -1, 0][(frames / 8 + i) % 4], "walking": i % 3 == 0, "frame": (frames / 6 + i) % 4, "ears_up": i % 2 == 0 }
		canvas.draw_set_transform(Vector2(x + 2, y + 2), 0, Vector2(2, 2) if not big else Vector2(4, 4))
		Figures.creature(canvas, Vector2.ZERO, true, pose, look)
		canvas.draw_set_transform(Vector2.ZERO)

func _process(_dt: float) -> bool:
	frames += 1
	canvas.queue_redraw()
	if frames == 8:
		root.get_texture().get_image().save_png("res://frames/gallery.png")
		return true
	return false
