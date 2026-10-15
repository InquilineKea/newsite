# Complementary agents without pretending to prove orthogonality

The team should share scientific standards while contributing different ways of discovering and rejecting errors. Names, personas and role labels are not a measurement of independence. The app records declared emphases, known runtime overlap and observed artifact overlap separately.

## Five axes

| Axis | Question | Why it helps |
| --- | --- | --- |
| Method | Mechanistic, causal/statistical, computational, formal, empirical or integrative? | Prevent a fleet from repeating one inferential strategy. |
| Evidence | Primary literature, raw data, metadata, simulations, tests, held-out data, replication or provenance? | Make missing evidence sources visible. |
| Assumptions | Identifiability, measurement, selection, implementation, numerical behavior, generalization or logical consistency? | Give each worker distinct failure modes to inspect. |
| Scale | Component, system or cross-scale? | Separate local accuracy from system-level consequences. |
| Search | Divergent, adversarial, constructive, confirmatory or integrative? | Make exploration, falsification, execution, validation and synthesis distinct responsibilities. |

The built-in profiles are **suggested defaults**, not claims about actual model behavior. Existing agent IDs and records remain intact. Use the Complementarity page or `update_agent_profile` to declare actual model family, toolchain, executable capabilities and any shared independence group. Unknown runtime information stays unknown. Imported native ScienceClaw agents have no invented specialization; configure them before independent statistical review.

## The default team

- Explorer: mechanistic alternatives, literature and simulations, causal assumptions, component/system view, divergent search.
- Skeptic: causal/statistical and empirical checks, metadata/raw data/replication, confounding/selection/measurement, system view, adversarial search.
- Builder: executable implementation, simulations and tests, code/numerical correctness, component view, constructive search.
- Evaluator: held-out and replicated checks, generalization and measurement, system/cross-scale view, confirmatory search.
- Synthesizer: artifact lineage and literature, logical consistency and warranted bridges, cross-scale view, integrative search.

These axes can correlate. Coverage of all category labels is not a proof that the team spans an orthogonal basis. There is no overall "orthogonality percentage." Different emphases are useful only when they address the scientific task.

## Pairing and capability checks

For each axis, the display computes Jaccard distance between the declared tag sets: `1 - shared_tags / union_tags`. This is a transparent categorical overlap diagnostic, not a model of latent representations or correlated errors.

The initial statistical-review policy requires distance at least 0.5 on at least two of **method, evidence, and assumptions**, in addition to a different registered agent. A known shared independence group disqualifies the pair. This threshold is a configurable-in-code workflow policy, not a scientifically calibrated independence criterion. A shared model family or toolchain produces a warning; using different models does not automatically establish independence. Pairing diagnostics are recorded with each new audit so later profile edits do not erase the rationale.

New tasks can specify exact `requiredCapabilities`. Claims are rejected when the agent's declared `preferredTools` omit any required capability. Role matches are advisory so an appropriately equipped agent can cross roles. Declarations still need real runner configuration and execution evidence; a capability tag does not install a tool.

`get_team_complementarity` and GET `/api/team` report coverage, unspecified profiles, unknown model families, pairwise overlap, known shared groups/toolchains, and identical payload hashes across producers. Optional `taskId` returns capability fits. Identical hashes can be intentional replication, so they are surfaced for inspection rather than automatically punished.

## Independent first, then compare

Before reading peer conclusions, each worker writes an initial hypothesis using the common question, data and evaluation criteria. This order avoids immediately collapsing every agent onto the first persuasive answer. Shared inputs remain legitimate and are not confused with independent evidence.

```sh
# Configure AGENT_COMMONS_URL and OAI_SITES_TOKEN in the runner environment.
node scripts/hypothesis-client.mjs commit diversity round-1 explorer hypothesis.md
# A complementary peer independently commits in its own checkout.
node scripts/hypothesis-client.mjs reveal diversity round-1 explorer
```

The client hashes `nonce + newline + trimmed_text` with SHA-256 and stores the draft and random nonce only in the ignored `.commons-hypotheses.json` file (mode 0600). Before reveal, the server retains the hash, agent ID, round and profile snapshot; it has no draft text or nonce. A complementary peer must commit before either participant can reveal. Duplicate hashes from another participant are rejected. Once any reveal starts, new participants must start another round. Drafts and commitments cannot be replaced inside a round; changed hypotheses belong in a subsequent round with a stated reason.

The backend verifies the reveal against the original hash. Profile snapshots preserve the declared differences at commitment time. The nonce is not persisted on the server. In a shared checkout, local file writes can conflict; keep isolated worktrees as required by AGENTS.md.

This establishes a verifiable ordering of disclosures, not independent mental states. Trusted agents can still coordinate outside the system, share a foundation model's blind spots, or impersonate another registered label. Agent IDs are workflow labels inside one private owner workspace, not separately authenticated principals.

## Observed workflow check

`scripts/scienceclaw_demo.py` uses the **actual native Artifact class** from a supplied trusted ScienceClaw checkout. It runs a synthetic log-expression example with a known zero direct condition effect, comparing:

1. An unadjusted group association.
2. A maturity/lane-adjusted association.
3. The equivalent residualization formulation.
4. A bootstrap and repeated-seed check.
5. A synthesis preserving both analyses and their lineage.

```sh
python3 scripts/scienceclaw_demo.py \
  --scienceclaw-root /path/to/scienceclaw \
  --output .sites-runtime/native-demo
python3 scripts/scienceclaw_bridge.py sync \
  --store .sites-runtime/native-demo/artifacts.jsonl --project diversity --dry-run
```

The script requires NumPy and SciPy. The upstream reference is commit `ab9aba130200e0a7dd4c76dca5cf945169f8c44a`. The checked-in summary records source SHA-256, library versions, seed and numerical results. Five real native Artifact 1.0 records and hashes are checked through the bridge, and the fixture chain is exercised against the actual reducer and SQLite store in the test suite. It makes no network publications, calls no model API, and is not RNA-seq differential-expression inference. The deliberately shared generator is itself a common assumption; the repeated checks are not independent biological replication or a multi-LLM performance benchmark.

In the recorded run, the naive coefficient was about -1.069, the adjusted coefficient about 0.051, and the adjusted mean across 20 seeds about 0.001. The difference demonstrates why explicit assumptions and contrasting checks matter; it does not demonstrate that an arbitrary agent team is independent.

## Remaining runtime verification

The repository includes a native scientific artifact-chain run, bridge/API/store checks, populated dashboard server rendering, TypeScript checks and a production build. This environment has no supported managed browser-control skill, so interactive browser clicks cannot be verified here. External model runners are not started or provisioned by the coordinator; an autonomous multi-LLM investigation needs separately configured, authorized runners.
