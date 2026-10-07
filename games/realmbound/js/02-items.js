'use strict';
/* =================== items =================== */
const SLOTS=['head','chest','legs','feet','hands','weapon','offhand','trinket'];
const MAT={cloth:['Frayed','Linen','Woolen','Silken','Rune-stitched','Rimewoven','Wayfarer-thread','Crownwoven'],
  leather:['Worn','Rawhide','Supple','Thick','Riveted','Frostcured','Waystone-lined','Ashwing-hide'],
  mail:['Rusty','Chain','Scaled','Banded','Runelink','Frostforged','Waystone','Boughsteel']};
const PIECE={cloth:{head:['Cap','Hood'],chest:['Robe','Vest'],legs:['Pants','Leggings'],feet:['Sandals','Slippers'],hands:['Gloves','Handwraps']},
  leather:{head:['Cap','Hood'],chest:['Tunic','Jerkin'],legs:['Pants','Britches'],feet:['Boots','Treads'],hands:['Gloves','Grips']},
  mail:{head:['Coif','Helm'],chest:['Hauberk','Chain Vest'],legs:['Leggings','Legguards'],feet:['Boots','Sabatons'],hands:['Gauntlets','Gloves']}};
const ARM_MULT={cloth:1,leather:2,mail:3.3};
const SLOT_MULT={head:1,chest:1.35,legs:1.15,feet:.8,hands:.7};
const WEAPONS={sword:{speed:2.4,names:['Rusty Shortsword','Iron Shortsword','Steel Broadsword','Tempered Longblade','Runesteel Falchion','Rimeforged Longblade',"Waykeeper's Greatblade",'Crownward Saber']},
  dagger:{speed:1.7,names:['Chipped Dagger','Sharp Dirk','Steel Stiletto','Fine Kris','Silveredge Dirk','Rimeglass Stiletto','Cairnsteel Kris','Hollowcrown Fang']},
  mace:{speed:2.6,names:['Worn Club','Iron Mace','Flanged Mace','Spiked Morningstar','Runebanded Warhammer','Frostiron Morningstar','Waystone Maul','Crownforged Gavel']},
  staff:{speed:2.9,names:['Gnarled Staff','Oak Staff','Runed Staff','Moonwood Staff','Embergrain Staff','Rimeheart Staff','Waystone Crook','Crownroot Spire']},
  bow:{speed:2.8,names:['Worn Shortbow','Hunting Bow','Recurve Bow','Ashwood Longbow','Runegrip Longbow','Frostbough Warbow',"Waykeeper's Recurve",'Crownbough Greatbow']}};
const OFFH={shield:['Battered Buckler','Wooden Shield','Iron Shield','Kite Shield','Runebound Tower Shield','Rimeplate Bulwark','Waystone Aegis','Crownsteel Bastion'],
  tome:['Torn Notebook','Apprentice Tome','Bound Grimoire','Arcane Codex',"Runekeeper's Grimoire",'Rime-script Codex','Wayfolk Roadbook','Hollowcrown Atlas'],
  dagger:['Bent Knife','Parrying Dagger','Steel Main-Gauche','Fine Parrying Blade','Riveted Guardknife','Froststeel Main-Gauche',"Waykeeper's Wardblade",'Crownward Parrying Fang']};
const TRINKETS=['Lucky Rabbit Foot','Carved Bone Charm','Silver Locket','Glowing Talisman','Runestone Pendant','Rimeheart Seal','Wayfolk Crossing Charm','Hollowcrown Medallion'];
const SUFFIX={bear:['Bear',['str','sta']],eagle:['Eagle',['int','sta']],monkey:['Monkey',['agi','sta']],owl:['Owl',['int','spi']],tiger:['Tiger',['str','agi']],
  whale:['Whale',['sta','spi']],wolf:['Wolf',['agi','spi']],boar:['Boar',['str','spi']],falcon:['Falcon',['agi','int']]};
const CLASS_SFX={hunter:['monkey','wolf','falcon'],warrior:['bear','tiger','boar'],rogue:['monkey','tiger','wolf'],mage:['eagle','owl','falcon'],priest:['owl','whale','eagle']};
const PRIMARY={hunter:['agi','int'],warrior:['str','agi'],rogue:['agi','str'],mage:['int','spi'],priest:['spi','int']};
const BLUE_PRE=["Fenwatcher's",'Grizzled',"Duneclaw's","Prophet's",'Tidebound','Oathsworn','Bloodstone',
  "Wayfolk's",'Barrow-touched','Rimebound',"Wickwarden's",'Cairn-carved',"Doorweaver's",'Cindervein','Crucible-wrought','Ashwing-marked','Rootward'];
const JUNK={beast:['Cracked Fang','Ruined Pelt','Broken Claw','Matted Fur','Chipped Tooth'],humanoid:['Torn Cloth Scrap','Dented Buckle','Bent Spoon','Rusty Key','Moldy Bread']};
const RAR_NAME=['Poor','Common','Uncommon','Rare','Epic','Legendary'];

