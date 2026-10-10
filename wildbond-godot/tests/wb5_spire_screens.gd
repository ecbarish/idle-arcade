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
	DirAccess.make_dir_recursive_absolute("res://frames/wb5")
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
	rng.seed = 501
	var lead := R.make("cindercub", 75, {}, rng)
	main.team = [lead]
	main.partner = main.starters[0]
	main.partner.id = "cindercub"
	main.story_done["leagueEnding"] = true
	root.borderless = true
	root.min_size = Vector2i(1, 1)
	root.position = Vector2i.ZERO
	root.size = Vector2i(1366, 768)
	for shot in [
		["league-postgame", "league", Vector2i(3, 15)],
		["lighthouse-spire", "spire", Vector2i(9, 14)],
	]:
		main._set_map(shot[1])
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
	var filename := ProjectSettings.globalize_path("res://frames/wb5/%s.png" % label)
	var status := OS.execute("import", ["-window", "root", "-crop", "%dx%d+%d+%d" % [size.x, size.y, position.x, position.y], "+repage", filename], output, true)
	print("WB5.1 screen: %s actual %s" % [label, size])
	if status != 0:
		push_error("WB5.1 capture failed: " + label)
		quit(2)
