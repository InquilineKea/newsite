> **Core thesis:** Do not optimize matter for one scalar property. Discover a computational ecology of matter: diverse modes, carriers, couplings, phases, transport laws, localization regimes, and reconfigurable input-output operators. Use quality-diversity and heterogeneous scientific agents not merely to search this space, but to discover when the current coordinates of the space are inadequate.
<table_of_contents/>
# 1. Central research question
**Can we discover substrates whose native physical dynamics expose a large, controllable repertoire of useful computations?**
Target a Pareto frontier among rigidity, modal biodiversity, localization, transport, controllable coupling, protected decoupling, rotational/torsional modes, gauge phase, carrier diversity, nonlinear resonance, reconfigurability, robustness, addressability, and useful input-output operator diversity.
> **Useful diversity can come from coupling OR from protected decoupling.** A substrate may benefit from many long-lived independent modes plus sparse, precisely selected resonances connecting them.
# 2. Modal biodiversity
For a mechanical lattice:
$$
K\phi_n=\omega_n^2M\phi_n
$$
Treat a mode as a phenotype:
$$
z_n=(\omega_n,P_n,\xi_n,v_{g,n},Q_n,\chi_n,s_n,\tau_n,g_{nmk\ldots})
$$
Relevant axes include frequency, polarization, translation/rotation/torsion, localization, group velocity, lifetime, chirality, symmetry sector, topology, perturbational susceptibility, and pairwise/higher-order coupling.
<table fit-page-width="true" header-row="true">
<tr>
<td>Modal diversity</td>
<td>Coupling</td>
<td>Regime</td>
</tr>
<tr>
<td>Low</td>
<td>Dense</td>
<td>Synchronization / consensus</td>
</tr>
<tr>
<td>High</td>
<td>Dense</td>
<td>Strongly interacting many-body computation</td>
</tr>
<tr>
<td>Low</td>
<td>Sparse</td>
<td>Modular computation</td>
</tr>
<tr>
<td>High</td>
<td>Rare/selective</td>
<td>Protected specialist modes + occasional synthesis</td>
</tr>
</table>
# 3. Spectral doping, defects, marginality
Generalize the steel analogy:
$$
\text{small controlled symmetry violation}\rightarrow\text{new collective response}
$$
Perturbations include mass/stiffness impurities, missing bonds, geometric distortion, chirality defects, correlated disorder, prestress defects, and boundaries.
$$
\eta_{defect}=\frac{\Delta D_{useful\ modes}}{\|\delta L\|}
$$
Andrea Liu's jamming, marginal rigidity, soft-mode, allostery and physical-learning work motivates searching where small structural interventions create large functional changes. The interesting regime may be ordered enough for coherent transport yet disordered enough for rich local modes.
# 4. Tensegrity diversity
$$
\ker R\sim\text{mechanisms / zero modes},\qquad \ker R^T\sim\text{states of self-stress}
$$
Prestress changes the dynamical landscape:
$$
D=D(\sigma_0)
$$
**Hypothesis:** prestress can act as a reprogrammable coupling matrix, switching localization, softness, rotational channels, buckling states, and cross-modal coupling.
# 5. Kagome lattices
Kagome is attractive because geometry can support coexisting flat/dispersive bands, frustration, compact localized modes, crossings, edge phenomena, and unusual transport.
$$
\text{flat/localized modes}\rightarrow\text{memory/resonant niches}
$$
$$
\text{dispersive modes}\rightarrow\text{transport/communication}
$$
Search breathing, chiral, decorated, mechanical, acoustic, photonic and electronic Kagome families.
# 6. Artificial gauge fields and programmable coupling
$$
H=\sum_{\langle ij\rangle}t_{ij}e^{i\phi_{ij}}a_i^\dagger a_j
$$
Both coupling magnitude and phase are design variables. **Physical adjacency need not equal computational adjacency.**
Prefer gauge-invariant loop quantities:
$$
\Phi_\gamma=\sum_{(ij)\in\gamma}\phi_{ij}
$$
Track coupling magnitude diversity, loop-flux diversity, sparsity, modularity, switchability, rare-coupling fraction, and higher-order resonances.
The 2026 dispersionless-coupling work in dense waveguide arrays is conceptually important because effective coupling can be engineered independently of simple proximity. General lesson: **coupling itself can become programmable matter.**
# 7. MXenes and material degrees of freedom
- **Kagome:** architectural geometry/topology
- **MXenes:** constituent/material/surface-chemistry tunability
- **Gauge engineering:** effective coupling amplitude and phase
$$
\text{Kagome}\times\text{MXene}\times\text{prestress}\times\text{defects}\times\text{fields}
$$
# 8. Tensor and interaction diversity
Keep distinct: interaction order, effective tensor rank, symmetry sectors, tensor-network topology, shared-information structure, and coupling-strength ecology.
$$
J_{ij}\sim\{O(1),\epsilon,0,\text{rare event}\}
$$
Rare-event coupling is potentially a computational primitive.
# 9. Carrier biodiversity
Possible carriers include charge, spin, magnons, photons, phonons, excitons, polaritons, valleys, domain walls and skyrmions.
$$
C_{\alpha\beta}(\omega,k,E,F,\ldots)
$$
The goal is selective conversion between representations while preserving useful independent channels.
# 10. Moiré electronic routing
$$
H=H_0+V_{moire}(\mathbf r)+V_{gate}(\mathbf r,t)+H_{strain}+H_{SOC}+\cdots
$$
Possible addresses include position, momentum, spin, valley, layer, orbital/sublattice, band and energy.
$$
\text{wire address}\rightarrow\text{wire + internal-state address}
$$
A future moiré routing layer could use a moiré pattern generator, electronic transport sheet, local gates, internal-state selectors and multiple readouts.
$$
V(\mathbf r)=\sum_\alpha V_\alpha(\mathbf r;\theta_\alpha,\phi_\alpha)
$$
# 11. Spintronics and stateful routing
$$
y_t=H(\omega;m_t)x_t,\qquad m_{t+1}=F(m_t,x_t)
$$
Now routing depends on history. Magnetic textures can hold state; magnons can propagate signals through that stateful landscape.
$$
\text{twist}\rightarrow\text{magnetic interaction landscape}\rightarrow\text{spin texture}\rightarrow\text{carrier/magnon routing}
$$
# 12. Resolvent-centered computational matter
Eigenmodes ask **what can oscillate?** The resolvent asks **given this input and control state, what actually responds, where, and by how much?**
$$
R(\omega)=(-\omega^2M+i\omega C+K)^{-1}
$$
$$
G^R(E)=(E+i0^+-H-\Sigma(E))^{-1}
$$
With input B and readout C:
$$
H_{IO}=CRB
$$
SVD:
$$
H_{IO}=U\Sigma V^\dagger
$$
V gives optimal inputs, U output patterns, singular values accessible/amplified channels. This motivates **resolvent diversity**.
# 13. Spectrum vs resolvent vs pseudospectrum
<table fit-page-width="true" header-row="true">
<tr>
<td>Object</td>
<td>Question</td>
</tr>
<tr>
<td>Spectrum</td>
<td>What intrinsic modes exist?</td>
</tr>
<tr>
<td>Resolvent</td>
<td>Which input-output responses can actually be driven?</td>
</tr>
<tr>
<td>Pseudospectrum</td>
<td>How sensitive are modes/responses to perturbation?</td>
</tr>
</table>
$$
D_{spectrum},\quad D_{resolvent},\quad D_{pseudo}
$$
# 14. Why CPUs/GPUs/ICs fit
Digital electronics intentionally project enormous physical state spaces into small robust logical alphabets:
$$
\mathcal H_{physical}\rightarrow\mathcal H_{logical}
$$
CMOS suppresses unwanted resonance, coupling, analog variability and microscopic carrier detail to gain abstraction and reliability.
> **Digital computing suppresses “more is different” at the device level so that “more is different” can emerge safely at the software level.**
The question is: **which physical degrees of freedom did digital computing correctly abstract away, and which useful ones did it throw away?**
# 15. Substrate-centric compilation
$$
\text{software operation}\rightarrow\text{appropriate physical phenomenon}
$$
A future compiler might choose charge, spin, valley, photon, phonon, magnon, exciton, localized mode, propagating mode, or hybrid quasiparticle.
# 16. Quality-diversity objective
$$
\mathbf D=(D_{geometry},D_{mode},D_{localization},D_{topology},D_{phase},D_{coupling},D_{carrier},D_{transport},D_{resolvent},D_{pseudo},D_{reconfig})
$$
Maintain geometric, modal, topological, gauge/phase, transfer-operator, and learned “interesting physics” archives.
$$
\min d_G(A,B),\ \max d_M(A,B)
$$
finds tiny structural changes with huge modal consequences.
$$
\max d_G(A,B),\ \min d_M(A,B)
$$
finds universality.
# 17. Human-AI QD
Ask humans high-value comparison questions: Which pair differs for a deeper physical reason? Are A and B the same mechanism? Does C require a new category? Which discovery violates an expected tradeoff?
$$
\text{human scientific taste}\rightarrow\text{learned diversity metric}\rightarrow\text{scaled search}
$$
# 18. Wang–Buehler copresheaves and schema growth
The useful abstraction is that the **scientific schema itself can expand**.
$$
I_t:\mathcal S_t\rightarrow\mathbf{Set}
$$
Possible types: Geometry, Hamiltonian/DynamicalMatrix, Spectrum, Mode, LocalizationDescriptor, TopologicalInvariant, GaugeFlux, CouplingTensor, Resolvent, TransportResponse, FabricationRecord, ValidationRecord.
Distinguish **fiber diversity**, **morphism/mechanism diversity**, and **schema diversity**.
If the schema collapses physically distinct phenomena:
$$
\mathcal S_t\rightarrow\mathcal S_{t+1}
$$
The most interesting novelty is residual scientific structure not explainable as another sample in the old vocabulary.
# 19. Descriptor co-evolution
Treat descriptors as provisional. Example:
$$
S_{loc}=\frac{\Delta IPR}{\Delta\sigma}
$$
A descriptor adversary tests independence, predictive value, numerical robustness, higher-fidelity survival and mechanistic plausibility before promotion.
# 20. Agent swarm specializations
- **Kagome morphologist:** breathing, decoration, chirality, geometry
- **Defect engineer:** vacancies, mass/stiffness doping, correlated disorder
- **Gauge-field architect:** complex couplings and loop flux
- **Tensegrity agent:** self-stress, zero modes, buckling
- **Spectral ecologist:** unusual mode populations
- **Mode-identity agent:** rotational/translational/polarization character
- **Localization agent:** IPR, localization length, edge/bulk support
- **Topological physicist:** invariants and protected channels
- **Transport agent:** transmission and directionality
- **Resolvent agent:** addressable input-output channels
- **Pseudospectral agent:** fragility and transient amplification
- **Nonlinear-resonance agent:** higher-order selection rules
- **Carrier-conversion agent:** charge/spin/valley/photon/phonon/magnon interfaces
- **Moiré architect:** twist, gates, layers and minibands
- **Spintronics agent:** persistent magnetic state
- **Fabrication agent:** tolerances and realizability
- **Flat-band skeptic:** artifact detection
- **Topology skeptic:** topology vs ordinary localization
- **Archive cartographer:** empty QD niches
- **Descriptor inventor:** new coordinates
- **Descriptor adversary:** redundancy / fake dimensions
- **Mechanism theorist:** structure → mechanism → phenotype laws
- **Experiment designer:** discriminating tests and fidelity escalation
# 21. Executable swarm loop
**Human scientific taste → heterogeneous agents → candidate designs/interventions → fast physics simulator → QD archives → empty niches/anomalies/tradeoff violations → new hypotheses and descriptors → adversarial tests → higher-fidelity validation → mechanisms/fabrication candidates → human scientific taste.**
Agents must output **designs, calculations, falsifiable hypotheses, or descriptor proposals**, not merely prose.
# 22. First tractable benchmark
Start with a 2D breathing-Kagome spring/beam, photonic coupled-mode, or tight-binding model.
$$
x=\{r_{breathing},k_{ij},m_i,t_{ij},\phi_{ij},\sigma_{ij},\delta r_i,V_i\}
$$
For every candidate compute eigenfrequencies/bands, mode vectors, polarization, IPR, group velocity, loop fluxes, topology where appropriate, Green's function/resolvent, terminal scattering/transmission, robustness, and response to prestress/gates.
**Initial scientific target:** Find the smallest perturbations that create genuinely new classes of modes or robust input-output operators.
# 23. Transfer-operator QD
$$
\mathcal H_x(E,\lambda)=C[E-H_x(\lambda)-\Sigma]^{-1}B
$$
$$
\mathscr R_x=\{\mathcal H_x(E,\lambda):E,\lambda\}
$$
Search for one-to-one routers, arbitrary-ratio splitters, valley/layer demultiplexers, energy-selective routers, persistent-state switches, nonlinear gates, high-rank mixers, localized memory channels, and robust protected channels.
The optimized object becomes **a repertoire of computations**, not a single material property.
# 24. Scientific questions for the swarm
- What predicts high routing diversity?
- When does topology add functionality beyond ordinary localization?
- Does high resolvent rank require particular gauge-flux patterns?
- When does marginality increase reconfigurability without destroying robustness?
- What coupling distributions maximize independent modes plus rare synthesis?
- What is the smallest defect that opens a new computational channel?
- Are there universality classes of modal ecologies?
- Which tradeoffs can gauge fields, topology, prestress, or hybrid carriers break?
- Which descriptors repeatedly fail, forcing schema expansion?
# 25. Intellectual synthesis
**Andrea Liu:** marginality, jamming, soft modes, disorder, allostery, physical learning.
**Markus Buehler / Fiona Wang:** agentic scientific discovery, multiscale materials reasoning, typed scientific schemas and schema transitions.
**Jeff Clune / Joel Lehman / Ken Stanley:** quality-diversity, open-endedness, escaping objective collapse, learned notions of interesting difference.
**Topological/mechanical metamaterials:** protected modes, unusual response, architecture-driven function.
**Condensed matter:** phase diversity, carrier diversity, localization, symmetry sectors, quasiparticles, correlated states.
# 26. Strongest formulation
> **Do not ask for the best material. Ask for the smallest set of structural and control degrees of freedom that generates the largest robust repertoire of qualitatively distinct physical computations, while allowing the ontology of “distinct” to evolve when the system discovers new physics.**
This combines “More Is Different” with open-ended search, quality-diversity, resolvent/control theory, programmable coupling, and agentic science.
# 27. Near-term project sequence
1. Build cheap Kagome / coupled-mode sandbox.
2. Implement physics-grounded descriptor extraction.
3. Run baseline MAP-Elites.
4. Add heterogeneous mutation agents.
5. Add archive cartographer and skeptic agents.
6. Add human similarity judgments / learned diversity.
7. Add descriptor invention and adversarial descriptor tests.
8. Add resolvent/transfer-operator archive.
9. Add synthetic gauge phases.
10. Add disorder/prestress and reconfiguration.
11. Add realistic moiré / electronic transport models.
12. Escalate elites to higher-fidelity simulation.
13. Search the archive for new laws and tradeoff violations.
14. Select a small number of experimentally plausible structures.
<callout icon="🧭" color="blue_bg">
	**North-star metric:** not FLOPs, not number of modes, not dimensionality alone. Measure the **robust, controllable repertoire of independently useful physical transformations per unit area, energy, time, and fabrication complexity**.
</callout>
