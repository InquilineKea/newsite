#!/usr/bin/env python3
"""Preserve the Notion seed and build a proposed, expandable research program."""
import hashlib, json, re, shutil, zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
RUN=ROOT/'runs/matter-zoo'; OUT=ROOT/'dist/matter-zoo'
def write(path,data):
    path.parent.mkdir(parents=True,exist_ok=True)
    path.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
def build():
    source=json.loads((RUN/'source/notion.json').read_text())
    text=source['text'].split('<content>\n',1)[1].rsplit('\n</content>',1)[0]
    sections=[]
    for m in re.finditer(r'^# (\d+)\. ([^\n]+)\n(.*?)(?=^# \d+\. |\Z)',text,re.M|re.S):
        sections.append({'id':'S'+m[1],'number':int(m[1]),'title':m[2],'text':m[3].strip(),'url':source['url']})
    assert len(sections)==27
    source_hash=hashlib.sha256((RUN/'source/notion.json').read_bytes()).hexdigest()
    types=[]
    def typ(id,fields,scope,sections):
        types.append({'id':id,'requiredFields':fields.split(','),'scope':scope,'sourceSections':sections,'status':'proposed'})
    typ('Geometry','positions,connectivity,dimension,boundary,coordinateUnits','Architecture without an assumed physical operator.',[5,7,22])
    typ('Material','constituents,parameterSources,units,uncertainty','Constituent and surface-chemistry parameters need separate evidence.',[7,9])
    typ('Operator','family,basis,units,conventions,boundary,regime,parameterHash','Tagged mechanical K/M/damping, tight-binding Hamiltonian or photonic coupled-mode generator; never an implicit interchangeable matrix.',[2,6,12,22])
    typ('Spectrum','operatorId,solver,eigenvalues,residuals,normalization','Computed spectrum with numerical checks.',[2,13])
    typ('Mode','spectrumId,index,vector,normalization,degeneracyHandling','Mode identities require a basis and a convention for degenerate subspaces.',[2,20])
    typ('LocalizationDescriptor','modeId,definition,coarseGraining,sizeScaling','Localization definition and system-size comparison.',[2,19])
    typ('TopologicalInvariant','operatorId,invariant,assumptions,gapCheck,boundaryControl','Optional and model-specific; absent invariant is unknown.',[5,20,24])
    typ('GaugeFlux','operatorId,orientedLoops,phaseConvention,fluxModulo','Loop observables rather than unqualified edge phases.',[6,22])
    typ('CouplingTensor','operatorId,order,basis,units,selectionRules','Pairwise and higher-order interactions remain distinct.',[8,9])
    typ('Resolvent','operatorId,frequencyGrid,dampingOrSelfEnergy,regularization,conditioning','Response depends on losses, contacts and convention.',[12,13,23])
    typ('TransportResponse','resolventId,inputPorts,outputPorts,portNormalization,observable','Readout and port definition are part of the claim.',[12,23])
    typ('ControlProtocol','candidateId,driveHistory,initialState,amplitude,readoutHistory','History and nonlinear behavior require a specified stateful protocol.',[4,10,11])
    typ('Candidate','geometryId,operatorId,controls,interventions,baselineId','A design is a proposal until calculations or measurements exist.',[3,16,22])
    typ('DescriptorDefinition','formula,units,domain,normalization,robustnessTests,version','Provisional coordinates with adversarial checks before promotion.',[16,17,19])
    typ('Hypothesis','claim,alternatives,discriminatingTest,failureCriterion','Competing explanations and falsifiable outcomes.',[21,24])
    typ('Calculation','candidateId,codeRef,parameters,seed,solver,convergence,outputs','Execution provenance; a planned run has no populated results.',[21,22,27])
    typ('ValidationRecord','targetId,evidenceLevel,controls,outcome,limitations,reviewer','Numerical validity, robustness and physical confirmation are separate.',[19,21,27])
    typ('FabricationRecord','candidateId,process,tolerances,parameterCalibration,measurements','Realizability requires its own record.',[18,20,27])
    typ('SchemaProposal','oldVersion,proposedChange,counterexample,migration,adversarialTests','New vocabulary is proposed without overwriting earlier artifacts.',[18,19])
    edges=[
      ('assemble','Geometry','Operator','Parameter and material model must be explicit.'),
      ('diagonalize','Operator','Spectrum','Solver residuals, units and conventions retained.'),
      ('select_mode','Spectrum','Mode','Record degeneracy treatment.'),
      ('measure_localization','Mode','LocalizationDescriptor','Specify basis, normalization and size dependence.'),
      ('derive_response','Operator','Resolvent','Declare drive convention, losses and regularization.'),
      ('read_ports','Resolvent','TransportResponse','Port sets, normalization and contacts fixed.'),
      ('test','Calculation','ValidationRecord','A failed or inconclusive check remains visible.'),
      ('revise_vocabulary','SchemaProposal','DescriptorDefinition','Only after adversarial review and recorded human decision.')]
    axes=[
      ('geometry','Structural distance','positions/connectivity; quotient out declared symmetries',[16]),
      ('mode','Modal repertoire','frequency/polarization; account for degeneracy and normalization',[2,16]),
      ('localization','Localization','IPR or length with basis, size and mass convention',[2,19]),
      ('topology','Topology','named invariant with assumptions and gap checks',[5,16]),
      ('phase','Gauge / loop phase','oriented loop flux modulo 2π; do not count gauge copies',[6,16]),
      ('coupling','Coupling ecology','magnitude/order/sparsity/selectivity as separate measurements',[8,16]),
      ('carrier','Carrier / conversion','channels actually represented by the selected model',[9,16]),
      ('transport','Transport','terminal transmission with contacts and normalization',[16,22]),
      ('resolvent','Accessible response','singular values under fixed port scaling, damping and frequency grid',[12,16,23]),
      ('pseudo','Sensitivity','declared perturbation norm and physically allowed perturbations',[13,16]),
      ('reconfig','Reconfigurability','response changes over a specified control protocol',[4,11,16])]
    descriptors=[{'id':a,'title':b,'definitionRequirement':c,'sourceSections':d,'status':'provisional','observedValue':None} for a,b,c,d in axes]
    families=[
      {'id':'mechanical','title':'Mechanical Kagome','operator':'K φ = ω² M φ; R(ω) = [K − ω²M + iωD]⁻¹','scope':'Start with linear spring degrees of freedom. Beam rotations, prestress and nonlinear state require explicit extensions.','deferred':['spin/valley conversion','arbitrary complex hopping','hysteresis without a state model']},
      {'id':'tight_binding','title':'Electronic / tight-binding','operator':'G(E) = [E + iη − H − Σ(E)]⁻¹','scope':'Declare Hermiticity, units, filling/observable when relevant, contacts and synthetic gauge implementation.','deferred':['fabricated electronic transport','realistic moiré chemistry','mechanical prestress equivalence']},
      {'id':'photonic','title':'Photonic coupled-mode','operator':'Declare the evolution variable and generator before comparing spectra or transfer maps.','scope':'Keep propagation distance versus time, loss, mode normalization and physical coupling realization explicit.','deferred':['direct mechanical equivalence','broadband realizability','experimental phase control']}]
    hypotheses=[
      ('small_defect','Tiny interventions can open useful new channels.','A near-singularity or changed normalization creates apparent novelty.','Matched perturbation budgets, conditioning, residuals and loss/size sweeps.','Gain disappears under those controls.',[3,22,24]),
      ('rare_coupling','Protected channels plus selective coupling may yield useful repertoire.','A dense or uncoupled baseline performs equally well at equal cost.','Compare sparse, dense and decoupled controls with fixed ports and budgets.','No reproducible repertoire/robustness advantage.',[1,2,8,24]),
      ('prestress','Prestress may reconfigure localization and coupling.','Changes are instability, geometry drift or an incorrect tangent stiffness.','Equilibrium and stability checks, reversible sweeps and matched geometry controls.','Switching fails those checks or only reflects instability.',[4,24]),
      ('topological_value','A protected channel may add function beyond ordinary localization.','Ordinary defect/edge localization explains the same response.','Model-specific invariant, gap and matched-disorder trivial controls.','No distinction survives the matched controls.',[5,20,24]),
      ('accessible_modes','A diverse spectrum may produce a diverse controllable IO repertoire.','The added modes are dark to the selected ports.','Hold port scaling, drive budget and loss fixed; compare singular channels.','Added modes have no accessible channel under the declared task.',[12,13,23]),
      ('new_coordinates','Some distinctions may require new descriptor types.','The coordinate is a redundant transform or numerical artifact.','Held-out predictive value, redundancy, stability and mechanism tests.','Old descriptors explain the distinction or new axis is unstable.',[18,19,24]),
      ('stateful_routing','A persistent internal state may support routing dependent on history.','A memoryless resonance or transient is being called memory.','Matched reset, history reversal, dwell-time and repeated cycle protocols.','Readout is independent of retained state or loses persistence.',[11,23])]
    hypotheses=[{'id':a,'claim':b,'alternative':c,'test':d,'failureCriterion':e,'sourceSections':f,'status':'untested_proposal','results':None} for a,b,c,d,e,f in hypotheses]
    role_outputs={
      'Kagome morphologist':'Geometry + Candidate', 'Defect engineer':'paired Candidate interventions',
      'Gauge-field architect':'Operator + GaugeFlux', 'Tensegrity agent':'equilibrium / self-stress Calculation',
      'Spectral ecologist':'Spectrum + population descriptors', 'Mode-identity agent':'Mode + polarization checks',
      'Localization agent':'LocalizationDescriptor + size controls', 'Topological physicist':'TopologicalInvariant + assumptions',
      'Transport agent':'TransportResponse + contact controls', 'Resolvent agent':'Resolvent + accessible channel Calculation',
      'Pseudospectral agent':'structured sensitivity Calculation', 'Nonlinear-resonance agent':'CouplingTensor + drive protocol',
      'Carrier-conversion agent':'conversion model + calibration needs', 'Moiré architect':'parameterized Operator proposal',
      'Spintronics agent':'ControlProtocol + state update model', 'Fabrication agent':'FabricationRecord / tolerance proposal',
      'Flat-band skeptic':'ValidationRecord / artifact counterexample', 'Topology skeptic':'trivial comparator + ValidationRecord',
      'Archive cartographer':'niche coverage and empty-cell audit', 'Descriptor inventor':'DescriptorDefinition proposal',
      'Descriptor adversary':'redundancy / robustness ValidationRecord', 'Mechanism theorist':'Hypothesis + competing mechanism',
      'Experiment designer':'falsification protocol + fidelity ladder'}
    names=re.findall(r'^- \*\*(.+?):\*\* (.+)$',next(s['text'] for s in sections if s['id']=='S20'),re.M)
    assert len(names)==23
    roles=[{'id':'specialty-'+str(i+1),'title':name,'focus':focus,'deliverable':role_outputs[name],'sourceSections':[20],'registration':'proposed_specialty_not_running_agent'} for i,(name,focus) in enumerate(names)]
    experiments=[
      {'id':'E01','title':'Freeze a breathing-Kagome baseline','family':'mechanical','question':'What is the smallest reproducible model and set of controls?','parameters':['geometry / boundary','mass and stiffness units','breathing ratio','input and output ports'],'baseline':'Undoped lattice under identical boundary and port definitions.','measurements':['eigenpairs + residuals','mode normalization','IPR convention','damped IO singular channels'],'controls':['finite-size sweep','positive-mass and stiffness sanity','rigid-mode / boundary accounting','conditioning and damping sweep'],'failureCriterion':'Numerical checks fail or apparent channel diversity depends on arbitrary scaling.','outputs':['Geometry','Operator','Spectrum','ValidationRecord'],'sourceSections':[2,5,12,22,27]},
      {'id':'E02','title':'One defect, paired comparison','family':'mechanical','question':'Can a small intervention create a reproducible accessible channel?','parameters':['defect location','mass or stiffness change','fixed perturbation norm'],'baseline':'Same E01 geometry and solver; undoped and random matched-budget controls.','measurements':['modal change','localization change','IO response change','perturbation cost'],'controls':['port normalization','conditioning / loss','size scaling','repeat random seeds'],'failureCriterion':'Novelty is a numerical singularity, hidden port change or unstable result.','outputs':['Candidate','Calculation','ValidationRecord'],'sourceSections':[3,16,22,24]},
      {'id':'E03','title':'Selective coupling versus isolation','family':'mechanical','question':'Which regime preserves independent channels while allowing selected transfer?','parameters':['sparse / dense / decoupled designs','equal intervention budget','fixed readout task'],'baseline':'Matched isolated and dense networks.','measurements':['accessible channel count at frozen threshold','crosstalk','robustness','energy / amplitude requirements'],'controls':['same ports and losses','equal search budget','held-out perturbations'],'failureCriterion':'Benefit vanishes on held-out perturbations or fair baselines.','outputs':['Candidate','TransportResponse','ValidationRecord'],'sourceSections':[1,2,8,23,24]},
      {'id':'E04','title':'Gauge-phase branch','family':'tight_binding','question':'Do inequivalent loop fluxes alter robust routing?','parameters':['oriented loop flux','Hermitian hopping convention','contact self-energy'],'baseline':'Zero-flux and gauge-equivalent controls.','measurements':['spectrum','loop flux','terminal response','conditioning'],'controls':['gauge invariance','contact normalization','loss / broadening sweep'],'failureCriterion':'Diversity counts gauge copies or relies on one unphysical contact convention.','outputs':['Operator','GaugeFlux','TransportResponse','ValidationRecord'],'sourceSections':[6,22,23,27]},
      {'id':'E05','title':'Prestress and stateful extension','family':'mechanical','question':'Does a declared state model support reproducible switching or hysteresis?','parameters':['equilibrium state','prestress protocol','tangent stiffness','sweep amplitude / rate'],'baseline':'Unstressed equilibrium and memoryless linear control.','measurements':['stability','forward / reverse response','state persistence','cycle dependence'],'controls':['equilibrium residual','quasi-static rate sweep','dwell/reset controls','numerical convergence'],'failureCriterion':'No stable state model, or apparent hysteresis disappears with convergence.','outputs':['ControlProtocol','Calculation','ValidationRecord'],'sourceSections':[4,11,24,27]}]
    for e in experiments:e.update(status='planned_not_run',results=None)
    task_specs=[
      ('Z01','Freeze model and benchmark contract','Build',[],['constructive computation','code + matrix identities','numerical correctness'],'Executable E01 model; named units/boundary/ports; residual, conditioning and size checks.','Declare which proposed measurements are inapplicable. No topology, memory or validation claim from a static spectrum.'),
      ('Z02','Challenge benchmark assumptions before execution','Challenge',[],['adversarial dimensional analysis','source + counterexample','measurement validity'],'Independent specification audit; alternative explanations; revised acceptance gates.','Distinguish mode diversity from port-accessible response and reject implicit cross-family equivalence.'),
      ('Z03','Propose paired defect interventions','Explore',['Z01','Z02'],['divergent mechanistic search','paired design records','intervention comparability'],'E02 candidate pairs with fixed perturbation cost and matched random controls.','Produce design files and falsifiable predictions; no unrun metrics.'),
      ('Z04','Measure accessible response and equal-budget baselines','Evaluate',['Z01','Z02'],['confirmatory numerical evaluation','held-out perturbations','generalization'],'E01/E03 calculations and loss/port/size sensitivity records.','Freeze ports, quality gates, seeds, compute budget and descriptor versions before comparisons.'),
      ('Z05','Audit descriptors and proposed schema changes','Challenge',['Z03','Z04'],['adversarial descriptor analysis','held-out/redundancy tests','representation adequacy'],'DescriptorProposal or rejection, with counterexample and migration requirements.','New axes require independent tests; never promote from novelty rhetoric.'),
      ('Z06','Synthesize mechanisms and plan fidelity escalation','Synthesize',['Z05'],['integrative formal comparison','artifact lineage + discriminating tests','logical consistency'],'Competing mechanism map, unresolved evidence needs and one higher-fidelity protocol.','Keep failed/null results, family limits and human decision separate from simulation success.')]
    tasks=[{'id':a,'title':b,'role':c,'dependencies':d,'complementarity':{'method':f[0],'evidence':f[1],'assumption':f[2]},'deliverable':g,'boundary':h,'status':'queued_not_started','sourceSections':[19,20,21,22,27],'commonsTaskId':None} for a,b,c,d,f,g,h in task_specs]
    common=['candidateId','operatorId','family','basis','units','boundary','normalization','parameterHash','descriptorVersion','evidenceLevel']
    views=[{'id':name,'keys':common+extra} for name,extra in [('geometry',['geometryId','intervention']),('spectral',['spectrumId','localization']),('coupling',['loopFlux','couplingTensorId']),('response',['ports','lossConvention','responseId']),('validation',['controls','outcome','reviewer'])]]
    roadmap=next(s['text'] for s in sections if s['id']=='S27')
    stages=[{'id':'P'+m[1],'title':m[2],'status':'planned'} for m in re.finditer(r'^(\d+)\. (.+)$',roadmap,re.M)]
    assert len(stages)==14
    data={'schemaVersion':'matter-zoo/1.0','title':'Computational Matter Zoo','state':'imported_research_program_no_new_simulations','source':{'url':source['url'],'title':source['title'],'lastEditedAt':source['page_last_edited_at'],'snapshotSha256':source_hash,'verification':source.get('verification'),'coverage':'All 27 numbered sections preserved; linked claims and named 2026 work not independently verified in this import.'},'thesis':'Discover a robust, controllable repertoire of physical computations; preserve selective coupling and protected decoupling as competing design directions.','northStar':'Robust, controllable repertoire per area, energy, time and fabrication complexity; a proposed vector of measures, not a calibrated scalar.','sections':sections,'types':types,'morphisms':[{'id':a,'from':b,'to':c,'contract':d,'status':'proposed_pipeline_not_verified_morphism'} for a,b,c,d in edges],'families':families,'descriptors':descriptors,'hypotheses':hypotheses,'specialties':roles,'experiments':experiments,'tasks':tasks,'roadmap':stages,'localViews':views,'schemaEvolution':{'version':'1.0','path':['propose counterexample','check existing vocabulary','test new descriptor on held-out cases','review numerical and mechanistic robustness','record human decision','version schema and migrate explicitly'],'promotion':'No automatic promotion; submitted artifacts remain pending review.','distinctions':['fiber: new candidate under existing types','mechanism: proposed new typed relationship','schema: new type or observable requiring a migration']},'limitations':['This is a faithful source import plus explicitly proposed implementation contracts. It contains no new physics results.','The graph is a proposed scientific schema, not a category with proved composition laws or a verified functor.','Local-view restriction is literal field projection; matching metadata does not certify a scientific translation.','Specialty labels do not establish orthogonal reasoning; require method/evidence/assumption declarations and disclose shared models, tools and data.','The static explorer prepares packets and downloads; Agent Commons coordinates durable tasks. It does not launch runtimes.','C in the source denotes damping and readout in different equations; the mechanical template uses D for damping and C_out for readout.']}
    mapping=RUN/'commons-tasks.json'
    if mapping.exists():
        ids=json.loads(mapping.read_text())
        for t in tasks:t['commonsTaskId']=ids.get(t['id'])
    write(RUN/'program.json',data);write(OUT/'program.json',data)
    shutil.copyfile(RUN/'source/notion.json',OUT/'notion-source.json')
    (OUT/'source.md').write_text(text+'\n')
    report=['# Computational Matter Zoo','',data['thesis'],'','Source: '+source['url'],'','All 27 source sections are preserved. Experiment plans and extension contracts are proposals; no simulations were run.','','## Expansion contracts']
    for t in tasks:report+=['',f"### {t['id']}: {t['title']} ({t['role']})",'',t['deliverable'],'',t['boundary'],'','Dependencies: '+(', '.join(t['dependencies']) or 'none')]
    report+=['','## Boundaries','']+['- '+x for x in data['limitations']]
    (OUT/'report.md').write_text('\n'.join(report)+'\n')
    if (OUT/'extension.schema.json').exists():
        with zipfile.ZipFile(OUT/'matter-zoo-bundle.zip','w',zipfile.ZIP_DEFLATED) as z:
            z.write(ROOT/'dist/style.css','dist/style.css')
            for p in sorted(OUT.iterdir()):
                if p.is_file() and p.suffix!='.zip':z.write(p,'dist/matter-zoo/'+p.name)
            for p in sorted(RUN.rglob('*')):
                if p.is_file():z.write(p,str(p.relative_to(ROOT)))
            for name in ['build_matter_zoo.py','zoo_expand.py','test_matter_zoo.mjs']:
                p=ROOT/'scripts'/name
                if p.exists():z.write(p,'scripts/'+name)
    print(f"Preserved {len(sections)} sections; {len(types)} types, {len(roles)} specialties, {len(experiments)} planned experiments, {len(tasks)} expansion tasks.")
if __name__=='__main__':build()
