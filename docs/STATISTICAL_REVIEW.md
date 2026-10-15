# Statistical handoffs: explain what a result actually estimates

A claim such as "gene X is downregulated" must travel with its sample set, contrast, model and uncertainty. A mutation-associated expression difference can also reflect maturity, cell mixtures, depth, a lane or batch, laboratory conditions, selection, or another unmeasured variable. A small p-value does not resolve those explanations.

The opposite mistake is automatic adjustment for every available variable. Maturity or cell composition may mediate an effect of interest. Adjusting for them can change a total-effect question into a conditional/direct-effect question, and conditioning on a collider can introduce bias. State the estimand and justify each covariate's role. Do not claim a causal interpretation from this coordinator's observational DE contract.

## Agent workflow

1. **Design analyst:** Before fitting when possible, state the question, estimand, choice timing, experimental unit, included and excluded samples, independent biological replicate counts, gene filter, normalization, design formula, exact contrast, covariates, software, hypothesis family, multiple-testing method and effect-size/uncertainty reporting. Publish a plan or attach one as parent provenance; retrospective choices must be labeled.
2. **Analysis runner:** Execute the declared analysis in its scientific environment. Save commands, software versions, input hashes, diagnostics and full results as artifacts. Record deviations and alternative specifications. The coordinator does not run R, DESeq2 or count-matrix diagnostics itself.
3. **Independent skeptic:** Inspect the actual evidence for each audit category. Consider leave-one-sample/replicate or batch sensitivity where defensible; filtering and normalization sensitivity; appropriate independent replication; condition-batch aliasing, design rank and model diagnostics; stage/composition alternatives; and multiplicity/selection. Do not automatically treat all technical and biological covariates as nuisances.
4. **Synthesizer:** Describe the observed association under its exact contrast and assumptions. Retain failed checks and alternative explanations. Request new measurements when the estimand is not identifiable; numerical adjustment cannot separate perfectly aliased causes.
5. **H:** Review the handoff and independent audit. Accept the bounded result or request revision. A qualified result retains its limitations; an answered need or completed task does not prove a biological mechanism.

## Required analysis context

For a DE task, choose "Differential expression" when creating it, or pass `analysisKind: "differential_expression"` through `create_task`. Call `get_analysis_contract` before work. The producer attaches `analysisContext` on `publish_artifact` or embeds `analysis_context` in the native payload for the bridge.

Start from `examples/scienceclaw/differential-expression-context.json`. **It is a template, not analyzed data. Replace every placeholder, sample label and replicate count with the actual record.** Its checks default to `not-run`, and its identifiability is `unknown`; these are intentionally not a supported finding.

For one existing artifact with a separate context file:

```sh
python3 scripts/scienceclaw_bridge.py sync \
  --store /path/to/store.jsonl --project atlas \
  --artifact-id RESULT_UUID --context-file actual-context.json \
  --task-id CLAIMED_TASK_ID
```

Every sensitivity category must appear exactly once:

- Sample inclusion/exclusion and selection sensitivity.
- Gene filtering and retained hypothesis set.
- Batch variables and covariates, including lane, run, instrument or other recorded laboratory factors.
- Developmental maturity or stage.
- Cell-type composition and mixtures.
- Sequencing depth and normalization assumptions.
- Independent biological replication and pseudoreplication.
- Model diagnostics, contrast definition and multiplicity.

Each check is `passed`, `failed`, `not-run` or `not-applicable`, with a written finding and any evidence artifact IDs. A covariate record distinguishes its hypothesized causal role and how it was handled, with a rationale and an explicit condition-confounding flag. Unmeasured factors remain unmeasured; the form does not create evidence that they were controlled.

## Enforced review rules

`review_analysis` requires a registered agent different from the producer. It records all eight categories with evidence and a `supported`, `qualified`, or `blocked` verdict. It does not approve the task.

- A supported verdict is rejected if the producer reports failed/unrun sensitivity checks, unresolved condition confounding, or an estimand that is not recorded as estimable, or the reviewer reports concerns/untested alternatives.
- A non-identifiable contrast must receive a blocked verdict; revise the analysis, question or claim.
- A DE task cannot receive human completion approval without its linked context and a separate, non-blocked audit.
- Corrected artifacts use new IDs and link to their predecessors. Approval checks the latest descendant analyses for the task; independent, unsuperseded analyses each need review.
- The contract accepts association claims. It does not accept a `causal` scope for DE output.

DE tools known by skill/type names (DESeq2, edgeR, limma, differential-expression) trigger context requirements automatically. Native payloads explicitly marked `analysis_type` or `analysis_kind` as differential expression also require context during hash verification. Arbitrarily named generic artifacts must still be correctly declared by the runner; the coordinator cannot infer the scientific meaning of every payload.

These checks enforce disclosure, review separation and workflow state. They cannot verify that an agent truthfully reported a diagnostic, correctly specified a causal graph, or actually ran a sensitivity analysis. Reviewers need access to the supporting scientific artifacts. Statistical review is only as good as that evidence.

Primary methods reference: the [DESeq2 vignette](https://bioconductor.org/packages/release/bioc/vignettes/DESeq2/inst/doc/DESeq2.html), especially multifactor designs, contrasts, independent filtering, replication, single-cell guidance and rank-deficient model matrices. Use method-specific documentation for the actual analysis; this contract is not a universal prescription for covariate adjustment.

New independent statistical reviews also require complementary declared method/evidence/assumption emphases; a renamed copy of the producer's profile is insufficient. A known shared independence group disqualifies the pair. Review records retain pairing diagnostics. These are additional workflow checks, not a test that foundation-model errors or underlying scientific assumptions are independent. Previously recorded audits and completed decisions are preserved.
