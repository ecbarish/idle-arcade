class_name Settings
extends RefCounted
## The player's settings (WB6.2), kept apart from the journey: they belong to this computer or phone, not to a save, so
## starting a new journey keeps them. Changed on the Settings page of the field book (book.gd); saved to
## user://settings.cfg. Volumes go through the Music, Ambience and Effects sound buses (default_bus_layout.tres).

const PATH := "user://settings.cfg"
## Each row on the page: key, the name the player reads, and the choices (a volume row goes 0 to 10 instead).
const ROWS := [
	["music", "Music", []],
	["ambience", "Sounds of the place", []],
	["effects", "Sound effects", []],
	["text", "Text size", ["Normal", "Large"]],
	["pace", "Battle pace", ["Normal", "Fast", "Fastest"]],
	["buttons", "Phone buttons", ["On touch screens", "Always", "Never"]],
]
const HELP := {
	"music": "The tune of each place and of battles.",
	"ambience": "Waves on the coast, wind in the hills, under the music.",
	"effects": "Footsteps, coins, the thump of a move landing.",
	"text": "Larger words in speech bubbles and notes.",
	"pace": "How quickly battle time runs between your turns. What happens is the same; only the waiting is shorter.",
	"buttons": "A walking pad and a button for your thumbs, for playing on a phone or tablet.",
}
const BUS := { "music": "Music", "ambience": "Ambience", "effects": "Effects" }
const PACE := [1.0, 1.5, 2.0]

var values := { "music": 10, "ambience": 10, "effects": 10, "text": 0, "pace": 0, "buttons": 0 }
var keep := true                               # the checks turn this off so they never write a real settings file

func load_file() -> void:
	var cf := ConfigFile.new()
	if cf.load(PATH) != OK:
		return
	for k in values:
		values[k] = clampi(int(cf.get_value("settings", k, values[k])), 0, top(k))

func save_file() -> void:
	if not keep:
		return
	var cf := ConfigFile.new()
	for k in values:
		cf.set_value("settings", k, values[k])
	cf.save(PATH)

## The highest value a row can take.
static func top(key: String) -> int:
	for r in ROWS:
		if r[0] == key:
			return 10 if (r[2] as Array).is_empty() else (r[2] as Array).size() - 1
	return 0

## Moves a row one step (volumes stop at 0 and 10; choices go round).
func step(key: String, d: int) -> void:
	var n := top(key)
	if BUS.has(key):
		values[key] = clampi(int(values[key]) + d, 0, n)
	else:
		values[key] = wrapi(int(values[key]) + d, 0, n + 1)
	apply()
	save_file()

## What the row shows, in words.
func shown(key: String) -> String:
	for r in ROWS:
		if r[0] == key and not (r[2] as Array).is_empty():
			return r[2][values[key]]
	return "Off" if int(values[key]) == 0 else "%d" % values[key]

func large_text() -> bool:
	return int(values.text) == 1

func pace() -> float:
	return PACE[int(values.pace)]

## "auto", "on" or "off"
func buttons() -> String:
	return ["auto", "on", "off"][int(values.buttons)]

## Sets each sound bus's volume: 10 is full, 0 is silent.
func apply() -> void:
	for k in BUS:
		var i := AudioServer.get_bus_index(BUS[k])
		if i < 0:
			continue
		var v := int(values[k]) / 10.0
		AudioServer.set_bus_mute(i, v <= 0.0)
		AudioServer.set_bus_volume_db(i, linear_to_db(maxf(v, 0.001)))
