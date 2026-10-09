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
	DirAccess.make_dir_recursive_absolute("res://frames/wd4a")
	main.register.visible = false
	main.card.visible = false
	main.lines.clear()
	main.stage = "free"
	main.painted = true
	main.spilled = true
	main.title.visible = false
	main.howto.visible = false
	main.satchel.visible = false
	main.set_process(false)
	main.battle.set_process(false)
	var rng := RandomNumberGenerator.new()
	rng.seed = 404
	var lead := R.make("cindercub", 8, {}, rng)
	main.team = [lead]
	main.partner = main.starters[0]
	main.partner.id = "cindercub"
	root.borderless = true
	root.min_size = Vector2i(1, 1)
	root.position = Vector2i.ZERO
	for shot in [
		["trail", "thornwood_route", Vector2i(14, 11)],
		["settlement", "thornwood", Vector2i(14, 10)],
		["grove", "thornwood_grove", Vector2i(10, 8)],
	]:
		main._set_map(shot[1])
		main.map_name = shot[1]
		main.me.where = shot[1]
		main.me.tile = shot[2]
		main.me.pos = Vector2(main.me.tile) * main.TILE
		main.me.path.clear()
		main.partner.where = shot[1]
		main.partner.tile = main.me.tile + Vector2i.LEFT
		main.partner.pos = Vector2(main.partner.tile) * main.TILE
		main.partner.path.clear()
		main.cam.position = main.me.pos + Vector2(8, 8)
		main.cam.reset_smoothing()
		root.size = Vector2i(1366, 768)
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		save_window(shot[0])
	main.queue_free()
	await process_frame
	quit()

func save_window(label: String) -> void:
	var position := DisplayServer.window_get_position()
	var size := DisplayServer.window_get_size()
	var output: Array = []
	var filename := ProjectSettings.globalize_path("res://frames/wd4a/%s.png" % label)
	var status := OS.execute("import", ["-window", "root", "-crop", "%dx%d+%d+%d" % [size.x, size.y, position.x, position.y], "+repage", filename], output, true)
	print("WD4a screen: %s actual %s" % [label, size])
	if status != 0:
		push_error("WD4a capture failed: " + label)
		quit(2)
