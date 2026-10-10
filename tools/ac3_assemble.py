"""Assemble Brisket cabinet from short pieces. One-shot."""
from pathlib import Path

parts = Path("tools/ac3_parts")
names = ("w00.txt", "w01.txt", "w02.txt", "w03.txt")
text = "".join((parts / name).read_text() for name in names)
broken = 'preventDefault();if(!$",'
fixed = 'preventDefault();if(!$(",'
extra = 'inish;};\\n})();\\n'
plain = 'inish};\\n})();\\n'
if text.count(broken) != 1 or text.count(extra) != 1:
    raise SystemExit("repair anchors missing")
text = text.replace(broken, fixed, 1).replace(extra, plain, 1)
exec(compile(text, "ac3_writer.py", "exec"), {"__name__": "__main__"})
