# Paper Mixer — ALife × Buehler

## Strategic Coupling / Swarm Lab

`/swarm-lab/` implements the shared conversation's six-representation protocol:
geometry, spectrum, gauge, transport, archive and numerical skeptic. It includes
private per-worker state, salted first-pass commitments, published-evidence
allowlists, discrepancy routing, bounded/dissolving coalitions, cooldown and
communication budgets, low-exposure probes, reviewed edge updates, local schema
forks and a generic versioned QD archive. Matter has scored toy response niches;
representation and policy candidates remain unscored where scientific utility
has not been measured. Shared ontology promotion is a separate human decision.

The recorded physics fixture evaluates 28 three-site tight-binding candidates,
with 196 scattering solves, 29 checks and explicit gauge/permutation/time-reversal
controls. Six actual worker contexts completed first passes before reveal; three
coalition followups returned proposed outputs. Their model/token independence
is not established; internal inference usage is unknown. Four deterministic
communication replays have zero model tokens and no measured discovery advantage.

```sh
python scripts/swarm_lab.py
python scripts/test_swarm_lab.py
node scripts/test_swarm_lab_ui.mjs
python scripts/build_swarm_lab.py
python scripts/swarm_runtime.py --arm event \
  --adapter-json '["python", "my_agent_adapter.py"]' --output /tmp/event-run
```

The adapter owns credentials, context isolation and provider token enforcement.
Twelve calls per arm share one aggregate cap and cached physics evidence. This
is a communication experiment, not adaptive materials search. See
`dist/swarm-lab/GUIDE.md` for boundaries, JSON contracts and reproduction details.
Raw source, measured run, commitments, agent outputs and audits are retained in
`runs/strategic-coupling/`. No Kagome, chemistry, mechanical hysteresis, fabrication
or experimental validation is claimed. Mathematical/protocol/DOM checks pass;
browser QA was unavailable.

## Computational Matter Zoo

`/matter-zoo/` preserves the supplied 27-section Notion research program and adds
19 proposed artifact types, explicit model-family boundaries, seven hypotheses
with alternatives/falsifiers, 11 provisional diversity axes, five planned
experiments, 23 source specialties and six complementary Agent Commons task
packets. Actual durable task IDs and dependencies are recorded in
`runs/matter-zoo/commons-tasks.json`. None of these queued tasks has been executed
by this import. The static explorer prepares/downloads packets; Agent Commons
handles durable coordination, evidence handoffs and review.

Canonical seed: `runs/matter-zoo/source/notion.json`; generated structure:
`runs/matter-zoo/program.json`; structural audit: `runs/matter-zoo/audit.json`.
The source is a point-in-time snapshot, not a live Notion sync. A bounded separate
context of the same inherited model audited structure and scientific boundaries.
It supplies no independent scientific replication.

```sh
python scripts/build_matter_zoo.py
node scripts/test_matter_zoo.mjs
python scripts/zoo_expand.py my-artifact.json
python scripts/zoo_expand.py my-artifact.json --output-dir runs/matter-zoo/extensions
```

The last command creates a new artifact ID directory with canonical payload and
SHA-256 receipt; duplicate IDs fail. Intake does not run submitted code, upgrade
evidence, merge scientific claims or promote schemas. See the downloadable
`dist/matter-zoo/AGENT_GUIDE.md` for the complete workflow. Browser QA was
unavailable; actual-data DOM, source coverage, packet and immutable intake checks
exercise the implementation. Cross-family transfers and scientific arrows remain
proposed contracts requiring domain evidence.

A small, executed quality-diversity demonstration with actual AI generation,
critique and feedback-guided revision. Its static explorer makes the recorded
archive, source boundaries, full feedback and parent lineage inspectable.

All outputs are **untested research proposals**. Scores express AI-rated
formulation quality, not experimental success or verified global novelty.

## Files

- `run/config.json`: six-paper source packet, niche axes and frozen rubric.
- `run/initial-*.json`: actual initial generator outputs.
- `run/feedback-*.json`: actual feedback from two critic contexts.
- `run/revised-*.json`: actual revisions of selected parents.
- `scripts/replay.py`: validate provenance/eligibility and deterministically rebuild the archive.
- `scripts/search.py`: run the same two-round protocol through your own JSON agent adapter.
- `dist/`: recorded results explorer, report and exports.

## Replay the completed example

Python 3, standard library only:

```sh
python scripts/replay.py
python scripts/make_report.py
python scripts/test_archive.py
```

## Run on new papers

Edit a copy of the source packet, keeping explicit mechanisms, locators and
transfer boundaries. Supply an adapter executable that accepts one JSON request
on stdin and returns a JSON array on stdout. The request includes operation,
system/instructions, source packet, schemas and candidates or feedback. The
adapter owns model credentials, context isolation and usage limits.

```sh
python scripts/search.py \
  --adapter-json '["python", "my_agent_adapter.py"]' \
  --config my-papers.json \
  --output /tmp/new-paper-mixer-run
```

This invokes actual generation, critique and revision calls. No provider or API
key is assumed. Each model call should start a distinct context; changing model
families requires declaring that choice explicitly. Adapter subprocesses execute
only the supplied argv, without a shell. Model outputs never execute as code.

The hosted explorer displays a completed run and copies prompts for another
round; it does not execute fresh model calls. To display another run, replace
its recorded data only after running the same validation and publication flow.

## Method and limits

The archive crosses targets (organism, collective, discovery workflow) with
intervention levers (representation, interaction, memory, selection). Two
initial proposals were deliberately seeded per cell. Two critics rate grounding,
mechanism, falsifiability and feasibility from 0–4. Mean ratings are normalized
to 0–100. At least one ALife and one Buehler source, explicit transfer boundaries,
both niche-fit gates, no fatal flags, and grounding >=2 from both critics are
required. Each occupied cell retains the highest-rated eligible candidate;
strict ties retain the incumbent. One child of each initial elite receives the
actual feedback, then competes in the same cell.

This is QDAIF-inspired, not a reproduction of the original implementation.
Contexts share one inherited model and a curated source packet. No physical
experiment, human-calibrated score, global novelty certification, equal-budget
superiority comparison or proof of emergent intelligence is claimed. The sample
was orchestrated using actual agent contexts; the generic adapter runner is
provided for reuse and is tested separately from that scientific run.

For an ordinary local copy, serve `dist` with a static HTTP server rather than
opening index.html as a file, because the explorer fetches run.json. For example:
`python -m http.server 8000 --directory dist`.

The generic adapter protocol was exercised with a clearly labeled recorded-output
fixture: ten calls reproduced the completed archive exactly. That fixture test
makes no new model-generation or independent validation claim. UI verification
includes actual-data DOM unit rendering and interaction checks; interactive
browser QA was unavailable in the managed environment.

## Experiment 002: high-attention disputed papers

The second run is in `runs/controversies/`, displayed at `/controversies/`.
It retains the original ALife run and its exports. The six focal dossiers cover
Stochastic Parrots, Sparks of AGI, Feeling the Future, power posing, Growth in a
Time of Debt, and Card–Krueger minimum wages. Nineteen reference entries link
original work, primary critiques, author replies, and scoped follow-ups. Access
levels vary and are described; this is a curated starting packet, not a current
citation ranking or an exhaustive systematic review.

The archive crosses AI, psychology and economics with measurement, causality,
replication and selection. Each transfer must use two focal dossiers from two
domains, including the target domain. It mixes methods for resolving disputes,
not effects or truth values. Source requirements are declared per corpus;
absent requirements retain the first run's ALife + Buehler rule.

```sh
python scripts/replay.py --run-dir runs/controversies --dist-dir dist/controversies
python scripts/make_report.py --run-dir runs/controversies --dist-dir dist/controversies
python scripts/test_archive.py
node scripts/test_ui.mjs
node scripts/test_ui.mjs dist/controversies
```

AI feedback rates the formulation of a dispute-resolution proposal. It does not
vote on whether an original paper is right. Citation attention, conceptual and
ethical disagreement, data corrections, causal identification and direct
replication are kept distinct. Scores across the two corpora are not calibrated
for comparison. Proposed reanalyses and studies remain unexecuted.

## Paper map: separate novelty, diversity, rigor and reading depth

`/paper-map/` adds nine paper-level profiles: three Peter Fedichev papers, three
Jonathan Gootenberg papers, ASAL, LeniaBreeder, and SciAgents. It uses eight
ordinal axes, precise source locators, confidence and declared reading coverage.
No composite score ranks papers or authors. Conceptual novelty, new capability,
evidence diversity, controls, statistical support, claim alignment, reproduction
resources and careful-reading yield are separate judgments. A high reading-yield
category can expose a limitation; it is not a rigor bonus.

Novelty is relative to a named nearby comparator, not an exhaustive priority
search. Diversity also has categorical descriptors for mechanism, scale, evidence
and validation. Two-paper comparison generates a grounded mixer brief; copying
it does not call a model or execute a new scientific experiment.

Three domain readers, one methods/novelty auditor, and a coordinator performed
this reading pass in separate contexts of the same inherited model family.
The audit log preserves refinements, disagreements and remaining limitations.
The website builder implemented the interface separately from scientific ratings.
Full data, rubric, original reading records, audit and provenance live in
`runs/paper-map/`; public exports are in `dist/paper-map/`. Preprints are pinned
to the reviewed versions. A later version may exist beyond the stated scope.

```sh
python scripts/build_paper_map.py
node scripts/test_paper_map.mjs
```

The export command validates and packages the recorded reading. It makes no new
model calls and does not recompute editorial ratings from source texts. Unknown
assessments remain null and are omitted from a scatter axis instead of plotted
as zero. Scatter offsets only separate tied ordinal categories; they add no
scientific precision. The accessible table retains exact categories.

## Buehler atlas: separate rankings across eras

`/buehler/` ranks 18 selected Buehler papers independently on representation
change, structural transfer, formal composition, dynamics, process organization,
explanatory gain, validation closure and robustness. These are conceptually
separable dimensions, not proven statistically independent factors. There is
no summed quality, novelty or prestige score.

CGCNN, NequIP and corrected A-Lab are strong chosen comparator papers, not a
representative sample of conventional materials research. Category ranges
and per-axis rankings retain ties; filters preserve the complete corpus ranks.
A pairwise Spearman table shows where rating axes overlap. Ratings remain
editorial AI judgments with confidence and precise reviewed-version scope.

Four domain readers, one methods auditor and a coordinator shared the same
inherited model family. The corpus includes one abstract-only profile
(Categorical prototyping) and a partial FieldPerceiver read; six dimensions
remain unknown. The copresheaves profile pins arXiv v2 (August 2026), retains
its important version change, and exposes disagreement about explanatory gain
(final 3, low confidence; auditor 2). No experiments or independent reproductions
were performed by this project. Original readings and the audit are retained.

```sh
python scripts/build_buehler.py
node scripts/test_buehler.mjs
```

The exporter validates the recorded profiles and produces ordinal rankings,
CSV, a report, correlation diagnostics and a focused source bundle. It makes
no model calls and does not infer ratings from source text. The website reads
its published JSON; it does not launch agents or scientific jobs.

## Paper presheaf: scoped evidence and conditional synthesis

`/presheaf/` factors the 18-paper Buehler corpus into five reading contexts,
109 source-linked categorical ports and eight explicit cross-paper contracts.
The projection is curated and lossy; it does not derive an ontology from scores.
Each fact is namespaced by paper and preserves source scope and reading limits.

The base is a finite discrete variable space K with subset contexts and union
covers. The product assignment functor E(U) has literal projection restrictions.
F(U) retains complete assignments that satisfy every declared constraint whose
full support lies in U. F is a separated presheaf; cross-patch predicates can
prevent an otherwise compatible family from gluing. A failed selected packet
does not imply that every global section is absent. Unknown observations are
partial records and are tested through hypothetical finite completions, never
treated as observed evidence or total sections.

A separate covariant functor I(U) tracks fixed artifacts with support in U,
using literal inclusion maps. This is artifact availability, not production or
a cosheaf. Sheafification on this discrete base can forget the cross-variable
constraints; it is not a scientific repair operation. No cohomology is computed.

```sh
node scripts/test_presheaf.mjs --write
node scripts/test_presheaf_ui.mjs
python scripts/build_presheaf.py
```

The bridge view contrasts bounded catalog/contract claims with deliberately
stronger extrapolations. Temporary missingness and overlap-conflict controls
are clearly labeled synthetic demonstrations and never modify saved facts.
Passing a screen establishes consistency of the chosen encoding, not a new
scientific result. Audit fixes and original extracted records are retained.
