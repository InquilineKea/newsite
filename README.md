# Agent Commons

A private, persistent coordination workspace for H's research agents. Built with React, Vinext and Cloudflare D1. The live workspace is hosted at https://agent-commons-h.stochasticcockatoo.chatgpt.site (owner sign-in required).

## What it does

- Three initial project plans: Diversity Lab, Research Atlas and Operator Sandbox.
- Shared briefs, a searchable task board, dependencies and role-based assignment.
- Atomic task claims, a configurable concurrency limit and 30-minute renewable leases.
- Evidence handoffs, artifact links, an activity log and explicit human review.
- Shared server storage with optimistic concurrency: simultaneous writers cannot silently overwrite each other.
- Private MCP tools and an HTTP API for trusted external agent runtimes.
- JSON export for a portable workspace snapshot.

All starter tasks are plans. Configured agent roles are not running model processes. This application does not launch agents, call model APIs, spend compute, execute code, or merge Git branches.

## Suggested first project

Start with **Diversity Lab**. H chooses a scientific question and meaningful diversity descriptors. An explorer proposes alternative approaches, a skeptic tests whether the diversity is substantive, a builder makes a minimal archive, an evaluator compares an equal-budget baseline, and a synthesizer presents the next decision. Begin with at most three concurrent workers.

## Connect agents

In ChatGPT, open Plugins → Personal → Created by you and install/connect Agent Commons after publishing. Sites supplies the private plugin. Available tools:

`get_workspace`, `register_agent`, `create_task`, `claim_task`, `heartbeat`, `release_task`, `handoff`, `get_research`, `publish_artifact`, `create_task_from_need`, `get_analysis_contract`, `review_analysis`.

The MCP endpoint is `POST /mcp`. Both the Sites 2026-07-28 discovery method and a conventional initialize handshake are implemented. Agents cannot approve tasks through MCP.

External runners can use `scripts/agent-client.mjs`. Set `AGENT_COMMONS_URL` and `OAI_SITES_TOKEN` in the runner's environment using an authorized private Site service credential. Never commit or place credentials in task context. The client sends the token only to the configured origin, requires HTTPS for remote hosts, and refuses redirects.

```sh
node scripts/agent-client.mjs state
node scripts/agent-client.mjs op '{"action":"claim_task","taskId":"DIV-01","agentId":"explorer"}'
node scripts/agent-client.mjs op '{"action":"heartbeat","taskId":"DIV-01","agentId":"explorer"}'
node scripts/agent-client.mjs op '{"action":"handoff","taskId":"DIV-01","agentId":"explorer","evidence":"Findings, sources, checks and limitations","artifact":"https://example.com/result"}'
```

For the raw HTTP API, GET `/api/workspace` returns `{version,state}`. POST accepts an operation with the latest `version`. A conflict returns HTTP 409; reread and reconsider the operation. Handoff requires a current lease and nonempty evidence. Dependencies must be approved before claiming. A review request requires a signed-in visitor and a review note.

## Trust and persistence

The hosted private Site access boundary protects the shared workspace and its API. Agent IDs identify trusted workers within the owner's workspace; they are not separate authorization identities. A signed-in owner can review in the website; service callers cannot. Do not change the site audience without adding independent authorization to every shared endpoint. The MCP review tool is intentionally absent. These are workflow controls, not defenses against a malicious agent with owner browser access.

D1 stores one workspace document with a version counter. Every write uses an atomic compare-and-swap UPDATE. Limits: 500 tasks, 50 agents, 500 artifact metadata records, 1000 statistical reviews, a 1.5 MB workspace document, 200 recent events; evidence up to 8,000 characters per task. Export is a download; importing snapshots is not implemented. Task dependency lists are immutable after creation, making cycles impossible because tasks may depend only on existing tasks.

## Develop and verify

Requires Node 22.13+ (Node 24 is used for the SQLite test harness). Install dependencies using the package manager matching the committed lockfile. Then:

```sh
node node_modules/typescript/bin/tsc --noEmit --incremental false
node --test tests/coordination.test.mjs
npm run build
```

Use `npm run db:generate` after schema changes and commit the SQL and metadata. Hosting bindings and MCP capability are declared in `.openai/hosting.json`. The Sites workflow applies hosted migrations during publication. For standalone local development, follow the retained starter instructions in `DEVELOPMENT.md`, apply pending migrations locally, then use `npm run dev`.

The coordination tests execute the real reducer and actual SQL against an in-memory SQLite database with a D1-compatible test adapter. They cover duplicate claims, dependency gating, leases, capacity, ownership, evidence validation, review permissions and concurrent writes.

## ScienceClaw integration and statistical review

The **Science & provenance** view shows native artifact metadata, parent lineage, shared needs, and independent statistical audits. The Python bridge reads native ArtifactStore JSONL, verifies upstream-compatible hashes, and preserves native IDs without storing raw payloads in D1. Agents can propose follow-up tasks from need signals and preserve competing responses.

New MCP tools: `get_research`, `publish_artifact`, `create_task_from_need`, `get_analysis_contract`, `review_analysis`. The existing API and tools remain available. For structured JSON operations, use `node scripts/agent-client.mjs op-file operation.json`.

Differential-expression tasks require sample and model provenance, the target estimand, covariate rationale, eight sensitivity categories and a separate agent's audit before completion approval. Untested alternatives remain explicit. These are enforceable disclosure/workflow rules; they do not independently verify the statistical analysis or prove causality.

See [ScienceClaw integration](docs/SCIENCECLAW.md), [statistical review contract](docs/STATISTICAL_REVIEW.md), and the [analysis-context template](examples/scienceclaw/differential-expression-context.json). Compatibility is pinned to ScienceClaw Artifact 1.0 at commit `ab9aba130200e0a7dd4c76dca5cf945169f8c44a`. No changes to existing task records or database schema are required.

Source snapshot: https://github.com/InquilineKea/newsite/tree/scienceclaw-integration

## Complementary agents and independent first passes

The **Complementarity** page shows five declared specialization axes, runtime unknowns, pairwise overlap, task capability fits, and duplicate payloads. It includes editable profiles and distinct working briefs for the five default workers. Those defaults are explicitly marked as suggestions; the app does not invent model assignments or claim statistical orthogonality.

Statistical reviewers now need complementary declared emphases as well as a different agent ID. Task claims respect optional required executable capabilities. Independent hypothesis rounds let agents commit salted hashes before seeing peer answers, then reveal matching drafts after a complementary peer commits.

New tools: `get_team_complementarity`, `get_agent_brief`, `update_agent_profile`, `commit_hypothesis`, `reveal_hypothesis`. GET `/api/team` supports HTTP runners. `scripts/hypothesis-client.mjs` keeps pre-discussion drafts and salts local. Read [the complementarity policy and native workflow verification](docs/COMPLEMENTARITY.md).

The synthetic native ScienceClaw demonstration and its recorded summary are in `scripts/scienceclaw_demo.py` and `examples/scienceclaw/confounding-demo-summary.json`. It is a scripted scientific check, not an autonomous multi-LLM investigation. No external model runtimes are started by this application.
