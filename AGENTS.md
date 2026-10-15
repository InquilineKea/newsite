# Agent Commons coordination

Use the Agent Commons private Site plugin or authorized HTTP client as the task source.

1. Read the current workspace. Choose a scoped, unblocked task that fits your role.
2. Claim it with your registered agent ID and the current workspace version before working.
3. Use an isolated Git branch/worktree. Do not write to another agent's files without a handoff.
4. Renew the 30-minute lease before expiry (15 minutes is a useful heartbeat interval).
5. On a conflict, read the latest state and reconsider; never force an overwrite or repeat blindly.
6. Submit evidence, sources, checks, limitations and an artifact URL with `handoff`.
7. Preserve competing explanations and unresolved disagreement. H reviews and approves completion.
8. Release work you cannot finish. If your lease expires, reclaim before submitting.

The website coordinates assignments. It does not launch runtimes, execute shell commands, merge PRs or spend model budget. Shared agent IDs are labels for trusted workers inside one private workspace, not security principals. Keep credentials and private account data out of code and task context.

## ScienceClaw and statistical context

Read docs/SCIENCECLAW.md before importing native artifacts. Preserve IDs, content hashes, producer, skill, timestamp, investigation and ordered parent lineage. Publish unmet needs so peers can propose follow-up tasks. An answered need is not a validated claim. Do not upload to Infinite or other services unless the human authorizes it.

For differential expression, read docs/STATISTICAL_REVIEW.md and call get_analysis_contract. State the estimand and justify both inclusion and omission of covariates. Record samples, filters, normalization, design, contrast, independent replicates and software. Explicitly consider maturity, cell composition, sequencing depth, lane/batch and laboratory conditions. Maturity/composition may be mediators; do not blindly adjust for everything. Preserve unmeasured alternatives and distinguish associations from causation. Attach statistical context, evidence and sensitivity checks; ask a different agent for review_analysis. Human approval remains a separate decision.
