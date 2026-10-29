# Magic History · AP European History

Independent AP Euro study site. The homepage, login, APWH and art-history repositories are separate and are not modified by this project.

## Local preview

```sh
python3 scripts/build.py
python3 -m http.server 8060 --bind 127.0.0.1 --directory _site
```

Open http://127.0.0.1:8060/ . Use HTTP rather than opening the HTML as a file. No package install or remote runtime dependency is required.

## Included

- Nine CED units, 88 Topic titles, 205 bilingual study cards.
- APWH-style compact course workspace: `History Europe Map` header, persistent 因果链 / 地图 / 练习 controls, Unit and search within the course, map on the left and learning panel on the right. No standalone hero or numbered navigation dashboard.
- Location-first map browsing with a Study points place directory, collision avoidance, Europe/world views, zoom and pan. Complete cards remain available for cross-regional topics; Unit context is a plain disclosure without the orange story border. Narrow screens stack in normal document flow. Switching to a causal path or practice suspends the current map selection, filters and viewport; returning restores them. An explicit Unit change starts the chosen Unit.
- 27 question-led causal/comparative paths (three per Unit, 150 steps) with a right-panel path selector, historical question, conclusion and stable in-map expandable cards. All Units presents a grouped catalog beside the map. Switching paths resets the current step and map references. Comparative paths are labeled explicitly; examples are analytical frameworks, not inevitable history or travel routes.
- 179 supplied teacher-created recall questions, self-assessment and local review queue; 153 additional unit-review/argument prompts readable in the Unit overview.
- Eight comparison tables, 107 argument examples and 36 mnemonic aids, accessible through topic/card learning helpers.
- Local reading/bookmark/review IDs. In an authorized homepage embed, canonical card favorites synchronize with the shared favorites center; opening one restores its Unit, card and map references. Standalone saves remain local. No uploads or automatic essay scoring.

## Sources and limitations

Content uses the **Fall 2026 AP European History CED**, **AMSCO AP European History, second edition (©2023)** and the user's bilingual sprintcards. The 32-lesson syllabus, slides and scripts are excluded. CED/AMSCO references indicate block-level topic alignment, not row-by-row quote verification. Original textbooks, private extraction dumps and source paths are absent from the public build.

`data/content-revisions.json` records 65 guarded editorial field corrections and supporting evidence. `docs/content-issues.md` distinguishes the completed screening from a full claim-by-claim historical audit. Do not call the cards official College Board items. The source panel links current 2027 SAQ/LEQ guidance; updated question presentation does not imply a changed content framework or scoring rubric.

Places are explicit named references in card text. 155 of 205 cards have mapped references; 50 retain no location. Region anchors are approximate, and a named reference does not establish an event's origin. Natural Earth's modern country outlines are public-domain orientation geometry; see `assets/geography-source.json`. Historical borders are not reconstructed.

## Verification

```sh
node --test tests/*.test.mjs
python3 scripts/build.py
```

Tests cover source coverage and corrections, bilingual search/facets, unit resets, safe stored IDs, review assessment, geography references, label/control collision avoidance, chain references, compact workspace organization, map-mode restoration, host favorite sync/open/save/remove, retained topic helpers and public-file privacy. Browser checks cover interaction and responsive layouts.

## Rebuilding source data

`python3 scripts/import_sources.py --help` documents private-source inputs. Import reads literal dictionaries with AST rather than executing supplied source scripts. `python3 scripts/build_geography.py` rebuilds named place links. These scripts require the local source material and are not part of `_site`.

The static build uses an explicit 12-file whitelist. Do not copy the whole repository to a public web root. No GitHub push, Pages deployment or host-page integration is performed by the build. Optional embedding requires an explicit exact `parentOrigin` parameter; standalone preview needs none.

## Homepage favorites and publishing

The APWH-style course workspace embeds in Magic History through `?hostOrigin=<exact origin>`. Its existing comparison tables, English argument examples, mnemonics and Unit review remain in the learning panel. A shared v1 message protocol syncs saved cards with the homepage's collection and reopens the exact card. Prior saved cards migrate once per host; standalone reading remains independent.

Pushing `main` runs `.github/workflows/pages.yml`: public-data tests, whitelist build, then this course's own Pages deployment. It does not publish the homepage or another course.
