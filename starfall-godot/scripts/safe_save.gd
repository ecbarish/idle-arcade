## Saving that survives a crash, a power cut or a closed browser tab (docs/learning/saves-and-testing.md).
## A save is written to a spare file first and only then swapped in, and the last good save is kept as a backup, so a
## save cut off half-way can never cost a player their journey. Reading tries the save, then the spare, then the backup.
## The same file as wildbond-godot/scripts/safe_save.gd (keep the two alike).
extends RefCounted

## Writes `data` as JSON to `path` (a user:// file). Returns true when the new save is safely in place.
static func write(path: String, data: Dictionary) -> bool:
	var tmp := path + ".tmp"
	var f := FileAccess.open(tmp, FileAccess.WRITE)
	if f == null:
		return false
	f.store_string(JSON.stringify(data))
	f.close()
	if not (_parse(tmp) is Dictionary):
		return false                              # the spare didn't write whole: keep the save we have
	var dir := DirAccess.open(path.get_base_dir())
	if dir == null:
		return false
	var name := path.get_file()
	if dir.file_exists(name):
		if dir.file_exists(name + ".bak"):
			dir.remove(name + ".bak")
		dir.rename(name, name + ".bak")           # the last good save becomes the backup...
	return dir.rename(name + ".tmp", name) == OK  # ...and the new one takes its place

## The saved dictionary, or {} when there is none. `valid` (optional) can reject a save that read but makes no sense,
## and the next file is tried instead.
static func read(path: String, valid := Callable()) -> Dictionary:
	for p in [path, path + ".tmp", path + ".bak"]:
		if not FileAccess.file_exists(p):
			continue
		var d = _parse(p)
		if d is Dictionary and (not valid.is_valid() or valid.call(d)):
			return d
	return {}

static func exists(path: String) -> bool:
	return FileAccess.file_exists(path) or FileAccess.file_exists(path + ".tmp") or FileAccess.file_exists(path + ".bak")

## Removes the save, its spare and its backup (a new game, or a test cleaning up).
static func remove(path: String) -> void:
	for p in [path, path + ".tmp", path + ".bak"]:
		if FileAccess.file_exists(p):
			DirAccess.remove_absolute(ProjectSettings.globalize_path(p))

## A file's JSON, or null when it is missing or cut off (quietly: a broken save is expected here, not an error).
static func _parse(p: String) -> Variant:
	var j := JSON.new()
	return j.data if j.parse(FileAccess.get_file_as_string(p)) == OK else null
