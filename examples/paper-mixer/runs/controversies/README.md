# Experiment 002 — high-attention disputed papers

This is a method-transfer paper mixer, not a ranking of scientific truth.

Six focal dossiers were selected for documented scholarly, public or policy
attention and a traceable dispute. The packet has 19 reference entries for
original work, challenges, replies and scoped follow-ups. Counts of citations
were not retrieved or used; the selection is deliberately curated, not a
citation-ranked sample or a systematic review.

| Dossier | Dispute that must remain specific |
|---|---|
| Stochastic Parrots | Empirical scale risks, grounded meaning and ethical arguments are distinct |
| Sparks of AGI | Exploratory demonstrations on an early model versus operational general-intelligence claims |
| Feeling the Future | Exact paradigms, preregistered replications and pooled-selection assumptions |
| Power posing | Hormones, risk taking, self-report and real-world behavior are different endpoints |
| Growth in a Time of Debt | Spreadsheet reconstruction, aggregation and a causal threshold are different questions |
| Card–Krueger minimum wages | Data construction, episode-specific identification and wider transport differ |

Every candidate transfers methods between two domains and includes the target
domain. No effect size, population, moral judgment or truth value transfers
simply because two papers are mixed. A critical result against one endpoint is
not a verdict on a whole literature. An author reply is relevant evidence and
argument, not automatically independent confirmation. A prestigious venue or
award is an attention marker, not proof of each empirical estimate.

The source packet uses primary bibliographic records, accessible manuscripts,
author statements and follow-up research. Access varies and source scopes are
recorded. The dataset is not an exhaustive claim about the latest state of each
literature. Proposals must preserve unresolved cases rather than classify a
real-world dispute using a hidden answer available only to a synthetic-test
author.

The two-round protocol deliberately seeds two proposals per domain × lever
cell, rates each with two same-model critic contexts, revises one initial elite
per cell and retains only higher-rated eligible replacements. Ratings concern
formulation quality, not whether a source paper is right. No proposed audit,
real-data reanalysis, model capability study, human-subject experiment or policy
intervention has been conducted.

Replay from repository root:

```sh
python scripts/replay.py --run-dir runs/controversies --dist-dir dist/controversies
python scripts/make_report.py --run-dir runs/controversies --dist-dir dist/controversies
python scripts/test_archive.py
node scripts/test_ui.mjs dist/controversies
```
