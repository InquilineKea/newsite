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
