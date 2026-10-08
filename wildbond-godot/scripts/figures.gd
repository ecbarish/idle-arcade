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
## mirrored left. pose keys: frame (0-3 trot: 1 and 3 lift a diagonal pair), walking, blink, wag (-1 down, 0, 1 up),
## crouch (0-2, for a pounce), sit, sniff (head down), twitch (the nose, -1..1), ears_up.
## look keys: body, belly, dark. Later creatures add their own parts (horns, fins, wings) to the same plan.
static func creature(ci: CanvasItem, o: Vector2, right: bool, pose: Dictionary, look: Dictionary) -> void:
	var c: Color = look.body
	var belly: Color = look.belly
	var dark: Color = look.dark
	var cr: int = pose.get("crouch", 0)
	var sit: bool = pose.get("sit", false)
	var frame: int = pose.get("frame", 0) if pose.get("walking", false) else 0
	var wag: int = pose.get("wag", 0)
	var by := 4 + cr                                                            # the top of the back
	var P: Array = []
	var legh := 3 - cr
	var lift := func(pair: int) -> int: return 1 if (frame == 1 and pair == 0) or (frame == 3 and pair == 1) else 0
	# far legs (pair 1 = back-far and front-near trot together, pair 0 = back-near and front-far)
	if not sit:
		P.append([5 + lift.call(1), by + 5, 1, legh - lift.call(1), c.darkened(0.25)])
	P.append([12 + lift.call(0), by + 5, 1, legh - lift.call(0), c.darkened(0.25)])
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
		P.append([4 + lift.call(0), by + 5, 1, legh - lift.call(0), c]); P.append([4 + lift.call(0), by + 4 + legh - lift.call(0), 1, 1, dark])
	P.append([11 + lift.call(1), by + 5, 1, legh - lift.call(1), c]); P.append([11 + lift.call(1), by + 4 + legh - lift.call(1), 1, 1, dark])
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
	P.append([hx + 3, hy + 1, 1, 1, Color("222222") if not pose.get("blink", false) else c.darkened(0.3)])
	if not right:
		for p in P:
			p[0] = 17 - p[0] - p[2]
	paint(ci, o, P)
