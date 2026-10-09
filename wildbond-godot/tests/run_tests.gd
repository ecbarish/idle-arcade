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
		if main.walk_to.is_empty() and main.me.path.is_empty() and i % 10 == 9:
			main.walk_to = main.route(main.me.tile, goal)   # someone crossed our path: set off again, as a player would
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
	check(g.lvl == 14 and g.sp == "cindercub" and R.evo_target(g) == "blazefang", "at 14 Cindercub is ready to become Blazefang (you're asked; it isn't forced): %s" % [msgs])
	check(R.evolve(g, "blazefang") == "Cindercub" and g.sp == "blazefang" and g.name == "Blazefang", "letting it change: Cindercub becomes Blazefang")
	# ---- evolution with shapes and conditions (data/evolution.json)
	var bf := R.make("blazefang", 32, { "rar": 1 }, main.rng)
	check(R.evo_target(bf, { "place": "thornwood" }) == "" and R.evo_target(bf, { "place": "emberfall" }) == "pyremane", "a third stage: Blazefang becomes Pyremane at 32, but only in the heat of Emberfall")
	var tw := R.make("tidewyrm", 32, { "rar": 1 }, main.rng)
	tw.bond = 10.0
	check(R.evo_target(tw) == "", "Tidewyrm won't change for a tamer it doesn't trust completely")
	tw.bond = 150.0
	check(R.evo_target(tw) == "deeptide", "with complete trust (Devoted) it becomes Deeptide")
	var tb := R.make("thornback", 32, { "rar": 1 }, main.rng)
	check(R.evo_target(tb, { "team": ["thornback"] }) == "" and R.evo_target(tb, { "team": ["thornback", "glimmerwing"] }) == "elderthorn", "Thornback becomes Elderthorn when raised alongside a Glimmerwing")
	var pk := R.make("poolkit", 24, { "rar": 1 }, main.rng)
	pk.bond = 0.0
	check(R.evo_target(pk, { "place": "cloudglass" }) == "mistlynx", "a branching line: Poolkit in the cloud of the pass becomes Mistlynx")
	check(R.evo_target(pk, { "place": "saltmarsh" }) == "rilllynx", "elsewhere, most become Rilllynx")
	pk.bond = 150.0
	check(R.evo_target(pk, { "place": "saltmarsh" }) == "sunlynx", "and one devoted to its tamer becomes Sunlynx")
	check(R.evo_target(R.make("hearthlaugh", 60, { "rar": 1 }, main.rng)) == "", "Hearthlaugh never evolves; it's itself")
	check(main.DATA.SPECIES.has("pyremane") and main.DATA.SPECIES.size() >= 98, "the new forms are in the Wilddex (%d creatures)" % main.DATA.SPECIES.size())
	# ---- music: a tune for each place; Larkhaven's comes back with its colour
	check(main._music_key() == "faded", "the faded valley has a lost, quiet tune")
	main.spilled = true
	check(main._music_key() == "larkhaven", "once the colour spills into town, a warm village tune")
	main.spilled = false
	check(["faded", "larkhaven", "barn", "thornwood", "saltmarsh", "emberfall", "cloudglass", "wild", "trainer"].all(func(k): return ResourceLoader.exists("res://assets/music/%s.ogg" % k)), "every tune is in the game")
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
	check(main.npcs.filter(func(n): return n.where == "thornwood").size() == 3, "Thornwood has Bram, Lise and Warden Isolde")
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
	# ---- story moments while you explore: Wren's rematch on the trail, then the guardian of Thornwood
	main.explored_in["thornwood"] = 11
	main._explore()
	check(main.wren.where == "thornwood" and not main.lines.is_empty() and main.lines.any(func(l): return l.who == "wren"), "after 12 explorations Wren catches you up on the trail")
	talk_through()
	check(main.battle.visible and main.battle.foes.size() == 2 and main.battle.foes.any(func(u): return u.c.sp == main.rival_c.sp), "Wren's team: a Glimmerwing and the partner Wren chose")
	for u in main.battle.foes: u.c.hp = 0
	for i in 100:
		tick(0.05)
		if main.battle.state == "results": break
	main.battle._go_to("fog_out")
	tick(1.5)
	check(main.story_done.has("rival2") and main.wren.where == "gone", "beating Wren marks the moment done, and Wren heads off")
	talk_through()
	main.explored_in["thornwood"] = 19
	main._explore()
	check(not main.lines.is_empty() and "Elderhorn" in " ".join(main.lines.map(func(l): return l.text)), "at 20, Elderhorn steps out of the old trees")
	talk_through()
	check(main.battle.visible and main.battle.kind == "wild" and main.battle.foes[0].c.sp == "elderhorn" and main.battle.foes[0].c.rar == 4, "a legendary encounter: Elderhorn, level 11")
	for u in main.battle.foes: u.c.hp = 0
	for i in 100:
		tick(0.05)
		if main.battle.state == "results": break
	main.battle._go_to("fog_out")
	tick(1.5)
	check(not main.story_done.has("elder") and int(main.story_retry.get("elder", 0)) == 26, "knocked out, it slips away and can be met again after six more explorations")
	talk_through()
	for c in main.team: c.hp = main.R.stats(c).hp
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
		check(main.map_name == "saltmarsh" and main.me.tile == Vector2i(13, 12), "through the gate: Saltmarsh Coast, arriving where the map says")
		check(main.level_cap() == 25, "one badge raises the level cap to 25 (CAP_TABLE)")
		check(main.npcs.any(func(n): return n.id == "nerys" and n.where == "saltmarsh" and main.npc_info.nerys.warden), "Warden Nerys waits on the coast")
		check(main.npcs.filter(func(n): return n.where == "saltmarsh").size() >= 4, "the coast's people: Tobin, Cato, Marit and Nerys")
		# ---- the cliff road east to the Emberfall Highlands: roped off until Nerys gives you the Tide Badge
		main.npc_info.cato.beaten = true                # (walk past the beach trainers for this check)
		main.npc_info.marit.beaten = true
		check(walk_to(Vector2i(28, 8)), "you can walk along the beach to the cliff road")
		main._step(Vector2i.RIGHT)
		tick(1.0)
		check(main.map_name == "saltmarsh" and not main.lines.is_empty() and "Tide Badge" in main.lines[0].text, "the cliff road is roped off without the Tide Badge, and the sign says so")
		talk_through()
		tick(0.5)
		main.npc_info.nerys.beaten = true
		main.badges.append("tide")
		check(walk_to(Vector2i(28, 8)), "back at the foot of the cliff road")
		main._step(Vector2i.RIGHT)
		tick(1.0)
		check(main.map_name == "emberfall" and main.me.tile == Vector2i(1, 8), "with the Tide Badge: up to the Emberfall Highlands, arriving where the map says")
		check(main.level_cap() == 35 and main.battle.area == "emberfall", "two badges raise the cap to 35, and battles here happen in the highlands")
		check(main.npcs.any(func(n): return n.id == "toren" and n.where == "emberfall" and main.npc_info.toren.warden), "Warden Toren waits above the springs")
		check(main.npcs.any(func(n): return n.id == "orsk") and main.npcs.any(func(n): return n.id == "sela"), "Orsk the ridge hiker and Sela the spring keeper")
		check(main.solid("o") and main.solid("R") and main.route(Vector2i(1, 8), Vector2i(8, 5)).is_empty(), "the hot springs and the cliffs block the way")
		main.explored_in["emberfall"] = 6
		check(main._beat_here("emberfall").get("id", "") == "rival4", "Wren waits on Warmstep Rise after a few explorations")
		main.explored_in["emberfall"] = 0
		check(not main._gate_open("emberfall"), "the high path north into the cloud stays roped until Toren is beaten")
		# ---- up the high path into Cloudglass Pass with the Ember Badge
		main.npc_info.orsk.beaten = true                # (walk past the ridge trainers for this check)
		main.npc_info.sela.beaten = true
		main.npc_info.toren.beaten = true
		main.badges.append("ember")
		check(walk_to(Vector2i(13, 8)) and walk_to(Vector2i(13, 1)), "you can climb to the foot of the high path")
		main._step(Vector2i.UP)
		tick(1.0)
		check(main.map_name == "cloudglass" and main.me.tile == Vector2i(13, 12), "with the Ember Badge: up into Cloudglass Pass, arriving where the map says")
		check(main.level_cap() == 45 and main.battle.area == "cloudglass" and main.CLIFF == main.MOUNTAINS.cloudglass.rock, "three badges: cap 45; the pass has its own cold stone and its own battle skyline")
		check(main.npcs.any(func(n): return n.id == "vessa" and n.where == "cloudglass" and main.npc_info.vessa.warden), "Warden Vessa keeps the shelter at the top")
		check(main.npcs.any(func(n): return n.id == "ilka") and main.npcs.any(func(n): return n.id == "teodor"), "Ilka the rope-mender and Teodor on the trail")
		main.explored_in["cloudglass"] = 6
		check(main._beat_here("cloudglass").get("id", "") == "rival5", "Wren is somewhere in the cloud after a few explorations")
		main.explored_in["cloudglass"] = 0
		main._step(Vector2i.DOWN)
		tick(1.0)
		check(main.map_name == "emberfall" and main.me.tile == Vector2i(13, 1) and main.CLIFF == main.MOUNTAINS.emberfall.rock, "and back down to the warm stone of Emberfall")
		talk_through()
		check(walk_to(Vector2i(13, 8)) and walk_to(Vector2i(1, 8)), "back along the ridge path to the coast road")
		main.badges.erase("ember")
		main.npc_info.toren.beaten = false
		main._step(Vector2i.LEFT)
		tick(1.0)
		check(main.map_name == "saltmarsh" and main.me.tile == Vector2i(28, 8), "and back down to the coast")
		talk_through()
		main.badges.erase("tide")                       # back to one badge, as the checks below expect
		main.npc_info.nerys.beaten = false
		walk_to(Vector2i(14, 8))                        # along the beach path, out of the tall grass
		check(walk_to(Vector2i(13, 13)) or main.map_name == "thornwood", "back to the coast road south (at %s, battle %s)" % [main.me.tile, main.battle.visible])
		main._step(Vector2i.DOWN)
		tick(1.0)
		check(main.map_name == "thornwood" and main.me.tile == Vector2i(13, 1), "and back into Thornwood by the gate")
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
	# ---- Larkhaven: the shop counter, the inn, and Pip
	talk_through()
	check(main.map_name == "larkhaven", "in Larkhaven for the shop")
	if main.map_name == "larkhaven" and main.lines.is_empty():
		var coins1: int = main.bag.coins
		var lures1: int = main.bag.lures
		main.bag.coins = maxi(coins1, 60)
		coins1 = main.bag.coins
		check(walk_to(Vector2i(7, 11)), "you can walk up to the shop door")
		main._step(Vector2i.UP)
		check(main.shop.visible, "walking into the shop door opens the counter")
		main.shop._buy(0)
		check(main.bag.lures == lures1 + 5 and main.bag.coins == coins1 - 50, "5 lures for 50 coins, like the browser")
		main.bag.coins = 0
		main.shop._buy(1)
		check(main.bag.berries >= 0 and main.bag.coins == 0 and "coins" in main.shop.note, "no coins, no berries (the shopkeeper says so)")
		main.shop._buy(2)
		check(not main.shop.visible, "leaving the counter")
		for c in main.team: c.hp = 1
		check(walk_to(Vector2i(4, 5)), "you can walk to the inn")
		main._step(Vector2i.UP)
		check(main.team.all(func(c): return c.hp == main.R.stats(c).hp), "a night at the inn heals your team")
		talk_through()
		check(main.npcs.any(func(n): return n.id == "pip" and n.where == "larkhaven"), "Pip lives in Larkhaven")
		check(walk_to(Vector2i(20, 7)), "you can walk up to Pip")
		main.me.face = Vector2i.RIGHT
		check(main._talk_here() and main.lines[0].who == "pip" and main.lines.any(func(l): return "YELLOW" in l.text), "Pip has noticed the colour since your Thorn Badge")
		talk_through()
	# ---- the field book
	talk_through()
	var evj := InputEventKey.new()
	evj.pressed = true
	evj.keycode = KEY_J
	main._unhandled_input(evj)
	check(main.book.visible and main.book.seen.size() >= 3 and main.book.team == main.team, "J opens the field book: your Wilddex and team")
	main.book.close()
	check(not main.book.visible, "and closes it")
	# ---- Maren's ranch: creatures you aren't carrying live in the paddock and the barn, where you can visit them
	talk_through()
	var keep_team: Array = main.team.duplicate()
	for c in keep_team:
		c["hold"] = 999                            # (these checks aren't about evolving: "not yet" for now)
	if main.card.visible and main.card_mode == "evolve":
		main.card._pick(1)                           # an offer that came up during the earlier checks: not yet
		talk_through()
		for c in keep_team:
			c["hold"] = 999
	var keep_ranch: Array = main.ranch.duplicate()
	main.team = [main.team[0]]
	main.ranch = [main.R.make("fernruff", 10, { "rar": 1 }, main.rng), main.R.make("poolkit", 12, { "rar": 1 }, main.rng)]
	main._place_ranch()
	check(main.ranch_movers.size() == 2 and main.ranch_movers.all(func(m): return m.where == "larkhaven" and main.PADDOCK.has_point(m.tile)), "creatures at the ranch stand in Maren's paddock")
	var fern: Variant = main.ranch_movers[0]
	main._tap(fern.pos + Vector2(8, 8))               # tap it: you walk over (following if it wanders) and meet it
	for i in 200:
		tick(0.05)
		if main.card.visible: break
	check(main.card.visible and main.card.buttons == ["Take along", "To the stall", "Let it rest"], "tapping a ranch creature walks you over and opens its page: Take along, To the stall or Let it rest (me %s, it %s, card %s %s %s, lines %s, stage %s, team %s)" % [main.me.tile, fern.tile, main.card.visible, main.card_mode, main.card.buttons, main.lines.map(func(l): return l.text.left(30)), main.stage, main.team.map(func(c): return [c.sp, c.lvl, c.get("hold")])])
	main.card._pick(0)
	check(main.team.size() == 2 and main.team[1].sp == "fernruff" and main.ranch.size() == 1 and main.ranch_movers.size() == 1, "Take along: it joins your team and leaves the paddock")
	talk_through()
	main.team.append(main.R.make("bogbough", 9, { "rar": 1 }, main.rng))
	main._visit(main.ranch_movers[0])
	check(main.card.visible and main.card.buttons[0] == "Swap in", "with a full team the page offers a swap")
	main.card._pick(0)
	check(main.card.visible and main.card.buttons.size() == 4 and main.card.buttons[3] == "Never mind", "and asks who rests at the ranch instead (your three, or never mind)")
	var lead: String = main.team[0].sp
	main.card._pick(0)
	check(main.team[0].sp == "poolkit" and main.ranch.size() == 1 and main.ranch[0].sp == lead, "the swap: Poolkit joins, your old lead creature goes to rest")
	check(main.partner.look.kind == "cat", "the new lead creature is the one that walks with you")
	talk_through()
	for k in 5:
		main.ranch.append(main.R.make("dewspinner", 8, { "rar": 1 }, main.rng))
	main._place_ranch()
	check(main.ranch_movers.filter(func(m): return m.where == "larkhaven").size() == 4 and main.ranch_movers.filter(func(m): return m.where == "barn").size() == 2, "four creatures in the paddock, the rest inside the barn")
	main._visit(main.ranch_movers[0])
	main.card._pick(2)
	check(not main.card.visible and main.team.size() == 3 and main.ranch.size() == 6, "Let it rest changes nothing")
	# ---- the barn: the trough and the nursery (breeding)
	var keep_tile: Vector2i = main.me.tile
	main.ranch = [main.R.make("cindercub", 10, { "rar": 1 }, main.rng), main.R.make("blazefang", 16, { "rar": 2 }, main.rng), main.R.make("poolkit", 3, { "rar": 1 }, main.rng)]
	main.ranch[0].bond = 25.0
	main.ranch[1].bond = 30.0
	main._place_ranch()
	main._set_map("barn")
	main.me.tile = Vector2i(21, 7)
	main.bag.berries = 3
	var b0: float = main.ranch[2].bond
	check(main._near_trough(), "standing by the trough in Maren's barn")
	main._feed()
	check(int(main.bag.berries) == 1 and main.ranch[2].bond > b0, "two berries in the trough: your ranch creatures trust you more")
	talk_through()
	main._feed()
	check(int(main.bag.berries) == 1 and main.lines.size() > 0 and "empty" in main.lines[0].text, "with one berry left the trough stays empty")
	talk_through()
	for k in 3:
		main._visit(main.ranch_movers[k])
		main.card._pick(1)
		talk_through()
	check(main.in_stall().size() == 2 and not main.ranch[2].get("stall", false), "two creatures go to the nursery; a third is turned away")
	check(main.ranch_movers.filter(func(m): return main.BREED_STALL.has_point(m.tile)).size() == 2, "and they stand in its straw")
	main.me.tile = Vector2i(4, 5)
	check(main._near_stall(), "standing at the nursery")
	main.bag.coins = 100
	main._breed_here()
	check(main.card.visible and main.card_mode == "breed" and main.breed_opts == ["cindercub"], "a wolf pair: the egg will be a Cindercub (%s)" % [main.breed_opts])
	main.card._pick(0)
	check(int(main.bag.coins) == 20 and not main.egg.is_empty() and main.egg.child.sp == "cindercub" and main.in_stall().is_empty(), "an egg for 80 coins; the parents go back to the ranch")
	talk_through()
	var n_ranch: int = main.ranch.size()
	for k in main.EGG_STEPS:
		main._egg_step()
	check(main.egg.is_empty() and main.ranch.size() == n_ranch + 1 and main.ranch[-1].lvl == 3 and int(main.ranch[-1].gen) == 2, "after a walk on your journey the egg hatches into the ranch")
	talk_through()
	check(not main.R.breed_info(main.ranch[0], main.ranch[2]).ok, "a level-3 creature is too young to breed")
	# ---- Maren's letters on the road, and where to go next
	var keep_badges: Array = main.badges.duplicate()
	main.badges = []
	check("Isolde" in main.where_next() and "Thornwood" in main.where_next(), "with no badges, Maren points you to Warden Isolde in Thornwood")
	main.badges = ["thorn", "tide"]
	check("Emberfall" in main.where_next() and "Toren" in main.where_next(), "two badges: on to Emberfall and Toren")
	main.letter_steps = 1
	var bond_before: float = main.ranch[0].bond
	main._letter_step()
	check(main.lines.size() >= 3 and main.lines.any(func(l): return l.who == "maren" and "Emberfall" in l.text) and main.ranch[0].bond > bond_before, "a runner brings Maren's letter: ranch news, and where next (%s)" % [main.lines.map(func(l): return l.text.left(40))])
	check(main.letter_steps == main.LETTER_STEPS, "and the next one comes after another stretch of road")
	talk_through()
	main.badges = keep_badges
	# ---- Maren's workbench: gear for your creatures, worn and seen
	main.me.tile = Vector2i(2, 9)
	check(main._near_bench(), "standing at Maren's workbench")
	main.story_done.erase("bench")
	main._open_bench()
	check(main.lines.size() >= 2 and main.lines[0].who == "maren", "the first time, Maren explains her workbench")
	talk_through()
	check(main.card.visible and main.card_mode == "bench" and main.card.buttons.size() == 4, "then whoever walks with you tries gear on (%s)" % [main.card.buttons])
	main.card.visible = false
	main.bench_i = main.R.GEAR.keys().find("harness")
	main._open_bench()
	main.bag.coins = 100
	var wearer: Dictionary = main.team[0]
	main.card._pick(1)
	check(wearer.get("gear") == "harness" and int(main.bag.coins) == 40, "Maren makes a Leather Harness for 60 coins, and it goes on")
	talk_through()
	check(main.partner.look.get("gear") == "harness", "it shows on your partner as you walk")
	check(main.card.visible and main.card.buttons[1] == "Take it off", "back at the bench: Take it off")
	main.card._pick(1)
	check(not wearer.has("gear") and int(main.gear_owned.harness) == 1, "taken off, it goes in your satchel")
	main.card._pick(1)
	check(wearer.get("gear") == "harness" and int(main.gear_owned.harness) == 0, "and goes back on, for nothing")
	main.card._pick(3)
	check(not main.card.visible, "Done closes the bench")
	var bare: Dictionary = wearer.duplicate(true)
	bare.erase("gear")
	check(main.R.stats(wearer).grd > main.R.stats(bare).grd, "a harness: it takes knocks better (Guard %d against %d)" % [main.R.stats(wearer).grd, main.R.stats(bare).grd])
	var foe_c: Dictionary = main.R.make("cindercub", 20, { "rar": 1 }, main.rng)
	var att := { "c": foe_c, "st": main.R.stats(foe_c), "buff": {}, "side": "f" }
	var tgt: Dictionary = main.R.make("mosshog", 20, { "rar": 1 }, main.rng)
	var d_bare: int = main.R.damage(att, { "c": tgt, "st": main.R.stats(tgt), "buff": {}, "side": "a" }, main.DATA.MOVES.emberSnap, 1.0, 0.5, 1.0).d
	tgt["gear"] = "ember"
	var d_band: int = main.R.damage(att, { "c": tgt, "st": main.R.stats(tgt), "buff": {}, "side": "a" }, main.DATA.MOVES.emberSnap, 1.0, 0.5, 1.0).d
	check(d_band < d_bare, "an Ember-Glass Band: Ember moves hurt less (%d against %d)" % [d_band, d_bare])
	check(main.Figures._gear_parts(main.Figures._wolf({}, main.CREATURE_LOOKS.cindercub), "bell").size() > 0, "gear is drawn on the body, whatever its shape")
	# ---- tamer orders: Rally, your family's order, and orders people teach you
	var ob = main.battle
	ob.heritage = "coast"
	ob.taught = ["steady"]
	check(ob.known_orders() == ["rally", "tide", "steady"], "orders: Rally, the coast family's Read the Tide, and Toren's Steady (%s)" % [ob.known_orders()])
	ob.heritage = "farm"
	ob.taught = []
	check(ob.known_orders() == ["rally", "patch"], "a farm family's tamer knows Patch Up")
	var o_team: Array = [main.R.make("cindercub", 12, { "rar": 1 }, main.rng), main.R.make("poolkit", 12, { "rar": 1 }, main.rng)]
	ob.open("wild", o_team, [main.R.make("mosshog", 10, { "rar": 1 }, main.rng)], "")
	ob.wait_u = ob.allies[0]
	ob.orders = 3.0
	ob.allies[1].c.hp = 5
	ob.allies[1].dots = [{ "per": 2, "left": 3, "tick": 1.0 }]
	check(ob.use_order("patch") and ob.allies[1].c.hp > 5 and ob.allies[1].dots.is_empty() and ob.orders == 2.0, "Patch Up: the most hurt creature recovers and its poison eases, for one order")
	ob.heritage = "coast"
	check(ob.use_order("tide") and ob.tide_ready, "Read the Tide: ready for the next big attack")
	ob.orders = 0.0
	check(not ob.use_order("rally"), "not enough orders: nothing happens, and you're told why")
	ob.orders = 3.0
	ob.heritage = "wander"
	ob.allies[1].atb = 0.0
	check(ob.use_order("opening") and ob.allies[1].atb >= main.R.ACT_AT, "Find an Opening: another of your creatures acts at once")
	ob.visible = false
	ob.state = "off"
	main.battle.heritage = main.heritage()
	check(main.TEACHERS.has("ember") and main.TEACHERS.ember.order == "steady", "Toren teaches Steady with the Ember Badge")
	wearer.erase("gear")
	main.gear_owned.clear()
	main._lead_look()
	main._set_map("larkhaven")
	main.me.tile = keep_tile
	# ---- a creature ready to change: you're asked, and "not yet" is respected until it grows again
	var cub: Dictionary = main.R.make("cindercub", 14, { "rar": 1 }, main.rng)
	main.team = [cub]
	tick(0.1)
	check(main.card.visible and main.card.buttons == ["Let it change", "Not yet"] and main.evolve_to == "blazefang", "after the battle that made it ready, Cindercub's change is offered")
	main.card._pick(1)
	talk_through()
	tick(0.2)
	check(not main.card.visible and cub.sp == "cindercub" and int(cub.hold) == 14, "Not yet: it stays itself, and isn't asked again at this level")
	cub.lvl = 15
	tick(0.1)
	check(main.card.visible and main.evolve_to == "blazefang", "a level later, it's ready again")
	main.card._pick(0)
	check(cub.sp == "blazefang" and main.seen.has("blazefang") and main.partner.look.body == Color(main.DATA.SPECIES.blazefang.col), "Let it change: Blazefang, now walking with you")
	talk_through()
	for c in keep_team:
		c.erase("hold")
	main.team = keep_team
	main.ranch = keep_ranch
	main._place_ranch()
	main._lead_look()
	# ---- heritage: your family, chosen in the register (docs/proposals/wildbond-heritage.md)
	var reg = main.register
	check(reg.ROWS[8][0] == "Family" and reg.look().heritage == "farm", "the register has a Family line (Farmfolk first)")
	reg.row = 8
	reg.change(1)
	check(reg.look().heritage == "coast" and "partner" in reg.FAMILY_TEXT.coast, "choosing Coastfolk, with what it means written under it")
	reg.change(-1)
	check(main.heritage() == "farm" or main.my_look.has("heritage"), "old journeys without a family count as farmfolk")
	var keep_look: Dictionary = main.my_look.duplicate()
	var keep_team2: Array = main.team.duplicate()
	var h_lead: Dictionary = main.R.make("cindercub", 10, { "rar": 1 }, main.rng)
	var h_second: Dictionary = main.R.make("ripplet", 10, { "rar": 1 }, main.rng)
	for c in [h_lead, h_second]:
		c.traits = []
		c.bond = 0.0
		c["hold"] = 999
	var bond_after := func(fam: String, kind: String) -> Array:
		h_lead.bond = 0.0
		h_second.bond = 0.0
		main.my_look["heritage"] = fam
		main.battle.heritage = fam
		main.team = [h_lead, h_second]
		var foe: Dictionary = main.R.make("glimmerwing", 3, { "rar": 1 }, main.rng)
		main.battle.open(kind, main.team, [foe], "" if kind == "wild" else "Test")
		for u in main.battle.foes: u.c.hp = 0
		for i in 120:
			tick(0.05)
			if main.battle.state == "results": break
		main.battle._go_to("fog_out")
		main.battle_story = "test"
		tick(1.5)
		talk_through()
		return [float(h_lead.bond), float(h_second.bond)]
	var farm_w: Array = bond_after.call("farm", "wild")
	var coast_w: Array = bond_after.call("coast", "wild")
	check(is_equal_approx(coast_w[0], farm_w[0] * 1.5) and is_equal_approx(coast_w[1], farm_w[1]), "coastfolk: the lead creature's trust grows half again as fast (%s vs %s)" % [coast_w, farm_w])
	var farm_t: Array = bond_after.call("farm", "trainer")
	var high_t: Array = bond_after.call("highland", "trainer")
	check(is_equal_approx(high_t[0], farm_t[0] * 1.5) and is_equal_approx(high_t[1], farm_t[1] * 1.5), "highlanders: trust grows faster in battles against tamers (%s vs %s)" % [high_t, farm_t])
	main.team = keep_team2
	main.my_look = keep_look
	main.my_look["heritage"] = "farm"
	main.story_done.erase("her:pip")
	check(walk_to(Vector2i(20, 7)), "back over to Pip")
	main.me.face = Vector2i.RIGHT
	main._talk_here()
	check(not main.lines.is_empty() and "farms" in main.lines[0].text, "Pip recognises a farm family, the first time")
	talk_through()
	main._talk_here()
	check(not main.lines.is_empty() and not ("farms" in main.lines[0].text), "and only the first time")
	talk_through()
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
	check(main.ranch_movers.size() == main.ranch.size(), "the ranch creatures are back in the paddock after loading (%d)" % main.ranch.size())
	check(main._save_summary().begins_with(str(main.my_look.name)), "the start page sums it up: %s" % main._save_summary())
	DirAccess.remove_absolute(ProjectSettings.globalize_path(main.save_path))
	main.no_save = true
	# ---- the done line
	print("Wildbond Godot checks: %d passed, %d failed" % [passed, failed])
	quit(1 if failed > 0 else 0)
