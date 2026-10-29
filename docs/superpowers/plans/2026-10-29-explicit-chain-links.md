# Explicit Euro chain connections — local preview

User wants APWH-style explanation of why one step connects to the next, not isolated card summaries. Retain27paths/150steps,205cards, all existing helpers and reviewed local fixes. No push.

- Starting steps display a question and explicitly labeled starting condition/case, never a fake incoming arrow.
- Each subsequent step binds fromCardId to preceding card and toCardId to current card, with relation type and references to both source cards. Rewrite generic links to state a specific mechanism; label comparisons/parallel developments rather than inventing causation.
- Show incoming step numbers and previous/current titles in the dock; show the complete mechanism in its internal scroll area. Comparison paths explicitly identified in English chooser.
- Correct screenshot's overstatement that France did not need a Reformation, using narrowly qualified bilingual text and guarded correction ledger. Museum evidence confirms Reformed churches appeared in France; royal influence does not preclude Protestant reform.
- Tests: all123incoming edges, first-step handling, typed comparisons, bilingual text/source bindings, guarded correction, no card/path loss. Browser verify Unit1causal1→2 vs comparison1↔2 and allUnitpathlaststeps; preserve mobile docking and prior five regressions.
