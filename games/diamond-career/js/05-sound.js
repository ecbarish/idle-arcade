'use strict';
/* Original eight-bar sketches; all sound starts off and uses the shared engine. */
const DC_TRACKS={
  park:{bpm:108,lead:'triangle',echo:true,mel:'G4 . B4 D5 E5 D5 B4 . A4 . D5 . C5 B4 A4 . G4 B4 D5 . G5 F#5 E5 D5 C5 . A4 B4 D5 . G4 .',bass:'G2 . . D3 . . G2 . C3 . . G2 D3 . . .',drum:'k . h . s . h . k h . h s . h .'},
  home:{bpm:76,lead:'triangle',echo:true,mel:'E4 . G4 . B4 A4 G4 . D4 . F#4 A4 G4 . E4 . C4 E4 G4 . A4 G4 E4 . D4 . G4 . E4 . . .',bass:'C3 . . . G2 . . . A2 . . . D3 . G2 .'}
};
function setupSound(){
  SOUND=ArcadeSound.create({tracks:DC_TRACKS,mode:()=>S.sound,setMode:n=>{S.sound=n;saveCareer();},musicKey:()=>S.phase==='pitch'||S.phase==='result'?'park':'home',button:()=>document.querySelector('#sound')});
  document.querySelector('#sound').addEventListener('click',()=>SOUND.cycle());SOUND.render();
}
