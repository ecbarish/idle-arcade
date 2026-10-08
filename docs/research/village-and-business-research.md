# Gemini's report: a village builder and a business tycoon (2026-10-08)

Evan's Gemini Deep Research answer to the prompt Claude gave him on 2026-10-08 (village builder and business manager;
docs/research/decisions.md "New game ideas"), read from his share link (https://share.gemini.google/fVxSKIMb1RFc) and
saved as shown there. The share page's citation links were not readable; names of sources are kept as written. Math
formulas lost their formatting on the page and are written out plainly. Claude's review:
[village-and-business-review.md](village-and-business-review.md).

---

# Diegetic Systems and Ethical Progression in Browser-Based Management Games: A Design Research Report

## 1. Introduction and Architectural Mandate

The contemporary landscape of browser-based and mobile management games is overwhelmingly saturated with monetization strategies that prioritize microtransactions, advertisement loops, and artificial waiting timers. When tasked with engineering two original, free-to-play browser games using the open-source Godot engine—specifically, an autonomous village builder and a tactile business tycoon simulator—the deliberate removal of these dark patterns necessitates a foundational shift in how progression, player retention, and spatial interaction are engineered.

The project mandate dictates strict operational parameters: active play must always yield equal or greater rewards than idle play; automation must be earned intrinsically through gameplay; the budget is restricted entirely to free tools and zero paid services; and the game world must be entirely diegetic. A diegetic design philosophy demands that all gameplay interactions occur within the physical bounds of the game space—characterized by tangible avatars navigating a simulated environment—rather than through abstract menus, dashboards, or floating UI panels. This report provides an exhaustive, multi-disciplinary analysis of these two proposed game designs. By synthesizing mathematical models of idle progression, the psychology of diegetic user interfaces, and architectural principles drawn from procedural placement postmortems, this document establishes a comprehensive framework for creating deep, ethical, and highly retentive management experiences.

## 2. Theoretical Foundations for Ethical Browser Games

Before detailing the specific implementation of the village builder and the business tycoon, it is critical to establish the shared mechanical, mathematical, and philosophical frameworks that will govern both titles. These frameworks ensure that the Godot-based games remain cohesive, respect the player's time, and function optimally across varied hardware platforms without relying on paid backend services or telemetry.

### 2.1 The Mathematics of Honest Pacing and Active Supremacy

The removal of microtransactions and paid speed-ups fundamentally alters the mathematical foundation of the management genre. In traditional idle and incremental games, progression is dictated by a strict mathematical race between polynomial income growth and exponential cost growth (Kongregate Developer Blog: The Math of Idle Games, Part I).

The total production formula in traditional management titles is generally expressed as: production_total = (production_base × owned) × multipliers. Meanwhile, the cost of the next upgrade or generator is calculated as: cost_next = cost_base × (rate_growth)^owned.

In monetized games, because exponential growth will always outpace polynomial growth, players inevitably hit a mathematical "wall" where costs become prohibitive. Developers rely on this friction to sell premium multipliers. In an ethical, free-to-play Godot game, this wall must be intentionally dismantled. The rate_growth coefficient must be kept exceptionally low (e.g., 1.05 instead of the genre-standard 1.15), or the economy must utilize hard caps.

To fulfill the requirement that active play remains superior to idle play, developers can look to alternative growth models, such as derivative-based generation. As explored in Anthony Pecorella's GDC analyses (The Math of Idle Games, Part II), an economy where generators produce other generators effectively mimics integrals in calculus. For instance, if a player actively manages a secondary tier of production, the resulting currency graph models a parabola (y = x²/2), representing the integral of the linear equation y = x. By restricting these higher-order derivatives (such as Taylor Series expansions approaching e^x) to actions that require physical, on-screen player navigation, the game naturally rewards active engagement over passive waiting.

### 2.2 Diegetic Interfaces and the "Fable 3" Warning

A core requirement for both titles is that actions occur within the physical game world. The concept of "diegetic UI"—where interface elements exist as physical objects within the game narrative—was famously popularized by titles like Dead Space, which integrated health and inventory readouts directly onto the player character's physical model. However, enforcing a purely physical world in a management game introduces severe risks regarding player tedium.

According to review anecdotes regarding Fable 3, players consistently highlighted the danger of over-committing to physical interfaces; users were forced to walk their avatar into a physical "sanctuary" room merely to change a weapon or access a map, a design choice widely condemned as a workflow-breaking chore. The critical design lesson is that spatial navigation must remain a core component of the gameplay loop, not an administrative barrier. For instance, walking to a physical ledger to purchase upgrades is satisfying if it serves as a macro-level pacing mechanism (a ritualistic break after a long day of virtual work). Conversely, forcing a player to walk across a sprawling map merely to check current inventory levels introduces extreme cognitive friction.

To balance diegesis with usability, both games must employ "diegetic circulation," defined in level design theory as how fictional characters organically use the space (The Level Design Book). Information must be visually represented in the environment—shelves looking empty, villagers visibly carrying logs, or coin piles growing physically larger—eliminating the need for abstract numerical dashboards. The economy must be transparent and low-integer. Postmortems from city builders like Against the Storm emphasize that utilizing low integers with "no fractions, no big numbers, and no abstract systems" ensures players can intuitively read the physical state of their world without relying on spreadsheet overlays.

### 2.3 Unifying Phone and Desktop Controls in Godot

Because the games will be hosted in a browser and must accommodate both desktop and mobile users simultaneously, the control scheme must bridge the gap between mouse/keyboard and touch interfaces seamlessly.

For desktop users, standard WASD keyboard controls combined with mouse-driven interaction (clicking physical objects in the world) provides optimal precision. For mobile browser environments, Godot's touch-screen capabilities must deploy a dynamic virtual joystick system. When the user touches the left side of the screen, a virtual analog stick dynamically appears under their thumb to control physical movement. The right side of the screen is reserved for context-sensitive tapping, interacting directly with the physical object the avatar is facing. This configuration avoids cluttering the limited screen real estate with permanent, non-diegetic interface buttons, thereby preserving the visual fidelity of the game world.

### 2.4 The Psychology of Prestige and Narrative Resets

Prestige mechanics—where a player resets their progress in exchange for permanent meta-upgrades—are a staple of the management genre. However, the determination of whether they help or hurt a game depends entirely on their implementation.

Mathematical analyses of prestige loops identify various models, such as the Max Earnings Model (derived from a quadratic equation) and the Lifetime Earnings Square Root Model (The Math of Idle Games, Part III). These formulas dictate that players face steep diminishing returns upon resetting, requiring them to push significantly further in subsequent runs just to earn the same proportional rewards. In contrast, the Independent Run Fractional Exponent Model (utilized by games like Egg, Inc.) calculates prestige strictly on the current run's earnings using formulas like Δp = (c_R / 10^6)^0.14. Because this model yields the same relative reward for repeating the exact same actions, it actively nudges players into highly active play loops rather than long, passive idle sessions.

However, in a diegetic, non-monetized game, raw mathematical prestige is often viewed negatively. Player critiques of incremental games suggest that prestige is frequently utilized as a "cheap way to try to give the player more of what he got earlier". To be effective and engaging over weeks of play, a prestige reset must alter the qualitative mechanics of the game, akin to "legacy" mechanics in physical board games. Instead of merely boosting a numerical multiplier, a reset should advance the game to a new historical era, introduce novel customer archetypes, or unlock entirely new paradigms of physical automation.

## 3. Game Design 1: The Autonomous Adventurer Village

The first design is a diegetic village builder and management simulation inspired by Majesty, Townscaper, Dorfromantik, and Dungeon Village. The project owner has indicated that a small adventuring-guild game already exists (featuring adventurer recruitment, expeditions, and seasonal cycles). This existing framework serves as the perfect mechanical foundation, evolving the abstract guild management into a physical, architectural space.

### 3.1 Integration with the Existing Guild Game and Core Loop

Rather than operating off a dashboard, the existing guild game's mechanics are physicalized. The player controls a tangible Guildmaster avatar who runs a burgeoning frontier outpost. The core loop revolves around the player physically walking their avatar to designated plots to construct facilities (inns, weapon shops, alchemy labs) using locally harvested resources. These facilities organically attract the AI-controlled adventurers from the pre-existing guild mechanics.

Crucially, the player cannot directly control these adventurers; instead, they exert indirect control by physically posting bounties on a central town board or pricing items favorably. Adventurers physically walk up to the board, read the bounties, and venture out past the town boundaries to fight monsters. They return with loot and gold, which they spend at the player's facilities. The player physically collects this spent gold from shop counters to fund further village expansion, transitioning from executing manual labor (such as chopping wood) to hiring specialized villagers to automate resource pipelines.

### 3.2 The First 15 Minutes

The experience opens with the player avatar standing in a small clearing surrounded by dense, procedural forests. The player is visually prompted to clear space by physically walking up to trees and interacting with them to harvest wood. Once enough wood is gathered, the player walks to a drafting table (a diegetic object) to select the "Adventurer's Tent" blueprint. Placing the tent triggers a satisfying, organic animation—a hallmark of games like Dorfromantik and Townscaper, where the mere act of placement feels intrinsically rewarding.

Shortly after, a low-level adventurer from the existing guild system physically walks onto the screen from a trail. The adventurer interacts with the player, handing over coins to rent the tent. The player then walks to the town bounty board and pins a "Hunt Slimes" request, funding it with their starting coins. The adventurer accepts the bounty, leaves the screen, and returns a minute later, visibly injured but carrying slime jelly. The adventurer visits a newly built physical campfire to heal, pays the player a fee, and goes to sleep. Within fifteen minutes, the player is left with a tangible, visual sense of a living ecosystem.

### 3.3 Algorithm and Aesthetics: Placement Puzzles vs. Cozy Living

The project owner explicitly questions whether the game should focus on placement puzzles or a cozy living scene. Analytical breakdowns of procedural town builders indicate that a hybrid approach—combining strict underlying rules with forgiving aesthetics—is optimal.

Townscaper developer Oskar Stålberg notes that a relaxing game requires predictable large shapes combined with unpredictable, algorithmic small details (How Townscaper Works: A Story Four Games in the Making). To achieve the organic, non-grid-like aesthetic seen in Townscaper, Godot developers can implement an "aperiodic infinite deterministic irregular relaxed quadrilateral grid," utilizing Dual Grid and Marching Squares autotiling techniques. This ensures that when a player places a building next to a river, the Wave Function Collapse (WFC) algorithm automatically generates a water wheel or curved cobblestone path, adapting to local topography and material transitions without the player needing to micromanage the architecture.

To integrate the puzzle element without ruining the cozy scene, the game should adopt Dorfromantik-style "soft quests". Instead of harsh fail states, an adventurer might physically approach the player and request, "Can you build three flower beds near the inn?" fulfilling these spatial demands results in localized aesthetic upgrades and progression bursts. If the player ignores the request, the town remains a cozy, functioning sandbox, ensuring that aesthetic expression is never punished by the game's mechanics.

### 3.4 Earning Automation and Mitigating Tedium

Hiring villagers to take over tedious tasks must feel like a hard-earned reward rather than the game playing itself. In the early stages, the player must physically chop wood and mine stone. As the village ranks up—a system inspired by the town ranking mechanics in Kairosoft's Dungeon Village and Mega Mall Story—the player unlocks the ability to hire a lumberjack.

The key to making this feel earned is friction comprehension. Because the player has intimately experienced the time cost of walking to the forest, cutting the tree, and walking back, hiring an NPC who physically performs this exact pathing routine provides a massive psychological release. The automation remains diegetic: the wood does not magically appear in a global UI counter; rather, the player physically watches the lumberjack carry the logs to the central stockpile.

### 3.5 Five Ranked Features for Sustained Retention

| Rank | Feature | Design Rationale & Source Justification |
|---|---|---|
| 1 | Indirect AI Control via Economic Incentives | Inspired by Majesty, the player influences the world through economic incentives (bounty boards, item pricing) rather than direct micromanagement. This creates an ecosystem that feels alive and autonomous, turning the game into a terrarium of unpredictable but logical behaviors. |
| 2 | Topological Placement Algorithms | Drawing from Townscaper's Wave Function Collapse (WFC) and Dual Grid rules. Building placement is not just an administrative act; it visually adapts to the terrain. Every placed block algorithmically comments on structural changes, making expansion intrinsically satisfying. |
| 3 | Diegetic "Soft Quests" | Adapted from Dorfromantik, quests manifest physically in the world rather than in pop-up menus. An NPC physically requesting a specific building adjacency provides structure and puzzle elements without compromising the relaxing sandbox atmosphere. |
| 4 | Low-Integer, Transparent Economy | Following the principles of Against the Storm, resources are kept in single or double digits. This prevents the abstract number bloat common in idle games and ensures that five pieces of wood physically look like five pieces of wood on the ground. |
| 5 | Physicalizing the Guild Mechanics | Seamlessly migrating the existing adventuring-guild systems (expeditions, seasonal cycles) into the physical town space. Observing a guild member physically struggle through winter snow to reach a tavern provides deeper emotional attachment than viewing a text log. |

### 3.6 Three Common Mistakes to Avoid

The first mistake to avoid is over-punishing AI behavior. If adventurers are too autonomous and frequently die due to poor AI pathing logic, the player will feel intense frustration regarding their lack of direct control. The AI state must be highly legible; if an adventurer perishes, it must be visually obvious to the player that they failed to provide adequate physical healing facilities or posted a bounty that was mathematically too dangerous for the guild's current tier.

The second critical error is falling into the "Walking Simulator Trap." Forcing the player to walk long distances to collect rent from every individual house introduces massive physical tedium. To mitigate this without breaking diegesis, the game must introduce automation early—such as a hired "Tax Collector" NPC who physically runs around collecting coins and deposits them in a central, easily accessible treasury chest.

The third mistake is creating disconnected systems. In postmortems for Cult of the Lamb, developers found that isolating the base-building mechanics from the action/crusade sequences caused severe pacing friction. The village must react dynamically to the outside world; if adventurers are fighting fire elementals in the wilderness, the village environment should visibly warm up, crops should dry out, and the local tavern should experience increased demand for water.

### 3.7 Three Open Questions for the Project Owner

Regarding permadeath versus physical retreat: When adventurers face insurmountable odds, do they suffer permanent death (creating high stakes and the need to constantly recruit fresh NPCs from the guild system), or do they retreat and require expensive, long-term hospital care? Permadeath reinforces a constant cycle of fresh recruits, while recovery fosters emotional attachment to specific high-level NPCs over weeks of play.

Regarding offline progress simulation: Given the strict mandate that active play must remain mathematically superior to idle play, how should the game handle offline time? Should the town freeze entirely to demand the player's presence, or should it accumulate a highly capped pool of "rested" resources that the player must physically unpack from a delivery wagon upon their return?

Regarding spatial scale limits: At what point does the physical size of the town outgrow the browser's performance constraints in Godot, and should the game utilize separate "districts" (loading zones) or rely on a hard boundary limit to maintain a dense, intimate scale that prevents the user from spending excessive time walking between zones?

## 4. Game Design 2: The Physical Tycoon Block

The second design concept is a tactile, diegetic business management simulator inspired by Supermarket Simulator, Moonlighter, and Two Point Hospital. The player embodies a physical entrepreneur who starts with a single, humble storefront and slowly buys up the entire block, transitioning from manual retail labor to high-level corporate oversight.

### 4.1 Deconstructing the Ad-Free Tycoon: What Remains of Fun?

When removing the addictive, predatory nature of ad-driven games and microtransaction loops (like those found in AdVenture Capitalist or Idle Miner Tycoon), developers often express concern that the core gameplay will feel hollow. However, deep analysis of Supermarket Simulator reveals that the intrinsic joy of these games lies not in the numbers, but in the "polish where it matters".

According to review anecdotes, players find the simple, tactile act of holding down a button and watching objects seamlessly fill a shelf—accompanied by crisp, rhythmic sound effects—to be profoundly therapeutic and satisfying. Without artificial wait timers, the pacing of progress is governed honestly by the player's physical efficiency in the 3D space. The cognitive challenge shifts entirely from "waiting for a number to go up" to "how quickly and optimally can I arrange my physical storefront to serve the morning rush?"

### 4.2 Core Loop

The player physically controls the store owner, running back and forth between a storage area and the storefront to place individual items on shelves. Customers physically walk into the store, browse the shelves, and bring items to the counter. The player operates the register, taking cash and giving change through rapid, satisfying micro-interactions. As profits accumulate, the player walks to a real estate ledger to purchase adjacent buildings, expanding into new business types (e.g., a bakery, a laundromat, a hardware store). The player hires specialized NPCs (managers) to take over the manual labor of the earlier businesses, allowing the player to physically walk next door and focus on optimizing the newest, most complex enterprise.

### 4.3 The First 15 Minutes

The player spawns inside a tiny, dusty convenience store. A delivery box sits on the pavement outside. The player must physically pick up the box, walk to an empty shelf, and hold an action button to smoothly and satisfyingly snap cereal boxes onto the rack. A bell chimes, and a customer walks in. The customer takes a box, walks to the register, and the player engages in a brief puzzle to accept the payment and return exact change.

Once $50 is earned, the player physically walks to the store's back room, interacts with a catalog, and purchases a refrigerator. A delivery truck physically drives by in the game world and drops off the fridge, which the player then pushes into place. The loop of order, stock, and serve is immediately established, validating the player's physical agency within the world.

### 4.4 Synergistic Businesses and Reactive Town Demographics

Owning multiple businesses is only engaging if the underlying mechanics shift as the player expands. A grocery store focuses on inventory volume and shelf space management. A diner, however, focuses on time-management and physical cooking sequences. A laundromat focuses on machine maintenance and queue management.

As seen in the synergistic systems of Kairosoft's Mega Mall Story and the personality-driven dynamics of Two Point Hospital (Making Project Hospital: A realistic approach to medical simulation), the customer base must react to the macro-state of the town. If the player builds a video game arcade next door, teenagers begin frequenting the block, fundamentally changing the physical demand in the adjacent convenience store to favor snacks and energy drinks over staple groceries. This cross-business synergy forces the player to continuously update the layouts of their older, automated stores.

### 4.5 The Tactile Joy of Hands-On Labor and Earning Managers

To ensure the early hands-on phase is enjoyable rather than a chore to skip, the manual labor must be intrinsically rewarding. The game Moonlighter perfectly demonstrates this by making the shopkeeping phase an engaging puzzle of physical supply, demand, and organization (When We Made... Moonlighter).

Furthermore, automation must be earned through demonstrative "Mastery." The player is not permitted to hire a manager for the bakery until they have successfully baked 100 perfect loaves of bread themselves. This serves two vital psychological purposes: it ensures the player fundamentally understands the workflow they are about to automate, and it frames the manager not as a simple monetary purchase, but as a reward for demonstrating physical competence. Once the manager takes over, the player experiences a massive surge of relief and empowerment, retrospectively validating the time spent executing the manual labor.

### 4.6 Five Ranked Features for Sustained Retention

| Rank | Feature | Design Rationale & Source Justification |
|---|---|---|
| 1 | Tactile Micro-Actions and Audio Polish | The physical act of stocking must be deeply satisfying, utilizing robust sound design and snappy animations (avoiding the visual jank of items clipping through walls). The flow state is achieved through smooth, uninterrupted character movement. |
| 2 | Mechanically Distinct Businesses | Expanding to a new business introduces entirely new physical mini-games (e.g., cooking sequences versus machine repair), preventing the gameplay from becoming a repetitive reskin of the initial store. |
| 3 | Qualitative, Personality-Driven Automation | Managers are not passive multiplier buffs. Earning a manager means hiring a physical NPC with distinct behaviors. A fast-stocking manager might occasionally drop items, requiring the player to periodically return and sweep the floor, adding dynamic friction. |
| 4 | Reactive Town Demographics | Inspired by Mega Mall Story, customer types shift based on the specific combination of businesses on the block, requiring players to constantly adapt their inventory strategies across multiple stores. |
| 5 | Diegetic "Legacy" Prestige | Instead of an abstract menu button that resets the game for a multiplier, prestige is handled narratively. The player sells their entire block to a mega-corporation, physically packs their favorite manager into a moving truck, and drives to a brand new, highly challenging neighborhood to start over with permanent legacy perks. |

### 4.7 Three Common Mistakes to Avoid

A major criticism found in review anecdotes of Supermarket Simulator is the "Infinite Cash Register Loophole." Despite being a game centered around tight financial margins, the player's cash register magically possesses infinite coins and bills to make change, entirely removing the economic puzzle of managing physical currency flow. The game should require the player to actively order coin rolls from the bank if they run out of specific denominations, maintaining the physical reality of the economy.

The second mistake is over-scaling the avatar's responsibilities. As the player acquires three or four businesses, forcing them to physically sprint across the street to fix a broken shelf will rapidly become overwhelming. The game must seamlessly transition the player from a "worker" to an "executive." If the physical automation tools do not scale cleanly, the game will collapse under cognitive overload, ruining the relaxing nature of the simulation.

The third error is relying on sterile environments and cloned NPCs. A frequent complaint in indie simulators is the reliance on identical NPC models featuring robotic pathfinding. Even with a low-poly or pixel art budget, customers must exhibit visual variety, unique walking speeds, and distinct idle animations (e.g., tapping their foot when impatient or visibly reacting to high prices) to ensure the businesses feel like active participants in a living community.

### 4.8 Three Open Questions for the Project Owner

Regarding failure states: How punishing should economic failure be in a non-monetized setting? If the player orders excessive stock and runs out of physical money to pay rent, do they go bankrupt and permanently lose the business, or does the game gracefully pause their rent accumulation until they can recover, leaning heavily into a "cozy" rather than "hardcore" simulation?

Regarding physical travel across the expanded block: Will the player be forced to manually walk down the street to move between their newly owned businesses, or will they eventually earn a physical vehicle (such as a bicycle, hoverboard, or golf cart) to dramatically speed up spatial navigation across the expanding map?

Regarding cross-business synergies and physical logistics: Should players be allowed to execute vertical integration? For example, if the player owns a farm stand and a diner, can they physically carry a crate of tomatoes from the stand directly into the diner's kitchen to bypass wholesale delivery costs, thereby physically linking the economies of two distinct businesses?

## 5. Synthesis: Week-Long Retention Without Dark Patterns

The mandate to engineer deep, engaging, and entirely free browser games in Godot without reliance on microtransactions, artificial waiting timers, or dashboard menus forces a comprehensive return to the foundational principles of game design: intrinsic joy, spatial presence, and qualitative progression.

For the autonomous village builder, the integration of the pre-existing adventuring-guild systems with the indirect Majesty-style AI and the topological placement satisfaction of Townscaper creates an ecosystem where the player feels like a genuine architectural caretaker. By ensuring that automation is framed as the hiring of physical villagers to replace the player's own manual labor, progression feels deeply and intrinsically earned.

For the physical tycoon block, removing the artificial pacing of exponential idle mathematics requires shifting the core design focus entirely onto tactile micro-actions. By making the simple acts of stocking, cleaning, and serving deeply satisfying through rigorous physical animation, the game achieves a therapeutic flow state. Expanding to new businesses introduces fresh mechanics, while the prestige system is narratively justified by physically relocating to new neighborhoods alongside veteran staff.

In both design frameworks, the overarching lesson derived from industry postmortems is clear: when a game explicitly rejects monetized dark patterns, it must replace them with absolute transparency, spatial physicality, and profound respect for the player's time. By anchoring every economic shift, procedural expansion, and systemic upgrade firmly within the diegetic reality of the game world, these titles possess the architectural foundation necessary to foster intense, weeks-long player retention driven purely by the inherent joy of play.
