extends Node2D
## Wildbond in Godot: the trial slice (2026-10-07; see README.md and docs/wildbond-plan.md).
## Faded Larkhaven, walkable on the real map. Maren walks up and speaks in bubbles over her head; you sign her ranch
## register (the character creator, register.gd) and the ink paints you into the faded world in colour; you walk to a
## young creature in the paddock and bond with it, and colour bursts back into the world around it. People and
## creatures are built from parts (figures.gd); the ground, trees and houses are Ninja Adventure tiles (CC0).
## Everything draws on a 384x216 pixel canvas scaled by whole numbers, so it stays crisp on any screen.

const Figures := preload("res://scripts/figures.gd")
const Register := preload("res://scripts/register.gd")
const TILE := 16
const SOLID := "Tr#=P"                       # trees, roofs, walls, fences and signs block you
const MAP := [                               # Larkhaven, from games/wildbond/js/11-maps.js
	"TTTTTTTTTTNNTTTTTTTTTTTT",
	"T,,,,,,,,,..P,,,,,,,,,,T",
	"T,rrrrr,,,..,,,,rrrrr,,T",
	"T,rrrrr,,,..,,,,rrrrr,,T",
	"T,##D##,,,..,,,,##D##,,T",
	"T,,,.,,,,,..,,,,,,.,,,,T",
	"T,,.................,f,T",
	"T,f,,,,,,,..,,,,,,,,,,,T",
	"T,,,,rrrrr..,=======,,,T",
	"T,,,,rrrrr..,=,,,,,=,,,T",
	"T,,,,##D##..,=,,,,,=,f,T",
	"T,f,,,,.,,..,===.===,,,T",
	"T,,,,,,..........,,,,,,T",
	"TTTTTTTTTTTTTTTTTTTTTTTT",
]
const PADDOCK := Rect2i(14, 9, 5, 2)        # the open ground inside the ranch fence
## People's looks (figures.gd explains the keys). The tamer's is replaced by what you sign in the register.
const LOOKS := {
	"tamer": { "skin": Color("f1c9a0"), "hair": Color("6b4423"), "hat": Color("2a3f6b"), "shirt": Color("d8453a"), "legs": Color("3a4a6a"), "style": "cap" },
	"maren": { "skin": Color("e8c4a0"), "hair": Color("c9c3b8"), "shirt": Color("7a5236"), "apron": Color("4f8a5a"), "legs": Color("7a5236"), "style": "bun", "outfit": "skirt" },
}
const CUB_LOOK := { "body": Color("d8642e"), "belly": Color("f4e4c8"), "dark": Color("5a2a14") }

# the people and creatures on the map: tile, smooth draw position, walking queue, and what they're up to
class Mover:
	var tile := Vector2i.ZERO
	var pos := Vector2.ZERO
	var path: Array[Vector2i] = []
	var speed := 4.0
	var right := true
	var step_t := 0.0
	var face := Vector2i.DOWN                # which way they look: front, back or side
	var act := "idle"                        # creatures: idle, sniff, sit, pounce, curious
	var act_t := 0.0
	var act_len := 1.0
	var hop := 0.0                           # height off the ground (a pounce, a hop for joy)
	var target := Vector2i.ZERO
	func _init(t: Vector2i) -> void:
		tile = t
		pos = Vector2(t) * 16.0

var me := Mover.new(Vector2i(11, 7))
var maren := Mover.new(Vector2i(7, 11))
var cub := Mover.new(Vector2i(16, 9))
var cub_bonded := false
var my_look: Dictionary = LOOKS.tamer
var painted := false                         # signed the register: you keep your colour in the faded world
var paint_t := -1.0
var restore: Array = []                      # [{at: Vector2 world px, r: float, goal: float}]
var lines: Array = []                        # dialogue queue: [{who: "maren" | "" (narration), text}]
var stage := "intro"
var t := 0.0
var fade_in := 0.0
var demo := false
var demo_t := 0.0
var fly := Vector2.ZERO                      # a butterfly over the paddock, for the cub to chase
var fly_scare := 0.0
var rng := RandomNumberGenerator.new()
var register: Control

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
	cam.limit_right = MAP[0].length() * TILE
	cam.limit_bottom = MAP.size() * TILE
	cam.position = me.pos + Vector2(8, 8)
	colour_layer.draw.connect(_draw_painted)
	register = Register.new()
	register.keep = not demo
	$UI.add_child(register)
	register.signed.connect(_on_signed)
	say("", "The supply cart stops at the edge of the trees. Larkhaven: a handful of roofs and a ranch fence that runs right up to the forest.")
	say("", "Everything here looks faded, like an old picture left in the sun. You too.")

# ---------------------------------------------------------------- dialogue
func say(who: String, text: String) -> void:
	lines.append({ "who": who, "text": text })

func advance() -> void:
	if lines.is_empty():
		return
	lines.pop_front()
	if lines.is_empty():
		_after_talk()

func _after_talk() -> void:
	if stage == "intro":
		stage = "maren_walks"
		maren.path = route(maren.tile, Vector2i(11, 8))
	elif stage == "maren_talks":
		stage = "register"
		register.open()
	elif stage == "signed":
		stage = "to_paddock"
		maren.path = route(maren.tile, Vector2i(18, 12))   # beside the gate, not in front of it
		caption.text = "Walk to the little one in the paddock (arrow keys or WASD). Press Enter beside it."
	elif stage == "bonded":
		stage = "free"
		caption.text = "End of the trial. Walk around Larkhaven; your partner follows you."

func _on_signed(look: Dictionary) -> void:
	# the ink dries and colour runs into you: you are the one bright thing in the faded valley
	my_look = look
	painted = true
	paint_t = 0.0
	stage = "signed"
	say("", "As the ink dries, colour runs into you: your hands, your clothes, your hair. You're the only bright thing on the road.")
	say("maren", "%s. Good name. And look at you, bright as a new penny!" % look.name)
	say("maren", "Don't mind the rest of it. The whole valley faded long ago. Like an old photo, isn't it?")
	say("maren", "Folk say it comes back, a little, every time someone earns a creature's trust. Come and see.")

# ---------------------------------------------------------------- the map
func tile_at(p: Vector2i) -> String:
	if p.y < 0 or p.y >= MAP.size() or p.x < 0 or p.x >= MAP[0].length():
		return "T"
	return MAP[p.y][p.x]

func walkable(p: Vector2i) -> bool:
	if tile_at(p) in SOLID:
		return false
	for m in [me, maren, cub]:
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
			if prev.has(n) or tile_at(n) in SOLID:
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

# ---------------------------------------------------------------- the loop
func _process(dt: float) -> void:
	t += dt
	fade_in = min(1.0, fade_in + dt * 0.7)
	fade_rect.color.a = 1.0 - fade_in
	if paint_t >= 0.0:
		paint_t += dt
	if demo:
		_demo(dt)
	_butterfly(dt)
	_cub_think(dt)
	_walk(maren, dt)
	_walk(cub, dt)
	_walk(me, dt)
	if stage == "maren_walks" and maren.path.is_empty() and maren.pos.distance_to(Vector2(maren.tile) * TILE) < 0.5:
		stage = "maren_talks"
		say("maren", "There you are! You must be the new tamer. I'm Maren. I keep the ranch.")
		say("maren", "Before anything else: the ranch register. Every tamer in the valley signs it. Write yourself in, love.")
	if lines.is_empty() and stage in ["to_paddock", "free"] and me.path.is_empty() and me.pos.distance_to(Vector2(me.tile) * TILE) < 0.5:
		var d := Vector2i.ZERO
		if Input.is_action_pressed("ui_up") or Input.is_physical_key_pressed(KEY_W): d = Vector2i.UP
		elif Input.is_action_pressed("ui_down") or Input.is_physical_key_pressed(KEY_S): d = Vector2i.DOWN
		elif Input.is_action_pressed("ui_left") or Input.is_physical_key_pressed(KEY_A): d = Vector2i.LEFT
		elif Input.is_action_pressed("ui_right") or Input.is_physical_key_pressed(KEY_D): d = Vector2i.RIGHT
		if d != Vector2i.ZERO:
			me.face = d
			me.right = d.x > 0 if d.x != 0 else me.right
			var was := me.tile
			if cub_bonded and me.tile + d == cub.tile:
				cub.tile = was                       # your partner steps aside, swapping places with you
				cub.pos = Vector2(was) * TILE
			if walkable(me.tile + d):
				me.path = [me.tile + d]
				if cub_bonded and cub.tile != was:
					_cub_stop()
					cub.path = [was]
	for r in restore:
		r.r = move_toward(r.r, r.goal, dt * 70.0)
	cam.position = cam.position.lerp(me.pos + Vector2(8, 8), min(1.0, dt * 8.0))
	_update_ui()
	queue_redraw()
	colour_layer.queue_redraw()

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

func _unhandled_input(e: InputEvent) -> void:
	var pressed: bool = (e.is_action_pressed("ui_accept") or (e is InputEventKey and e.pressed and not e.echo and e.physical_keycode == KEY_E)
		or (e is InputEventMouseButton and e.pressed and e.button_index == MOUSE_BUTTON_LEFT))
	if not pressed:
		return
	if not lines.is_empty():
		advance()
	elif stage == "to_paddock" and not cub_bonded and (me.tile - cub.tile).length() <= 1.01:
		bond()

func bond() -> void:
	# the first bond: the little one chooses you, and colour bursts back into the world around it
	cub_bonded = true
	stage = "bonded"
	_cub_stop()
	restore.append({ "at": cub.pos + Vector2(8, 8), "r": 0.0, "goal": 120.0 })
	caption.text = ""
	say("", "The little one sniffs your hand, then presses its head against it.")
	say("", "Colour floods outward from where it stands: green grass, red roofs, a blue sky over the paddock.")
	say("maren", "...Did you see that? It chose you. And the world remembered a little.")
	say("maren", "That's a bond, love. Nobody owns a creature; they choose. Off you go, then. Look after each other.")

# ---------------------------------------------------------------- the cub: a young creature with a mind of its own
## Before the bond it potters about the paddock: wanders, sniffs the grass, sits, and stalks the butterfly. When you
## come near it stops and watches you, ears up and tail going. After the bond it follows you and does the same things
## whenever you stand still.
func _cub_stop() -> void:
	cub.act = "idle"
	cub.act_t = 0.0
	cub.act_len = 1.0
	cub.hop = 0.0

func _cub_think(dt: float) -> void:
	cub.act_t += dt
	if stage == "bonded":
		cub.hop = -abs(sin(t * 6.0)) * 3.0         # it hops for joy
		return
	if cub.act != "pounce":
		cub.hop = 0.0
	if cub.act == "pounce":
		# crouch and wiggle, then leap one tile at the butterfly (or straight up, once it's following you)
		if cub.act_t >= 0.8 and cub.path.is_empty() and cub.target != cub.tile and walkable(cub.target):
			cub.speed = 3.0
			cub.path = [cub.target]
			cub.target = cub.tile
			fly_scare = 2.0
		var k := clampf((cub.act_t - 0.8) / 0.4, 0.0, 1.0)
		cub.hop = -sin(k * PI) * 6.0
		if cub.act_t > 1.5:
			cub.speed = 4.0
			_cub_stop()
		return
	if not cub.path.is_empty():
		return
	var near := (Vector2(me.tile) - Vector2(cub.tile)).length() <= 3.0
	if not cub_bonded and stage in ["to_paddock", "signed", "maren_talks", "register"] and near:
		cub.act = "curious"                        # it has seen you: it stops and watches
		cub.right = me.pos.x > cub.pos.x
		return
	if cub.act == "curious":
		_cub_stop()
	if cub.act_t < cub.act_len:
		return
	var r := rng.randf()
	cub.act_t = 0.0
	var fly_tile := Vector2i((fly / TILE).floor())
	if r < 0.3 and not cub_bonded:
		var dirs := [Vector2i.UP, Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT]
		var to: Vector2i = cub.tile + dirs[rng.randi() % 4]
		cub.act = "idle"
		cub.act_len = rng.randf_range(0.6, 1.6)
		if PADDOCK.has_point(to) and walkable(to):
			cub.path = [to]
	elif r < 0.5:
		cub.act = "sniff"
		cub.act_len = rng.randf_range(1.5, 3.0)
	elif r < 0.65:
		cub.act = "sit"
		cub.act_len = rng.randf_range(2.5, 4.5)
	elif r < 0.9 and (Vector2(fly_tile) - Vector2(cub.tile)).length() <= 3.0:
		cub.act = "pounce"
		cub.act_len = 1.5
		cub.right = fly.x > cub.pos.x + 8
		var step := Vector2i(signi(fly_tile.x - cub.tile.x), 0)
		cub.target = cub.tile + step
		if cub_bonded or not PADDOCK.has_point(cub.target):
			cub.target = cub.tile                  # following you: it pounces on the spot
	else:
		cub.act = "idle"
		cub.act_len = rng.randf_range(1.0, 2.5)

func _butterfly(dt: float) -> void:
	# it drifts over the paddock and flutters up and away whenever the cub leaps at it
	fly_scare = max(0.0, fly_scare - dt)
	var home := Vector2(PADDOCK.position) * TILE + Vector2(PADDOCK.size) * TILE * 0.5
	if cub_bonded:
		home = me.pos + Vector2(8, -10)
	var goal := home + Vector2(sin(t * 0.7) * 30.0, cos(t * 1.1) * 8.0 - 4.0 - fly_scare * 10.0)
	fly = goal if fly == Vector2.ZERO else fly.lerp(goal, min(1.0, dt * 1.5))

# ---------------------------------------------------------------- the demo (for screenshots: run with -- --demo)
func _demo(dt: float) -> void:
	demo_t += dt
	if demo_t < 1.2:
		return
	demo_t = 0.0
	if stage == "register":
		register.demo_step()
	elif not lines.is_empty():
		advance()
	elif stage == "to_paddock" and not cub_bonded and me.path.is_empty():
		if (me.tile - cub.tile).length() <= 1.01:
			bond()
		else:
			for d in [Vector2i.DOWN, Vector2i.LEFT, Vector2i.RIGHT, Vector2i.UP]:
				var to: Vector2i = cub.tile + d
				if walkable(to) and not route(me.tile, to).is_empty():
					me.path = route(me.tile, to)
					break

# ---------------------------------------------------------------- drawing
func _draw() -> void:
	# 1. the ground (Ninja Adventure tiles, CC0): grass everywhere, dirt on paths, flowers here and there
	for y in MAP.size():
		for x in MAP[0].length():
			_draw_ground(x, y, MAP[y][x])
	# 2. fences and the signpost (drawn in code; they already looked right)
	for y in MAP.size():
		for x in MAP[0].length():
			if MAP[y][x] in "=P":
				_draw_tile(x, y, MAP[y][x])
	# 3. houses and trees: standing objects with a footprint (so a 3D renderer can stand them up later)
	_draw_structures()
	# 4. people and creatures, back to front; you (once signed) and your partner are drawn in colour on their own layer
	var actors := [me, maren, cub]
	actors.sort_custom(func(a, b): return a.pos.y < b.pos.y)
	for i in actors.size():
		var m: Mover = actors[i]
		draw_rect(Rect2(m.pos + Vector2(3, 14), Vector2(10, 2)), Color(0, 0, 0, 0.25))   # a soft shadow
		if not _is_painted(m):
			_draw_actor(self, m, i)
	# 5. the butterfly
	var flap := int(t * 12.0) % 2 == 0
	var wing := Vector2(3, 3) if flap else Vector2(1, 3)
	draw_rect(Rect2(fly + Vector2(-wing.x - 1, -1), wing + Vector2(2, 2)), Figures.OUTLINE)
	draw_rect(Rect2(fly + Vector2(0, -1), wing + Vector2(2, 2)), Figures.OUTLINE)
	draw_rect(Rect2(fly + Vector2(-wing.x, 0), wing), Color("f2d24a"))
	draw_rect(Rect2(fly + Vector2(1, 0), wing), Color("f2d24a"))
	draw_rect(Rect2(fly + Vector2(0, -1), Vector2(1, 4)), Color("3a2a1a"))

func _is_painted(m: Mover) -> bool:
	return (m == me and painted) or (m == cub and cub_bonded)

func _draw_painted() -> void:
	# the colour layer sits above the faded world, so whatever is drawn here keeps its colour everywhere
	var actors := [me, cub].filter(func(m): return _is_painted(m))
	actors.sort_custom(func(a, b): return a.pos.y < b.pos.y)
	for m in actors:
		_draw_actor(colour_layer, m, 0 if m == me else 2)
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
	if m == cub:
		var pose := {
			"walking": walking, "frame": int(m.step_t * 10.0) % 4, "blink": fmod(t + 1.3, 2.9) < 0.12,
			"wag": [1, 0, -1, 0][int(t * (14.0 if m.act == "curious" or stage == "bonded" else 6.0)) % 4],
			"sniff": m.act == "sniff", "twitch": (int(t * 12.0) % 2) if m.act == "sniff" else 0,
			"sit": m.act == "sit", "ears_up": m.act in ["curious", "pounce"] or stage == "bonded",
			"crouch": (2 if m.act_t < 0.8 else 0) if m.act == "pounce" else 0,
		}
		var wiggle := (1.0 if int(t * 16.0) % 2 == 0 else -1.0) if m.act == "pounce" and m.act_t > 0.4 and m.act_t < 0.8 else 0.0
		Figures.creature(ci, m.pos + Vector2(-1 + wiggle, 4 + m.hop), m.right, pose, CUB_LOOK)
		return
	var face := m.face
	if not walking and face == Vector2i.DOWN and fmod(t + i, 6.0) > 5.2:
		face = Vector2i.LEFT if int(t + i) % 2 == 0 else Vector2i.RIGHT   # a glance around while standing
	var look: Dictionary = my_look if m == me else LOOKS.maren
	Figures.person(ci, m.pos + Vector2(2, -5), face, walking, int(m.step_t * 8.0) % 4, fmod(t + i * 1.7, 3.3) < 0.12, look)

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
	bubble.visible = not line.is_empty()
	if bubble.visible:
		bubble_text.text = line.text + "   ▸"
		var who: Mover = maren if line.who == "maren" else null
		var w := 240.0
		bubble.size = Vector2(w, 0)
		bubble.reset_size()
		if who:
			var p := to_screen * (Vector2(who.pos.x, min(who.pos.y, me.pos.y)) + Vector2(8, -6))   # above the speaker, never over you
			bubble.position = Vector2(clamp(p.x - w / 2, 4, 384 - w - 4), max(4, p.y - bubble.size.y - 6))
		else:
			bubble.position = Vector2((384 - w) / 2, 216 - bubble.size.y - 8)   # narration sits low, like a book's caption
	place.modulate.a = clamp(3.5 - t, 0.0, 1.0) if t > 1.0 else t
	# the faded world: pass each restored circle to the shader in real screen pixels
	var final := get_viewport().get_final_transform()
	var pts := PackedVector4Array()
	for r in restore:
		var sp: Vector2 = final * (to_screen * r.at)
		pts.append(Vector4(sp.x, sp.y, r.r * final.get_scale().x, 0))
	while pts.size() < 8:
		pts.append(Vector4.ZERO)
	var mat: ShaderMaterial = $FadeWorld/Shade.material
	mat.set_shader_parameter("points", pts)
	mat.set_shader_parameter("count", restore.size())

# ---------------------------------------------------------------- the environment (Ninja Adventure tilesets, CC0)
# Evan (2026-10-08) liked the pack's structures and nature. Figures stay our own (draw_person). Each tile or object
# is picked by its cell in a 16x16 grid: floor.png (ground), nature.png (trees, bushes, flowers), house.png (houses).
const FLOOR := preload("res://assets/env/floor.png")
const NATURE := preload("res://assets/env/nature.png")
const HOUSE := preload("res://assets/env/house.png")
func _tex(tex: Texture2D, cell: Vector2i, size: Vector2i, at: Vector2) -> void:
	draw_texture_rect_region(tex, Rect2(at, Vector2(size) * 16.0), Rect2(Vector2(cell) * 16.0, Vector2(size) * 16.0))
func _is_path(x: int, y: int) -> bool:
	return tile_at(Vector2i(x, y)) in ".N"
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
func _draw_structures() -> void:
	var doors: Array[Vector2i] = []
	for y in MAP.size():
		for x in MAP[0].length():
			if MAP[y][x] == "D": doors.append(Vector2i(x, y))
	for y in MAP.size():
		for x in MAP[0].length():
			var ch: String = MAP[y][x]
			if ch == "T":
				_tex(NATURE, Vector2i(1, 10), Vector2i.ONE, Vector2(x, y) * TILE)        # a hedge bush under the treeline
			elif ch in "r#" and not doors.any(func(d): return x - d.x >= -1 and x - d.x <= 2 and y >= d.y - 2 and y <= d.y):
				_tex(NATURE, Vector2i(0, 10), Vector2i.ONE, Vector2(x, y) * TILE)        # garden bushes beside each cottage
	for d in doors:
		_tex(HOUSE, Vector2i(0, 0), Vector2i(4, 3), Vector2(d.x - 1, d.y - 2) * TILE)  # the whole cottage (4 tiles wide), its door on our door
	for y in MAP.size():                                                                # big trees, back to front
		for x in MAP[0].length():
			if MAP[y][x] == "T" and (x + y) % 2 == 0:       # staggered, half a tile off the grid, so the edge reads as woods
				_tex(NATURE, Vector2i(0 if (x * 3 + y) % 4 < 2 else 2, 0), Vector2i(2, 2), Vector2(x - 0.5, y - (1.5 if tile_at(Vector2i(x, y - 1)) == "T" else 0.25)) * TILE)   # edge rows sit low so they never hide the town
