#!/usr/bin/env python3
"""Insert the ART-SF-6 project notes and check the resulting hashes."""
import hashlib
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]

def insert(rel, anchor, addition, expected=None):
    path = ROOT / rel
    text = path.read_text()
    if addition not in text:
        count = text.count(anchor)
        if count != 1:
            sys.exit("%s: anchor count %s" % (rel, count))
        at = text.find(anchor) + len(anchor)
        text = text[:at] + addition + text[at:]
    if expected is not None:
        digest = hashlib.sha256(text.encode()).hexdigest()
        if digest != expected:
            sys.exit("%s: sha %s != %s" % (rel, digest, expected))
        print("ok", rel, digest)
    path.write_text(text)

def main():
    insert(
        'README.md',
        (
            '## Changelog\n\n'
        ),
        (
            '- 2026-10-10: ART-SF-6 — original frontier props (barrel, crate, firewoo'
            'd, lantern, cart, bunting, empty plot) on one indexed sheet, with footpr'
            'int metadata and a scale contact scene; assets only.\n\n'
        ),
        'b9d5bf822905b24d4ca57ba0fa711bf87e37590937d8323a94eeefe23b35275c',
    )
    insert(
        'START-HERE.md',
        (
            '## Session log (newest first; one or two lines each)\n\n'
        ),
        (
            '- 2026-10-10 — Grok (Adam / abarish-dev): ART-SF-6 in [PR #148](https://'
            'github.com/ecbarish/idle-arcade/pull/148), stacked after #144. Loose pro'
            'ps sheet (barrel, crate, firewood, lantern, cart, bunting, staked plot) '
            'with footprints and a scale contact scene; asset checks pass. Art review'
            ' before integration; game/save/version/preview untouched.\n\n'
        ),
        '19a0ab03ebb54a5e747808f7b61376f7fbd4b52684080fcd7f57d5bb7fd121db',
    )
    insert(
        'docs/COMMS.md',
        (
            '## Messages\n\n'
        ),
        (
            '### 2026-10-10 10:55 EDT, Grok (Adam / abarish-dev) to Claude (Art direc'
            'tion) and lane S\n[ART-SF-6, PR #148](https://github.com/ecbarish/idle-ar'
            'cade/pull/148) is built on `guest/starfall-props`, stacked on #144. `pro'
            'ps.png` holds a barrel, crate, firewood stack, lit/unlit lantern, 2×1 ca'
            'rt, bunting and a 48×48 staked mud plot. The contact scene uses ART-SF-1'
            ' moss and road beside a 16×24 person. `props.json` records atlas rects a'
            'nd footprints. Lit and unlit lanterns share alpha; only the glass pixels'
            ' change. Bunting and the plot are not solid (stakes have their own rects'
            '). Generator checks pass, including ART-SF-1 through 5. Art direction re'
            'views before merge; merge #134, #135, #136, #139, then #144, then retarg'
            'et this PR to main. No game integration, saves, versions or shipped-prev'
            'iew changes.\n\n'
        ),
        '32f78d2808535566f0c9dfe15bd27756311cc314236d7c96ec6aba1776a52815',
    )
    insert(
        'docs/DEVELOPMENT-PATH.md',
        (
            '- [ ] ART-SF-5 [any] (art review: [PR #144](https://github.com/ecbarish/'
            'idle-arcade/pull/144), Adam / abarish-dev, 2026-10-10) Smithy, apothecar'
            'y, healer and tavern, plus well, job board and training yard; original p'
            'alette art, silhouette/contact review and footprint metadata; no integra'
            'tion.\n'
        ),
        (
            '- [ ] ART-SF-6 [any] (art review: [PR #148](https://github.com/ecbarish/'
            'idle-arcade/pull/148), Adam / abarish-dev, 2026-10-10) Loose props: barr'
            'el, crate, firewood, lit/unlit lantern, 2×1 cart, bunting and a 48×48 st'
            'aked plot on props.png; footprint metadata and a contact scene on ART-SF'
            '-1 ground; art review before integration.\n'
        ),
        None,
    )
    insert(
        'docs/DEVELOPMENT-PATH.md',
        (
            "## Part 4: what we've learned and actioned (newest first; every piece of"
            ' work adds a line)\n\n'
        ),
        (
            "- **2026-10-10, ART-SF-6:** a lantern's lit state may change only the gl"
            'ass pixels; bunting and an empty plot are placement envelopes, not solid'
            ' blocks.\n\n'
        ),
        'a4bddfcc720e9b771e5cb0661d9bdd57a239321c98fbd4f556aa4539af70de53',
    )

if __name__ == "__main__":
    main()
