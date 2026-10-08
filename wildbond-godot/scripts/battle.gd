extends Control
## A battle on the field (docs/wildbond-plan.md phase 3). The classic layout over the whole screen: the foe on its
## grass platform at the top right, your partner at the bottom left, health beside each, a strip showing who acts
## next, the message box below, and a command box: Fight (then a move, each with its description), Guard, Rally, Run.
## The rules are the browser game's (rules.gd): speed-based turns that pause on your creature's turn, the same damage,
## elements, cooldowns and orders. A grey fog rolls in and out (no flashing), and the results page waits for you.

signal finished(result: String)
const Figures := preload("res://scripts/figures.gd")
const R := preload("res://scripts/rules.gd")
const INK := Color("2a2230")
const PAPER := Color("f8f2e4")
const EL_COL := { "Ember": Color("e0602a"), "Tide": Color("3a8fd8"), "Grove": Color("5d9a3e") }
const SPEED := 2.5                            # battle time runs faster than real time between turns (outcomes are unchanged)
const MENU := ["Fight", "Guard", "Rally", "Bond", "Bag", "Run"]

var looks: Dictionary = {}                    # species id -> body plan (main.gd CREATURE_LOOKS)
var floor_tex: Texture2D
var nature_tex: Texture2D
var kind := "trainer"
var trainer := ""
var allies: Array = []
var foes: Array = []
var state := "off"                            # fog_in, intro, run, choose, moves, beat, results, fog_out
var wait_u: Dictionary = {}                   # the ally whose turn it is
var beat_t := 0.0
var state_t := 0.0
var t := 0.0
var log_lines: Array = []
var orders := 1.0                             # command points: Guard costs 1, Rally 2; one more every 5 seconds of battle
var order_t := 0.0
var tele: Dictionary = {}                     # a big foe attack being gathered (Guard in time!)
var menu_i := 0
var move_i := 0
var floats: Array = []                        # damage numbers: { u, txt, col, age }
var sparks: Array = []                        # element bursts: { u, col, age }
var result := ""
var results: Array = []                       # lines on the results page
var rng := RandomNumberGenerator.new()
var font: Font
var demo := false
var bag: Dictionary = { "lures": 0, "berries": 0 }  # the satchel (main.gd owns it): lures for Bond, berries for Bag
var caught: Array = []                        # creatures that chose you in this battle
var cap: Dictionary = {}                      # the calm meter while you Bond: { u, pos, dir, zone }

func _ready() -> void:
	set_anchors_preset(PRESET_FULL_RECT)
	mouse_filter = MOUSE_FILTER_STOP
	font = ThemeDB.fallback_font
	visible = false

func unit(c: Dictionary, side: String) -> Dictionary:
	var st := R.stats(c)
	if c.get("hp") == null or c.hp > st.hp:
		c.hp = st.hp
	return { "c": c, "side": side, "st": st, "atb": rng.randf() * 1.2, "cds": {}, "buff": {}, "dots": [], "lunge": 0.0, "hit": 0.0, "shown": float(c.hp) }

func open(battle_kind: String, team: Array, foe_team: Array, who: String) -> void:
	kind = battle_kind
	trainer = who
	allies = team.filter(func(c): return c.hp > 0).map(func(c): return unit(c, "a"))
	foes = foe_team.map(func(c): return unit(c, "f"))
	log_lines.clear()
	floats.clear()
	sparks.clear()
	tele = {}
	orders = 1.0
	order_t = 0.0
	result = ""
	results.clear()
	caught.clear()
	cap = {}
	var names := ", ".join(foes.map(func(u): return "%s (Lv %d)" % [u.c.name, u.c.lvl]))
	say("A wild %s appeared!" % names if kind == "wild" else "%s sends out %s!" % [trainer, names])
	_go_to("fog_in")
	visible = true

func say(s: String) -> void:
	log_lines.append(s)
	if log_lines.size() > 30:
		log_lines.pop_front()

func _go_to(s: String) -> void:
	state = s
	state_t = 0.0

func living(side: String) -> Array:
	return (allies if side == "a" else foes).filter(func(u): return u.c.hp > 0)

# ---------------------------------------------------------------- the battle running
func _process(dt: float) -> void:
	if not visible:
		return
	t += dt
	state_t += dt
	for u in allies + foes:
		u.shown = move_toward(u.shown, float(u.c.hp), dt * maxf(8.0, u.st.hp * 0.8))   # health bars drain smoothly
		u.lunge = maxf(0.0, u.lunge - dt)
		u.hit = maxf(0.0, u.hit - dt)
	for f in floats: f.age += dt
	floats = floats.filter(func(f): return f.age < 1.0)
	for s in sparks: s.age += dt
	sparks = sparks.filter(func(s): return s.age < 0.6)
	match state:
		"fog_in":
			if state_t > 1.0: _go_to("intro")
		"intro":
			if state_t > 1.4: _go_to("run")
		"run":
			_tick(dt * SPEED)
		"capture":
			cap.pos += cap.dir * dt * 0.9
			if cap.pos > 1.0: cap.pos = 1.0; cap.dir = -1.0
			if cap.pos < 0.0: cap.pos = 0.0; cap.dir = 1.0
		"beat":
			if state_t > beat_t:
				_after_beat()
		"fog_out":
			if state_t > 1.0:
				visible = false
				state = "off"
				finished.emit(result)
	if demo:
		_demo()
	queue_redraw()

func _tick(h: float) -> void:
	order_t += h
	if order_t >= 5.0:
		order_t = 0.0
		orders = minf(3.0, orders + 1.0)
	if not tele.is_empty():
		tele.t -= h
		if tele.t <= 0.0:
			var u: Dictionary = tele.u
			var m: String = tele.m
			tele = {}
			if u.c.hp > 0 and not living("a").is_empty():
				_resolve(u, m, 1.0)
				_beat(1.1)
				return
	for u in allies + foes:
		if u.c.hp <= 0:
			continue
		for k in u.cds.keys():
			u.cds[k] = maxf(0.0, u.cds[k] - h)
		for k in ["dmg", "haste", "guard", "slow"]:
			if u.buff.get(k, 0.0) > 0:
				u.buff[k] -= h
				if u.buff[k] <= 0 and k == "guard":
					u.buff.guardCmd = 0
		for d in u.dots:
			d.tick -= h
			if d.tick <= 0:
				d.tick = 1.0
				d.left -= 1
				_hurt(u, d.per, false, null)
		u.dots = u.dots.filter(func(d): return d.left > 0)
		if u.c.hp <= 0 or (not tele.is_empty() and tele.u == u):
			continue
		u.atb += h * R.atb_rate(u)
		if u.atb >= R.ACT_AT:
			if u.side == "a":
				u.atb = R.ACT_AT
				wait_u = u
				menu_i = 0
				_go_to("choose")
				return
			u.atb = 0.0
			_act(u, "", 1.0)
			if state != "run":
				return
		if _check_end():
			return

func _check_end() -> bool:
	if living("f").is_empty():
		_end("won")
		return true
	if living("a").is_empty():
		_end("lost")
		return true
	return false

func _beat(seconds: float) -> void:
	beat_t = seconds
	_go_to("beat")

func _after_beat() -> void:
	if not _check_end():
		_go_to("run")

# ---------------------------------------------------------------- acting (03-battle.js act / resolve)
func _act(u: Dictionary, forced: String, mult: float) -> void:
	var m: String = forced if forced != "" else R.choose_move(u, living(u.side), rng)
	var mv: Dictionary = R.DATA.MOVES[m]
	if living("f" if u.side == "a" else "a").is_empty():
		return
	u.cds[m] = float(mv.cd)
	# a big foe attack is telegraphed, so you can Guard in time
	if u.side == "f" and forced == "" and (mv.kind == "aoe" or mv.pow >= 80) and tele.is_empty():
		tele = { "u": u, "m": m, "t": 1.6 }
		say("%s is gathering power for %s!" % [u.c.name, mv.name])
		_beat(1.0)
		return
	_resolve(u, m, mult)
	_beat(1.1)

func _target(u: Dictionary) -> Dictionary:
	var them := living("f" if u.side == "a" else "a")
	return them[0] if rng.randf() < 0.65 else them[rng.randi() % them.size()]

func _resolve(u: Dictionary, m: String, mult: float) -> void:
	var mv: Dictionary = R.DATA.MOVES[m]
	var them := living("f" if u.side == "a" else "a")
	var us := living(u.side)
	u.lunge = 0.35
	match mv.kind:
		"hit":
			var tg := _target(u)
			var r := R.damage(u, tg, mv, mult, rng.randf(), rng.randf())
			_hurt(tg, r.d, r.crit, mv.get("el"))
			say("%s used %s%s on %s for %d%s" % [u.c.name, mv.name, ", a critical hit" if r.crit else "", tg.c.name, r.d,
				". It hits hard!" if r.adv > 1 else (". Not very effective." if r.adv < 1 else ".")])
		"aoe":
			for tg in them:
				var r := R.damage(u, tg, mv, mult * 0.75, rng.randf(), rng.randf())
				_hurt(tg, r.d, r.crit, mv.get("el"))
			say("%s used %s on everyone!" % [u.c.name, mv.name])
		"dot":
			var tg := _target(u)
			tg.dots.append({ "per": maxi(1, roundi(R.damage(u, tg, mv, mult, rng.randf(), 1.0).d / 2.0)), "left": 4, "tick": 1.0 })
			say("%s used %s. %s is poisoned." % [u.c.name, mv.name, tg.c.name])
		"buff":
			for a in us: a.buff.dmg = 6.0
			say("%s used %s! Its team hits harder." % [u.c.name, mv.name])
		"haste":
			for a in us: a.buff.haste = 6.0
			say("%s used %s! Its team speeds up." % [u.c.name, mv.name])
		"guard":
			for a in us: a.buff.guard = 4.0
			say("%s used %s! Its team braces." % [u.c.name, mv.name])
		"slow":
			var tg := _target(u)
			tg.buff.slow = 5.0
			say("%s used %s. %s slows down." % [u.c.name, mv.name, tg.c.name])
		"heal":
			var low: Dictionary = us[0]
			for a in us:
				if float(a.c.hp) / a.st.hp < float(low.c.hp) / low.st.hp:
					low = a
			var hp := roundi(low.st.hp * 0.25)
			low.c.hp = mini(low.st.hp, low.c.hp + hp)
			floats.append({ "u": low, "txt": "+%d" % hp, "col": Color("7cf08a"), "age": 0.0 })
			sparks.append({ "u": low, "col": Color("7cf08a"), "age": 0.0 })
			say("%s used %s. %s recovers %d." % [u.c.name, mv.name, low.c.name, hp])

func _hurt(u: Dictionary, d: int, crit: bool, el) -> void:
	u.c.hp = maxi(0, u.c.hp - d)
	u.hit = 0.45
	floats.append({ "u": u, "txt": "-%d" % d, "col": Color("ffd23a") if crit else Color("ffffff"), "age": 0.0 })
	if el != null:
		sparks.append({ "u": u, "col": EL_COL.get(el, Color.WHITE), "age": 0.0 })
	if u.c.hp <= 0:
		say("%s fainted!" % u.c.name)

# ---------------------------------------------------------------- your choices
func _choose(i: int) -> void:
	match MENU[i]:
		"Fight":
			move_i = 0
			_go_to("moves")
		"Guard":
			if orders < 1:
				say("Not enough orders yet. They come back as the battle goes on.")
				return
			orders -= 1
			for a in living("a"):
				a.buff.guard = 3.0
				a.buff.guardCmd = 1
			say("Guard! Your team braces for the hit.")
		"Rally":
			if orders < 2:
				say("Rally needs two orders. They come back as the battle goes on.")
				return
			orders -= 2
			for a in living("a"):
				var hp := roundi(a.st.hp * 0.2)
				a.c.hp = mini(a.st.hp, a.c.hp + hp)
				R.add_bond(a.c, 1.0)
				floats.append({ "u": a, "txt": "+%d" % hp, "col": Color("7cf08a"), "age": 0.0 })
			say("You rally your team. Everyone recovers.")
		"Bond":
			if kind != "wild":
				say("You can't bond with another tamer's creature.")
			elif int(bag.get("lures", 0)) <= 0:
				say("You're out of lures. You can find them in the grass, or buy them in Larkhaven.")
			else:
				# a lure plus a timing meter: weaker, calmer creatures are easier (startCapture)
				var tg: Dictionary = living("f")[0]
				for u in living("f"):
					if float(u.c.hp) / u.st.hp < float(tg.c.hp) / tg.st.hp:
						tg = u
				bag.lures -= 1
				cap = { "u": tg, "pos": 0.0, "dir": 1.0, "zone": 0.62 + rng.randf() * 0.2 }
				say("You throw a lure at %s. Calm it: press when the marker is in the green." % tg.c.name)
				_go_to("capture")
		"Bag":
			if int(bag.get("berries", 0)) <= 0:
				say("Your bag has nothing to use in battle yet. Berries heal; you find them in the grass.")
			else:
				var low: Dictionary = living("a")[0]
				for a in living("a"):
					if float(a.c.hp) / a.st.hp < float(low.c.hp) / low.st.hp:
						low = a
				bag.berries -= 1
				var hp := roundi(low.st.hp * 0.3)
				low.c.hp = mini(low.st.hp, low.c.hp + hp)
				floats.append({ "u": low, "txt": "+%d" % hp, "col": Color("7cf08a"), "age": 0.0 })
				sparks.append({ "u": low, "col": Color("7cf08a"), "age": 0.0 })
				say("%s eats a berry and recovers %d." % [low.c.name, hp])
				var u := wait_u
				wait_u = {}
				u.atb = 0.0                                # eating takes its turn
				_beat(1.0)
		"Run":
			if kind == "wild":
				say("You slip away.")
				_end("fled")
			else:
				say("%s blocks the way: \"No running from a tamer battle!\"" % trainer)

func _use_move(m: String) -> void:
	if wait_u.cds.get(m, 0.0) > 0:
		say("%s needs a moment before it can use %s again." % [wait_u.c.name, R.DATA.MOVES[m].name])
		return
	var u := wait_u
	wait_u = {}
	u.atb = 0.0
	_act(u, m, 1.0)
	R.add_bond(u.c, 0.3)

# ---------------------------------------------------------------- the end: XP, level ups, the bond (endBattle)
func _end(r: String) -> void:
	if result != "":
		return
	result = r
	results.clear()
	if r in ["won", "caught"]:
		for c in caught:
			results.append("%s chose to come with you!" % c.name)
		if r == "won":
			results.append("You won!" if kind == "wild" else "You beat %s!" % trainer)
		var lv_sum := 0
		for u in foes: lv_sum += u.c.lvl
		for c in caught: lv_sum += c.lvl
		lv_sum = maxi(lv_sum, 3)
		var journey: Dictionary = R.DATA.JOURNEY.get("classic", { "xp": 1.0 })
		var base: float = lv_sum * 12.0 * (1.0 if kind == "wild" else 1.6) * float(journey.get("xp", 1.0))
		var avg := float(lv_sum) / maxf(1.0, foes.size() + caught.size())
		for u in allies:
			var scale := minf(1.2, pow(maxf(1.0, avg) / u.c.lvl, 2.0))
			var xp := roundi(base * (0.3 if u.c.hp <= 0 else 1.0) * scale)
			results.append("%s gained %d XP." % [u.c.name, xp])
			results.append_array(R.grow(u.c, xp, int(R.DATA.CAP_TABLE[0])))
			if u.c.hp > 0 and R.add_bond(u.c, 0.5 if kind == "wild" else 2.0):
				results.append("%s trusts you more: %s." % [u.c.name, R.BOND[R.bond_lvl(u.c)][0]])
	elif r == "lost":
		results.append("Your team is exhausted.")
	_go_to("results")

# ---------------------------------------------------------------- input: keys, mouse or touch
func _input(e: InputEvent) -> void:
	if not visible:
		return
	var key: int = e.keycode if e is InputEventKey and e.pressed and not e.echo else 0
	var click: bool = e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT
	if key == 0 and not click:
		return
	get_viewport().set_input_as_handled()
	var ok := key in [KEY_ENTER, KEY_KP_ENTER, KEY_SPACE, KEY_E]
	var back := key in [KEY_ESCAPE, KEY_BACKSPACE, KEY_Q]
	var p := get_local_mouse_position()
	match state:
		"choose":
			if click:
				for i in MENU.size():
					if _menu_rect(i).has_point(p): _choose(i)
			elif ok: _choose(menu_i)
			else: menu_i = _grid_move(menu_i, key, MENU.size(), 3)
		"capture":
			if ok or click: _calm()
		"moves":
			var mv := R.moves_of(wait_u.c)
			if click:
				var hit := false
				for i in mv.size():
					if _move_rect(i).has_point(p):
						hit = true
						if i == move_i: _use_move(mv[i])
						else: move_i = i
				if not hit: _go_to("choose")
			elif ok: _use_move(mv[move_i])
			elif back: _go_to("choose")
			else: move_i = _grid_move(move_i, key, mv.size(), 2)
		"beat":
			if ok or click: state_t = beat_t                 # skip ahead
		"results":
			if (ok or click) and state_t > 0.5: _go_to("fog_out")

func _grid_move(i: int, key: int, n: int, cols: int) -> int:
	match key:
		KEY_LEFT, KEY_A: i = i - 1 if i % cols > 0 else i
		KEY_RIGHT, KEY_D: i = i + 1 if i % cols < cols - 1 and i + 1 < n else i
		KEY_UP, KEY_W: i = i - cols if i >= cols else i
		KEY_DOWN, KEY_S: i = i + cols if i + cols < n else i
	return i

func _menu_rect(i: int) -> Rect2:
	return Rect2(244 + (i % 3) * 44, 170 + (i / 3) * 19, 41, 16)

func _move_rect(i: int) -> Rect2:
	return Rect2(14 + (i % 2) * 96, 170 + (i / 2) * 19, 92, 16)

## How good a move looks against the foe in front: power, type advantage and same-element bonus (the demo and the
## automated checks pick moves this way, as a sensible player would).
func best_value(m: String) -> float:
	var mv: Dictionary = R.DATA.MOVES[m]
	var foe: Dictionary = living("f")[0] if not living("f").is_empty() else {}
	if foe.is_empty() or not mv.kind in ["hit", "aoe"]:
		return 0.0
	var el = mv.get("el")
	return mv.pow * R.advantage(el, foe.c) * (1.2 if el != null and el == R.sp(wait_u.c).el else 1.0)

func _demo() -> void:
	# the recorded demo: pick the strongest ready move, read the results, carry on
	if state == "choose" and state_t > 0.8:
		var foe_hurt: bool = not living("f").is_empty() and float(living("f")[0].c.hp) < living("f")[0].st.hp * 0.6
		_choose(3 if kind == "wild" and foe_hurt and int(bag.get("lures", 0)) > 0 else 0)
	elif state == "capture" and absf(float(cap.pos) - float(cap.zone)) < 0.06:
		_calm()
	elif state == "moves" and state_t > 0.8:
		var mv := R.moves_of(wait_u.c).filter(func(m): return wait_u.cds.get(m, 0.0) <= 0)
		mv.sort_custom(func(a, b): return best_value(a) > best_value(b))
		_use_move(mv[0])
	elif state == "results" and state_t > 3.0:
		_go_to("fog_out")

# ---------------------------------------------------------------- drawing
func _text(s: String, at: Vector2, size: int, col: Color, width := -1.0, align := HORIZONTAL_ALIGNMENT_LEFT) -> void:
	draw_string(font, at, s, align if width > 0 else HORIZONTAL_ALIGNMENT_LEFT, width, size, col)

func _box(r: Rect2) -> void:
	draw_rect(r.grow(1), INK)
	draw_rect(r, PAPER)
	draw_rect(Rect2(r.position + Vector2(2, 2), r.size - Vector2(4, 4)), Color("e8dcc4"), false, 1.0)

func _spot(u: Dictionary) -> Vector2:
	# where a creature stands: yours close at the bottom left, the foe further off at the top right
	if u.side == "a":
		var k := allies.find(u)
		return Vector2(100 - k * 30, 158 - k * 10) if allies.size() > 1 else Vector2(100, 158)
	var i := foes.find(u)
	return Vector2(286 - i * 26, 92 - i * 4)

func _draw() -> void:
	if state == "off":
		return
	# the field: sky, a line of trees, grass (Ninja Adventure tiles), and the two platforms
	draw_rect(Rect2(0, 0, 384, 70), Color("a8d0ea"))
	draw_rect(Rect2(0, 44, 384, 26), Color("c8e0ea"))
	for x in range(-8, 392, 30):
		draw_texture_rect_region(nature_tex, Rect2(x, 38 + (x / 30) % 2 * 4, 32, 32), Rect2(0 if (x / 30) % 3 else 32, 0, 32, 32))
	for y in range(64, 216, 16):
		for x in range(0, 384, 16):
			draw_texture_rect_region(floor_tex, Rect2(x, y, 16, 16), Rect2(16 * (11 + (x * 7 + y * 3) % 5), 192, 16, 16))
	for side in ["f", "a"]:
		var c := Vector2(286, 94) if side == "f" else Vector2(100, 160)
		var rx := 50.0 if side == "f" else 62.0
		_ellipse(c, rx, rx * 0.22, Color(0.25, 0.4, 0.2, 0.55))
		_ellipse(c + Vector2(0, -1), rx - 4, rx * 0.22 - 3, Color(0.45, 0.65, 0.32, 0.6))
	# the creatures
	for u in foes + allies:
		if u.c.hp <= 0 and u.hit <= 0.0:
			continue
		var sc := 4.0 if u.side == "a" else 3.0
		var at := _spot(u)
		var dir := 1.0 if u.side == "a" else -1.0
		at.x += sin(clampf(u.lunge / 0.35, 0.0, 1.0) * PI) * 10.0 * dir
		if u.hit > 0.0:
			at.x += (2.0 if int(u.hit * 30.0) % 2 == 0 else -2.0)
			if int(u.hit * 20.0) % 2 == 0:
				continue                                          # a blink when hit (soft: no full-screen flash)
		var look: Dictionary = looks.get(u.c.sp, looks.get(R.sp(u.c).get("fam", ""), {}))
		if look.is_empty():
			look = { "kind": "wolf", "body": Color(R.sp(u.c).col), "belly": Color("f4e4c8"), "dark": Color("2a1a12") }
		var pose := { "wag": [1, 0, -1, 0][int(t * 6.0) % 4], "blink": fmod(t + at.x, 3.1) < 0.12, "ears_up": true,
			"crouch": 1 if u == wait_u else 0, "walking": u.lunge > 0.0, "frame": int(t * 12.0) % 4 }
		draw_set_transform(at - Vector2(9, 12) * sc, 0, Vector2(sc, sc))
		Figures.creature(self, Vector2.ZERO, u.side == "a", pose, look)
		draw_set_transform(Vector2.ZERO)
	for s in sparks:
		var c: Vector2 = _spot(s.u) + Vector2(0, -16)
		for k in 8:
			var a := k * TAU / 8.0
			var col: Color = s.col
			col.a = 1.0 - s.age / 0.6
			draw_rect(Rect2(c + Vector2(cos(a), sin(a)) * (4.0 + s.age * 40.0), Vector2(2, 2)), col)
	for f in floats:
		var c: Vector2 = _spot(f.u) + Vector2(0, -40 - f.age * 18.0)
		var col: Color = f.col
		col.a = 1.0 - maxf(0.0, f.age - 0.6) / 0.4
		_text(f.txt, c + Vector2(1, 1), 10, Color(0, 0, 0, col.a), 40, HORIZONTAL_ALIGNMENT_CENTER)
		_text(f.txt, c, 10, col, 40, HORIZONTAL_ALIGNMENT_CENTER)
	# health: the foe's box at the top left, yours beside your partner
	for i in foes.size():
		_info(foes[i], Rect2(10, 8 + i * 30, 150, 26), false)
	for i in allies.size():
		var top := 116.0 - (allies.size() - 1) * 38.0 + i * 38.0
		_info(allies[i], Rect2(222, top, 154, 36), true)
	_queue()
	if not tele.is_empty():
		_text("%s is gathering power! Guard!" % tele.u.c.name, Vector2(10, 70), 8, Color("c83a2a"))
	# the message box, and the commands on your turn
	_box(Rect2(8, 164, 368, 46))
	match state:
		"choose":
			_text("What will %s do?" % wait_u.c.name, Vector2(16, 180), 9, INK)
			_text("Orders: " + "●".repeat(int(orders)) + "○".repeat(3 - int(orders)) + "  (Guard 1, Rally 2)", Vector2(16, 198), 7, Color("6a5a4a"))
			for i in MENU.size():
				var r := _menu_rect(i)
				var on := i == menu_i
				draw_rect(r, INK if on else Color("e8dcc4"))
				var dim: bool = (MENU[i] == "Guard" and orders < 1) or (MENU[i] == "Rally" and orders < 2) or (MENU[i] in ["Run", "Bond"] and kind != "wild") or (MENU[i] == "Bond" and int(bag.get("lures", 0)) <= 0) or (MENU[i] == "Bag" and int(bag.get("berries", 0)) <= 0)
				_text(MENU[i], r.position + Vector2(0, 12), 8, (PAPER if on else INK) if not dim else Color("9a8a7a"), r.size.x, HORIZONTAL_ALIGNMENT_CENTER)
		"moves":
			var mv := R.moves_of(wait_u.c)
			for i in mv.size():
				var r := _move_rect(i)
				var on := i == move_i
				var m: Dictionary = R.DATA.MOVES[mv[i]]
				var resting: bool = wait_u.cds.get(mv[i], 0.0) > 0
				draw_rect(r, INK if on else Color("e8dcc4"))
				if m.get("el") != null:
					draw_rect(Rect2(r.position + Vector2(3, 5), Vector2(5, 6)), EL_COL.get(m.el, INK))
				_text(m.name, r.position + Vector2(11, 12), 8, (PAPER if on else INK) if not resting else Color("9a8a7a"))
			var sel: Dictionary = R.DATA.MOVES[mv[move_i]]
			var desc := R.move_info(mv[move_i])
			var info_r := Rect2(208, 166, 164, 42)
			draw_multiline_string(font, info_r.position + Vector2(4, 10), "%s: %s.%s" % [sel.name, desc,
				" Resting." if wait_u.cds.get(mv[move_i], 0.0) > 0 else ""], HORIZONTAL_ALIGNMENT_LEFT, info_r.size.x - 8, 7, -1, INK)
		"capture":
			_text("Calm %s: press when the marker is in the green." % cap.u.c.name, Vector2(16, 180), 8, INK)
			var bar := Rect2(16, 188, 352, 10)
			draw_rect(bar.grow(1), INK)
			draw_rect(bar, Color("d8ccb4"))
			draw_rect(Rect2(bar.position.x + bar.size.x * (cap.zone - 0.1), bar.position.y, bar.size.x * 0.2, bar.size.y), Color("9ad08a"))
			draw_rect(Rect2(bar.position.x + bar.size.x * (cap.zone - 0.04), bar.position.y, bar.size.x * 0.08, bar.size.y), Color("4aa84a"))
			draw_rect(Rect2(bar.position.x + bar.size.x * cap.pos - 1, bar.position.y - 3, 3, bar.size.y + 6), INK)
			_text("Lures left: %d" % int(bag.get("lures", 0)), Vector2(300, 180), 7, Color("6a5a4a"))
		"results":
			_box(Rect2(60, 30, 264, 124))
			_text("Battle results", Vector2(60, 48), 10, INK, 264, HORIZONTAL_ALIGNMENT_CENTER)
			var y := 64.0
			for line in results:
				draw_multiline_string(font, Vector2(76, y), line, HORIZONTAL_ALIGNMENT_LEFT, 232, 8, -1, INK)
				y += 13.0
			_text("Continue ▸", Vector2(60, 146), 8, Color("6a5a4a"), 264, HORIZONTAL_ALIGNMENT_CENTER)
			if not log_lines.is_empty():
				_text(log_lines[-1], Vector2(16, 182), 8, INK)
		_:
			var last := log_lines.slice(-2)
			for i in last.size():
				draw_multiline_string(font, Vector2(16, 180 + i * 14), last[i], HORIZONTAL_ALIGNMENT_LEFT, 352, 8, -1, INK if i == last.size() - 1 else Color("7a6a5a"))
	# the grey fog that rolls in at the start and out at the end (soft; never a flash)
	var fog := 0.0
	if state == "fog_in": fog = 1.0 - state_t
	elif state == "fog_out": fog = state_t
	if fog > 0.0:
		for k in 14:
			var cx := fmod(k * 61.0 + t * 30.0, 440.0) - 28.0
			var cy := fmod(k * 37.0, 230.0)
			draw_circle(Vector2(cx, cy), 60.0 + 30.0 * fog, Color(0.72, 0.74, 0.76, clampf(fog, 0.0, 1.0) * 0.5))
		draw_rect(Rect2(0, 0, 384, 216), Color(0.7, 0.72, 0.74, clampf(fog, 0.0, 1.0)))

func _ellipse(c: Vector2, rx: float, ry: float, col: Color) -> void:
	var pts := PackedVector2Array()
	for k in 24:
		var a := k * TAU / 24.0
		pts.append(c + Vector2(cos(a) * rx, sin(a) * ry))
	draw_colored_polygon(pts, col)

func _info(u: Dictionary, r: Rect2, mine: bool) -> void:
	_box(r)
	var s: Dictionary = R.sp(u.c)
	_text(u.c.name, r.position + Vector2(5, 10), 8, INK)
	_text("Lv %d" % u.c.lvl, r.position + Vector2(r.size.x - 34, 10), 8, INK, 30, HORIZONTAL_ALIGNMENT_RIGHT)
	draw_rect(Rect2(r.position + Vector2(5, 14), Vector2(4, 4)), EL_COL.get(s.el, INK))
	var bar := Rect2(r.position + Vector2(24, 14), Vector2(r.size.x - 30, 5))
	draw_rect(bar.grow(1), INK)
	draw_rect(bar, Color("4a3a3a"))
	var f := clampf(u.shown / u.st.hp, 0.0, 1.0)
	var col := Color("5cc85a") if f > 0.5 else (Color("e8c03a") if f > 0.2 else Color("e0503a"))
	draw_rect(Rect2(bar.position, Vector2(bar.size.x * f, bar.size.y)), col)
	_text("HP", r.position + Vector2(12, 19), 5, INK)
	if mine:
		_text("%d / %d" % [roundi(u.shown), u.st.hp], r.position + Vector2(24, 29), 7, INK)
		var xr := Rect2(r.position + Vector2(80, 25), Vector2(r.size.x - 86, 3))
		draw_rect(xr, Color("d8ccb4"))
		draw_rect(Rect2(xr.position, Vector2(xr.size.x * clampf(float(u.c.xp) / R.xp_need(u.c.lvl), 0.0, 1.0), xr.size.y)), Color("4a8ad8"))

func _queue() -> void:
	# who acts next: simulate the turn meters forward and list the next four turns
	var sim: Array = []
	for u in allies + foes:
		if u.c.hp > 0:
			sim.append({ "u": u, "atb": u.atb, "rate": maxf(0.01, R.atb_rate(u)) })
	if sim.is_empty():
		return
	var order: Array = []
	for n in 4:
		var best: Dictionary = sim[0]
		var best_t := INF
		for s in sim:
			var tt: float = (R.ACT_AT - s.atb) / s.rate
			if tt < best_t:
				best_t = tt
				best = s
		for s in sim:
			s.atb += best_t * s.rate
		best.atb = 0.0
		order.append(best.u)
	var x := 166.0
	_text("Next:", Vector2(x, 15), 7, INK)
	x += 26
	for u in order:
		var nm: String = u.c.name
		var w := font.get_string_size(nm, HORIZONTAL_ALIGNMENT_LEFT, -1, 7).x + 8
		draw_rect(Rect2(x, 7, w, 10), Color("2e5a8a") if u.side == "a" else Color("8a3a2e"))
		_text(nm, Vector2(x + 4, 15), 7, PAPER)
		x += w + 3

# ---------------------------------------------------------------- bonding with a wild creature (calmNow)
func _calm() -> void:
	var off := absf(float(cap.pos) - float(cap.zone))
	var q := "perfect" if off < 0.04 else ("good" if off < 0.1 else "miss")
	var u: Dictionary = cap.u
	var c: Dictionary = u.c
	var hp_pct: float = float(c.hp) / u.st.hp
	var base: float = 0.12 if R.sp(c).get("unique", false) else [0.55, 0.42, 0.3, 0.2, 0.1, 0.05][int(c.rar)]
	var ch: float = base * (1.5 - hp_pct) * (1.6 if q == "perfect" else (1.3 if q == "good" else 1.0))
	for a in allies:
		if "gentle" in a.c.traits:
			ch *= 1.15
			break
	cap = {}
	if rng.randf() < minf(0.95, ch):
		sparks.append({ "u": u, "col": Color("7cf08a"), "age": 0.0 })
		foes.erase(u)
		caught.append(c)
		say("%s%s trusts you. It chose to come with you!" % ["Perfect calm! " if q == "perfect" else ("Nicely done. " if q == "good" else ""), c.name])
		if living("f").is_empty():
			_end("caught")
			return
	else:
		say("%s%s broke free!" % ["It shies away. " if q == "miss" else "", c.name])
	_go_to("choose" if not wait_u.is_empty() else "run")
