extends RefCounted
## Wildbond's rules, translated line by line from the browser game so both versions give the same numbers:
## shared/creatures.js (individual creatures, stats, XP, bonds) and games/wildbond/js/02-state.js, 03-battle.js
## (moves, damage, element advantage, how a creature picks a move, levelling up and evolving).
## The data (species, moves, elements) comes from data/wildbond.json. Random rolls come from an rng you pass in, so the
## checks in tests/run_tests.gd can fix them and compare with the browser.

const STATS := ["hp", "pow", "grd", "spd", "wit", "spi"]
const STAT_NAME := { "hp": "Health", "pow": "Power", "grd": "Guard", "spd": "Speed", "wit": "Wits", "spi": "Spirit" }
const RARITY := [
	{ "name": "Common", "m": 1.00, "traits": [0, 1], "pot": [0, 15] },
	{ "name": "Uncommon", "m": 1.06, "traits": [1, 1], "pot": [3, 18] },
	{ "name": "Rare", "m": 1.12, "traits": [1, 2], "pot": [6, 22] },
	{ "name": "Epic", "m": 1.2, "traits": [2, 2], "pot": [10, 26] },
	{ "name": "Legendary", "m": 1.3, "traits": [2, 3], "pot": [14, 29] },
	{ "name": "Mythical", "m": 1.42, "traits": [3, 3], "pot": [18, 31] },
]
const TEMPERAMENTS := {
	"bold": { "name": "Bold", "up": "pow", "down": "grd" }, "calm": { "name": "Calm", "up": "spi", "down": "spd" },
	"skittish": { "name": "Skittish", "up": "spd", "down": "hp" }, "proud": { "name": "Proud", "up": "wit", "down": "spi" },
	"playful": { "name": "Playful", "up": "spd", "down": "wit" }, "lazy": { "name": "Lazy", "up": "hp", "down": "spd" },
	"steady": { "name": "Steady", "up": "", "down": "" },
}
const TRAITS := ["ferocious", "thick", "swift", "keen", "loyal", "hardy", "lucky", "gentle"]
const BOND := [["Wary", 0], ["Friendly", 20], ["Loyal", 60], ["Devoted", 140], ["Bonded", 280]]
const ACT_AT := 2.2                           # a creature acts when its turn meter reaches this

static var DATA: Dictionary = {}

static func sp(c: Dictionary) -> Dictionary:
	return DATA.SPECIES[c.sp]

static func bond_lvl(c: Dictionary) -> int:
	var l := 0
	for i in BOND.size():
		if c.bond >= BOND[i][1]:
			l = i
	return l

## A new creature (Creatures.make). opts: rar, temp, traits, pot, name. Rolls what isn't given.
static func make(species_id: String, lvl: int, opts: Dictionary, rng: RandomNumberGenerator) -> Dictionary:
	var rar: int = opts.get("rar", 0)
	var pr: Array = RARITY[rar].pot
	var pot := {}
	for s in STATS:
		pot[s] = opts.pot[s] if opts.has("pot") and opts.pot.has(s) else rng.randi_range(pr[0], pr[1])
	var traits: Array = opts.get("traits", [])
	if not opts.has("traits"):
		var n := rng.randi_range(RARITY[rar].traits[0], RARITY[rar].traits[1])
		while traits.size() < n:
			var k: String = TRAITS[rng.randi() % TRAITS.size()]
			if k not in traits:
				traits.append(k)
	var c := { "sp": species_id, "name": opts.get("name", DATA.SPECIES[species_id].name), "lvl": lvl, "xp": 0, "rar": rar,
		"pot": pot, "temp": opts.get("temp", TEMPERAMENTS.keys()[rng.randi() % TEMPERAMENTS.size()]), "traits": traits, "bond": 0.0 }
	c.hp = stats(c).hp
	return c

## Stats from species, potential, level, temperament, rarity and bond (Creatures.stats): a Pokemon-style curve.
static func stats(c: Dictionary) -> Dictionary:
	var base: Dictionary = sp(c).base
	var t: Dictionary = TEMPERAMENTS.get(c.temp, TEMPERAMENTS.steady)
	var rm: float = RARITY[c.rar].m
	var bl := bond_lvl(c)
	var out := {}
	for s in STATS:
		var v: float = floorf((2.0 * base[s] + c.pot[s]) * c.lvl / 100.0)
		v = v + c.lvl + 10 if s == "hp" else v + 5
		v += floorf(float(c.get("train", {}).get(s, 0)) / 4.0)
		if t.up == s: v *= 1.1
		if t.down == s: v *= 0.9
		out[s] = maxi(1, roundi(v * rm * (1.0 + 0.02 * bl)))
	return out

static func xp_need(lvl: int) -> int:
	return roundi(5.0 * pow(lvl, 2.2) + 15.0)

## The moves a creature knows: everything learned by its level, the last four (movesOf).
static func moves_of(c: Dictionary) -> Array:
	var out: Array = []
	for l in sp(c).learn:
		if l[0] <= c.lvl and l[1] not in out:
			out.append(l[1])
	return out.slice(-4)

## XP in, levels out: new moves and evolution included (grow). Returns the messages to show.
static func grow(c: Dictionary, xp: int, cap: int) -> Array:
	var msgs: Array = []
	var before := moves_of(c)
	var gained := 0
	if c.lvl < cap:
		c.xp += xp
		while c.lvl < cap and c.xp >= xp_need(c.lvl):
			c.xp -= xp_need(c.lvl)
			c.lvl += 1
			gained += 1
		if c.lvl >= cap:
			c.xp = 0
	if gained > 0:
		msgs.append("%s grew to level %d!" % [c.name, c.lvl])
		for m in moves_of(c):
			if m not in before:
				msgs.append("%s learned %s!" % [c.name, DATA.MOVES[m].name])
		var st := stats(c)
		c.hp = mini(st.hp, c.hp + roundi(st.hp * 0.2))
	return msgs

## The ways a creature can change (data/evolution.json, or the browser game's single level evolution).
static func evo_options(c: Dictionary) -> Array:
	var evos: Dictionary = DATA.get("EVOS", {})
	if evos.has(c.sp):
		return evos[c.sp]
	var evo = sp(c).get("evo")
	return [evo] if evo else []

## What a creature is ready to become right now, or "". ctx: place (the map's area), team (species ids with it).
## Conditions: level (at), trust (bond: 1 Friendly .. 4 Bonded), a place, a companion (with). First match wins.
static func evo_target(c: Dictionary, ctx: Dictionary = {}) -> String:
	for o in evo_options(c):
		if c.lvl < int(o.at):
			continue
		if o.has("place") and str(ctx.get("place", "")) != str(o.place):
			continue
		if o.has("bond") and bond_lvl(c) < int(o.bond):
			continue
		if o.has("with") and str(o.with) not in ctx.get("team", []):
			continue
		return str(o.to)
	return ""

## Change a creature into its new form, keeping everything that makes it itself (and a name you gave it).
static func evolve(c: Dictionary, to: String) -> String:
	var old: String = c.name
	var was_default: bool = c.name == sp(c).name
	c.sp = to
	if was_default:
		c.name = sp(c).name
	c.erase("hold")
	var st := stats(c)
	c.hp = mini(st.hp, c.hp + roundi(st.hp * 0.3))
	return old

static func add_bond(c: Dictionary, v: float) -> bool:
	var b := bond_lvl(c)
	c.bond += v * (1.5 if "loyal" in c.traits else 1.0)
	return bond_lvl(c) > b

## Element advantage: 1.5 when the move's element beats the target's, 0.67 when the target's beats it.
static func advantage(el, target: Dictionary) -> float:
	if el == null or el == "":
		return 1.0
	var te: String = sp(target).el
	if te in DATA.ELEMENTS[el].beats:
		return 1.5
	if DATA.ELEMENTS.has(te) and el in DATA.ELEMENTS[te].beats:
		return 0.67
	return 1.0

## Damage (03-battle.js damage). att/def are battle units: { c, st, side, buff }. roll is the 0-1 random spread, crit_roll
## decides a critical hit, so a check can fix both.
static func damage(att: Dictionary, def: Dictionary, mv: Dictionary, mult: float, roll: float, crit_roll: float) -> Dictionary:
	var spec: bool = mv.get("spec", 0) == 1
	var A: float = att.st.wit if spec else att.st.pow
	var D: float = def.st.spi if spec else def.st.grd
	var d: float = ((2.0 * att.c.lvl / 5.0 + 2.0) * mv.pow * A / maxf(1.0, D)) / 50.0 + 2.0
	var el = mv.get("el")
	var adv := advantage(el, def.c)
	d *= (1.2 if el != null and el == sp(att.c).el else 1.0) * adv * (0.85 + roll * 0.15) * mult
	if att.buff.get("dmg", 0.0) > 0: d *= 1.25
	if def.buff.get("guard", 0.0) > 0: d *= 0.5 if def.side == "a" and def.buff.get("guardCmd", 0) else 0.6
	if "ferocious" in att.c.traits: d *= 1.1
	if "thick" in def.c.traits: d *= 0.9
	var crit := crit_roll < 0.06 + (0.08 if "keen" in att.c.traits else 0.0)
	if crit: d *= 1.5
	return { "d": maxi(1, roundi(d)), "crit": crit, "adv": adv }

## How a creature picks its move when nobody tells it (chooseMove, without Hardcore).
static func choose_move(u: Dictionary, allies: Array, rng: RandomNumberGenerator) -> String:
	var moves: Array = moves_of(u.c).filter(func(m): return not (u.cds.get(m, 0.0) > 0))
	var low = allies.filter(func(x): return x.c.hp < x.st.hp * 0.45)
	if not low.is_empty() and "regrowth" in moves:
		return "regrowth"
	for m in moves:
		var k: String = DATA.MOVES[m].kind
		if k == "buff" and not allies.any(func(x): return x.buff.get("dmg", 0.0) > 0): return m
		if k == "haste" and not allies.any(func(x): return x.buff.get("haste", 0.0) > 0): return m
		if k == "guard" and not allies.any(func(x): return x.buff.get("guard", 0.0) > 0) and rng.randf() < 0.6: return m
		if (k == "slow" or k == "dot") and rng.randf() < 0.5: return m
	var dmg: Array = moves.filter(func(m): return DATA.MOVES[m].kind in ["hit", "aoe"])
	dmg.sort_custom(func(a, b): return DATA.MOVES[a].pow > DATA.MOVES[b].pow)
	return dmg[0] if not dmg.is_empty() else moves_of(u.c)[0]

## A move in plain words (moveInfo), for the move list.
static func move_info(m: String) -> String:
	var mv: Dictionary = DATA.MOVES[m]
	var el: String = (mv.el + " ") if mv.get("el") != null else ""
	var how := "special (uses Wits)" if mv.get("spec", 0) == 1 else "physical (uses Power)"
	match mv.kind:
		"hit": return "%s%s attack, power %d" % [el, how, mv.pow]
		"aoe": return "%shits every foe, power %d" % [el, mv.pow]
		"dot": return "%spoisons a foe over time" % el
		"buff": return "your team hits harder for a while"
		"haste": return "your team acts faster for a while"
		"guard": return "your team braces against damage"
		"slow": return "slows a foe down"
		"heal": return "heals your most hurt ally"
	return ""

## How fast a unit's turn meter fills each second (battleTick).
static func atb_rate(u: Dictionary) -> float:
	return (u.st.spd + 40.0) / 100.0 * (1.3 if u.buff.get("haste", 0.0) > 0 else 1.0) * (0.6 if u.buff.get("slow", 0.0) > 0 else 1.0) * (1.1 if "swift" in u.c.traits else 1.0)

## A wild creature's rarity (Creatures.rollRarity): boost raises the odds (lures, traits, a Long Road lowers them).
static func roll_rarity(boost: float, rng: RandomNumberGenerator) -> int:
	var r := rng.randf() / (1.0 + boost)
	return 3 if r < 0.004 else (2 if r < 0.03 else (1 if r < 0.15 else 0))
