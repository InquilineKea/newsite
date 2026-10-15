# Controversial papers: dispute-resolution mixer

Recorded October 15, 2026. All outputs below are **untested research proposals**. AI scores judge proposal formulation, not scientific truth, certified novelty, or predicted probability of success.

## Actual run

Mixed 6 source papers into 36 candidate proposals and obtained 72 AI feedback records. Three generator contexts produced the initial proposals. Two different critic contexts provided source/mechanism and execution/evaluation feedback; generators revised selected parents. All inherit one model family. The deterministic archive code selected elites; it did not fabricate model ratings.

| Snapshot | Occupied niches | Sum of elite AI scores (max 1200) | Mean elite AI quality /100 |
|---|---:|---:|---:|
| Round 0 | 12/12 | 978.125 | 81.510 |
| Round 1 | 12/12 | 1031.250 | 85.938 |

10 final elites were new feedback-guided candidates. Any improvement here is in these critics' ratings of the proposals, not an observed experimental effect.

Initial proposals were intentionally allocated two per niche. This is targeted coverage, not evidence that search discovered the descriptor space or outperformed an equal-budget baseline.

## Why this is quality-diversity

One eligible proposal per application-domain × dispute lever niche, highest mean AI-rated formulation score; strict ties retain incumbent. No score for controversy, citations, agreement or rhetorical force.

The niches cross ai, psychology, economics with measurement, causality, replication, selection. Candidates compete only within their niche. Source provenance, transfer boundaries and critic gates are required before quality can matter. Original candidates, feedback and parent links are retained.

## Final elite archive

| Niche | Candidate | AI quality /100 | Critic spread |
|---|---|---:|---:|
| ai × measurement | A-M2-v2: Four resource denominators, with unstable rankings left unresolved | 87.500 | 25.000 |
| ai × causality | A-C1-v2: A randomized rule intervention with one paired estimand | 87.500 | 25.000 |
| ai × replication | A-R1-v2: Template robustness with a replication passport | 90.625 | 18.750 |
| ai × selection | A-S1-v2: When balancing fixes showcase selection—and when it cannot | 87.500 | 25.000 |
| psychology × measurement | P-M2: Evidence-unit ledger before meta-analysis | 84.375 | 18.750 |
| psychology × causality | P-C2: Separate posture totals from post-treatment pathways | 87.500 | 25.000 |
| psychology × replication | P-R2-v2: A crossed replication atlas with identifiable relative components | 81.250 | 25.000 |
| psychology × selection | P-S2-v2: Locked confirmation with matched estimators and batch stress tests | 90.625 | 18.750 |
| economics × measurement | E-M1-v2: Compare wage endpoints against a strong units-and-frame baseline | 87.500 | 25.000 |
| economics × causality | E-C1-v2: Benchmark causal abstention on exactly indistinguishable debt-growth worlds | 78.125 | 18.750 |
| economics × replication | E-R1-v2: Test replication manifests against a competent spreadsheet audit | 87.500 | 12.500 |
| economics × selection | E-S2-v2: Preserve unresolved selection explanations in wage reporting matrices | 81.250 | 25.000 |

## A practical starting point in each target

### Template robustness with a replication passport (A-R1-v2)

**Mix:** SPARKS + BEM

Transfer paradigm matching from Bem into a replication passport. Test behavioral robustness across information-preserving templates for identical latent problems; treat computational determinism as a runtime diagnostic rather than evidence of general competence.

**Hypothesis:** Presentation-sensitive competence predicts alternate-template accuracy at least 0.15 below reference; simultaneous paired intervals within ±0.05 for both alternates favor local template equivalence.

**Minimal experiment:** Use 80 latent synthetic problems, three templates and four prespecified stochastic seeds per template. Before calls validate identical logical content and target answers using canonical representations and a symbolic solver. Seal keys/seeds outside prompts. Archive model/tokenizer hashes, prompt bytes, runtime/container, accelerator/kernel and decoding settings.

**Control:** Same latent problems, answer format and token cap across templates; shared seed labels permit pairing without assuming identical random trajectories. Separately rerun 20 reference prompts twice under fixed deterministic settings in one environment to diagnose computational repeatability.

**Measure:** Average binary correctness over four seeds within each problem/template; estimate alternate-minus-reference differences separately for both alternates. Bootstrap latent problems with full seed/template blocks; use simultaneous intervals. Deterministic exact-output agreement is reported only as a runtime diagnostic.

**Falsifier:** Gap below −0.15 favors presentation-limited performance; both intervals inside ±0.05 favor local equivalence. Intermediate gaps, wide intervals or validation failures are unresolved. Nondeterministic kernels change passport status, not competence interpretation.

**Alternative explanation:** Semantic drift, runtime variation and seed variance; archive rejected templates before execution. Keep same-build reruns, template transport and cross-build extensions distinct.

**Resources:** 960 stochastic plus 40 deterministic-check generations. The passport supplies bookkeeping; this tests template robustness, not passport superiority. A new build cannot exactly replicate unavailable early GPT-4, and no Bem experiment is executed.

### Locked confirmation with matched estimators and batch stress tests (P-S2-v2)

**Mix:** POWER + SPARKS

An append-only ledger freezes candidate contrasts and a family-wide selection rule. Independent confirmation estimates are compared with multiplicity-adjusted full-sample estimates under identical synthetic records, while secondary comparisons separate estimator precision from selection.

**Hypothesis:** Held-out confirmation may reduce selected-effect inflation; any gain must survive budget matching and be reported alongside power costs.

**Minimal experiment:** Predeclare 300 campaigns per null, sparse and endpoint-specific signal scenario. Each has 30 synthetic standardized contrasts, ten per endpoint family, and 240 independent records split 120/120; every policy receives the same generated records. Freeze two-sided z tests with known unit variance and a family of all 30 contrasts. Split policy ranks first-half |z|, locks top three, then confirms each only if second-half p<=.05/3 with matching sign; effect estimate uses second half alone. Full-data comparator tests all 30 by Holm(.05) and reports the three largest-|z| estimates, clearly distinguishing selected from confirmed. Both compute all 30 contrasts on each half: exactly 60 evaluations; pooled sufficient statistics cost no extra contrast evaluations. Secondary comparison fixes the split-selected three and contrasts their 120-record held-out estimates with 120-record discovery estimates, isolating selection from sample size.

**Control:** Holm full-data analysis plus unadjusted full-data selection; identical records, 60 evaluations and output fields. All retain every candidate and endpoint label, not only successes.

**Measure:** Campaign-wise probability of any false confirmation; true-signal recovery; conditional selected-effect bias E[estimate-truth|selected], separately by endpoint; conditional confirmation power and estimator variance. Never compare only successful campaigns.

**Falsifier:** If full-data Holm matches error control and improves recovery, prefer it. If reduced inflation vanishes at matched estimator sample size, credit precision/selection tradeoffs rather than the ledger. Shared-batch failure means confirmation is unresolved, not independently validated.

**Alternative explanation:** Lock a second generator with correlated batch errors across halves before evaluation; retain nominal tests to expose miscalibration and report the failure. Administrative separation cannot create stochastic independence.

**Resources:** Offline synthetic audit and ledger prototype; no participant research or model benchmark.

### Compare wage endpoints against a strong units-and-frame baseline (E-M1-v2)

**Mix:** WAGE + POWER

A typed endpoint ledger checks numerator, denominator, period and establishment frame before comparing employment contrasts. A conventional units-and-frame table receives identical information. The test asks whether automatic compatibility checks add value beyond competent unit checking, without interpreting a descriptive contrast as a causal effect.

**Hypothesis:** At equal information and analysis budgets, typed compatibility checks reduce false contradiction labels on incomparable endpoint/frame pairs while retaining genuine disagreement for aligned estimands; a competent plain table may perform equally well.

**Minimal experiment:** Preregister 40 synthetic state-pair episodes with 80 initial establishments per state, arranged in 10 independent global-shock regimes of four dependent episodes. Define headcount as all workers, weekly hours as total paid hours, FTE as hours/40 and survival as an open indicator. For initial-population means, closed establishments contribute zero to all four numerators and remain in the denominator; survivor means are separate estimands. Nonresponse remains missing, never zero. Generate survey/payroll/administrative-like extracts with overlap, composition shifts and systematic errors. Freeze exactly 24 analyses: 3 sources × 4 endpoints × 2 frames. Both workflows see identical records, formulas, units, frame notes and missingness flags. Lock pair comparisons and reporting rules before held-out simulation seeds. For each episode define truth as the full synthetic population descriptive difference in changes, not an identified causal effect. Use 2,000 regime-block bootstrap draws for uncertainty across episode contrasts; assess small-regime interval calibration by repeated simulated regimes.

**Control:** A common-estimand table containing explicit formulas, units, dates, frame notes and all 24 results, with manual compatibility checks. Both workflows may output aligned agreement, aligned disagreement, incomparable or unresolved, and the same optional explanatory fields. No workflow is forced to assert a sign or causal conclusion.

**Measure:** Primary: false contradiction labels / all predeclared truly incomparable pairs. Also report mismatch sensitivity and specificity; aligned sign errors / aligned nonzero-truth contrasts; unresolved fraction; and 95% regime-block interval coverage across repeated simulations. Define aligned disagreement as opposing nonzero descriptive contrasts only when numerator, denominator, period and frame match. Score numerics and compatibility separately; no causal-recovery score.

**Falsifier:** If the typed ledger does not outperform the competent table on false contradictions while maintaining aligned-disagreement sensitivity, the simpler table is favored. Persistent disagreements after exact alignment count against endpoint mismatch as a sufficient explanation, without selecting a winner among the wage papers.

**Alternative explanation:** Unobserved management shocks, strategic reporting and source-dependent missingness can leave aligned contrasts unresolved. Ten global-shock regimes may yield poorly calibrated bootstrap intervals; simulation coverage, not a nominal label, must reveal that limitation. No simulated result transports the episode to a universal wage law.

**Resources:** A proposed offline generator, two deterministic report procedures and a fixed 24-result table; no original-data reanalysis or policy intervention has been executed.

## Feedback and uncertainty

### A-M2-v2: Four resource denominators, with unstable rankings left unresolved

**evidence critic:** The four denominators now identify distinct decision questions, preserve Parrots ethical scope, and avoid transferring a debt effect. Nonfinite ratios and unresolved rankings are operationally acknowledged. Remaining feasibility issues concern paired timing dependence and whether overhead amortization dominates the claimed denominator reversal.
**Suggested repair:** Specify the nested resampling algorithm and interval construction for nonfinite family ratios. Report fixed-batch overhead sensitivity independently of reweighting sensitivity, retaining accuracy/time frontiers when scalar rankings disagree.

**feasibility critic:** The four formulas, overhead policy, paired timing and explicit nonfinite outcomes turn the denominator argument into a discriminating audit. Accuracy remains visible rather than hidden inside efficiency. Repetition accounting should distinguish repeated measurements of fixed outputs from genuinely stochastic answer variation.
**Suggested repair:** Lock whether timing repeats regenerate answers or replay fixed workloads, and assign output randomness its own level if needed. Publish family counts, amortization batch sizes and the preregistered paired rank-contrast calculation before measurement.
### A-C1-v2: A randomized rule intervention with one paired estimand

**evidence critic:** The intervention estimand is now explicit and the sources retain their limited scope. Component reporting and baseline accuracy constrain misleading update claims. However, subtracting companion degradation can enlarge the contrast; the stable-companion condition needs an actual equivalence criterion rather than a verbal proviso.
**Suggested repair:** Lock a companion noninferiority margin and multiplicity-adjusted joint decision rule before confirmation. Explain why the pilot-derived threshold represents useful evidence use; preserve unresolved labels when targeted updating coexists with substantial unrelated disruption.

**feasibility critic:** The exact affected-minus-companion estimand, sham condition, separate original accuracy and sealed solver keys distinguish targeted updating from disruption. Pilot thresholds are locked before confirmation. The minimum meaningful contrast remains a design choice, so modest effects should not be transformed into evidence of no updating.
**Suggested repair:** Report the continuous contrast and all component rates alongside threshold verdicts. Prespecify simultaneous uncertainty for updating and companion stability, and retain the inadequate-precision verdict without adaptively expanding confirmation after inspecting outcomes.
### A-S1-v2: When balancing fixes showcase selection—and when it cannot

**evidence critic:** Selection mechanisms now include random and within-family-biased conditions, and uncertainty is limited to declared families. The source transfer remains fair. A sealed reference set estimates a separate finite-population mean, so discrepancies can combine showcase bias with reference sampling error rather than isolate selection.
**Suggested repair:** Define target correctness over a common enumerated population or explicitly decompose reference-sampling error from selection bias. Publish softmax sampling formulas, weighting estimators and missing-support rules before observing confirmation outputs.

**feasibility critic:** Random selection, family-only selection and within-family contamination can now distinguish when weighting helps rather than guarantee its success. The finite reference target and conditional resampling boundaries are explicit. Bootstrap uncertainty over reference instances represents a further sampling interpretation, not uncertainty in an already fixed reference mean.
**Suggested repair:** Separate descriptive error against the fixed reference mean from inferential error for a generator-defined population. Freeze ease predictors and missing-support rules, and report transport-generator results separately without pooling them into reference-population performance.

Score averaging can conceal disagreement; inspect the full per-dimension feedback in run.json before choosing an experiment. No human-rated calibration or literature-wide novelty search was completed.

## Source mechanisms and boundaries

- [On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?](https://doi.org/10.1145/3442188.3445922) — Sections on environmental costs, training-data curation, research opportunity costs and language understanding. A conceptual and sociotechnical argument distinguishes fluent form from grounded meaning and examines scale-related harms. Boundary: Benchmark capability does not automatically resolve ethical claims; this is not a single empirical claim that one task can falsify.
  Dispute scope: Conceptual and normative dispute; assess each empirical or ethical claim separately.
  Attention rationale: The lead author documents extensive media coverage; selected for attention, not a verified citation rank.
  - [Stochastic Parrots, original](https://doi.org/10.1145/3442188.3445922): original. Publisher metadata and primary abstract; full access may vary.
  - [Sparks of AGI, early GPT-4 demonstrations](https://arxiv.org/pdf/2303.12712v5): contrasting evidence, not a direct refutation. Primary demonstrations and limitations; competence does not settle values.
  - [Talking About Large Language Models](https://arxiv.org/abs/2212.03551): conceptual perspective. Distinguishes anthropomorphic descriptions from system mechanisms.
- [Sparks of Artificial General Intelligence: Early experiments with GPT-4](https://arxiv.org/pdf/2303.12712v5) — Sections 1.1, 7.2.1, 8, 10 and early-model disclosure. Exploratory demonstrations across tasks motivate a broad capability interpretation while also documenting limitations. Boundary: A selected demonstration set on an early proprietary model is not a fixed operational test of general intelligence; later builds are not exact replications.
  Dispute scope: Disputed interpretation and evaluation scope; not labeled a retracted paper.
  Attention rationale: Microsoft Research published the study and dedicated Research Forum discussion to its findings.
  - [Sparks, primary v5](https://arxiv.org/pdf/2303.12712v5): original. Exploratory task examples plus limitations.
  - [Are Emergent Abilities of Large Language Models a Mirage?](https://arxiv.org/abs/2304.15004): related methodological challenge, not a direct replication. Tests metric-induced discontinuities; does not show all capabilities are unreal.
  - [Stochastic Parrots](https://doi.org/10.1145/3442188.3445922): contrasting conceptual argument. Competence, grounded meaning and social harms are distinct endpoints.
- [Feeling the Future: Experimental Evidence for Anomalous Retroactive Influences on Cognition and Affect](https://pubmed.ncbi.nlm.nih.gov/21280961/) — Original nine experiments; distinguish retroactive-recall experiments from other paradigms. An extraordinary retroactive-influence interpretation was proposed from behavioral experiments. Boundary: A failure to replicate one paradigm is not a test of every original endpoint; favorable pooled estimates are not a substitute for leakage-controlled preregistered replication.
  Dispute scope: Contested extraordinary claim with unsuccessful direct replications and favorable author-led meta-analysis; no truth decided by citation count.
  Attention rationale: The paper prompted multiple direct replications, published rebuttals and an author-led 90-experiment meta-analysis.
  - [Original author manuscript](https://dbem.org/wp-content/uploads/2023/02/FeelingFuture.pdf): original. Author manuscript, not copy of record.
  - [Failing the Future: three unsuccessful attempts](https://pmc.ncbi.nlm.nih.gov/articles/PMC3303812/): direct replication challenge. Tests retroactive facilitation of recall specifically.
  - [Feeling the Future: meta-analysis of 90 experiments](https://f1000research.com/articles/4-1188): favorable follow-up by original author and colleagues. Authors report positive pooled evidence; design and selection assumptions remain examinable.
- [Power Posing: Brief Nonverbal Displays Affect Neuroendocrine Levels and Risk Tolerance](https://pubmed.ncbi.nlm.nih.gov/20855902/) — Original hormone, risk-taking and self-report endpoints; retain endpoint distinctions. The original experiment linked assigned expansive versus contractive poses to physiological, behavioral and subjective outcomes. Boundary: Failure of hormone or risk effects does not by itself refute every subjective-posture effect; later meta-analyses cover a broader intervention family.
  Dispute scope: Endpoint-specific replication dispute; do not merge hormones, subjective feeling and real-world behavior.
  Attention rationale: The APA describes major media attention, criticism and a large preregistered meta-analysis.
  - [Original power-posing paper](https://pubmed.ncbi.nlm.nih.gov/20855902/): original. Primary indexed abstract.
  - [Assessing the robustness of power posing](https://pubmed.ncbi.nlm.nih.gov/25810452/): replication challenge. Larger-sample hormone/risk test; original endpoint match matters.
  - [Dominance and prestige: meta-analytic review](https://doi.org/10.1037/bul0000356): broader endpoint-specific synthesis. Preregistered meta-analysis; subjective and physiological evidence differ.
  - [The Power of Posing, 2025 daily-life study](https://pubmed.ncbi.nlm.nih.gov/40534239/): later field follow-up. Different intervention/outcomes; not an exact original replication.
- [Growth in a Time of Debt](https://www.aeaweb.org/articles?id=10.1257/aer.100.2.573) — Debt bins, country/year weighting, spreadsheet ranges and causal interpretation. Historical debt and growth associations were summarized using thresholds and aggregation choices. Boundary: Reproducing a corrected summary does not identify a causal threshold; an association can remain while a sharp universal rule fails.
  Dispute scope: Documented reproducibility correction plus disputed generalization and causal interpretation.
  Attention rationale: The original authors discuss worldwide policy attention; a published critical replication supplies data and code.
  - [Growth in a Time of Debt, original](https://www.aeaweb.org/articles?id=10.1257/aer.100.2.573): original. Publisher record; original results need exact aggregation reconstruction.
  - [Herndon, Ash and Pollin critical replication](https://peri.umass.edu/publication/does-high-public-debt-consistently-stifle-economic-growth-a-critique-of-reinhart-and-rogoff/): critical replication with code. Identifies coding, inclusion and weighting effects.
  - [Reinhart and Rogoff response, April 2013](https://scholar.harvard.edu/files/rogoff/files/debt_growth_and_the_austerity_debate.pdf): author response. Acknowledges spreadsheet error and defends broader association; not an independent validation.
- [Minimum Wages and Employment: A Case Study of the Fast-Food Industry in New Jersey and Pennsylvania](https://www.nber.org/papers/w4509) — 1993 working paper / 1994 published case study; 2000 comment and reply. A before/after comparison across neighboring states tests an employment response to a minimum-wage change. Boundary: One policy episode is not a universal wage law; payroll/survey construction and comparison-group assumptions matter.
  Dispute scope: Contested measurement and context-specific causal interpretation; not treated as a discredited result.
  Attention rationale: The 2021 Nobel committee highlights Card’s natural-experiment contributions and the minimum-wage challenge to conventional wisdom; this is attention evidence, not proof of every estimate.
  - [Card and Krueger, original working paper](https://www.nber.org/papers/w4509): original. Working-paper version linked to the 1994 journal publication.
  - [Neumark and Wascher 2000 comment](https://www.aeaweb.org/articles?id=10.1257/aer.90.5.1362): measurement/reanalysis challenge. Payroll-based challenge; assess sample construction and comparability.
  - [Card and Krueger 2000 reply](https://www.aeaweb.org/articles?id=10.1257/aer.90.5.1397): author reply and reanalysis. Adds administrative-data analysis; not universal causal identification.

## Corpus-specific limits

- This is a curated high-attention selection, not a citation-ranked or exhaustive list. No current citation counts are asserted.
- Controversy is not evidence of error, fraud or equal evidential support. Normative claims and empirical hypotheses require different treatment.
- Mix methods of resolving disputes, not effect sizes, populations or the truth values of unrelated claims.
- AI ratings assess proposal formulation; neither model consensus nor citation attention establishes scientific truth.
- All generator, critic and revision contexts share one inherited model family; they are not independent model replications.
- No proposed human-subject study, policy intervention, original-data reanalysis or model capability benchmark has been executed.
- Scores across this corpus and the earlier ALife corpus are not calibrated for comparison.

## Reproduce / extend

Run `python scripts/replay.py --run-dir runs/controversies --dist-dir dist/controversies` to rebuild the archive from recorded model outputs and `python scripts/test_archive.py` for the archive invariants. `python scripts/search.py --help` describes the adapter-backed runner for a new source packet. It requires your own configured agent adapter; the hosted explorer does not execute fresh AI calls.

The method is QDAIF-inspired, using a manually specified niche archive and explicit critique-guided mutation. It is not a reproduction of the original paper implementation. No physical experiment, ALife optimization result, multiagent superiority benchmark or emergent-cognition demonstration is claimed.
