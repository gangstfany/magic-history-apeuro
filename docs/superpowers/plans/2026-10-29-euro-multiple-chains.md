# AP Euro Multiple Causal Paths Implementation Plan

**Goal:** Three source-linked, question-led paths for each of nine units; selectable paths drive the existing map and dock.
**Architecture:** Extend chains.json; pure chain-selection helpers in model.mjs; selector/catalog markup in app.mjs. No external runtime dependencies or sibling edits.
**Tech Stack:** Static ES modules, JSON, existing SVG map, Node tests, CUA verification.

- [x] Write tests requiring 27 unique paths, three per Unit, bilingual questions/conclusions, valid same-unit card references and nonempty mechanisms; observe current-data failure.
- [x] Write chain-transition tests for scoped selection, reset and foreign-Unit rejection; observe missing-function failure.
- [x] Add 18 focused paths, retain and enrich the nine existing paths. Read each referenced card while writing connections; retain primary curriculum scope.
- [x] Implement chain helpers and Unit reset. Add selector, question, conclusion, and All Units grouped catalog. Refit view on selection and reset stale marker/step.
- [x] Update styles and course documentation. Retain keyboard focus and mobile natural reading; no horizontal overflow.
- [x] Run tests/build; CUA check all 27 paths, first/last steps, resets, All Units, language, mobile and dock avoidance. Save screenshot and leave local preview open. No push.
