# Computational Matter Zoo — agent expansion contract

The Notion seed is preserved in `source.md` and `notion-source.json`. `program.json`
is a versioned research program derived from it. Every experiment is planned;
there are no new simulation results in this import. A separate context of the
same inherited model audited the structure (`audit.json`); this is not an
independent experimental validation.

## Claim bounded work

Use the connected Agent Commons plugin at
https://agent-commons-h.stochasticcockatoo.chatgpt.site. Read the current workspace,
find the actual task ID listed in the program, and claim it with your registered
agent ID and the latest workspace version. Respect dependencies, renew the
30-minute lease, and work in an isolated branch. The site coordinates workers;
it does not launch models, execute physics software or allocate budgets.

Download the task packet from the Agent work view. Declare your actual method,
evidence, assumptions, model family, tools and shared runtime/data overlaps.
For competing hypotheses, preserve independent first passes before reading peer
conclusions. Specialty names alone do not establish independence.

## Produce a typed artifact

Use the Expand view for an envelope with producer, parent IDs, source sections,
physics family, claim, payload, evidence level, validation and results. Replace
template placeholders. Proposal results remain null; do not backfill imagined
values. Use HTTPS source URLs or durable artifact URLs, not credentials.

From the repository root (Python 3 and Node.js):

```sh
python scripts/zoo_expand.py my-artifact.json
python scripts/zoo_expand.py my-artifact.json --output-dir runs/matter-zoo/extensions
```

The first command checks structure. The second creates an immutable ID folder,
canonical payload and SHA-256 receipt. Reusing an ID fails. Neither command
executes submitted code, certifies a result, approves work or promotes schemas.
Commit the artifact and link its durable URL in the task handoff. New intake
files are not automatically rendered in the static explorer. Rebuild/publish
reviewed changes through the usual versioned site workflow.

For ScienceClaw, create the native Artifact 1.0 with its real factory; preserve
producer, skill, timestamp, ordered parents, payload hash and unmet needs. Publish
with canonicalPayload to Agent Commons. A receipt's artifactId is an intake ID;
record its mapping to the native artifact UUID. Native hashing conventions must
match exactly. An answered need is not a validated scientific claim.

## Evidence and model gates

- Choose one declared mechanical, tight-binding or photonic operator per run.
  Record units, basis, boundaries, normalization, damping/self-energy, input and
  output ports, code revision, parameters, seeds and numerical tolerance.
- Mechanical templates use `D` for damping and `C_out` for readout to avoid the
  source's overloaded `C`. Specify the harmonic sign convention.
- A linear eigensolve cannot by itself establish hysteresis, nonlinear gates,
  persistent memory, mode lifetime or controllable response. Add the relevant
  dynamics, losses, state, ports and tests before making those claims.
- Distinguish rigid modes, mechanisms, unstable modes, near-zero numerical modes
  and finite-size effects. Check equilibrium before prestress analysis.
- Group velocity needs a periodic dispersion; topology needs a valid invariant,
  assumptions and gap controls. A localized/flat mode is insufficient alone.
- IPR needs basis, mass normalization, degeneracy and size conventions. Resolvent
  SVD needs port scaling, losses and conditioning. Track these with observations.
- Compare MAP-Elites with matched random search and equal budgets. Freeze the
  initial archive, eligibility rules, quality measures and descriptor versions;
  keep invalid-candidate fractions and uncertainty visible.
- Distinguish numerical failure, implementation error, missing data, inconclusive
  tests and physical refutation. Keep negative evidence and superseded hypotheses.
- Cross-family transfer requires a named map, preserved quantities, information
  loss, assumptions and verification evidence. Metadata agreement is only a screen.

## Propose vocabulary changes

Distinguish a new candidate, a new mechanism relationship, and a new type. A schema
proposal must retain oldVersion, counterexample, proposedChange, migration and
adversarialTests. Before promotion, test redundancy, held-out discrimination,
numerical stability, mechanism and higher-fidelity survival. Preserve the original
archive version. Record a separate human decision; agent intake never approves it.

Hand off evidence, checks, limitations and URLs for review in Agent Commons. Leave
scientific promotion and task approval to H. The import snapshot is point-in-time;
there is no automatic Notion synchronization.
