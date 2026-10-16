#!/usr/bin/env python3
"""Executed finite scattering fixture and evidence-only communication replay (NumPy)."""
import argparse, hashlib, itertools, json, math
from pathlib import Path
import numpy as np
from check_triangle import triangle, scatter, circulation, make_audit
ROOT=Path(__file__).resolve().parents[1]; RUN=ROOT/'runs/strategic-coupling'; OUT=ROOT/'dist/swarm-lab'
ROLES=['geometry','spectrum','gauge','transport','archive','skeptic']
class QDArchive:
    """Frozen niche definitions, explicit validity/quality and tie-preserving elites."""
    def __init__(self,version):self.version=version;self.elites={};self.rejections=[]
    def offer(self,record):
        if record.get('descriptorVersion')!=self.version:raise ValueError('Explicit migration required for descriptor version change')
        if not record.get('valid') or not isinstance(record.get('quality'),(int,float)) or not math.isfinite(record['quality']):
            self.rejections.append({'id':record.get('id'),'reason':'invalid or unscored; retained for review'});return False
        key=record['niche'];old=self.elites.get(key)
        if old is None or record['quality']>old['quality']+1e-12:self.elites[key]=dict(record);return True
        return False
def dump(path,x):
    path.parent.mkdir(parents=True,exist_ok=True);path.write_text(json.dumps(x,ensure_ascii=False,indent=2,allow_nan=False)+'\n')
def effective_diversity(fingerprints):
    a=np.asarray(fingerprints,float)
    if a.ndim!=2 or not a.size:return {'effectiveRank':0.,'energy':0.}
    a=a-a.mean(axis=0,keepdims=True);s=np.linalg.svd(a,compute_uv=False);energy=float(np.sum(s*s))
    if energy<1e-20:return {'effectiveRank':0.,'energy':energy}
    p=s*s/energy;p=p[p>1e-14]
    return {'effectiveRank':float(np.exp(-np.sum(p*np.log(p)))),'energy':energy,'singularValues':s.tolist(),'scope':'Centered squared-singular-value entropy on these calibrated pair-distance probes; not scientific independence or quality.'}
class Router:
    """Only published distance/evidence envelopes enter this router."""
    ALLOWED={'eventId','candidateIds','owners','delta','rawDistances','normalizedDistances','artifactIds','claim','requestedTest','uncertainty','normalizationVersion'}
    def __init__(self,threshold=.7,voi=.1,cooldown=3,budget=12):
        self.threshold=threshold;self.voi=voi;self.cooldown=cooldown;self.budget=budget;self.clock=0;self.last={};self.exposure={};self.weights={};self.events=[]
    def route(self,packet):
        if set(packet)-self.ALLOWED:raise ValueError('Private/unrecognized fields forbidden in published envelope')
        if len(packet['owners'])!=2 or len(set(packet['owners']))!=2:raise ValueError('Two distinct owners required')
        if not all(r in ROLES for r in packet['owners']):raise ValueError('Unknown owner')
        self.clock+=1;key='|'.join(sorted(packet['owners']));prior=self.weights.get(key,.5);cost=3
        proxy=float(packet['delta'])*prior/(1+cost)
        reason='eligible'
        if not math.isfinite(packet['delta']) or not 0<=packet['delta']<=1:raise ValueError('Invalid discrepancy')
        if packet['delta']<self.threshold:reason='below_threshold'
        elif self.clock-self.last.get(packet['eventId'],-10**9)<=self.cooldown:reason='cooldown'
        elif self.budget<cost:reason='communication_budget'
        elif proxy<self.voi:reason='below_voi_proxy'
        if reason!='eligible':return {'status':'suppressed','reason':reason,'clock':self.clock,'proxy':proxy}
        probe=(len(self.events)+1)%5==0
        extras=[r for r in ROLES if r not in packet['owners']]
        third=min(extras,key=lambda r:(self.exposure.get('|'.join(sorted([packet['owners'][0],r])),0),ROLES.index(r))) if probe else ('gauge' if 'gauge' not in packet['owners'] else 'skeptic')
        members=packet['owners']+[third];self.budget-=cost;self.last[packet['eventId']]=self.clock
        for a,b in itertools.combinations(members,2):
            k='|'.join(sorted([a,b]));self.exposure[k]=self.exposure.get(k,0)+1
        event={'id':'C'+str(len(self.events)+1),'status':'opened','members':members,'packet':packet,'proxy':proxy,'proxyDefinition':'delta × declared prior partner utility / (1 + message cost); heuristic, not Bayesian information gain','communicationCost':cost,'probe':probe,'clock':self.clock,'output':None}
        self.events.append(event);return event
    def close(self,event_id,output):
        e=next(x for x in self.events if x['id']==event_id)
        if e['status']!='opened':raise ValueError('Coalition already closed')
        if output.get('kind') not in ['DescriptorProposal','Hypothesis','Review']:raise ValueError('Expected descriptor, experiment hypothesis or equivalence review')
        if output.get('humanPromotion') or output.get('sharedOntologyPromotion'):raise ValueError('Coalition cannot promote the shared ontology')
        e.update(status='dissolved',output=output);return e
    def update(self,a,b,yield_record):
        if not yield_record.get('reviewArtifactId') or yield_record.get('evidence')!='held_out_measurement':raise ValueError('Self-reported novelty cannot update an edge')
        gain=yield_record.get('gain');cost=yield_record.get('cost')
        if not all(isinstance(v,(int,float)) and math.isfinite(v) and 0<=v<=1 for v in [gain,cost]):raise ValueError('Yield/cost must be normalized finite [0,1]')
        k='|'.join(sorted([a,b]));old=self.weights.get(k,.5);new=float(np.clip(.95*old+.05*.5+.2*(gain-cost),0,1));self.weights[k]=new
        return {'edge':k,'before':old,'after':new,'reviewArtifactId':yield_record['reviewArtifactId']}
def fixture():
    records=[];grid=[-math.pi,-math.pi/2,-math.pi/4,0,math.pi/4,math.pi/2,math.pi]
    train_energies=[-.5,0.,.5];held=[(-.25,1.6),(.25,1.6),(-.25,2.4),(.25,2.4)]
    for index,(phi,detune,gauge) in enumerate(itertools.product(grid,[False,True],[False,True])):
        onsite=[0,.2,-.35] if detune else [0.,0.,0.];h=triangle(phi,onsite=onsite)
        if gauge:
            u=np.diag(np.exp(1j*np.array([.31,-.78,1.19])));h=u@h@u.conj().T
        w,v=np.linalg.eigh(h);ts=[];conditions=[];unit=[]
        for e in train_energies:
            s,t=scatter(h,e,2.);ts.append(t.tolist());conditions.append(float(np.linalg.cond(e*np.eye(3)-h+1j*np.eye(3))));unit.append(float(np.max(np.abs(s.conj().T@s-np.eye(3)))))
        ht=[scatter(h,e,g)[1].tolist() for e,g in held]
        loop=h[1,0]*h[2,1]*h[0,2];res=float(np.max(np.abs(h@v-v*w)))
        records.append({'id':f'X{index:02d}','phi':phi,'detuned':detune,'gaugeCopy':gauge,'onsite':onsite,'hamiltonian':[[[float(z.real),float(z.imag)] for z in row] for row in h],'eigenvalues':w.tolist(),'transport':ts,'heldOutTransport':ht,'circulation':circulation(np.array(ts[1])),'loop':[float(loop.real),float(loop.imag)],'quality':{'eigenResidual':res,'unitarityError':max(unit),'maxCondition':max(conditions),'valid':res<1e-11 and max(unit)<1e-11},'features':{'geometry':[1,1,1]+onsite,'spectrum':w.tolist(),'gauge':[float(loop.real),float(loop.imag)],'transport':np.array(ts).flatten().tolist(),'archive':[float(np.mean([np.trace(t)/3 for t in np.array(ts)])),abs(circulation(np.array(ts[1])))],'skeptic':None}})
    # Exactly 28 candidates; each uses one eigensolve, 3 observed and 4 held-out scattering solves.
    pairs=list(itertools.combinations(range(len(records)),2));scales={};distances={};fingerprints=[]
    # Calibrate on non-gauge-copy candidates; held-out energies/widths never enter scales.
    calibration=[(i,j) for i,j in pairs if not records[i]['gaugeCopy'] and not records[j]['gaugeCopy']]
    for role in ROLES:
        if role=='skeptic':scales[role]=None;distances[role]=None;continue
        def d(i,j):return float(np.linalg.norm(np.array(records[i]['features'][role])-records[j]['features'][role]))
        scale=float(np.quantile([d(i,j) for i,j in calibration],.95));scales[role]=scale
        distances[role]=[min(1.,d(i,j)/scale) if scale>1e-12 else None for i,j in pairs]
        if scale>1e-12:fingerprints.append(distances[role])
    events=[]
    for n,(i,j) in enumerate(pairs):
        # Highest disagreement between a closed spectrum and a driven response.
        ds,dt=distances['spectrum'][n],distances['transport'][n];delta=abs(ds-dt)
        if delta>=.7:
            events.append({'eventId':f'D-{records[i]["id"]}-{records[j]["id"]}','candidateIds':[records[i]['id'],records[j]['id']],'owners':['spectrum','transport'],'delta':delta,'rawDistances':{'spectrum':float(np.linalg.norm(np.array(records[i]['features']['spectrum'])-records[j]['features']['spectrum'])),'transport':float(np.linalg.norm(np.array(records[i]['features']['transport'])-records[j]['features']['transport']))},'normalizedDistances':{'spectrum':ds,'transport':dt},'artifactIds':[records[i]['id']+'-spectrum',records[j]['id']+'-transport'],'claim':'The spectrum and labelled-port response disagree about this pair.','requestedTest':'Test a gauge-invariant loop descriptor and an explicit port/permutation equivalence control.','uncertainty':'Mechanism not established by the distance alone.','normalizationVersion':'q95-no-gauge-training-v1'})
    events.sort(key=lambda x:(-x['delta'],x['eventId']))
    def find(phi,detune=True,gauge=False):return next(x for x in records if abs(x['phi']-phi)<1e-10 and x['detuned']==detune and x['gaugeCopy']==gauge)
    plus,minus=find(math.pi/2),find(-math.pi/2);spot=next(x for x in events if set(x['candidateIds'])=={plus['id'],minus['id']})
    router=Router();opened=router.route(spot)
    output={'kind':'DescriptorProposal','scope':'local-fork-gauge-v1','claim':'Compare an oriented loop product together with declared port labels and onsite convention.','status':'proposed','results':None,'humanPromotion':False}
    router.close(opened['id'],output)
    # Compare routing schedules over exactly the same published event stream. No inference/search is performed here.
    stream=events[:8];arms=[]
    for mode in ['single','broadcast','isolated','event']:
        rt=Router(budget=24);messages=0;decisions=[]
        for e in stream:
            if mode=='single':decisions.append({'status':'single_integrator','members':['integrator']})
            elif mode=='broadcast':messages+=30;decisions.append({'status':'broadcast','members':ROLES})
            elif mode=='isolated':decisions.append({'status':'isolated','members':[]})
            else:
                dec=rt.route(e);decisions.append(dec)
                if dec['status']=='opened':messages+=dec['communicationCost'];rt.close(dec['id'],output)
        exposure=np.array(list(rt.exposure.values()),float);hhi=float(np.sum((exposure/exposure.sum())**2)) if exposure.size else None
        arms.append({'mode':mode,'candidateEvaluations':len(records),'eigensolves':len(records),'scatteringSolves':len(records)*7,'llmTokens':0,'decisions':len(stream),'messages':messages,'triggeredCoalitions':len(rt.events),'coalitionEdgeConcentrationHHI':hhi,'behavioralCoverage':None,'aiSuperiority':None,'scope':'Same fixed measured evidence replay; message counts are protocol units, not inference tokens, and cannot establish discovery gains.'})
    # Separate representation-loss diagnostic, judged against held-out routing, not an arm score.
    def merges(use_flux):
        claims=wrong=0
        for i,j in pairs:
            a,b=records[i],records[j];eq=np.max(np.abs(np.array(a['eigenvalues'])-b['eigenvalues']))<1e-9
            if use_flux:eq=eq and np.linalg.norm(np.array(a['loop'])-b['loop'])<1e-9 and a['onsite']==b['onsite']
            if eq:
                claims+=1
                if np.linalg.norm(np.array(a['heldOutTransport'])-b['heldOutTransport'])>.1:wrong+=1
        return {'predictedEquivalentPairs':claims,'falseMergesAgainstHeldOutFixedPortResponse':wrong,'heldOutThreshold':.1}
    local={}
    for role in ROLES:
        obs=[{'candidateId':r['id'],'representation':role,'values':r['features'][role] if role!='skeptic' else r['quality']} for r in records]
        local[role]={'representationVersion':role+'/1.0','observations':obs,'archive':{'kind':'local descriptor registry','candidateIds':[r['id'] for r in records],'anomalies':[],'quality':'Numerically valid toy responses; not global novelty.'},'schemaFork':{'id':role+'/local-1','base':'matter-zoo/1.0','sharedPromotion':False}}
    # Frozen response archive. Bins are declared diagnostics, not a learned diversity metric.
    matter_qd=QDArchive('circulation-reflection/v1')
    for r in records:
        if not r['quality']['valid']:continue
        c=r['circulation'];reflection=float(np.trace(np.array(r['transport'][1]))/3);key=('negative' if c<-.2 else 'positive' if c>.2 else 'near_reciprocal')+'/'+('low_reflection' if reflection<.3 else 'high_reflection')
        quality=1-reflection
        matter_qd.offer({'id':r['id'],'niche':key,'quality':quality,'valid':r['quality']['valid'],'descriptorVersion':'circulation-reflection/v1'})
    niches={k:{'candidateId':v['id'],'quality':v['quality'],'definition':'1 - mean reflection at E=0; only a declared toy task','descriptorVersion':matter_qd.version} for k,v in matter_qd.elites.items()}
    return {'schemaVersion':'strategic-coupling/1.0','sourceUrl':'https://chatgpt.com/share/6ad197e7-cde4-83e9-8828-7f49bad97836','kind':'executed_physics_fixture_and_deterministic_routing_replay','roles':ROLES,'physics':{'family':'tight_binding','units':'hbar=1, hopping=1','timeConvention':'exp(-i E t)','hamiltonian':'H[target,source], forward phase +phi/3','ports':'W=sqrt(gamma) I; three normalized single channels','resolvent':'G=(E I-H+i gamma I/2)^-1','scattering':'S=I-i gamma G; T[output,input]=abs(S)^2','energies':train_energies,'gamma':2,'heldOutSettings':[{'energy':e,'gamma':g} for e,g in held]},'candidates':records,'calibration':{'version':'q95-no-gauge-training-v1','scales':scales,'pairCount':len(calibration),'formula':'min(1, raw Euclidean distance / frozen calibration q95)','missing':'Skeptic is a quality audit, not a comparable physical metric; its distance is null, not zero.','heldOutLeakage':False},'pairIndices':pairs,'distances':distances,'disagreements':events,'spotlight':{'plus':plus['id'],'minus':minus['id'],'event':spot,'coalition':router.events[0]},'fingerprintDiversity':effective_diversity(fingerprints),'localStates':local,'archives':{'matter':niches,'representation':[{'id':r,'status':'provisional','heldOutUtility':None,'robustness':'gauge invariance checked for physical observables; meta descriptors not independent measurements'} for r in ROLES],'swarm':arms},'representationLoss':{'spectrumOnly':merges(False),'spectrumPlusLoopAndOnsite':merges(True),'scope':'Constructed-pool representation-loss diagnostic with held-out energies/widths. No agent-strategy superiority inference.'},'adaptiveEdges':{'weights':{},'status':'No measured coalition-yield update supplied; neutral priors retained. Update API requires held-out measurement and review artifact.'},'limits':['Three-site coherent scattering toy, not Kagome, chemistry, mechanical stress or hysteresis.','Complex hopping requires an implementation mechanism; no fabrication or experimental validation.','Distinct-onsite opposite flux is separated under gauge plus permutation; time reversal would identify it if included in the quotient.','Symmetric +/-flux triangles are unlabelled reflection copies, although their fixed labelled-port responses differ.','The four-arm table is deterministic routing replay. Token use is zero; behavioral/AI superiority is unmeasured.','Distance fingerprints measure distinctions on these probes. Noise, shared sources and shared models limit any independence interpretation.','First-pass worker context isolation is procedural, not an OS security boundary; H can inspect exported records.','Shared schemas require separate human promotion; local forks coexist.']}
def build():
    OUT.mkdir(parents=True,exist_ok=True);r=fixture();dump(RUN/'run.json',r);dump(OUT/'run.json',r)
    audit=make_audit();dump(RUN/'physics-audit.json',audit);dump(OUT/'physics-audit.json',audit)
    for role,state in r['localStates'].items():
        packet={'worker':role,'scope':'Independent first pass. Do not read peer outputs. Use only this packet.','representation':state,'task':'Identify what your representation preserves and cannot decide; propose one falsifiable next test. Do not infer other views.','limits':r['limits'][:2]}
        dump(RUN/'worker-inputs'/f'{role}.json',packet)
    print(json.dumps({'candidateEvaluations':len(r['candidates']),'scatteringSolves':len(r['candidates'])*7,'physicsChecks':len(audit['checks']),'discrepancies':len(r['disagreements']),'spotlight':r['spotlight']['event']['delta'],'representationLoss':r['representationLoss']},indent=2))
if __name__=='__main__':build()
