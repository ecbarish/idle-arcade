class_name Controls
extends RefCounted
## Every control in the game has a name (WB6.1, docs/learning/godot-practices.md rule 2). A key, a gamepad button or a
## finger on the phone pad (touch_pad.gd) all set off the same named action, so each screen asks "was this Talk?"
## rather than "was this the E key?". setup() puts the actions in Godot's Input Map when the game starts; a rebinding
## screen later only has to change this table.

## name: [keys, gamepad buttons]
const ACTIONS := {
	"move_up": [[KEY_UP, KEY_W], [JOY_BUTTON_DPAD_UP]],
	"move_down": [[KEY_DOWN, KEY_S], [JOY_BUTTON_DPAD_DOWN]],
	"move_left": [[KEY_LEFT, KEY_A], [JOY_BUTTON_DPAD_LEFT]],
	"move_right": [[KEY_RIGHT, KEY_D], [JOY_BUTTON_DPAD_RIGHT]],
	"interact": [[KEY_E, KEY_ENTER, KEY_KP_ENTER, KEY_SPACE], [JOY_BUTTON_A]],   # talk, choose, next line
	"back": [[KEY_ESCAPE, KEY_BACKSPACE, KEY_Q], [JOY_BUTTON_B]],
	"open_book": [[KEY_TAB, KEY_J], [JOY_BUTTON_Y]],
	"page_prev": [[KEY_Q], [JOY_BUTTON_LEFT_SHOULDER]],
	"page_next": [[KEY_E], [JOY_BUTTON_RIGHT_SHOULDER]],
	"calendar": [[KEY_C], [JOY_BUTTON_X]],
	"toggle_music": [[KEY_M], []],
	"toggle_sound": [[KEY_N], []],
}
## The left stick walks too.
const STICK := { "move_up": [JOY_AXIS_LEFT_Y, -1.0], "move_down": [JOY_AXIS_LEFT_Y, 1.0],
	"move_left": [JOY_AXIS_LEFT_X, -1.0], "move_right": [JOY_AXIS_LEFT_X, 1.0] }
static var touch := false                      # the phone pad is showing (touch_pad.gd): hints say "tap", not key names
const DIRS := { "move_up": Vector2i.UP, "move_down": Vector2i.DOWN, "move_left": Vector2i.LEFT, "move_right": Vector2i.RIGHT }

static func setup() -> void:
	for a in ACTIONS:
		if InputMap.has_action(a):
			continue
		InputMap.add_action(a, 0.4)
		for k in ACTIONS[a][0]:
			var e := InputEventKey.new()
			e.physical_keycode = k                     # where the key sits, so WASD works on any keyboard layout
			InputMap.action_add_event(a, e)
		for b in ACTIONS[a][1]:
			var j := InputEventJoypadButton.new()
			j.button_index = b
			InputMap.action_add_event(a, j)
		if STICK.has(a):
			var m := InputEventJoypadMotion.new()
			m.axis = STICK[a][0]
			m.axis_value = STICK[a][1]
			InputMap.action_add_event(a, m)

## True when this event is a fresh press of the action (held-key repeats don't count).
static func pressed(e: InputEvent, action: String) -> bool:
	return InputMap.has_action(action) and e.is_action_pressed(action, false)

## Which way a fresh press points in a menu, or zero.
static func dir(e: InputEvent) -> Vector2i:
	for a in DIRS:
		if pressed(e, a):
			return DIRS[a]
	return Vector2i.ZERO

## Which way the walking controls are held right now (keys, stick, or the phone pad), or zero.
static func held_dir() -> Vector2i:
	for a in DIRS:
		if InputMap.has_action(a) and Input.is_action_pressed(a):
			return DIRS[a]
	return Vector2i.ZERO
