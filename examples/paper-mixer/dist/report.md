# Paper Mixer: ALife × Buehler

Recorded October 15, 2026. All outputs below are **untested research proposals**. AI scores judge proposal formulation, not scientific truth, certified novelty, or predicted probability of success.

## Actual run

Mixed 6 source papers into 36 candidate proposals and obtained 72 AI feedback records. Three generator contexts produced the initial proposals. Two different critic contexts provided source/mechanism and execution/evaluation feedback; generators revised selected parents. All inherit one model family. The deterministic archive code selected elites; it did not fabricate model ratings.

| Snapshot | Occupied niches | Sum of elite AI scores (max 1200) | Mean elite AI quality /100 |
|---|---:|---:|---:|
| Round 0 | 12/12 | 959.375 | 79.948 |
| Round 1 | 12/12 | 1003.125 | 83.594 |

9 final elites were new feedback-guided candidates. Any improvement here is in these critics' ratings of the proposals, not an observed experimental effect.

Initial proposals were intentionally allocated two per niche. This is targeted coverage, not evidence that search discovered the descriptor space or outperformed an equal-budget baseline.

## Why this is quality-diversity

One eligible candidate with highest mean AI-rated rubric score per target × lever cell; ties retain earlier candidate. No novelty score is added to quality.

The niches cross three targets (organism, collective, discovery workflow) with four intervention levers (representation, interaction, memory, selection). New candidates compete only within their niche. Source provenance, transfer boundaries and critic gates are required before quality can matter. Original candidates, failed proposals, critiques and parent links are retained.

## Final elite archive

| Niche | Candidate | AI quality /100 | Critic spread |
|---|---|---:|---:|
| organism × representation | O-R1-v2: Archive spring motifs with frozen response tests and rank checks | 87.500 | 12.500 |
| organism × interaction | O-I1-v2: Disentangle asymmetric pursuit from sensing and actuation budgets | 84.375 | 6.250 |
| organism × memory | O-M2-v2: Test reachable refractory histories and artificial hidden-state swaps | 87.500 | 12.500 |
| organism × selection | O-S2-v2: Freeze renderer traps and held-out functions before archive selection | 84.375 | 6.250 |
| collective × representation | C-R1: Typed evidence packets for collective hidden-state inference | 75.000 | 0.000 |
| collective × interaction | C-I1-v2: A fixed-budget contradiction protocol with episode-level failure tests | 84.375 | 6.250 |
| collective × memory | C-M2-v2: Claim-specific provenance memory with fallible corrections | 87.500 | 0.000 |
| collective × selection | C-S1-v2: Team-level selection with matched-cost role replacement controls | 78.125 | 6.250 |
| discovery × representation | D-R2-v2: Identifiability-audited descriptors for experiment-plan search | 84.375 | 6.250 |
| discovery × interaction | D-I1-v2: Budget-accounted factorial tests of workflow recombination | 84.375 | 6.250 |
| discovery × memory | D-M1: A failure archive that redirects graph exploration | 84.375 | 6.250 |
| discovery × selection | D-S1: Local competition across experiment-cost niches | 81.250 | 0.000 |

## A practical starting point in each target

### Archive spring motifs with frozen response tests and rank checks (O-R1-v2)

**Mix:** ASAL + SCIAGENTS

Propose twelve nodes on a 3-by-4 unit grid with uniform +/-0.05 jitter. Include each pair below distance 1.6 with probability 0.85. Fix left-column displacements. Quadratic axial spring energy uses stiffnesses sampled uniform 0.5–1.5 then normalized to sum 24. Reject disconnected motifs or reduced stiffness eigenvalue ratio below 1e-8. A graph path suggests descriptors; energy independently defines forces.

**Hypothesis:** Response selection may preserve more withheld-load variation than silhouettes after rank and material-budget checks; graph guidance may add nothing beyond arbitrary descriptor choice.

**Minimal experiment:** Freeze twenty pools of 100 accepted motifs, with a 200-attempt cap and all rejection counts reported. Training descriptors concatenate free-node displacements under unit x and y loads at the top-right node. Retain twenty motifs by identical farthest-point selection and deterministic ties. Evaluate loads at the middle-right node at angles 45,135,225,315 degrees; no evaluation coordinates enter selection.

**Control:** Compare response, 32-by-32 binary-silhouette and random archives within each shared pool. A shuffled graph-path control chooses two unrelated training load-node coordinates from a fixed lookup. Match accepted pools, archive sizes and all solves; count rejected attempts and descriptor costs.

**Measure:** Freeze the held-out vector as all free-node x/y displacements for the four evaluation loads. Normalize every vector by the same unjittered fully connected reference response norm, never by its own norm. Report pairwise response distances plus four fixed classes: sign of top-right y displacement under 45 degrees crossed with middle-right compliance above reference compliance. Report paired pool differences with bootstrap intervals.

**Falsifier:** Reject a useful descriptor advantage if the paired uncertainty includes no improvement over random across pools, or effects vanish after fixed material-budget control. Reject graph-specific benefit if shuffled-path descriptors perform equally.

**Alternative explanation:** Boundary choice, rigid mechanisms, near-singularity and candidate-dependent normalization can manufacture separation. Predeclare geometry, eigenvalue cutoff, independent evaluation loads and thresholds; report both raw and reference-normalized distances, with sensitivity to the cutoff.

**Resources:** One-day NumPy CPU experiment using small dense linear solves. No physical-material or foundation-model claim; fixed-pool archive selection does not establish evolutionary search superiority.

### Claim-specific provenance memory with fallible corrections (C-M2-v2)

**Mix:** TEXTLIFE + MECHGPT

Store observation IDs, relay ancestry and signed correction claims in a bounded graph. Duplicate relays share one likelihood contribution. A correction targets one observation, never automatically revoking its source. Its likelihood ratio uses reliability estimated on training episodes; independent corroboration can outweigh it. Separate source-reliability updates require multiple audited observations.

**Hypothesis:** Ancestry memory should reduce persistent false consensus beyond source-ID deduplication when relays obscure observation identity, but its advantage should decline as ancestry corruption or correction unreliability increases.

**Minimal experiment:** Replay independent report-cascade episodes with identical correction arrival times. Train then freeze discount rules; test held-out graph families, correction-error generators and ancestry-loss mechanisms. Include false corrections and distinct sources sharing hidden causes, not only duplicated relays.

**Control:** Compare source-ID deduplication, observation-ID flat memory, timestamp retrieval and an equal-budget independent ensemble. Equalize original samples, correction messages, final reducer access, total stored bytes and transmission bits; pad overhead in controls and report effective retained claims.

**Measure:** Measure episode-level paired reversal delay, Brier score, residual false belief and retention of valid corroboration. Ground truth is accessible only to scoring; semantic diversity and distinct source IDs do not establish functional or statistical independence.

**Falsifier:** Reject the graph-memory advantage if observation-ID flat memory matches it at equal byte cost. Reject the correction rule if false corrections erase valid corroboration or its gains require privileged true corrections unavailable to controls.

**Alternative explanation:** A correction channel may become an oracle. Make reliability imperfect and calibrated from training episodes, reveal identical channel metadata everywhere, and vary reliability out of distribution. Treat observation correction and source-level reliability changes as separately ablated operations.

**Resources:** CPU packet replay and adjacency lists suffice. The unexecuted study tests engineered belief revision under synthetic uncertainty; it cannot adjudicate real scientific claims or demonstrate cognition.

### Identifiability-audited descriptors for experiment-plan search (D-R2-v2)

**Mix:** ASAL + SCIAGENTS

Transfer ASAL illumination to graph-proposed plans. Descriptor component d_mn(P)=sum over selected loads of (mu_m-mu_n)^2/(2 sigma^2), the equal-variance Gaussian discrimination distance. Predictions use public training-fitted candidate models, never hidden test labels or unacquired observations. Archive by these three pair distances; freeze scales and bins before testing.

**Hypothesis:** Discrimination niches may preserve complementary plans and reduce redundant measurements versus lexical novelty. Incremental value beyond expected-information selection remains an open empirical question, not an assumed advantage.

**Minimal experiment:** Normalized spring laws: F=kx; F=kx+ax^3; F=kx+a max(0,x-x0), positive parameters. Loads {0.1,0.3,0.6,1.0}; displacement noise N(0,0.01^2). Solve parallel-spring networks by bisection. Training calibration freezes priors and rejection thresholds. Reserve topology generators and parameter ranges; test fourth law F=kx+a tanh(x/b), b>0. Build twenty independent archives with paired problem/noise seeds across methods.

**Control:** Random, lexical-novelty and expected-information archives receive identical initial pools, admissible plans and capacity. Charge every forward solve for descriptors, training and scoring, plus acquired observations. Match total forward-solve and measurement budgets; report runtime separately.

**Measure:** Before search audit identifiability: merge laws whose noiseless responses remain within five sigma at every admissible load. Score equivalence classes. Report held-out accuracy, redundancy, Brier score, unknown rejection/detection and selective risk. Freeze abstention loss at 0.25, incorrect loss 1 and correct loss 0.

**Falsifier:** No support if niches fail to improve preregistered accuracy or redundancy across independent builds. Failure against expected information limits added value. Fourth-law detection is scored only where oracle distinguishability holds; otherwise report non-identifiability.

**Alternative explanation:** Parameters can hide nonlinearities or leave thresholds unexcited. Freeze equivalence rules and report such cases. Unknown rejection uses known-law training calibration residuals at the 95th percentile, excluding the fourth law. Test-law fits are evaluation-only, inaccessible to search.

**Resources:** Scalar bisection and NumPy likelihoods run offline on CPU. Publish laws, splits, counters and seeds before execution. Neither this proposed benchmark nor a physical experiment has run.

## Feedback and uncertainty

### O-R1-v2: Archive spring motifs with frozen response tests and rank checks

**evidence critic:** Geometry, rank screening, independent loads and graph-shuffling now make the representation transfer reproducible. Fixed-pool scope is appropriately bounded. However, the 200-attempt cap may produce fewer than 100 accepted motifs; confidence intervals spanning zero indicate inconclusive advantage rather than evidence of absence.
**Suggested repair:** Specify minimum accepted pool size and handling of cap failures without selective replacement. Distinguish an equivalence test from an inconclusive superiority test, and report whether the four proposed classes are actually populated.

**feasibility critic:** The geometry, rank rejection, fixed normalization and twenty independent pools now make this a directly executable descriptor comparison. The attempt cap may produce undersized pools, and the four-class outcome could collapse to one class under these load and boundary choices.
**Suggested repair:** Prespecify treatment of pools with fewer than one hundred accepted motifs; never silently refill differently across methods. Check class occupancy using calibration-only motifs and report continuous held-out distances even when class coverage degenerates.
### O-M2-v2: Test reachable refractory histories and artificial hidden-state swaps

**evidence critic:** The full update, reachable-state distinction and reset controls meaningfully improve causal interpretation. The imposed 0.95 hidden-state decay applies exactly only when visible trajectories remain matched throughout, not merely at intervention time. Candidate disks may extinguish; reporting extinction protects against selective survivor claims.
**Suggested repair:** Derive hidden-state differences with the visible-input difference term included, or clamp visible trajectories for the exponential benchmark. Preregister handling of zero initial or extinct mass, and label useful-memory claims separately from programmed sensitivity.

**feasibility critic:** This is now an executable programmed-memory intervention with clear paired controls and an honest distinction between artificial swaps and reachable histories. Extinction and clipping may eliminate useful probe responses; recording them prevents success-biased filtering but cannot rescue an uninformative dynamical regime.
**Suggested repair:** Freeze zero-distance unit conventions, FFT convolution and state-matching procedures. Report all twenty initializations and reachable-match rates; if responses vanish, conclude the specified regime is uninformative rather than tuning on held-out pulse intervals.
### O-I1-v2: Disentangle asymmetric pursuit from sensing and actuation budgets

**evidence critic:** Explicit active equations, held-out jumps and search-level replication address the main causal gaps. The resource-only control still retains the repulsive force when pair coefficients are zero, so its label is inaccurate. Work strata are properly acknowledged as diagnostics, not randomized energy matching.
**Suggested repair:** Call zero-coefficient control resource-plus-repulsion, or remove the entire pair term for a true resource-only arm. Define zero-distance unit vectors and report matched-time work-performance frontiers without interpreting post-outcome strata causally.

**feasibility critic:** The force law, sensing-frozen control and search-level uncertainty substantially improve identifiability of the proposed effect. Reciprocal coefficients at fixed off-diagonal norm have only two distinct possibilities, so twenty-four evaluations may mostly repeat candidates while asymmetry receives genuine exploration.
**Suggested repair:** Enumerate the reciprocal family exactly and report its two-point support. Separate simulator-cost parity from distinct-proposal counts; add an equal-dimensional reciprocal control by varying another declared interaction parameter without changing force or sensing budgets.

Score averaging can conceal disagreement; inspect the full per-dimension feedback in run.json before choosing an experiment. No human-rated calibration or literature-wide novelty search was completed.

## Source mechanisms and boundaries

- [Automating the Search for Artificial Life with Foundation Models](https://arxiv.org/html/2412.17799v1) — Sections 3.1–3.3, 4.2–4.5, Appendix B. Search rendered simulation trajectories using learned visual representations for targets, historical novelty or archive diversity. Boundary: Visual and finite-horizon novelty do not establish indefinite innovation or cognition.
- [Toward Artificial Open-Ended Evolution within Lenia using Quality-Diversity](https://arxiv.org/html/2406.04235v1) — Background/AURORA; Methods/Unsupervised Statistical Measures; Experiments. Maintain many locally competitive niches; adapt learned descriptors while externally evolving Lenia seeds and rule parameters. Boundary: Adaptive descriptors change the ruler; the paper does not claim theoretical open-endedness.
- [From Text to Life: On the Reciprocal Relationship between Artificial Life and Large Language Models](https://arxiv.org/html/2407.09502v1) — LLMs as Tools for ALife; ALife for LLMs/Emergence; Collective Intelligence. A review connects model-guided variation, environmental generation and multiagent organization. Boundary: A conceptual bridge does not experimentally establish living or emergently intelligent LLMs.
- [SciAgents: Automating scientific discovery through multi-agent intelligent graph reasoning](https://arxiv.org/html/2409.05556v1) — Sections 2.1–2.2, 4.1–4.6. Sample paths in an ontological graph and use specialized agents to generate, expand and critique materials hypotheses. Boundary: Graph relations and model-proposed property improvements require independent physical validation.
- [Generative retrieval-augmented ontologic graph and multi-agent strategies for interpretive large language model-based materials design](https://arxiv.org/pdf/2310.19998) — Results and Discussion: retrieval, ontological graphs and agent-based simulation; Materials and Methods. Ground materials reasoning in retrieved context and interpretable relation graphs; connect agent reasoning to simulation workflows. Boundary: Retrieved relations are not automatically causal laws; analogies need units, mappings and executable checks.
- [Quality-Diversity through AI Feedback](https://proceedings.iclr.cc/paper_files/paper/2024/file/5b9bef4eae0f574cedbf9f4bf29d8ae7-Paper-Conference.pdf) — Method and experiments (ICLR 2024). Use language models to generate variation and evaluate quality and diversity inside an evolutionary archive. Boundary: Creative-text evidence does not establish the scientific validity of research proposals.

## Reproduce / extend

Run `python scripts/replay.py` to rebuild the archive from recorded model outputs and `python scripts/test_archive.py` for the archive invariants. `python scripts/search.py --help` describes the adapter-backed runner for a new source packet. It requires your own configured agent adapter; the hosted explorer does not execute fresh AI calls.

The method is QDAIF-inspired, using a manually specified niche archive and explicit critique-guided mutation. It is not a reproduction of the original paper implementation. No physical experiment, ALife optimization result, multiagent superiority benchmark or emergent-cognition demonstration is claimed.
