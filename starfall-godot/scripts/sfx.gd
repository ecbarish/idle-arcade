class_name Sfx
extends Node
## Short sound effects. play("coin") plays res://assets/sfx/coin.wav (docs/research/assets.md lists every name and
## where it came from). A name with no file stays silent, so a sound can be swapped, or replaced with our own, by
## dropping in a file of the same name, and removing one never breaks the game. N turns sound effects on or off.
const VOICES := 6                    # how many sounds can overlap
var on := true
var volume_db := -6.0                # a little under the music
var last := ""                       # the last sound asked for (the checks read this)
var count := 0                       # how many sounds were asked for (the checks read this)
var _players: Array[AudioStreamPlayer] = []
var _cache := {}
var _next := 0

func _ready() -> void:
	for i in VOICES:
		var p := AudioStreamPlayer.new()
		add_child(p)
		_players.append(p)

## Plays a sound by name, a touch higher or lower each time so repeats don't sound mechanical.
func play(sound: String, louder_db := 0.0, vary := 0.05) -> void:
	last = sound
	count += 1
	if not on or _players.is_empty():
		return
	var s := _stream(sound)
	if s == null:
		return
	var p := _players[_next]
	_next = (_next + 1) % _players.size()
	p.stream = s
	p.volume_db = volume_db + louder_db
	p.pitch_scale = 1.0 + randf_range(-vary, vary)
	p.play()

func _stream(sound: String) -> AudioStream:
	if not _cache.has(sound):
		var path := "res://assets/sfx/%s.wav" % sound
		_cache[sound] = load(path) if ResourceLoader.exists(path) else null
	return _cache[sound]
