extends RefCounted
const R := preload("res://scripts/rules.gd")
const E := preload("res://scripts/battle_effects.gd")
static func run(main: Node, check: Callable) -> void:
	var rng := RandomNumberGenerator.new()
	rng.seed = 104125
	check.call(R.DATA.MOVES.size() == 60, "WD3: sixty moves")
	for id in R.DATA.SPECIES:
		var c := R.make(id, 100, {}, rng)
		var known := R.learned_moves(c)
		check.call(known.size() >= 6 and known.size() <= 8, "WD3: %s remembers six to eight moves" % id)
		check.call(R.moves_of(c).any(func(m): return R.DATA.MOVES[m].kind in ["hit", "aoe"]), "WD3: %s always arrives with an attack" % id)
		check.call(R.moves_of(c).size() == 4, "WD3: %s brings four" % id)
		c.erase("moves")
		var legacy: Array = []
		for lesson in R.sp(c).legacyLearn:
			if lesson[0] <= c.lvl and not lesson[1] in legacy: legacy.append(lesson[1])
		check.call(R.moves_of(c) == legacy.slice(-4), "WD3: %s keeps old-save moves" % id)
		check.call(R.keep_moves(c, known.slice(0, 4)), "WD3: %s can practice a valid loadout" % id)
		var loaded: Dictionary = JSON.parse_string(JSON.stringify(c))
		check.call(R.moves_of(main._fix_creature(loaded)) == R.moves_of(c), "WD3: %s loadout survives JSON save" % id)
	var a := R.make("cindercub", 30, {}, rng)
	var b := R.make("ripplet", 30, {}, rng)
	var u: Dictionary = main.battle.unit(a, "a")
	var v: Dictionary = main.battle.unit(b, "f")
	for status in E.BAD:
		E.cleanse(v)
		v.wake_grace = 0.0
		check.call(E.apply(v, status, 2.0) and E.active(v, status), "WD3: applies " + status)
		E.tick(v, 2.1)
		check.call(not E.active(v, status), "WD3: expires " + status)
		v.wake_grace = 0.0
		E.apply(v, status, 2.0)
		E.cleanse(v)
		check.call(not E.active(v, status), "WD3: cleanses " + status)
	check.call(not a.has("status") and not b.has("status"), "WD3: statuses never enter saved creatures")
	v.wake_grace = 0.0
	E.apply(v, "sleep", 3.0)
	check.call(R.atb_rate(v) == 0.0 and not E.apply(v, "sleep", 3.0), "WD3: sleep pauses and cannot refresh")
	E.wake(v)
	check.call(not E.active(v, "sleep") and not E.apply(v, "sleep", 3.0), "WD3: a hit wakes and protects against chaining")
	E.tick(v, 5.1)
	check.call(E.apply(v, "sleep", 3.0), "WD3: sleep becomes available after wake grace")
	E.cleanse(v)
	var speed := R.atb_rate(v)
	E.apply(v, "rooted", 3.0)
	check.call(is_equal_approx(R.atb_rate(v), speed * 0.65), "WD3: roots slow without stopping turns")
	E.cleanse(v)
	E.apply(v, "soaked", 3.0)
	check.call(is_equal_approx(E.modifier(u, v, R.DATA.MOVES.steamBurst), 1.5), "WD3: soaked sets up Steam Burst")
	E.after_hit(v, R.DATA.MOVES.steamBurst)
	check.call(not E.active(v, "soaked"), "WD3: follow-up consumes setup")
	E.apply(u, "scorched", 3.0)
	check.call(E.modifier(u, v, R.DATA.MOVES.bite) == 0.75 and E.modifier(u, v, R.DATA.MOVES.steamBurst) == 1.0, "WD3: burn weakens physical moves only")
	check.call(E.tick(u, 1.0) == maxi(1, roundi(u.st.hp * 0.02)), "WD3: burn ticks at two percent")
	E.cleanse(u)
	v.buff.guard = 3.0
	var ordinary := R.damage(u, v, {"kind": "hit", "pow": 65}, 1.0, 1.0, 1.0).d
	check.call(R.damage(u, v, R.DATA.MOVES.rootCharge, 1.0, 1.0, 1.0).d > ordinary, "WD3: boar charge bypasses guard")
	E.after_hit(v, R.DATA.MOVES.rootCharge)
	check.call(v.buff.guard == 0, "WD3: boar charge breaks guard")
	v.buff.guard = 3.0
	E.after_hit(v, R.DATA.MOVES.skyDive)
	check.call(v.buff.guard == 3.0, "WD3: bird dive leaves guard for partners to break")
	check.call(not R.keep_moves(a, ["howl"]) and not R.keep_moves(a, ["missing"]), "WD3: practice rejects harmless or unknown loadouts")
	for level in range(1, 100):
		check.call(is_equal_approx(R.win_xp(1, level, level, false, 0.13) * 12.0, float(R.xp_need(level))), "WD3: twelve even wins at level %d" % level)
	check.call(main.TEACHERS.size() == 8, "WD3: every Warden teaches an order")
	for badge in main.TEACHERS:
		check.call(main.battle.ORDERS.has(main.TEACHERS[badge].order), "WD3: usable order for " + badge)
	main.lessons.open([a])
	check.call(main.lessons.visible and main.lessons.team[0] == a, "WD3: practice opens without a new creature copy")
	main.lessons.visible = false
