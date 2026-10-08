extends RefCounted
## People and creatures built from parts (docs/wildbond-plan.md, "Art direction" and "3D and every world").
## Every figure is a list of parts [x, y, w, h, colour] around an origin, drawn with one dark outline around the
## whole shape. The same parts drive the world, the ranch register (character creator) and, later, a simple 3D rig,
## so any CanvasItem can draw them: Figures.person(self, ...) or Figures.creature(self, ...).

const OUTLINE := Color("1e1a22")

static func paint(ci: CanvasItem, o: Vector2, parts: Array) -> void:
	for p in parts:
		ci.draw_rect(Rect2(o + Vector2(p[0] - 1, p[1] - 1), Vector2(p[2] + 2, p[3] + 2)), OUTLINE)
	for p in parts:
		ci.draw_rect(Rect2(o + Vector2(p[0], p[1]), Vector2(p[2], p[3])), p[4])

## A person, about 12x21 pixels from the origin (the top of the head). face: which way they look; frame 0-3 while
## walking (1 and 3 lift a foot, 0 and 2 pass with a little bob). look keys: skin, hair, hat, shirt, legs, shoes,
## apron (optional), body ("broad" | "narrow"), style ("cap" | "short" | "long" | "ponytail" | "bun"),
## outfit ("trousers" | "skirt" | "overalls").
static func person(ci: CanvasItem, o: Vector2, face: Vector2i, walking: bool, frame: int, blink: bool, look: Dictionary) -> void:
	if not walking:
		frame = 0
	var side := face.x != 0
	var right := face == Vector2i.RIGHT
	var narrow: bool = look.get("body", "broad") == "narrow"
	var outfit: String = look.get("outfit", "trousers")
	var style: String = look.get("style", "short")
	var skin: Color = look.skin
	var hair: Color = look.hair
	var shirt: Color = look.shirt
	var legs: Color = look.legs
	var shoes: Color = look.get("shoes", Color("3a2a1a"))
	var hat: Color = look.get("hat", legs)
	var shade := shirt.darkened(0.25)
	var swing := 1 if frame == 1 else (-1 if frame == 3 else 0)
	var up_l := 1 if frame == 1 else 0
	var up_r := 1 if frame == 3 else 0
	if walking and frame % 2 == 0:
		o.y -= 1
	var P: Array = []
	# legs (or a skirt), the stepping foot lifted
	if outfit == "skirt":
		P.append([3, 13, 6, 3, legs]); P.append([2, 16, 8, 2, legs])
		P.append([3 + up_l, 18, 2, 1, shoes]); P.append([7 - up_r, 18, 2, 1, shoes])
	elif side:
		var fwd := 1 if right else -1
		P.append([5 - swing * fwd, 13, 2, 5 - up_r, legs.darkened(0.2)])          # the far leg
		P.append([5 - swing * fwd + fwd, 18 - up_r, 2, 1, shoes.darkened(0.2)])
		P.append([5 + swing * fwd, 13, 2, 5 - up_l, legs])                         # the near leg
		P.append([5 + swing * fwd + fwd, 18 - up_l, 2, 1, shoes])
	else:
		P.append([3, 13, 3, 5 - up_l, legs]); P.append([6, 13, 3, 5 - up_r, legs.darkened(0.12)])
		P.append([3, 18 - up_l, 3, 1, shoes]); P.append([6, 18 - up_r, 3, 1, shoes])
	# body: broad shoulders, or narrow shoulders over wider hips
	var bx := 4 if narrow else 3
	var bw := 4 if narrow else 6
	P.append([bx, 7, bw, 6, shirt]); P.append([bx + bw - (1 if narrow else 2), 7, 1 if narrow else 2, 6, shade])
	if narrow and outfit != "skirt" and not side:
		P.append([3, 12, 6, 1, legs])
	if outfit == "overalls":
		if face == Vector2i.UP:
			P.append([bx + 1, 7, 1, 6, legs]); P.append([bx + bw - 2, 7, 1, 6, legs])
		elif side:
			P.append([4, 10, 4, 3, legs]); P.append([(5 if right else 6), 7, 1, 3, legs])
		else:
			P.append([bx + 1, 9, bw - 2, 4, legs]); P.append([bx + 1, 7, 1, 2, legs]); P.append([bx + bw - 2, 7, 1, 2, legs])
	if look.has("apron") and face != Vector2i.UP:
		P.append([4 if not side else (5 if right else 3), 8, 4, 6, look.apron])
	# arms swing against the legs
	if side:
		var ax := 5 - swing * (1 if right else -1)
		P.append([ax, 8, 2, 4, shade]); P.append([ax, 12, 2, 1, skin])
	else:
		var al := 2 if narrow else 1
		var ar := 8 if narrow else 9
		P.append([al, 7 + swing, 2, 4, shirt]); P.append([al, 11 + swing, 2, 1, skin])
		P.append([ar, 7 - swing, 2, 4, shade]); P.append([ar, 11 - swing, 2, 1, skin])
	# head and hair
	P.append([5, 6, 2, 1, skin]); P.append([3, 0, 6, 6, skin])
	var back_x := 3 if right else 7                                              # the back of the head, side-on
	match style:
		"cap":
			P.append([3, 0, 6, 2, hat])
			if face == Vector2i.DOWN: P.append([3, 2, 6, 1, hat]); P.append([3, 3, 1, 2, hair]); P.append([8, 3, 1, 2, hair])
			elif side: P.append([(8 if right else 1), 2, 3, 1, hat]); P.append([back_x, 2, 2, 3, hair])
		"short":
			P.append([3, 0, 6, 2, hair])
			if not side: P.append([3, 2, 1, 2, hair]); P.append([8, 2, 1, 2, hair])
			else: P.append([back_x, 1, 2, 3, hair])
		"long":
			P.append([3, 0, 6, 2, hair])
			if not side: P.append([2, 1, 2, 8, hair]); P.append([8, 1, 2, 8, hair])
			else: P.append([(2 if right else 7), 1, 3, 8, hair])
		"ponytail":
			P.append([3, 0, 6, 2, hair])
			if not side: P.append([3, 2, 1, 2, hair]); P.append([8, 2, 1, 2, hair])
			else: P.append([back_x, 1, 2, 3, hair]); P.append([(1 if right else 9), 2, 2, 5, hair])
		"bun":
			P.append([3, 0, 6, 2, hair]); P.append([5, -2, 2, 2, hair])
			if not side: P.append([3, 2, 1, 3, hair]); P.append([8, 2, 1, 3, hair])
			else: P.append([back_x, 1, 2, 4, hair]); P.append([(2 if right else 8), 0, 2, 3, hair])   # the bun at the back
	if face == Vector2i.UP:
		P.append([3, 2, 6, 4, hair] if style == "cap" else [3, 1, 6, 5, hair])
		if style == "long": P.append([2, 1, 8, 8, hair])
		if style == "ponytail": P.append([5, 5, 2, 5, hair])
	var eye := Color("222222") if not blink else skin.darkened(0.3)
	if face == Vector2i.DOWN:
		P.append([4, 3, 1, 1, eye]); P.append([7, 3, 1, 1, eye])
	elif side:
		P.append([7 if right else 4, 3, 1, 1, eye])
	paint(ci, o, P)

## A four-legged creature seen from the side, about 18x14 pixels (feet on y = 12 from the origin), facing right or
## mirrored left. Each body plan ("kind") is its own list of parts on the same frame, so new creatures are new plans.
## pose keys: frame (0-3 trot: 1 and 3 lift a diagonal pair), walking, blink, wag (-1 down, 0, 1 up), crouch (0-2,
## for a pounce), sit, sniff (head down), twitch (the nose, -1..1), ears_up, bird (a little bird rides a Mosshog).
## look keys: kind ("wolf" | "lizard" | "boar"), body, belly, dark, accent (fins, moss), snout.
static func creature(ci: CanvasItem, o: Vector2, right: bool, pose: Dictionary, look: Dictionary) -> void:
	var P: Array
	match look.get("kind", "wolf"):
		"lizard": P = _lizard(pose, look)
		"boar": P = _boar(pose, look)
		_: P = _wolf(pose, look)
	if not right:
		for p in P:
			p[0] = 17 - p[0] - p[2]
	paint(ci, o, P)

static func _frame(pose: Dictionary) -> int:
	return pose.get("frame", 0) if pose.get("walking", false) else 0

static func _lift(frame: int, pair: int) -> int:
	# pair 0 (back-near and front-far) lifts on frame 1, pair 1 (back-far and front-near) on frame 3
	return 1 if (frame == 1 and pair == 0) or (frame == 3 and pair == 1) else 0

static func _eye(pose: Dictionary, c: Color) -> Color:
	return Color("222222") if not pose.get("blink", false) else c.darkened(0.3)

## Cindercub's plan: a wolf pup with a brush of a tail, pricked ears and a pale muzzle.
static func _wolf(pose: Dictionary, look: Dictionary) -> Array:
	var c: Color = look.body
	var belly: Color = look.belly
	var dark: Color = look.dark
	var cr: int = pose.get("crouch", 0)
	var sit: bool = pose.get("sit", false)
	var f := _frame(pose)
	var wag: int = pose.get("wag", 0)
	var by := 4 + cr                                                            # the top of the back
	var P: Array = []
	var legh := 3 - cr
	# far legs
	if not sit:
		P.append([5 + _lift(f, 1), by + 5, 1, legh - _lift(f, 1), c.darkened(0.25)])
	P.append([12 + _lift(f, 0), by + 5, 1, legh - _lift(f, 0), c.darkened(0.25)])
	# the tail, wagging
	if sit:
		P.append([1, 10, 6, 2, c]); P.append([1, 10, 2, 2, belly])
	else:
		var ty := by - 2 - wag                                                    # a full brush of a tail
		P.append([2, by, 2, 2, c]); P.append([0, ty, 3, 4, c]); P.append([0, ty, 2, 1, belly]); P.append([0, ty + 1, 1, 1, belly])
	# the body
	if sit:
		P.append([3, by + 1, 8, 5, c]); P.append([4, by + 4, 4, 3, c]); P.append([6, 11, 2, 1, dark])   # haunch and paw
	else:
		P.append([3, by, 8, 5, c])
	P.append([5, by + 3 + (1 if sit else 0), 5, 2, belly]); P.append([4, by + (1 if sit else 0), 6, 1, c.lightened(0.15)])
	# near legs
	if not sit:
		P.append([4 + _lift(f, 0), by + 5, 1, legh - _lift(f, 0), c]); P.append([4 + _lift(f, 0), by + 4 + legh - _lift(f, 0), 1, 1, dark])
	P.append([11 + _lift(f, 1), by + 5, 1, legh - _lift(f, 1), c]); P.append([11 + _lift(f, 1), by + 4 + legh - _lift(f, 1), 1, 1, dark])
	# the head: ears, cheek, snout and an eye
	var hx := 10
	var hy := by - 4 + (2 if pose.get("sniff", false) else 0) + (1 if sit else 0)
	var tw: int = pose.get("twitch", 0)
	if pose.get("ears_up", false):
		P.append([hx, hy - 3, 2, 3, c]); P.append([hx + 3, hy - 3, 2, 3, c]); P.append([hx + 3, hy - 2, 1, 1, dark])
	else:
		P.append([hx - 1, hy - 1, 2, 2, c]); P.append([hx + 3, hy - 2, 2, 2, c])
	P.append([hx, hy, 5, 5, c]); P.append([hx + 1, hy + 3, 3, 2, belly])
	P.append([hx + 5 + tw, hy + 2, 2, 2, belly]); P.append([hx + 6 + tw, hy + 2, 1, 1, dark])
	P.append([hx + 3, hy + 1, 1, 1, _eye(pose, c)])
	return P

## Ripplet's plan: a low river lizard with a long tapering tail, a fin down its back and a big, curious eye.
static func _lizard(pose: Dictionary, look: Dictionary) -> Array:
	var c: Color = look.body
	var belly: Color = look.belly
	var fin: Color = look.get("accent", c.lightened(0.3))
	var cr: int = pose.get("crouch", 0)
	var lie: bool = pose.get("sit", false)                                       # a lizard rests flat on its belly
	var f := _frame(pose)
	var wag: int = pose.get("wag", 0)
	var by := 6 + cr + (1 if lie else 0)                                        # the top of the back (it sits low)
	var P: Array = []
	var legh := (12 - (by + 4)) if not lie else 0
	# far legs, splayed
	if legh > 0:
		P.append([6 + _lift(f, 1), by + 4, 1, legh - _lift(f, 1), c.darkened(0.25)])
		P.append([12 + _lift(f, 0), by + 4, 1, legh - _lift(f, 0), c.darkened(0.25)])
	# the tail: long and tapering, the tip flicking
	P.append([0, by + 2 - wag, 2, 1, c]); P.append([1, by + 2, 3, 2, c]); P.append([3, by + 1, 2, 3, c])
	# the body, with a fin of spines down the back
	P.append([4, by, 8, 4, c]); P.append([5, by + 3, 6, 1, belly])
	for i in 3:
		P.append([5 + i * 2, by - 1, 1, 1, fin])
	# near legs
	if legh > 0:
		P.append([5 + _lift(f, 0), by + 4, 2, legh - _lift(f, 0), c]); P.append([11 + _lift(f, 1), by + 4, 2, legh - _lift(f, 1), c])
	# the head: flat, a frill behind it, a wide mouth line and one big eye
	var hy := by - 1 + (1 if pose.get("sniff", false) else 0)
	P.append([11, hy - 1, 2, 2, fin]); P.append([12, hy, 5, 4, c]); P.append([13, hy + 3, 4, 1, belly])
	P.append([14, hy + 2, 3, 1, c.darkened(0.3)])
	P.append([14, hy, 2, 2, Color("f4f4f4")]); P.append([15, hy + (0 if pose.get("ears_up", false) else 1), 1, 1, _eye(pose, c)])
	return P

## Mosshog's plan: a stocky boar, moss and a few flowers growing on its back, a round snout and small tusks;
## sometimes a little bird rides on the moss ("Birds nest in it, and it lets them").
static func _boar(pose: Dictionary, look: Dictionary) -> Array:
	var c: Color = look.body
	var belly: Color = look.belly
	var dark: Color = look.dark
	var moss: Color = look.get("accent", Color("5d9a3e"))
	var snout: Color = look.get("snout", Color("b07a5a"))
	var cr: int = pose.get("crouch", 0)
	var sit: bool = pose.get("sit", false)
	var f := _frame(pose)
	var wag: int = pose.get("wag", 0)
	var by := 5 + cr + (1 if sit else 0)
	var P: Array = []
	var legh := 12 - (by + 5)
	# far legs, short and sturdy
	if legh > 0:
		P.append([4 + _lift(f, 1), by + 5, 2, legh - _lift(f, 1), c.darkened(0.25)]); P.append([10 + _lift(f, 0), by + 5, 2, legh - _lift(f, 0), c.darkened(0.25)])
	# a curly little tail
	P.append([1, by + wag, 1, 2, c]); P.append([1, by - 1 + wag, 1, 1, dark])
	# the body and the garden on its back
	P.append([2, by - 1, 9, 6, c]); P.append([4, by + 3, 6, 2, belly])
	P.append([3, by - 2, 7, 2, moss]); P.append([4, by - 3, 4, 1, moss.lightened(0.15)])
	P.append([5, by - 3, 1, 1, Color("f0a0c0")]); P.append([8, by - 2, 1, 1, Color("f2e8a0")])
	if pose.get("bird", false):
		P.append([6, by - 6, 2, 2, Color("8a6a4a")]); P.append([8, by - 5, 1, 1, Color("f2b04a")]); P.append([7, by - 6, 1, 1, Color("222222")])
	# near legs
	if legh > 0:
		P.append([3 + _lift(f, 0), by + 5, 2, legh - _lift(f, 0), c]); P.append([9 + _lift(f, 1), by + 5, 2, legh - _lift(f, 1), c])
	# the head: ears, a round snout with a nostril, little tusks and an eye
	var hy := by + (2 if pose.get("sniff", false) else 0)
	var tw: int = pose.get("twitch", 0)
	P.append([10, hy - 2, 2, 2, c]); P.append([13, hy - 2 - (1 if pose.get("ears_up", false) else 0), 2, 2, c])
	P.append([10, hy, 5, 5, c])
	P.append([15, hy + 2 + tw, 2, 3, snout]); P.append([16, hy + 3 + tw, 1, 1, dark])
	P.append([15, hy + 5, 1, 1, Color("f4f0e0")])
	P.append([13, hy + 1, 1, 1, _eye(pose, c)])
	return P
