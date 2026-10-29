# AP Euro first-version verification — 2026-10-29

Local preview: http://127.0.0.1:8060/ . Independent repository; no push, deployment or sibling modification performed.

## Automated checks

- `node --test tests/*.test.mjs`: 23 tests, zero failures.
- `node --check src/app.mjs`: success.
- `python3 scripts/build.py`: 12 whitelisted public files.
- Built-file inventory matched the whitelist; no private source paths or raw PDFs found.
- `git diff --check`: success.

## CUA browser checks

- All nine Unit overviews: 23 / 21 / 19 / 23 / 21 / 25 / 26 / 24 / 23 study cards.
- All nine causal sequences: 6 / 6 / 5 / 6 / 6 / 6 / 6 / 6 / 6 steps. Each first step opened a docked card. Incompatible theme/search/skill filters are disabled in this mode.
- All nine practice sets: 20 / 20 / 20 / 20 / 19 / 20 / 20 / 20 / 20 supplied questions, totaling 179. References distinguish authored practice from official exam questions.
- Review regression: queued Q1 and Q2, marked Q1 mastered, confirmed Q2 appeared next without skipping; marked final question mastered, confirmed empty-state recovery. No console errors.
- Zero-result search, AND theme/skill filtering, reset, nine All Units tiles, marker-to-related-card navigation, card save, English content switch, source dialog and Escape dismissal checked.
- Additional learning aids opened and read: comparison table, teacher-created argument examples, mnemonic. Unit final-review prompts are readable separately.
- Cleared test learning records through the UI and reloaded; counts remained zero.
- Responsive 390px / 320px: document width equaled viewport; card detail uses natural page flow. A chain step returned the viewport to the map, and expanded evidence scrolled inside the dock.
- Desktop DOM geometry confirmed the expanded dock remained inside the map, visible labels avoided it and map controls, and label rectangles did not intersect. Unit tests additionally exercise dense labels at three widths.
- Test viewport override reset; final preview retained in the in-app browser.

## Source review limits

The importer reads literal user dictionaries without executing source scripts. Nine units, 36 groups and 205 cards retain source alignment. The 88 CED Topic titles form a curriculum index; this does not mean a separate card exists for every contextualization/argumentation topic. A screening and targeted corrections were completed, not a full independent verification of every claim or translation. See `content-issues.md` and the 65-field guarded revision ledger for exact scope.

Natural Earth geography was rebuilt after corrections. There are 172 approximate anchors; 155 cards have explicit-name links and 50 have no place. Card mention is not proof of event origin. Modern country shapes are not historical borders.

## Independent review

A separate reviewer identified three P2 problems: review-queue skipping, chain filters that did not affect content, and inaccessible learning aids. These were corrected and checked by the primary agent. A requested independent recheck did not run because the review worker reached its usage limit. The final browser, geometry, tests and build checks above were performed directly by the primary agent.

## Screenshot evidence

Saved outside the public build in the workspace output folder `apeuro-build-2026-10-29`: desktop overview, desktop expanded causal card and mobile causal card. No screenshots or source extracts are shipped in `_site`.

## Multiple-path update — 2026-10-29

- Expanded to 27 paths / 150 steps, three per Unit, with stable IDs, bilingual historical questions and conclusions. Four comparative paths are explicitly labeled.
- `node --test tests/*.test.mjs`: 25 passed, zero failures. Initial new tests failed with 9 instead of 27 paths and missing scoped-selection helpers, then passed after implementation.
- CUA opened all 27 choices and each last step; all final steps disabled Next. All Units showed nine groups and 27 choices.
- CUA verified catalog-to-Unit selection, switching from a last step back to another path's first step, Unit reset and English toggle preserving the selected path. No console errors.
- 320px and 390px document widths matched their viewport. Expanded dock remained inside the map and used internal scrolling. Desktop 1280px geometry confirmed label/control/dock avoidance.
- In chain/practice modes, unused map filters are hidden as well as disabled, keeping Unit selection available.
- See causal-paths.md for the 27-question inventory and interpretive safeguards. No GitHub push or sibling changes.
