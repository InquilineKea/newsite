#!/usr/bin/env python3
"""Run a real JSON agent adapter with isolated views and a bounded evidence router.

The adapter owns its provider credentials and must enforce request token limits.
This runs a communication experiment on cached physics evidence, not an adaptive
materials search. Python 3 + NumPy. No submitted code is evaluated.
"""
import argparse, hashlib, json, os, subprocess
from pathlib import Path
from swarm_lab import ROLES, Router, dump, ROOT
ARM_MODES=['single','broadcast','isolated','event']
def canonical(x):return json.dumps(x,ensure_ascii=False,sort_keys=True,allow_nan=False)
class Runtime:
    def __init__(self,run,adapter,out,arm='event',token_cap=48000,call_cap=4000):
        if arm not in ARM_MODES:raise ValueError('Unknown arm')
        if not adapter or not all(isinstance(s,str) for s in adapter):raise ValueError('Adapter must be a nonempty argv array')
        self.run=run;self.adapter=adapter;self.out=out;self.arm=arm;self.token_cap=token_cap;self.call_cap=call_cap;self.used=0;self.calls=[];self.private={};self.public={};self.router=Router();self.out.mkdir(parents=True,exist_ok=False)
    def view(self,worker):
        ids=set(self.run['spotlight']['event']['candidateIds'])
        def scoped(role):
            s=self.run['localStates'][role]
            return {'representationVersion':s['representationVersion'],'observations':[x for x in s['observations'] if x['candidateId'] in ids],'schemaFork':s['schemaFork'],'scope':'Relevant pair only. Full local archives remain on disk, not in every inference packet.'}
        return {r:scoped(r) for r in ROLES} if worker=='integrator' else scoped(worker)
    def call(self,worker,phase,packet):
        if self.used+self.call_cap>self.token_cap:raise ValueError('Insufficient remaining token reservation')
        request={'schemaVersion':'swarm-adapter/1.0','worker':worker,'phase':phase,'maxTotalTokens':self.call_cap,'instructions':'Use only this packet. Return JSON with published {kind, claim, candidateIds, uncertainty, requestedTest}, private {hypothesis, localRanking, schemaFork}, usage {total_tokens}. kind must be DescriptorProposal, Hypothesis or Review. All new scientific claims are proposals; do not claim unseen calculations or experimental validation. Never emit raw private transcripts in published.','packet':packet}
        p=subprocess.run(self.adapter,input=canonical(request),capture_output=True,text=True,timeout=180)
        if p.returncode:raise ValueError('Adapter failed; stderr retained locally: '+p.stderr[:500])
        if len(p.stdout)>100000:raise ValueError('Adapter response exceeds packet limit')
        reply=json.loads(p.stdout);usage=reply.get('usage',{}).get('total_tokens')
        if not isinstance(usage,int) or isinstance(usage,bool) or usage<0:raise ValueError('Adapter must report actual nonnegative integer total_tokens')
        self.used+=usage;self.calls.append({'worker':worker,'phase':phase,'tokens':usage})
        dump(self.out/'ledger.json',{'calls':self.calls,'tokens':self.used,'cap':self.token_cap,'callCap':self.call_cap,'budgetViolation':usage>self.call_cap or self.used>self.token_cap})
        if usage>self.call_cap or self.used>self.token_cap:raise ValueError('Adapter exceeded reserved budget; run invalid, no superiority comparison')
        pub=reply.get('published',{});allowed={'kind','claim','candidateIds','uncertainty','requestedTest'}
        if set(pub)!=allowed or pub.get('kind') not in ['DescriptorProposal','Hypothesis','Review']:raise ValueError('Published output must match allowlisted evidence/proposal envelope')
        if not isinstance(pub['claim'],str) or len(pub['claim'])>400 or len(canonical(pub))>1000:raise ValueError('Bound the published evidence packet')
        if not isinstance(pub['candidateIds'],list) or any(c not in {x['id'] for x in self.run['candidates']} for c in pub['candidateIds']):raise ValueError('Unknown candidate')
        if len(canonical(reply.get('private',{})))>2000:raise ValueError('Compress private state to a bounded summary; full local archives remain on disk')
        # The router never receives this private object.
        self.private[worker]=reply.get('private',{});dump(self.out/'private'/worker/(phase+'.json'),reply)
        return pub
    def run_protocol(self):
        initial={};commitments={};sequence=ROLES if self.arm!='single' else ['integrator']*6
        # Barrier: no first-pass publication is exposed to another worker yet.
        for n,worker in enumerate(sequence):
            view=self.view(worker)
            initial_key=worker if self.arm!='single' else 'integrator-'+str(n)
            pub=self.call(worker,'local-'+str(n),{'view':view,'ownPrivateState':self.private.get(worker,{}),'peerEvidence':[]})
            initial[initial_key]=pub;salt=os.urandom(32).hex();body=canonical(pub);commitments[initial_key]={'sha256':hashlib.sha256((salt+'\n'+body).encode()).hexdigest(),'nonce':salt,'canonicalPublished':body}
        dump(self.out/'commitments.json',commitments);dump(self.out/'published-first-passes.json',initial)
        self.public=initial
        event=None
        if self.arm=='event':
            event=self.router.route(self.run['spotlight']['event'])
            if event['status']!='opened':raise ValueError('Spotlight event did not pass declared gates')
        for n,worker in enumerate(sequence):
            peers=[];coalition=None
            if self.arm=='broadcast':peers=[v for k,v in initial.items() if k!=worker]
            if event and worker in event['members']:
                peers=[initial[k] for k in event['members'] if k!=worker]
                measured=[{'id':x['id'],'onsite':x['onsite'],'eigenvalues':x['eigenvalues'],'loop':x['loop'],'T_at_E0':x['transport'][1],'quality':x['quality']} for x in self.run['candidates'] if x['id'] in event['packet']['candidateIds']]
                coalition={'event':event['packet'],'measuredEvidence':measured,'budget':'one bounded followup per member; return descriptor, experiment hypothesis or equivalence review'}
            pub=self.call(worker,'followup-'+str(n),{'view':self.view(worker),'ownPrivateState':self.private.get(worker,{}),'peerEvidence':peers,'coalition':coalition})
            dump(self.out/'published'/f'{worker}-{n}.json',pub)
        if event:self.router.close(event['id'],{'kind':'Review','claim':'Three bounded followups returned; see individual proposed outputs. Scientific review pending.','humanPromotion':False})
        result={'schemaVersion':'swarm-runtime-run/1.0','mode':self.arm,'status':'executed_adapter_calls','calls':len(self.calls),'tokens':self.used,'tokenCap':self.token_cap,'solverEvidence':{'candidateEvaluationsCharged':len(self.run['candidates']),'scatteringSolvesCharged':len(self.run['candidates'])*7,'newSolverCalls':0,'cachePolicy':'All arms charged the identical precomputed fixture. No adaptive discovery performed.'},'coalitions':self.router.events,'sharedOntologyPromoted':False,'superiority':None}
        dump(self.out/'summary.json',result);return result
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('--adapter-json',required=True);p.add_argument('--arm',choices=ARM_MODES,default='event');p.add_argument('--run',type=Path,default=ROOT/'runs/strategic-coupling/run.json');p.add_argument('--output',type=Path,required=True);p.add_argument('--token-cap',type=int,default=48000);p.add_argument('--call-cap',type=int,default=4000);a=p.parse_args()
    try:print(json.dumps(Runtime(json.loads(a.run.read_text()),json.loads(a.adapter_json),a.output,a.arm,a.token_cap,a.call_cap).run_protocol(),indent=2))
    except (ValueError,OSError,subprocess.SubprocessError) as e:p.exit(1,str(e)+'\n')
