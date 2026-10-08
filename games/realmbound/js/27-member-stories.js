'use strict';
/* R4: each named adventurer has three moments. Generated race/class/personality remain theirs.
   Account ledger survives dismissal; only simulated, present party time counts, never offline jobs. */
const MEMBER_STORY_GATES = [{ seconds: 300, mood: 40 }, { seconds: 900, mood: 55 }, { seconds: 1800, mood: 70 }];
/* title, first confidence, dilemma, two invitations, two remembered outcomes */
const MEMBER_STORIES = {
  Brienne: ['The road worth telling', 'I keep accounts of reopened roads. Every teller names a hero. Nobody names the person who carried the first plank.', 'There is room for one last page. Shall I put our names on it, or leave space for the people who made the crossing possible?', 'Sign it together', 'Leave room for the roadkeepers', 'Our signed account hangs by the hearth. A new member has already asked to add their own first crossing.', 'The unsigned page hangs by the hearth. Travelers have begun filling it with names of people who carried planks.'],
  Aldous: ['Behind the request', 'I remembered a reward but forgot who needed the help. That has been bothering me more than the missing coin.', 'I have written the person into my account at last. Should I read it aloud here, or carry it quietly back to them?', 'Read their story here', 'Return it in private', 'I read the account at supper. Now the guild asks who needs help before asking what the reward is.', 'I sent the account back with a traveler. A reply came: Thank you for remembering me, and for keeping my trouble mine.'],
  Merrin: ['The second crossing', 'My directions say the water is shallow. They were true when I wrote them. That is not the same as being true now.', 'I corrected the crossing notes. Do we post every uncertain detail, or print a short route with a clear warning?', 'Share the uncertain details', 'Make a short, cautious guide', 'The hall map has my questions beside the crossing. Other travelers leave dated corrections instead of pretending certainty.', 'A short route hangs by the door: Check the water before crossing. People actually read it before they leave.'],
  Tobias: ['One more bowl', 'Someone gave me shelter on a night I could not pay. I kept the debt in my notebook. I never kept their name.', 'I may never find that hearth again. Should I keep searching, or repay the shelter by offering it here?', 'Keep a place for their name', 'Welcome someone else', 'There is a blank line in the hall guest book. Visitors leave leads, and I no longer have to search alone.', 'I set a spare bowl at our table. The first tired visitor asked its price. I got to say: Sit down first.'],
  Elowen: ['The way back', 'Everyone remembers the path into trouble. I draw the way out. I used to hide that page so nobody thought I was afraid.', 'Will you help me show the return route before our next departure, or let each companion trace their own?', 'Walk everyone through it', 'Let each person trace a route', 'My return map stays open at departures. We name a meeting place before anyone talks about glory.', 'There are several return paths on the map now. I learned one from a quieter member I had never thought to ask.'],
  Garrett: ['The bent handle', 'This little camp tool has been repaired more times than I can count. I thought that meant I ought to throw it away.', 'It still works, but its handle needs care. Shall we keep it working, or give it a place beside a new tool?', 'Keep the old tool working', 'Retire it with its story', 'The old tool lives on the workbench. I tied a note to it: Mend it, use it, lend it. Nobody calls it rubbish now.', 'The bent handle hangs above the workbench. Its new partner gets used every day. Retirement did not have to mean forgetting.'],
  Isla: ['Room to disagree', 'At a fire once, two friends stopped speaking over which road to take. I remember the silence better than either road.', 'I want our hall to handle disagreement better. Do we start a listening circle, or agree on a pause before decisions?', 'Make a listening circle', 'Make room for a pause', 'We tried the listening circle. Nobody had to win supper. Two members left still disagreeing, and still walking together.', 'Our hall has a small rule now: A pause is not a defeat. Someone used it today, and the table stayed warm.'],
  Corwin: ['The maker behind the mark', 'I copied the mark on a useful buckle. I had pages of symbols before I thought to ask whose hands made it.', 'I found an account of the maker. Should their name lead the display, or should we show how their work taught other hands?', 'Put the maker first', 'Show the chain of learning', 'The maker has a name on our display now. People stop saying just a buckle and start asking about the hands.', 'Our display follows the mark from hand to hand. A member brought in their first clumsy repair to add beside it.'],
  Hazel: ['A road in another season', 'I keep returning to familiar roads. Others ask why, as if a place can only be worth seeing once.', 'My seasonal notes are ready. Do we make a calendar of changes, or leave an open page for surprises?', 'Make a seasonal calendar', 'Keep a page for surprises', 'A calendar hangs near the door. Someone noticed the early buds because they remembered my winter sketch.', 'The open page is already crowded. My favorite entry is simply: The usual puddle had a frog today.'],
  Rhys: ['What stayed kept', 'I counted promises kept on the road. Then I began counting them against people. It made every late arrival feel like betrayal.', 'I want a better record. Should it celebrate kept promises, or include how we repaired the ones we missed?', 'Celebrate promises kept', 'Record repairs as well', 'Our promise book starts with the small things people did. I find myself noticing them before I notice a delay.', 'Our promise book has a column for making things right. I added my own missed watch before asking anyone else.'],
  Maeve: ['The quieter account', 'There is always someone who talks after the fire has gone out. I have heard good stories with nobody left to listen.', 'One companion let me copy their account. Should I read it in their place, or help them find a quiet audience?', 'Read with their permission', 'Make a quiet audience', 'I read the account exactly as its teller asked. The loudest member waited until the last line before speaking.', 'We held a small reading by the hearth. The teller stopped twice. Nobody filled the silences for them.'],
  Dorian: ['The name beneath the damage', 'An old road name survives in three different forms. Each teller swears theirs is the one from before the damage.', 'The differences matter too. Should I set all three names together, or choose the local name and preserve the rest below it?', 'Show all three names', 'Lead with the local name', 'Three names share a page in the hall. Visitors tell us what each meant, rather than arguing which memory must disappear.', 'The local name heads our page. The older names sit beneath it with their tellers. A damaged place can have more than one true account.'],
  Wynn: ['The next warm door', 'I made a map of welcome hearths. Then one went dark. I had marked a promise the people there had never made.', 'I am remaking it with permission. Should it list open doors, or people willing to help find one?', 'Mark doors that consent', 'Mark people who can help', 'Each hearth on the map has agreed to be there. The blank spaces are honest, and we plan around them.', 'The map names willing guides instead of guaranteed beds. A visitor found shelter through a conversation, not a false promise.'],
  Celeste: ['When the watch rests', 'Every camp has a different watch custom. I collected the calls, but not the little things that let the watcher sleep afterward.', 'I wrote a returning-watch welcome. Do we make it a spoken greeting, or a quiet place with a covered lamp?', 'Give a spoken welcome', 'Leave a quiet place', 'We greet returning watchers by name. One told me it was the first time the hall noticed the end of their shift.', 'A covered lamp and a quiet chair wait for the returning watch. Nobody asks for a report before they have sat down.'],
  Bram: ['The last arrival', 'I used to carry an extra burden without asking. Sometimes I helped. Sometimes I made someone feel I had decided they were weak.', 'I want a better way to share the road. Do we ask at every rest, or agree on a signal anyone can use?', 'Ask at each rest', 'Agree on a private signal', 'We ask what each person needs at a rest. Today someone offered to carry something of mine. I said yes.', 'We agreed on a small hand signal. A companion used it without having to explain themselves in front of everyone.'],
  Odette: ['The letter and its silence', 'I carried a letter whose edges were worn soft. I knew its journey well enough to explain it. I was not sure I had the right.', 'The receiver asked me to tell the journey here. Should I read only their chosen lines, or tell the road that brought it?', 'Read the chosen lines', 'Tell the journey around it', 'The chosen lines are in our letter book. The rest stayed folded. People understood that some words belong to their receiver.', 'I told the road, the rain and the patient hands. The private words stayed private. The hall listened to the journey.'],
  Kesh: ['A useful escape', 'My narrow escapes sound grand when I tell them quickly. Told slowly, they show where I should have asked for help.', 'I wrote one down honestly. Should we practice the lesson, or tell it to new members over supper?', 'Practice the safer approach', 'Tell the honest account', 'We practiced getting clear together. It looked far less grand than my tale, and felt far more useful.', 'I told the whole escape at supper, including the foolish part. A new member asked for help the next morning.'],
  Ruk: ['Ground worth holding', 'I remember a stand I made because I did not want to look afraid. The ground itself had nothing worth protecting.', 'I want to name what a stand is for before making one. Do we write that question over the door, or carry it in our road notes?', 'Put the question over the door', 'Carry it in our road notes', 'Above the door it says: Who needs us to hold? Someone asked it before volunteering for a watch today.', 'Our road notes begin with what needs protecting. I can leave useless ground now without calling it a defeat.'],
  Ugra: ['A welcome with water', 'I heard fine promises at watering places. Sometimes a stranger left thirsty because nobody knew who would act on them.', 'I want our welcome to mean something. Shall we name a host for visitors, or keep a shared welcome table?', 'Name a willing host', 'Keep a shared welcome table', 'Visitors can ask for a willing host by name. We take turns. No one has to guess who meant the welcome.', 'A welcome table stands by the hearth. Today a visitor set out cups for the next arrival before leaving.'],
  Thrak: ['Who is not here yet', 'At caravan reunions, I watched everyone celebrate the arrivals. Then I learned to ask who had not arrived.', 'I have a reunion book. Should the first page hold the missing names, or the people who will carry news to them?', 'Keep the missing names visible', 'Name the news carriers', 'The reunion book opens to those still away. We celebrate, and leave their places at the table visible.', 'Our reunion book records who will carry the news. A return no longer has to wait for luck to become a welcome.'],
  Zula: ['A verse that leaves room', 'I collect trail songs. The easiest way to join them is to change every verse until they sound like mine. I do not want that.', 'I have a shared refrain ready. Do we sing the different verses around it, or leave space for new ones?', 'Keep each camp verse', 'Invite new verses', 'We sang the old verses with one shared refrain. Different memories fitted without any voice being rubbed away.', 'The song sheet has empty lines. A shy new member added a verse we had never heard, and we learned it slowly.'],
  Vash: ['When the old path fails', 'I kept giving directions from memory after the path changed. Saying I knew it was easier than admitting I did not.', 'I corrected my notes. Do we keep the old route crossed out, or replace it with a dated survey?', 'Keep the correction visible', 'Make a dated survey', 'My crossed-out route stays on the hall map. It gives other guides permission to say: That used to be true.', 'The new survey has a date and a warning to check again. I no longer mistake a good memory for a current map.'],
  Nokka: ['Returned with thanks', 'I returned borrowed equipment polished and silent. I thought that was enough. I never told its owner where it had helped.', 'I wrote the journey of one loan. Should it go back with the equipment, or start a lending book here?', 'Send the account to its owner', 'Start a lending book', 'The owner replied that the account mattered more than the polish. I keep their reply beside the empty hook.', 'Our lending book records thanks as well as returns. A small tool has a larger story than I expected.'],
  Grom: ['The person behind the rescue', 'People remember the strength in a rescue. I remember the person who told me where to put my feet.', 'They gave permission to share the lesson. Do we tell the rescue from their view, or practice asking before lifting?', 'Tell their side of the rescue', 'Practice asking first', 'The account begins with the rescued person. The hall learned that being carried does not mean having no voice.', 'We practiced asking before lifting. It was awkward, gentle work. I trust our strength more for having done it.'],
  Sira: ['Care on the quiet days', 'Everyone asks about the daring animal stories. I keep thinking about the patient days that made those stories possible.', 'I gathered the keepers\' advice. Should we make a care journal, or let them tell it at a small supper?', 'Make a care journal', 'Invite the keepers to supper', 'The care journal lives beside the adventure accounts. Feeding, rest and patience finally have pages of their own.', 'At supper the keepers spoke about ordinary days. Nobody asked for a daring ending. That was the part I liked best.'],
  Drogo: ['A promise far from home', 'A promise made on the road can become nobody\'s business when its witnesses leave. I have watched that happen.', 'I want ours to travel better. Shall we record a witness here, or send a plain account to the person waiting?', 'Keep a witness in the hall', 'Send the account onward', 'Our hall book names a willing witness. Distance did not erase the promise, and the witness knows what was actually said.', 'The person waiting received our plain account. They wrote back with a correction. We kept it instead of defending our version.'],
  Kaja: ['Before the good food spoils', 'I collect camp recipes and forget to cook them. Once I kept fine ingredients safe until there was nothing good left to share.', 'I have a recipe from the road. Do we cook it together, or copy it for travelers who need an easy meal?', 'Cook together at the hearth', 'Copy it for the road', 'We cooked together, a little unevenly. The recipe has everyone\'s corrections now. Nothing waited around for a perfect occasion.', 'The recipe by the door uses what travelers can carry. Someone returned with a different herb and a useful correction.'],
  Tusk: ['What the trophy leaves out', 'A trophy can make a victory look clean. The hardest part of mine was the care afterward, and that never shows.', 'I want to change its account. Should I set it beside the recovery notes, or put it away and keep the lesson?', 'Display it with the recovery notes', 'Keep the lesson, put it away', 'The trophy and the recovery notes share a shelf. People ask about the cost before they admire the shape.', 'The trophy is put away. The lesson stays in our road book: A victory is not finished while someone still needs help.'],
  Vela: ['A landmark after dusk', 'My best landmark disappears in low light. I gave someone directions that worked only while I was standing there at noon.', 'I drew the route for dusk. Should we use silhouettes, or pair landmarks with simple distances?', 'Draw the dusk silhouettes', 'Add measured distances', 'Dark silhouettes mark our route page. A returning traveler recognized the bend before they could see its colors.', 'The route page has short measured stretches between landmarks. It helped even when the mist hid the familiar shapes.'],
  Morg: ['The argument that ended', 'I collect accounts of quarrels settled without a feud. The best ones have an apology nobody tries to turn into a prize.', 'I have permission to share one. Do we tell both sides at supper, or write down the repair they agreed on?', 'Let both accounts be heard', 'Record the agreed repair', 'We heard both accounts, separately and without interruption. Neither was a villain. Their repair made more sense afterward.', 'The agreed repair is in our hall book. No verdict, no winner. Just what each person did to make the next meeting easier.'],
  Ishara: ['More than the word welcome', 'A camp said welcome to an outsider, then explained every custom too late. I remember how small they tried to make themselves.', 'I want our hall to do better. Shall we ask visitors what would help, or offer a companion for their first evening?', 'Ask what would help', 'Offer an evening companion', 'We ask visitors what would make the hall easier. One answer was simply: Tell me which chair is free. We did.', 'A willing member offers company on a first evening. A visitor declined today, and we welcomed that answer too.'],
  Brakka: ['Before the warning grows', 'I carry news between watch fires. An urgent warning grows in the telling if nobody separates what they saw from what they fear.', 'I have rewritten one warning. Should we mark the evidence on a notice, or teach the hall a short call and reply?', 'Mark what was actually seen', 'Teach a clear call and reply', 'The notice separates sighting from suspicion. A traveler brought a correction, and the hall changed the warning without a quarrel.', 'Our warning call asks: Seen, or feared? The reply leaves room for both, but nobody mistakes one for the other.']
};
/* Ten new decisions have plain, recoverable stakes. Legacy decisions keep their original script. */
const MEMBER_STORY_STAKES = {
  "Brienne": {
    "hurt": 0,
    "dilemma": "A publisher wants our road account. Leading with our own names might draw readers, but I promised the plank-carriers equal credit. Taking the headline for ourselves would hurt my trust.",
    "a": "Lead with our own names",
    "b": "Give the roadkeepers equal credit",
    "hurtLine": "The account calls us the heroes and leaves the plank-carriers in a footnote. I asked you to share the credit. I am not ready to put your name beside mine again.",
    "trustLine": "Everyone who carried a plank has a name beside ours. The publisher shortened the headline; I would rather have a smaller story that tells the truth.",
    "repair": "We will correct the account together and give the roadkeepers equal space.",
    "after": "The corrected account still says who asked for the first headline. It also says who came back to set the credit right. I can write beside you again."
  },
  "Aldous": {
    "hurt": 0,
    "dilemma": "This account names someone who asked for privacy. Reading it at supper could teach the hall who needed help, but I promised not to expose their trouble. Sharing it publicly would hurt my trust.",
    "a": "Read the named account at supper",
    "b": "Return it to them privately",
    "hurtLine": "The hall knows their trouble now. They asked me why I trusted you with it. I have no comfortable answer, and I will not hand you another private account yet.",
    "trustLine": "They received the account privately. They thanked us for remembering the person without making their trouble a hall story.",
    "repair": "We will take the named copy down and ask permission before sharing any account again.",
    "after": "The copy is withdrawn. We cannot make the first reading unheard, but the person accepted our apology. I can trust you with a confidence again."
  },
  "Elowen": {
    "hurt": 1,
    "dilemma": "The group wants to leave before we discuss the return route. Leaving now keeps their excitement, but I need them to hear the way out. Passing over my map would make me feel dismissed.",
    "a": "Hear the return route before leaving",
    "b": "Leave the briefing for later",
    "hurtLine": "Nobody asked about the way out. I folded my map and stopped offering directions. You knew why I drew it, and still treated it as a delay.",
    "trustLine": "We named a meeting place before leaving. The eager ones grumbled, then asked for copies. You made room for caution without calling it cowardice.",
    "repair": "We will gather the group before departing and let you finish the return briefing.",
    "after": "You brought the group back to hear the route. I still remember the first departure, but you stayed for every question. I am offering my map again."
  },
  "Garrett": {
    "hurt": 1,
    "dilemma": "The workbench is crowded. Clearing my old tool would make room, but its repairs hold people I remember. Throwing it onto the scrap pile without asking would hurt me.",
    "a": "Keep the repaired tool on the bench",
    "b": "Clear it onto the scrap pile",
    "hurtLine": "I found the bent handle on the scrap pile. You heard its story and cleared it away anyway. I will mend things beside you, but I am keeping my keepsakes to myself.",
    "trustLine": "You made room for the repaired tool. Its handle has another stitch now, and someone asked to learn how to make one.",
    "repair": "We will retrieve the handle and give you the choice of where it belongs.",
    "after": "The handle came back, and this time you asked. I put it above the bench myself. We cannot undo the careless moment, but I can lend you my tools again."
  },
  "Maeve": {
    "hurt": 0,
    "dilemma": "The teller asked for a small, quiet audience. A feast would bring more listeners, but the crowd could silence them again. Booking the main feast would make me feel you had not listened.",
    "a": "Book the reading at the main feast",
    "b": "Arrange the quiet audience they asked for",
    "hurtLine": "They stopped at the first cheer and could not begin again. More ears were not what they needed. I will not bring another quiet account to you while this is unresolved.",
    "trustLine": "We listened in a small circle. The teller stopped twice; nobody filled the silence. They asked when we could meet again.",
    "repair": "We will apologize to the teller and arrange a smaller reading only if they want it.",
    "after": "They chose the smaller reading, and you waited through the silence. I remember the feast, but I also remember you listening properly afterward."
  },
  "Kesh": {
    "hurt": 1,
    "dilemma": "New members want my escape story. Telling only the bold parts would give them courage, but it would hide where I should have asked for help. Turning it into a boast would make me withdraw my trust.",
    "a": "Tell the escape with its mistakes",
    "b": "Keep only the bold parts",
    "hurtLine": "They applauded a version I no longer recognize. A new member repeated the risky shortcut. I will travel with you, but I will not ask you to tell my story again yet.",
    "trustLine": "I admitted the foolish part. A new member asked for help before leaving. A less impressive story did more useful work.",
    "repair": "We will tell the missing part together and practice the safer approach.",
    "after": "You stood beside me while we corrected the tale. Nobody pretended the boast never happened. I can ask you for help without needing to look grand again."
  },
  "Zula": {
    "hurt": 0,
    "dilemma": "One familiar refrain would be easy to learn. Replacing the camp verses would also erase the voices I collected. Replacing them rather than learning them would hurt my trust.",
    "a": "Replace the camp verses with our refrain",
    "b": "Learn the different verses together",
    "hurtLine": "The hall sings easily now, but the visiting singers cannot hear their own camps in it. You made my collection quieter by making every voice ours.",
    "trustLine": "We learned the different verses slowly. One shared refrain holds them together without taking their memories away.",
    "repair": "We will restore the camp verses and ask their singers to teach us.",
    "after": "The singers taught us their verses again. Our sheet keeps a note about what we removed and restored. I am willing to learn a new song beside you."
  },
  "Nokka": {
    "hurt": 1,
    "dilemma": "The borrowed tool would help our lending bench. Its owner still expects it back. Keeping it for the hall might help more hands, but breaking that promise would hurt my trust.",
    "a": "Return the tool with its account",
    "b": "Keep the loan on our lending bench",
    "hurtLine": "Its owner came to collect it and found a queue of borrowers. We helped our hall by spending somebody else's permission. I will not arrange another loan for you yet.",
    "trustLine": "The tool went home with its account. Its owner offered another loan because we treated the first as a promise.",
    "repair": "We will return the loan, explain the delay and ask before borrowing it again.",
    "after": "The owner took it back and heard our apology. They have not forgotten the delay. I can vouch that you returned to put it right."
  },
  "Tusk": {
    "hurt": 0,
    "dilemma": "The trophy could lift the hall's spirits on its own. I need the recovery notes beside it: the people hurt afterward are part of the victory. Displaying only the trophy would make me feel used.",
    "a": "Display the trophy on its own",
    "b": "Display the recovery notes beside it",
    "hurtLine": "People praised a clean victory. You knew it was not clean. I covered the trophy and stopped answering the proud questions; I do not want you to speak for me yet.",
    "trustLine": "People read the care notes before admiring the trophy. Some stayed to ask who still needed help. That is a victory I can share.",
    "repair": "We will put the recovery account beside the trophy and let you tell its full cost.",
    "after": "You stayed while I told the harder part. The display remembers its first, incomplete telling and the correction. I can share that shelf with you again."
  },
  "Morg": {
    "hurt": 1,
    "dilemma": "Both people allowed me to share the repair, but neither allowed a verdict. Naming a winner would settle supper quickly. It would also break the promise that makes this account worth keeping.",
    "a": "Record the repair without a verdict",
    "b": "Name a winner in the hall account",
    "hurtLine": "One person stopped coming to supper after we named the winner. Their apology became a prize for the other. I trusted you to leave room for both accounts.",
    "trustLine": "The account records what each person did to repair the quarrel. They ate at different tables today, but neither had to leave the hall.",
    "repair": "We will remove the verdict and invite both people to approve the repair account.",
    "after": "Both approved the revised account. Neither owes us a cheerful ending. I trust you more for returning to listen, and the book keeps the first verdict as a mistake we repaired."
  }
};
function memberStoryScript(name, state) {
  const original = MEMBER_STORIES[name], stakes = MEMBER_STORY_STAKES[name];
  if (!original || !stakes || state.done >= 2 && !state.reaction) return original;
  const script = original.slice(); script[2] = stakes.dilemma; script[3] = stakes.a; script[4] = stakes.b;
  script[5 + stakes.hurt] = stakes.hurtLine; script[5 + (1 - stakes.hurt)] = stakes.trustLine; return script;
}
function memberStoryHurt(state) { return state.reaction === 'hurt' && !state.repaired; }
function memberStoryResult(name, state) {
  const stakes = MEMBER_STORY_STAKES[name];
  if (!state.reaction || !stakes) return '';
  return state.repaired ? stakes.after : state.reaction === 'hurt' ? stakes.hurtLine : stakes.trustLine;
}
function memberStoryConsequence(state) {
  return state.reaction === 'hurt' ? state.repaired ? 'Trust repaired. The original choice remains in the record.' : 'Trust hurt: mood −8 at the decision; no friendship reward. Make amends at the hearth, with no extra mood or time gate.' : state.reaction === 'trusted' ? 'Trust kept: +2 friendship and +2 mood at the decision.' : '';
}
function repairMemberStory(key) {
  const w = workerOf(key), state = memberStoryState(key);
  if (!w || !MEMBER_STORY_STAKES[w.name] || !memberStoryHurt(state) || state.done < 2 || memberStoryMeetingProblem(key)) return false;
  state.repaired = true; moodBump(w.n, 8, w.hero);
  const memory = MEMBER_STORY_STAKES[w.name].after; line(w.name + ': ' + memory, 'l-say'); slog(w.name + ' — made amends: ' + memory); save(); return true;
}
function playMemberStoryRepair(key, returnToBook) {
  const w = workerOf(key), state = memberStoryState(key);
  if (RTALK || !w || !memberStoryHurt(state) || state.done < 2 || memberStoryMeetingProblem(key)) return false;
  const stakes = MEMBER_STORY_STAKES[w.name]; if (!stakes) return false;
  return memberStoryScene(key, [['', 'Making amends restores 8 mood once. Your choice stays remembered. No payment or waiting is required.'], [w.name + ':sad', stakes.hurtLine], [H().name, stakes.repair], [w.name, 'Will you stand by that? I can forgive you. I cannot pretend the first choice never happened.']], ['Make amends', 'Another time'], choice => {
    if (choice === 0 && repairMemberStory(key)) { renderTab(true); playMemberStory(key, true, returnToBook); }
    else if (returnToBook) openMemberStoryBook();
  });
}
function memberStoryScene(key, lines, choices, onChoose) {
  const w = workerOf(key); if (!w || RTALK) return false;
  const hero = H(), account = S, member = w.m;
  if (modalKind === 'memberstories') closeModal();
  const face = Object.assign(Dialogue.lookFor(w.name, { palette: FACTION_LOOK[w.hero.faction].palette, races: [w.n.race] }), { name: w.name, hairCol: w.n.hair, shirt: CLASSES[w.cls].col, title: CLASSES[w.cls].name + ' · ' + G().name });
  MEMBER_STORY_FACE = face;
  SCN.play(lines, choice => {
    if (MEMBER_STORY_FACE === face) { MEMBER_STORY_FACE = null; SCN.el.classList.remove('member-story-dialogue'); }
    if (S !== account || H() !== hero || G().members[key] !== member) return;
    onChoose(choice);
  }, { choices });
  C.lastInput = C.run; TOWN.auto = null; TOWN.storyGuest = key; RTALK.memberStory = true; RTALK.memberStoryKey = key; SCN.el.classList.add('member-story-dialogue'); SCN.el.scrollIntoView({ block: 'center' }); return true;
}
const MEMBER_STORY_VOICE = {
  cheerful: ['Oh, a bit of road and a bit of company! I have been wanting to tell you this.', 'Will you think this through with me?', 'You remembered. That makes this feel like our hall.'],
  gruff: ['Got a moment? This has stayed with me.', 'Two ways to do it. Hear me out.', 'Good to have someone who listens. Leave that out of the grand speeches.'],
  shy: ['There is something I wanted to tell you, if you have time.', 'I could use another pair of eyes on this.', 'Thank you for leaving room for me.'],
  bold: ['We have shared a road. Now hear the reason I keep walking it!', 'Help me choose a worthy next step.', 'There. A deed small enough to hold, and large enough to remember.'],
  scholarly: ['Our time together has given me a useful observation.', 'I see two possible approaches.', 'An account worth keeping. And a kindness worth recording.'],
  greedy: ['Company costs time. Yours has been a decent investment. Here is why.', 'No coins in this one. Still worth getting right.', 'I am keeping this. No, it is not for sale.']
};
function normalizeMemberStories(raw) {
  const ledger = {};
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return ledger;
  for (const [key, value] of Object.entries(raw)) {
    if (!/^adv:[^:]+:[^:]+$/.test(key) || !value || typeof value !== 'object') continue;
    const done = Number.isInteger(value.done) ? clamp(value.done, 0, 3) : 0;
    const choice = value.choice === 0 || value.choice === 1 ? value.choice : null;
    // Incomplete/corrupt choices return to the decision, never silently pick an ending.
    const reaction = done >= 2 && choice !== null && (value.reaction === 'hurt' || value.reaction === 'trusted') ? value.reaction : null;
    ledger[key] = { seconds: Number.isFinite(value.seconds) ? clamp(value.seconds, 0, 1800) : 0, done: done >= 2 && choice === null ? 1 : done, choice };
    if (reaction) Object.assign(ledger[key], { reaction, repaired: reaction === 'hurt' && value.repaired === true });
  }
  return ledger;
}
function memberStoryState(key, create) {
  const g = G(); if (!g.stories && create) g.stories = {};
  if (g.stories && g.stories[key]) return g.stories[key];
  if (create) return g.stories[key] = { seconds: 0, done: 0, choice: null };
  return { seconds: 0, done: 0, choice: null };
}
function memberStoryData(key) { const w = workerOf(key); return w && w.kind === 'adv' ? MEMBER_STORIES[w.name] || null : null; }
function memberStoryTick(dt) {
  if (!guildOn() || !Number.isFinite(dt) || dt <= 0 || dt > 1 || document.hidden || RTALK) return;
  if (!H() || !C || !['seek', 'fight', 'rest', 'loot'].includes(C.phase)) return;
  const seen = new Set();
  for (const p of C.party || []) {
    if (!p.n || p.n.alt || p.dead) continue;
    const key = p.n.guildKey || memberKey(H().id, p.n.id);
    if (seen.has(key) || !memberStoryData(key)) continue; seen.add(key);
    const state = memberStoryState(key, true); state.seconds = Math.min(1800, state.seconds + dt);
  }
}
function memberStoryProblem(key) {
  const w = workerOf(key), story = memberStoryData(key), state = memberStoryState(key);
  if (!guildOn() || !w || !story) return 'No personal story for this member.';
  if (state.done >= 3) return 'Story complete. The hall remembers your choice.';
  const gate = MEMBER_STORY_GATES[state.done];
  if (affLvl(w.n) < 2) return 'Become Friends before they share their story.';
  if (w.m.mood < gate.mood) return 'Needs mood ' + gate.mood + ' (now ' + Math.round(w.m.mood) + '). Company, work and favors help.';
  if (state.seconds + 1e-7 < gate.seconds) return 'Share ' + Math.ceil((gate.seconds - state.seconds) / 60) + ' more minute(s) adventuring in a present party.';
  return memberStoryMeetingProblem(key);
}
function memberStoryMeetingProblem(key) {
  if (!H() || !inTown() || !TOWN.inside || H().dun) return 'Meet by the hearth in the guild hall.';
  if (ROSTER.jobOf(key) || memberRaiding(key)) return 'Return this member from their job or raid first.';
  if (H().mode === 'auto') return 'Switch to Focus to choose this story yourself.';
  return '';
}
function finishMemberStory(key, expected, choice) {
  if (memberStoryProblem(key)) return false;
  const state = memberStoryState(key, true), w = workerOf(key), story = memberStoryData(key);
  if (state.done !== expected || (expected === 1 ? choice !== 0 && choice !== 1 : choice !== 0)) return false;
  if (expected === 1) { state.choice = choice; const stakes = MEMBER_STORY_STAKES[w.name]; if (stakes) { state.reaction = choice === stakes.hurt ? 'hurt' : 'trusted'; state.repaired = false; } }
  state.done++;
  const script = memberStoryScript(w.name, state);
  const memory = expected === 0 ? 'Shared ' + story[0].toLowerCase() + '.' : expected === 1 ? 'Chose: ' + script[3 + choice] + '.' : memberStoryResult(w.name, state) || script[5 + state.choice];
  if (expected === 1 && memberStoryHurt(state)) { moodBump(w.n, -8, w.hero); addAff(w.n, 0, memory); }
  else { addAff(w.n, 2, memory); moodBump(w.n, 2, w.hero); }
  line(w.name + ': ' + memory, 'l-say'); slog(w.name + ' — ' + memory); sfx('quest'); save(); return true;
}
let MEMBER_STORY_FACE = null;
function memberStoryPortrait(name) { return RTALK && MEMBER_STORY_FACE && name === MEMBER_STORY_FACE.name ? MEMBER_STORY_FACE : null; }
function playMemberStory(key, replay, returnToBook) {
  if (RTALK) return false;
  const w = workerOf(key), state = memberStoryState(key), story = w && memberStoryScript(w.name, state);
  if (!w || !story || (replay ? !state.done : memberStoryProblem(key))) return false;
  if (replay && memberStoryMeetingProblem(key)) return false;
  const expected = state.done, book = modalKind === 'memberstories' || !!returnToBook;
  const voice = MEMBER_STORY_VOICE[w.n.pers] || MEMBER_STORY_VOICE.cheerful;
  const result = memberStoryResult(w.name, state), hurt = memberStoryHurt(state);
  const lines = replay ? [[w.name, story[1]]].concat(state.done >= 2 ? [[w.name, story[2]], [H().name, story[3 + state.choice]]] : [], result ? [['', memberStoryConsequence(state)], [w.name + (hurt ? ':sad' : ':happy'), result]] : state.done >= 3 ? [[w.name + ':happy', story[5 + state.choice]]] : [])
    : [[w.name + (hurt ? ':sad' : ''), hurt && expected === 2 ? 'I have something harder to remember with you.' : voice[expected]], [w.name + (hurt ? ':sad' : ''), expected === 0 ? story[1] : expected === 1 ? story[2] : result || story[5 + state.choice]]];
  if (!replay && expected === 1 && MEMBER_STORY_STAKES[w.name]) lines.splice(1, 0, ['', 'A hurtful choice costs 8 mood and gives no friendship reward. You can make amends in this hall immediately; your member stays, and the choice remains recorded.']);
  const choices = replay ? hurt ? ['Talk it through', 'Back to the hall'] : ['Back to the hall'] : expected === 1 ? [story[3], story[4], 'Another time'] : ['Remember this', 'Another time'];
  return memberStoryScene(key, lines, choices, choice => {
    if (replay && hurt && choice === 0) { playMemberStoryRepair(key, book); return; }
    if (!replay && finishMemberStory(key, expected, choice)) {
      renderTab(true);
      if (expected === 1 && state.reaction) { playMemberStory(key, true, book); return; }
    }
    if (book) openMemberStoryBook();
  });
}
function openMemberStoryBook() {
  if (!H() || !guildOn() || RTALK || !inTown() || !TOWN.inside || H().dun) return false;
  C.lastInput = C.run; TOWN.auto = null;
  openModal('memberstories', '<h3>The hearth book · ' + G().name + '</h3>' + memberStoriesHTML() + '<div class="mfoot"><button class="btn alt" data-act="close">Back to the world</button></div>'); return true;
}
function clearMemberStory(key) {
  if (RTALK && RTALK.memberStory && (key === undefined || RTALK.memberStoryKey === key)) { RTALK = null; SCN.el.hidden = true; MEMBER_STORY_FACE = null; SCN.el.classList.remove('member-story-dialogue'); }
}
function memberStoriesKey() {
  return guildOn() ? Object.keys(G().members).map(key => {
    const state = memberStoryState(key); return [key, state.done, state.choice, state.reaction, state.repaired, Math.floor(state.seconds / 60), memberStoryProblem(key)].join(':');
  }).join('|') : '';
}
function memberStoryRecordsHTML() {
  if (!guildOn()) return '';
  const records = Object.entries(G().stories || {}).filter(([key, state]) => state.done > 0).map(([key, state]) => ({ state, n: advNpc(key) })).filter(({ n }) => n && MEMBER_STORIES[n.name]);
  if (!records.length) return '<h4>Stories remembered</h4><p class="meta">No personal moments recorded yet. Meet your companions by the guild hearth.</p>';
  return '<h4>Stories remembered</h4>' + records.map(({ state, n }) => {
    const story = memberStoryScript(n.name, state);
    const memory = (state.reaction ? 'You chose: ' + story[3 + state.choice] + '. ' : '') + (memberStoryResult(n.name, state) || (state.done >= 3 ? story[5 + state.choice] : state.done >= 2 ? 'You chose: ' + story[3 + state.choice] + '.' : 'Shared a confidence: ' + story[1]));
    return '<div class="rowl member-record"><div class="l"><b>' + n.name + ' · ' + story[0] + '</b><div class="meta">' + state.done + '/3 moments remembered</div><div class="meta">' + memory + '</div><div class="meta">' + memberStoryConsequence(state) + '</div></div></div>';
  }).join('');
}
function memberStoriesHTML() {
  if (!guildOn()) return '';
  const members = Object.keys(G().members).map(key => ({ key, w: workerOf(key), story: memberStoryData(key) })).filter(x => x.story);
  if (!members.length) return '';
  return '<h4>By the hearth · personal stories</h4><p class="sub">Three moments per adventurer, after 5 / 15 / 30 minutes together and mood 40 / 55 / 70. Present party time on the road counts; jobs and time away do not. Ordinary moments give +2 friendship and +2 mood, once. Ten decisions can hurt trust: their warning is spoken before you choose. Your choice stays with the guild, even if a member leaves. Hurt decisions cost 8 mood instead of granting a reward. Make amends at this hearth without a mood, friendship or time gate; restore 8 mood once. Your companion stays, and the record remembers.</p>' + members.map(({ key, w, story }) => {
    const state = memberStoryState(key), why = memberStoryProblem(key), meeting = memberStoryMeetingProblem(key);
    const script = memberStoryScript(w.name, state);
    const remembered = memberStoryResult(w.name, state) || (state.done >= 3 ? script[5 + state.choice] : state.done >= 2 ? 'Your choice: ' + script[3 + state.choice] + '.' : state.done ? 'First confidence remembered.' : 'They have a story to share.');
    return '<div class="rowl member-story"><div class="l"><b>' + w.name + ' · ' + story[0] + '</b><div class="meta">' + state.done + '/3 moments · ' + Math.floor(state.seconds / 60) + ' minutes together · mood ' + Math.round(w.m.mood) + '</div><div class="meta">' + remembered + '</div><div class="meta">' + memberStoryConsequence(state) + '</div><div class="meta">' + (why || 'Ready to talk. No cost or deadline.') + '</div></div><div class="r">' + (state.done < 3 ? '<button class="btn sm" data-act="memberstory" data-arg="' + key + '" ' + (why ? 'disabled' : '') + '>Listen</button>' : '') + (memberStoryHurt(state) ? '<button class="btn sm" data-act="memberrepair" data-arg="' + key + '" ' + (meeting ? 'disabled title="' + meeting + '"' : '') + '>Make amends</button>' : '') + (state.done ? '<button class="btn sm alt" data-act="membermemory" data-arg="' + key + '" ' + (meeting ? 'disabled title="' + meeting + '"' : '') + '>Remember</button>' : '') + '</div></div>';
  }).join('');
}
document.addEventListener('click', e => {
  const el = e.target.closest('[data-act]'); if (!el) return;
  if (el.dataset.act === 'memberstory') playMemberStory(el.dataset.arg, false);
  else if (el.dataset.act === 'memberrepair') playMemberStoryRepair(el.dataset.arg, modalKind === 'memberstories');
  else if (el.dataset.act === 'membermemory') playMemberStory(el.dataset.arg, true);
});