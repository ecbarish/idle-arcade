extends SceneTree
## How winnable is Wren's first battle? Plays it many times per starter with sensible moves (power x advantage) and
## prints the win rate. Balance helper, not a pass/fail check:
##   Godot_v4.7.2-stable_win64_console.exe --headless --path wildbond-godot --script res://tests/battle_odds.gd
const R := preload("res://scripts/rules.gd")
const Battle := preload("res://scripts/battle.gd")

func _initialize() -> void:
	var j: JSON = load("res://data/wildbond.json")
	R.DATA = j.data
	if "--patch" in OS.get_cmdline_user_args():
		for s in ["cindercub", "ripplet", "mosshog"]:
			for l in R.DATA.SPECIES[s].learn:
				if R.DATA.MOVES[l[1]].get("el") != null and l[0] == 1:
					l[0] = 5
		print("(element moves at level 5)")
	var rival_lvl := 4
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--lvl="): rival_lvl = int(a.substr(6))
	print("Wren's partner at level %d" % rival_lvl)
	var rng := RandomNumberGenerator.new()
	rng.seed = 42
	for id in R.DATA.STARTERS:
		var wins := 0
		var turns_total := 0
		var hp_left := 0.0
		var n := 100
		for k in n:
			var b: Control = Battle.new()
			b.rng.seed = rng.randi()
			root.add_child(b)
			var me := R.make(id, 5, { "rar": 1 }, rng)
			var foe := R.make(R.DATA.COUNTER[id], rival_lvl, { "rar": 1 }, rng)
			b.open("trainer", [me], [foe], "Wren")
			var turns := 0
			for i in 6000:
				b._process(0.05)
				if b.state == "choose":
					turns += 1
					b._choose(0)
					var mv: Array = R.moves_of(b.wait_u.c).filter(func(m): return b.wait_u.cds.get(m, 0.0) <= 0)
					mv.sort_custom(func(x, y): return b.best_value(x) > b.best_value(y))
					b._use_move(mv[0])
				if b.state == "results":
					break
			if b.result == "won":
				wins += 1
				hp_left += float(me.hp) / R.stats(me).hp
			turns_total += turns
			b.queue_free()
		print("%s vs %s: won %d of %d, %.1f turns on average, %.0f%% health left when winning" % [id, R.DATA.COUNTER[id], wins, n, float(turns_total) / n, 100.0 * hp_left / maxf(1, wins)])
	quit()
