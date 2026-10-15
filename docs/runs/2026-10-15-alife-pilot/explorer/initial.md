# Explorer: independent mechanism review

Scope: three fixed v1 primary papers, read without peer outputs. This is a mechanistic literature analysis, not a replication. The runtime inherits the parent's model; separate context and declared roles do not establish cross-model independence.

## ASAL — arXiv:2412.17799v1

Primary source: https://arxiv.org/html/2412.17799v1

Reported mechanism and claims: (1) Sections 3.1–3.3, equations 2–4 define three different searches: prompt alignment, historical novelty within a rollout, and separation among an archive's members. They use a foundation-model representation of rendered simulations. These are operationally different diversities. (2) Section 4.3/Figure 6 reports a visually varied Lenia/Boids archive from mutation and diversity selection; Section 4.5/Figure 8 compares representation choices qualitatively. Neither establishes cognition. The cellular-automaton experiment evaluates finite 2,048-step trajectories with 32 sampled times and 256 initial states per rule (Appendix B.2), so its novelty score does not prove indefinite innovation.

Designed versus emergent: the substrate, rendering, representation, search objective and optimizer are supplied. Particular trajectories and patterns arise from the chosen local dynamics. My inference: searching for visual replication is weaker than demonstrating hereditary evolution or adaptive function; the causal bridge requires additional tests. A prompt-conditioned shape is evidence of a successful search objective, not evidence that the pattern has a mind.

## Leniabreeder — arXiv:2406.04235v1

Primary source: https://arxiv.org/html/2406.04235v1

Reported mechanism and claims: (1) Methods/Search Space and Variation Operator specify inherited seeds plus rule parameters, initialized around Aquarium, varied by iso+LineDD, and retained using niche-based quality/diversity. AURORA updates the learned descriptor, thereby changing niche boundaries. This is external evolutionary search over simulations, not demonstrated reproduction inside a single simulated ecology. (2) Experiments/Unsupervised Diversity, Figures 4–5 reports continuing additions and growing diversity during finite runs, with ten seeded replicates; the Open-Ended Evolution section explicitly disclaims theoretical open-endedness.

Designed versus emergent: locality supplies self-organization, but localization constraints and temporal-stability fitness select the admitted phenotypes. Methods/Unsupervised Statistical Measures acknowledges that fitness is only partially unsupervised and penalizes periodic/chaotic motion. Conclusion notes rotation/scale sensitivity. My inference: an archive can grow because it discovers useful mechanisms, because the representation moves, or because transformations split one mechanism into multiple niches. These possibilities need separate accounting.

## From Text to Life — arXiv:2407.09502v1

Primary source: https://arxiv.org/html/2407.09502v1

Reported claims: this is a review and conceptual synthesis, not a new controlled multiagent experiment. LLMS AS TOOLS FOR ALIFE/Artificial Evolution and LLMs describes model-guided mutation/crossover and quality-diversity systems; ALIFE FOR LLMS/Collective Intelligence proposes richer adaptive organization. Its Self-Organisation/Emergence subsection and Discussion distinguish many top-down implementations of agent capabilities from emergent ones.

My inference: these are candidate mechanisms for our coordinator rather than a performance guarantee. Inherited prompts, operator choices, memory, selection and communication topology should be represented explicitly in the evidence graph. A scheduled workflow that calls itself self-improving is not sufficient evidence that improvement evolved. The paper provides vocabulary and research directions, not proof that named complementary roles cause collective intelligence.

## Falsifiable cross-paper hypothesis — proposed, untested

H1: complementary scientific agents improve the yield of independently verified, mechanistically distinct hypotheses over an equal-budget homogeneous team only when selection rewards held-out mechanistic validity and archives preserve alternative explanations. Semantic separation alone will increase apparent diversity more reliably than verified discovery.

Design: randomize paper-analysis tasks among (A) homogeneous agents, (B) fixed complementary roles, (C) complementary roles plus a niche archive scored by mechanism and evidence rather than wording. Match model, total tokens, tool budget and paper access. Use blind initial commitments in every arm. Hold the evaluator and evidence rubric fixed, hide arm identity, and retain rejected hypotheses with reasons. Randomize multiple papers and seeds; report paper-clustered uncertainty rather than treating related sentences as independent discoveries.

Primary endpoint: unique hypotheses that survive an independently specified falsification check per fixed token budget. Secondary endpoints: citation accuracy, incorrect causal claims, retained competing explanations, pairwise error overlap, and robustness when one agent is removed. Deduplicate by intervention predictions and causal structure, not embedding distance alone. Predefine equivalence rules before seeing outputs. If B/C produce more wording diversity but no higher verified yield, H1's claimed practical benefit is unsupported. If C merely favors one evaluator's preferences, transfer to a held-out evaluator should collapse; that is a diagnostic failure, not discovery.

Interpretation boundary: visual novelty, stability, adaptation, hereditary evolution and mind are separate endpoints. Every promotion between them needs its own measurement. Our run can demonstrate coordinated literature analysis and record complementary contributions; it cannot by itself establish emergent cognition or empirical validation of these papers.
