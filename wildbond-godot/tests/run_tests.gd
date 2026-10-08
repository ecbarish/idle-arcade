extends SceneTree
## Automated checks for the Wildbond Godot trial: the same idea as tests/wildbond.html for the browser game. They play the
## opening by themselves (register, barn, choosing a partner, walking out) and check the data and rules on the way.
## Run (prints each failure and a total, exit code 0 when everything passes):
##   Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --script res://tests/run_tests.gd

var passed := 0
var failed := 0
var main: Node
var elapsed := 0.0

func _process(dt: float) -> bool:
	# a safety net: if something breaks and the checks stop, quit instead of hanging
	elapsed += dt
	if elapsed > 120.0:
		print("Wildbond Godot checks: TIMED OUT (a script error stopped them; see the errors above)")
		quit(3)
	return false

func check(ok: bool, what: String) -> void:
	if ok:
		passed += 1
	else:
		failed += 1
		print("FAIL: ", what)

func _initialize() -> void:
	main = load("res://scenes/main.tscn").instantiate()
	main.no_save = true                           # never touch a real saved journey
	main.demo = false
	root.add_child(main)
	_run.call_deferred()

func tick(seconds: float) -> void:
	# advance the game by hand in small steps, so the checks don't depend on the computer's speed
	var steps := int(seconds / 0.05)
	for i in steps:
		main._process(0.05)
		main.battle._process(0.05)

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
	main.rng.seed = 2026                          # the same rolls every run, so the checks always see the same story
	main.battle.rng.seed = 2026
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
	# ---- the rules give the browser game's exact numbers (values taken from the browser on 2026-10-08)
	var R := preload("res://scripts/rules.gd")
	R.DATA = D
	var mk := func(s: String, lvl: int, temp: String) -> Dictionary:
		var c := { "sp": s, "name": D.SPECIES[s].name, "lvl": lvl, "xp": 0, "rar": 1, "temp": temp, "traits": [], "bond": 0.0,
			"pot": { "hp": 10, "pow": 12, "grd": 8, "spd": 14, "wit": 9, "spi": 11 } }
		return c
	var a: Dictionary = mk.call("cindercub", 5, "bold")
	var b: Dictionary = mk.call("ripplet", 4, "calm")
	var c3: Dictionary = mk.call("mosshog", 7, "lazy")
	var sa: Dictionary = R.stats(a)
	var sb: Dictionary = R.stats(b)
	var sc: Dictionary = R.stats(c3)
	check(sa == { "hp": 21, "pow": 13, "grd": 9, "spd": 12, "wit": 11, "spi": 11 }, "Cindercub's stats match the browser: %s" % sa)
	check(sb == { "hp": 19, "pow": 10, "grd": 10, "spd": 9, "wit": 11, "spi": 10 }, "Ripplet's stats match the browser: %s" % sb)
	check(sc == { "hp": 30, "pow": 14, "grd": 14, "spd": 10, "wit": 12, "spi": 13 }, "Mosshog's stats match the browser: %s" % sc)
	var U := func(c: Dictionary, st: Dictionary, side: String) -> Dictionary: return { "c": c, "st": st, "side": side, "buff": {}, "cds": {} }
	var d1: Dictionary = R.damage(U.call(a, sa, "a"), U.call(b, sb, "f"), D.MOVES.emberSnap, 1.0, 0.5, 0.5)
	var d2: Dictionary = R.damage(U.call(b, sb, "f"), U.call(a, sa, "a"), D.MOVES.bubbleJet, 1.0, 0.5, 0.5)
	var d3: Dictionary = R.damage(U.call(c3, sc, "a"), U.call(a, sa, "f"), D.MOVES.vineLash, 1.3, 0.5, 0.5)
	var d4: Dictionary = R.damage(U.call(a, sa, "a"), U.call(c3, sc, "f"), D.MOVES.bite, 1.0, 0.01, 0.01)
	check(d1.d == 5 and is_equal_approx(d1.adv, 0.67) and not d1.crit, "Ember Snap on Ripplet: 5, not very effective (%s)" % d1)
	check(d2.d == 10 and d2.adv == 1.5, "Bubble Jet on Cindercub: 10, it hits hard (%s)" % d2)
	check(d3.d == 10, "Vine Lash with a 1.3 boost: 10 (%s)" % d3)
	check(d4.d == 6 and d4.crit, "a critical Bite: 6 (%s)" % d4)
	check(R.xp_need(5) == 187 and R.xp_need(13) == 1426, "XP needed per level matches")
	check(R.moves_of(a) == ["bite", "emberSnap"], "moves at level 5")
	var a12 := a.duplicate(true)
	a12.lvl = 12
	check(R.moves_of(a12) == ["bite", "emberSnap", "howl", "flameRush"], "moves at level 12")
	var g := a.duplicate(true)
	g.lvl = 13
	g.hp = 1
	var msgs: Array = R.grow(g, 2000, 20)
	check(g.lvl == 14 and g.sp == "blazefang" and msgs.any(func(m): return "evolved into Blazefang" in m), "levelling up to 14 evolves Cindercub: %s" % [msgs])
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
	check(main.stage == "walk_out", "after the bond you walk out together")
	check(main.team.size() == 1 and main.team[0].sp == "mosshog" and main.team[0].lvl == 5, "Mosshog joins your team at level 5")
	check(main.rival_c.sp == "cindercub" and main.rival_c.lvl == 4, "Wren will take Cindercub, the one that beats Mosshog")
	# ---- your partner follows you out, and the colour has spilled into town
	check(walk_to(main.BARN_EXIT + Vector2i.UP), "you can walk back to the barn door")
	main._step(Vector2i.DOWN)
	tick(1.0)
	check(main.map_name == "larkhaven" and main.partner.where == "larkhaven", "you and Mosshog step outside")
	check(main.spilled and main.restore.size() == 2, "the colour spills out of the barn into town")
	check(main.maren.where == "larkhaven", "Maren comes out of the barn with you")
	talk_through()
	# ---- Wren runs in and challenges you
	check(main.stage == "wren_runs" and main.wren.where == "larkhaven", "Wren arrives, running")
	for i in 300:
		tick(0.05)
		if main.stage == "rival1": break
	check(main.stage == "rival1" and (main.wren.tile - main.me.tile).length() <= 1.01, "Wren stops beside you")
	check(main.lines.size() == main.DATA.SCENES.rival1.size() and "Mosshog" in main.lines[-1].text and "Cindercub" in main.lines[-1].text, "Wren's lines name both partners")
	talk_through()
	check(main.stage == "battle" and main.battle.visible, "the battle starts")
	check(main.battle.foes.size() == 1 and main.battle.allies.size() == 1 and main.battle.trainer != "", "you against Wren, one each")
	var bt: Control = main.battle
	var turns := 0
	for i in 4000:
		tick(0.05)
		if bt.state == "choose":
			turns += 1
			bt._choose(0)
			if turns == 1: check(bt.state == "moves", "Fight opens the moves")
			var mv: Array = main.R.moves_of(bt.wait_u.c).filter(func(m): return bt.wait_u.cds.get(m, 0.0) <= 0)
			mv.sort_custom(func(a, b): return bt.best_value(a) > bt.best_value(b))
			bt._use_move(mv[0])
		if bt.state == "results": break
	check(bt.state == "results" and bt.result in ["won", "lost"], "the battle ends with a result (%s after %d turns)" % [bt.result, turns])
	check(turns >= 2, "you get to choose on your turns")
	if bt.result == "won":
		check(bt.results.any(func(l): return "XP" in l) and main.team[0].xp + main.team[0].lvl > 5, "winning gives XP")
	bt._go_to("fog_out")
	tick(1.5)
	check(not bt.visible and main.stage == "after_rival", "the results close and the story carries on")
	check(main.team[0].hp == main.R.stats(main.team[0]).hp, "Maren patches your team up")
	talk_through()
	check(main.stage == "free", "after Wren you're free")
	var before: Vector2i = main.me.tile
	for d in [Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP]:
		if main.walkable(main.me.tile + d):
			main._step(d)
			break
	tick(0.6)
	check(main.partner.tile == before, "your partner follows in your footsteps")
	# ---- the road north: Thornwood, its items, tall grass, a wild creature and the first catch
	check(walk_to(Vector2i(10, 1)), "you can walk up to the road north")
	main._step(Vector2i.UP)
	tick(1.0)
	check(main.map_name == "thornwood" and main.me.tile == Vector2i(13, 14), "the north road leads to Thornwood, arriving where the map says")
	check(main.partner.where == "thornwood", "your partner comes too")
	# ---- a route trainer spots you, walks over and battles (Bram, from the game data)
	check(main.npcs.size() == 3, "Thornwood has Bram, Lise and Warden Isolde")
	main.npc_info.lise.beaten = true                # keep Lise out of the way for these checks
	main.walk_to = main.route(main.me.tile, Vector2i(14, 10))
	for i in 200:
		tick(0.05)
		if main.spotter or not main.lines.is_empty(): break
	check(main.spotter != null or not main.lines.is_empty(), "walking into Bram's line of sight gets you spotted")
	for i in 100:
		tick(0.05)
		if not main.lines.is_empty(): break
	check(not main.lines.is_empty() and main.lines[0].who == "bram", "Bram walks over and speaks")
	talk_through()
	check(main.battle.visible and main.battle.kind == "trainer" and main.battle.foes.size() == 2, "Bram's battle: his two creatures at once")
	var coins0: int = main.bag.coins
	for u in main.battle.foes: u.c.hp = 0           # the checks win this one outright
	for i in 100:
		tick(0.05)
		if main.battle.state == "results": break
	check(main.battle.result == "won", "beating Bram")
	main.battle._go_to("fog_out")
	tick(1.5)
	check(main.npc_info.bram.beaten and main.bag.coins > coins0, "Bram counts as beaten and pays out coins (%d)" % (main.bag.coins - coins0))
	talk_through()
	check(not main._gate_open("thornwood"), "the hawthorn gate stays shut until you beat the Warden")
	var lures0: int = main.bag.lures
	check(walk_to(Vector2i(27, 10)), "you can walk to the lures lying in the grass")
	check(main.bag.lures == lures0 + 3 and main.got_items.has("tw2"), "picking up 3 lures (%d)" % main.bag.lures)
	talk_through()
	var wild := false
	for attempt in 6:
		main.grass_n = 1
		main.rng.seed = 11 + attempt
		var walked := walk_to(Vector2i(20, 7))
		if attempt == 0: check(walked or main.battle.visible or not main.lines.is_empty(), "walking into the tall grass")
		talk_through()
		if main.battle.visible:
			wild = true
			break
		walk_to(Vector2i(14, 10))
		talk_through()
	check(wild and main.battle.kind == "wild", "the tall grass turns up a wild creature")
	if wild:
		var foe: Dictionary = main.battle.foes[0].c
		check(foe.sp in main.DATA.BIOMES.thornwood.wild.map(func(w): return w[0]) and foe.lvl >= 2 and foe.lvl <= 12, "it lives in Thornwood, at a fitting level (%s, level %d)" % [foe.sp, foe.lvl])
		check(main.seen.has(foe.sp), "the Wilddex records it as seen")
		var bt2: Control = main.battle
		var tries := 0
		for i in 4000:
			tick(0.05)
			if bt2.state == "choose":
				if int(main.bag.lures) > 0 and tries < 6:
					var before_l: int = main.bag.lures
					bt2._choose(3)
					if tries == 0: check(bt2.state == "capture" and main.bag.lures == before_l - 1, "Bond throws a lure and starts the calm meter")
					bt2.cap.pos = bt2.cap.zone
					bt2._calm()
					tries += 1
				else:
					bt2._choose(0)
					bt2._use_move(main.R.moves_of(bt2.wait_u.c)[0])
			if bt2.state == "results": break
		check(bt2.state == "results", "the wild battle ends (%s, %d lures thrown)" % [bt2.result, tries])
		var team0: int = main.team.size()
		bt2._go_to("fog_out")
		tick(1.5)
		if bt2.result == "caught":
			check(main.team.size() == team0 + 1 and main.bonded.has(foe.sp), "the creature you calmed joins your team")
		talk_through()
	# ---- Warden Isolde at the hawthorn gate: her scene, her battle, the Thorn Badge, the gate
	if main.map_name == "thornwood" and not main.battle.visible:
		check(walk_to(Vector2i(12, 2)), "you can walk up to Warden Isolde")
		main.me.face = Vector2i.UP
		var ev2 := InputEventKey.new()
		ev2.pressed = true
		ev2.keycode = KEY_ENTER
		ev2.physical_keycode = KEY_ENTER
		main._unhandled_input(ev2)
		check(not main.lines.is_empty() and main.lines.size() == main.DATA.STORY.filter(func(b): return b.id == "warden")[0].lines.size(), "Isolde's scene from the game data")
		talk_through()
		check(main.battle.visible and main.battle.foes.size() == 3 and main.battle.trainer == "Warden Isolde", "the Warden battle: three creatures")
		for u in main.battle.foes: u.c.hp = 0
		for i in 100:
			tick(0.05)
			if main.battle.state == "results": break
		main.battle._go_to("fog_out")
		tick(1.5)
		check("thorn" in main.badges and main._gate_open("thornwood"), "the Thorn Badge, and the gate opens")
		talk_through()
		check(walk_to(Vector2i(13, 1)), "you can walk to the open gate (at %s, stage %s, lines %d, battle %s, map %s)" % [main.me.tile, main.stage, main.lines.size(), main.battle.visible, main.map_name])
		main._step(Vector2i.UP)
		tick(1.0)
		check(main.map_name == "thornwood" and not main.lines.is_empty() and "still being built" in main.lines[0].text, "past the gate: the coast isn't built in Godot yet, and the game says so")
		talk_through()
	# ---- Maren heals your team
	if main.map_name != "larkhaven":
		check(walk_to(Vector2i(13, 15)) or main.map_name == "larkhaven", "back down the road")
		main._step(Vector2i.DOWN)
		tick(1.0)
	talk_through()
	check(main.map_name == "larkhaven", "home to Larkhaven")
	for c in main.team: c.hp = 1
	main.walk_to = main.route(main.me.tile, main.maren.tile + Vector2i.LEFT)
	tick(8.0)
	if (main.me.tile - main.maren.tile).length() <= 1.01:
		var ev := InputEventKey.new()
		ev.pressed = true
		ev.keycode = KEY_ENTER
		ev.physical_keycode = KEY_ENTER
		main._unhandled_input(ev)
	check(main.team.all(func(c): return c.hp == main.R.stats(c).hp), "talking to Maren heals your team")
	# ---- saving your journey and loading it back (to a test file, never your real one)
	talk_through()
	main.no_save = false
	main.save_path = "user://test_journey.json"
	main.save_game()
	check(FileAccess.file_exists(main.save_path), "your journey saves")
	var lures_saved: int = main.bag.lures
	var lvl_saved: int = main.team[0].lvl
	var team_saved: int = main.team.size()
	main.bag.lures = 0
	main.badges = []
	check(main._load_game(), "and loads back")
	tick(1.0)
	talk_through()
	check(main.bag.lures == lures_saved and "thorn" in main.badges and main.team.size() == team_saved, "with your satchel, badges and team intact")
	check(main.team[0].lvl == lvl_saved and typeof(main.team[0].lvl) == TYPE_INT and main.R.stats(main.team[0]).hp > 0, "creatures come back whole (level %d)" % main.team[0].lvl)
	check(main._gate_open("thornwood") and main.npc_info.bram.beaten, "beaten trainers and the open gate are remembered")
	check(main._save_summary().begins_with(str(main.my_look.name)), "the start page sums it up: %s" % main._save_summary())
	DirAccess.remove_absolute(ProjectSettings.globalize_path(main.save_path))
	main.no_save = true
	# ---- the done line
	print("Wildbond Godot checks: %d passed, %d failed" % [passed, failed])
	quit(1 if failed > 0 else 0)
