# APWH-aligned Study points — local preview, 2026-10-29

Publication note: the user approved committing and pushing this reviewed work to the independent Euro repository on 2026-10-29. The local-only statements below record the earlier preview stage.

## Scope

Only the independent Euro repository changed. No commit or push was made. HEAD and origin/main remain 9bf760d0706aa40f517a60a3af1d845015b5bdf2. The existing deployed page is unchanged.

All 205 cards now have one explicit pedagogical home in study-anchors.json. Primary anchors organize cards; they do not assert an event origin. Original card-locations.json, course.json and chains.json remain unchanged. Card details distinguish core anchor from original related places; expanded causal-card evidence retains original context.

Unit core-place counts: 9, 12, 10, 10, 8, 7, 12, 13, 10. All Units: 91 Unit/place entries, 205 cards, each card appearing once within its Unit. U1 previously exposed 46 mentioned places; now it has nine core anchors and still 23 cards.

## Frame parity

Directory moved from the map column to the full-width toolbar, default collapsed. APWH pill summary, count badge, border/background/text colors, font stack, 4/2/1 columns at 900/450px breakpoints, 60px minimum cards, 27px number circles, 260px maximum content height. One Unit has no redundant section heading; All Units displays Unit headings. Directory scope ignores search/theme/skill/saved filters and selecting a location clears incompatible filters. Unchanged directory content preserves focus and scroll through filter rerenders.

## Verification

39 Node tests passed and 14-file explicit-whitelist build succeeded. Tests cover one primary home per card, complete/unique membership, valid place IDs, Unit scope, safe markup, selection filter reset, frame placement and retained source context/helpers.

Real browser: all nine Unit counts and All Units grouping verified; searched Gutenberg, directory stayed nine places while map showed one match; choosing Florence cleared query and displayed its four cards. Opened Humanism and verified core anchor wording. Practice mode hides the directory; map and chain modes retain the same Unit-scoped entry. At desktop 1280px, four columns and 60px card height; 390px and 320px, single column, 60px cards and document width equals viewport. Embedded local homepage shows nine core places. No browser console errors observed. Screenshots stored outside the release output.
