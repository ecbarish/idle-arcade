
from pathlib import Path
def sub(path, old, new):
    p = Path(path)
    t = p.read_text()
    if new in t:
        print("already", path)
        return
    if old not in t:
        raise SystemExit("missing anchor in " + path)
    p.write_text(t.replace(old, new, 1))
    print("patched", path)

sub("tools/run-all-checks.cjs",
    "'lighthouse-watch','little-ranch'",
    "'lighthouse-watch','briskets-crossing','little-ranch'")

sub("tests/tell-us.html",
    "['../games/lighthouse-watch/index.html','Lighthouse Watch']];",
    "['../games/lighthouse-watch/index.html','Lighthouse Watch'],['../games/briskets-crossing/index.html',\"Brisket's Crossing\"]];")

old_games = (
    "goal:'Burst the falling sparks before they reach the boats, and put your initials on the local high-score board.',\n"
    "   controls:'Tap or click the sky to fire there \u00b7 arrows or W/A/S/D aim, Space fires \u00b7 P pauses. Touch buttons and USB gamepads work too. Two players take turns on one device.'},\n"
    "  {id:'little-ranch'"
)
new_games = (
    "goal:'Burst the falling sparks before they reach the boats, and put your initials on the local high-score board.',\n"
    "   controls:'Tap or click the sky to fire there \u00b7 arrows or W/A/S/D aim, Space fires \u00b7 P pauses. Touch buttons and USB gamepads work too. Two players take turns on one device.'},\n"
    "  {id:'briskets-crossing',title:\"Brisket's Crossing\",tcls:'t-mmo',status:['Test version','s-proto'],href:'games/briskets-crossing/index.html',\n"
    "   blurb:'Lead Pell\\'s mule Brisket across the wagon road and the log river, and light a lantern at every post on the far bank.',\n"
    "   tags:['Arcade cabinet','High scores','Two-player turns'],cover:'brisket',kind:'different',\n"
    "   goal:'Deliver every lantern without a cart, the river, or the clock catching Brisket, and put your initials on the local high-score board.',\n"
    "   controls:'Arrows or W/A/S/D hop \u00b7 Space hops toward the lanterns \u00b7 P pauses. Touch buttons, taps and USB gamepads work too. Two players take turns on one device.'},\n"
    "  {id:'little-ranch'"
)
sub("launcher/games.js", old_games, new_games)

cover = "covers.brisket=function(c,w,h,t){c.fillStyle='#243044';c.fillRect(0,0,w,h);c.fillStyle='#6b5344';c.fillRect(0,h*.42,w,h*.16);c.fillStyle='#1b4550';c.fillRect(0,h*.22,w,h*.16);c.fillStyle='#3d5c3a';c.fillRect(0,h*.72,w,h*.2);c.fillRect(0,h*.08,w,h*.12);c.fillStyle='#c4a574';c.fillRect((w*.15+Math.sin(t)*w*.2+w)%w,h*.46,w*.16,h*.06);c.fillStyle='#6d4c32';c.fillRect((w*.55+t*18)%w,h*.26,w*.2,h*.05);c.fillStyle='#8a5a32';c.fillRect(w*.48,h*.78,10,8);c.fillStyle='#5c3a28';c.fillRect(w*.47,h*.84,4,5);c.fillRect(w*.55,h*.84,4,5);c.fillStyle='#f6d275';c.fillRect(w*.56,h*.76,4,4);for(const x of [.12,.32,.5,.68,.86]){c.fillStyle='#5c4632';c.fillRect(w*x,h*.12,3,10);c.fillStyle='#f6d275';c.fillRect(w*x-1,h*.1,5,3);}};"
sub("index.html",
    "c.fillRect(w*x-7,h*.84,14,4);};\nconst items=",
    "c.fillRect(w*x-7,h*.84,14,4);};\n" + cover + "\nconst items=")

for name in ("bug.yml", "feedback.yml", "suggestion.yml"):
    sub(".github/ISSUE_TEMPLATE/" + name,
        "Lighthouse Watch, Primordial",
        "Lighthouse Watch, \"Brisket's Crossing\", Primordial")
