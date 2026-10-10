"""Restore one rule dropped on upload, then check the stylesheet hash."""
from pathlib import Path
import hashlib
p = Path('games/briskets-crossing/style.css')
t = p.read_text()
old = '.hud span{display:flex-direction:column}'
new = '.hud span{display:flex;flex-direction:column}'
if old not in t:
    raise SystemExit('anchor missing')
t = t.replace(old, new, 1)
p.write_text(t)
got = hashlib.sha256(t.encode()).hexdigest()
want = '04f74e616a9cd938d5ed1250fa0b1055e42413091b6049dc8f9e332e3bd4fc50'
if got != want:
    raise SystemExit('sha ' + got)
print('css sha ok')
