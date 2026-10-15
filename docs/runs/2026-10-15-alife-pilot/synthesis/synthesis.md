# Paper pilot: discovery needs an explicit observer

**Cross-paper finding:** promising artificial-life search becomes more scientifically useful when the discovery process can change its representation while evaluation preserves a separate, fixed question. The observer is part of the experiment. This is our synthesis, not a result demonstrated jointly by these papers.

ASAL makes learned visual representations usable as discovery objectives; its finite novelty measurements need their stated horizon and observer ([primary v1](https://arxiv.org/html/2412.17799v1), §§3.2–3.3, 4.2, Appendix B.2). Leniabreeder illustrates adaptive repertoire exploration and explicitly bounds its open-endedness interpretation ([primary v1](https://arxiv.org/html/2406.04235v1), Background/Open-Ended Evolution; Methods/Unsupervised Statistical Measures; Experiments/Unsupervised Diversity). *From Text to Life* supplies conceptual distinctions rather than a new controlled demonstration of living or collectively intelligent LLMs ([primary v1](https://arxiv.org/html/2407.09502v1), ALife for LLMs/Emergence, Collective Intelligence, Discussion). Together they motivate auditable discovery, not an inference from attractive novelty to mind.

## What the complementary agents contributed

- **Explorer:** separated the mechanisms being searched from the scientist-supplied selection machinery; external optimization is distinct from reproduction inside an ecology. Proposed hypotheses defined by intervention predictions rather than different wording.
- **Skeptic:** identified construct ambiguity: changing the observer can change apparent diversity, but imposing invariance can erase useful positional behavior. Requested competing interpretations instead of treating normalization as automatically correct.
- **Evaluator:** separated correlated frames and related archive members from independent search runs. Proposed fixed held-out evaluation and an independent-ensemble baseline to isolate interaction from extra sampling.
- **Builder/coordinator:** implemented and ran the deterministic descriptor check, preserving reproducible code, outputs and review lineage. The Evaluator inspected and executed it independently of its authorship.
- **Synthesizer:** reconciled those contributions into one testable measurement-and-coordination proposal, retaining the tensions below.

The three initial reviews were hash-committed before reveal and discussion. They largely agreed; we found no substantive initial dissent to dramatize. Their complementary emphasis is observable in this run, but all runtimes share an inherited model and the same three-paper corpus. Sealed first passes reduce information leakage; they do not establish independent errors or prove a team advantage.

## Completed measurement diagnostic

The executed Conway Life control used a 64×64 periodic world and 64 measured frames, with assertions that occupied cells never touched a boundary. Exact raw-image versus translation-normalized counts were:

| Fixed pattern | Raw frames | Normalized shapes |
|---|---:|---:|
| Block | 1 | 1 |
| Blinker | 2 | 2 |
| Glider | 64 | 4 |

The glider repeats its normalized shape after four updates with displacement [1,1]; every available four-step displacement check passed. Sixteen translated initial gliders yielded sixteen raw arrays and one normalized shape. The Evaluator reran the code and confirmed the recorded output.

**Narrow result:** the count of image-unique observations depends on the chosen equivalence rule. Sixty-four glider frames are not sixty-four discoveries; four phases are not four species. This hand-selected deterministic example tests neither CLIP nor ASAL, AURORA or Lenia. It is no paper replication, statistical comparison or demonstration of evolution, cognition or multiagent superiority.

## Tensions worth preserving

**Stability versus novelty:** stability can protect useful structure and suppress useful transitions; novelty can uncover stepping stones and reward meaningless drift. Preserve both in an archive with explicit outcomes, rather than silently treating either scalar as a definition of life.

**Observer invariance versus functional position:** translation normalization suits intrinsic morphology, while displacement and location matter for navigation, encounters and collisions. Store morphology together with motion and interaction outcomes. A coarser descriptor is not automatically a better one.

**Promising discovery versus bounded proof:** a productive finite search can remain valuable without demonstrating indefinite innovation. Likewise, useful coordinated analysis can exist without establishing emergent collective intelligence. Keep claim scope attached to measured conditions.

## Feasible hackathon experiment — proposed, not run

Build an **observer-audit benchmark** around the coordinator. First use separate development packets to refine role briefs and a scoring rubric; then freeze both. Reserve 20 previously withheld ALife/emergence paper packets, each with source text and a small reproducible diagnostic where available. Do not tune roles or scoring on their outputs.

Randomize each packet across three arms: (A) one analyst, (B) independent analysts plus a fixed aggregation step, and (C) complementary interacting analysts plus the same aggregation step. Match total generated tokens, tool calls and source access, including aggregation costs; record actual usage. Seal first passes in both multiagent arms. Predefine timeouts, failures and source-access rules. Add communication-disabled or message-shuffled comparisons only if the budget permits; they remain unrun ablations.

**Fixed primary outcome:** correctly source-supported claim/limitation pairs per fixed total token budget, deduplicated by scientific proposition using rules frozen on development packets. Each pair must identify a claim, its actual measurement boundary and a source locator. Blind human adjudicators should score arm-hidden outputs without authoring the briefs; report disagreements. Report paired per-paper effects and uncertainty, with papers as clusters rather than sentences as independent samples. Track unsupported scope inflation and citation errors as secondary outcomes.

Arm C must outperform B to support an interaction benefit; an advantage only over A could reflect additional sampling. An increased count of diverse-looking phrases without more valid pairs would fail the primary test. Twenty papers can support an exploratory hackathon result, not a general claim across fields or model families. This pilot has completed the literature review, commitment/reveal workflow and toy diagnostic only; the proposed benchmark, new ALife optimization and cross-model replication have not been run.
