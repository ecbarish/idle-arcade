extends Node2D
## Starfall: the guild's frontier town (first slice of docs/plans/starfall-village.md). You are the guildmaster.
## Walk the town (arrows or WASD, or click and tap to walk; Enter, Space or E to talk and use things). Pin bounties to
## the guild board; your adventurers choose for themselves, head out through the east gate, and come home with loot
## and bruises. Serve them a hot meal at the inn's counter yourself, until Bryn offers to take the counter over.
## Hurt adventurers rest at the inn until they're well. Nobody dies here; a bad job means a long rest.

const Figures := preload("res://scripts/figures.gd")
const FLOOR := preload("res://assets/env/floor.png")
const NATURE := preload("res://assets/env/nature.png")
const HOUSE := preload("res://assets/env/house.png")
const TILE := 16
const HALL_SPRITE := Rect2(400, 224, 64, 80)   # the big timber hall in house.png (4x5 tiles, door in the 2nd column)

# the town: T trees, , grass, f flowers, . path, r roof, # wall, D door, c the inn's counter, B the guild board, E the gate
const MAP := [
	"TTTTTTTTTTTTTTTTTTTTTTTT",
	"T,,,,,,f,,,,,,,,,,,,,,,T",
	"T,rrrrr,,,,,,,,,rrrrr,,T",
	"T,rrrrr,,,,,,,,,rrrrr,,T",
	"T,##D##,,,,,,,,,##D##,,T",
	"T,,,.,,,,,,,,,,,,,.,,,,T",
	"T,,c.,,,,B,,,,,,,,.,,,,T",
	"T,,,...................E",
	"T,f,,,,,,,..,,,,,,.....E",
	"T,,,,,,,,,..,,,,,,,,,f,T",
	"T,,,,,,,,,..,,,,,,,,,,,T",
	"T,,f,,,,,,..,,,,,,,f,,,T",
	"T,,,,,,,,,,,,,,,,,,,,,,T",
	"TTTTTTTTTTTTTTTTTTTTTTTT",
]
const SOLID := "Trc#BD"
const INN_DOOR := Vector2i(4, 4)
const HALL_DOOR := Vector2i(18, 4)
const COUNTER := Vector2i(3, 6)
const SERVE_AT := Vector2i(2, 6)          # behind the counter
const ORDER_AT := Vector2i(4, 6)          # where a hungry adventurer waits
const BOARD := Vector2i(9, 6)
const READ_AT := Vector2i(9, 7)           # in front of the board
const GATE := Vector2i(23, 7)
const INN_STEP := Vector2i(4, 5)          # the inn's doorstep
const BRYN_HOME := Vector2i(6, 5)
const TOWN_AREA := Rect2i(6, 8, 11, 4)    # where adventurers potter about between jobs
const DAY_SECONDS := 150.0
const MEAL := 8
const WAGE := 10
const HIRE_AFTER := 10                     # meals you serve yourself before Bryn offers to take over
const PATIENCE := 22.0                     # how long a hungry adventurer waits at the counter
const MAX_POSTED := 2

## Classes from the browser Starfall Guild (games/starfall-guild/js/00-data.js).
const CLASSES := {
	"swordsman": { "name": "Swordsman", "atk": 10, "hp": 60, "col": "3a6fd8" },
	"knight": { "name": "Knight", "atk": 6, "hp": 115, "col": "6b7a90" },
	"mage": { "name": "Mage", "atk": 17, "hp": 34, "col": "8b5cf6" },
	"archer": { "name": "Archer", "atk": 12, "hp": 44, "col": "3fa66b" },
	"cleric": { "name": "Cleric", "atk": 4, "hp": 52, "col": "d9a21b" },
	"thief": { "name": "Thief", "atk": 8, "hp": 46, "col": "c2412f" },
	"monk": { "name": "Monk", "atk": 11, "hp": 72, "col": "e07a2e" },
}
const HAIR := ["ff8fb1", "5b8def", "d8dde6", "e0483e", "2b2b3a", "f7d046", "59c38a", "9b6bd6", "f08a3c", "7a4a2a"]
## Jobs townsfolk bring to the guild. danger 1-4; time is how long the trip takes (seconds of game time).
const JOBS := [
	{ "id": "slimes", "name": "Slimes in the Creek", "danger": 1, "reward": 30, "time": 18.0,
		"text": "The miller's ducks won't go near the creek. Something wobbly lives there now." },
	{ "id": "boar", "name": "A Bad-Tempered Boar", "danger": 1, "reward": 26, "time": 16.0,
		"text": "It has eaten half the turnips and chased the farmer up a tree." },
	{ "id": "wolves", "name": "Wolves on the North Road", "danger": 2, "reward": 55, "time": 26.0,
		"text": "Carters say a pack follows the wagons at dusk, closer every night." },
	{ "id": "webs", "name": "Webs Over the Forest Path", "danger": 2, "reward": 60, "time": 26.0,
		"text": "The woodcutters' path is strung with webs as thick as rope." },
	{ "id": "bandits", "name": "A Bandits' Hideout", "danger": 3, "reward": 95, "time": 34.0,
		"text": "Someone has been raiding the farms. The tracks lead into the old quarry." },
	{ "id": "barrow", "name": "Lights in the Old Barrow", "danger": 4, "reward": 140, "time": 42.0,
		"text": "Lantern light where no one should be, and a cold wind from the hill." },
]
const DANGER_WORD := ["", "Easy", "Risky", "Dangerous", "Deadly"]

class Mover:
	var id := ""
	var where := "town"                    # town, inside (resting at the inn), away (out on a job)
	var tile := Vector2i.ZERO
	var pos := Vector2.ZERO
	var path: Array[Vector2i] = []
	var speed := 3.5
	var face := Vector2i.DOWN
	var step_t := 0.0
	var look: Dictionary = {}
	var a: Dictionary = {}                  # adventurers: name, cls, lvl, xp, hp, max, morale, state, job, timer
	func _init(i: String, t: Vector2i) -> void:
		id = i
		tile = t
		pos = Vector2(t) * 16.0

var me := Mover.new("me", Vector2i(11, 9))
var bryn := Mover.new("bryn", BRYN_HOME)
var heroes: Array[Mover] = []
var coins := 100
var day := 1
var day_t := 0.0
var meals := 0                              # served by hand, all time
var hired := false
var bryn_offered := false
var notices: Array = []                     # today's job notices on the board (ids)
var posted: Array = []                      # notices you've pinned up for the adventurers (ids)
var today := { "done": 0, "failed": 0, "meals": 0, "earned": 0 }
var queue: Array[Mover] = []                # hungry adventurers waiting at the counter, first in front
var serve_t := 0.0                          # Bryn's serving time for the customer in front
var lines: Array = []                       # conversation: [{who, text}]
var barks: Array = []                       # short things people say as they pass: [{m, text, t}]
var then_do := Callable()
var walk_to: Array[Vector2i] = []
var use_after := ""                         # walking somewhere you tapped, to use it on arrival: board, counter
var rng := RandomNumberGenerator.new()
var t := 0.0
var no_save := false
var save_path := "user://starfall.json"
var save_t := 0.0
var board_open := false
var board_sel := 0

var cam: Camera2D
var ui: CanvasLayer
var status: Label
var caption: Label
var caption_t := 0.0
var bubble: PanelContainer
var bubble_text: Label
var board_view: Control

const LOOKS := {
	"me": { "skin": "e8b48a", "hair": "3a2a22", "shirt": "2f5e78", "legs": "3a3040", "style": "short" },
	"bryn": { "skin": "f1c9a0", "hair": "b8642e", "shirt": "e8e0d0", "apron": "7a5236", "legs": "5a4636", "style": "ponytail", "body": "narrow" },
}

func _ready() -> void:
	rng.randomize()
	if "--no-save" in OS.get_cmdline_user_args():
		no_save = true                           # recordings and tries never touch the real town (-- --no-save)
	cam = Camera2D.new()
	cam.limit_left = 0
	cam.limit_top = 0
	cam.limit_right = MAP[0].length() * TILE
	cam.limit_bottom = MAP.size() * TILE
	cam.position_smoothing_enabled = true
	add_child(cam)
	_make_ui()
	if not _load():
		_new_town()
	cam.position = me.pos + Vector2(8, 8)
	cam.reset_smoothing()

func _new_town() -> void:
	heroes.clear()
	var starts := [["Aki", "swordsman", 2], ["Ren", "mage", 1], ["Yuna", "cleric", 1]]
	for i in starts.size():
		var s: Array = starts[i]
		var m := Mover.new("hero%d" % i, TOWN_AREA.position + Vector2i(i * 3 + 1, i % 2))
		var c: Dictionary = CLASSES[s[1]]
		var mx := int(c.hp * (1.0 + 0.2 * (s[2] - 1)))
		m.a = { "name": s[0], "cls": s[1], "lvl": s[2], "xp": 0, "hp": mx, "max": mx, "morale": 6, "state": "town", "job": "", "timer": 2.0 + i * 3.0, "hair": HAIR[(i * 4 + 1) % HAIR.size()] }
		_dress(m)
		heroes.append(m)
	_new_notices()
	say("", "Starfall: the Guild Hall, the Lantern Inn and a gate to the wilds. The town is small. It's yours to grow.")
	say("bryn", "Morning, guildmaster! The board's full of requests from the farms. Pin one up and your adventurers will pick it.")
	say("bryn", "And when they come back hungry, the counter outside the inn is yours. Nobody else in this town can cook.")

func _dress(m: Mover) -> void:
	var c: Dictionary = CLASSES[m.a.cls]
	var styles := ["short", "long", "ponytail", "spiky", "bun"]
	m.look = { "skin": ["f1c9a0", "e8b48a", "c88a64", "8a5a3e"][m.a.name.length() % 4], "hair": m.a.hair, "shirt": c.col,
		"legs": Color(c.col).darkened(0.45).to_html(false), "style": styles[m.a.name.length() % styles.size()] }

func _new_notices() -> void:
	var ids: Array = JOBS.map(func(j): return j.id)
	ids.shuffle()
	notices = ids.slice(0, 3)
	posted = posted.filter(func(p): return p in notices)

# ---------------------------------------------------------------- the map
func tile_at(p: Vector2i) -> String:
	if p.y < 0 or p.y >= MAP.size() or p.x < 0 or p.x >= MAP[0].length():
		return "T"
	return MAP[p.y][p.x]

func walkable(p: Vector2i, who: Mover = null) -> bool:
	if tile_at(p) in SOLID:
		return false
	for m in people():
		if m != who and m.where == "town" and (m.tile == p or (not m.path.is_empty() and m.path[0] == p)):
			return false
	return true

func people() -> Array[Mover]:
	var out: Array[Mover] = [me, bryn]
	out.append_array(heroes)
	return out

## Shortest walk on the grid; people in the way are walked around unless they're the goal.
func route(from: Vector2i, to: Vector2i, who: Mover = null) -> Array[Vector2i]:
	var prev := { from: from }
	var q: Array[Vector2i] = [from]
	while not q.is_empty():
		var c: Vector2i = q.pop_front()
		if c == to:
			break
		for d in [Vector2i.UP, Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT]:
			var n: Vector2i = c + d
			if prev.has(n) or tile_at(n) in SOLID:
				continue
			if n != to and _standing(n, who):
				continue
			prev[n] = c
			q.append(n)
	var out: Array[Vector2i] = []
	if not prev.has(to):
		return out
	var c2: Vector2i = to
	while c2 != from:
		out.push_front(c2)
		c2 = prev[c2]
	return out

func _standing(p: Vector2i, who: Mover) -> bool:
	for m in people():
		if m != who and m.where == "town" and m.tile == p and m.path.is_empty():
			return true                              # (you included: people walk around the guildmaster)
	return false

func send(m: Mover, to: Vector2i) -> bool:
	m.path = route(m.tile, to, m)
	return not m.path.is_empty() or m.tile == to

# ---------------------------------------------------------------- the loop
func _process(dt: float) -> void:
	t += dt
	_day(dt)
	_player(dt)
	for h in heroes:
		_hero(h, dt)
	_bryn(dt)
	_counter(dt)
	for m in people():
		_walk(m, dt)
	for b in barks:
		b.t -= dt
	barks = barks.filter(func(b): return b.t > 0.0)
	caption_t = maxf(0.0, caption_t - dt)
	_autosave(dt)
	_update_ui()
	cam.position = me.pos + Vector2(8, 8)
	queue_redraw()

func _walk(m: Mover, dt: float) -> void:
	if m.path.is_empty() or m.where != "town":
		return
	var nxt: Vector2i = m.path[0]
	if m != me and _blocked_by_other(nxt, m):
		m.path.clear()                           # someone's in the way: stop, and find another way in a moment
		return
	var goal := Vector2(nxt) * TILE
	m.face = nxt - m.tile
	m.pos = m.pos.move_toward(goal, dt * m.speed * TILE)
	m.step_t += dt
	if m.pos.distance_to(goal) < 0.01:
		m.tile = nxt
		m.path.pop_front()
		if m == me:
			_arrived()

func _blocked_by_other(p: Vector2i, who: Mover) -> bool:
	for m in people():
		if m != who and m.where == "town" and m.tile == p and m.path.is_empty():
			return true
	return false

# ---------------------------------------------------------------- you
func _player(_dt: float) -> void:
	if board_open or not lines.is_empty() or not me.path.is_empty() or me.pos.distance_to(Vector2(me.tile) * TILE) > 0.5:
		return
	var d := Vector2i.ZERO
	if Input.is_action_pressed("ui_up") or Input.is_physical_key_pressed(KEY_W): d = Vector2i.UP
	elif Input.is_action_pressed("ui_down") or Input.is_physical_key_pressed(KEY_S): d = Vector2i.DOWN
	elif Input.is_action_pressed("ui_left") or Input.is_physical_key_pressed(KEY_A): d = Vector2i.LEFT
	elif Input.is_action_pressed("ui_right") or Input.is_physical_key_pressed(KEY_D): d = Vector2i.RIGHT
	if d != Vector2i.ZERO:
		walk_to.clear()
		use_after = ""
		step(d)
	elif not walk_to.is_empty():
		var nxt: Vector2i = walk_to.pop_front()
		if walkable(nxt, me):
			step(nxt - me.tile)
		else:
			walk_to.clear()

func step(d: Vector2i) -> void:
	me.face = d
	var to := me.tile + d
	if to == GATE or tile_at(to) == "E":
		say("", "The wilds start past the gate. Your adventurers go out there; a guildmaster's place is in town.")
		return
	if to == INN_DOOR:
		say("", "The Lantern Inn. Your adventurers sleep upstairs when they're hurt or tired. The counter outside is yours to run.")
		return
	if to == HALL_DOOR:
		say("", "The Guild Hall. The carpenters are still fixing the roof; the board outside is where the work is.")
		return
	if walkable(to, me):
		me.path = [to]

func _arrived() -> void:
	if walk_to.is_empty() and use_after != "":
		var what := use_after
		use_after = ""
		if what == "board":
			me.face = BOARD - me.tile
			open_board()
		elif what == "counter":
			me.face = Vector2i.RIGHT
			use()

## Enter, Space or E: talk to whoever is beside you, read the board, or serve at the counter.
func use() -> bool:
	if me.tile == SERVE_AT and not queue.is_empty() and queue[0].tile == ORDER_AT and not hired:
		serve(queue[0], true)
		return true
	if (me.tile - BOARD).length() <= 1.01:
		open_board()
		return true
	if (me.tile - bryn.tile).length() <= 1.01:
		talk_bryn()
		return true
	for h in heroes:
		if h.where == "town" and (me.tile - h.tile).length() <= 1.01:
			talk_hero(h)
			return true
	if (me.tile - COUNTER).length() <= 1.01:
		if hired:
			say("bryn", "I've got the counter, guildmaster. Go and see to the board.")
		elif me.tile != SERVE_AT:
			say("", "The inn's counter. Step round behind it to serve whoever's waiting.")
		else:
			say("", "Nobody's waiting. The stew keeps warm.")
		return true
	return false

func _unhandled_input(e: InputEvent) -> void:
	if board_open:
		_board_input(e)
		get_viewport().set_input_as_handled()
		return
	var pressed: bool = e.is_action_pressed("ui_accept") or (e is InputEventKey and e.pressed and not e.echo and e.physical_keycode == KEY_E)
	if pressed:
		if not lines.is_empty():
			advance()
		else:
			use()
		get_viewport().set_input_as_handled()
	elif e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT:
		if not lines.is_empty():
			advance()
		else:
			tap(get_global_mouse_position())
		get_viewport().set_input_as_handled()

## Click or tap: walk there. Tap the board or the counter to walk up and use it; tap a person to go and talk.
func tap(at: Vector2) -> void:
	var goal := Vector2i((at / TILE).floor())
	use_after = ""
	if goal == BOARD:
		use_after = "board"
		goal = READ_AT
	elif goal == COUNTER:
		use_after = "counter"
		goal = SERVE_AT
	if goal == me.tile:
		_arrived()
		return
	walk_to = route(me.tile, goal, me)
	if walk_to.is_empty():
		use_after = ""

# ---------------------------------------------------------------- the adventurers
## Each adventurer decides for themselves: rest when hurt, eat when they come home, and take a posted job if it suits
## their level and their nerve. A bold adventurer may take a job a step too hard for them.
func _hero(h: Mover, dt: float) -> void:
	var a: Dictionary = h.a
	a.timer = float(a.timer) - dt
	match a.state:
		"town":
			if a.timer > 0.0 or not h.path.is_empty():
				return
			a.timer = rng.randf_range(2.5, 5.0)
			var job := _pick_job(h)
			if job != "":
				a.job = job
				posted.erase(job)
				a.state = "to_board"
				send(h, READ_AT)
			elif rng.randf() < 0.6:
				var to := TOWN_AREA.position + Vector2i(rng.randi() % TOWN_AREA.size.x, rng.randi() % TOWN_AREA.size.y)
				if walkable(to, h):
					send(h, to)
		"to_board":
			if h.path.is_empty() and h.tile != READ_AT and a.timer <= 0.0:
				a.timer = 1.0
				send(h, READ_AT)                     # try again if someone was in the way
			elif h.tile == READ_AT and h.path.is_empty():
				var j := job_of(a.job)
				bark(h, "%s? I'll take it." % j.name)
				a.state = "leaving"
				send(h, GATE + Vector2i.LEFT)
		"leaving":
			if h.path.is_empty():
				if h.tile == GATE + Vector2i.LEFT:
					h.where = "away"
					a.state = "away"
					a.timer = float(job_of(a.job).time)
				elif a.timer <= 0.0:
					a.timer = 1.0
					send(h, GATE + Vector2i.LEFT)
		"away":
			if a.timer <= 0.0:
				_come_home(h)
		"to_counter":
			if h.path.is_empty() and a.timer <= 0.0:
				a.timer = 0.6
				var spot := _queue_spot(h)
				if h.tile != spot:
					send(h, spot)
		"resting":
			if a.timer <= 0.0:
				a.timer = 1.5                        # a little better every moment in bed
				a.hp = mini(int(a.max), int(a.hp) + int(ceil(float(a.max) * 0.05)))
			if int(a.hp) >= int(a.max):
				h.where = "town"
				h.tile = INN_STEP
				h.pos = Vector2(INN_STEP) * TILE
				a.state = "town"
				a.timer = 1.0
				bark(h, ["Good as new.", "That bed is a miracle.", "Right. What's on the board?"][rng.randi() % 3])
				send(h, INN_STEP + Vector2i(3, 2))
		"to_rest":
			if h.path.is_empty():
				if h.tile == INN_STEP:
					h.where = "inside"
					a.state = "resting"
					a.timer = 1.5
				elif a.timer <= 0.0:
					a.timer = 1.0
					send(h, INN_STEP)

func _pick_job(h: Mover) -> String:
	var a: Dictionary = h.a
	if float(a.hp) < float(a.max) * 0.7 or int(a.morale) < 3:
		return ""
	var nerve := int(a.lvl) + (1 if int(a.morale) >= 8 else 0)
	var best := ""
	var best_reward := -1
	for id in posted:
		var j := job_of(id)
		if int(j.danger) <= nerve and int(j.reward) > best_reward:
			best = id
			best_reward = int(j.reward)
	return best

func job_of(id: String) -> Dictionary:
	for j in JOBS:
		if j.id == id:
			return j
	return JOBS[0]

## A job's outcome: a fair chance from level and spirits against danger. Hurt either way; worse if it went badly.
## Nobody dies: a disastrous job leaves an adventurer at the edge, carried home for a long rest.
func _come_home(h: Mover) -> void:
	var a: Dictionary = h.a
	var j := job_of(a.job)
	var danger := int(j.danger)
	var chance := clampf(0.55 + (int(a.lvl) - danger) * 0.18 + (int(a.morale) - 5) * 0.03, 0.08, 0.95)
	var won := rng.randf() < chance
	var hurt := int(float(a.max) * danger * rng.randf_range(0.08, 0.2) * (1.0 if won else 1.8))
	a.hp = maxi(1, int(a.hp) - hurt)
	h.where = "town"
	h.tile = GATE + Vector2i.LEFT
	h.pos = Vector2(h.tile) * TILE
	h.path.clear()
	if won:
		var cut := int(round(int(j.reward) * 0.3))      # the guild's share of the reward
		coins += cut
		today.done += 1
		today.earned += cut
		a.morale = mini(10, int(a.morale) + 1)
		a.xp = int(a.xp) + danger * 10
		if int(a.xp) >= int(a.lvl) * 20:
			a.xp = int(a.xp) - int(a.lvl) * 20
			a.lvl = int(a.lvl) + 1
			a.max = int(float(CLASSES[a.cls].hp) * (1.0 + 0.2 * (int(a.lvl) - 1)))
			bark(h, "Back! And I think I've got stronger. Level %d!" % a.lvl)
		else:
			bark(h, ["Done! The farmers can sleep tonight.", "Job's finished. I need food.", "Back in one piece. Mostly."][rng.randi() % 3])
	else:
		today.failed += 1
		a.morale = maxi(0, int(a.morale) - 2)
		bark(h, "It went badly. I couldn't finish it." if int(a.hp) > 1 else "...")
	if int(a.hp) <= 1:
		# news, not an interruption: a line at the foot of the screen
		caption.text = "%s is carried in through the gate by a passing carter, bruised all over. Nothing a long rest can't mend." % a.name
		caption_t = 7.0
	a.job = ""
	a.state = "to_counter"
	a.timer = 0.0
	a.waited = 0.0
	queue.append(h)

func _queue_spot(h: Mover) -> Vector2i:
	var i := queue.find(h)
	if i <= 0:
		return ORDER_AT
	return ORDER_AT + Vector2i(i, 1)                # the line forms along the path

func badly_hurt(h: Mover) -> bool:
	return float(h.a.hp) < float(h.a.max) * 0.3

# ---------------------------------------------------------------- the counter: you serve, or Bryn does
func _counter(dt: float) -> void:
	if queue.is_empty():
		return
	var h: Mover = queue[0]
	if h.tile != ORDER_AT or not h.path.is_empty():
		return
	h.face = Vector2i.LEFT
	h.a.waited = float(h.a.get("waited", 0.0)) + dt
	if hired and bryn.tile == SERVE_AT and bryn.path.is_empty():
		serve_t += dt
		if serve_t >= 2.5:
			serve_t = 0.0
			serve(h, false)
		return
	if float(h.a.waited) > PATIENCE:
		h.a.morale = maxi(0, int(h.a.morale) - 1)
		bark(h, "Nobody's cooking? Fine. Dry bread it is.")
		_to_bed(h)

func serve(h: Mover, by_hand: bool) -> void:
	coins += MEAL
	today.meals += 1
	today.earned += MEAL
	if by_hand:
		meals += 1
	h.a.morale = mini(10, int(h.a.morale) + 1)
	if by_hand:
		bark(h, ["That smells wonderful.", "Thank you, guildmaster!", "Just what I needed."][rng.randi() % 3])
	else:
		bark(bryn, ["Here you go. Mind, it's hot.", "One stew!", "Eat up."][rng.randi() % 3])
	_to_bed(h)
	if by_hand and meals >= HIRE_AFTER and not hired and not bryn_offered:
		bryn_offered = true
		bark(bryn, "Guildmaster! Have you got a minute?")

func _to_bed(h: Mover) -> void:
	queue.erase(h)
	h.a.state = "to_rest"
	h.a.timer = 0.0
	send(h, INN_STEP)

# ---------------------------------------------------------------- Bryn: the inn's cook, and later your barkeep
func _bryn(_dt: float) -> void:
	var home := SERVE_AT if hired else BRYN_HOME
	if bryn.path.is_empty() and bryn.tile != home:
		send(bryn, home)
	if bryn.path.is_empty() and bryn.tile == home:
		bryn.face = Vector2i.RIGHT if hired else Vector2i.DOWN

func talk_bryn() -> void:
	bryn.face = me.tile - bryn.tile
	if hired:
		say("bryn", ["The stew's holding up. So am I, mostly.", "Aki eats like three people. I'm not complaining; you're paying.",
			"If the wages stop, so does the stew. Just so we understand each other."][rng.randi() % 3])
		return
	if meals >= HIRE_AFTER:
		say("bryn", "I've been watching you run that counter. You're good at it, but you've a whole guild to look after.")
		say("bryn", "Let me take it. Ten coins a day and I'll feed everyone who comes through that gate, rain or shine.")
		then_do = func():
			hired = true
			say("", "Bryn ties on an apron and takes the counter. From now on she serves the meals, for ten coins at the end of each day.")
		return
	say("bryn", ["Hungry adventurers come straight to the counter. Don't keep them waiting; they get grumpy.",
		"Stand behind the counter when someone's waiting, and serve them. Eight coins a bowl.",
		"Hurt ones go up to bed after they've eaten. A night or two and they're right as rain."][rng.randi() % 3])

func talk_hero(h: Mover) -> void:
	var a: Dictionary = h.a
	h.face = me.tile - h.tile
	var cls: String = CLASSES[a.cls].name
	var mood := "keen for work" if int(a.morale) >= 7 else ("steady" if int(a.morale) >= 4 else "low on heart")
	var body := "fit and well" if float(a.hp) >= float(a.max) * 0.95 else ("a bit bruised" if not badly_hurt(h) else "badly hurt")
	say(a.name, "%s, level %d. Feeling %s, and %s." % [cls, a.lvl, body, mood])
	if posted.is_empty():
		say(a.name, "Nothing on the board that I've seen. Pin something up and I'll have a look.")
	elif _pick_job(h) == "" and float(a.hp) >= float(a.max) * 0.7 and int(a.morale) >= 3:
		say(a.name, "What's on the board is a bit much for me right now. Something easier, maybe?")

# ---------------------------------------------------------------- the end of a day: wages and a short report
func _day(dt: float) -> void:
	day_t += dt
	if day_t < DAY_SECONDS:
		return
	day_t = 0.0
	var report := "Evening falls on day %d. Jobs done: %d" % [day, today.done]
	if int(today.failed) > 0:
		report += ", gone badly: %d" % today.failed
	report += ". Meals served: %d. The guild earned %d coins." % [today.meals, today.earned]
	if hired:
		if coins >= WAGE:
			coins -= WAGE
			report += " Bryn's wages paid."
		else:
			hired = false
			bryn_offered = false
			meals = HIRE_AFTER - 3
			report += " You couldn't pay Bryn, so she's gone back to her own kitchen."
	caption.text = report
	caption_t = 9.0
	day += 1
	today = { "done": 0, "failed": 0, "meals": 0, "earned": 0 }
	_new_notices()

# ---------------------------------------------------------------- conversations and passing remarks
func say(who: String, text: String) -> void:
	lines.append({ "who": who, "text": text })

func advance() -> void:
	if lines.is_empty():
		return
	lines.pop_front()
	if lines.is_empty() and then_do.is_valid():
		var f := then_do
		then_do = Callable()
		f.call()

func bark(m: Mover, text: String) -> void:
	barks = barks.filter(func(b): return b.m != m)
	barks.append({ "m": m, "text": text, "t": 3.0 })

func speaker(who: String) -> Mover:
	if who == "bryn":
		return bryn
	for h in heroes:
		if h.a.name == who and h.where == "town":
			return h
	return null

# ---------------------------------------------------------------- the guild board
func open_board() -> void:
	board_open = true
	board_sel = 0
	walk_to.clear()

func _board_input(e: InputEvent) -> void:
	var n := notices.size() + 1                 # the notices, then "Done"
	if e is InputEventKey and e.pressed and not e.echo:
		match e.keycode:
			KEY_UP, KEY_W, KEY_LEFT, KEY_A: board_sel = (board_sel + n - 1) % n
			KEY_DOWN, KEY_S, KEY_RIGHT, KEY_D, KEY_TAB: board_sel = (board_sel + 1) % n
			KEY_ENTER, KEY_KP_ENTER, KEY_SPACE, KEY_E: board_pick(board_sel)
			KEY_ESCAPE, KEY_BACKSPACE: board_open = false
	elif e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT:
		var p: Vector2 = board_view.get_local_mouse_position()
		for i in n:
			if _note_rect(i).has_point(p):
				board_pick(i)

## Pin a notice up (adventurers will see it) or take it down again; the last choice closes the board.
func board_pick(i: int) -> void:
	if i >= notices.size():
		board_open = false
		return
	var id: String = notices[i]
	if id in posted:
		posted.erase(id)
	elif posted.size() < MAX_POSTED:
		posted.append(id)
	board_sel = i

func _note_rect(i: int) -> Rect2:
	if i >= notices.size():
		return Rect2(158, 186, 68, 16)
	return Rect2(42 + i * 102, 46, 96, 120)

# ---------------------------------------------------------------- drawing the town
func _tex(tex: Texture2D, cell: Vector2i, size: Vector2i, at: Vector2) -> void:
	draw_texture_rect_region(tex, Rect2(at, Vector2(size) * 16.0), Rect2(Vector2(cell) * 16.0, Vector2(size) * 16.0))

func _is_path(x: int, y: int) -> bool:
	return tile_at(Vector2i(x, y)) in ".E"

func _draw() -> void:
	for y in MAP.size():
		for x in MAP[0].length():
			_ground(x, y, MAP[y][x])
	# the inn (a cottage), the Guild Hall (the big timber hall) and the trees
	_tex(HOUSE, Vector2i(0, 0), Vector2i(4, 3), Vector2(INN_DOOR.x - 1, INN_DOOR.y - 2) * TILE)
	draw_texture_rect_region(HOUSE, Rect2(Vector2(HALL_DOOR.x - 1, HALL_DOOR.y - 4) * TILE, HALL_SPRITE.size), HALL_SPRITE)
	_inn_sign()
	_counter_draw()
	_board_draw()
	for y in MAP.size():
		for x in MAP[0].length():
			if MAP[y][x] == "T" and (x + y) % 2 == 0:
				_tex(NATURE, Vector2i(0 if (x * 3 + y) % 4 < 2 else 2, 0), Vector2i(2, 2), Vector2(x - 0.5, y - (1.5 if tile_at(Vector2i(x, y - 1)) == "T" else 0.25)) * TILE)
	_gate_draw()
	var list := people().filter(func(m): return m.where == "town")
	list.sort_custom(func(a, b): return a.pos.y < b.pos.y)
	for i in list.size():
		var m: Mover = list[i]
		draw_rect(Rect2(m.pos + Vector2(3, 14), Vector2(10, 2)), Color(0, 0, 0, 0.25))
		var look := _look(m)
		var walking := not m.path.is_empty()
		Figures.person(self, m.pos + Vector2(2, -5), m.face, walking, int(m.step_t * 8.0) % 4, fmod(t + i * 1.7, 3.3) < 0.12, look)
		if not m.a.is_empty() and badly_hurt(m):
			draw_rect(Rect2(m.pos + Vector2(4, -3), Vector2(8, 2)), Color("f4f0e8"))      # a bandage round the head
	_lit_windows()

func _look(m: Mover) -> Dictionary:
	var src: Dictionary = LOOKS.get(m.id, m.look)
	var out := {}
	for k in src:
		out[k] = Color(src[k]) if k in ["skin", "hair", "hat", "shirt", "legs", "shoes", "apron"] else src[k]
	return out

func _ground(x: int, y: int, ch: String) -> void:
	var o := Vector2(x, y) * TILE
	var n := (x * 7 + y * 13) % 9
	_tex(FLOOR, Vector2i(11 + (n if n < 5 else 0), 12), Vector2i.ONE, o)
	if _is_path(x, y):
		var up := _is_path(x, y - 1); var down := _is_path(x, y + 1); var left := _is_path(x - 1, y); var right := _is_path(x + 1, y)
		var cell := Vector2i(12, 8)
		if (up or down) and (left or right):
			cell = Vector2i(11 if not left else (13 if not right else 12), 7 if not up else (9 if not down else 8))
		_tex(FLOOR, cell, Vector2i.ONE, o)
	elif ch == "f":
		_tex(NATURE, [Vector2i(0, 11), Vector2i(3, 11), Vector2i(6, 11)][n % 3], Vector2i.ONE, o)
	elif ch == "T":
		_tex(NATURE, Vector2i(1, 10), Vector2i.ONE, o)
	elif ch in "r#":
		_tex(NATURE, Vector2i(0, 10), Vector2i.ONE, o)                 # garden bushes; the buildings stand over them

func _counter_draw() -> void:
	# a plank counter under a striped awning, a pot of stew steaming on it
	var o := Vector2(COUNTER) * TILE
	draw_rect(Rect2(o + Vector2(-1, -9), Vector2(18, 4)), Figures.OUTLINE)
	for k in 4:
		draw_rect(Rect2(o + Vector2(k * 4, -8), Vector2(4, 2)), Color("c84a3a") if k % 2 == 0 else Color("f2e6c8"))
	draw_rect(Rect2(o + Vector2(0, -6), Vector2(1, 10)), Color("6b4a2a"))
	draw_rect(Rect2(o + Vector2(15, -6), Vector2(1, 10)), Color("6b4a2a"))
	draw_rect(Rect2(o + Vector2(-1, 3), Vector2(18, 10)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(0, 4), Vector2(16, 8)), Color("a0703a"))
	draw_rect(Rect2(o + Vector2(0, 4), Vector2(16, 2)), Color("c8925a"))
	draw_rect(Rect2(o + Vector2(5, 0), Vector2(6, 4)), Color("3a3a40"))                # the pot
	draw_rect(Rect2(o + Vector2(6, 0), Vector2(4, 1)), Color("d8a050"))
	for k in 2:
		var ph := fmod(t * 0.5 + k * 0.5, 1.0)
		draw_circle(o + Vector2(8 + sin(t * 2.0 + k) * 2.0, -ph * 10.0), 1.5 + ph * 2.0, Color(1, 1, 1, 0.35 * (1.0 - ph)))

func _board_draw() -> void:
	# the guild board on two posts, with a paper pinned up for each notice you've posted
	var o := Vector2(BOARD) * TILE
	draw_rect(Rect2(o + Vector2(2, 6), Vector2(2, 10)), Color("4e3220"))
	draw_rect(Rect2(o + Vector2(12, 6), Vector2(2, 10)), Color("4e3220"))
	draw_rect(Rect2(o + Vector2(-1, -5), Vector2(18, 14)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(0, -4), Vector2(16, 12)), Color("7a5236"))
	for i in posted.size():
		var p := o + Vector2(2 + i * 7, -2)
		draw_rect(Rect2(p, Vector2(5, 7)), Color("f2e6c8"))
		draw_rect(Rect2(p + Vector2(2, 0), Vector2(1, 1)), Color("c84a3a"))
		draw_rect(Rect2(p + Vector2(1, 3), Vector2(3, 1)), Color("8a6e50"))

func _inn_sign() -> void:
	var o := Vector2(INN_DOOR) * TILE + Vector2(18, -6)
	draw_rect(Rect2(o, Vector2(1, 6)), Color("4e3220"))
	draw_rect(Rect2(o + Vector2(-4, 5), Vector2(9, 7)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(-3, 6), Vector2(7, 5)), Color("d8a868"))
	draw_rect(Rect2(o + Vector2(-1, 7), Vector2(3, 3)), Color("f2d24a"))        # a lantern on the sign

func _gate_draw() -> void:
	# two posts and a crossbar where the road leaves town
	var o := Vector2(GATE.x, GATE.y - 1) * TILE
	draw_rect(Rect2(o + Vector2(2, 2), Vector2(3, 46)), Color("4e3220"))
	draw_rect(Rect2(o + Vector2(0, 0), Vector2(16, 3)), Color("6b4a2a"))

func _lit_windows() -> void:
	# a warm window upstairs for each adventurer resting in the inn
	var resting := heroes.filter(func(h): return h.where == "inside").size()
	for i in resting:
		var o := Vector2(INN_DOOR.x - 1, INN_DOOR.y - 2) * TILE + Vector2(8 + i * 14, 18)
		draw_rect(Rect2(o, Vector2(5, 4)), Color("f2c84a"))
		draw_string(ThemeDB.fallback_font, o + Vector2(6, -1 - fmod(t, 1.5) * 3.0), "z", HORIZONTAL_ALIGNMENT_LEFT, -1, 6, Color(1, 1, 1, 0.8))

# ---------------------------------------------------------------- the screen's words: the status line, bubbles, the board
func _make_ui() -> void:
	ui = CanvasLayer.new()
	add_child(ui)
	status = Label.new()
	status.position = Vector2(6, 3)
	status.add_theme_font_size_override("font_size", 8)
	status.add_theme_color_override("font_color", Color.WHITE)
	status.add_theme_color_override("font_outline_color", Color("1a1e24"))
	status.add_theme_constant_override("outline_size", 3)
	ui.add_child(status)
	caption = Label.new()
	caption.position = Vector2(8, 192)
	caption.size = Vector2(368, 20)
	caption.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	caption.autowrap_mode = TextServer.AUTOWRAP_WORD
	caption.add_theme_font_size_override("font_size", 7)
	caption.add_theme_color_override("font_color", Color.WHITE)
	caption.add_theme_color_override("font_outline_color", Color("1a1e24"))
	caption.add_theme_constant_override("outline_size", 3)
	ui.add_child(caption)
	bubble = PanelContainer.new()
	var box := StyleBoxFlat.new()
	box.bg_color = Color(0.99, 0.97, 0.92, 0.97)
	box.set_border_width_all(1)
	box.border_color = Color(0.23, 0.17, 0.12)
	box.set_corner_radius_all(4)
	box.content_margin_left = 6
	box.content_margin_right = 6
	box.content_margin_top = 4
	box.content_margin_bottom = 4
	bubble.add_theme_stylebox_override("panel", box)
	bubble.custom_minimum_size = Vector2(240, 0)
	bubble_text = Label.new()
	bubble_text.custom_minimum_size = Vector2(228, 0)
	bubble_text.autowrap_mode = TextServer.AUTOWRAP_WORD
	bubble_text.add_theme_font_size_override("font_size", 8)
	bubble_text.add_theme_color_override("font_color", Color(0.17, 0.13, 0.1))
	bubble.add_child(bubble_text)
	bubble.visible = false
	ui.add_child(bubble)
	board_view = Control.new()
	board_view.set_anchors_preset(Control.PRESET_FULL_RECT)
	board_view.mouse_filter = Control.MOUSE_FILTER_IGNORE
	board_view.draw.connect(_draw_board_view)
	ui.add_child(board_view)

func _update_ui() -> void:
	status.text = "Day %d   Coins %d" % [day, coins]
	if caption_t <= 0.0:
		caption.text = ""
	var to_screen := get_viewport().get_canvas_transform()
	bubble.visible = not lines.is_empty() and not board_open
	if bubble.visible:
		var line: Dictionary = lines[0]
		var who: Mover = speaker(line.who)
		var name := "" if line.who == "" else ("Bryn" if line.who == "bryn" else str(line.who))
		bubble_text.text = (name + ": " if name != "" else "") + str(line.text) + "   ▸"
		bubble.size = Vector2(240, 0)
		bubble.reset_size()
		if who:
			var p := to_screen * (who.pos + Vector2(8, -8))
			bubble.position = Vector2(clampf(p.x - 120.0, 4.0, 140.0), maxf(14.0, p.y - bubble.size.y - 4.0))
		else:
			bubble.position = Vector2(72, 216 - bubble.size.y - 8)
	board_view.queue_redraw()

func _draw_board_view() -> void:
	var to_screen := get_viewport().get_canvas_transform()
	var font := ThemeDB.fallback_font
	# passing remarks float over people's heads
	for b in barks:
		if b.m.where != "town":
			continue
		var p: Vector2 = to_screen * (b.m.pos + Vector2(8, -10))
		var w := font.get_string_size(b.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 7).x + 8
		var r := Rect2(Vector2(clampf(p.x - w / 2, 2, 382 - w), p.y - 12), Vector2(w, 11))
		board_view.draw_rect(r, Color(0.99, 0.97, 0.92, 0.92))
		board_view.draw_rect(r, Color(0.23, 0.17, 0.12), false, 1.0)
		board_view.draw_string(font, r.position + Vector2(4, 8), b.text, HORIZONTAL_ALIGNMENT_LEFT, -1, 7, Color(0.17, 0.13, 0.1))
	if not board_open:
		return
	# the board, close up: today's notices, pinned or not
	board_view.draw_rect(Rect2(0, 0, 384, 216), Color(0.05, 0.04, 0.06, 0.55))
	board_view.draw_rect(Rect2(28, 14, 328, 196), Color("3e2a1a"))
	board_view.draw_rect(Rect2(32, 18, 320, 188), Color("7a5236"))
	board_view.draw_string(font, Vector2(32, 34), "The Guild Board", HORIZONTAL_ALIGNMENT_CENTER, 320, 11, Color("f4e9cd"))
	for i in notices.size():
		var j := job_of(notices[i])
		var r := _note_rect(i)
		var up: bool = j.id in posted
		board_view.draw_rect(r.grow(1), Color("f2d24a") if board_sel == i else Color(0, 0, 0, 0.3))
		board_view.draw_rect(r, Color("f4e9cd") if up else Color("d8c8a4"))
		if up:
			board_view.draw_rect(Rect2(r.position + Vector2(r.size.x / 2 - 2, -2), Vector2(4, 4)), Color("c84a3a"))   # the pin
		board_view.draw_multiline_string(font, r.position + Vector2(5, 13), j.name, HORIZONTAL_ALIGNMENT_LEFT, r.size.x - 10, 8, -1, Color("3e2c20"))
		board_view.draw_string(font, r.position + Vector2(5, 40), "%s · %d coins" % [DANGER_WORD[int(j.danger)], int(j.reward)], HORIZONTAL_ALIGNMENT_LEFT, -1, 7, Color("8a3a2a"))
		board_view.draw_multiline_string(font, r.position + Vector2(5, 52), j.text, HORIZONTAL_ALIGNMENT_LEFT, r.size.x - 10, 7, -1, Color("5a4636"))
		board_view.draw_string(font, r.position + Vector2(5, r.size.y - 5), "Pinned up" if up else "Pin it up", HORIZONTAL_ALIGNMENT_LEFT, -1, 7, Color("3e2c20") if up else Color("8a6e50"))
	var done := _note_rect(notices.size())
	board_view.draw_rect(done, Color("3e2c20") if board_sel == notices.size() else Color("5a3e26"))
	board_view.draw_string(font, done.position + Vector2(0, 11), "Done", HORIZONTAL_ALIGNMENT_CENTER, done.size.x, 8, Color("f4e9cd"))
	board_view.draw_string(font, Vector2(32, 182), "Up to %d pinned. The guild keeps three coins in ten of each reward." % MAX_POSTED, HORIZONTAL_ALIGNMENT_CENTER, 320, 7, Color("e8d8b8"))

# ---------------------------------------------------------------- saving the town (user://starfall.json)
func _autosave(dt: float) -> void:
	save_t += dt
	if save_t >= 5.0 and lines.is_empty() and not board_open:
		save_t = 0.0
		save_game()

func _notification(what: int) -> void:
	if what == NOTIFICATION_WM_CLOSE_REQUEST:
		save_game()

func save_game() -> void:
	if no_save:
		return
	var d := { "v": 1, "coins": coins, "day": day, "day_t": day_t, "meals": meals, "hired": hired, "offered": bryn_offered,
		"notices": notices, "posted": posted, "today": today, "me": [me.tile.x, me.tile.y],
		"heroes": heroes.map(func(h): return h.a) }
	var f := FileAccess.open(save_path, FileAccess.WRITE)
	if f:
		f.store_string(JSON.stringify(d))

func _load() -> bool:
	if no_save or not FileAccess.file_exists(save_path):
		return false
	var d: Variant = JSON.parse_string(FileAccess.get_file_as_string(save_path))
	if typeof(d) != TYPE_DICTIONARY:
		return false
	coins = int(d.coins)
	day = int(d.day)
	day_t = float(d.day_t)
	meals = int(d.meals)
	hired = bool(d.hired)
	bryn_offered = bool(d.offered)
	notices = d.notices
	posted = d.posted
	today = d.today
	me.tile = Vector2i(int(d.me[0]), int(d.me[1]))
	me.pos = Vector2(me.tile) * TILE
	heroes.clear()
	for i in d.heroes.size():
		var a: Dictionary = d.heroes[i]
		for k in ["lvl", "xp", "hp", "max", "morale"]:
			a[k] = int(a[k])
		var m := Mover.new("hero%d" % i, TOWN_AREA.position + Vector2i(i * 3 + 1, i % 2))
		m.a = a
		# whoever was out or queuing comes home to rest; everyone else is in town
		if a.state in ["away", "leaving", "to_board", "to_counter", "to_rest", "resting"]:
			a.state = "resting"
			a.job = ""
			m.where = "inside"
		else:
			a.state = "town"
		a.timer = 1.0
		_dress(m)
		heroes.append(m)
	if hired:
		bryn.tile = SERVE_AT
		bryn.pos = Vector2(SERVE_AT) * TILE
	say("", "Welcome back to Starfall, guildmaster. Day %d." % day)
	return true
