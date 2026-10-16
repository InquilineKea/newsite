# Papers as local views

2026-10-16

A curated finite presheaf over scoped paper facts, with literal restriction maps, cross-paper contract screens and a separate copresheaf of fixed artifact availability.

## Formal model and scientific interpretation

**base**: Finite discrete variable space K; contexts are subsets U ⊆ K, with union covers and inclusion arrows. Five topic views group ports for reading; they do not define empirical equivalence.

**eventSheaf**: E(U) = ∏_{k∈U} D_k. Restriction to V⊆U projects an assignment onto V. Compatible complete local assignments merge uniquely in E.

**presheaf**: F(U) contains complete assignments in E(U) satisfying each declared constraint whose full support lies in U. Projection preserves those constraints, so F is a presheaf. Cross-patch constraints can obstruct existence of a glue.

**copresheaf**: I(U) is the set of fixed evidence/contract-definition artifacts with support contained in U. U⊆V gives inclusion I(U)→I(V). This is availability, not artifact generation, empirical confirmation or a cosheaf claim.

**gluing**: Check matching restrictions on overlaps; merge local assignments; then test the joint screen. A fully observed compatible local family can fail to give a section of F on its union. F is separated: uniqueness is inherited from assignments.

**unknown**: null is an unobserved partial record, not a domain value or a mathematical section. Finite completions are hypothetical possibilities, never new evidence. An unresolved packet is not called a certified gluing counterexample.

**sheafification**: For this discrete base, sheafification retains singleton stalk data and can discard cross-variable constraints. It is not a scientifically valid repair button.

## Why restriction is valid

If V is contained in U, every constraint supported in V is also supported in U. Therefore a complete assignment admissible on U restricts to an admissible assignment on V. Literal projection preserves identity and composes. Compatible total assignments have at most one merge because their values fix every coordinate of the union. A cross-patch constraint may reject that unique merge, so existence can fail. These statements concern this explicit finite model; the scientific choice of variables and predicates remains a modeling judgment.

## Factor contexts

- **Representation and schema**: What entities and relations are admitted, and can that vocabulary change?
- **Formal interface and structure**: Which meanings, composition rules or preservation conditions are explicit?
- **Dynamics and observables**: What measured, calculated or designed response is actually represented?
- **Discovery coordination**: Who or what selects the next operation, and through which artifact interface?
- **Evidence and claim scope**: Which parts are constructed, executed, benchmarked or physically tested?

## Recorded bridge screens

| Bridge | Bounded scope | Stronger scope | Complete local gluing counterexample? |
|---|---|---|---|
| Provenance through schema revision | compatible | blocked | Yes, for the selected stronger packet |
| Conditional function under structural transfer | compatible | blocked | Yes, for the selected stronger packet |
| Modal capability without full dynamics | compatible | blocked | Yes, for the selected stronger packet |
| Mechanism maps across scale | compatible | blocked | Yes, for the selected stronger packet |
| Contextual relations for proposal formation | compatible | blocked | Yes, for the selected stronger packet |
| Executed calculations and evidential closure | compatible | blocked | Yes, for the selected stronger packet |
| Partial embodiment with unresolved methods | unresolved | blocked | No certified complete-family example for this packet |
| From representation to tested observable | compatible | blocked | Yes, for the selected stronger packet |

These outcomes are intentionally scoped to curated screens. They are not a benchmark, causal proof or measurement of the truth of an original paper. Stronger claims are explanatory probes, not necessarily claims made by the authors.

### Provenance through schema revision

Papers: COPRESHEAF, SCIENCECLAW

**Bounded target:** A typed comparison of declared schema revisions and artifact-needs coordination; no semantic-preserving runtime transport is certified.

**Stronger target:** A common artifact key or provenance DAG proves that the revised scientific claim remains true.

**Shared interface meanings**

- artifact_id: Immutable identity of a particular input or output artifact
- schema_version: Explicit input and output vocabulary version
- transport_witness: Declared map from a source-schema claim into a target-schema claim

**Requirements**

- Pin input artifacts, schema versions and interpretation before each revision.
- Attach a typed transport witness and residual to each accepted change.
- Check semantic meaning in addition to matching payload keys.

**Gaps**

- The reviewed ScienceClaw key-overlap rule alone does not verify semantic preservation.
- COPRESHEAF formal conditions are not a certificate for the entire implemented artifact workflow.

**Exact constraint support and predicate**

```json
{
  "id": "provenance_revision.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "COPRESHEAF.representation",
    "COPRESHEAF.runtime_certification",
    "SCIENCECLAW.matching_semantics",
    "SCIENCECLAW.organization",
    "provenance_revision.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "provenance_revision.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "COPRESHEAF.representation",
          "value": "schema_revision"
        },
        {
          "op": "eq",
          "key": "SCIENCECLAW.organization",
          "value": "artifact_needs"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "COPRESHEAF.runtime_certification",
          "value": "certified"
        },
        {
          "op": "eq",
          "key": "SCIENCECLAW.matching_semantics",
          "value": "semantic_verified"
        }
      ]
    }
  }
}
```

Locators: COPRESHEAF §2.3; §4.5; §4.7; SCIENCECLAW §2.2.4–2.2.5; §5

### Conditional function under structural transfer

Papers: OLOGS, REPLACE, STIMULUS

**Bounded target:** A typed comparison of the papers’ separately declared preservation conditions; no actual composed cross-paper map is certified.

**Stronger target:** A shared categorical schema proves physical equivalence or transfers every material property.

**Shared interface meanings**

- typed_relation: The chosen relation and its source/target types
- composition_condition: Equalities, admissible queries or model-simulation conditions actually preserved
- response_observable: The selected failure, elasticity or actuator response plus units and loading conditions

**Requirements**

- Name the specific source relation and intended target function.
- Specify commuting equalities or simulation conditions for that chosen mapping.
- Calibrate domain-specific physical laws and test the intended target observable.

**Gaps**

- Protein/social analogy is deliberately simplified.
- Replacement example is in-plane; out-of-plane behavior needs extra solving.
- STIMULUS validates equilibrium angles, not general time-dependent response.

**Exact constraint support and predicate**

```json
{
  "id": "conditional_transfer.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "OLOGS.guarantee",
    "REPLACE.guarantee",
    "REPLACE.test_scope",
    "STIMULUS.guarantee",
    "STIMULUS.test_scope",
    "conditional_transfer.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "conditional_transfer.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "OLOGS.guarantee",
          "value": "formal_conditional"
        },
        {
          "op": "eq",
          "key": "REPLACE.guarantee",
          "value": "formal_conditional"
        },
        {
          "op": "eq",
          "key": "STIMULUS.guarantee",
          "value": "formal_conditional"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "OLOGS.guarantee",
          "value": "formal_conditional"
        },
        {
          "op": "eq",
          "key": "REPLACE.test_scope",
          "value": "full_tensor"
        },
        {
          "op": "eq",
          "key": "STIMULUS.test_scope",
          "value": "transient"
        }
      ]
    }
  }
}
```

Locators: OLOGS Figure4; Tables1–2; REPLACE §2.2; STIMULUS AppendixA; §7 Table3

### Modal capability without full dynamics

Papers: VIBEGEN, PROTAGENTS, SCIENCECLAW

**Bounded target:** A typed inventory of modal descriptors with their distinct information losses; no common dynamical operator is asserted.

**Stronger target:** Matching one modal descriptor recovers the full dynamical operator, cellular function or cross-system physical equivalence.

**Shared interface meanings**

- modal_descriptor: Amplitude profile, natural frequency or frequency-band density; never silently interchange these
- mode_definition: Mode index, normalization, model and boundary conditions
- system_realization: Protein structure or lattice geometry associated with the descriptor

**Requirements**

- Keep descriptor type and units explicit.
- Record ANM, force-field normal-mode or FEM operator assumptions.
- For a requested operator-level claim, measure mode directions, frequencies, couplings and relevant dissipation separately.

**Gaps**

- VibeGen amplitude target discards displacement directions.
- Protein ANM and lattice FEM describe different physical systems and boundary conditions.
- No shared calibrated full-dynamics operator is present in these profiles.

**Exact constraint support and predicate**

```json
{
  "id": "modal_contract.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "PROTAGENTS.response",
    "SCIENCECLAW.descriptor_information",
    "SCIENCECLAW.response",
    "VIBEGEN.descriptor_information",
    "VIBEGEN.response",
    "modal_contract.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "modal_contract.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "VIBEGEN.response",
          "value": "modal_amplitude"
        },
        {
          "op": "eq",
          "key": "PROTAGENTS.response",
          "value": "modal_frequency"
        },
        {
          "op": "eq",
          "key": "SCIENCECLAW.response",
          "value": "modal_frequency"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "VIBEGEN.descriptor_information",
          "value": "full_operator"
        },
        {
          "op": "eq",
          "key": "PROTAGENTS.response",
          "value": "dynamical_mapping"
        },
        {
          "op": "eq",
          "key": "SCIENCECLAW.descriptor_information",
          "value": "full_operator"
        }
      ]
    }
  }
}
```

Locators: VIBEGEN §2 Eqs1–2; §4; PROTAGENTS §4 Natural Vibrational Frequency Calculations; SCIENCECLAW §3.4

### Mechanism maps across scale

Papers: COLLAGEN, SILK

**Bounded target:** A scoped comparison of two simulation-based geometry/failure mechanisms, retaining model-specific lengths.

**Stronger target:** One universal critical length or a whole-tissue toughness law follows from both simulations.

**Shared interface meanings**

- length_scale: Model-defined molecular or crystal length and confinement geometry
- failure_mechanism: Slip, cooperative bond rupture or molecular rupture under stated loading
- rate_and_boundary: Loading rate, hydration, confinement and reference-model assumptions

**Requirements**

- Keep each material’s dimensions and critical-length definitions separate.
- Map the load-sharing mechanism rather than transferring raw fitted values.
- Check rate sensitivity and relevant boundary conditions before numerical transfer.

**Gaps**

- Collagen main reference is hydrated, two-dimensional and cross-link-free.
- Silk forces require rate correction; cited shear moduli are indirect comparisons.

**Exact constraint support and predicate**

```json
{
  "id": "multiscale_failure.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "COLLAGEN.evidence",
    "COLLAGEN.length_context",
    "SILK.evidence",
    "SILK.length_context",
    "multiscale_failure.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "multiscale_failure.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "COLLAGEN.evidence",
          "value": "physics_simulation"
        },
        {
          "op": "eq",
          "key": "SILK.evidence",
          "value": "physics_simulation"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "COLLAGEN.length_context",
          "value": "universal"
        },
        {
          "op": "eq",
          "key": "SILK.length_context",
          "value": "universal"
        }
      ]
    }
  }
}
```

Locators: COLLAGEN Figures2,5; Larger Collagen Fibrils; SILK Figures2–5; Methods Application of boundary conditions

### Contextual relations for proposal formation

Papers: HYPERGRAPH, SCIAGENTS, GRAPHAGENTS

**Bounded target:** A source-linked inventory of representations and proposal status; no causal gluing is asserted.

**Stronger target:** A path connecting concepts identifies a causal interaction or demonstrates a novel working material.

**Shared interface meanings**

- retrieved_relation: Typed relation or n-ary literature event with source identity
- traversal_rule: Path sampling, shared-node rule and exact operational traversal semantics
- hypothesis_claim: Proposal linked to the supporting and limiting text

**Requirements**

- Retain evidence sources and contextual qualifications for each relation.
- Resolve exact versus minimum shared-node traversal ambiguity.
- Test causal or performance claims with independent material measurements or calculations.

**Gaps**

- Graph distance and incidence overlap do not establish mechanism or novelty.
- Abstract-only novelty search cannot establish priority.
- Generated dialogue and LLM judging do not validate material performance.

**Exact constraint support and predicate**

```json
{
  "id": "retrieval_context.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "GRAPHAGENTS.evidence",
    "HYPERGRAPH.relation_semantics",
    "HYPERGRAPH.representation",
    "SCIAGENTS.evidence",
    "SCIAGENTS.performance_status",
    "retrieval_context.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "retrieval_context.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "HYPERGRAPH.representation",
          "value": "hyperedges"
        },
        {
          "op": "eq",
          "key": "SCIAGENTS.evidence",
          "value": "proposal"
        },
        {
          "op": "eq",
          "key": "GRAPHAGENTS.evidence",
          "value": "proposal"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "HYPERGRAPH.relation_semantics",
          "value": "causal_validated"
        },
        {
          "op": "eq",
          "key": "SCIAGENTS.performance_status",
          "value": "physical_tested"
        },
        {
          "op": "eq",
          "key": "GRAPHAGENTS.evidence",
          "value": "physical_experiment"
        }
      ]
    }
  }
}
```

Locators: HYPERGRAPH §4.4; Fig8; SCIAGENTS §4.2; §4.6; GRAPHAGENTS §2.2–2.3

### Executed calculations and evidential closure

Papers: MECHGPT, ATOMAGENTS

**Bounded target:** A comparison of computational execution evidence, keeping solver adequacy and experimental confirmation separate.

**Stronger target:** An agent-run calculation is experimentally confirmed, autonomously general or physically correct merely because it completed.

**Shared interface meanings**

- calculation_spec: Geometry, electronic state or potential, boundary conditions and solver settings
- execution_artifact: Actual script, inputs, logs and numerical outputs
- checked_observable: Energy curve, barrier or toughness estimate with its numerical definition

**Requirements**

- Preserve actual inputs and outputs, not conversational success alone.
- Audit physical-model adequacy separately from code execution.
- Compare the target observable against a suitable numerical baseline and, for experimental claims, measurement.

**Gaps**

- MechGPT printed O2 code uses RKS/PBE/STO-3G; execution alone does not resolve adequacy.
- AtomAgents uses human-authored LAMMPS scripts and task-specific support.
- Neither computational success alone demonstrates physical validation.

**Exact constraint support and predicate**

```json
{
  "id": "executed_calculations.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "ATOMAGENTS.evidence",
    "ATOMAGENTS.validation_kind",
    "MECHGPT.evidence",
    "MECHGPT.validation_kind",
    "executed_calculations.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "executed_calculations.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "MECHGPT.evidence",
          "value": "physics_simulation"
        },
        {
          "op": "eq",
          "key": "ATOMAGENTS.evidence",
          "value": "physics_simulation"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "MECHGPT.validation_kind",
          "value": "experiment"
        },
        {
          "op": "eq",
          "key": "ATOMAGENTS.validation_kind",
          "value": "experiment"
        }
      ]
    }
  }
}
```

Locators: MECHGPT §2.3.3; Table10; ATOMAGENTS §2.1–2.4; §4.1

### Partial embodiment with unresolved methods

Papers: PROTOTYPE, STIMULUS

**Bounded target:** Both printed-mechanics papers supply an explicit formal preservation contract for selected properties; the PROTOTYPE side is currently unread.

**Stronger target:** A fabricated shape reproduces all nanoscale physics or inherits another paper’s validation.

**Shared interface meanings**

- selected_property: Chosen mechanical property reported to survive embodiment
- test_observable: Actually measured quantity and experimental conditions
- method_access: Whether full methods and controls have been reviewed

**Requirements**

- Retrieve PROTOTYPE full methods before assigning its formal preservation rule or dynamics.
- Specify which property is transferred and which experiment tests it.
- Retain low confidence for abstract-only reported physical validation.

**Gaps**

- PROTOTYPE methods, formal constraints, controls and dynamics remain unavailable in the recorded assessment.
- STIMULUS equilibrium-angle evidence does not supply missing PROTOTYPE methods.

**Exact constraint support and predicate**

```json
{
  "id": "partial_embodiment.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "PROTOTYPE.guarantee",
    "PROTOTYPE.response",
    "STIMULUS.guarantee",
    "STIMULUS.test_scope",
    "partial_embodiment.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "partial_embodiment.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "PROTOTYPE.guarantee",
          "value": "formal_conditional"
        },
        {
          "op": "eq",
          "key": "STIMULUS.guarantee",
          "value": "formal_conditional"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "PROTOTYPE.guarantee",
          "value": "formal_conditional"
        },
        {
          "op": "eq",
          "key": "PROTOTYPE.response",
          "value": "dynamical_mapping"
        },
        {
          "op": "eq",
          "key": "STIMULUS.test_scope",
          "value": "transient"
        }
      ]
    }
  }
}
```

Locators: PROTOTYPE Abstract only; STIMULUS §7 Table3; §8

### From representation to tested observable

Papers: MUSIC, FIELDPERCEIVER, CEPHALO

**Bounded target:** A catalog of three distinct encodings, retaining separate output and validation scopes.

**Stronger target:** A rich representation establishes full dynamics, successful reverse transfer or physical validity of generated architectures.

**Shared interface meanings**

- encoding: Hierarchical music, occupancy token or joint image/text representation
- output_type: Composed artifact, loaded field or thresholded terminal damage endpoint
- validation_target: The particular correspondence or held-out prediction that was checked

**Requirements**

- State exactly what the encoding preserves or predicts.
- Keep an instantiated artistic mapping distinct from a quantitative prediction.
- Test reverse transfer, time dependence or generated materials separately if claimed.

**Gaps**

- Music-to-material improvement is future work.
- FieldPerceiver has partial-text coverage and deferred temporal extension.
- Cephalo crack benchmarks reduce dynamics to constructed terminal endpoints.

**Exact constraint support and predicate**

```json
{
  "id": "representation_observable.screen",
  "label": "Declared interface screen for the selected claim scope",
  "support": [
    "CEPHALO.endpoint",
    "CEPHALO.representation",
    "FIELDPERCEIVER.representation",
    "FIELDPERCEIVER.temporal_validation",
    "MUSIC.representation",
    "MUSIC.reverse_transfer",
    "representation_observable.scope"
  ],
  "expr": {
    "op": "if",
    "test": {
      "op": "eq",
      "key": "representation_observable.scope",
      "value": "bounded"
    },
    "then": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "MUSIC.representation",
          "value": "hierarchical_mapping"
        },
        {
          "op": "eq",
          "key": "FIELDPERCEIVER.representation",
          "value": "occupancy_tokens"
        },
        {
          "op": "eq",
          "key": "CEPHALO.representation",
          "value": "multimodal_descriptors"
        }
      ]
    },
    "else": {
      "op": "all",
      "args": [
        {
          "op": "eq",
          "key": "MUSIC.reverse_transfer",
          "value": "demonstrated"
        },
        {
          "op": "eq",
          "key": "FIELDPERCEIVER.temporal_validation",
          "value": "demonstrated"
        },
        {
          "op": "eq",
          "key": "CEPHALO.endpoint",
          "value": "full_operator"
        }
      ]
    }
  }
}
```

Locators: MUSIC Fig3; Fig5; conclusion; FIELDPERCEIVER Introduction; Conclusions snippet; CEPHALO §4.6.2; §6

## Source-scoped paper ports

### Critical lengths in collagen

[Primary source](https://pmc.ncbi.nlm.nih.gov/articles/PMC1567872/) · PNAS 103(33), 12285–12290, published August 2006 · Main methods and results

- **COLLAGEN.representation** = critical_lengths (high confidence). Critical-length ratios organize mechanisms across molecular and fibril scales. Boundary: Atomistically parameterized two-dimensional hydrated fibril reference; critical-length mechanics do not reconstruct living tissue. Source: Results: Critical Molecular Length Scales; Figure 5
- **COLLAGEN.guarantee** = none (high confidence). Analytical scaling laws provide no central formal composition constraint. Boundary: Atomistically parameterized two-dimensional hydrated fibril reference; critical-length mechanics do not reconstruct living tissue. Source: Equations 1–6; Methods
- **COLLAGEN.response** = scalar_response (high confidence). Loading-induced slip propagation and rupture are central analyzed responses. Boundary: Atomistically parameterized two-dimensional hydrated fibril reference; critical-length mechanics do not reconstruct living tissue. Source: Figures 2–4
- **COLLAGEN.organization** = manual (high confidence). The scientist specifies the multiscale analysis and parameter sweeps. Boundary: Atomistically parameterized two-dimensional hydrated fibril reference; critical-length mechanics do not reconstruct living tissue. Source: Methods: Modeling Procedure
- **COLLAGEN.evidence** = physics_simulation (high confidence). Atomistically parameterized mesoscopic simulations test predictions; no new fabrication. Boundary: Atomistically parameterized two-dimensional hydrated fibril reference; critical-length mechanics do not reconstruct living tissue. Source: Methods: Reactive Mesoscopic Model; Figures 2–4
- **COLLAGEN.length_context** = fibril_specific (medium confidence). The characteristic scale belongs to the stated material model and boundary conditions. Boundary: It is not a universal length shared by all tissues or crystals. Source: Figures2,5; Larger Collagen Fibrils

### Weak bonds, strong silk

[Primary source](https://doi.org/10.1038/nmat2704) · Nature Materials 9, 359–367; published online March 14, 2010; author-hosted advance publication PDF · Main methods and results

- **SILK.representation** = confinement_geometry (high confidence). Crystal size and strain distribution explain collective bond performance. Boundary: Nanocrystal models and external comparisons do not constitute new measurements of individual silk nanocrystals. Source: Figures 2–5
- **SILK.guarantee** = none (high confidence). No central formal composition or transport constraint drives this mechanics contribution. Boundary: Nanocrystal models and external comparisons do not constitute new measurements of individual silk nanocrystals. Source: Methods: Continuum theory
- **SILK.response** = scalar_response (high confidence). Bending, pull-out and stick–slip trajectories are central analyzed responses. Boundary: Nanocrystal models and external comparisons do not constitute new measurements of individual silk nanocrystals. Source: Figures 2 and 4
- **SILK.organization** = fixed_pipeline (high confidence). Fixed computational experiments do not reorganize a discovery workflow. Boundary: Nanocrystal models and external comparisons do not constitute new measurements of individual silk nanocrystals. Source: Methods: Molecular dynamics model
- **SILK.evidence** = physics_simulation (high confidence). Molecular dynamics and DFT support mechanics; experiments are external comparisons. Boundary: Nanocrystal models and external comparisons do not constitute new measurements of individual silk nanocrystals. Source: Table 1; Methods
- **SILK.length_context** = crystal_specific (medium confidence). The characteristic scale belongs to the stated material model and boundary conditions. Boundary: It is not a universal length shared by all tissues or crystals. Source: Figures2–5; Methods

### Protein–social network ologs

[Primary source](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0023911) · PLOS ONE 6(9): e23911; published September 8, 2011 · Main methods and results

- **OLOGS.representation** = typed_relations (high confidence). Typed relations replace a solely constituent-based account of functionality. Boundary: Conditions constrain a deliberately simplified analogy; matching diagrams do not establish matching chemistry or physical behavior. Source: Methods; Figure 4
- **OLOGS.guarantee** = formal_conditional (high confidence). Commuting diagrams and fiber products constrain meanings and composition. Boundary: Conditions constrain a deliberately simplified analogy; matching diagrams do not establish matching chemistry or physical behavior. Source: Figure 4; Tables 1–2
- **OLOGS.response** = qualitative_response (high confidence). Failure under extension or noise is analyzed qualitatively. Boundary: Conditions constrain a deliberately simplified analogy; matching diagrams do not establish matching chemistry or physical behavior. Source: Figures 3 and 5
- **OLOGS.organization** = manual (high confidence). Researchers construct representations; no adaptive discovery process is executed. Boundary: Conditions constrain a deliberately simplified analogy; matching diagrams do not establish matching chemistry or physical behavior. Source: Methods; Conclusion
- **OLOGS.evidence** = constructed_example (high confidence). The social case is constructed; prior protein mechanics motivate examples. Boundary: Conditions constrain a deliberately simplified analogy; matching diagrams do not establish matching chemistry or physical behavior. Source: Outline; Results: Analogy

### Categorical 3D prototypes

[Primary source](https://doi.org/10.1088/0957-4484/27/2/024002) · Nanotechnology 27(2): 024002; online November 30, 2015; print January 15, 2016 · Abstract only

- **PROTOTYPE.representation** = partial_embodiment (low confidence). A prototype preserves selected model properties across physical realizations. Boundary: Abstract-only report of selected property transfer and printing; methods, formal preservation and detailed dynamics remain unreviewed. Source: Abstract
- **PROTOTYPE.guarantee** = UNKNOWN (unknown confidence). Formal preservation conditions cannot be rated from the abstract. Boundary: Abstract-only report of selected property transfer and printing; methods, formal preservation and detailed dynamics remain unreviewed. Source: Full text unavailable
- **PROTOTYPE.response** = UNKNOWN (unknown confidence). Detailed temporal or modal targets were not reviewed. Boundary: Abstract-only report of selected property transfer and printing; methods, formal preservation and detailed dynamics remain unreviewed. Source: Full text unavailable
- **PROTOTYPE.organization** = UNKNOWN (unknown confidence). Workflow organization was not described in reviewed material. Boundary: Abstract-only report of selected property transfer and printing; methods, formal preservation and detailed dynamics remain unreviewed. Source: Full text unavailable
- **PROTOTYPE.evidence** = physical_experiment (low confidence). The abstract explicitly reports printing and mechanical experimental validation. Boundary: Abstract-only report of selected property transfer and printing; methods, formal preservation and detailed dynamics remain unreviewed. Source: Abstract; experimental claim not methods-audited

### Self-revising copresheaves

[Primary source](https://arxiv.org/html/2606.01444v2) · arXiv:2606.01444v2, 21 August 2026 · Main methods and results

- **COPRESHEAF.representation** = schema_revision (medium confidence). Accepted symbolic revisions receive post-hoc schema audits. Boundary: Post-hoc schema audits and an admitted product of existing GNM quantities; software lacks full functorial certification and causal uniqueness. Source: §2.5; §4.7
- **COPRESHEAF.guarantee** = formal_conditional (high confidence). Explicit preservation conditions; software lacks full functorial certification. Boundary: Post-hoc schema audits and an admitted product of existing GNM quantities; software lacks full functorial certification and causal uniqueness. Source: §2.3; §4.5
- **COPRESHEAF.response** = modal_amplitude (high confidence). Collective modes enter a normalized fluctuation descriptor; this does not encode the full dynamical operator. Boundary: Post-hoc schema audits and an admitted product of existing GNM quantities; software lacks full functorial certification and causal uniqueness. Source: §2.5; Eq.7
- **COPRESHEAF.organization** = artifact_needs (medium confidence). Artifact needs and mutation coordinate distributed work. Boundary: Post-hoc schema audits and an admitted product of existing GNM quantities; software lacks full functorial certification and causal uniqueness. Schema revision is represented separately; this value does not assert that all workflow coordination is formally certified. Source: §2.6; §4.7
- **COPRESHEAF.evidence** = benchmark (high confidence). Replayable surrogate and public-data checks. Boundary: Post-hoc schema audits and an admitted product of existing GNM quantities; software lacks full functorial certification and causal uniqueness. Source: §4.6–4.7
- **COPRESHEAF.runtime_certification** = not_certified (medium confidence). The paper distinguishes its formal conditions from full software certification. Boundary: Formal conditions alone are not an end-to-end certificate. Source: §2.3; §4.7

### Compositional stimulus–response design

[Primary source](https://arxiv.org/html/2604.26367v2) · Reviewed arXiv:2604.26367v2, 20 August 2026; journal record verified · Main methods and results

- **STIMULUS.representation** = compositional_response (high confidence). Dynamical interfaces connect hierarchy and manufacturing. Boundary: Formal composition is conditional on valid component models; physical validation measures equilibrium angles, n=3–4 per class, not full transients. Source: §2–6
- **STIMULUS.guarantee** = formal_conditional (high confidence). Composition preserves simulation conditions, conditional on valid models. Boundary: Formal composition is conditional on valid component models; physical validation measures equilibrium angles, n=3–4 per class, not full transients. Source: AppendixA; §1
- **STIMULUS.response** = scalar_response (high confidence). The experimentally checked scalar is equilibrium angle. Bending/twisting responses are explicit targets. Boundary: Formal composition is conditional on valid component models; physical validation measures equilibrium angles, n=3–4 per class, not full transients. Source: §7
- **STIMULUS.organization** = fixed_pipeline (high confidence). Fixed modular Grasshopper pipeline. Boundary: Formal composition is conditional on valid component models; physical validation measures equilibrium angles, n=3–4 per class, not full transients. Source: §6
- **STIMULUS.evidence** = physical_experiment (high confidence). Four fabricated actuator classes test central pipeline. Boundary: Formal composition is conditional on valid component models; physical validation measures equilibrium angles, n=3–4 per class, not full transients. Source: §7; Table3
- **STIMULUS.test_scope** = equilibrium (medium confidence). Reported physical comparisons measure equilibrium angles. Boundary: A formal dynamical map does not supply unperformed transient measurements. Source: §7 Table3; §8

### Building-block replacement

[Primary source](https://web.mit.edu/mbuehler/www/papers/ADEM_2012.pdf) · Author final manuscript; MIT-hosted 8-page PDF · Main methods and results

- **REPLACE.representation** = relational_replacement (high confidence). Explicit structure–function relations organize replacement. Boundary: Illustrative in-plane homogenized replacement; out-of-plane mechanics need additional constraints and solving. Source: §1–2
- **REPLACE.guarantee** = formal_conditional (high confidence). Commuting paths and data migration constrain queries. Boundary: Illustrative in-plane homogenized replacement; out-of-plane mechanics need additional constraints and solving. Source: §2; Fig2
- **REPLACE.response** = static (high confidence). Targets static homogenized elastic properties. Boundary: Illustrative in-plane homogenized replacement; out-of-plane mechanics need additional constraints and solving. Source: §2.2
- **REPLACE.organization** = manual (high confidence). No adaptive discovery coordination central. Boundary: Illustrative in-plane homogenized replacement; out-of-plane mechanics need additional constraints and solving. Source: §1–3
- **REPLACE.evidence** = constructed_example (high confidence). Illustrative calculations; no fabricated replacement test. Boundary: Illustrative in-plane homogenized replacement; out-of-plane mechanics need additional constraints and solving. Source: §2.1–2.3
- **REPLACE.test_scope** = in_plane (medium confidence). Worked replacement calculation retains in-plane ABD components. Boundary: Other mechanical components require additional analysis. Source: §2.2

### Proteins and music

[Primary source](https://web.mit.edu/mbuehler/www/papers/Nano_Today_2012.pdf) · Reviewed MIT-hosted accepted manuscript · Main methods and results

- **MUSIC.representation** = hierarchical_mapping (high confidence). Hierarchy and connectivity replace sequence-only encoding. Boundary: Executed composition instantiates a mapping; reverse music-to-material improvement remains proposed. Source: Fig3
- **MUSIC.guarantee** = interface_only (medium confidence). Hierarchical ologs constrain selected correspondences. Boundary: Executed composition instantiates a mapping; reverse music-to-material improvement remains proposed. Source: Fig3
- **MUSIC.response** = temporal_composition (medium confidence). Assembly and temporal music structure are central. Boundary: Executed composition instantiates a mapping; reverse music-to-material improvement remains proposed. Source: Fig2–4
- **MUSIC.organization** = manual (high confidence). No self-organizing discovery process central. Boundary: Executed composition instantiates a mapping; reverse music-to-material improvement remains proposed. Source: Main text
- **MUSIC.evidence** = constructed_example (high confidence). Compositions instantiate mapping; material improvement return loop untested. Boundary: Executed composition instantiates a mapping; reverse music-to-material improvement remains proposed. Source: Spinning melodies
- **MUSIC.reverse_transfer** = future (medium confidence). Music-to-material improvement is proposed as future work. Boundary: Performed musical compositions are not evidence of improved material performance. Source: Fig5; conclusion

### FieldPerceiver

[Primary source](https://www.sciencedirect.com/science/article/abs/pii/S1369702122001316) · Materials Today 57, 9–25; 2022 publisher snapshot accessed 2026-10-15 · Partial main text

- **FIELDPERCEIVER.representation** = occupancy_tokens (medium confidence). Learned relations among supplied building blocks. Boundary: Partial main-text assessment; supplied A/B vocabulary, graphene domain and loaded-field predictions, not demonstrated schema revision or temporal dynamics. Source: Introduction; Building the model snippet
- **FIELDPERCEIVER.guarantee** = UNKNOWN (unknown confidence). No checked composition was established in the partially reviewed text; full guarantee status is unknown. Neural olog language; no checked composition established here. Boundary: Partial main-text assessment; supplied A/B vocabulary, graphene domain and loaded-field predictions, not demonstrated schema revision or temporal dynamics. Source: Introduction; Building the model snippet
- **FIELDPERCEIVER.response** = static (medium confidence). Loaded fields central; temporal extension deferred. Boundary: Partial main-text assessment; supplied A/B vocabulary, graphene domain and loaded-field predictions, not demonstrated schema revision or temporal dynamics. Source: Introduction; Conclusions snippet
- **FIELDPERCEIVER.organization** = fixed_pipeline (medium confidence). Single prescribed predictor. Boundary: Partial main-text assessment; supplied A/B vocabulary, graphene domain and loaded-field predictions, not demonstrated schema revision or temporal dynamics. Source: Introduction
- **FIELDPERCEIVER.evidence** = benchmark (low confidence). MD-grounded predictive comparisons reported; detailed protocol unavailable. Boundary: Partial main-text assessment; supplied A/B vocabulary, graphene domain and loaded-field predictions, not demonstrated schema revision or temporal dynamics. Source: Abstract; Introduction
- **FIELDPERCEIVER.temporal_validation** = future (medium confidence). Time-dependent extension is proposed as future work in the reviewed text. Boundary: Partial text access remains explicit; no full transient validation is inferred. Source: Conclusions snippet

### MechGPT + agents

[Primary source](https://arxiv.org/pdf/2310.19998) · arXiv:2310.19998v1, 30 October 2023; accessed 2026-10-15 · Main methods and results

- **MECHGPT.representation** = knowledge_graph (medium confidence). Explicit relational context augments fixed model representations. Boundary: Executed DFT scans and fits are computational evidence; electronic-state/model adequacy and experimental agreement require separate checks. Source: §2.2
- **MECHGPT.guarantee** = interface_only (medium confidence). Graph/interface structure without transport guarantees. Boundary: Executed DFT scans and fits are computational evidence; electronic-state/model adequacy and experimental agreement require separate checks. Source: §§2.2, 4
- **MECHGPT.response** = static (medium confidence). Energy curves and knowledge tasks; no designed temporal response. Boundary: Executed DFT scans and fits are computational evidence; electronic-state/model adequacy and experimental agreement require separate checks. Source: §2.3.3; Fig 8
- **MECHGPT.organization** = prescribed_agents (medium confidence). Prescribed specialist roles coordinate executable tools. Boundary: Executed DFT scans and fits are computational evidence; electronic-state/model adequacy and experimental agreement require separate checks. Source: §2.3; Tables 8–10
- **MECHGPT.evidence** = physics_simulation (high confidence). Agents execute DFT scan and fit. Boundary: Executed DFT scans and fits are computational evidence; electronic-state/model adequacy and experimental agreement require separate checks. Source: §2.3.3; Table 10
- **MECHGPT.validation_kind** = calculation (medium confidence). Actual computational execution supports the selected numerical example. Boundary: Execution success alone is not physical experimentation. Source: §2.3.3; Table10

### SciAgents

[Primary source](https://arxiv.org/html/2409.05556v1) · arXiv:2409.05556v1, 9 September 2024; accessed 2026-10-15 · Main methods and results

- **SCIAGENTS.representation** = knowledge_graph (medium confidence). Sampled concept relations guide proposals; ontology not autonomously revised. Boundary: Executed proposal-generation and agent review do not test the proposed adaptive materials; abstract retrieval does not establish priority. Source: §§2.1, 4.1–4.3
- **SCIAGENTS.guarantee** = interface_only (medium confidence). Graph paths constrain context, not physical truth. Boundary: Executed proposal-generation and agent review do not test the proposed adaptive materials; abstract retrieval does not establish priority. Source: §4.2
- **SCIAGENTS.response** = UNKNOWN (unknown confidence). Adaptive responses are proposed; no demonstrated response port can be assigned from that claim. Adaptive material behavior proposed, not actually designed or checked. Boundary: Executed proposal-generation and agent review do not test the proposed adaptive materials; abstract retrieval does not establish priority. Source: §2.1; Tables 1–3
- **SCIAGENTS.organization** = prescribed_agents (medium confidence). Adaptive speaker selection operates within prescribed roles; distributed need-driven routing is not established. Boundary: Executed proposal-generation and agent review do not test the proposed adaptive materials; abstract retrieval does not establish priority. Source: §2.2; §4.4
- **SCIAGENTS.evidence** = proposal (high confidence). Executed proposal generation and agent review. Boundary: Executed proposal-generation and agent review do not test the proposed adaptive materials; abstract retrieval does not establish priority. Source: §§2.1–2.2
- **SCIAGENTS.workflow_evidence** = benchmark (high confidence). Executed proposal generation and agent review. Boundary: Workflow execution and review are not physical validation of generated material hypotheses. Source: §§2.1–2.2
- **SCIAGENTS.performance_status** = forecast (medium confidence). Material-property gains are expected outcomes of proposed work. Boundary: A detailed proposal is not a measured material improvement. Source: §2.2; §3 future work

### Cephalo

[Primary source](https://advanced.onlinelibrary.wiley.com/doi/full/10.1002/adfm.202409531) · Advanced Functional Materials 34, 2409531; published 5 September 2024; accessed 2026-10-15 · Main methods and results

- **CEPHALO.representation** = multimodal_descriptors (medium confidence). Joint image/text descriptors with task-specific tuning. Boundary: Endpoint benchmarks depend on pixel thresholds and dataset construction; generated architectures are not physically validated. Source: §4; Fig 1
- **CEPHALO.guarantee** = none (medium confidence). No formal composition guarantee central to evaluated tasks. Boundary: Endpoint benchmarks depend on pixel thresholds and dataset construction; generated architectures are not physically validated. Source: §§4, 6
- **CEPHALO.response** = scalar_response (medium confidence). Dynamic simulations reduced to final damage/initiation endpoints. Boundary: Endpoint benchmarks depend on pixel thresholds and dataset construction; generated architectures are not physically validated. Source: §4.6.2; §6, Predicting Crack Dynamics
- **CEPHALO.organization** = fixed_pipeline (medium confidence). Fixed training and generation pipelines; experts merged. Boundary: Endpoint benchmarks depend on pixel thresholds and dataset construction; generated architectures are not physically validated. Source: §4.2; §6
- **CEPHALO.evidence** = benchmark (high confidence). Held-out MD-derived endpoint benchmarks. Boundary: Endpoint benchmarks depend on pixel thresholds and dataset construction; generated architectures are not physically validated. Source: Figs 31–32; §6
- **CEPHALO.endpoint** = terminal_label (medium confidence). Reviewed benchmarks use constructed terminal damage and initiation endpoints. Boundary: These labels are not a full dynamics operator. Source: §6 Predicting Crack Dynamics

### Hypergraph reasoning

[Primary source](https://arxiv.org/html/2601.04878v1) · arXiv:2601.04878v1, 8 January 2026; accessed 2026-10-15 · Main methods and results

- **HYPERGRAPH.representation** = hyperedges (medium confidence). N-ary events preserve context lost by naive pairwise expansion. Boundary: Literature hyperedge incidence preserves contextual relations; traversal and generated proposals do not establish causal interactions. Source: §§1.4, 2.1
- **HYPERGRAPH.guarantee** = interface_only (high confidence). Schema and hyperedge-intersection constraints implemented. Boundary: Literature hyperedge incidence preserves contextual relations; traversal and generated proposals do not establish causal interactions. Source: §§4.2, 4.4
- **HYPERGRAPH.response** = static (medium confidence). This static port describes knowledge relations, not material state. Knowledge structure, not temporal material behavior. Boundary: Literature hyperedge incidence preserves contextual relations; traversal and generated proposals do not establish causal interactions. Source: §§2.2–2.3
- **HYPERGRAPH.organization** = prescribed_agents (medium confidence). GraphAgent, Engineer and Hypothesizer have prescribed sequence. Boundary: Literature hyperedge incidence preserves contextual relations; traversal and generated proposals do not establish causal interactions. Source: §2.3; Fig 8
- **HYPERGRAPH.evidence** = proposal (high confidence). Corpus analysis and generated dialogues; material tests proposed. Boundary: Literature hyperedge incidence preserves contextual relations; traversal and generated proposals do not establish causal interactions. Source: §2.3
- **HYPERGRAPH.workflow_evidence** = benchmark (high confidence). Corpus analysis and generated dialogues; material tests proposed. Boundary: Workflow execution and review are not physical validation of generated material hypotheses. Source: §2.3
- **HYPERGRAPH.relation_semantics** = literature_context (medium confidence). Hyperedges preserve contextual multi-entity literature relations. Boundary: Incidence is not a causal intervention. Source: §2.3; §4.4

### ProtAgents

[Primary source](https://arxiv.org/html/2402.04268v1) · arXiv:2402.04268v1 (27 January 2024); journal publication verified separately · Main methods and results

- **PROTAGENTS.representation** = supplied_protein_descriptors (high confidence). Tool integration retains supplied protein descriptors. Boundary: Normal modes use ANM, while unfolding properties are learned predictions; neither proves cellular function or general autonomous reliability. Source: §2; §4
- **PROTAGENTS.guarantee** = interface_only (high confidence). Function schemas structure calls; no composition guarantee established. Boundary: Normal modes use ANM, while unfolding properties are learned predictions; neither proves cellular function or general autonomous reliability. Source: §2, Table 1
- **PROTAGENTS.response** = modal_frequency (high confidence). Vibrations and unfolding properties are central analyzed outcomes. Boundary: Normal modes use ANM, while unfolding properties are learned predictions; neither proves cellular function or general autonomous reliability. Source: §2.2–2.3
- **PROTAGENTS.organization** = prescribed_agents (high confidence). Planner, Assistant, Critic and manager have prescribed roles. Boundary: Normal modes use ANM, while unfolding properties are learned predictions; neither proves cellular function or general autonomous reliability. Source: §2, Table 1
- **PROTAGENTS.evidence** = physics_simulation (high confidence). Executed ANM calculations accompany learned property predictions. Boundary: Normal modes use ANM, while unfolding properties are learned predictions; neither proves cellular function or general autonomous reliability. Source: §4 Natural Vibrational Frequency Calculations
- **PROTAGENTS.predicted_unfolding** = benchmark (high confidence). ProteinForceGPT is used only for forward predictions; normal modes use ANM. Boundary: The profile distinguishes a learned forward prediction from executed ANM mode calculations. Source: §4 ProteinForceGPT; Natural Vibrational Frequency Calculations

### AtomAgents

[Primary source](https://arxiv.org/html/2407.10022v1) · arXiv:2407.10022v1 (13 July 2024) · Main methods and results

- **ATOMAGENTS.representation** = alloy_variables (high confidence). Automates established alloy variables and simulation workflows. Boundary: Prepared simulation tools test a bounded alloy system; human-authored scripts and contextual support remain part of the workflow. Source: §2.1–2.4
- **ATOMAGENTS.guarantee** = interface_only (high confidence). Fracture calculation imposes explicit elasticity-theory relations. Boundary: Prepared simulation tools test a bounded alloy system; human-authored scripts and contextual support remain part of the workflow. Source: §4.1
- **ATOMAGENTS.response** = static (high confidence). Transition paths inform static barriers and toughness estimates. Boundary: Prepared simulation tools test a bounded alloy system; human-authored scripts and contextual support remain part of the workflow. Source: §2.3–2.4
- **ATOMAGENTS.organization** = prescribed_agents (high confidence). Planner/Critic and a manager coordinate prescribed roles. Boundary: Prepared simulation tools test a bounded alloy system; human-authored scripts and contextual support remain part of the workflow. Source: §2, Table 1
- **ATOMAGENTS.evidence** = physics_simulation (high confidence). LAMMPS and NEB calculations test alloy hypotheses. Boundary: Prepared simulation tools test a bounded alloy system; human-authored scripts and contextual support remain part of the workflow. Source: §2.1–2.4; §4
- **ATOMAGENTS.validation_kind** = calculation (medium confidence). Actual computational execution supports the selected numerical example. Boundary: Execution success alone is not physical experimentation. Source: §2.1–2.4

### VibeGen

[Primary source](https://arxiv.org/pdf/2502.10173) · arXiv:2502.10173v1 (14 February 2025) · Main methods and results

- **VIBEGEN.representation** = modal_profile (high confidence). Dynamics becomes an inverse-design descriptor alongside sequence and structure. Boundary: First nontrivial mode amplitude discards displacement direction; descriptor agreement does not identify a full dynamical operator. Source: §2, Equations 1–2
- **VIBEGEN.guarantee** = interface_only (high confidence). Coordinate-invariant amplitude descriptor constrains a limited component. Boundary: First nontrivial mode amplitude discards displacement direction; descriptor agreement does not identify a full dynamical operator. Source: §2, Equations 1–2
- **VIBEGEN.response** = modal_amplitude (high confidence). Inverse design targets detailed normal-mode amplitude profiles. Boundary: First nontrivial mode amplitude discards displacement direction; descriptor agreement does not identify a full dynamical operator. Source: §2, Figures 4–7
- **VIBEGEN.organization** = fixed_pipeline (high confidence). Designer and predictor have fixed specialized coordination. Boundary: First nontrivial mode amplitude discards displacement direction; descriptor agreement does not identify a full dynamical operator. Source: §2, Figure 1B
- **VIBEGEN.evidence** = physics_simulation (high confidence). Folded designs undergo force-field normal-mode calculations. Boundary: First nontrivial mode amplitude discards displacement direction; descriptor agreement does not identify a full dynamical operator. Source: §4 Normal mode analysis
- **VIBEGEN.descriptor_information** = amplitude_only (medium confidence). The target retains an amplitude profile for one mode. Boundary: Directions, couplings and dissipation are not determined by that descriptor. Source: §2 Eqs1–2

### ScienceClaw + Infinite

[Primary source](https://arxiv.org/html/2603.14312v1) · arXiv:2603.14312v1 (15 March 2026) · Main methods and results

- **SCIENCECLAW.representation** = typed_artifacts (medium confidence). Cross-domain descriptors and explicit provenance enrich represented relations. Boundary: Typed lineage and nonempty key overlap can support routing; FEM modal checks do not establish fabrication success or semantic validity. Source: §2.2.4; §3.4–3.5
- **SCIENCECLAW.guarantee** = interface_only (high confidence). Typed provenance DAG and gates constrain limited interfaces. Boundary: Typed lineage and nonempty key overlap can support routing; FEM modal checks do not establish fabrication success or semantic validity. Source: §2.2.4–2.2.5; §5
- **SCIENCECLAW.response** = modal_frequency (medium confidence). Ribbed lattice variants target frequency bands and modal density. Boundary: Typed lineage and nonempty key overlap can support routing; FEM modal checks do not establish fabrication success or semantic validity. Source: §3.4
- **SCIENCECLAW.organization** = artifact_needs (high confidence). Open needs and compatible artifacts route distributed work. Boundary: Typed lineage and nonempty key overlap can support routing; FEM modal checks do not establish fabrication success or semantic validity. Source: §2.2.5
- **SCIENCECLAW.evidence** = physics_simulation (high confidence). Resonance candidates receive 3D FEM checks, without fabrication. Boundary: Typed lineage and nonempty key overlap can support routing; FEM modal checks do not establish fabrication success or semantic validity. Source: §3.4
- **SCIENCECLAW.matching_semantics** = key_overlap (medium confidence). The reviewed rule can use overlap of payload keys and input names. Boundary: Syntactic overlap does not prove scientific semantic preservation. Source: §5 Schema-Overlap Matching
- **SCIENCECLAW.descriptor_information** = frequency_band (medium confidence). Lattice design targets frequency bands and modal-density features. Boundary: Those features do not specify a complete common dynamical operator. Source: §3.4

### GraphAgents

[Primary source](https://arxiv.org/html/2602.07491v1) · arXiv:2602.07491v1 (7 February 2026) · Main methods and results

- **GRAPHAGENTS.representation** = literature_graph (high confidence). Explicit literature relations enrich retrieval and ideation. Boundary: Generated hypotheses and LLM judging evaluate candidate merit; graph-path length or judged novelty does not establish materials improvement. Source: §2.1; §4.1
- **GRAPHAGENTS.guarantee** = interface_only (high confidence). Traversal structure lacks scientific composition guarantees. Boundary: Generated hypotheses and LLM judging evaluate candidate merit; graph-path length or judged novelty does not establish materials improvement. Source: §2.2; §4.3
- **GRAPHAGENTS.response** = static (high confidence). This static port describes candidate material requirements, not a completed material test. Static material requirements dominate this assessed contribution. Boundary: Generated hypotheses and LLM judging evaluate candidate merit; graph-path length or judged novelty does not establish materials improvement. Source: §2.1–2.2
- **GRAPHAGENTS.organization** = prescribed_agents (high confidence). Specialized agents execute a prescribed sequential framework. Boundary: Generated hypotheses and LLM judging evaluate candidate merit; graph-path length or judged novelty does not establish materials improvement. Source: §2.1, Figure 1
- **GRAPHAGENTS.evidence** = proposal (high confidence). Candidate merits evaluated through generated hypotheses and LLM judging. Boundary: Generated hypotheses and LLM judging evaluate candidate merit; graph-path length or judged novelty does not establish materials improvement. Source: §2.2–2.3
- **GRAPHAGENTS.workflow_evidence** = benchmark (high confidence). Candidate merits evaluated through generated hypotheses and LLM judging. Boundary: Workflow execution and review are not physical validation of generated material hypotheses. Source: §2.2–2.3

## Verification

Finite-fixture property checks and actual packet regressions; no exhaustive enumeration of the full powerset base and no theorem-prover certification.

```json
{
  "identity": 27,
  "composition": 343,
  "restrictionClosure": 85,
  "covariantAvailability": 27,
  "actualPacketScenarios": 48,
  "validGluingCounterexample": true,
  "otherGlobalSectionsPreserved": true,
  "unknownNotEvidence": true,
  "malformedCoverRegression": true,
  "domainLiteralValidation": true
}
```

Unavailable; no browser QA performed.

## Limits

- Paper ports are curated, lossy scoped projections from the existing pinned readings, not an automatically learned ontology or a complete interpretation of each paper.
- Restriction maps are literal projections and mathematically checked. Cross-paper material/causal translation maps are candidate interfaces, not verified morphisms; bounded passes describe scoped comparisons or inventories.
- A passed Boolean screen verifies consistency of this encoding and contract. It does not validate causality, physical equivalence, universal novelty or an unperformed scientific experiment.
- A blocked packet does not show the papers contradict or that every global section is impossible. It shows this selected packet cannot satisfy the chosen screen.
- The stronger scope often deliberately requests an unsupported extrapolation. It is displayed to reveal missing interfaces, not to attribute that claim to the authors.
- Withholding and overlap-conflict controls are synthetic demonstrations. They never edit source observations or constitute new experiments.
- PROTOTYPE is abstract-only and FieldPerceiver partially read. Unknown interfaces remain null and may require reading before any scientific test.
- All reader, auditor and coordinator contexts share one model family. No independent scientific reproduction or theorem-prover certification was performed.
- No cohomology groups, sheaf Laplacians, learned restriction maps or statistically independent latent factors are computed.

## References

- [Stacks Project: Sheaves, Definition6.7.1 and Example6.7.5](https://stacks.math.columbia.edu/tag/006S): Sheaf matching/gluing condition and product-of-fibers example
- [Stacks Project: Sheafification](https://stacks.math.columbia.edu/tag/007X): Associated sheaf; consequences on the chosen discrete base are explained as this model’s deduction
- [Self-Revising Discovery Systems, reviewed v2](https://arxiv.org/html/2606.01444v2): Scientific inspiration; not a claim that this implementation reproduces that categorical system
