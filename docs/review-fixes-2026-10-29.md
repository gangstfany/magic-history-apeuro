# Five audited regressions fixed — local preview

Based on the audit of release6460d42. No commit/push requested for these repairs; source remains local for review. No timeline module added.

1. Hidden maps skip dimension-dependent work before any state write; nonfinite logical views can recover. The actual wireMap regression harness reproduced NaN on zero-size before the fix and now preserves/restores the same finite camera.
2. Responsive docking derives an effective display view from canonical state.view, without writing aspect expansion back. Pan uses logical-center offsets, zoom preserves the logical center and explicit Fit re-baselines cameraOrigin. Four round trips pass in the real wireMap harness.
3. Restored authored date in fixed dock header and sidebar steps. Tests exercise every step of all27paths and both rendered surfaces, including c.1350–1550 Humanism.
4. Map and directory share one cross-Unit first-use place number registry. Florence1 and Europe2 now agree in All Units, Unit1 and other Unit groups. Search cannot renumber them. Favorites still use stable content IDs.
5. Theme popup is positioned relative to its own filter trigger, 8px below it; viewport-limited width/height and internal scroll prevent small-screen horizontal overflow.

## Verification

48 Node tests passed, including5new regressions observed failing against the old implementation;16-file whitelist build and git diff whitespace check passed.

Real homepage: fresh load → Euro chain → World → Euro repeated3times. Every return retained1pin and identical finite SVG viewBox.
Real responsive chain:1280→390→1280→390→1280. Desktop width176 and height132.74939172749393 restored exactly on both returns instead of accumulating. Zoom132, pan changedx, Fit returned a valid camera.
Real dates: Humanism shows c.1350–1550 in header and first sidebar row.
Real All Units: Florence map1/directory1, Europe map2/all observed Unit groups2.
Real popup: gap8px at1280,390,320 while Study points expanded; mobile horizontal bounds33–367 at390 and33–297 at320. No horizontal overflow.
Independent read-only re-review found no new blocker. It noted the camera harness does not cover controls; zoom/pan/Fit were consequently checked directly in the browser. Test viewport reset after verification.

## Explicit incoming connections (local preview)

All 27 paths retain their 150 steps. Their 123 incoming links now bind the preceding and current cards, retain both cards as evidence references, and distinguish cause, condition, response, comparison, parallel development and synthesis. First steps display a starting condition or comparative question. Subsequent steps display numbered incoming links and full bilingual mechanisms; long text remains inside the dock's scrolling body. The four comparison paths remain comparisons rather than invented causal sequences. The English path selector labels remain as previously requested.

Connection explanations are teacher-authored interpretations based on adjacent cards and their curriculum topic references, not quotations or a claim of independent line-by-line verification against every textbook passage. The French royal appointment summary has a reproducible bilingual revision entry, separating crown incentives from the actual appearance of Protestant reform in France. Original source files are unchanged.

Verification: 51 Node tests, public build, desktop causal and comparative steps, adjacent source disclosure, and 390px internal dock scrolling. Independent read-only review found no blocking issue in all 123 link texts; it was not a separate comprehensive external fact audit. No push in this iteration.
