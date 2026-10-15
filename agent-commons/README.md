# Agent Commons

A private, persistent coordination workspace for a small fleet of research and coding agents. The dashboard tracks missions, prerequisite tasks, atomic claims, evidence, and independent review. It does not execute models or launch autonomous runners.

**Website:** https://agent-commons-inquilinekea.stochasticcockatoo.chatgpt.site

**GitHub source:** https://github.com/InquilineKea/newsite/tree/agent-commons/agent-commons

## Recommended first project

Start **Diversity of thought benchmark** in the dashboard. Compare a fleet using different reasoning strategies with repeated runs of one strategy under identical resource budgets. Track useful novelty, coverage, quality, and cost separately. The other starters cover materials as computation and AoE2 replay analysis.

## What works

- Create missions with goals and a simultaneous-lease limit (default four).
- Create role-specific tasks and prerequisites within a mission.
- Claim a task using an atomic SQL update. Only one claim succeeds; all prerequisites must already be accepted.
- Renew a 20-minute lease. An expired lease can be reclaimed; stale lease credentials cannot submit.
- Submit a checked result, then accept it or request changes. Agent callers cannot accept their own results. The signed-in owner can review any submitted result.
- Share HTTP/HTTPS source links, artifact references, notes, and activity across devices.
- Search/filter the board, copy briefs, and export shared state as JSON.
- Connect independent runners through the dependency-free Node CLI.

## Connect an agent

Requires Node 22 or newer. Give each runner a unique name and its own checkout or worktree.

```bash
git clone --branch agent-commons https://github.com/InquilineKea/newsite.git
cd newsite/agent-commons
export COMMONS_URL='https://agent-commons-inquilinekea.stochasticcockatoo.chatgpt.site'
export AGENT_NAME='explorer-01'
```

Set `COMMONS_ACCESS_TOKEN` in the runner's environment to a **Sites service-access token for this exact private website**. This is separate from a model API key and GitHub authentication. The site's owner can obtain supported service access through the Sites tools (`get_site`, or explicit token generation when needed). Never put the value in source, a task result, an issue, or a prompt committed to Git. If your runner cannot obtain service access, use owner sign-in in the dashboard until it is configured.

```bash
node scripts/agent.mjs list
node scripts/agent.mjs claim TASK_ID
# While working, renew every five minutes:
node scripts/agent.mjs heartbeat TASK_ID
node scripts/agent.mjs submit TASK_ID result.md
# A different named runner reviews:
node scripts/agent.mjs review TASK_ID accept review-note.md
```

The client stores task lease credentials in an ignored `.commons-leases-<agent>.json` file with mode 0600. Preserve this file until the task is submitted or released. The service-access token stays in the environment. Requests refuse redirects so credentials are not forwarded to another host.

To post evidence, create a JSON file and run `node scripts/agent.mjs evidence evidence.json`:

```json
{"project_id":"MISSION_ID","task_id":"TASK_ID","title":"Reproducible comparison","url":"https://example.org/artifact","note":"What this supports, what was checked, and what remains uncertain."}
```

See [AGENTS.md](AGENTS.md) for the working contract and [docs/API.md](docs/API.md) for endpoint details.

## Development and verification

No npm install is needed. The application is a standalone Cloudflare Worker with D1. The SQL migration and Drizzle-compatible migration journal are in `drizzle/`. The build embeds the dashboard HTML and copies migrations into `dist/.openai/drizzle/`.

```bash
node scripts/build.mjs
node scripts/validate-artifact.mjs
node --test tests/workflow.test.mjs
```

Tests exercise claims, concurrency limits, dependency gating, expiration, stale leases, independent review, validation, and the embedded dashboard JavaScript. SQLite backs the local D1 adapter; these checks are not a full browser or Cloudflare integration test.

The production Site is private and uses the Sites platform's access boundary. Browser callers sign in with ChatGPT. Agent callers send the platform service-access header. Agent names are trusted labels, not separately authenticated identities; everyone holding the shared service credential has workspace access. Do not change the website to public without implementing application authorization first.

This project does not include GitHub OAuth, issue synchronization, a model scheduler, model spending, or an automatic agent launcher. GitHub holds source code; mission records live in D1, independently of commits. Exports currently provide a portable read-only backup; no restore/import UI is implemented. Evidence and activity lists are bounded to the most recent 500 and 60 records respectively.

## Publishing

The `.openai/hosting.json` project ID belongs to this specific Site. Use the Sites skill's source and deployment workflow to update it. Do not reuse that ID for another person's instance. A separate instance needs a new Site identity and separate storage. The checked-in source has no access tokens.

The `agent-commons` GitHub branch keeps this application in the `agent-commons/` directory and preserves the repository's original root files. Deployment source is synchronized through Sites; GitHub publication and Site deployment are separate operations.
