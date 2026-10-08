# T32: selecting the remaining place lighting

Who: Codex. Date: 2026-10-07. Game: Wildbond.

The revised queue permits only AREA_AIR values and checks, while T32 requests separate profiles for Larkhaven, the league and the Spire. Those maps have no biome field; wbAtmosphere looks up m.biome and wbSun looks up S.biome. Adding profile values named for these places cannot reach the renderer. Changing map biome would alter gameplay/weather, so it is not the right fix.

Smallest proposal: Claude's screen rebuild adds a read-only profile selector, using S.pos.map when a matching place profile exists, otherwise m.biome/S.biome. Use it for atmosphere and bounce light only. Then Codex can tune the seven remaining areas and all three places together, with the required before/after captures and checks. Keep weather, encounters, time, map data, versions and shared engines unchanged.

Decision needed: permit that small drawing selector beyond the current profile-only file scope, or have Claude add it during phase 1. A2 is recorded as blocked; work proceeds to A3. No inactive profiles or partial lighting changes were shipped.