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
	var a := R.make("cinderkit", 30, {}, rng)
	var b := R.make("ripplet", 30, {}, rng)
	main.register.visible = false
	main.card.visible = false
	main.lines.clear()
	main.team = [a]
	main.battle.set_process(false)
	for size in [Vector2i(375, 812), Vector2i(667, 375), Vector2i(1366, 768), Vector2i(1920, 1080), Vector2i(3440, 1440)]:
		root.size = size
		main.battle.visible = false
		main.lessons.open([a])
		main.lessons.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		root.get_texture().get_image().save_png("res://frames/wd3/practice-%dx%d.png" % [size.x, size.y])
		main.lessons.visible = false
		main.battle.open("trainer", [a], [b], "Warden Nerys")
		main.battle.wait_u = main.battle.allies[0]
		main.battle.state = "moves"
		main.battle.Effects.apply(main.battle.foes[0], "soaked", 5.0)
		main.battle.foes[0].buff.guard = 4.0
		main.battle.queue_redraw()
		await process_frame
		await process_frame
		await RenderingServer.frame_post_draw
		root.get_texture().get_image().save_png("res://frames/wd3/battle-%dx%d.png" % [size.x, size.y])
	quit()
