#!/usr/bin/env python3
"""Run a new two-round mixer through a user-supplied JSON agent adapter.
Adapter protocol: argv supplied as a JSON string; receives one JSON request on
stdin; must write ONLY a JSON array on stdout. Each call should start a separate
context. The adapter owns provider authentication, model choice and budget caps.
This tool never reads provider keys or sends papers to an undeclared service.
Example: python scripts/search.py --adapter-json '["python","my_adapter.py"]' --output /tmp/new-run
"""
import argparse,json,subprocess,sys
from pathlib import Path
from replay import validate_candidates,build
ROOT=Path(__file__).resolve().parents[1]
SCHEMA={'candidate':'{id,title,target,lever,sourceIds,sources:[{paperId,locator,use,boundary}],mechanism,hypothesis,experiment,baseline,metric,falsifier,confound,feasibility,round,parentIds,changes}', 'feedback':'{candidateId,critic,scores:{grounding:int0..4,mechanism:int0..4,falsifiability:int0..4,feasibility:int0..4},nicheFit:bool,fatal:bool,feedback,revision}'}
def main():
    p=argparse.ArgumentParser();p.add_argument('--adapter-json',required=True);p.add_argument('--config',type=Path,default=ROOT/'run/config.json');p.add_argument('--output',type=Path,required=True);p.add_argument('--timeout',type=int,default=240);args=p.parse_args()
    argv=json.loads(args.adapter_json)
    if not isinstance(argv,list) or not argv or not all(isinstance(v,str) and v for v in argv):p.error('adapter-json must be a nonempty argv array')
    config=json.loads(args.config.read_text());dest=args.output.resolve()
    if dest.exists() and any(dest.iterdir()):p.error('Use a new empty output directory to preserve existing runs')
    dest.mkdir(parents=True,exist_ok=True);(dest/'config.json').write_text(json.dumps(config,indent=2));call=0
    def invoke(operation,**data):
        nonlocal call
        call+=1
        req={'operation':operation,'config':config,'schema':SCHEMA,'system':'Generate or critique testable research proposals, never empirical results. Mix at least one ALife and one Buehler paper; distinguish borrowed mechanisms from untested transfers. Use supplied evidence; mark uncertainty. No certified novelty or physical validation. Quality is a 0–4 AI opinion per rubric dimension. Return only a JSON array.','instructions':{'generate':'Exactly two distinct candidates for every lever for the specified target; round0 parentIds[]. All fields nonempty; explicit source locators/use/boundary.','critique':'One feedback per candidate with your critic identifier. Give honest separate rubric ratings; nicheFit checks target and lever. fatal flags scientific false premises, not mere uncertainty. Give actionable feedback/revision.','revise':'Exactly one child per supplied elite. Preserve target/lever, round1, newID and parentIds=[elite.id]. Address feedback concretely; changes explains revisions; do not assert improved scores or results.'}[operation],**data}
        (dest/f'request-{call:02d}.json').write_text(json.dumps(req,indent=2))
        try:
            result=subprocess.run(argv,input=json.dumps(req),text=True,capture_output=True,timeout=args.timeout)
        except subprocess.TimeoutExpired:
            raise RuntimeError(f'Adapter call {call} timed out') from None
        except OSError:
            raise RuntimeError(f'Adapter call {call} could not start; check executable permissions and path') from None
        if result.returncode:raise RuntimeError(f'Adapter call {call} failed with exit {result.returncode}; output not exposed')
        records=json.loads(result.stdout)
        if not isinstance(records,list):raise ValueError('Adapter must return a JSON array')
        return records
    candidates=[]
    for target in config['targets']:
        rows=invoke('generate',target=target)
        if len(rows)!=2*len(config['levers']) or any(c['target']!=target or c['round']!=0 for c in rows):raise ValueError('Initial generation did not match niche/round requirements')
        if any(sum(c['lever']==lever for c in rows)!=2 for lever in config['levers']):raise ValueError('Require exactly two candidates per initial cell')
        candidates+=rows;validate_candidates(config,candidates);(dest/f'initial-{target}.json').write_text(json.dumps(rows,indent=2))
    feedback=[]
    def critique(rows,roundname):
        all_e=[]
        for critic in ['evidence','feasibility']:
            ev=invoke('critique',critic=critic,candidates=rows)
            if len(ev)!=len(rows) or any(e['critic']!=critic for e in ev):raise ValueError('Incorrect critic coverage')
            (dest/f'feedback-{roundname}-{critic}.json').write_text(json.dumps(ev,indent=2));all_e+=ev
        return all_e
    feedback+=critique(candidates,'initial');scores,snaps,_=build(config,candidates,feedback)
    elites={a['candidateId'] for a in snaps[0]['archive']};children=[]
    for target in config['targets']:
        parents=[c for c in candidates if c['target']==target and c['id'] in elites]
        if not parents:continue
        rows=invoke('revise',target=target,elites=parents,feedback=[e for e in feedback if e['candidateId'] in {c['id'] for c in parents}])
        expected={c['id'] for c in parents}
        if len(rows)!=len(parents) or {c['parentIds'][0] for c in rows if len(c['parentIds'])==1}!=expected or any(c['round']!=1 for c in rows):raise ValueError('Each elite needs one round1 child')
        children+=rows;validate_candidates(config,candidates+children);(dest/f'revised-{target}.json').write_text(json.dumps(rows,indent=2))
    if children:feedback+=critique(children,'revised')
    candidates+=children;scores,snaps,events=build(config,candidates,feedback)
    result={'config':config,'candidates':candidates,'evaluations':feedback,'scores':scores,'archive':snaps[-1]['archive'],'snapshots':snaps,'events':events,'run':{'method':'Actual adapter-backed model generation, critique and revision','calls':call,'rubricInterpretation':'AI opinion, not validation','proposalsTested':False,'model':'Defined by user adapter; not inferred'}}
    (dest/'results.json').write_text(json.dumps(result,indent=2));print(json.dumps({'result':str(dest/'results.json'),'calls':call,'candidates':len(candidates),'coverage':len(result['archive'])}))
if __name__=='__main__':
    try:main()
    except Exception as e:print(str(e),file=sys.stderr);sys.exit(1)
