extends SceneTree
## Diagnostic only: executed in a disposable project by tools/wildbond-late-pacing.ps1.
## Uses unmodified Godot battle/rules, never loads main, never reads/writes user://.
const R := preload("res://scripts/rules.gd")
const Battle := preload("res://scripts/battle.gd")
const AREAS := ["stillreed", "hollowecho", "sunthread", "farwatch"]
const ENTRY_LEVELS := [44, 55, 60, 65]
const SEEDS := [7, 42, 2026]
var failures: Array = []
var rows: Array = []
var stalls: Array = []
var runs: Array = []
var direct_runs: Array = []
var checks := 0
var rng := RandomNumberGenerator.new()
var battle: Control
var team: Array = []
var total_wild := 0
var total_losses := 0
var battle_seconds := 0.0
var held := false
var started_ms := Time.get_ticks_msec()

func _process(_dt: float) -> bool:
	if Time.get_ticks_msec() - started_ms > 180000:
		print("Diagnostic timed out; no completed measurements claimed.")
		quit(3)
	return false

func _initialize() -> void:
	_run.call_deferred()

func verify(ok: bool, label: String) -> void:
	checks += 1
	if not ok:
		failures.append(label)
		print("FAIL: ", label)

func read_json(file: String):
	return JSON.parse_string(FileAccess.get_file_as_string(file))

func _run() -> void:
	R.DATA = read_json("res://wildbond.json")
	var ev: Dictionary = read_json("res://evolution.json")
	for id in ev.species:
		R.DATA.SPECIES[id] = ev.species[id]
	R.DATA["EVOS"] = ev.evos
	battle = Battle.new()
	root.add_child(battle)
	battle.set_process(false)
	var fixtures: Dictionary = read_json("res://fixtures.json")
	for f in fixtures.fixtures:
		verify(R.STATS.all(func(k): return int(R.stats(f.a)[k]) == int(f.stats[k])), "stats %s %d %s" % [f.a.sp, f.a.lvl, f.a.temp])
		verify(R.xp_need(int(f.a.lvl)) == int(f.xpNeed), "XP curve %d" % f.a.lvl)
		var a := {"c": f.a, "st": R.stats(f.a), "buff": {}, "side": "a"}
		var b := {"c": f.b, "st": R.stats(f.b), "buff": {"guard": 3, "guardCmd": 1}, "side": "f"}
		var hit: Dictionary = R.damage(a, b, R.DATA.MOVES[f.move], 1.0, 0.5, 1.0)
		verify(int(hit.d) == int(f.damage.d) and hit.adv == f.damage.adv and hit.crit == f.damage.crit, "damage fixture %s %d" % [f.a.sp, f.a.lvl])
	for profile in ["evolved", "held"]:
		for seed in SEEDS:
			# Independent entry benchmarks, NOT one successful no-training journey.
			for i in AREAS.size():
				reset_team(seed, profile == "held", ENTRY_LEVELS[i])
				var stage := route(AREAS[i], i + 4, false)
				stage["seed"] = seed
				stage["profile"] = profile
				stage["policy"] = "route-only-independent"
				rows.append(stage)
	for profile in ["evolved", "held"]:
		for seed in SEEDS:
			trained_journey(seed, profile == "held", false)
	for seed in SEEDS:
		trained_journey(seed, false)
	trained_journey(42, true)
	var output := {"schema": 1, "fixtureChecks": checks, "failures": failures, "routeBenchmarks": rows, "trainedJourneys": runs, "directJourneys": direct_runs,
		"cooldownStalls": stalls, "godotVersion": Engine.get_version_info().string, "entryLevels": ENTRY_LEVELS, "seeds": SEEDS, "maxWildAttemptsPerTraining": 4000, "battleStep": 0.1,
		"policy": "Farmfolk; strongest ready damaging move, regrowth below 45%, Guard telegraphs, Rally below 60%, full heal outside every fight; no capture/gear/ranch bonuses; accept eligible evolutions unless held."}
	var file := FileAccess.open("res://results.json", FileAccess.WRITE)
	file.store_string(JSON.stringify(output, "\t", true))
	print("Pacing diagnostic: ", checks, " invariant/parity checks; ", failures.size(), " failures; ", rows.size(), " entry benchmarks; ", runs.size(), " trained journeys")
	battle.free()
	quit(0 if failures.is_empty() else 1)

func reset_team(seed: int, hold_forms: bool, lvl: int) -> void:
	rng.seed = seed
	wren_beaten = false
	held = hold_forms
	team = []
	for id in ["tidewyrm", "thornback", "glimmerwing"]:
		var c := R.make(id, lvl, {"rar": 1 if id == "tidewyrm" else 0}, rng)
		c.bond = 60.0 if held else 140.0
		team.append(c)
	evolve_here("cloudglass")
	total_wild = 0
	total_losses = 0
	battle_seconds = 0.0

func evolve_here(area: String) -> void:
	if held:
		return
	for c in team:
		var to := R.evo_target(c, {"place": area, "team": team.map(func(x): return x.sp)})
		if to != "":
			R.evolve(c, to)

func levels() -> Array:
	return team.map(func(c): return c.lvl)

func fight(kind: String, opponents: Array, cap: int, label: String) -> Dictionary:
	for c in team:
		c.hp = R.stats(c).hp
	var before := levels()
	var foes: Array = []
	for t in opponents:
		var id: String = "mosshog" if t[0] == "$rival" else str(t[0])
		foes.append(R.make(id, int(t[1]), {"rar": int(t[2]) if t.size() > 2 else 1}, rng))
	battle.rng.seed = rng.randi()
	battle.heritage = "farm"
	battle.max_level = cap
	battle.bag = {"lures": 0, "berries": 0}
	battle.demo = false
	battle.open(kind, team, foes, label)
	var seconds := 0.0
	var blocked := false
	for frame in 5000:
		battle._process(0.1)
		seconds += 0.1
		if battle.state == "choose" and battle.state_t > 0.8:
			if team.any(func(c): return c.hp > 0 and c.hp < R.stats(c).hp * 0.6) and battle.orders >= 2:
				battle.use_order("rally")
			elif not battle.tele.is_empty() and battle.orders >= 1:
				battle._choose(1)
			battle._choose(0)
		elif battle.state == "moves" and battle.state_t > 0.8:
			var moves: Array = R.moves_of(battle.wait_u.c).filter(func(m): return battle.wait_u.cds.get(m, 0.0) <= 0)
			if moves.is_empty():
				blocked = true
				var frozen: Dictionary = battle.wait_u.cds.duplicate(true)
				for tick in 100:
					battle._process(0.1)
				var unchanged: bool = frozen.keys().all(func(k): return battle.wait_u.cds[k] == frozen[k])
				verify(unchanged and battle.state == "moves", "Ten seconds of waiting do not release cooldown stall")
				stalls.append({"id": label, "kind": kind, "species": battle.wait_u.c.sp, "levels": levels(), "moves": R.moves_of(battle.wait_u.c), "cooldowns": frozen, "stillFrozenAfterSeconds": 10 if unchanged else 0})
				if kind == "wild":
					battle._choose(5) # The actual Run action; no XP or invented win.
				break
			var injured: bool = battle.living("a").any(func(u): return u.c.hp < u.st.hp * 0.45)
			moves.sort_custom(func(a, b): return battle.best_value(a) > battle.best_value(b))
			battle._use_move("regrowth" if injured and "regrowth" in moves else str(moves[0]))
		if battle.result != "":
			break
	var result: String = battle.result if battle.result != "" else ("blocked:no-ready-move" if blocked else "timeout")
	verify(result in ["won", "lost", "fled", "blocked:no-ready-move"], "Battle terminates: " + label)
	verify(team.all(func(c): return c.lvl <= cap and c.hp >= 0 and c.xp >= 0), "Valid capped state: " + label)
	if result == "lost":
		total_losses += 1
	if kind == "wild":
		total_wild += 1
	battle_seconds += seconds
	battle.visible = false
	return {"id": label, "result": result, "before": before, "after": levels(), "battleSeconds": snapped(seconds, 0.1), "cooldownStall": blocked}

func wild(area: String, cap: int) -> Dictionary:
	var biome: Dictionary = R.DATA.BIOMES[area]
	var table: Array = R.DATA.MAPS[area].seasonal.summer.wild
	var total := 0.0
	for w in table:
		total += float(w[1])
	var roll := rng.randf() * total
	var id: String = table[0][0]
	for w in table:
		roll -= float(w[1])
		if roll <= 0:
			id = w[0]
			break
	var avg := 0.0
	for c in team:
		avg += c.lvl
	avg = roundf(avg / team.size())
	var lvl := clampi(rng.randi_range(int(avg) - 2, int(avg) + 1), int(biome.lv[0]), int(biome.lv[1]))
	var rar := R.roll_rarity(float(R.DATA.JOURNEY.classic.rare), rng)
	var outcome := fight("wild", [[id, lvl, rar]], cap, "wild:" + area)
	evolve_here(area)
	return outcome

func train(area: String, cap: int, target: int) -> Dictionary:
	var before := levels()
	var wins := 0
	var losses := 0
	var seconds := battle_seconds
	for attempt in 4000:
		if team.all(func(c): return c.lvl >= target):
			break
		var outcome := wild(area, cap)
		if outcome.result == "won":
			wins += 1
		else:
			losses += 1
	return {"before": before, "after": levels(), "target": target, "wins": wins, "losses": losses,
		"battleSeconds": snapped(battle_seconds - seconds, 0.1), "reached": team.all(func(c): return c.lvl >= target)}

func route(area: String, badge_count: int, trained: bool) -> Dictionary:
	var cap: int = int(R.DATA.CAP_TABLE[badge_count])
	var entry := levels()
	var events: Array = []
	var extra: Array = []
	var trainers: Array = R.DATA.MAPS[area].npcs.filter(func(n): return n.has("trainer"))
	# Fixed benchmark: 24 exploration opportunities, 15 wild battles, 2 route trainers,
	# Wren and guardian. Not a random walking/pathfinding simulation or a minimum gate.
	for i in 15:
		wild(area, cap)
		if i in [3, 9]:
			var n: Dictionary = trainers[0 if i == 3 else 1]
			events.append(fight("trainer", n.trainer.team, cap, n.who))
		if i in [5, 12]:
			var s: Dictionary = R.DATA.STORY.filter(func(b): return b.get("biome", "") == area and b.has("team") and not b.has("gate"))[0] if i == 5 else R.DATA.STORY.filter(func(b): return b.get("biome", "") == area and b.has("wild"))[0]
			events.append(fight("trainer" if s.has("team") else "wild", s.team if s.has("team") else [s.wild], cap, s.id))
		if not events.is_empty() and events[-1].result == 'blocked:no-ready-move':
			break
	var warden: Dictionary = R.DATA.STORY.filter(func(b): return b.get("biome", "") == area and b.has("gate"))[0]
	var target := 0
	for t in warden.team:
		target = maxi(target, int(t[1]))
	if events.any(func(event): return event.result == "blocked:no-ready-move"):
		return {"area": area, "entry": entry, "cap": cap, "ace": target, "beforeWarden": levels(), "afterWarden": levels(), "wardenResult": "blocked:route-trainer", "events": events, "training": extra, "wildAttempts": total_wild, "losses": total_losses, "battleSeconds": snapped(battle_seconds, 0.1)}
	if trained:
		extra.append(train(area, cap, target))

	var before_warden := levels()
	var outcome := fight("trainer", warden.team, cap, warden.id)
	events.append(outcome)
	evolve_here(area)
	return {"area": area, "entry": entry, "cap": cap, "ace": target, "beforeWarden": before_warden,
		"afterWarden": levels(), "wardenResult": outcome.result, "events": events, "training": extra,
		"wildAttempts": total_wild, "losses": total_losses, "battleSeconds": snapped(battle_seconds, 0.1)}

func trained_journey(seed: int, hold_forms: bool, with_training: bool = true) -> void:
	reset_team(seed, hold_forms, 44)
	var stages: Array = []
	var ending := "Champion"
	for i in AREAS.size():
		var s := route(AREAS[i], i + 4, with_training)
		stages.append(s)
		print("PACING ", seed, " ", "held" if held else "evolved", " ", s.area, " training ", (s.training[0].wins if not s.training.is_empty() else 0), " before ", s.beforeWarden, " ", s.wardenResult)
		if s.wardenResult != "won" or (with_training and (s.training.is_empty() or not s.training[0].reached)):
			ending = "blocked:" + s.area
			break
	var league: Array = []
	var league_training: Dictionary = {}
	if ending == "Champion":
		# First try straight after Rysa; a loss resets the courts, retaining earned XP.
		league = league_attempt()
		if league.any(func(s): return s.result == "blocked:no-ready-move"):
			ending = 'league blocked:cooldowns'
		elif not league.all(func(s): return s.result == 'won') and not with_training:
			ending = 'league lost'
		elif not league.all(func(s): return s.result == 'won'):
			league_training = train("farwatch", 75, 75)
			var retry := league_attempt()
			league.append_array(retry)
			if not league_training.reached or not retry.all(func(s): return s.result == "won"):
				ending = "league blocked"
	var collection: Array = runs if with_training else direct_runs
	collection.append({"seed": seed, "profile": "held" if held else "evolved", "policy": "train-to-ace" if with_training else "route-only-continuous",
		"stages": stages, "league": league, "leagueTraining": league_training, "end": ending,
		"team": team.duplicate(true), "wildAttempts": total_wild, "losses": total_losses, "battleSeconds": snapped(battle_seconds, 0.1)})

func league_attempt() -> Array:
	var results: Array = []
	for s in R.DATA.STORY.filter(func(b): return b.has("league")):
		# Wren stays beaten after loss, just as main._after_league does.
		if s.id == "leagueWren" and runs_has_wren():
			continue
		var out := fight("trainer", s.team, 75, s.id)
		results.append(out)
		if s.id == "leagueWren" and out.result == "won":
			wren_beaten = true
		if out.result != "won":
			break
	return results

var wren_beaten := false
func runs_has_wren() -> bool:
	return wren_beaten
