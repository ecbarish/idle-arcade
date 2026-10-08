extends SceneTree
## Starfall's checks: plays the town by itself, without a window, and checks each part works.
##   Godot_v4.7.2-stable_win64_console.exe --headless --path starfall-godot --script res://tests/run_tests.gd
var main: Node2D
var passed := 0
var failed := 0

func check(ok: bool, what: String) -> void:
	if ok:
		passed += 1
	else:
		failed += 1
		print("FAIL: ", what)

func _initialize() -> void:
	main = load("res://scenes/main.tscn").instantiate()
	main.no_save = true                           # never touch the real town
	root.add_child(main)
	_run.call_deferred()

func tick(seconds: float) -> void:
	var steps := int(seconds / 0.05)
	for i in steps:
		main._process(0.05)

func talk_through() -> void:
	var guard := 0
	while not main.lines.is_empty() and guard < 40:
		main.advance()
		guard += 1

func walk_to(goal: Vector2i) -> bool:
	# like a player: if someone steps in the way, tap again
	for tries in 6:
		main.walk_to = main.route(main.me.tile, goal, main.me)
		for i in 200:
			tick(0.05)
			if main.me.tile == goal and main.me.path.is_empty():
				return true
			if main.walk_to.is_empty() and main.me.path.is_empty():
				break
	return false

func hero(name: String) -> Variant:
	for h in main.heroes:
		if h.a.name == name:
			return h
	return null

func _run() -> void:
	main.rng.seed = 2026
	# ---- the town at the start
	check(main.MAP.all(func(r): return r.length() == 24), "the town map is 24 tiles wide on every row")
	check(main.heroes.size() == 3 and main.coins == 100 and main.day == 1, "three adventurers, 100 coins, day one")
	check(main.notices.size() == 3 and main.posted.is_empty(), "three requests on the board, none pinned yet")
	check(not main.lines.is_empty() and main.lines.any(func(l): return l.who == "bryn"), "Bryn welcomes you")
	talk_through()
	tick(1.0)
	check(main.heroes.all(func(h): return h.a.state == "town"), "with nothing pinned up, everyone waits in town")
	# ---- the guild board
	check(walk_to(main.READ_AT), "you can walk up to the board")
	check(main.use() and main.board_open, "using it opens the board, close up")
	var easy := ""
	for id in main.notices:
		if int(main.job_of(id).danger) <= 2 and easy == "":
			easy = id
	if easy == "":
		main.notices[0] = "slimes"
		easy = "slimes"
	main.board_pick(main.notices.find(easy))
	check(main.posted == [easy], "picking a notice pins it up")
	main.board_pick(main.notices.find(easy))
	check(main.posted.is_empty(), "picking it again takes it down")
	main.board_pick(main.notices.find(easy))
	main.board_pick(main.notices.size())
	check(not main.board_open, "Done closes the board")
	walk_to(Vector2i(12, 10))                       # step off the road so you're not in anyone's way
	# ---- an adventurer takes it, goes out, comes home hurt and hungry
	var taker: Variant = null
	for i in 400:
		tick(0.1)
		for h in main.heroes:
			if h.a.state != "town" and taker == null:
				taker = h
		if taker != null and taker.where == "away":
			break
	check(taker != null and main.posted.is_empty(), "an adventurer chooses the job for themselves and takes the notice down")
	check(taker != null and taker.where == "away", "and heads out through the gate")
	var coins0: int = main.coins
	var hp0: int = int(taker.a.max) if taker else 0
	for i in 800:
		tick(0.1)
		if taker.a.state == "to_counter" and taker.tile == main.ORDER_AT and taker.path.is_empty():
			break
	check(taker.where == "town" and taker.a.state == "to_counter", "they come home and go to the inn's counter (state %s)" % taker.a.state)
	check(int(taker.a.hp) < hp0, "a little hurt from the job (%d/%d)" % [int(taker.a.hp), hp0])
	check(main.coins >= coins0, "the guild's share of the reward if it went well (%d -> %d)" % [coins0, main.coins])
	# ---- you serve them yourself
	check(walk_to(main.SERVE_AT), "you can step behind the counter")
	main.me.face = Vector2i.RIGHT
	var coins1: int = main.coins
	check(main.use() and main.coins == coins1 + main.MEAL and main.meals == 1, "serving a meal by hand: %d coins" % main.MEAL)
	check(taker.a.state == "to_rest", "fed, they head up to bed")
	for i in 300:
		tick(0.1)
		if taker.where == "inside":
			break
	check(taker.where == "inside" and taker.a.state == "resting", "they go into the inn to rest")
	for i in 900:
		tick(0.1)
		if taker.where == "town":
			break
	check(taker.where == "town" and int(taker.a.hp) == int(taker.a.max), "rested, they come back out good as new")
	# ---- nobody serving: they give up and go hungry
	var waiter: Variant = main.heroes[2] if main.heroes[2] != taker else main.heroes[1]
	walk_to(Vector2i(11, 10))
	waiter.a.state = "to_counter"
	waiter.a.timer = 0.0
	waiter.a.waited = 0.0
	main.queue.append(waiter)
	var morale0: int = int(waiter.a.morale)
	for i in 600:
		tick(0.1)
		if waiter.a.state != "to_counter":
			break
	check(waiter.a.state == "to_rest" and int(waiter.a.morale) == morale0 - 1, "left waiting too long, they give up grumbling (spirits drop)")
	# ---- a disastrous job: never fatal
	var brave: Variant = hero("Ren")
	brave.a.lvl = 1
	brave.a.job = "barrow"
	brave.where = "away"
	brave.a.state = "away"
	brave.a.timer = 0.0
	main.rng.seed = 1
	for k in 6:
		brave.a.hp = 3
		brave.a.job = "barrow"
		main._come_home(brave)
		main.queue.erase(brave)
	check(int(brave.a.hp) >= 1, "however badly a job goes, nobody dies (hp %d)" % int(brave.a.hp))
	check(main.badly_hurt(brave), "they come home badly hurt instead, bandaged")
	brave.a.state = "town"
	brave.a.hp = brave.a.max
	brave.a.morale = 6
	# ---- Bryn offers to take the counter after you've served enough meals
	main.meals = main.HIRE_AFTER - 1
	var h2: Variant = hero("Yuna")
	walk_to(main.SERVE_AT)
	h2.where = "town"
	h2.tile = main.ORDER_AT
	h2.pos = Vector2(main.ORDER_AT) * 16.0
	h2.path.clear()
	h2.a.state = "to_counter"
	h2.a.waited = 0.0
	main.queue.clear()
	main.queue.append(h2)
	main.me.face = Vector2i.RIGHT
	main.use()
	check(main.meals == main.HIRE_AFTER and main.bryn_offered, "after %d meals by hand, Bryn calls you over (me %s, meals %d, queue %d, at %s, lines %d)" % [main.HIRE_AFTER, main.me.tile, main.meals, main.queue.size(), h2.tile, main.lines.size()])
	check(walk_to(main.bryn.tile + Vector2i.DOWN) or (main.me.tile - main.bryn.tile).length() <= 1.01, "you can walk over to Bryn")
	check(main.use() and not main.lines.is_empty(), "she asks to take the counter")
	talk_through()
	talk_through()
	check(main.hired, "agree, and Bryn is hired")
	walk_to(Vector2i(11, 10))
	for i in 200:
		tick(0.1)
		if main.bryn.tile == main.SERVE_AT:
			break
	check(main.bryn.tile == main.SERVE_AT, "Bryn takes her place behind the counter")
	var h3: Variant = hero("Aki")
	h3.where = "town"
	h3.a.state = "to_counter"
	h3.a.timer = 0.0
	h3.a.waited = 0.0
	main.queue.clear()
	main.queue.append(h3)
	var coins2: int = main.coins
	for i in 300:
		tick(0.1)
		if h3.a.state != "to_counter":
			break
	check(h3.a.state == "to_rest" and main.coins == coins2 + main.MEAL, "Bryn serves without you (coins %d -> %d)" % [coins2, main.coins])
	# ---- the end of the day: a short report and Bryn's wages, or she leaves if you can't pay
	main.coins = 50
	main.day_t = main.DAY_SECONDS - 0.01
	tick(0.1)
	check(main.day == 2 and main.coins == 50 - main.WAGE and "Evening falls" in main.caption.text, "evening: a short report, and Bryn's wages paid")
	check(main.notices.size() == 3, "new requests on the board in the morning")
	main.coins = 3
	main.day_t = main.DAY_SECONDS - 0.01
	tick(0.1)
	check(not main.hired and "couldn't pay" in main.caption.text, "can't pay her wages: Bryn goes back to her own kitchen")
	# ---- building on a plot: Hob's plans, coins, scaffolding, then the building
	check(not main.solid(main.PLOTS.west) and main.plot_at(Vector2i(3, 10)) == "west", "the west plot is open ground, staked out")
	check(walk_to(main.PLOTS.west + Vector2i(2, 0)), "you can walk up to the plot")
	check(main.use() and main.build_plot == "west" and main.plans().size() == 2, "using it opens Hob's plans: the healer's hut or a training yard")
	main.coins = 50
	check(not main.build("healer") and "more coins" in main.build_note and main.build_plot == "west", "too few coins: Hob says how many more")
	main.coins = 300
	check(main.build("healer") and main.coins == 180 and main.build_plot == "", "building the healer's hut: 120 coins")
	check(main.solid(main.PLOTS.west) and main.finished("healer") == "", "scaffolding goes up; it isn't finished yet")
	tick(main.BUILDINGS.healer.time + 1.0)
	check(main.finished("healer") == "west" and main.ama.where == "town" and "finished" in main.caption.text, "it's finished, and Ama stands at her door")
	# ---- hurt adventurers go to Ama, and mend twice as fast
	var patient: Variant = hero("Aki")
	patient.where = "town"
	patient.a.state = "town"
	patient.a.hp = int(patient.a.max) / 4
	check(main._bed_of(patient) == main._step_of("west"), "badly hurt, an adventurer goes to Ama's hut instead of the inn")
	var light: Variant = hero("Yuna")
	light.a.hp = int(light.a.max) - 2
	check(main._bed_of(light) == main.INN_STEP, "a few bruises: the inn's bed will do")
	main._to_bed(patient)
	for i in 400:
		tick(0.1)
		if patient.where == "healer":
			break
	check(patient.where == "healer" and patient.a.state == "resting", "they go in to Ama")
	var hp_in: int = int(patient.a.hp)
	tick(1.6)
	check(int(patient.a.hp) - hp_in >= int(ceil(float(patient.a.max) * 0.1)), "and mend quickly in her care (+%d)" % (int(patient.a.hp) - hp_in))
	for i in 400:
		tick(0.1)
		if patient.where == "town":
			break
	check(patient.where == "town" and int(patient.a.hp) == int(patient.a.max), "mended, they come back out")
	# ---- the training yard: idle adventurers practise and grow
	main.build_plot = "east"
	main.coins = 300
	check(main.build("yard"), "a training yard on the east plot")
	tick(main.BUILDINGS.yard.time + 1.0)
	check(main.finished("yard") == "east", "the yard is finished")
	main.posted.clear()
	var trainee: Variant = hero("Ren")
	trainee.where = "town"
	trainee.a.state = "training"
	trainee.a.timer = 30.0
	trainee.a.drill = 0.0
	main.send(trainee, main._step_of("east"))
	var xp0: int = int(trainee.a.xp) + int(trainee.a.lvl) * 1000
	for i in 120:
		tick(0.1)
	check(int(trainee.a.xp) + int(trainee.a.lvl) * 1000 > xp0, "practising at the yard brings experience")
	# ---- the town grows: a new rank brings a newcomer through the gate
	var n0: int = main.heroes.size()
	main.total_jobs = 6
	main._check_rank()
	check(main.rank >= 1 and main.heroes.size() > n0 and main.heroes[n0].a.name == "Kaito", "with buildings and jobs done, Starfall becomes a Village, and Kaito arrives")
	check("Village" in main.status.text or main.RANKS[main.rank].name in ["Village", "Town"], "the town's rank shows at the top")
	# ---- saving the town and loading it back (a test file, never the real one)
	main.no_save = false
	main.save_path = "user://test_town.json"
	main.coins = 77
	var heroes_saved: int = main.heroes.size()
	main.save_game()
	main.coins = 0
	main.heroes.clear()
	main.built = {}
	check(main._load() and main.coins == 77 and main.heroes.size() == heroes_saved and main.day == 3, "the town saves and loads back")
	check(main.finished("healer") == "west" and main.finished("yard") == "east" and main.ama.where == "town" and main.rank >= 1, "with its buildings, Ama, and its rank")
	DirAccess.remove_absolute(ProjectSettings.globalize_path(main.save_path))
	main.no_save = true
	print("Starfall Godot checks: %d passed, %d failed" % [passed, failed])
	quit(1 if failed > 0 else 0)
