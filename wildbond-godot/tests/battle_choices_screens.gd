extends SceneTree
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
	main.card.visible = false
	main.lines.clear()
	main.team = [a]
	main.set_process(false)
	main.fade_in = 1.0
	main.fade_rect.color.a = 0.0
	main.title.visible = false
	main.satchel.visible = false
	main.howto.visible = false
	root.borderless = true
	root.min_size = Vector2i(1, 1)
	root.position = Vector2i.ZERO
	main.battle.set_process(false)
	for size in [Vector2i(375, 812), Vector2i(667, 375), Vector2i(1366, 768), Vector2i(1920, 1080), Vector2i(3440, 1440)]:
		root.size = size
		main.battle.visible = false
		main.lessons.open([a])
		main.lessons.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window("practice", size)
		main.lessons.visible = false
		main.battle.open("trainer", [a], [b], "Warden Nerys")
		main.battle.wait_u = main.battle.allies[0]
		main.battle.state = "moves"
		main.battle.move_i = 2
		main.battle.Effects.apply(main.battle.foes[0], "soaked", 5.0)
		main.battle.foes[0].buff.guard = 4.0
		main.battle.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window("battle", size)
		main.battle.taught = main.TEACHERS.values().map(func(teacher): return teacher.order)
		main.battle.state = "orders"
		main.battle.order_i = 8
		main.battle.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window("orders", size)
	main.queue_free()
	await process_frame
	quit()

func save_window(label: String, requested: Vector2i) -> void:
	var position := DisplayServer.window_get_position()
	var size := DisplayServer.window_get_size()
	var output: Array = []
	var filename := ProjectSettings.globalize_path("res://frames/wd3/%s-%dx%d.png" % [label, requested.x, requested.y])
	var status := OS.execute("import", ["-window", "root", "-crop", "%dx%d+%d+%d" % [size.x, size.y, position.x, position.y], "+repage", filename], output, true)
	print("WD3 screen: %s requested %s actual %s: %s" % [label, requested, size, output])
	if status != 0 or size != requested:
		push_error("Full-window capture failed")
		quit(2)
