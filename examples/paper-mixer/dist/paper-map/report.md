# Paper Mixer — Paper Map

2026-10-15

Nine paper profiles across eight separate axes. Inspect conceptual novelty, new capability, evidence diversity, rigor and consequential details beyond the abstract. Compare mechanisms without reducing papers or authors to one score.

Ordinal editorial AI judgments, 0–4. Adjacent numbers are ordered categories, not equal measured distances. No aggregate score or author ranking.

null means insufficient reviewed evidence, never zero. N/A is reserved for a criterion outside the claim type, with a reason.

## Reading protocol

- Separate novelty of a representation, mechanism, observation and usable tool. Name a nearby comparator; do not certify global priority.
- Describe diversity using mechanism, scale, evidence and validation tags as well as evidence-diversity ratings. Different fields need different controls.
- Separate observation, model interpretation and extrapolation. A fitted latent variable need not identify its proposed cause.
- Record sample selection, filtering, normalization, covariates and endpoint construction when consequential; unverified adjustment is not a proven omission.
- Use confidence and reading coverage to expose uncertainty. No experiment or independent reproduction is performed here.
- Easy to miss from an abstract is a reading observation; historically overlooked requires separate reception evidence.
- Keep role-separated readings and coordinator decisions visible. All contexts inherit the same model family.

## Scope and limits

- These are editorial AI assessments of specific reviewed versions, with source locators and confidence; they are not measured properties or expert-calibrated rankings.
- Three domain readers and a methods/novelty auditor worked in separate contexts of the same inherited model family. A coordinator reconciled concrete wording and score differences.
- No raw-data reanalysis, code reproduction, biochemical experiment or independent scientific replication was performed.
- Nearby comparators are scoped checks, not an exhaustive priority search. Easy to miss from the abstract does not mean historically overlooked.
- Axes depend on claim type. Biological measurements, theoretical inference, engineering capability and generated research proposals have different validation requirements.
- High careful-reading yield can reveal a limitation. It is not a bonus for rigor. Unknown is null, never zero; ordinal spacing is not a measured distance.
- Preprints are version-pinned. Reading coverage explicitly records unavailable supplements and access limits; this corpus is illustrative, not exhaustive.

## Axis definitions

### Conceptual novelty

How much does the framing change relative to the named comparator?

- 0: No distinct increment identified
- 1: Local extension
- 2: Substantial synthesis or reframing
- 3: New explanatory organization
- 4: Unusually far-reaching reorganization; priority still unverified

### New capability / observability

What can be measured, found or done that the named comparator could not demonstrate?

- 0: No new capability demonstrated
- 1: Narrow extension
- 2: New capability in a limited setting
- 3: Multiple convincing demonstrations of a new capability
- 4: Broadly tested capability with consequential new access

### Evidence diversity

How many meaningfully different kinds of evidence constrain the central claim?

- 0: No empirical constraints reviewed
- 1: One kind of evidence
- 2: Several related assays or settings
- 3: Distinct modalities or validation approaches
- 4: Converging independent evidence types and contexts

### Design and controls

Do comparisons distinguish the claimed effect from plausible alternatives, relative to the claim type?

- 0: Not supported by reviewed comparisons
- 1: Limited comparisons
- 2: Relevant baselines; major alternatives remain
- 3: Strong claim-matched controls
- 4: Discriminating controls across central alternatives

### Statistical support

How well do sampling, uncertainty and analysis support the stated inference?

- 0: No relevant support reviewed
- 1: Descriptive or weakly characterized uncertainty
- 2: Useful quantitative analysis with important gaps
- 3: Well-supported analysis with scoped residual limits
- 4: Extensive calibration and sensitivity analysis for the inference

### Claim–evidence alignment

How closely does the interpreted claim stay within what was actually tested?

- 0: Large unsupported leap
- 1: Major interpretive overreach
- 2: Mixed alignment; important extrapolation
- 3: Mostly bounded claims
- 4: Exceptionally explicit and well-supported boundaries

### Reproduction resources

Do the reviewed methods, data and materials make the work inspectable and repeatable?

- 0: No usable resources found
- 1: Sparse procedural detail
- 2: Methods and some resources available
- 3: Substantial methods, data or code resources
- 4: Comprehensive reusable resources with unusually clear provenance

### Careful-reading yield

How consequential are details beyond the abstract for interpreting or reproducing this paper?

- 0: No consequential detail identified
- 1: Mostly implementation detail
- 2: Detail changes reproduction choices
- 3: Detail materially changes interpretation
- 4: Load-bearing details strongly change the apparent claim

## DOSI · Longitudinal analysis of blood markers reveals progressive loss of resilience and predicts human lifespan limit

Timothy V. Pyrkov, Konstantin Avchaciov, Andrei E. Tarkhov, Leonid I. Menshikov, Andrei V. Gudkov, Peter O. Fedichev · 2021 · Published research article; Nature Communications version of record, 25 May 2021 · Version of record, DOI 10.1038/s41467-021-23014-1

[Primary source](https://www.nature.com/articles/s41467-021-23014-1)

Blood and activity fluctuations offer a dynamic view of aging resilience.

**Diversity descriptors**

- Mechanism: critical slowing, phenomenological dynamics
- Scale: human, organism, population
- Evidence: CBC, wearable activity, mortality
- Validation: held-out cohort, cross-modality, observational

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 3 | medium | Adds recovery dynamics to static biological-age prediction. — Introduction; Results: Physiological state fluctuations and loss of resilience |
| New capability / observability | 3 | medium | Recovery-time estimates recur in blood and activity. — Fig. 3A–C |
| Evidence diversity | 3 | high | Blood, activity, mortality constrain related observational claims. — Figs. 2–3; Methods: Hazards model |
| Design and controls | 2 | medium | Cohort checks help; clinical selection remains consequential. — Methods: Hazards model; Results: Physiological state fluctuations |
| Statistical support | 2 | medium | Held-out prediction does not validate lifespan extrapolation. — Methods: Hazards model; Fig. 3C |
| Claim–evidence alignment | 2 | high | Phenomenological caveat coexists with absolute-limit framing. — Abstract; Discussion, final paragraphs |
| Reproduction resources | 2 | medium | Methods specified; additional data require author request. — Methods; Data availability |
| Careful-reading yield | 4 | high | Selection and extrapolation materially change headline interpretation. — Results: Physiological state fluctuations; Fig. 3C |

**Novelty comparator**

[Levine (2013), Modeling the rate of senescence](https://doi.org/10.1093/gerona/gls233)

Increment: Temporal resilience adds information beyond a mortality-associated snapshot.

Limit: Comparator abstract reviewed; global priority unverified.

**Easy to miss from the abstract**

- Observation: GEROLONG lacked diagnoses; DOSI thresholds selected the analyzed subgroup. Interpretation: Health classification partly reuses the modeled signal. Boundary: Not independently verified disease-free aging. (Results: Physiological state fluctuations and loss of resilience)
- Observation: Recovery-rate trends are extrapolated beyond observed ages. Interpretation: The proposed ceiling depends on continued trend behavior. Boundary: No observed universal survival limit. (Fig. 3C; Discussion)

**Next falsifiable test:** Prospectively compare recovery models under standardized perturbations, testing age-trend curvature and clinical-selection sensitivity.

**Reading coverage**

- Read: Publisher main-text PDF: abstract, introduction and initial results
- Read: Publisher indexed Results: Physiological state fluctuations and loss of resilience, Fig. 3 caption, Discussion
- Read: Publisher indexed Methods: Complete blood count datasets, Step counts datasets, Hazards model; Data availability
- Read: Levine comparator PubMed abstract
- Not read/tested: Supplementary PDF
- Not read/tested: Peer Review File
- Not read/tested: Reporting Summary
- Not read/tested: Raw data or executable code
- Not read/tested: Full comparator methods

## TBA · Aging Clocks, Entropy, and the Challenge of Age Reversal

Andrei E. Tarkhov, Kirill A. Denisov, Peter O. Fedichev · 2024 · Published research article; Aging Biology, 12 August 2024 · Published article, DOI 10.59368/agingbio.20240031

[Primary source](https://agingcelljournal.org/Archive/Volume2/20240031/)

A metastable-transition model links aging drift, entropy proxies and resilience.

**Diversity descriptors**

- Mechanism: metastable transitions, mean-field theory, configuration entropy
- Scale: human, CpG, population
- Evidence: bulk DNAm, medical records
- Validation: cross-modality, model fit, observational

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 3 | medium | Organizes drift and resilience as coupled aging components. — Theory; Eqs. 5–8; Discussion |
| New capability / observability | 2 | medium | Latent summaries proposed; causal entities remain unidentified. — Figs. 1–4; Eq. 7 |
| Evidence diversity | 3 | high | Methylation and longitudinal diagnoses probe related signatures. — Figs. 1–2; Methods: DNAm and EMRs |
| Design and controls | 2 | medium | Cross-modality agreement leaves alternative generative explanations open. — Results: Aging signatures; Theory |
| Statistical support | 2 | medium | Age-selected features and extrapolation complicate validation. — Methods: PCA of the DNAm data; Fig. 1D |
| Claim–evidence alignment | 1 | medium | Entropy interpretation extends beyond uniquely identified mechanism. — Eq. 7; Discussion: age-reversal predictions |
| Reproduction resources | 2 | medium | Dataset IDs and transformations given; eligibility inconsistency and packaging limit replay. — Materials and Methods |
| Careful-reading yield | 4 | high | Feature selection and entropy assumptions bear central claims. — Methods: PCA; Eq. 2; Results surrounding Eq. 7 |

**Novelty comparator**

[Pyrkov et al. (2021), DOSI resilience analysis](https://doi.org/10.1038/s41467-021-23014-1)

Increment: Adds a proposed microscopic transition account linking drift to resilience.

Limit: Fit compatibility does not establish unique causation.

**Easy to miss from the abstract**

- Observation: Age-correlated CpGs precede PCA; eligibility differs: Methods excludes under-20s, Results specifies over-25s. Interpretation: Age alignment partly reflects selection; exact eligibility needs clarification. Boundary: Cell-composition adjustment unverified. (Methods: PCA of the DNAm data, p. 2; Results: Aging signatures, p. 3)
- Observation: Bulk methylation supplies per-site marginal Shannon entropy. Interpretation: Thermodynamic age additionally assumes rare, approximately independent transitions. Boundary: Not direct measurement of organism-wide thermodynamic entropy. (Methods: Entropy determination, Eq. 2; Eq. 7)

**Next falsifiable test:** Freeze CpGs and loadings; compare longitudinal, cell-type-resolved predictions against alternative drift models.

**Reading coverage**

- Read: Complete main HTML: Materials and Methods, Theory, Results and Discussion, including equations and figure captions
- Read: Published status and conflicts disclosure
- Read: DOSI comparator main sections documented above
- Not read/tested: Separate Supplementary PDF: retrieval failed
- Not read/tested: Raw methylation or UK Biobank records
- Not read/tested: Executable analysis
- Not read/tested: Longitudinal DNAm validation

## DYNAMIC-ENTROPIC · Differential Responses of Dynamic and Entropic Aging Factors to Longevity Interventions

Kristina Perevoshchikova, Peter O. Fedichev · 2024 · Reviewed as bioRxiv preprint v1, posted 28 February 2024; later publication or revision not established · bioRxiv v1, 28 February 2024

[Primary source](https://www.biorxiv.org/content/10.1101/2024.02.25.581928v1)

Methylation reanalysis separates intervention-associated dynamic and entropic signatures.

**Diversity descriptors**

- Mechanism: dynamic instability, configuration entropy, latent decomposition
- Scale: mouse, blood, single cell
- Evidence: bulk DNAm, single-cell DNAm, intervention reanalysis
- Validation: external dataset, caloric restriction, parabiosis

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Extends dynamic–entropic separation to intervention interpretation. — Introduction; Results II.D; Discussion |
| New capability / observability | 2 | medium | Separates intervention-associated molecular summaries in existing datasets. — Figs. 1, 3–4 |
| Evidence diversity | 2 | medium | Bulk, single-cell and intervention evidence remain methylation-centered. — Results II.A–D |
| Design and controls | 2 | medium | External parabiosis and isochronic comparisons; alternatives remain. — Results II.D; Fig. 4 |
| Statistical support | 1 | high | One-sided comparisons and null results do not support equivalence; p = 0.0705 conflicts with significance wording. — Results II.D, p. 5; Fig. 4C discussion |
| Claim–evidence alignment | 1 | high | Null intervention findings do not establish irreversible damage. — Results II.D; Discussion |
| Reproduction resources | 2 | medium | Filters and datasets described; early-access inputs and unread tables limit resource assessment. — Acknowledgements; S.I. Methods A–C |
| Careful-reading yield | 4 | high | Printed statistics and filtering qualify abstract-level claims. — Results II.D; S.I. Methods A–C |

**Novelty comparator**

[Petkovich et al. (2017), mouse methylation clock](https://doi.org/10.1016/j.cmet.2017.03.016)

Increment: Decomposes overlapping clock data into distinct response signatures.

Limit: Prior global demethylation acknowledged; priority unverified.

**Easy to miss from the abstract**

- Observation: Immediate parabiosis p = 0.0705; two-month p = 0.0429, one-sided. Interpretation: Immediate evidence is weaker than the significance wording. Boundary: No reanalysis performed. (Results II.D, p. 5)
- Observation: Age-filtered PCA excludes mice younger than five months. Interpretation: Age structure and developmental exclusions shape extracted factors. Boundary: Unchanged PC2 is not an equivalence result. (S.I. Methods A; Results II.D)

**Next falsifiable test:** Preregister PC2 equivalence margins and cell-composition controls in independent longitudinal intervention cohorts.

**Reading coverage**

- Read: Full nine-page author preprint PDF, v1 date displayed in footer: Results, Discussion and embedded S.I. Methods A–C
- Read: bioRxiv indexed abstract and metadata
- Read: PDF accessed through ResearchHub mirror of author manuscript; title, authors, DOI and version match bioRxiv record
- Read: Search for later versions/publication found no established successor; this is not proof that none exists
- Not read/tested: Separate Supplementary Tables 1–2
- Not read/tested: Raw data
- Not read/tested: Code or executable reproduction
- Not read/tested: Full Petkovich comparator methods
- Not read/tested: Direct bioRxiv full text: retrieval failed

## SHERLOCK · Nucleic acid detection with CRISPR-Cas13a/C2c2

Jonathan S. Gootenberg, Omar O. Abudayyeh, Jeong Wook Lee, Patrick Essletzbichler, Aaron J. Dy, Julia Joung, Vanessa Verdine, Nina Donghia, Nichole M. Daringer, Catherine A. Freije, Cameron Myhrvold, Roby P. Bhattacharyya, Jonathan Livny, Aviv Regev, Eugene V. Koonin, Deborah T. Hung, Pardis C. Sabeti, James J. Collins, Feng Zhang · 2017 · Peer-reviewed Science article; PMC author manuscript · Online 13 April 2017; issue 28 April 2017

[Primary source](https://pmc.ncbi.nlm.nih.gov/articles/PMC5526198/)

Collateral cleavage becomes a programmable diagnostic readout.

**Diversity descriptors**

- Mechanism: RNA-guided collateral cleavage, isothermal amplification
- Scale: molecule, specimen
- Evidence: biochemistry, patient-derived samples, synthetic targets
- Validation: technical replicates, qPCR/ddPCR comparison

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Integrates existing sensing and amplification principles. — Introduction; Fig. 1A |
| New capability / observability | 3 | high | Sensitive DNA/RNA detection and allele discrimination. — Figs. 1–4 |
| Evidence diversity | 3 | high | Biochemical, pathogen and genotype demonstrations. — Figs. 1–4 |
| Design and controls | 3 | medium | Matched targets and established assay comparisons. — Figs. 2H, 3; Results comparing ddPCR/qPCR |
| Statistical support | 2 | high | Small technical-replicate sets limit population inference. — Figs. 1–4 captions: n=2–4 technical replicates |
| Claim–evidence alignment | 3 | medium | Analytical demonstrations are mostly bounded; clinical sensitivity and specificity remain unestablished. — Figs. 2F, 4C–F; Discussion |
| Reproduction resources | Unknown | low | Supplement located but unread; insufficient reviewed evidence to rate resource completeness. — Supplementary Material; declared reading coverage |
| Careful-reading yield | 4 | high | Amplification and specimen provenance change interpretation. — Fig. 1C; Fig. 4E–F |

**Novelty comparator**

[East-Seletsky et al. 2016, RNA detection with C2c2](https://doi.org/10.1038/nature19802)

Increment: Amplification-coupled sensitivity plus diverse diagnostic demonstrations.

Limit: Collateral-RNA detection predates SHERLOCK; priority search is incomplete.

**Easy to miss from the abstract**

- Observation: Cas13a alone reaches approximately 50 fM; amplification enables attomolar detection. Interpretation: Sensitivity belongs to the coupled workflow. Boundary: This is not amplification-free single-molecule detection. (Results introducing SHERLOCK; Fig. 1C)
- Observation: Cancer-mutation experiments use mock cell-free DNA. Interpretation: Low allele fractions are an analytical demonstration. Boundary: They do not establish patient-level cancer diagnostic accuracy. (Results final experiment; Fig. 4C–F)

**Next falsifiable test:** Blind a prospective specimen panel with prespecified thresholds, extraction procedures and clinical sensitivity/specificity.

**Reading coverage**

- Read: Main text and all figure captions through NCBI BioC XML
- Read: Comparator primary PubMed/Nature record
- Not read/tested: Separate supplementary methods PDF: download returned HTML
- Not read/tested: Raw data; independent reproduction

## PASTE · Drag-and-drop genome insertion of large sequences without double-strand DNA cleavage using CRISPR-directed integrases

Matthew T. N. Yarnall, Eleonora I. Ioannidi, Cian Schmitt-Ulms, Rohan N. Krajeski, Justin Lim, Lukas Villiger, Wenyuan Zhou, Kaiyi Jiang, Sofya K. Garushyants, Nathaniel Roberts, Liyang Zhang, Christopher A. Vakulskas, John A. Walker II, Anastasia P. Kadina, Adrianna E. Zepeda, Kevin Holden, Hong Ma, Jun Xie, Guangping Gao, Lander Foquet, Greg Bial, Sara K. Donnelly, Yoshinari Miyata, Daniel R. Radiloff, Jordana M. Henderson, Andrew Ujita, Omar O. Abudayyeh, Jonathan S. Gootenberg · 2023 · Peer-reviewed Nature Biotechnology article; PMC author manuscript · Online 24 November 2022; April 2023 issue, 41:500–512

[Primary source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10257351/)

Prime-editing landing sites recruit integrases for large-cargo insertion.

**Diversity descriptors**

- Mechanism: prime editing, serine integration
- Scale: sequence, cell, mouse liver
- Evidence: junction sequencing, ddPCR, protein expression, metagenomic mining
- Validation: HDR/HITI comparisons, primary cells, in vivo feasibility

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Substantial synthesis of prime editing and integration. — Introduction; Results, PASTE combines CRISPR editing |
| New capability / observability | 3 | high | Large-cargo insertion across several biological settings. — Figs. 1, 6 |
| Evidence diversity | 4 | high | Sequencing, expression, primary-cell and animal evidence. — Figs. 1–6 |
| Design and controls | 3 | high | Matched HDR/HITI and component comparisons. — Figs. 1D, 3 |
| Statistical support | 2 | high | Replicate and sampling units require careful interpretation. — Fig. 6E: n=1; Fig. 6F: liver-region points |
| Claim–evidence alignment | 3 | medium | Mostly bounded proof of concept; sorted-cell denominators and limited settings constrain transfer. — Results: primary cells; Fig. 6; Discussion |
| Reproduction resources | 3 | medium | Detailed methods, deposited reads, plasmids and code. — Methods; Data availability: PRJNA700575; atgRNA_rank |
| Careful-reading yield | 4 | high | Nicking and sample denominators reshape headline claims. — Results opening; Fig. 6F |

**Novelty comparator**

[Anzalone et al., twinPE plus Bxb1 (online 2021; issue 2022)](https://doi.org/10.1038/s41587-021-01133-w)

Increment: Optimized fusion/recruitment, larger tested cargo and expanded delivery settings.

Limit: Prime-editing-enabled integrase insertion already existed; not global priority certification.

**Easy to miss from the abstract**

- Observation: PASTE employs Cas9 nickase and flap repair. Interpretation: It avoids reliance on exposed double-strand-break repair. Boundary: It does not eliminate DNA nicking or all cellular repair. (Results, PASTE combines CRISPR editing; Fig. 1A–D)
- Observation: Fig. 6F points represent different liver regions. Interpretation: Spatial samples are not automatically independent animals. Boundary: Do not interpret the stated n=8 as eight independent mice. (Fig. 6F caption; Methods, In vivo injections of PASTE adenovirus)

**Next falsifiable test:** Replicate across donors using prespecified unsorted-cell denominators and long-read on/off-target integration assessment.

**Reading coverage**

- Read: Main results; selected quantification, off-target, modelling and animal methods
- Read: All main figure captions; data availability; comparator primary record
- Not read/tested: Separate supplementary tables/PDF
- Not read/tested: Raw reads, code execution or plasmid verification

## FANZOR · Programmable RNA-guided DNA endonucleases are widespread in eukaryotes and their viruses

Kaiyi Jiang, Justin Lim, Samantha Sgrizzi, Michael Trinh, Alisan Kayabolen, Natalya Yutin, Weidong Bao, Kazuki Kato, Eugene V. Koonin, Jonathan S. Gootenberg, Omar O. Abudayyeh · 2023 · Peer-reviewed Science Advances article, 9:eadk0171 · Published 27 September 2023

[Primary source](https://pmc.ncbi.nlm.nih.gov/articles/PMC10530073/)

Genome mining connects diverse Fanzors to programmable nuclease activity.

**Diversity descriptors**

- Mechanism: RNA-guided DNA cleavage, transposon association
- Scale: protein, genome, evolutionary lineage
- Evidence: phylogenomics, RNA sequencing, biochemistry, cell editing
- Validation: catalytic mutants, TAM controls, endogenous loci

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Broad evolutionary organization beyond earlier Fanzor characterization. — Discussion first paragraph; Fig. 1 |
| New capability / observability | 3 | high | Expanded catalogue plus programmable-enzyme demonstrations. — Figs. 1–5 |
| Evidence diversity | 4 | high | Sequence, RNA, biochemical and cellular convergence. — Figs. 1–5 |
| Design and controls | 3 | high | Target, TAM and catalytic-mutant controls. — Figs. 2E, 4D, 5E–F |
| Statistical support | 2 | medium | Quantified screens; selected enzymes constrain generalization. — Fig. 1 statistics; Fig. 5C–F; cleavage-assay Methods |
| Claim–evidence alignment | 3 | high | Native transposon function remains explicitly unresolved. — Discussion, association with transposases |
| Reproduction resources | 3 | medium | Detailed methods and named data/material resources. — Methods; Data and materials availability: PRJNA1002369 |
| Careful-reading yield | 4 | high | Inactive examples bound the computational catalogue. — Results, CrFNuc-1; Fig. 1A–B |

**Novelty comparator**

[Saito et al. 2023, Fanzor is a eukaryotic programmable RNA-guided endonuclease](https://doi.org/10.1038/s41586-023-06356-2)

Increment: Broader census, evolutionary analysis and additional biochemical/cellular characterization.

Limit: June 2023 comparator already demonstrated Fanzor programmability; endogenous function remains unresolved.

**Easy to miss from the abstract**

- Observation: 3,655 clustered candidates are mined; only selected enzymes are tested. Interpretation: Catalogue breadth is not equivalent to validated enzyme breadth. Boundary: Activity cannot be assigned to every candidate. (Results first paragraph; Figs. 2–3)
- Observation: CrFNuc-1 forms an RNA complex but shows no detected cleavage. Interpretation: RNA association alone does not establish nuclease activity. Boundary: Failed reconstitution and native inactivity remain alternatives. (Results, fRNA-guided DNA endonucleases are present in diverse eukaryotic genomes, final paragraph)

**Next falsifiable test:** Test native-host Fanzor loss and rescue for transposon persistence, separating nuclease activity from association.

**Reading coverage**

- Read: Main text, figures, computational discovery/phylogeny, biochemical and mammalian-editing methods via BioC
- Read: PMC data/material statement; comparator primary PubMed record
- Not read/tested: Separate supplementary PDFs and tables
- Not read/tested: Raw sequencing, deposited plasmids and native-host functional experiments

## ASAL · Automating the Search for Artificial Life with Foundation Models

Akarsh Kumar, Chris Lu, Louis Kirsch, Yujin Tang, Kenneth O. Stanley, Phillip Isola, David Ha · 2024 · arXiv preprint snapshot · v1, 23 December 2024

[Primary source](https://arxiv.org/html/2412.17799v1)

Foundation-model representations guide simulation searches and visual repertoires.

**Diversity descriptors**

- Mechanism: Foundation-model-guided search, Embedding novelty
- Scale: Simulation rules, Population repertoires
- Evidence: Computational search, Representation ablation
- Validation: Multiple substrates, Finite rollouts

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Transfers foundation-model representations into simulation search. — §§2–3 |
| New capability / observability | 3 | high | Enables prompt search and visual atlases. — §§4.1–4.3; Figs 3–6 |
| Evidence diversity | 2 | high | Five substrates; related computational evidence. — §4, Substrates |
| Design and controls | 2 | high | Representation ablation, largely qualitative comparisons. — §4.5; Fig 8 |
| Statistical support | 2 | medium | CA sweeps repeat initial states; single-target search evaluates one seed, not independent search replicates. — Appendix B.1–B.2; §4.5 |
| Claim–evidence alignment | 2 | high | Finite representation novelty limits open-endedness inference. — §3.2; Appendix B.2 |
| Reproduction resources | 3 | medium | Code link and search hyperparameters supplied. — Code link; Appendices A–B |
| Careful-reading yield | 3 | high | Sampling choices substantially qualify headline claims. — Appendix B.2 |

**Novelty comparator**

[LeniaBreeder / novelty search](https://arxiv.org/html/2406.04235v1)

Increment: Pretrained visual representations, text targets, multiple substrates.

Limit: Priority search is not exhaustive.

**Easy to miss from the abstract**

- Observation: CA scoring samples 32 times over 2,048 steps and 256 initial states. Interpretation: Novelty is finite and representation-dependent. Boundary: It does not establish indefinite biological innovation. (Appendix B.2; §3.2)
- Observation: Lenia search centers on a known organism. Interpretation: Discoveries explore a seeded neighborhood. Boundary: Global substrate coverage is not demonstrated. (§4, Lenia; Appendix A)

**Next falsifiable test:** Test held-out long rollouts with translation-normalized recurrence and independent behavioral descriptors.

**Reading coverage**

- Read: Methods/results assessed
- Read: A–B text and captions accessed
- Not read/tested: Videos, linked code execution, independent replication

## LENIA · Toward Artificial Open-Ended Evolution within Lenia using Quality-Diversity

Maxence Faldor, Antoine Cully · 2024 · arXiv preprint snapshot · v1, 6 June 2024

[Primary source](https://arxiv.org/html/2406.04235v1)

Quality-diversity search evolves repertoires of self-organizing Lenia patterns.

**Diversity descriptors**

- Mechanism: Quality diversity, Learned temporal descriptors
- Scale: Cellular automata, Population repertoires
- Evidence: Computational evolution, Seed replication
- Validation: Fitness comparisons, Corrected rank tests

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Combines established QD with temporal phenotypes. — Related Work; Methods |
| New capability / observability | 3 | high | Learned descriptors expand discoverable Lenia repertoires. — Experiments, Unsupervised Diversity; Fig 4 |
| Evidence diversity | 2 | high | Multiple objectives within one seeded substrate. — Experiments; Methods, Search Space |
| Design and controls | 2 | medium | Compares fitness choices; initialization remains shared. — Experiments; Conclusion |
| Statistical support | 3 | high | Ten seeds, rank tests, multiplicity correction. — Experiments, opening paragraph |
| Claim–evidence alignment | 3 | high | Explicitly disclaims theoretical open-endedness. — Background, Open-Ended Evolution |
| Reproduction resources | 3 | medium | Code provided; genotype and metrics specified. — Methods; Experiments |
| Careful-reading yield | 4 | high | Fitness and invariance caveats alter interpretation. — Methods, Unsupervised Statistical Measures; Conclusion |

**Novelty comparator**

[AURORA / IMGEP exploration](https://doi.org/10.1109/TEVC.2022.3159855)

Increment: Temporal descriptors and fitness-driven, non-goal-directed repertoire evolution.

Limit: Existing QD algorithms remain central.

**Easy to miss from the abstract**

- Observation: Fitness rewards low temporal latent dispersion. Interpretation: Persistent morphology is privileged. Boundary: Periodic motion can be penalized. (Methods, Unsupervised Statistical Measures)
- Observation: Encoder lacks rotation/scale invariance. Interpretation: Transformations can inflate apparent morphological diversity. Boundary: Increasing repertoire diversity need not mean new behavior. (Conclusion)

**Next falsifiable test:** Compare matched budgets using invariant descriptors and alternative starting organisms; measure new behaviors after normalization.

**Reading coverage**

- Read: Methods/results and caveats assessed
- Read: No appendix in this HTML snapshot
- Not read/tested: Linked code execution, independent replication

## SCIAGENTS · SciAgents: Automating scientific discovery through multi-agent intelligent graph reasoning

Alireza Ghafarollahi, Markus J. Buehler · 2024 · arXiv preprint snapshot · v1, 9 September 2024

[Primary source](https://arxiv.org/html/2409.05556v1)

Graph paths and specialized agents structure materials hypothesis generation.

**Diversity descriptors**

- Mechanism: Knowledge-graph path search, Role-based language agents
- Scale: Scientific concepts, Research proposals
- Evidence: Generated case studies, Literature retrieval
- Validation: Internal agent critique, Uncalibrated novelty ratings

| Axis | Ordinal category | Confidence | Rationale and locator |
|---|---:|---|---|
| Conceptual novelty | 2 | medium | Integrates graph paths with role-specialized agents. — §§2.1, 4.2–4.4 |
| New capability / observability | 2 | high | Surfaces candidate connections, not validated mechanisms. — §2.2; §3, future work |
| Evidence diversity | 1 | high | Literature-grounded proposals; no new material measurements. — §§2.1–2.2; §3 |
| Design and controls | 1 | medium | Illustrative workflows lack matched independent benchmarking. — §§2.1–2.2 |
| Statistical support | 1 | medium | Case studies; agent ratings lack calibration. — §2.2; §4.6 |
| Claim–evidence alignment | 2 | medium | Detailed proposal workflow is demonstrated; broad discovery language awaits independent physical validation. — Abstract; §3, future work |
| Reproduction resources | 2 | medium | Methods/code links; full outputs uninspected. — §4; Data and code availability |
| Careful-reading yield | 4 | high | Retrieval limits and forecasts change interpretation. — §4.6; §2.2 |

**Novelty comparator**

[Earlier graph reasoning / AutoGen](https://doi.org/10.1088/2632-2153/ad7228)

Increment: Randomized paths with multi-agent proposal expansion and critique.

Limit: Generated connection is not validated mechanism.

**Easy to miss from the abstract**

- Observation: Novelty tool retrieves three sets of ten abstracts. Interpretation: Novelty depends on retrieval coverage. Boundary: Missing matches do not establish priority. (§4.6)
- Observation: Material gains are forecast outcomes. Interpretation: Detailed proposals remain hypotheses. Boundary: No measured material improvement is demonstrated. (§2.2; §3, future work)

**Next falsifiable test:** Blindly benchmark validated hypotheses against matched-budget single-agent, graph-free, and human baselines.

**Reading coverage**

- Read: Methods/results assessed
- Read: Headings/captions accessible; S1–S7 output bodies absent from HTML extraction
- Not read/tested: Full supplementary output, code execution, independent replication
