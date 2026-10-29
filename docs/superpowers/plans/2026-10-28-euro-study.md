# European History Study Implementation Plan

> **For agentic workers:** Use superpowers:subagent-driven-development for independent content/geography tasks and implement integration here; review results before final validation.

**Goal:** A local, independently runnable nine-Unit AP Euro learning website, based on Fall 2026 CED, AMSCO and user sprintcards; no 32-lesson content.

**Architecture:** Static HTML/CSS/ES modules. `data/course.json` holds bilingual authored learning material and source locators; separate places and causal links attach references without rewriting events. Pure model and geometry functions drive a shared map, contextual side panel and retrieval practice. No backend, remote runtime libraries, account changes or sibling repository edits.

**Tech Stack:** Browser ES modules, local SVG geography, Python offline source/build scripts, Node test runner, CUA browser verification.

## Source and schema

- [x] Safely read literal U dictionaries, 88 current CED Topic titles, AMSCO Topic locators. Output units, 205 cards, block checks/comparisons/evidence. Keep precise bilingual dates and references. Do not execute source scripts or publish source PDFs/private paths.
- [x] Apply documented, reproducible qualifications to known source shorthand in `data/content-revisions.json`; test import and coverage.
- [x] Build public-domain geography with provenance and place links based on named references. Empty links are valid cross-regional topics; region points must be explicitly representative.

## Pure interaction model and geometry

Files: `src/model.mjs`, `src/geometry.mjs`, `tests/model.test.mjs`, `tests/geometry.test.mjs`.

- [x] Write failing tests for multilingual search with AND facets, unit resets, source-backed practice, valid causal references and collision-safe label placement.
- [x] Implement `filterCards(cards,{unit,search,theme,skill,block})`, `cardsAtPlace`, `checksForUnit`, `loadProgress` with malformed-storage recovery; return new arrays, never mutate source records.
- [x] Implement equirectangular `project(lon,lat)`, aspect-preserving `screenPoint(point,view,width,height)`, and `layoutLabels(points,width,height,obstacles)`. Require in-bounds, non-overlap and protected-control avoidance; unplaced labels remain accessible in a list.
- [x] Run `node --test tests/*.test.mjs`; verify missing-module failures first and green results after implementation.

## Interface and content integration

Files: `index.html`, `styles.css`, `src/app.mjs`, `data/chains.json`.

- [x] Header, Unit/search/theme/skill filters, map/causation/practice modes, language switch and source drawer. Defaults to Unit1; All Units uses an overview and searchable complete content. Filters explicitly reset incompatible selections.
- [x] Map: warm pastel basemap, Europe/global views, zoom/directional-pan/fit, named place capsules with collision avoidance, list fallback and visible modern-border/reference-anchor note. Cards with no explicit place remain readable as cross-regional topics.
- [x] Causal mode: nine source-backed conceptual sequences with explicit qualified connections, clicked steps show stable in-map cards and highlight associated places. No travel animation. Explain sequence lines represent reasoning rather than actual travel.
- [x] Practice: supplied teacher-created recall questions, answer-reveal/self-assessment and review queue. No invented official MCQs or automatic essay scores. CED2026 exam update visible in practice guidance.
- [x] Sources show CED Topic and AMSCO group-level alignment accurately; learning helpers, comparisons and evidence are readable. Bookmark/seen/review local progress stores only IDs; guarded storage failures must not break reading.
- [x] Mobile map above natural-flow detail; minimum44px targets, keyboard focus, live result counts, no horizontal overflow. Reuse established course typography and palette rather than introducing new fonts.

## Independent preview and verification

Files: `scripts/build.py`, `.gitignore`, `README.md`, `AGENTS.md`, `src/module-bridge.mjs`.

- [x] Whitelisted static build excludes source originals, temporary extraction, scripts/tests and private media. No sibling mutations. Embed identity `apeuro` with exact-target-origin messages, no inbound commands; standalone works without host.
- [x] Run meaningful Node tests, content reference checks and build. Inspect built files for private paths and unintended source copies.
- [x] Launch local server, open CUA preview and test all nine Units, filters/no-results/clear, map-marker selection, chain-step cards, recall answer/self-assessment, language toggle, sources, mobile320/390/desktop, keyboard and storage recovery.
- [x] Independent code/content review; resolve confirmed defects, leave source limitations explicit. Keep local preview open and deliver URL plus screenshots. No remote deployment or homepage integration unless separately authorized.

## Verification results

- Source import: nine units / 36 blocks / 205 cards; 65 reproducible editorial field revisions, bounded screening scope documented. 179 recall checks plus 153 additional readable review/argument prompts.
- Natural Earth geography rebuilt after the final content revisions: 172 anchors; 155 mapped cards; 50 valid unmapped topics.
- Independent read-only review found three P2 defects: review-queue skipping, ineffective chain filters and hidden learning aids. All were corrected and the original review-queue symptom was reproduced then retested through the UI. A second independent recheck could not run due to the worker account limit; final integration checks were completed by the primary agent.
- CUA: all nine units opened in map, chain and practice modes; exact question counts 20/20/20/20/19/20/20/20/20. Source dialog, English switch, place-to-card navigation, bookmarking, combined facets, zero results, clear/reset, All Units and record reset checked. No console errors observed.
- Responsive: desktop plus 390px and 320px tested; no document horizontal overflow; mobile detail uses natural page flow. Chain card stays within the map and expands into internal scrolling. Mobile step clicks return to the map.
- Final test/build commands and screenshot evidence recorded in docs/verification.md.
