extends Node2D
## Wildbond in Godot: the trial slice (2026-10-07; see README.md and docs/wildbond-plan.md).
## Faded Larkhaven, walkable on the real map. Maren walks up and speaks in bubbles over her head; you sign her ranch
## register (the character creator, register.gd) and the ink paints you into the faded world in colour; you follow
## her into her barn, meet three young creatures in their stalls (their pages: card.gd) and choose your partner by
## walking up to one. Colour bursts out of the barn around it, and it follows you from then on.
## People and creatures are built from parts (figures.gd); the ground, trees and buildings are Ninja Adventure tiles
## (CC0); creatures, moves and story data come from the browser game (data/wildbond.json, tools/godot-export.ps1).
## Everything draws on a 384x216 pixel canvas scaled by whole numbers, so it stays crisp on any screen.

const Figures := preload("res://scripts/figures.gd")
const Register := preload("res://scripts/register.gd")
const Card := preload("res://scripts/card.gd")
const Battle := preload("res://scripts/battle.gd")
const R := preload("res://scripts/rules.gd")
const TILE := 16
const BARN_SOLID := "XWh|tb"                 # inside the barn: the dark, walls, hay, stall boards, the trough, sacks
const BARN := [                              # inside Maren's barn: three stalls, hay, feed sacks, a trough, the door at the bottom
	"XXXXXXXXXXXXXXXXXXXXXXXX",
	"XWWWWWWWWWWWWWWWWWWWWWWX",
	"XWWWWWWWWWWWWWWWWWWWWWWX",
	"Xhh,,,|,,,|,,,|,,,|,,hhX",
	"X,,,,,|,,,|,,,|,,,|,,,,X",
	"X,,,,,,,,,,,,,,,,,,,,,,X",
	"X,,,,,,,,,,,,,,,,,,,,,,X",
	"Xb,,,,,,,,,,,,,,,,,,,,tX",
	"Xb,,,,,,,,,,,,,,,,,,,,tX",
	"X,,,,,,,,,,,,,,,,,,,,,,X",
	"Xhh,,,,,,,,,,,,,,,,,,hhX",
	"X,,,,,,,,,,,,,,,,,,,,,,X",
	"XWWWWWWWWWWdWWWWWWWWWWWX",
	"XXXXXXXXXXXXXXXXXXXXXXXX",
]
const BARN_DOOR := Vector2i(18, 4)           # Maren's barn in town (the big wooden one, top right)
const BARN_EXIT := Vector2i(11, 12)          # its door, from the inside
const PADDOCK := Rect2i(14, 9, 5, 2)         # the open ground inside the ranch fence
## People's looks (figures.gd explains the keys). The tamer's is replaced by what you sign in the register.
const LOOKS := {
	"tamer": { "skin": Color("f1c9a0"), "hair": Color("6b4423"), "hat": Color("2a3f6b"), "shirt": Color("d8453a"), "legs": Color("3a4a6a"), "style": "cap" },
	"maren": { "skin": Color("e8c4a0"), "hair": Color("c9c3b8"), "shirt": Color("7a5236"), "apron": Color("4f8a5a"), "legs": Color("7a5236"), "style": "bun", "outfit": "skirt" },
	"wren": { "skin": Color("f0c7a4"), "hair": Color("3a2230"), "shirt": Color("d85a8a"), "legs": Color("3a3a4a"), "style": "spiky" },
}
## Creatures' looks: a body plan and colours (figures.gd). The starters' other facts come from data/wildbond.json.
const CREATURE_LOOKS := {
	"cindercub": { "kind": "wolf", "body": Color("d8642e"), "belly": Color("f4e4c8"), "dark": Color("5a2a14") },
	"ripplet": { "kind": "lizard", "body": Color("3a8fd8"), "belly": Color("cfe8f4"), "dark": Color("1a3a6a"), "accent": Color("8ad0f0") },
	"mosshog": { "kind": "boar", "body": Color("8a6a48"), "belly": Color("c8a882"), "dark": Color("3a2a1a"), "accent": Color("5d9a3e"), "snout": Color("c0907a") },
	"pup": { "kind": "wolf", "body": Color("b08a5a"), "belly": Color("efe0c4"), "dark": Color("4a3020") },
}
## What Maren says about each of the three (shown on its page).
const MAREN_ON := {
	"cindercub": "That one's a spark. Fast and bold, and it'll bite off more than it can chew. Sleeps curled round the warm stones.",
	"ripplet": "Ripplet's the thinker. It watches before it moves, and blows bubbles when it's pleased with itself.",
	"mosshog": "Slow to start and impossible to stop. The finches won't nest anywhere but its back.",
}

# the people and creatures: where they are, a smooth draw position, a walking queue, and what they're up to
class Mover:
	var id := ""
	var where := "larkhaven"                 # which map they're on: a map from the game data, or "barn"
	var tile := Vector2i.ZERO
	var pos := Vector2.ZERO
	var path: Array[Vector2i] = []
	var speed := 4.0
	var right := true
	var step_t := 0.0
	var face := Vector2i.DOWN                # which way they look: front, back or side
	var look: Dictionary = {}                # creatures only: body plan and colours
	var home := Rect2i()                     # creatures only: where they potter about (empty: they follow you)
	var act := "idle"                        # creatures: idle, sniff, sit, pounce, curious
	var act_t := 0.0
	var act_len := 1.0
	var hop := 0.0                           # height off the ground (a pounce, a hop for joy)
	var target := Vector2i.ZERO
	func _init(i: String, w: String, t: Vector2i) -> void:
		id = i
		where = w
		tile = t
		pos = Vector2(t) * 16.0
	func is_creature() -> bool:
		return not look.is_empty()

var DATA: Dictionary = {}                    # the browser game's content: SPECIES, MOVES, COUNTER, ...
var me := Mover.new("me", "larkhaven", Vector2i(11, 7))
var maren := Mover.new("maren", "larkhaven", Vector2i(7, 11))
var pup := Mover.new("pup", "larkhaven", Vector2i(16, 9))
var wren := Mover.new("wren", "gone", Vector2i(10, 0))   # your rival, who arrives late
var team: Array = []                         # your creatures as the rules see them (rules.gd): level, XP, stats, bond
var rival_c: Dictionary = {}
var bag := { "lures": 5, "coins": 0, "berries": 0 }   # your satchel (the browser game starts you with 5 lures)
var ranch: Array = []                        # creatures resting at Maren's ranch (your team holds three)
var seen := {}                               # the Wilddex: species seen and bonded
var bonded := {}
var got_items := {}                          # items already picked up, by id
var grass_n := 10                            # tall-grass steps until the next find (8-16, like the browser)
var battle_story := ""                       # "rival1" for Wren's battle; empty for wild ones
var satchel: Label
var then_do := Callable()                    # runs when the current conversation ends
var npcs: Array[Mover] = []                  # people out in the world (from the game data): trainers, Wardens
var npc_info := {}                           # id -> { data from the map, beaten, warden }
var badges: Array = []
var spotter: Mover = null                    # a trainer who has seen you and is walking over
var spot_t := 0.0
const BUILT := ["larkhaven", "thornwood"]    # the maps the Godot version has so far
var starters: Array[Mover] = []
var partner: Mover = null
var map_name := "larkhaven"
var my_look: Dictionary = LOOKS.tamer
var painted := false                         # signed the register: you keep your colour in the faded world
var paint_t := -1.0
var spilled := false                         # the colour has spilled out of the barn into town
var restore: Array = []                      # [{where, at: Vector2 world px, r: float, goal: float}]
var lines: Array = []                        # dialogue queue: [{who: "maren" | "" (narration), text}]
var stage := "intro"
var t := 0.0
var fade_in := 0.0
var trans_t := -1.0                          # walking through a door: fade out, switch, fade in
var trans_to := ""
var demo := false
var demo_t := 0.0
var demo_leg := 0
var fly := Vector2.ZERO                      # a butterfly (a moth in the barn) for young creatures to chase
var fly_scare := 0.0
var bubbles: Array = []                      # Ripplet's bubbles: [{p: Vector2, t: float}]
var bubble_cd := 0.0
var walk_to: Array[Vector2i] = []           # click or tap to walk: the steps still to take
var meet_after: Mover = null                 # walking up to a creature you tapped, to meet it on arrival
var meet_tries := 0
var rng := RandomNumberGenerator.new()
var register: Control
var card: Control
var battle: Control

@onready var cam: Camera2D = $Camera
@onready var fade_rect: ColorRect = $FadeLayer/Fade
@onready var bubble: PanelContainer = $UI/Bubble
@onready var bubble_text: Label = $UI/Bubble/Text
@onready var caption: Label = $UI/Caption
@onready var place: Label = $UI/Place
@onready var colour_layer: Node2D = $Painted/Figures

func _ready() -> void:
	demo = "--demo" in OS.get_cmdline_user_args()
	rng.seed = 7 if demo else Time.get_ticks_usec()
	var j: JSON = load("res://data/wildbond.json")
	DATA = j.data
	R.DATA = DATA
	pup.look = CREATURE_LOOKS.pup
	pup.home = PADDOCK
	_make_npcs()
	var x := 8
	for id in DATA.STARTERS:
		var m := Mover.new(id, "barn", Vector2i(x, 4))
		m.look = CREATURE_LOOKS[id]
		m.home = Rect2i(x - 1, 3, 3, 2)
		m.right = x < 12
		starters.append(m)
		x += 4
	_set_map("larkhaven")
	cam.position = me.pos + Vector2(8, 8)
	colour_layer.draw.connect(_draw_painted)
	register = Register.new()
	register.keep = not demo
	$UI.add_child(register)
	register.signed.connect(_on_signed)
	card = Card.new()
	$UI.add_child(card)
	card.chosen.connect(_on_chosen)
	battle = Battle.new()
	battle.looks = CREATURE_LOOKS
	battle.floor_tex = FLOOR
	battle.nature_tex = NATURE
	battle.demo = demo
	$UI.add_child(battle)
	battle.finished.connect(_on_battle)
	battle.bag = bag
	satchel = Label.new()
	satchel.position = Vector2(220, 4)
	satchel.size = Vector2(160, 14)
	satchel.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	satchel.add_theme_font_size_override("font_size", 7)
	satchel.add_theme_color_override("font_color", Color.WHITE)
	satchel.add_theme_color_override("font_outline_color", Color(0.1, 0.12, 0.14))
	satchel.add_theme_constant_override("outline_size", 3)
	$UI.add_child(satchel)
	if "--skip-opening" in OS.get_cmdline_user_args():
		_skip_opening()
		return
	say("", "The supply cart stops at the edge of the trees. Larkhaven: a handful of roofs and a ranch fence that runs right up to the forest.")
	say("", "Everything here looks faded, like an old picture left in the sun. You too.")

func _set_map(n: String) -> void:
	map_name = n
	var m := cur_map()
	cam.limit_right = m[0].length() * TILE
	cam.limit_bottom = m.size() * TILE
	place.text = "Maren's barn" if n == "barn" else str(DATA.MAPS[n].name)
	place.modulate.a = 1.0

# ---------------------------------------------------------------- dialogue
func say(who: String, text: String) -> void:
	lines.append({ "who": who, "text": text })

func advance() -> void:
	if lines.is_empty():
		return
	lines.pop_front()
	if lines.is_empty():
		if then_do.is_valid():
			var f := then_do
			then_do = Callable()
			f.call()                                     # what happens when this conversation ends (a battle, a badge...)
		else:
			_after_talk()

func _after_talk() -> void:
	match stage:
		"intro":
			stage = "maren_walks"
			maren.path = route(maren.tile, Vector2i(11, 8))
		"maren_talks":
			stage = "register"
			register.open()
		"signed":
			stage = "to_barn"
			maren.path = route(maren.tile, BARN_DOOR + Vector2i(1, 1))   # beside the barn door, not in front of it
			caption.text = "Follow Maren to her barn, the big wooden one at the top right, and walk in through its door."
		"barn_meet":
			stage = "barn_choose"
			caption.text = "Walk up to one of the three and press Enter to meet it properly."
		"bonded":
			stage = "walk_out"
			caption.text = "Walk out into Larkhaven; %s follows you." % _partner_name()
		"spill":
			# Wren arrives late, running down the north road
			stage = "wren_runs"
			wren.where = "larkhaven"
			wren.tile = Vector2i(10, 0)
			wren.pos = Vector2(wren.tile) * TILE
			wren.speed = 6.0
			wren.path = route(wren.tile, _beside_me())
		"rival1":
			stage = "battle"
			battle_story = "rival1"
			battle.open("trainer", team, [rival_c], DATA.RIVAL.name if DATA.get("RIVAL") is Dictionary else "Wren")
		"after_rival":
			stage = "free"
			wren.speed = 4.0
			seen[partner.id] = true
			bonded[partner.id] = true
			seen[rival_c.sp] = true
			wren.path = route(wren.tile, Vector2i(10, 0))        # off to Thornwood, already running
			caption.text = "End of the trial. Walk around Larkhaven with %s." % _partner_name()

func _on_signed(look: Dictionary) -> void:
	# the ink dries and colour runs into you: you are the one bright thing in the faded valley
	my_look = look
	painted = true
	paint_t = 0.0
	stage = "signed"
	say("", "As the ink dries, colour runs into you: your hands, your clothes, your hair. You're the only bright thing on the road.")
	say("maren", "%s. Good name. And look at you, bright as a new penny!" % look.name)
	say("maren", "Don't mind the rest of it. The whole valley faded long ago. Like an old photo, isn't it?")
	say("maren", "Folk say it comes back, a little, every time someone earns a creature's trust. Come to the barn. Someone's been waiting for you.")

func _partner_name() -> String:
	return DATA.SPECIES[partner.id].name if partner else "your partner"

# ---------------------------------------------------------------- the map
func cur_map() -> Array:
	return BARN if map_name == "barn" else DATA.MAPS[map_name].rows

## Whether a tile blocks the way: the game data says so for outdoor maps (TILES), the barn has its own few.
func solid(ch: String) -> bool:
	if map_name == "barn":
		return ch in BARN_SOLID
	return int(DATA.TILES.get(ch, {}).get("solid", 0)) == 1

func tile_at(p: Vector2i) -> String:
	var m := cur_map()
	if p.y < 0 or p.y >= m.size() or p.x < 0 or p.x >= m[0].length():
		return "X" if map_name == "barn" else "T"
	return m[p.y][p.x]

func actors() -> Array:
	var out: Array = []
	for m in [me, maren, pup, wren] + starters + npcs:
		if m.where == map_name:
			out.append(m)
	return out

func walkable(p: Vector2i) -> bool:
	var ch := tile_at(p)
	if solid(ch):
		return false
	if ch == "D" and not (p == BARN_DOOR and stage not in ["intro", "maren_walks", "maren_talks", "register", "signed"]):
		return false                           # other people's houses stay shut in the trial
	for m in actors():
		if p == m.tile or (not m.path.is_empty() and p == m.path[0]):
			return false
	return true

func route(from: Vector2i, to: Vector2i) -> Array[Vector2i]:
	# shortest walk on the grid (people only step on open tiles)
	var prev := { from: from }
	var queue: Array[Vector2i] = [from]
	while not queue.is_empty():
		var c: Vector2i = queue.pop_front()
		if c == to:
			break
		for d in [Vector2i.UP, Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT]:
			var n: Vector2i = c + d
			if prev.has(n) or solid(tile_at(n)) or (tile_at(n) == "D" and n != to) or (n != to and _someone_standing(n)):
				continue
			prev[n] = c
			queue.append(n)
	var out: Array[Vector2i] = []
	if not prev.has(to):
		return out
	var c2: Vector2i = to
	while c2 != from:
		out.push_front(c2)
		c2 = prev[c2]
	return out

# ---------------------------------------------------------------- doors: into the barn and out again
func _check_doors() -> void:
	if trans_t >= 0.0 or not me.path.is_empty():
		return
	if map_name == "larkhaven" and me.tile == BARN_DOOR:
		_go("barn")
	elif map_name == "barn" and me.tile == BARN_EXIT:
		_go("larkhaven")
	elif map_name != "barn":
		# the edge of a map: the road onward, if it's open
		var ch := tile_at(me.tile)
		if int(DATA.TILES.get(ch, {}).get("exit", 0)) != 1:
			return
		var ex: Dictionary = DATA.MAPS[map_name].exits.get(ch, {})
		var block := ""
		if ex.is_empty():
			block = "The road ends here for now."
		elif ex.has("locked") and not _gate_open(map_name):
			block = ex.locked
		elif ex.to not in BUILT:
			block = "The road goes on to %s. That part of the valley is still being built in the Godot version." % DATA.MAPS[ex.to].name
		elif stage != "free":
			block = "Maren calls after you: \"Not yet, love! Finish up here first.\""
		if block != "":
			say("", block)
			var back: Vector2i = me.tile - me.face
			if not solid(tile_at(back)):
				me.path = [back]                       # step back from the edge
			return
		_go(ex.to, Vector2i(int(ex.x), int(ex.y)), DIRS.get(ex.get("dir", "down"), Vector2i.DOWN))

const DIRS := { "up": Vector2i.UP, "down": Vector2i.DOWN, "left": Vector2i.LEFT, "right": Vector2i.RIGHT }
var trans_at := Vector2i(-1, -1)
var trans_face := Vector2i.DOWN

func _go(to: String, at := Vector2i(-1, -1), face := Vector2i.DOWN) -> void:
	trans_t = 0.0
	trans_to = to
	trans_at = at
	trans_face = face

func _switch() -> void:
	_set_map(trans_to)
	if trans_to == "barn":
		me.tile = BARN_EXIT + Vector2i.UP
		me.face = Vector2i.UP
		if stage == "to_barn":
			maren.where = "barn"
			maren.tile = Vector2i(15, 8)
			maren.pos = Vector2(maren.tile) * TILE
			maren.path.clear()
			maren.face = Vector2i.LEFT
	elif trans_at.x >= 0:
		me.tile = trans_at                          # arriving along a road
		me.face = trans_face
	else:
		me.tile = BARN_DOOR + Vector2i.DOWN
		me.face = Vector2i.DOWN
	me.where = trans_to
	if stage == "free" and trans_at.x >= 0:
		caption.text = ""                            # out on the road: the trial's end note has done its job
	me.pos = Vector2(me.tile) * TILE
	me.path.clear()
	if partner:
		partner.where = trans_to
		partner.tile = BARN_EXIT if trans_to == "barn" else (BARN_DOOR if trans_at.x < 0 else me.tile - trans_face)
		if trans_at.x >= 0 and solid(tile_at(partner.tile)):
			partner.tile = me.tile
		partner.pos = Vector2(partner.tile) * TILE
		partner.path.clear()
		_stop(partner)
	cam.position = me.pos + Vector2(8, 8)
	cam.reset_smoothing()
	if trans_to == "barn" and stage == "to_barn":
		stage = "barn_meet"
		caption.text = ""
		say("maren", "Here they are. Three young ones, born this spring, and every one of them hoping for a tamer.")
		say("maren", "Go and say hello. Take your time, love; this is the big one. They'll be choosing you as much as you choose them.")
	elif trans_to == "larkhaven" and partner and not spilled:
		spilled = true
		maren.where = "larkhaven"                         # Maren follows you out
		maren.tile = BARN_DOOR + Vector2i(1, 1)
		maren.pos = Vector2(maren.tile) * TILE
		maren.path.clear()
		stage = "spill"
		caption.text = ""
		restore.append({ "where": "larkhaven", "at": Vector2(BARN_DOOR) * TILE + Vector2(8, 8), "r": 0.0, "goal": 110.0 })
		say("", "Outside, the colour has spilled out through the barn door: across the path, up the walls, into the grass.")
		say("", "%s sniffs the bright grass, sneezes, and looks up at you as if to say: where next?" % _partner_name())

# ---------------------------------------------------------------- the loop
func _process(dt: float) -> void:
	t += dt
	fade_in = min(1.0, fade_in + dt * 0.7)
	var door_dark := 0.0
	if trans_t >= 0.0:
		var before := trans_t
		trans_t += dt
		if before < 0.3 and trans_t >= 0.3:
			_switch()
		door_dark = 1.0 - absf(trans_t - 0.3) / 0.3
		if trans_t >= 0.6:
			trans_t = -1.0
	fade_rect.color.a = maxf(1.0 - fade_in, clampf(door_dark, 0.0, 1.0))
	if paint_t >= 0.0:
		paint_t += dt
	if demo:
		_demo(dt)
	_butterfly(dt)
	_spotter_tick(dt)
	_bubbles(dt)
	for m in actors():
		if m.is_creature():
			_think(m, dt)
	for m in actors():
		_walk(m, dt)
	if stage == "free" and wren.where == map_name and wren.path.is_empty() and wren.tile == Vector2i(10, 0):
		wren.where = "gone"                          # off up the road to Thornwood
	if stage == "wren_runs" and wren.path.is_empty() and wren.pos.distance_to(Vector2(wren.tile) * TILE) < 0.5:
		stage = "rival1"
		wren.face = me.tile - wren.tile
		me.face = wren.tile - me.tile
		if wren.where == "larkhaven" and wren.tile.x == 10 and wren.tile.y == 0:
			wren.tile = _beside_me()
			wren.pos = Vector2(wren.tile) * TILE
		for l in DATA.SCENES.rival1:
			say(l[0], _fill(l[1]))
	if stage == "maren_walks" and maren.path.is_empty() and maren.pos.distance_to(Vector2(maren.tile) * TILE) < 0.5:
		stage = "maren_talks"
		say("maren", "There you are! You must be the new tamer. I'm Maren. I keep the ranch.")
		say("maren", "Before anything else: the ranch register. Every tamer in the valley signs it. Write yourself in, love.")
	var free_to_walk: bool = stage in ["to_barn", "barn_choose", "walk_out", "free"] and not card.visible and not battle.visible and trans_t < 0.0
	if lines.is_empty() and free_to_walk and me.path.is_empty() and me.pos.distance_to(Vector2(me.tile) * TILE) < 0.5:
		var d := Vector2i.ZERO
		if Input.is_action_pressed("ui_up") or Input.is_physical_key_pressed(KEY_W): d = Vector2i.UP
		elif Input.is_action_pressed("ui_down") or Input.is_physical_key_pressed(KEY_S): d = Vector2i.DOWN
		elif Input.is_action_pressed("ui_left") or Input.is_physical_key_pressed(KEY_A): d = Vector2i.LEFT
		elif Input.is_action_pressed("ui_right") or Input.is_physical_key_pressed(KEY_D): d = Vector2i.RIGHT
		if d != Vector2i.ZERO:
			walk_to.clear()                          # the keys always win over a tapped walk
			meet_after = null
			_step(d)
		elif not walk_to.is_empty():
			var nxt: Vector2i = walk_to.pop_front()
			if (nxt - me.tile).length() == 1 and (walkable(nxt) or (partner and nxt == partner.tile)):
				_step(nxt - me.tile)
			else:
				walk_to.clear()                      # something stepped in the way: stop here
		elif meet_after:
			if (me.tile - meet_after.tile).length() <= 1.01 and stage == "barn_choose":
				_meet(meet_after)
				meet_after = null
			elif meet_tries < 4:
				meet_tries += 1                          # it wandered off a step: follow it
				walk_to = route(me.tile, meet_after.tile + Vector2i.DOWN)
				if walk_to.is_empty():
					meet_after = null
			else:
				meet_after = null
	_check_doors()
	for r in restore:
		r.r = move_toward(r.r, r.goal, dt * 70.0)
	cam.position = cam.position.lerp(me.pos + Vector2(8, 8), min(1.0, dt * 8.0))
	_update_ui()
	queue_redraw()
	colour_layer.queue_redraw()

func _step(d: Vector2i) -> void:
	me.face = d
	me.right = d.x > 0 if d.x != 0 else me.right
	var was := me.tile
	if partner and partner.where == map_name and me.tile + d == partner.tile:
		partner.tile = was                       # your partner steps aside, swapping places with you
		partner.pos = Vector2(was) * TILE
		partner.path.clear()
	if walkable(me.tile + d):
		me.path = [me.tile + d]
		if partner and partner.where == map_name and partner.tile != was:
			_stop(partner)
			partner.path = [was]

func _walk(m: Mover, dt: float) -> void:
	if m.path.is_empty():
		return
	var nxt: Vector2i = m.path[0]
	var goal := Vector2(nxt) * TILE
	m.face = nxt - m.tile
	if goal.x != m.pos.x:
		m.right = goal.x > m.pos.x
	m.pos = m.pos.move_toward(goal, dt * m.speed * TILE)
	m.step_t += dt
	if m.pos.distance_to(goal) < 0.01:
		m.tile = nxt
		m.path.pop_front()
		if m == me:
			_arrived(nxt)
			_check_spotted()

func _unhandled_input(e: InputEvent) -> void:
	var pressed: bool = (e.is_action_pressed("ui_accept") or (e is InputEventKey and e.pressed and not e.echo and e.physical_keycode == KEY_E)
		or (e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT))
	if not pressed:
		return
	if not lines.is_empty():
		advance()
	elif stage == "free" and not (e is InputEventMouseButton) and not battle.visible and _talk_here():
		pass
	elif stage == "free" and maren.where == map_name and (me.tile - maren.tile).length() <= 1.01 and not (e is InputEventMouseButton and Vector2i((get_global_mouse_position() / TILE).floor()) != maren.tile):
		_maren_heals()
	elif e is InputEventMouseButton:
		_tap(get_global_mouse_position())
	elif stage == "barn_choose" and not card.visible:
		var s := _starter_beside_me()
		if s:
			_meet(s)

## Click or tap: walk there (around anything in the way). Tap a creature in the barn to walk up and meet it.
func _tap(at: Vector2) -> void:
	if not (stage in ["to_barn", "barn_choose", "walk_out", "free"] and not card.visible and not battle.visible and trans_t < 0.0):
		return
	var goal := Vector2i((at / TILE).floor())
	meet_after = null
	if stage == "barn_choose":
		for s in starters:
			if s.where == map_name and s.tile == goal:
				if (me.tile - goal).length() <= 1.01:
					_meet(s)
					return
				meet_after = s
				meet_tries = 0
				goal = s.tile + Vector2i.DOWN          # stand in front of its stall
	if goal == me.tile:
		return
	var r := route(me.tile, goal)
	if r.is_empty() or not (walkable(goal) or (partner and goal == partner.tile) or goal == BARN_DOOR or goal == BARN_EXIT):
		meet_after = null
		return
	walk_to = r

func _starter_beside_me() -> Mover:
	for s in starters:
		if s.where == map_name and (me.tile - s.tile).length() <= 1.01:
			return s
	return null

# ---------------------------------------------------------------- meeting and choosing your partner
func _meet(s: Mover) -> void:
	me.face = s.tile - me.tile
	s.right = me.pos.x > s.pos.x
	card.open(s.id, card_info(s.id))

## A starter's page, from the browser game's data: the same names, stats, moves and matchups in both versions.
func card_info(id: String) -> Dictionary:
	var s: Dictionary = DATA.SPECIES[id]
	var moves: Array = []
	for l in s.learn:
		if l[0] <= 5:
			moves.append(DATA.MOVES[l[1]].name)
	var weak: String = DATA.COUNTER[id]
	var strong := ""
	for k in DATA.COUNTER:
		if DATA.COUNTER[k] == id:
			strong = k
	return {
		"name": s.name, "el": s.el, "dex": s.dex, "base": s.base, "moves": moves, "look": CREATURE_LOOKS[id],
		"strong": "%s (%s)" % [DATA.SPECIES[strong].el, DATA.SPECIES[strong].name],
		"weak": "%s (%s)" % [DATA.SPECIES[weak].el, DATA.SPECIES[weak].name],
		"role": role_of(s.base), "maren": MAREN_ON.get(id, ""),
	}

## The same role words as the browser game (games/wildbond/js/05-ui.js roleOf).
func role_of(b: Dictionary) -> String:
	var tough: float = (b.hp + b.grd + b.spi) / 3.0
	var hit: float = maxf(b.pow, b.wit)
	var phys: bool = b.pow >= b.wit
	var r: Array
	if tough > hit + 8: r = ["Tank", "tough and hard to wear down"]
	elif b.spd >= hit and b.spd > tough: r = ["Skirmisher", "quick, gets more turns"]
	elif hit > tough + 8: r = ["Bruiser", "hits hard up close"] if phys else ["Caster", "strong elemental moves"]
	else: r = ["All-rounder", "balanced"]
	return "%s: %s. Attacks mostly with %s." % [r[0], r[1], "physical moves (Power)" if phys else "special, elemental moves (Wits)"]

func _on_chosen(id: String) -> void:
	# the bond: you kneel, it chooses you back, and colour bursts out of it across the barn
	for s in starters:
		if s.id == id:
			partner = s
	partner.home = Rect2i()
	team = [R.make(id, 5, { "rar": 1 }, rng)]           # level 5, like the browser game's first partner
	rival_c = R.make(DATA.COUNTER[id], 4, { "rar": 1 }, rng)   # Wren takes the one that beats yours
	stage = "bonded"
	caption.text = ""
	_stop(partner)
	restore.append({ "where": "barn", "at": partner.pos + Vector2(8, 8), "r": 0.0, "goal": 170.0 })
	var n: String = DATA.SPECIES[id].name
	say("", "You kneel in the straw. %s looks at you for a long moment, then steps forward and presses its head into your hand." % n)
	say("", "Colour floods out from it: gold straw, red beams, a blue sky in the high window.")
	say("maren", "...There. It chose you right back. And the world remembered a little.")
	say("maren", "Nobody owns a creature, love; they choose. The other two will find their tamers. Wren's due by later, and that one never could wait.")
	say("maren", "Off you go, then. Show %s the valley." % n)

# ---------------------------------------------------------------- young creatures: each with a mind of its own
## They potter about their home ground (the paddock, a stall): wander, sniff, sit, and stalk the butterfly. When you
## come near they stop and watch you, ears up and tails going. Your partner follows you and does the same things
## whenever you stand still. Ripplet blows bubbles instead of sniffing; Mosshog sometimes has a finch on its back.
func _stop(m: Mover) -> void:
	m.act = "idle"
	m.act_t = 0.0
	m.act_len = 1.0
	m.hop = 0.0
	m.speed = 4.0

func _think(m: Mover, dt: float) -> void:
	m.act_t += dt
	if m == partner and stage == "bonded":
		m.hop = -abs(sin(t * 6.0)) * 3.0           # it hops for joy
		return
	if m.act != "pounce":
		m.hop = 0.0
	if m.act == "pounce":
		# crouch and wiggle, then leap one tile at the butterfly (or on the spot)
		if m.act_t >= 0.8 and m.path.is_empty() and m.target != m.tile and walkable(m.target):
			m.speed = 3.0
			m.path = [m.target]
			m.target = m.tile
			fly_scare = 2.0
		var k := clampf((m.act_t - 0.8) / 0.4, 0.0, 1.0)
		m.hop = -sin(k * PI) * 6.0
		if m.act_t > 1.5:
			_stop(m)
		return
	if not m.path.is_empty():
		return
	var near := (Vector2(me.tile) - Vector2(m.tile)).length() <= (2.0 if map_name == "barn" else 3.0)
	if m != partner and near and stage not in ["intro", "maren_walks"]:
		m.act = "curious"                          # it has seen you: it stops and watches
		m.right = me.pos.x > m.pos.x
		return
	if m.act == "curious":
		_stop(m)
	if m.act_t < m.act_len:
		return
	var r := rng.randf()
	m.act_t = 0.0
	var fly_tile := Vector2i((fly / TILE).floor())
	if r < 0.3 and m.home.has_area():
		var dirs := [Vector2i.UP, Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT]
		var to: Vector2i = m.tile + dirs[rng.randi() % 4]
		m.act = "idle"
		m.act_len = rng.randf_range(0.6, 1.6)
		if m.home.has_point(to) and walkable(to):
			m.path = [to]
	elif r < 0.5:
		m.act = "sniff"
		m.act_len = rng.randf_range(1.5, 3.0)
	elif r < 0.65:
		m.act = "sit"
		m.act_len = rng.randf_range(2.5, 4.5)
	elif r < 0.9 and m.look.kind == "wolf" and (Vector2(fly_tile) - Vector2(m.tile)).length() <= 3.0:
		m.act = "pounce"
		m.act_len = 1.5
		m.right = fly.x > m.pos.x + 8
		m.target = m.tile + Vector2i(signi(fly_tile.x - m.tile.x), 0)
		if not m.home.has_area() or not m.home.has_point(m.target):
			m.target = m.tile                      # it pounces on the spot
	else:
		m.act = "idle"
		m.act_len = rng.randf_range(1.0, 2.5)

func _butterfly(dt: float) -> void:
	# a butterfly over the paddock (a moth by the barn window), fluttering up and away whenever someone leaps at it
	fly_scare = max(0.0, fly_scare - dt)
	var home := Vector2(PADDOCK.position) * TILE + Vector2(PADDOCK.size) * TILE * 0.5
	if map_name == "barn":
		home = Vector2(8.5, 3.2) * TILE
	if partner and partner.where == map_name and map_name == "larkhaven":
		home = me.pos + Vector2(8, -10)
	var goal := home + Vector2(sin(t * 0.7) * 30.0, cos(t * 1.1) * 8.0 - 4.0 - fly_scare * 10.0)
	if map_name == "barn":
		goal = home + Vector2(sin(t * 1.3) * 14.0, cos(t * 1.7) * 6.0 - fly_scare * 8.0)
	fly = goal if fly == Vector2.ZERO else fly.lerp(goal, min(1.0, dt * 1.5))

func _bubbles(dt: float) -> void:
	bubble_cd -= dt
	for m in actors():
		if m.is_creature() and m.look.kind == "lizard" and (m.act == "sniff" or (m == partner and stage == "bonded")) and bubble_cd <= 0.0:
			bubbles.append({ "p": m.pos + Vector2(15.0 if m.right else 0.0, 7.0 + m.hop), "t": 0.0, "where": map_name })
			bubble_cd = 0.35
	for b in bubbles:
		b.t += dt
		b.p += Vector2(sin(b.t * 6.0) * 0.3, -dt * 9.0)
	bubbles = bubbles.filter(func(b): return b.t < 1.6)

# ---------------------------------------------------------------- the demo (for screenshots: run with -- --demo)
func _demo(dt: float) -> void:
	demo_t += dt
	if demo_t < 1.2:
		return
	demo_t = 0.0
	if stage == "register":
		register.demo_step()
	elif card.visible:
		if card.sel != 0:
			card.sel = 0                           # look at the page for a moment, move to "Choose", then choose
		else:
			card._close(true)
	elif not lines.is_empty():
		advance()
	elif stage == "to_barn" and me.path.is_empty() and trans_t < 0.0:
		me.path = route(me.tile, BARN_DOOR)
	elif stage == "barn_choose" and me.path.is_empty():
		var goal := Vector2i(12, 5)                # in front of Ripplet's stall
		if me.tile == goal:
			me.face = Vector2i.UP
			_meet(_starter_beside_me())
		else:
			me.path = route(me.tile, goal)
	elif stage == "walk_out" and map_name == "barn" and me.path.is_empty():
		me.path = route(me.tile, BARN_EXIT)
	elif stage == "free" and me.path.is_empty() and walk_to.is_empty() and trans_t < 0.0:
		# out to Thornwood, then up and down the tall grass until something turns up
		if map_name == "larkhaven":
			walk_to = route(me.tile, Vector2i(10, 0))
		elif map_name == "thornwood":
			var grass := [Vector2i(9, 7), Vector2i(9, 11), Vector2i(4, 11), Vector2i(4, 3)]
			walk_to = route(me.tile, grass[demo_leg % grass.size()])
			demo_leg += 1

# ---------------------------------------------------------------- drawing
func _draw() -> void:
	if map_name == "barn":
		_draw_barn()
	else:
		_draw_outdoor()
	# items lying on the ground: a little cloth pouch, tied at the top
	if map_name != "barn":
		for it in DATA.MAPS[map_name].get("items", []):
			if not got_items.has(it.id):
				var io := Vector2(float(it.at[0]), float(it.at[1])) * TILE + Vector2(4, 5 + sin(t * 2.0 + float(it.at[0])) * 0.5)
				draw_rect(Rect2(io + Vector2(0, 2), Vector2(8, 8)), Figures.OUTLINE)
				draw_rect(Rect2(io + Vector2(1, 3), Vector2(6, 6)), Color("c8925a"))
				draw_rect(Rect2(io + Vector2(2, 0), Vector2(4, 3)), Figures.OUTLINE)
				draw_rect(Rect2(io + Vector2(3, 1), Vector2(2, 2)), Color("e0b070"))
				draw_rect(Rect2(io + Vector2(2, 3), Vector2(4, 1)), Color("8a5a2a"))
	# people and creatures, back to front; you (once signed) and your partner are drawn in colour on their own layer
	var list := actors()
	list.sort_custom(func(a, b): return a.pos.y < b.pos.y)
	for i in list.size():
		var m: Mover = list[i]
		draw_rect(Rect2(m.pos + Vector2(3, 14), Vector2(10, 2)), Color(0, 0, 0, 0.25))   # a soft shadow
		if not _is_painted(m):
			_draw_actor(self, m, i)
	if spotter and spot_t < 0.9:
		# the "!" over a trainer who has just seen you
		var ex := spotter.pos + Vector2(4, -18 - minf(spot_t * 20.0, 4.0))
		draw_rect(Rect2(ex, Vector2(8, 11)), Figures.OUTLINE)
		draw_rect(Rect2(ex + Vector2(1, 1), Vector2(6, 9)), Color("fdf6e6"))
		draw_rect(Rect2(ex + Vector2(3, 2), Vector2(2, 4)), Color("c83a2a"))
		draw_rect(Rect2(ex + Vector2(3, 7), Vector2(2, 2)), Color("c83a2a"))
	if map_name == "barn":
		_draw_barn_light()
	# the butterfly (or moth) and Ripplet's bubbles
	var flap := int(t * 12.0) % 2 == 0
	var wing := Vector2(3, 3) if flap else Vector2(1, 3)
	var wcol := Color("f2d24a") if map_name == "larkhaven" else Color("e8dcc0")
	draw_rect(Rect2(fly + Vector2(-wing.x - 1, -1), wing + Vector2(2, 2)), Figures.OUTLINE)
	draw_rect(Rect2(fly + Vector2(0, -1), wing + Vector2(2, 2)), Figures.OUTLINE)
	draw_rect(Rect2(fly + Vector2(-wing.x, 0), wing), wcol)
	draw_rect(Rect2(fly + Vector2(1, 0), wing), wcol)
	draw_rect(Rect2(fly + Vector2(0, -1), Vector2(1, 4)), Color("3a2a1a"))
	for b in bubbles:
		if b.where == map_name:
			var a: float = 1.0 - b.t / 1.6
			draw_arc(b.p, 1.5 + b.t, 0, TAU, 10, Color(0.85, 0.95, 1.0, a), 1.0)

func _draw_outdoor() -> void:
	var rows: Array = cur_map()
	# 1. the ground (Ninja Adventure tiles, CC0): grass everywhere, dirt on paths, flowers here and there
	for y in rows.size():
		for x in rows[0].length():
			_draw_ground(x, y, rows[y][x])
	# 2. fences and the signpost (drawn in code; they already looked right)
	for y in rows.size():
		for x in rows[0].length():
			if rows[y][x] in "=P":
				_draw_tile(x, y, rows[y][x])
	# 3. houses, the barn and trees: standing objects with a footprint (so a 3D renderer can stand them up later)
	_draw_structures()

func _is_painted(m: Mover) -> bool:
	return (m == me and painted) or (m == partner)

func _draw_painted() -> void:
	# the colour layer sits above the faded world, so whatever is drawn here keeps its colour everywhere
	var list := actors().filter(func(m): return _is_painted(m))
	list.sort_custom(func(a, b): return a.pos.y < b.pos.y)
	for m in list:
		_draw_actor(colour_layer, m, 0)
	if paint_t >= 0.0 and paint_t < 1.4:
		# the ink sparkles outward as you're painted in
		var cols := [my_look.shirt, my_look.hair, my_look.legs, Color("f2d24a")]
		for k in 12:
			var a := k * TAU / 12.0 + paint_t
			var d := 4.0 + paint_t * 18.0
			var c: Color = cols[k % 4]
			c.a = 1.0 - paint_t / 1.4
			colour_layer.draw_rect(Rect2(me.pos + Vector2(8, 6) + Vector2(cos(a), sin(a)) * d, Vector2(1, 1)), c)

func _draw_actor(ci: CanvasItem, m: Mover, i: int) -> void:
	var walking := not m.path.is_empty()
	if m.is_creature():
		var happy: bool = m.act == "curious" or (m == partner and stage == "bonded")
		var pose := {
			"walking": walking, "frame": int(m.step_t * 10.0) % 4, "blink": fmod(t + m.pos.x * 0.01, 2.9) < 0.12,
			"wag": [1, 0, -1, 0][int(t * (14.0 if happy else 6.0)) % 4],
			"sniff": m.act == "sniff" and m.look.kind != "lizard", "twitch": (int(t * 12.0) % 2) if m.act == "sniff" else 0,
			"sit": m.act == "sit", "ears_up": m.act in ["curious", "pounce"] or happy,
			"crouch": (2 if m.act_t < 0.8 else 0) if m.act == "pounce" else 0,
			"bird": m.look.kind == "boar" and not walking and fmod(t + 3.0, 16.0) < 10.0,
		}
		var wiggle := (1.0 if int(t * 16.0) % 2 == 0 else -1.0) if m.act == "pounce" and m.act_t > 0.4 and m.act_t < 0.8 else 0.0
		Figures.creature(ci, m.pos + Vector2(-1 + wiggle, 4 + m.hop), m.right, pose, m.look)
		return
	var face := m.face
	if not walking and face == Vector2i.DOWN and fmod(t + i, 6.0) > 5.2:
		face = Vector2i.LEFT if int(t + i) % 2 == 0 else Vector2i.RIGHT   # a glance around while standing
	var look: Dictionary = my_look if m == me else (LOOKS[m.id] if LOOKS.has(m.id) else _cast_look(m.id))
	Figures.person(ci, m.pos + Vector2(2, -5), face, walking, int(m.step_t * 8.0) % 4, fmod(t + i * 1.7, 3.3) < 0.12, look)

# ---------------------------------------------------------------- inside the barn (drawn in code: warm wood and straw)
const WOOD := Color("7a5236")
const WOOD_DARK := Color("4e3220")
const WOOD_LIGHT := Color("a07048")
const STRAW := Color("e0c068")

func _draw_barn() -> void:
	var w := BARN[0].length()
	draw_rect(Rect2(0, 0, w * TILE, BARN.size() * TILE), Color("16100c"))
	for y in BARN.size():
		for x in w:
			var ch: String = BARN[y][x]
			var o := Vector2(x, y) * TILE
			var n := (x * 7 + y * 13) % 11
			if ch in ",h|tbd":
				_boards(o, x, y)
				if y <= 4 and ch == "," and x > 6 and x < 18:      # straw bedding in the stalls
					draw_rect(Rect2(o + Vector2(0, 1 if y == 3 else 0), Vector2(16, 15 if y == 3 else 12)), STRAW.darkened(0.35))
					for k in 9:
						draw_rect(Rect2(o + Vector2((n * 3 + k * 5) % 13, (k * 7 + n) % 14), Vector2(3, 1)), STRAW.darkened(0.12 * (k % 2)))
				elif n == 3:
					draw_rect(Rect2(o + Vector2(4, 9), Vector2(3, 1)), STRAW)          # a stray wisp
			if ch == "W":
				draw_rect(Rect2(o, Vector2(16, 16)), WOOD)
				for k in 4:
					draw_rect(Rect2(o + Vector2(k * 4, 0), Vector2(1, 16)), WOOD_DARK)   # boards
				if y == 2:
					draw_rect(Rect2(o + Vector2(0, 13), Vector2(16, 3)), WOOD_DARK)   # the skirting beam
				if y == 1:
					draw_rect(Rect2(o + Vector2(0, 2), Vector2(16, 3)), WOOD_LIGHT)    # the cross beam
				if y == BARN.size() - 2:
					draw_rect(Rect2(o, Vector2(16, 3)), WOOD_LIGHT)                  # the front wall's top edge
			match ch:
				"h": _bale(o)
				"|": _stall_board(o, x, y)
				"t": _trough(o)
				"b": _sacks(o)
				"d":
					draw_rect(Rect2(o + Vector2(1, 0), Vector2(14, 16)), Color("2a1c12"))
					draw_rect(Rect2(o + Vector2(1, 9), Vector2(14, 7)), Color("6a9a48").darkened(0.2))   # grass outside
	# the side walls: posts that hold the roof up
	for x in [0, w - 1]:
		draw_rect(Rect2(Vector2(x * TILE + (10 if x == 0 else 0), TILE), Vector2(6, (BARN.size() - 2) * TILE)), WOOD_DARK)
		draw_rect(Rect2(Vector2(x * TILE + (12 if x == 0 else 1), TILE), Vector2(2, (BARN.size() - 2) * TILE)), WOOD)
	# the windows high on the back wall, a ladder to the loft, tools on their pegs
	for wx in BARN_WINDOWS:
		var o := Vector2(wx, 1) * TILE + Vector2(2, 6)
		draw_rect(Rect2(o - Vector2(1, 1), Vector2(14, 12)), WOOD_DARK)
		draw_rect(Rect2(o, Vector2(12, 10)), Color("a8d0ea"))
		draw_rect(Rect2(o + Vector2(0, 7), Vector2(12, 3)), Color("8ab86a"))      # the hills outside
		draw_rect(Rect2(o + Vector2(5, 0), Vector2(1, 10)), WOOD_DARK)
	var lad := Vector2(4, 1) * TILE + Vector2(3, 0)
	draw_rect(Rect2(lad, Vector2(2, 32)), WOOD_LIGHT)
	draw_rect(Rect2(lad + Vector2(8, 0), Vector2(2, 32)), WOOD_LIGHT)
	for k in 6:
		draw_rect(Rect2(lad + Vector2(0, 3 + k * 5), Vector2(10, 1)), WOOD_LIGHT.darkened(0.15))
	var pegs := Vector2(20, 1) * TILE + Vector2(2, 8)
	draw_rect(Rect2(pegs, Vector2(1, 20)), Color("8a8a8a"))                      # a pitchfork
	draw_rect(Rect2(pegs + Vector2(-2, 0), Vector2(5, 1)), Color("8a8a8a"))
	draw_rect(Rect2(pegs + Vector2(-2, -4), Vector2(1, 4)), Color("8a8a8a")); draw_rect(Rect2(pegs + Vector2(2, -4), Vector2(1, 4)), Color("8a8a8a"))
	draw_rect(Rect2(pegs + Vector2(7, 2), Vector2(8, 7)), Color("6a4a2a"))      # a coil of rope
	draw_rect(Rect2(pegs + Vector2(9, 4), Vector2(4, 3)), WOOD_DARK)
	# the name boards over the stalls, chalked with each name
	for i in starters.size():
		var s: Mover = starters[i]
		var o := Vector2(7 + i * 4, 2) * TILE + Vector2(9, 4)          # over its stall, even after it leaves with you
		draw_rect(Rect2(o - Vector2(1, 1), Vector2(32, 10)), Figures.OUTLINE)
		draw_rect(Rect2(o, Vector2(30, 8)), Color("2e3a32"))
		var nm: String = DATA.SPECIES[s.id].name
		draw_string(ThemeDB.fallback_font, o + Vector2(0, 7), nm, HORIZONTAL_ALIGNMENT_CENTER, 30, 6, Color("e8e4d8"))
	# a lantern on the post by the door
	var lo := Vector2(13, 11) * TILE + Vector2(4, 2)
	draw_rect(Rect2(lo - Vector2(1, 1), Vector2(6, 8)), Figures.OUTLINE)
	draw_rect(Rect2(lo, Vector2(4, 6)), Color("f2c050"))
	draw_rect(Rect2(lo + Vector2(1, -4), Vector2(2, 3)), Color("3a3a3a"))

const BARN_WINDOWS := [6, 16]

func _draw_barn_light() -> void:
	# light falling from the high windows, and the lantern's glow (drawn over everything, soft)
	for wx in BARN_WINDOWS:
		var a := Vector2(wx, 1) * TILE + Vector2(2, 16)
		var poly := PackedVector2Array([a, a + Vector2(12, 0), a + Vector2(30, 70), a + Vector2(8, 70)])
		draw_colored_polygon(poly, Color(1.0, 0.95, 0.75, 0.10))
		for k in 3:                                                                # dust in the light
			var dp := a + Vector2(10 + k * 6 + sin(t * 0.7 + k) * 4.0, fmod(t * 4.0 + k * 23.0, 64.0))
			draw_rect(Rect2(dp, Vector2(1, 1)), Color(1, 1, 0.9, 0.35))
	var lo := Vector2(13, 11) * TILE + Vector2(6, 5)
	for k in 3:
		draw_circle(lo, 10.0 + k * 9.0 + sin(t * 3.0) * 1.5, Color(1.0, 0.8, 0.4, 0.05))

## Floorboards: three boards to a tile, with seams, a lighter top edge, joints staggered from row to row, and nails.
func _boards(o: Vector2, x: int, y: int) -> void:
	var base := Color("8a6440")
	draw_rect(Rect2(o, Vector2(16, 16)), base)
	for k in 3:
		var by := k * 5 + 1
		var shade := base.darkened(0.04 * ((k + y) % 3))
		draw_rect(Rect2(o + Vector2(0, by), Vector2(16, 4)), shade)
		draw_rect(Rect2(o + Vector2(0, by), Vector2(16, 1)), shade.lightened(0.1))
		draw_rect(Rect2(o + Vector2(0, by + 4), Vector2(16, 1)), base.darkened(0.35))
		var jx := (k * 29 + y * 53 + 7) % 48                    # where this board ends and the next begins
		if jx >= (x % 3) * 16 and jx < (x % 3) * 16 + 16:
			draw_rect(Rect2(o + Vector2(jx % 16, by), Vector2(1, 4)), base.darkened(0.35))
			draw_rect(Rect2(o + Vector2(jx % 16 + 2, by + 2), Vector2(1, 1)), Color("4a3a2a"))

func _sacks(o: Vector2) -> void:
	for k in 2:
		var s := o + Vector2(1 + k * 7, 3 - k * 2)
		draw_rect(Rect2(s, Vector2(8, 12)), Figures.OUTLINE)
		draw_rect(Rect2(s + Vector2(1, 1), Vector2(6, 10)), Color("d8c8a0"))
		draw_rect(Rect2(s + Vector2(2, 1), Vector2(4, 1)), Color("a89870"))
		draw_rect(Rect2(s + Vector2(2, 5), Vector2(4, 2)), Color("7a8a4a"))      # a stencilled leaf

func _bale(o: Vector2) -> void:
	draw_rect(Rect2(o + Vector2(0, 2), Vector2(16, 13)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(1, 3), Vector2(14, 11)), STRAW)
	draw_rect(Rect2(o + Vector2(1, 3), Vector2(14, 2)), STRAW.lightened(0.2))
	draw_rect(Rect2(o + Vector2(4, 3), Vector2(1, 11)), Color("a07838"))
	draw_rect(Rect2(o + Vector2(11, 3), Vector2(1, 11)), Color("a07838"))

func _stall_board(o: Vector2, x: int, y: int) -> void:
	var top: bool = BARN[y - 1][x] != "|"
	draw_rect(Rect2(o + Vector2(5, -6 if top else 0), Vector2(6, 22 if top else 16)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(6, -5 if top else 0), Vector2(4, 21 if top else 16)), WOOD_LIGHT)
	draw_rect(Rect2(o + Vector2(6, 4), Vector2(4, 1)), WOOD_DARK)
	draw_rect(Rect2(o + Vector2(6, 11), Vector2(4, 1)), WOOD_DARK)

func _trough(o: Vector2) -> void:
	draw_rect(Rect2(o + Vector2(0, 4), Vector2(16, 11)), Figures.OUTLINE)
	draw_rect(Rect2(o + Vector2(1, 5), Vector2(14, 9)), WOOD)
	draw_rect(Rect2(o + Vector2(2, 6), Vector2(12, 3)), Color("5a9ad0"))
	draw_rect(Rect2(o + Vector2(3, 6), Vector2(4, 1)), Color("a8d8f0"))

func _draw_tile(x: int, y: int, ch: String) -> void:
	var o := Vector2(x, y) * TILE
	match ch:
		"=":
			# fences join their neighbours: rails run across, down, or both at a corner, with a post in the middle
			var rail := Color("a0703a")
			var l := tile_at(Vector2i(x - 1, y)) == "=" or tile_at(Vector2i(x - 1, y)) == "."
			var r := tile_at(Vector2i(x + 1, y)) == "=" or tile_at(Vector2i(x + 1, y)) == "."
			var u := tile_at(Vector2i(x, y - 1)) == "="
			var d := tile_at(Vector2i(x, y + 1)) == "="
			if l or r or not (u or d):
				var x0 := 0 if l else 7
				var x1 := 16 if r else 9
				draw_rect(Rect2(o + Vector2(x0, 6), Vector2(x1 - x0, 2)), rail)
				draw_rect(Rect2(o + Vector2(x0, 10), Vector2(x1 - x0, 2)), rail)
			if u or d:
				var y0 := 0 if u else 6
				var y1 := 16 if d else 12
				draw_rect(Rect2(o + Vector2(6, y0), Vector2(1, y1 - y0)), rail)
				draw_rect(Rect2(o + Vector2(9, y0), Vector2(1, y1 - y0)), rail)
			draw_rect(Rect2(o + Vector2(6, 4), Vector2(4, 10)), Color("7a5028"))   # the post
			draw_rect(Rect2(o + Vector2(6, 4), Vector2(4, 1)), Color("b8885a"))
		"P":
			# the ground underneath comes from the tileset (_draw_ground); the sign gets an outline so it reads on any ground
			draw_rect(Rect2(o + Vector2(6, 7), Vector2(4, 9)), Figures.OUTLINE)
			draw_rect(Rect2(o + Vector2(7, 7), Vector2(2, 8)), Color("6b4a2a"))
			draw_rect(Rect2(o + Vector2(1, 1), Vector2(14, 9)), Figures.OUTLINE)
			draw_rect(Rect2(o + Vector2(2, 2), Vector2(12, 7)), Color("d8a868"))
			draw_rect(Rect2(o + Vector2(2, 5), Vector2(12, 1)), Color("a0703a"))
			draw_rect(Rect2(o + Vector2(4, 3), Vector2(6, 1)), Color("6b4a2a"))
			draw_rect(Rect2(o + Vector2(4, 7), Vector2(8, 1)), Color("6b4a2a"))

# ---------------------------------------------------------------- the speech bubble, captions and the faded world
func _update_ui() -> void:
	var to_screen := get_viewport().get_canvas_transform()
	var line: Dictionary = lines[0] if not lines.is_empty() else {}
	bubble.visible = not line.is_empty() and trans_t < 0.0
	if bubble.visible:
		bubble_text.text = line.text + "   ▸"
		var who: Mover = null
		for m in [maren, wren] + npcs:
			if line.who == m.id and m.where == map_name:
				who = m
		var w := 240.0
		bubble.size = Vector2(w, 0)
		bubble.reset_size()
		if who:
			var p := to_screen * (Vector2(who.pos.x, min(who.pos.y, me.pos.y)) + Vector2(8, -6))   # above the speaker, never over you
			bubble.position = Vector2(clamp(p.x - w / 2, 4, 384 - w - 4), max(4, p.y - bubble.size.y - 6))
		else:
			bubble.position = Vector2((384 - w) / 2, 216 - bubble.size.y - 8)   # narration sits low, like a book's caption
	satchel.text = _satchel_text()
	place.modulate.a = move_toward(place.modulate.a, 0.0, get_process_delta_time() * 0.4) if t > 2.0 else minf(1.0, t)
	# the faded world: pass each restored circle on this map to the shader, in real screen pixels
	var final := get_viewport().get_final_transform()
	var pts := PackedVector4Array()
	var here := restore.filter(func(r): return r.where == map_name)
	here.sort_custom(func(a, b): return a.at.distance_to(me.pos) < b.at.distance_to(me.pos))   # the shader shows the 8 nearest
	for r in here.slice(0, 8):
		var sp: Vector2 = final * (to_screen * r.at)
		pts.append(Vector4(sp.x, sp.y, r.r * final.get_scale().x, 0))
	var count := pts.size()
	while pts.size() < 8:
		pts.append(Vector4.ZERO)
	var mat: ShaderMaterial = $FadeWorld/Shade.material
	mat.set_shader_parameter("points", pts)
	mat.set_shader_parameter("count", count)

# ---------------------------------------------------------------- the environment (Ninja Adventure tilesets, CC0)
# Evan (2026-10-08) liked the pack's structures and nature. Figures stay our own (figures.gd). Each tile or object
# is picked by its cell in a 16x16 grid: floor.png (ground), nature.png (trees, bushes, flowers), house.png (houses).
const FLOOR := preload("res://assets/env/floor.png")
const NATURE := preload("res://assets/env/nature.png")
const HOUSE := preload("res://assets/env/house.png")
const WATER := preload("res://assets/env/water.png")
const BARN_SPRITE := Rect2(400, 224, 64, 80)  # Maren's barn in house.png: measured pixel by pixel (4x5 tiles, door in the 2nd column)
func _tex(tex: Texture2D, cell: Vector2i, size: Vector2i, at: Vector2) -> void:
	draw_texture_rect_region(tex, Rect2(at, Vector2(size) * 16.0), Rect2(Vector2(cell) * 16.0, Vector2(size) * 16.0))
func _is_path(x: int, y: int) -> bool:
	return tile_at(Vector2i(x, y)) in ".NSEW"
func _draw_ground(x: int, y: int, ch: String) -> void:
	var o := Vector2(x, y) * TILE
	var n := (x * 7 + y * 13) % 9
	_tex(FLOOR, Vector2i(11 + (n if n < 5 else 0), 12), Vector2i.ONE, o)          # grass, with a few tufts
	if _is_path(x, y):
		# dirt with soft grass edges where the path ends (the tileset's 3x3 edge set)
		var up := _is_path(x, y - 1); var down := _is_path(x, y + 1); var left := _is_path(x - 1, y); var right := _is_path(x + 1, y)
		var cell := Vector2i(12, 8)
		if (up or down) and (left or right):
			cell = Vector2i(11 if not left else (13 if not right else 12), 7 if not up else (9 if not down else 8))
		_tex(FLOOR, cell, Vector2i.ONE, o)
	elif ch == "f":
		_tex(NATURE, [Vector2i(0, 11), Vector2i(3, 11), Vector2i(6, 11)][n % 3], Vector2i.ONE, o)
	elif ch == "\"":
		# tall grass: two clumps of blades per tile that sway, where wild creatures hide
		var sway := int(sin(t * 1.6 + x * 0.7 + y * 0.4) * 1.5)
		_tex(NATURE, Vector2i(4 + n % 2, 10), Vector2i.ONE, o + Vector2(-3 + sway, -3))
		_tex(NATURE, Vector2i(5 - n % 2, 10), Vector2i.ONE, o + Vector2(4 + sway, 2))
	elif ch == "~":
		_draw_water(x, y, o, n)
func _draw_structures() -> void:
	var rows: Array = cur_map()
	var doors: Array[Vector2i] = []
	for y in rows.size():
		for x in rows[0].length():
			if rows[y][x] == "D": doors.append(Vector2i(x, y))
	for y in rows.size():
		for x in rows[0].length():
			var ch: String = rows[y][x]
			if ch == "T":
				_tex(NATURE, Vector2i(1, 10), Vector2i.ONE, Vector2(x, y) * TILE)        # a hedge bush under the treeline
			elif ch in "r#" and not doors.any(func(d): return x - d.x >= -1 and x - d.x <= 2 and y >= d.y - 2 and y <= d.y):
				_tex(NATURE, Vector2i(0, 10), Vector2i.ONE, Vector2(x, y) * TILE)        # garden bushes beside each cottage
	for d in doors:
		if not (map_name == "larkhaven" and d == BARN_DOOR):
			_tex(HOUSE, Vector2i(0, 0), Vector2i(4, 3), Vector2(d.x - 1, d.y - 2) * TILE)  # the whole cottage (4 tiles wide), its door on our door
	for y in rows.size():                                                               # big trees, back to front
		for x in rows[0].length():
			if rows[y][x] == "T" and (x + y) % 2 == 0:       # staggered, half a tile off the grid, so the edge reads as woods
				_tex(NATURE, Vector2i(0 if (x * 3 + y) % 4 < 2 else 2, 0), Vector2i(2, 2), Vector2(x - 0.5, y - (1.5 if tile_at(Vector2i(x, y - 1)) == "T" else 0.25)) * TILE)   # edge rows sit low so they never hide the town
	# Maren's barn stands taller than the cottages and in front of the trees behind it
	if map_name == "larkhaven":
		draw_texture_rect_region(HOUSE, Rect2(Vector2(BARN_DOOR.x - 1, BARN_DOOR.y - 4) * TILE, BARN_SPRITE.size), BARN_SPRITE)

# ---------------------------------------------------------------- Wren and the first battle
func _beside_me() -> Vector2i:
	for d in [Vector2i.LEFT, Vector2i.UP, Vector2i.RIGHT, Vector2i.DOWN]:
		var p: Vector2i = me.tile + d
		if walkable(p) and tile_at(p) != "D" and not route(wren.tile, p).is_empty():
			return p
	return me.tile + Vector2i.LEFT

## Story lines from the browser game, with {name}, {starter} and {rival} filled in.
func _fill(s: String) -> String:
	return s.replace("{name}", my_look.get("name", "Tamer")).replace("{starter}", _partner_name()).replace("{rival}", rival_c.get("name", "its partner"))

func _on_battle(result: String) -> void:
	if battle_story.begins_with("trainer:"):
		var who := battle_story.substr(8)
		battle_story = ""
		_after_trainer(who, result)
		return
	if battle_story != "rival1":
		_after_wild(result)
		return
	battle_story = ""
	stage = "after_rival"
	for c in team:
		c.hp = R.stats(c).hp                       # Maren patches everyone up after the first battle
	if result == "won":
		for l in DATA.SCENES.rival1Win:
			say(l[0], _fill(l[1]))
	else:
		say("wren", _fill("Ha! Told you it was strategy. Don't worry, {starter} just needs a few more days with you."))
		say("maren", _fill("There, all patched up. Losing your first battle is a fine tradition, {name}. Wren lost theirs to a goose."))
		say("wren", "That goose was a professional.")

## Water (the pack's water tiles, CC0): open water with now and then a lily pad or a glint, and a sandy shore with a dark
## edge drawn wherever the water meets land.
func _draw_water(x: int, y: int, o: Vector2, n: int) -> void:
	_tex(WATER, Vector2i(11, 0), Vector2i.ONE, o)
	if n == 4:
		_tex(WATER, Vector2i(11, 3), Vector2i.ONE, o)                              # a lily pad
	elif n == 7 and int(t * 1.5 + x) % 3 == 0:
		_tex(WATER, Vector2i(11, 2), Vector2i.ONE, o)                              # a glint of light
	var shore := Color("d8c088")
	var edge := Color("4a6a8a")
	if tile_at(Vector2i(x, y - 1)) != "~":
		draw_rect(Rect2(o, Vector2(16, 3)), shore); draw_rect(Rect2(o + Vector2(0, 3), Vector2(16, 1)), edge)
	if tile_at(Vector2i(x, y + 1)) != "~":
		draw_rect(Rect2(o + Vector2(0, 13), Vector2(16, 3)), shore); draw_rect(Rect2(o + Vector2(0, 12), Vector2(16, 1)), edge)
	if tile_at(Vector2i(x - 1, y)) != "~":
		draw_rect(Rect2(o, Vector2(3, 16)), shore); draw_rect(Rect2(o + Vector2(3, 0), Vector2(1, 16)), edge)
	if tile_at(Vector2i(x + 1, y)) != "~":
		draw_rect(Rect2(o + Vector2(13, 0), Vector2(3, 16)), shore); draw_rect(Rect2(o + Vector2(12, 0), Vector2(1, 16)), edge)

# ---------------------------------------------------------------- out in the wild: items, tall grass, finds, catching
## After each step: pick up anything lying there, and in tall grass, every 8-16 steps you find something (explore()
## in the browser game): a wild creature (62%), a small find (14%), or a moment in the woods.
func _arrived(p: Vector2i) -> void:
	if map_name == "barn" or stage != "free":
		return
	for it in DATA.MAPS[map_name].get("items", []):
		if not got_items.has(it.id) and Vector2i(int(it.at[0]), int(it.at[1])) == p:
			got_items[it.id] = true
			var found: Array = []
			for k in it.give:
				bag[k] = int(bag.get(k, 0)) + int(it.give[k])
				found.append("%d %s" % [int(it.give[k]), k])
			say("", "You found %s!" % " and ".join(found))
	if tile_at(p) == "\"" and DATA.MAPS[map_name].has("biome"):
		grass_n -= 1
		if grass_n <= 0:
			grass_n = rng.randi_range(8, 16)
			walk_to.clear()
			_explore()

func _explore() -> void:
	if team.filter(func(c): return c.hp > 0).is_empty():
		say("", "Your team is exhausted. Rest with Maren in Larkhaven first.")
		return
	var r := rng.randf()
	if r < 0.62:
		_wild_battle()
	elif r < 0.76:
		if rng.randf() < 0.5:
			var c := roundi(rng.randi_range(8, 20) * float(DATA.JOURNEY.classic.coins))
			bag.coins += c
			say("", "You find %d coins under a fallen log." % c)
		else:
			bag.lures += 1
			say("", "You find a lure caught in some brambles.")
	else:
		say("", ["You follow a stream deeper into Thornwood.", "Birdsong all around. Your team looks happy.", "You rest in a sunny clearing for a moment.",
			"Pawprints in the mud lead off between the trees.", "A breeze rustles the old oaks."][rng.randi() % 5])

## A wild creature from this place's table (wildPick and wildLvl): weighted by how common each is, its level near your
## team's, within the area's range.
func _wild_battle() -> void:
	var biome: Dictionary = DATA.BIOMES[DATA.MAPS[map_name].biome]
	var total := 0.0
	for w in biome.wild:
		total += float(w[1])
	var roll := rng.randf() * total
	var id: String = biome.wild[0][0]
	for w in biome.wild:
		roll -= float(w[1])
		if roll <= 0.0:
			id = w[0]
			break
	var avg := 0.0
	for c in team:
		avg += c.lvl
	avg = roundf(avg / maxf(1.0, team.size()))
	var lvl := clampi(rng.randi_range(int(avg) - 2, int(avg) + 1), int(biome.lv[0]), int(biome.lv[1]))
	var foe := R.make(id, lvl, { "rar": R.roll_rarity(float(DATA.JOURNEY.classic.rare), rng) }, rng)
	seen[id] = true
	battle_story = ""
	battle.open("wild", team, [foe], "")

func _after_wild(result: String) -> void:
	for c in battle.caught:
		restore.append({ "where": map_name, "at": me.pos + Vector2(8, 8), "r": 0.0, "goal": 64.0 })   # trust brings the colour back
		bonded[c.sp] = true
		seen[c.sp] = true
		if team.size() < 3:
			team.append(c)
			say("", "%s joins your team." % c.name)
		else:
			ranch.append(c)
			say("", "%s heads to Maren's ranch, where your other creatures rest." % c.name)
	if result == "lost":
		var lost := roundi(bag.coins * 0.1)
		bag.coins -= lost
		_go("larkhaven", Vector2i(18, 6), Vector2i.UP)
		for c in team:
			c.hp = R.stats(c).hp
		say("", "Your team is exhausted. You hurry back to Larkhaven%s." % (" (-%d coins)" % lost if lost > 0 else ""))
		say("maren", "Oh, look at you all. Sit down, sit down. There. Everyone's rested.")

func _maren_heals() -> void:
	for c in team:
		c.hp = R.stats(c).hp
	me.face = maren.tile - me.tile
	say("maren", ["Let me look at you all... There. Good as new. Off you go.", "Rested and fed. Mind the bramble patches out there.",
		"Everyone's fine, love. %s wants to show you something in the tall grass, I think." % _partner_name()][rng.randi() % 3])

func _satchel_text() -> String:
	if stage != "free" or battle.visible:
		return ""
	var dex := 0
	for k in seen:
		dex += 1
	return "Badges %d   Lures %d   Berries %d   Coins %d   Wilddex %d / %d" % [badges.size(), bag.lures, bag.berries, bag.coins, dex, DATA.SPECIES.size()]

## For testing and recordings (run with -- --skip-opening): start in Thornwood with Ripplet, as if the opening were done.
func _skip_opening() -> void:
	my_look = LOOKS.tamer.duplicate()
	my_look.name = "Rowan"
	painted = true
	spilled = true
	for s in starters:
		if s.id == "ripplet":
			partner = s
	partner.home = Rect2i()
	team = [R.make("ripplet", 5, { "rar": 1 }, rng)]
	rival_c = R.make("mosshog", 4, { "rar": 1 }, rng)
	seen = { "ripplet": true, "mosshog": true }
	bonded = { "ripplet": true }
	wren.where = "gone"
	maren.where = "larkhaven"
	maren.tile = BARN_DOOR + Vector2i(1, 1)
	maren.pos = Vector2(maren.tile) * TILE
	stage = "free"
	fade_in = 1.0
	_go("thornwood", Vector2i(13, 14), Vector2i.UP)
	trans_t = 0.29

# ---------------------------------------------------------------- people of the valley: route trainers and Wardens
## Everyone standing in the built maps, from the game data (MAPS[..].npcs and the Warden's spot), dressed from CAST.
func _make_npcs() -> void:
	for map_id in BUILT:
		if map_id == "larkhaven":
			continue                                 # Larkhaven's people are in the story already (Maren, Wren)
		var m: Dictionary = DATA.MAPS[map_id]
		for n in m.get("npcs", []):
			var mv := Mover.new(n.who, map_id, Vector2i(int(n.at[0]), int(n.at[1])))
			mv.face = DIRS.get(n.get("dir", "down"), Vector2i.DOWN)
			mv.right = mv.face.x >= 0
			npcs.append(mv)
			npc_info[n.who] = { "data": n, "beaten": false, "warden": false }
		if m.has("warden"):
			var beat: Dictionary = {}
			for b in DATA.STORY:
				if b.get("id", "") == "warden" and map_id == "thornwood":
					beat = b
			var who := "isolde"
			var mv := Mover.new(who, map_id, Vector2i(int(m.warden[0]), int(m.warden[1])))
			mv.face = Vector2i.DOWN
			npcs.append(mv)
			npc_info[who] = { "data": beat, "beaten": false, "warden": true }

## A person's look from CAST in the game data (skin, hair style and colour, shirt), as parts for figures.gd.
func _cast_look(who: String) -> Dictionary:
	var c: Dictionary = DATA.CAST.get(who, {})
	var style: String = c.get("hair", "short")
	if style not in ["cap", "short", "long", "ponytail", "bun", "spiky"]:
		style = "short"
	var shirt := Color(c.get("shirt", "#7a6a5a"))
	return { "skin": Color(c.get("skin", "#e8c4a0")), "hair": Color(c.get("hairCol", "#4a3a2a")), "shirt": shirt,
		"legs": shirt.darkened(0.45), "style": style, "body": "narrow" if style in ["long", "bun", "ponytail"] else "broad" }

## Whether a map's gate is open: its Warden has been beaten (or it has none).
func _gate_open(map_id: String) -> bool:
	for n in npcs:
		if n.where == map_id and npc_info[n.id].warden:
			return npc_info[n.id].beaten
	return true

## After each of your steps: has a trainer who hasn't battled you yet seen you? (They look straight ahead, `sight` tiles.)
func _check_spotted() -> void:
	if spotter or stage != "free" or battle.visible:
		return
	for n in npcs:
		var info: Dictionary = npc_info[n.id]
		if n.where != map_name or info.warden or info.beaten or not info.data.has("trainer"):
			continue
		var sight := int(info.data.trainer.get("sight", 3))
		for k in range(1, sight + 1):
			var p: Vector2i = n.tile + n.face * k
			if solid(tile_at(p)):
				break
			if p == me.tile:
				spotter = n
				walk_to.clear()
				me.face = -n.face
				n.path = route(n.tile, me.tile - n.face) if k > 1 else []
				n.speed = 5.0
				spot_t = 0.0
				return

func _spotter_tick(dt: float) -> void:
	if not spotter:
		return
	spot_t += dt
	if spot_t < 0.7 or not spotter.path.is_empty():
		return                                       # the "!" over their head, then they walk over
	var n := spotter
	spotter = null
	n.speed = 4.0
	n.face = me.tile - n.tile
	_challenge(n)

## A trainer or a Warden challenges you: their lines, then the battle.
func _challenge(n: Mover) -> void:
	var info: Dictionary = npc_info[n.id]
	var d: Dictionary = info.data
	for l in (d.get("lines", []) as Array):
		say(l[0], _fill(l[1]))
	var team_data: Array = d.trainer.team if d.has("trainer") and d.trainer is Dictionary else d.get("team", [])
	then_do = func():
		var foes: Array = []
		for t2 in team_data:
			foes.append(R.make(t2[0], int(t2[1]), { "rar": 1 }, rng))
			seen[t2[0]] = true
		battle_story = "trainer:" + n.id
		battle.open("trainer", team, foes, DATA.CAST.get(n.id, {}).get("name", n.id.capitalize()))

func _after_trainer(who: String, result: String) -> void:
	var info: Dictionary = npc_info[who]
	var d: Dictionary = info.data
	if result == "won":
		info.beaten = true
		var lv_sum := 0
		for f in battle.foes:
			lv_sum += int(f.c.lvl)
		var coins := roundi(lv_sum * 12 * float(DATA.JOURNEY.classic.coins))
		bag.coins += coins
		var win: Array = d.trainer.win if d.has("trainer") and d.trainer is Dictionary else d.get("win", [])
		for l in win:
			say(l[0], _fill(l[1]))
		say("", "You win %d coins." % coins)
		if info.warden:
			var badge: String = d.get("gate", "thorn")
			badges.append(badge)
			restore.append({ "where": map_name, "at": me.pos + Vector2(8, 8), "r": 0.0, "goal": 200.0 })
			say("", "You earned the %s! The hawthorn gate creaks open, and colour runs out across Thornwood." % DATA.BADGES[badge].name)
	else:
		_after_wild("lost")

## Talking to someone beside you: a trainer you've beaten, a Warden, or a sign in front of you.
func _talk_here() -> bool:
	for n in npcs:
		if n.where == map_name and (me.tile - n.tile).length() <= 1.01:
			var info: Dictionary = npc_info[n.id]
			n.face = me.tile - n.tile
			if info.warden and info.beaten:
				say(n.id, _fill(DATA.MAPS[map_name].get("wardenDone", "The gate is yours, {name}.")))
			elif info.beaten:
				for l in (info.data.trainer.get("after", []) as Array):
					say(l[0], _fill(l[1]))
			else:
				_challenge(n)
			return true
	var ahead: Vector2i = me.tile + me.face
	if tile_at(ahead) == "P":
		var key := "%d,%d" % [ahead.x, ahead.y]
		say("", str(DATA.MAPS[map_name].get("signs", {}).get(key, "The sign is too weathered to read.")))
		return true
	return false

## Whether someone is standing still on a tile (people in the world and Maren), so walks go around them.
func _someone_standing(p: Vector2i) -> bool:
	for m in npcs + [maren]:
		if m.where == map_name and m.tile == p and m.path.is_empty():
			return true
	return false
