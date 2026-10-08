extends SceneTree
## Automated checks for the Wildbond Godot trial: the same idea as tests/wildbond.html for the browser game. They play the
## opening by themselves (register, barn, choosing a partner, walking out) and check the data and rules on the way.
## Run (prints each failure and a total, exit code 0 when everything passes):
##   Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --script res://tests/run_tests.gd

var passed := 0
var failed := 0
var main: Node

func check(ok: bool, what: String) -> void:
	if ok:
		passed += 1
	else:
		failed += 1
		print("FAIL: ", what)

func _initialize() -> void:
	main = load("res://scenes/main.tscn").instantiate()
	main.demo = false
	root.add_child(main)
	_run.call_deferred()

func tick(seconds: float) -> void:
	# advance the game by hand in small steps, so the checks don't depend on the computer's speed
	var steps := int(seconds / 0.05)
	for i in steps:
		main._process(0.05)

func talk_through() -> void:
	var guard := 0
	while not main.lines.is_empty() and guard < 40:
		main.advance()
		guard += 1

func walk_to(goal: Vector2i) -> bool:
	var r: Array[Vector2i] = main.route(main.me.tile, goal)
	main.walk_to = r
	for i in 400:
		tick(0.05)
		if main.me.tile == goal and main.me.path.is_empty():
			return true
	return false

func _run() -> void:
	main.register.keep = false
	var D: Dictionary = main.DATA
	# ---- the data bridge: the browser game's content arrived intact
	check(D.has("SPECIES") and D.SPECIES.size() >= 60, "creatures exported from the browser game")
	check(D.has("MOVES") and D.has("COUNTER") and D.has("STORY"), "moves, matchups and story exported")
	check(D.STARTERS == ["cindercub", "ripplet", "mosshog"], "the three starters")
	for id in D.STARTERS:
		var c: Dictionary = main.card_info(id)
		check(c.name == D.SPECIES[id].name and c.moves.size() == 2, "%s's page: name and two first moves" % id)
		check(main.CREATURE_LOOKS.has(id), "%s has a body" % id)
	check(main.card_info("cindercub").weak == "Tide (Ripplet)" and main.card_info("cindercub").strong == "Grove (Mosshog)", "Cindercub's matchups")
	check(main.card_info("ripplet").moves == ["Tail Whip", "Bubble Jet"], "Ripplet's first moves")
	# roles use the browser game's formula
	check(main.role_of(D.SPECIES.cindercub.base).begins_with("Skirmisher"), "Cindercub is a Skirmisher")
	check(main.role_of(D.SPECIES.ripplet.base).begins_with("All-rounder"), "Ripplet is an All-rounder")
	check(main.role_of({ "hp": 90, "pow": 40, "grd": 90, "spd": 30, "wit": 40, "spi": 90 }).begins_with("Tank"), "a tough creature is a Tank")
	# ---- the map: closed doors, the barn opens with the story
	check(not main.walkable(Vector2i(4, 4)), "cottage doors stay shut")
	check(not main.walkable(main.BARN_DOOR), "the barn is shut before you sign the register")
	# ---- the opening: narration, Maren walks up, the register
	talk_through()
	check(main.stage == "maren_walks", "after the narration Maren walks over")
	tick(6.0)
	check(main.stage == "maren_talks", "Maren arrives and talks")
	talk_through()
	check(main.stage == "register" and main.register.visible, "the register opens")
	main.register.row = 3
	main.register.change(1)
	check(main.register.look().style == "short", "the register changes your hair")
	main.register.name_text = "Testa"
	main.register.sign_it()
	check(main.painted and main.my_look.name == "Testa" and main.stage == "signed", "signing paints you in, with your name")
	talk_through()
	check(main.stage == "to_barn", "Maren leads you to the barn")
	check(main.walkable(main.BARN_DOOR) or main.maren.tile == main.BARN_DOOR, "the barn door is open now")
	# ---- into the barn
	check(walk_to(main.BARN_DOOR + Vector2i.DOWN), "you can walk to the barn")
	main._step(Vector2i.UP)
	tick(1.0)
	check(main.map_name == "barn" and main.me.where == "barn", "you go inside the barn")
	check(main.maren.where == "barn", "Maren is inside too")
	check(main.actors().size() == 5, "you, Maren and three young creatures in the barn")
	talk_through()
	check(main.stage == "barn_choose", "you're free to meet them")
	# ---- tap a creature to walk up and meet it
	var rip: Object = main.starters[1]
	main._tap(Vector2(rip.tile) * main.TILE + Vector2(8, 8))
	for i in 200:
		tick(0.05)
		if main.card.visible:
			break
	check(main.card.visible and main.card.id == "ripplet", "tapping Ripplet walks you up to it and opens its page")
	check(main.card.sel == 1, "the page starts on Not yet (no accidental choice)")
	main.card._close(false)
	check(not main.card.visible and main.partner == null, "Not yet closes the page and chooses nothing")
	main._meet(main.starters[2])
	main.card._close(true)
	check(main.partner == main.starters[2] and main.stage == "bonded", "choosing Mosshog makes it your partner")
	check(main.restore.size() == 1 and main.restore[0].where == "barn", "the bond brings colour back in the barn")
	talk_through()
	check(main.stage == "free", "after the bond you're free")
	# ---- your partner follows you out, and the colour has spilled into town
	check(walk_to(main.BARN_EXIT + Vector2i.UP), "you can walk back to the barn door")
	main._step(Vector2i.DOWN)
	tick(1.0)
	check(main.map_name == "town" and main.partner.where == "town", "you and Mosshog step outside")
	check(main.spilled and main.restore.size() == 2, "the colour spills out of the barn into town")
	talk_through()
	var before: Vector2i = main.me.tile
	main._step(Vector2i.DOWN)
	tick(0.6)
	check(main.partner.tile == before, "your partner follows in your footsteps")
	# ---- the done line
	print("Wildbond Godot checks: %d passed, %d failed" % [passed, failed])
	quit(1 if failed > 0 else 0)
