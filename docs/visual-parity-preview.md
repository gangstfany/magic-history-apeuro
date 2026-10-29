# Euro visual parity preview — 2026-10-29

Publication note: the user approved committing and pushing this reviewed work to the independent Euro repository on 2026-10-29. The local-only statements below record the earlier preview stage.

Local only, no commit or push. This extends the core Study points preview after the user correctly noted that map and side-panel visuals still differed from APWH.

## Changes

- APWH font stack, warm paper/card tokens, toolbar proportions, numbered map pins and compact controls. Visible zoom buttons use APWH’s 30px face inside 44px hit targets.
- Removed nth-child country colors. Beige ocean and semantic continental context fills; chain mode dims other countries and highlights representative modern outlines around the active pedagogical home. Geographic SVG geometry/checksum unchanged.
- Compact overview/learning disclosures; retained comparisons, teacher-written argument examples, mnemonics and review prompts.
- Chain markers use the same explicitly selected learning home as the directory. Other place mentions remain in expanded evidence; this is not a claim of event origin or historical boundaries.
- Desktop chain card docks left with a tether to its current pin; narrow maps use bottom docking. Real geographic anchor is framed outside card/control obstacles. Header/footer remain fixed while expanded text scrolls within the body. Sidebar uses APWH-style pill steps, visible previous/next controls, and collapsed background notes.

## Checks

43 Node tests passed; 16-file whitelist build passed. Pure layout checks cover 320, 390, 615, 800, 1280 widths and verify real-anchor/card/control separation. Primary numbers remain stable under filtering and chain step numbers never become zero. Focus highlight codes match existing geographic paths.

Browser checks: nine Units’ first chain steps all stayed inside the map and did not overlap the card. Next advanced step 1 to 2. Desktop expanded evidence exceeded body height (345px scroll versus 283px client) while footer remained visible. At 390px the card docked below, remained inside map and clear of its pin, with no horizontal overflow. 320px likewise had matching document/viewport widths. Sidebar height is 620px with visible navigation; background disclosure opens its retained content. Main homepage embed loaded the new version, with a visible card footer and internal scrolling. No console errors observed. Viewport override reset. Screenshots saved outside the public build.

Course content, original mention links, chain data, authentication and sibling repositories unchanged. No travel animation added. Both screenshots are local previews; the public site remains at the previous release.
