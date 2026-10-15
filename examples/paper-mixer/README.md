# Paper Mixer — ALife × Buehler

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
