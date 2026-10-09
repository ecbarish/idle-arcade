# Starfall look sheet mock-up: blocking and mood at game resolution (384x216, 16 px tiles), not final art.
# Run from the repo root: python3 tools/art/starfall_mockup.py
# Writes docs/art/starfall/mockup-1x.png, look-sheet.png (beside today-1x.png, a screenshot) and palette.gpl.
from PIL import Image, ImageDraw
import random
random.seed(7)
P = {  # Starfall palette (ink and lamp are shared with Wildbond: figures.gd OUTLINE, paint_tiles.gd lamplight)
 'ink':'#1e1a22','pine_d':'#1f3329','pine':'#2f4a3a','pine_l':'#41654a','moss_d':'#4a6338','moss':'#5c7744','moss_l':'#71904f',
 'mud_d':'#5a4734','mud':'#735c42','mud_l':'#8d7352','log_d':'#4a3122','log':'#6a4a32','log_l':'#8c6644','plank':'#a07a50',
 'stone_d':'#4e535a','stone':'#6e747b','stone_l':'#9198a0','shake_d':'#3e3833','shake':'#57504a','shake_l':'#736a5f',
 'lamp':'#f2d080','lamp_l':'#ffe8a6','banner':'#8c2f2f','guild':'#2f5e78','water':'#3b5f6e','water_l':'#5f8a96','smoke':'#b9b6ae'}
W,H=384,216
im=Image.new('RGB',(W,H),P['moss']); d=ImageDraw.Draw(im)
def R(x,y,w,h,c,o=None):
    d.rectangle([x,y,x+w-1,y+h-1],fill=P[c])
    if o: d.rectangle([x,y,x+w-1,y+h-1],outline=P[o])
# grass texture
for i in range(900):
    x,y=random.randrange(W),random.randrange(H); d.point((x,y),fill=P[random.choice(['moss_d','moss_l','moss'])])
# forest beyond the palisade (top and bottom)
def pine(x,y,s=1.0):
    h=int(26*s); w=int(16*s)
    d.polygon([(x,y-h),(x-w//2,y),(x+w//2,y)],fill=P['pine'],outline=P['ink'])
    d.polygon([(x,y-h),(x-w//4,y-h//2),(x+w//2,y)],fill=P['pine_d'])
    d.line([(x-2,y-h+8),(x,y-h+4)],fill=P['pine_l'])
    R(x-1,y,3,4,'log_d')
for x in range(-6,W+10,11): pine(x+random.randint(-3,3),26+random.randint(-4,2),random.uniform(0.9,1.2))
for x in range(-6,W+10,12): pine(x+random.randint(-3,3),216+random.randint(-2,6),random.uniform(0.9,1.2))
# palisade: vertical sharpened logs, top (y 30-44) and bottom (y 188-202); open to the east (room to grow)
def wall(y,x0,x1):
    for x in range(x0,x1,5):
        R(x,y,5,14,'log','ink'); d.line([(x+1,y+2),(x+1,y+12)],fill=P['log_l'])
        d.polygon([(x,y),(x+2,y-3),(x+4,y)],fill=P['log'],outline=P['ink'])
    R(x0,y+5,x1-x0,2,'log_d')
wall(32,0,300); wall(186,0,300)
for x in range(304,384,14):  # stakes marking where the wall will go next
    R(x,40,2,6,'log_l','ink'); R(x,194,2,6,'log_l','ink')
# the road from the gate (west) running east, a small square with the well
R(0,104,384,22,'mud'); 
for i in range(260):
    x=random.randrange(W); y=random.randrange(104,126); d.point((x,y),fill=P[random.choice(['mud_d','mud_l'])])
R(150,92,52,46,'mud')
# gate + watchtower on the west
R(0,46,10,140,'log_d'); 
R(0,98,14,34,'log_d','ink'); R(2,100,10,30,'mud_d')  # open gate passage
R(14,62,20,40,'log','ink'); 
for yy in range(64,100,6): d.line([(15,yy),(32,yy)],fill=P['log_d'])
R(10,50,28,12,'plank','ink'); d.polygon([(8,50),(24,38),(40,50)],fill=P['shake'],outline=P['ink'])
R(20,54,8,5,'lamp')  # lantern in the tower
# the well in the square
d.ellipse([168,100,184,112],fill=P['stone'],outline=P['ink']); d.ellipse([171,102,181,109],fill=P['water'])
R(166,92,2,12,'log','ink'); R(184,92,2,12,'log','ink'); R(165,90,22,3,'log_d','ink')
# buildings: footprint shown as the stone base; real sizes (a person is 16x24, a door 12x20)
def building(x,y,w,h,roof,wall_c='log',base='stone',door_x=None,windows=(),sign=None,chim=False):
    R(x,y+h-6,w,6,base,'ink')            # stone footing: the footprint
    R(x+1,y+10,w-2,h-15,wall_c,'ink')
    for yy in range(y+13,y+h-6,4): d.line([(x+2,yy),(x+w-3,yy)],fill=P['log_d'])
    d.polygon([(x-3,y+11),(x+w//2,y-8),(x+w+2,y+11)],fill=P[roof],outline=P['ink'])
    d.line([(x+w//2,y-6),(x+w-2,y+9)],fill=P[roof+'_d'] if roof+'_d' in P else P['ink'])
    dx=door_x if door_x is not None else x+w//2-6
    R(dx,y+h-26,12,20,'log_d','ink')
    for wx in windows: R(wx,y+h-24,7,7,'lamp','ink'); d.point((wx+3,y+h-21),fill=P['lamp_l'])
    if sign: R(sign,y+h-30,8,6,'plank','ink')
    if chim:
        R(x+w-12,y-10,6,14,'stone','ink')
        for i,s in enumerate([(x+w-10,y-16,4),(x+w-8,y-24,5),(x+w-11,y-32,6)]): d.ellipse([s[0],s[1],s[0]+s[2],s[1]+s[2]],fill=P['smoke'])
# Guild Hall: the big longhouse opposite the gate's road, banner
building(52,46,84,58,'shake',windows=(62,118),door_x=88); R(126,58,6,14,'banner','ink'); R(126,58,6,3,'guild')
# Inn: tall, lit, hanging sign (south side of the road)
building(56,134,56,52,'shake',windows=(62,100),sign=74)
# Smithy: stone walls, open forge glow
building(214,52,46,52,'shake',wall_c='stone',chim=True,windows=())
R(240,84,12,8,'lamp','ink')
# Apothecary: narrow timber, herbs hanging
building(216,136,36,50,'shake',windows=(242,))
for i in range(4): R(220+i*7,154,3,5,'moss_l')
# Tavern: east end, wider porch
building(272,134,48,52,'shake',windows=(278,306),sign=292)
# empty plots further east (staked out by Hob)
for (x,y) in [(330,58),(330,140)]:
    d.rectangle([x,y,x+40,y+40],outline=P['log_l']); R(x,y,3,3,'log_l'); R(x+38,y,3,3,'log_l'); R(x,y+38,3,3,'log_l'); R(x+38,y+38,3,3,'log_l')
# a person for scale at the gate and in the square
def person(x,y,shirt):
    R(x+5,y,6,6,'plank','ink'); R(x+3,y+6,10,10,shirt,'ink'); R(x+4,y+16,3,8,'log_d'); R(x+9,y+16,3,8,'log_d')
person(36,100,'guild'); person(190,106,'banner')
im.save('docs/art/starfall/mockup-1x.png')


# palette.gpl, written from P so the file and the script never drift apart
with open('docs/art/starfall/palette.gpl','w') as f:
    f.write('GIMP Palette\nName: Starfall (frontier)\nColumns: 7\n# Starfall village palette, docs/art/starfall.md. Cooler and darker than Wildbond: pine, moss, mud, log, stone, weathered shake roofs; ink and lamplight shared with Wildbond.\n')
    for k,v in P.items():
        r,g,b=(int(v[i:i+2],16) for i in (1,3,5)); f.write('%3d %3d %3d\t%s\n'%(r,g,b,k))
# look sheet: today (left), the mock-up (right), palette swatches below
from PIL import ImageFont
def font(n):
    for f in ('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf',):
        try: return ImageFont.truetype(f,n)
        except OSError: pass
    return ImageFont.load_default()
S=Image.new('RGB',(1560,700),'#e8e4da'); sd=ImageDraw.Draw(S); f16,f13=font(16),font(13)
sd.text((8,8),'Starfall: today (left) and the frontier direction (right, a blocking mock-up, not final art)',fill='#241e1c',font=f16)
S.paste(Image.open('docs/art/starfall/today-1x.png').convert('RGB').resize((768,432),Image.NEAREST),(8,34))
S.paste(im.resize((768,432),Image.NEAREST),(784,34))
sd.text((8,482),'Starfall palette (cooler and darker than Wildbond: pine, moss, mud, log, stone, weathered shake, lamplight)',fill='#241e1c',font=f16)
for i,(k,v) in enumerate(P.items()):
    x,y=8+(i%14)*110,510+(i//14)*90
    sd.rectangle([x,y,x+100,y+50],fill=v,outline='#241e1c'); sd.text((x,y+53),k,fill='#241e1c',font=f13); sd.text((x,y+68),v,fill='#555',font=f13)
S.save('docs/art/starfall/look-sheet.png')
