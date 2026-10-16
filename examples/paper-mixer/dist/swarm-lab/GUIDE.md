# Strategic coupling — executable prototype

This implements the latest communication architecture from
https://chatgpt.com/share/6ad197e7-cde4-83e9-8828-7f49bad97836.

## What ran

- 28 deliberately constructed three-site tight-binding candidates; one Hermitian
  eigensolve and seven scattering solves each (196 scattering solves in total).
- 29 physics checks, four deliberately wrong/overstated controls, 40 seeded
  randomized checks and a separate 100-setting parameter screen.
- Six actual Codex worker contexts: geometry, spectrum, gauge, transport, archive
  and numerical skeptic. Each received only its own input packet. All six salted
  first-pass commitments were verified before the coordinator revealed drafts.
- A temporary spectrum–gauge–transport coalition received measured candidate facts
  and allowlisted published summaries. It returned a descriptor proposal, an
  equivalence review and an experiment hypothesis. It then dissolved. These outputs
  remain proposals; no shared ontology was promoted.

The contexts inherit the same model family, simulator and candidate pool. They
are not statistically independent replicates. Input isolation is procedural,
not an OS security boundary. The human-facing site exposes structured records
for inspection. Internal provider token counts were unavailable for this pass;
`tokenUsage: null` means unknown, not zero. This pass is separate from the
deterministic four-arm routing replay.

## Physics and quotient

Use hbar=1 and hopping t=1. For the oriented triangle, H[target,source] carries
exp(+i phi/3) along 0→1→2→0 and the reverse entry is its conjugate. Three normalized
single-channel ports have W=sqrt(gamma) I. With exp(-iEt):

    G(E) = [E I - H + i gamma I / 2]^-1
    S(E) = I - i gamma G(E)
    T[output,input] = abs(S[output,input])^2

The default detuned pair has onsite values [0,0.2,-0.35], flux ±pi/2, E=0 and
gamma=2. Entrywise conjugation preserves the real eigenvalues and transposes S.
Distinct onsite values force the identity diagonal-matching permutation; the
oriented loop product then separates the pair under gauge plus permutation.
Time reversal still relates them and identifies them if deliberately quotiented.
The symmetric zero-onsite control instead is reflection-equivalent when ports
are relabelled too. Fixed labelled-port response is the stated task here.

Gauge covariance, port relabelling, Hermiticity, unitarity, residuals, halfwidth
normalization and a finite loss/energy screen are checked. Complex hopping
requires a justified physical mechanism. This is not Kagome, chemistry,
mechanical stress, nonlinear hysteresis, fabrication or experimental validation.

Reference documentation: [NumPy Hermitian eigensolvers](https://numpy.org/doc/stable/reference/generated/numpy.linalg.eigh.html)
and [Kwant port-indexed scattering conventions](https://www.kwant-project.org/doc/latest/reference/generated/kwant.solvers.common.SMatrix).
This prototype uses NumPy directly, not Kwant.

## Replay measured fixtures

Python 3 + NumPy; Node.js for DOM checks:

```sh
python scripts/swarm_lab.py
python scripts/test_swarm_lab.py
node scripts/test_swarm_lab_ui.mjs
python scripts/build_swarm_lab.py
```

Rebuilding physics does not rerun AI workers. Their immutable input packets,
drafts, nonces, commitments and coalition outputs are retained in
`runs/strategic-coupling/agent-run/`. `source/conversation.json` preserves only the
relevant final architecture and user prompt, not unrelated historical messages.

## Run an external agent adapter

```sh
python scripts/swarm_runtime.py --arm event \
  --adapter-json '["python", "my_agent_adapter.py"]' \
  --output /tmp/my-event-run
```

The adapter reads one JSON request on stdin and returns one JSON response. It owns
provider credentials and must honor `maxTotalTokens`, including input and output.
Return actual provider `usage.total_tokens`. Missing usage, oversized packets,
unknown candidates, extra published keys or budget overruns invalidate the run.
The runtime cannot undo provider spending if an adapter violates its reservation;
it records the violation and stops further calls. Each invocation uses argv
without a shell. Submitted prose/code is not executed.

```json
{
  "published": {
    "kind": "Hypothesis",
    "claim": "A bounded proposed explanation",
    "candidateIds": ["X06", "X22"],
    "uncertainty": "Not yet discriminated",
    "requestedTest": "A concrete next test"
  },
  "private": {"hypothesis": "Own state", "localRanking": [], "schemaFork": {}},
  "usage": {"total_tokens": 123}
}
```

The example token value is illustrative. Valid published kinds are
DescriptorProposal, Hypothesis (including an experiment subtype), and Review
(including a scoped equivalence review). Use the existing Matter Zoo extension
envelope and `scripts/zoo_expand.py` to submit a full artifact for review; this
small adapter publication is a communication packet, not a complete Artifact 1.0.
Published packets are limited to 1,000 characters (claim ≤400); private state
summaries to 2,000. Calls receive the relevant candidate pair, not whole archives.

All arms use twelve adapter calls with the same aggregate token cap (48,000 by
default), per-call reservation (4,000), frozen candidate evidence and solver
charges. `single` gives one integrator all views and the aggregate budget.
`broadcast` shares published evidence after a first-pass barrier; `isolated`
never shares it; `event` shares it only inside the three-worker coalition. Six
local calls precede six followups. For event mode, three followups are coalition
members and three remain local. Broadcast content cost is reflected in actual
provider token usage; it receives no hard-coded reasoning penalty.

This is a communication experiment on cached evidence, not adaptive materials
search. No fresh candidate proposal is silently simulated. To claim discovery
benefit, add and debit adaptive evaluations, run all arms under matched budgets
and multiple seeds, and judge held-out behavioral niches, false novelty/merging,
uncertainty and costs. Baselines may tie or win.

## Router and archives

`Router` accepts only published evidence keys. Delta compares Euclidean distances
after frozen q95 scaling from the non-gauge-copy calibration subset; the held-out
energy/port-width settings do not set scales. Null distances remain unavailable.
The skeptic audits numerical quality and is not a sixth physical distance.

Routing gates include discrepancy, a transparent utility/cost proxy, cooldown
and communication budget. The proxy is not Bayesian information gain. Coalitions
have three members and close after one bounded output. Every fifth eligible
event probes a lower-exposure third worker. `Router.update` changes a bounded,
decaying edge weight only when supplied a held-out measurement and review artifact.
No measured coalition-yield record was supplied in this run, so priors were not
fabricated into learned weights. The current proxy uses the pair's recorded
weight; it does not claim learned causal partner utility.

The generic `QDArchive` implements descriptor-version gates, validity checks,
quality eligibility and tie-preserving elites for any of the three levels:

- Matter: a frozen circulation/reflection niche map has actual toy task champions.
- Representation: local definitions/forks are registered; scientific utility
  scores and elite selection await a reviewed evaluation.
- Swarm: four routing policy records are retained; epistemic quality remains
  unknown, so no winning AI architecture is selected.

Passing numerical checks does not mean new physics. Schema forks coexist and
require explicit migrations and a human decision before shared promotion. QD
occupancy and dimensionality alone never upgrade evidence.

The effective-rank diagnostic uses centered pair-distance fingerprints and
squared singular values, with zero for identical fingerprints. Graph Laplacian
entropy is intentionally excluded: a complete graph of identical agents can
have high nonzero-eigenvalue entropy. The replacement is also probe-dependent
and can be inflated by noise; it needs utility and robustness checks.

The static page performs no model calls and keeps router previews in memory.
Durable tasks, ScienceClaw evidence lineage and human handoffs remain in Agent
Commons. Publish native Artifact 1.0 with its real factory and exact canonical
payload/hash; preserve parent lineage and unmet needs. No external uploads or
schema approvals occur implicitly. Browser QA was unavailable.
