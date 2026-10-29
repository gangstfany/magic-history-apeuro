# Content provenance and review notes

This dataset contains only the user's bilingual sprintcards, the AP European History CED effective Fall 2026, and topic references to the supplied AMSCO second edition (© 2023). No lesson syllabus, slides, teaching scripts, other review books, or full textbook/CED extracts are included.

## Import and alignment limits

- All nine source files contained exactly one literal `U` assignment. The importer uses `ast.literal_eval` and refuses additional statements, including appended mutations. The source modules are never imported or executed.
- The 205 row cards retain their authored bilingual titles and skill labels. Dates, summary/detail text and associated learning aids are preserved except for the targeted corrections recorded in `data/content-revisions.json`. The 36 groups retain their story/theme, retrieval checks and supplied answers, comparison tables, mnemonics and English essay evidence. Each unit also retains its 12 factual review questions and supplied bilingual answers plus 5 writing prompts and supplied English answers.
- Topic IDs and theme codes come from each authored group tag. All rows in a group share that alignment. This is a navigation aid, **not** a claim that every row has been individually verified against every cited topic.
- The official CED supplies all 88 topic titles, including opening contextualization and closing argumentation topics. The sprintcard groups do not separately cover every opening/closing topic; topic listing must not imply a dedicated card exists for each one.
- AMSCO topic references are verified to exist in the supplied textbook extraction. Citations deliberately use topic locators rather than speculative printed pages. The supplied textbook's PDF page 47 is printed page 1; a historical “minus 45” conversion would be incorrect. No page conversion is used by this importer.
- HTML and `{{highlight}}` syntax are converted to plain text; character entities are decoded. User-authored checks and sample evidence are not official College Board questions, rubrics, or verified model answers.

## Targeted corrections applied

`data/content-revisions.json` records 65 exact field corrections with stable app entity IDs, before/after text, reasons, and source locators. The importer applies this ledger after parsing. A changed original value causes a failure requiring review, preventing an old correction from silently overwriting a new author edit. The original private sprintcard files remain unchanged.

- Machiavelli: card summary and supplied check answer now distinguish the conditional fear/love choice and avoidance of hatred from an unlimited “any means” rule. **Evidence limit:** AMSCO Topic 1.2, printed p. 7 itself uses the compressed wording; the CED lists Machiavelli as an example of secular political behavior but does not reproduce chapter 17. The ledger now records separate corrective corroboration from [The Prince, chapter XVII](https://www.gutenberg.org/files/1232/1232-h/1232-h.htm#chap17), which supports the conditional choice and avoidance of hatred. This primary-text check is not an additional curriculum source and is not falsely attributed to AMSCO/CED.
- Printing: card detail, check answer, evidence example and final-review sample now explain wider dissemination alongside political protection. CED Topic 2.3 / KC-1.1.II.B supports dissemination; AMSCO Topics 1.4 and 2.2 support wider pamphlet circulation and Luther's protection by Frederick of Saxony.
- 1453: the card detail and parallel check answer explicitly establish a pre-1453 revival of classical learning, using Petrarch's earlier work. **Evidence limit:** the checked AMSCO/CED passages do not establish the specific flight-of-scholars claim; that detail was removed rather than given an invented citation claiming it accelerated the Renaissance.
- Westphalia: the card summary/detail, unit story, check answer, evidence example and final-review prompt/sample now distinguish local religious control, weakened imperial authority and religious pluralism from instantaneous fully modern sovereignty. CED KC-1.5.I.B / KC-1.5.II.A and AMSCO Topic 2.4, printed pp. 107–108 support the particular outcomes and declining importance of religion in interstate warfare.

## Remaining review limits

This is a targeted revision, **not a full factual review of all 205 cards or supplied answers**. All topic locators remain group-level navigation alignments unless an exact revision-ledger locator explicitly says otherwise. No automated checking should treat supplied prose samples as rigid official answers.

The checked 1453 scholar-flight detail remains omitted pending specific verification. A broader screening read all 205 English summaries/details, compared bilingual summary text and numeric differences, and checked absolute-language candidates. This is screening, not independent substantiation of every statement, translation, number or quoted phrase.

Additional corrections now applied:

- Trent: ten linked fields now distinguish church discipline and abuses associated with indulgences/commercial exploitation from abolition of indulgence doctrine. AMSCO Topic 2.5, printed pp. 112–113 and CED KC-1.2.I.D provide the discipline/doctrine framework; the ledger does not claim the CED reproduces the detailed decree.
- Inflation: card and parallel check distinguish commercial expansion from fixed-nominal debt. Unexpected inflation can lower the real repayment owed by debtors and harm creditors; this is conditional, not a rule that every merchant wins or every lender loses. AMSCO printed p. 71 discusses the broader commercial context; the separate [St. Louis Fed analysis](https://www.stlouisfed.org/publications/regional-economist/2022/aug/impact-inflation-wealth-transfer-effect) corroborates the specific debt mechanism without becoming a curriculum source.
- Spain: separates the papal authorization of the Inquisition in 1478 from Granada, expulsion and Columbus in 1492, using AMSCO Topic 1.5 for context and [Library of Congress corrective corroboration](https://blogs.loc.gov/law/2012/04/recap-of-presentation-%E2%80%93-jews-on-trial-the-papal-inquisition-in-modena-1598-1638/) for 1478. The existing 1492 check already lists the three appropriate events and remains unchanged.
- Mines Act: card and final review specify women/girls and boys under ten in underground mine work, using AMSCO Topic 6.4 printed p. 368; the card date now includes all three acts it discusses: 1833 / 1842 / 1847.
- Stalingrad: identifies a pivotal Eastern Front defeat rather than Germany's first defeat and lists El Alamein (1942) without the earlier misleading chronological arrows. AMSCO Topic 8.8 printed pp. 542–543 describes earlier British and Soviet resistance.

## Screening corrections resolved

The eight additional screening candidates were corrected in 16 bilingual fields, with exact before/after values and locators in the ledger:

| Locator | Correction applied |
| --- | --- |
| u1-b2-c4.detail | Separates Charles V's 1547 military victory from failure to restore Catholic unity; refers to fragmented German lands. |
| u1-b3-c4.detail | Describes colonial spheres without claiming all other Latin America speaks Spanish. |
| u3-b1-c2.summary | Retains the 1649 trial/execution without an unsupported universal “first.” |
| u4-b1-c1.detail | Retains publication in 1543 near the end of Copernicus's life; removes an exclusive religious-motive/deathbed claim. |
| u5-b2-c2.detail | Makes the two-to-one outcome conditional on the first two estates voting together. |
| u6-b2-c5.detail | Adds the eligibility conditions for women's 1918 suffrage; separately corroborated by the UK Parliament's account of the act. |
| u9-b1-c1.summary | Places the occupation zones in 1945, before the 1946 Iron Curtain speech and 1949 German division. |
| u9-b3-c1.summary | Distinguishes the fully free Senate from partly free Sejm elections; separately corroborated by the Polish Senate. |

No documented screening candidate above remains unresolved. This status describes the issues found in this screening pass; it is not certification of all 205 cards, every translation, every date, or all associated practice samples. The original private source files remain unchanged. Corrective corroboration links are recorded separately in the ledger and do not expand the curriculum source list.

The source text itself also requires critical reading: the supplied AMSCO printed p. 112 appears to swap the definitions of simony and pluralism, and dates the start of Trent to 1543. These source problems are not imported as new facts; the sprintcard's simony/pluralism definitions were not changed to match the apparent source error.

## Rebuilding locally

Run `python3 scripts/import_sources.py --cards-dir <private-card-build-directory> --ced-text <private-current-CED-text> --reading-index <private-reading-index>` from this repository. The default revision ledger is applied automatically (override with `--revisions` only for a reviewed replacement). Inputs remain outside the repository; the generated JSON stores only relative unit/group/row locators and public publisher links.
