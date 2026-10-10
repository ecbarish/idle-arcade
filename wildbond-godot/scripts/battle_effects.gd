extends RefCounted
## WD3's temporary effects. They live on battle units, never in a saved creature.
const BAD := ["soaked", "scorched", "rooted", "sleep", "marked"]
const LABEL := {"soaked": "Soaked", "scorched": "Scorched", "rooted": "Rooted", "sleep": "Asleep", "marked": "Exposed"}

static func active(u: Dictionary, id: String) -> bool:
	return float(u.get("status", {}).get(id, 0.0)) > 0.0

static func apply(u: Dictionary, id: String, seconds: float) -> bool:
	if u.c.hp <= 0 or id not in BAD:
		return false
	if not u.has("status"):
		u.status = {}
	# Sleep cannot be refreshed while asleep, or chained immediately after waking.
	if id == "sleep" and (active(u, "sleep") or float(u.get("wake_grace", 0.0)) > 0):
		return false
	u.status[id] = maxf(float(u.status.get(id, 0.0)), seconds)
	if id == "scorched":
		u["burn_tick"] = 1.0
	return true

static func cleanse(u: Dictionary) -> void:
	if active(u, "sleep"):
		u["wake_grace"] = 5.0
	u["status"] = {}
	u.dots.clear()
	u.buff.slow = 0.0

static func wake(u: Dictionary) -> void:
	if active(u, "sleep"):
		u.status.erase("sleep")
		u["wake_grace"] = 5.0

static func tick(u: Dictionary, h: float) -> int:
	var damage := 0
	u["wake_grace"] = maxf(0.0, float(u.get("wake_grace", 0.0)) - h)
	if active(u, "scorched"):
		u["burn_tick"] = float(u.get("burn_tick", 1.0)) - h
		if u.burn_tick <= 0:
			u.burn_tick += 1.0
			damage = maxi(1, roundi(u.st.hp * 0.02))
	for id in u.get("status", {}).keys():
		u.status[id] -= h
		if u.status[id] <= 0:
			u.status.erase(id)
			if id == "sleep":
				u["wake_grace"] = 5.0
	return damage

static func modifier(att: Dictionary, target: Dictionary, move: Dictionary) -> float:
	var factor := 1.0
	if active(att, "scorched") and int(move.get("spec", 0)) != 1:
		factor *= 0.75
	if active(target, "marked"):
		factor *= 1.25
	if move.has("combo") and active(target, str(move.combo)):
		factor *= float(move.get("bonus", 1.4))
	return factor

static func after_hit(target: Dictionary, move: Dictionary) -> void:
	wake(target)
	if target.has("status"):
		target.status.erase("marked")
		if move.has("combo"):
			target.status.erase(str(move.combo))
	if move.get("breakGuard", false):
		target.buff.guard = 0.0
		target.buff.guardCmd = 0
	if move.has("status"):
		apply(target, str(move.status), float(move.get("duration", 5.0)))

static func label(u: Dictionary) -> String:
	var names: Array = []
	for id in BAD:
		if active(u, id):
			names.append(LABEL[id])
	return "/".join(names.slice(0, 2)) + ("+" if names.size() > 2 else "")
