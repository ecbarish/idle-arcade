extends SceneTree
## Copied into the PR's base checkout by wd3-review.yml: captures the genuine before screens.
const R := preload("res://scripts/rules.gd")
var main: Node
func _initialize() -> void:
	main = load("res://scenes/main.tscn").instantiate()
	main.no_save = true
	main.settings.keep = false
	main.show_howto = false
	root.add_child(main)
	capture.call_deferred()
func capture() -> void:
	DirAccess.make_dir_recursive_absolute("res://frames/wd3")
	var rng := RandomNumberGenerator.new()
	rng.seed = 125
	var a := R.make("cindercub", 30, {}, rng)
	var b := R.make("ripplet", 30, {}, rng)
	main.register.visible = false
	main.lines.clear()
	main.team = [a]
	main.set_process(false)
	main.battle.set_process(false)
	main.fade_rect.color.a = 0.0
	main.title.visible = false
	main.howto.visible = false
	main.satchel.visible = false
	main.story_done["bench"] = true
	root.borderless = true
	root.min_size = Vector2i(1, 1)
	root.position = Vector2i.ZERO
	for size in [Vector2i(375, 812), Vector2i(1920, 1080)]:
		root.size = size
		main.battle.visible = false
		main._open_bench()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window("before-workbench", size)
		main.card.visible = false
		main.battle.open("trainer", [a], [b], "Warden Nerys")
		main.battle.wait_u = main.battle.allies[0]
		main.battle.state = "moves"
		main.battle.move_i = 0
		main.battle.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window("before-battle", size)
	main.queue_free()
	await process_frame
	quit()
func save_window(label: String, requested: Vector2i) -> void:
	var position := DisplayServer.window_get_position()
	var size := DisplayServer.window_get_size()
	var output: Array = []
	var filename := ProjectSettings.globalize_path("res://frames/wd3/%s-%dx%d.png" % [label, requested.x, requested.y])
	var status := OS.execute("import", ["-window", "root", "-crop", "%dx%d+%d+%d" % [size.x, size.y, position.x, position.y], "+repage", filename], output, true)
	print("WD3 baseline screen: %s requested %s actual %s" % [label, requested, size])
	if status != 0 or size != requested:
		push_error("Baseline capture failed")
		quit(2)
