'use strict';
/* =================== the Drowned Sanctum =================== */
const SANCTUM={name:'The Drowned Sanctum',minLvl:17,
  enc:[
    {name:'Drowned Acolytes',n:3,lvl:18,kind:'humanoid',col:'#2a5a8a'},
    {name:'Tidecaller Shamans',n:2,lvl:19,kind:'humanoid',col:'#3a7a9a'},
    {boss:true,name:'Tide Warden Ossak',lvl:20,kind:'humanoid',col:'#1f6a6a',hpM:8,dmgM:2.2,mech:{wave:14},loot:2},
    {name:'Gloomfin Brutes',n:3,lvl:19,kind:'humanoid',col:'#3a8a7a'},
    {boss:true,name:'Mother Murk',lvl:20,kind:'beast',fam:'croc',col:'#3a5a2a',hpM:9,dmgM:2.3,mech:{surge:16,wave:22},loot:2},
    {name:'Abyssal Lurkers',n:2,lvl:20,kind:'beast',fam:'croc',col:'#1a3a4a'},
    {boss:true,final:true,name:"Ysh'Kara, the Tide Beneath",lvl:21,kind:'beast',fam:'lizard',col:'#3a2a7a',hpM:12,dmgM:2.5,mech:{wave:15,surge:19,enrage:150},loot:3}]};
const FOUNDRY={name:'The Cindervein Foundry',minLvl:27,zone:'ashen',sky:['#2e1720','#653c32'],hill:'#3f282b',ground:'#593d33',waveName:'Cinder Rain',surgeName:'Molten Rupture',
  enc:[
    {name:'Foundry Overseers',n:3,lvl:27,kind:'humanoid',col:'#b47748'},
    {name:'Ember Forgemasters',n:2,lvl:28,kind:'humanoid',col:'#d65c32'},
    {boss:true,name:'Foreman Dravok',lvl:28,kind:'humanoid',col:'#ba8754',hpM:8,dmgM:2.2,mech:{wave:14},loot:2},
    {name:'Slagscale Brood',n:3,lvl:28,kind:'beast',fam:'lizard',col:'#cf7838'},
    {boss:true,name:'The Crucible Matron',lvl:29,kind:'beast',fam:'spider',col:'#c95736',hpM:9,dmgM:2.3,mech:{surge:15,wave:23},loot:2},
    {name:'Covenant Flameguards',n:2,lvl:29,kind:'humanoid',col:'#b53d26'},
    {boss:true,final:true,name:'Veyr, Heart of the Mountain',lvl:30,kind:'humanoid',col:'#ee873c',hpM:12,dmgM:2.5,mech:{wave:15,surge:18,enrage:150},loot:3}]};
const BARROWS={name:'The Silent Barrows',minLvl:42,zone:'barrowfield',sky:['#152331','#425567'],hill:'#283542',ground:'#3a4b59',waveName:'Gravewind',surgeName:'Stonewake Rupture',
  enc:[
    {name:'Barrow Lampkeepers',n:3,lvl:42,kind:'humanoid',col:'#869dad'},
    {name:'Cairnweft Brood',n:2,lvl:42,kind:'beast',fam:'spider',col:'#6a7e91'},
    {boss:true,name:'Ordel, Keeper of the Unlit Wick',lvl:43,kind:'humanoid',col:'#8aa5b9',hpM:8.5,dmgM:2.3,mech:{wave:14,chill:14},loot:2},
    {name:'Waystone Bearers',n:3,lvl:43,kind:'humanoid',col:'#7894a5'},
    {boss:true,name:'Selnith, the Doorweaver',lvl:44,kind:'beast',fam:'spider',col:'#a4b6c8',hpM:9.5,dmgM:2.4,mech:{surge:15,wave:23,chill:12},loot:2},
    {name:'Keepers of the Return Path',n:2,lvl:44,kind:'humanoid',col:'#637c90'},
    {boss:true,final:true,name:'The Last Wayward',lvl:45,kind:'humanoid',col:'#b5cedc',hpM:12.5,dmgM:2.6,mech:{wave:15,surge:18,enrage:150,chill:10},loot:3}]};
const ROOTROT={name:'Rootrot Hollow',minLvl:49,zone:'hollowcrown',sky:['#17271b','#68733b'],hill:'#263525',ground:'#302d20',waveName:'Canopy Shudder',surgeName:'Rootheave',
  enc:[
    {name:'Rotgnaw Scavengers',n:3,lvl:49,kind:'beast',fam:'wolf',col:'#737b45'},
    {name:'Hollowroot Gatekeepers',n:2,lvl:49,kind:'humanoid',col:'#667443'},
    {boss:true,name:'Neldrath, the Ringkeeper',lvl:50,kind:'humanoid',col:'#89954e',hpM:8.5,dmgM:2.3,mech:{wave:14},loot:2},
    {name:'Giltweb Brood',n:3,lvl:50,kind:'beast',fam:'spider',col:'#a99b4e'},
    {boss:true,name:'Ossavine, the Tangled Span',lvl:51,kind:'beast',fam:'spider',col:'#b4a363',hpM:9.5,dmgM:2.4,mech:{surge:15,wave:23},loot:2},
    {name:'Ashwing Rootwardens',n:2,lvl:51,kind:'beast',fam:'lizard',col:'#766d44'},
    {boss:true,final:true,name:'Arveth, the Hoard Below',lvl:52,kind:'beast',fam:'lizard',col:'#a58c52',hpM:12.5,dmgM:2.6,mech:{wave:15,surge:18,enrage:150},loot:3}]};
const HEARTWOOD={name:'The Heartwood Vault',minLvl:56,zone:'crownheart',sky:['#142218','#75643a'],hill:'#253024',ground:'#312b20',waveName:'Choirfall',surgeName:'Golden Rootbreak',
  enc:[
    {name:'Veilweft Vault Brood',n:3,lvl:56,kind:'beast',fam:'spider',col:'#ad985c'},
    {name:'Rootbound Versekeepers',n:2,lvl:56,kind:'humanoid',col:'#697847'},
    {boss:true,name:'Thessurel, the Inward Voice',lvl:57,kind:'humanoid',col:'#89924e',hpM:9,dmgM:2.4,mech:{wave:14},loot:2},
    {name:'Hearttusk Rootbreakers',n:3,lvl:57,kind:'beast',fam:'boar',col:'#746443'},
    {boss:true,name:'Vaulkris, the Goldweb Veil',lvl:58,kind:'beast',fam:'spider',col:'#c0a665',hpM:10,dmgM:2.5,mech:{surge:15,wave:22},loot:2},
    {name:'Ashwing Vaultwardens',n:2,lvl:59,kind:'beast',fam:'lizard',col:'#a38a54'},
    {boss:true,final:true,name:'Orethul, the Hoardfast',lvl:60,kind:'beast',fam:'lizard',col:'#cead69',hpM:13.5,dmgM:2.7,mech:{wave:14,surge:18,enrage:150},loot:3}]};
const DUNGEONS={sanctum:SANCTUM,foundry:FOUNDRY,barrows:BARROWS,rootrot:ROOTROT,heartwood:HEARTWOOD};
const DUN_MODS={fortified:{name:'Fortified',desc:'Non-boss enemies have 30% more health.'},tyrannical:{name:'Tyrannical',desc:'Bosses have 30% more health and hit 15% harder.'},
  raging:{name:'Raging',desc:'Enemies below 30% health deal 40% more damage.'},tidal:{name:'Tidal',desc:'Boss waves and surges come 30% more often.'}};
