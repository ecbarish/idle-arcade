extends Node2D
## Wildbond in Godot: the trial slice (2026-10-07; see README.md and docs/wildbond-plan.md).
## Faded Larkhaven, walkable on the real map; Maren walks up and speaks in bubbles over her head; you walk to a
## young creature in the paddock and bond with it, and colour bursts back into the world around it. Everything is
## drawn in code on a 384x216 pixel canvas scaled by whole numbers, so it stays crisp on any screen.

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
# little pixel figures, drawn from text (one character per pixel)
const TAMER := ["...CCCC...", "..CCCCCC..", "..CSSSSC..", "..SESSES..", "..SSSSSS..", "...SSSS...", "..RRRRRR..",
	".SRRRRRRS.", ".SRRRRRRS.", "..RRRRRR..", "..BBBBBB..", "..BB..BB..", "..BB..BB..", "..KK..KK.."]
const MAREN := ["...GGGG...", "..GGGGGG..", "..GSSSSG..", "..SESSES..", "..SSSSSS..", "...SSSS...", "..DAAAAD..",
	".SDAAAADS.", ".SDAAAADS.", "..DAAAAD..", "..DDDDDD..", "..DDDDDD..", "...K..K...", "...K..K..."]
const CUB := [".........O.O", ".........OOO", "O..OOOOOOOEO", "OOOOOOOOOOOW", ".OOOOOOOOOO.", "..OOOOOOOO..",
	"..O.O..O.O..", "..K.K..K.K.."]
const PAL := { "C": Color("2a3f6b"), "S": Color("f1c9a0"), "E": Color("222222"), "R": Color("d8453a"), "B": Color("3a4a6a"),
	"K": Color("3a2a1a"), "G": Color("c9c3b8"), "A": Color("4f8a5a"), "D": Color("7a5236"), "O": Color("d8642e"), "W": Color("f4e4c8") }

# the people and creatures on the map: tile, smooth draw position, walking queue
class Mover:
	var tile := Vector2i.ZERO
	var pos := Vector2.ZERO
	var path: Array[Vector2i] = []
	var speed := 4.0
	var right := true
	var step_t := 0.0
	var face := Vector2i.DOWN                # which way they look: front, back or side
	func _init(t: Vector2i) -> void:
		tile = t
		pos = Vector2(t) * 16.0

var me := Mover.new(Vector2i(11, 7))
var maren := Mover.new(Vector2i(7, 11))
var cub := Mover.new(Vector2i(16, 9))
var maren_here := false
var cub_bonded := false
var restore: Array = []                      # [{at: Vector2 world px, r: float, goal: float}]
var lines: Array = []                        # dialogue queue: [{who: "maren" | "" (narration), text}]
var stage := "intro"
var t := 0.0
var fade_in := 0.0
var demo := false
var demo_t := 0.0

@onready var cam: Camera2D = $Camera
@onready var fade_rect: ColorRect = $FadeLayer/Fade
@onready var bubble: PanelContainer = $UI/Bubble
@onready var bubble_text: Label = $UI/Bubble/Text
@onready var caption: Label = $UI/Caption
@onready var place: Label = $UI/Place

func _ready() -> void:
	demo = "--demo" in OS.get_cmdline_user_args()
	cam.limit_right = MAP[0].length() * TILE
	cam.limit_bottom = MAP.size() * TILE
	cam.position = me.pos + Vector2(8, 8)
	say("", "The supply cart stops at the edge of the trees. Larkhaven: a handful of roofs and a ranch fence that runs right up to the forest.")
	say("", "Everything here looks faded, like an old picture left in the sun.")

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
		stage = "to_paddock"
		maren.path = route(maren.tile, Vector2i(18, 12))   # beside the gate, not in front of it
		caption.text = "Walk to the little one in the paddock (arrow keys or WASD). Press Enter beside it."
	elif stage == "bonded":
		stage = "free"
		caption.text = "End of the trial. Walk around Larkhaven; your partner follows you."

# ---------------------------------------------------------------- the map
func tile_at(p: Vector2i) -> String:
	if p.y < 0 or p.y >= MAP.size() or p.x < 0 or p.x >= MAP[0].length():
		return "T"
	return MAP[p.y][p.x]

func walkable(p: Vector2i) -> bool:
	if tile_at(p) in SOLID:
		return false
	return p != cub.tile and p != maren.tile and p != me.tile

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
	if demo:
		_demo(dt)
	_walk(maren, dt)
	_walk(cub, dt)
	_walk(me, dt)
	if stage == "maren_walks" and maren.path.is_empty() and maren.pos.distance_to(Vector2(maren.tile) * TILE) < 0.5:
		stage = "maren_talks"
		say("maren", "There you are! You must be the new tamer. I'm Maren. I keep the ranch.")
		say("maren", "Don't mind the colour. The whole valley faded long ago. Like an old photo, isn't it?")
		say("maren", "Folk say it comes back, a little, every time someone earns a creature's trust. Come and see.")
	if lines.is_empty() and stage in ["to_paddock", "free"] and me.path.is_empty() and me.pos.distance_to(Vector2(me.tile) * TILE) < 0.5:
		var d := Vector2i.ZERO
		if Input.is_action_pressed("ui_up") or Input.is_physical_key_pressed(KEY_W): d = Vector2i.UP
		elif Input.is_action_pressed("ui_down") or Input.is_physical_key_pressed(KEY_S): d = Vector2i.DOWN
		elif Input.is_action_pressed("ui_left") or Input.is_physical_key_pressed(KEY_A): d = Vector2i.LEFT
		elif Input.is_action_pressed("ui_right") or Input.is_physical_key_pressed(KEY_D): d = Vector2i.RIGHT
		if d != Vector2i.ZERO:
			me.right = d.x > 0 if d.x != 0 else me.right
			if walkable(me.tile + d):
				var was := me.tile
				me.path = [me.tile + d]
				if cub_bonded:
					cub.path = [was]
	for r in restore:
		r.r = move_toward(r.r, r.goal, dt * 70.0)
	cam.position = cam.position.lerp(me.pos + Vector2(8, 8), min(1.0, dt * 8.0))
	_update_ui()
	queue_redraw()

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
	restore.append({ "at": cub.pos + Vector2(6, 4), "r": 0.0, "goal": 120.0 })
	caption.text = ""
	say("", "The little one sniffs your hand, then presses its head against it.")
	say("", "Colour floods outward from where it stands: green grass, red roofs, a blue sky over the paddock.")
	say("maren", "...Did you see that? It chose you. And the world remembered a little.")
	say("maren", "That's a bond, love. Nobody owns a creature; they choose. Off you go, then. Look after each other.")

# ---------------------------------------------------------------- the demo (for screenshots: run with -- --demo)
func _demo(dt: float) -> void:
	demo_t += dt
	if demo_t < 1.2:
		return
	demo_t = 0.0
	if not lines.is_empty():
		advance()
	elif stage == "to_paddock" and not cub_bonded and me.path.is_empty():
		if (me.tile - cub.tile).length() <= 1.01:
			bond()
		else:
			me.path = route(me.tile, Vector2i(16, 10))
			me.path.pop_back()
			me.path.append(Vector2i(16, 10))

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
	var actors := [[me, TAMER], [maren, MAREN], [cub, CUB]]
	actors.sort_custom(func(a, b): return a[0].pos.y < b[0].pos.y)
	for i in actors.size():
		var m: Mover = actors[i][0]
		var base: Array = actors[i][1]
		var walking := not m.path.is_empty()
		var frame := int(m.step_t * 8.0) % 2      # which foot is up
		var bob := 0.0
		if walking:
			bob = -1.0 if frame == 0 else 0.0
		elif fmod(t + i * 0.8, 2.4) < 0.4:
			bob = -1.0                             # a breath while standing still
		if m == cub and cub_bonded and stage == "bonded":
			bob = -abs(sin(t * 6.0)) * 3.0         # it hops for joy
		draw_rect(Rect2(m.pos + Vector2(3, 14), Vector2(10, 2)), Color(0, 0, 0, 0.25))   # a soft shadow
		if m == me or m == maren:
			draw_person(m, LOOKS["tamer" if m == me else "maren"], walking, float(i))
		else:
			_draw_sprite(creature_pose(base, walking, frame), m.pos + Vector2(2, 7 + bob), m.right)


## People are built from parts (head, hair, body, arms, legs or a skirt), not flat pictures, so the same figure can
## walk four ways with swinging arms, blink and glance around, be recoloured in the character creator, and later
## become a simple 3D rig. About 12x20 pixels, standing on their tile with a dark outline (docs/wildbond-plan.md).
const LOOKS := {
	"tamer": { "skin": Color("f1c9a0"), "hair": Color("6b4423"), "hat": Color("2a3f6b"), "shirt": Color("d8453a"), "legs": Color("3a4a6a"), "shoes": Color("3a2a1a"), "style": "cap" },
	"maren": { "skin": Color("e8c4a0"), "hair": Color("c9c3b8"), "shirt": Color("7a5236"), "apron": Color("4f8a5a"), "legs": Color("7a5236"), "shoes": Color("3a2a1a"), "style": "bun", "skirt": true },
}
const OUTLINE := Color("1e1a22")

func draw_person(m: Mover, look: Dictionary, walking: bool, seed: float) -> void:
	var face := m.face
	var frame := int(m.step_t * 8.0) % 4 if walking else 0       # 0 left foot up, 1 pass, 2 right foot up, 3 pass
	var blink := fmod(t + seed * 1.7, 3.3) < 0.12
	if not walking and face == Vector2i.DOWN and fmod(t + seed, 6.0) > 5.2:
		face = Vector2i.LEFT if int(t + seed) % 2 == 0 else Vector2i.RIGHT   # a glance around while standing
	var bob := -1 if walking and (frame == 1 or frame == 3) else 0
	var o := m.pos + Vector2(2, -5 + bob)
	var side := face.x != 0
	var swing := 1 if frame == 0 else (-1 if frame == 2 else 0)
	var parts: Array = []                                           # [x, y, w, h, colour], outlined together
	var shade: Color = (look.shirt as Color).darkened(0.25)
	# legs (or a skirt), with the stepping foot lifted
	if look.get("skirt", false):
		parts.append([3, 13, 6, 3, look.legs]); parts.append([2, 16, 8, 2, look.legs])
		parts.append([3 + (1 if frame == 0 else 0), 18, 2, 1, look.shoes]); parts.append([7 - (1 if frame == 2 else 0), 18, 2, 1, look.shoes])
	elif side:
		var fwd := 1 if face == Vector2i.RIGHT else -1
		parts.append([5 + swing * fwd, 13, 2, 5 - (1 if frame == 0 else 0), look.legs]); parts.append([5 - swing * fwd, 13, 2, 5 - (1 if frame == 2 else 0), (look.legs as Color).darkened(0.2)])
		parts.append([5 + swing * fwd + (1 if face == Vector2i.RIGHT else -1), 18 - (1 if frame == 0 else 0), 2, 1, look.shoes])
	else:
		var up_l := 1 if frame == 0 else 0
		var up_r := 1 if frame == 2 else 0
		parts.append([3, 13, 3, 5 - up_l, look.legs]); parts.append([6, 13, 3, 5 - up_r, (look.legs as Color).darkened(0.12)])
		parts.append([3, 18 - up_l, 3, 1, look.shoes]); parts.append([6, 18 - up_r, 3, 1, look.shoes])
	# body, apron and arms (arms swing against the legs)
	parts.append([3, 7, 6, 6, look.shirt]); parts.append([7, 7, 2, 6, shade])
	if look.has("apron") and face != Vector2i.UP:
		parts.append([4 if not side else (5 if face == Vector2i.RIGHT else 3), 8, 4, 6, look.apron])
	if side:
		parts.append([5 - swing, 8, 2, 4, shade]); parts.append([5 - swing, 12, 2, 1, look.skin])
	else:
		parts.append([1, 7 + swing, 2, 4, look.shirt]); parts.append([1, 11 + swing, 2, 1, look.skin])
		parts.append([9, 7 - swing, 2, 4, shade]); parts.append([9, 11 - swing, 2, 1, look.skin])
	# head, hair and eyes
	parts.append([5, 6, 2, 1, look.skin]); parts.append([3, 0, 6, 6, look.skin])
	match look.get("style", "short"):
		"cap":
			parts.append([3, 0, 6, 2, look.hat])
			if face == Vector2i.DOWN: parts.append([3, 2, 6, 1, look.hat])
			elif side: parts.append([(8 if face == Vector2i.RIGHT else 1), 2, 3, 1, look.hat])
			parts.append([(3 if face != Vector2i.LEFT else 7), 2, 2, 3 if face != Vector2i.UP else 4, look.hair])
		"bun":
			parts.append([3, 0, 6, 2, look.hair]); parts.append([5, -2, 2, 2, look.hair])
			if not side: parts.append([3, 2, 1, 3, look.hair]); parts.append([8, 2, 1, 3, look.hair])
			else: parts.append([(3 if face == Vector2i.RIGHT else 7), 1, 2, 4, look.hair]); parts.append([(2 if face == Vector2i.RIGHT else 8), 0, 2, 3, look.hair])   # the bun at the back of her head
	if face == Vector2i.UP:
		parts.append([3, 2, 6, 4, look.hair] if look.style == "cap" else [3, 1, 6, 5, look.hair])
	var eye := Color("222222") if not blink else (look.skin as Color).darkened(0.3)
	if face == Vector2i.DOWN:
		parts.append([4, 3, 1, 1, eye]); parts.append([7, 3, 1, 1, eye])
	elif side:
		parts.append([7 if face == Vector2i.RIGHT else 4, 3, 1, 1, eye])
	# outline first, then the parts on top
	for p in parts:
		draw_rect(Rect2(o + Vector2(p[0] - 1, p[1] - 1), Vector2(p[2] + 2, p[3] + 2)), OUTLINE)
	for p in parts:
		draw_rect(Rect2(o + Vector2(p[0], p[1]), Vector2(p[2], p[3])), p[4])
## A person's look from the way they face: front (both eyes), back (all hair), side (one eye, flipped for left),
## with the feet stepping in turn while they walk.
func person_pose(rows: Array, face: Vector2i, walking: bool, frame: int) -> Array:
	var out: Array = rows.duplicate()
	var hair: String = rows[0].strip_edges(true, true).replace(".", "")[0]
	if face == Vector2i.UP:
		for y in range(2, 5):
			out[y] = (out[y] as String).replace("E", hair).replace("S", hair)
	elif face.x != 0:
		var row: String = out[3]
		out[3] = row.substr(0, 5).replace("E", "S") + row.substr(5)
	if walking:
		var w: int = (out[0] as String).length()
		var last: String = out[out.size() - 1]
		var keep := ""
		for x in w:
			var lifted := (x < w / 2) if frame == 0 else (x >= w / 2)
			keep += "." if lifted else last[x]
		out[out.size() - 1] = keep
	return out

## A creature's look: the tail wags, and the legs trot in pairs while it walks.
func creature_pose(rows: Array, walking: bool, frame: int) -> Array:
	var out: Array = rows.duplicate()
	if int(t * 5.0) % 2 == 0:                  # tail up, then down
		out[1] = "O" + (out[1] as String).substr(1)
		out[2] = "." + (out[2] as String).substr(1)
	if walking:
		var legs: String = out[out.size() - 1]
		var cols := [2, 7] if frame == 0 else [4, 9]
		for c in cols:
			legs = legs.substr(0, c) + "." + legs.substr(c + 1)
		out[out.size() - 1] = legs
	return out

func _draw_sprite(rows: Array, at: Vector2, right: bool) -> void:
	var w: int = rows[0].length()
	for y in rows.size():
		for x in w:
			var ch: String = rows[y][x]
			if ch == ".":
				continue
			var px := x if right else w - 1 - x
			draw_rect(Rect2(at + Vector2(px, y), Vector2(1, 1)), PAL[ch])

func _draw_tile(x: int, y: int, ch: String) -> void:
	var o := Vector2(x, y) * TILE
	var grass := Color("6a9a48")
	var n := (x * 7 + y * 13) % 5
	match ch:
		"T":
			draw_rect(Rect2(o, Vector2(16, 16)), Color("2c4a2a"))
			draw_rect(Rect2(o + Vector2(2, 1), Vector2(12, 10)), Color("3d6b3a"))
			draw_rect(Rect2(o + Vector2(4, 2), Vector2(6, 4)), Color("4f8a4a"))
			draw_rect(Rect2(o + Vector2(7, 11), Vector2(2, 5)), Color("5a3a22"))
		"r":
			draw_rect(Rect2(o, Vector2(16, 16)), Color("c8553d"))
			for i in 4:
				draw_rect(Rect2(o + Vector2(0, i * 4 + 3), Vector2(16, 1)), Color("a3402e"))
		"#":
			draw_rect(Rect2(o, Vector2(16, 16)), Color("eadfc4"))
			draw_rect(Rect2(o + Vector2(0, 15), Vector2(16, 1)), Color("b8a888"))
			if n % 2 == 0:
				draw_rect(Rect2(o + Vector2(4, 4), Vector2(8, 6)), Color("6aa0c8"))
				draw_rect(Rect2(o + Vector2(4, 4), Vector2(8, 2)), Color("a8d0ea"))
		"D":
			draw_rect(Rect2(o, Vector2(16, 16)), Color("eadfc4"))
			draw_rect(Rect2(o + Vector2(3, 2), Vector2(10, 14)), Color("6a4224"))
			draw_rect(Rect2(o + Vector2(10, 9), Vector2(2, 2)), Color("f2d24a"))
		".", "N":
			draw_rect(Rect2(o, Vector2(16, 16)), Color("c8a874"))
			draw_rect(Rect2(o + Vector2(3 + n, 5 + n), Vector2(2, 1)), Color("a88a5a"))
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
			draw_rect(Rect2(o + Vector2(6, 7), Vector2(4, 9)), OUTLINE)
			draw_rect(Rect2(o + Vector2(7, 7), Vector2(2, 8)), Color("6b4a2a"))
			draw_rect(Rect2(o + Vector2(1, 1), Vector2(14, 9)), OUTLINE)
			draw_rect(Rect2(o + Vector2(2, 2), Vector2(12, 7)), Color("d8a868"))
			draw_rect(Rect2(o + Vector2(2, 5), Vector2(12, 1)), Color("a0703a"))
			draw_rect(Rect2(o + Vector2(4, 3), Vector2(6, 1)), Color("6b4a2a"))
			draw_rect(Rect2(o + Vector2(4, 7), Vector2(8, 1)), Color("6b4a2a"))
		_:
			draw_rect(Rect2(o, Vector2(16, 16)), grass)
			draw_rect(Rect2(o + Vector2(2 + n * 2, 3 + n), Vector2(1, 2)), Color("7cae52"))
			draw_rect(Rect2(o + Vector2(11 - n, 10), Vector2(1, 2)), Color("7cae52"))
			if ch == "f":
				for i in 3:
					draw_rect(Rect2(o + Vector2(3 + i * 4, 5 + (i % 2) * 5), Vector2(2, 2)), [Color("f2d24a"), Color("e86a8a"), Color("ffffff")][i])

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
			var p := to_screen * (who.pos + Vector2(8, 0))
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
			elif ch in "r#" and not doors.any(func(d): return abs(x - d.x) <= 1 and y >= d.y - 2 and y <= d.y):
				_tex(NATURE, Vector2i(0, 10), Vector2i.ONE, Vector2(x, y) * TILE)        # garden bushes beside each cottage
	for d in doors:
		_tex(HOUSE, Vector2i(0, 0), Vector2i(3, 3), Vector2(d.x - 1, d.y - 2) * TILE)  # the cottage, door on our door
	for y in MAP.size():                                                                # big trees, back to front
		for x in MAP[0].length():
			if MAP[y][x] == "T" and (x + y) % 2 == 0:       # staggered, half a tile off the grid, so the edge reads as woods
				_tex(NATURE, Vector2i(0 if (x * 3 + y) % 4 < 2 else 2, 0), Vector2i(2, 2), Vector2(x - 0.5, y - (1.5 if tile_at(Vector2i(x, y - 1)) == "T" else 0.25)) * TILE)   # edge rows sit low so they never hide the town
