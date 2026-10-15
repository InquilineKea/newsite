#!/usr/bin/env python3
"""Replay an inspectable QDAIF-inspired run from actual recorded AI outputs.
The script does not synthesize ratings or invoke a model. Add records generated
by a real agent, then run this file. Generation/critique prompts are documented.
"""
import argparse,csv,hashlib,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def load(path):return json.loads(path.read_text())
def validate_candidates(config,candidates):
    papers={p['id']:p for p in config['papers']};seen=set()
    for c in candidates:
        assert c['id'] not in seen,'Duplicate candidate ID';seen.add(c['id'])
        assert c['target'] in config['targets'] and c['lever'] in config['levers']
        assert c['round'] in [0,1] and isinstance(c['parentIds'],list)
        for key in ['title','mechanism','hypothesis','experiment','baseline','metric','falsifier','confound','feasibility']:
            assert isinstance(c.get(key),str) and c[key].strip(),(c['id'],key)
        requirements=config.get('sourceRequirements',{'minimumDistinctPapers':2,'requiredFamilies':['alife','buehler']})
        assert len(set(c['sourceIds']))>=requirements.get('minimumDistinctPapers',2)
        assert set(c['sourceIds'])<=set(papers)
        families={papers[i]['family'] for i in c['sourceIds']}
        assert set(requirements.get('requiredFamilies',[]))<=families
        assert len(families)>=requirements.get('minimumDistinctFamilies',1)
        if requirements.get('requireTargetFamily'):assert c['target'] in families
        assert set(s['paperId'] for s in c['sources'])==set(c['sourceIds'])
        for s in c['sources']:
            assert all(isinstance(s.get(k),str) and s[k].strip() for k in ['locator','use','boundary'])
        if c['round']==0:assert c['parentIds']==[]
        else:assert len(c['parentIds'])==1 and isinstance(c.get('changes'),str) and c['changes'].strip()
    byid={c['id']:c for c in candidates}
    for c in candidates:
        for parent in c['parentIds']:
            assert parent in byid and byid[parent]['round']<c['round']
            assert (byid[parent]['target'],byid[parent]['lever'])==(c['target'],c['lever'])
def summarize(c,evs,rubric):
    assert len(evs)==2 and len({e['critic'] for e in evs})==2,(c['id'],'Two distinct critics required')
    quality=[]
    for e in evs:
        assert set(e['scores'])==set(rubric)
        assert all(type(s) is int and 0<=s<=4 for s in e['scores'].values())
        assert type(e['nicheFit']) is bool and type(e['fatal']) is bool
        assert all(isinstance(e.get(k),str) and e[k].strip() for k in ['feedback','revision'])
        quality.append(sum(e['scores'].values())/16*100)
    eligible=all(e['nicheFit'] and not e['fatal'] and e['scores']['grounding']>=2 for e in evs)
    return {'quality':sum(quality)/2,'scoreSpread':max(quality)-min(quality),'eligible':eligible,'dimensionMeans':{k:sum(e['scores'][k] for e in evs)/2 for k in rubric}}
def build(config,candidates,evaluations):
    validate_candidates(config,candidates)
    assert len({(e['candidateId'],e['critic']) for e in evaluations})==len(evaluations)
    assert set(e['candidateId'] for e in evaluations)==set(c['id'] for c in candidates)
    scored={c['id']:summarize(c,[e for e in evaluations if e['candidateId']==c['id']],config['rubric']) for c in candidates}
    snapshots=[];archive={};events=[]
    for round_id in sorted(set(c['round'] for c in candidates)):
        for c in [c for c in candidates if c['round']==round_id]:
            s=scored[c['id']];cell=c['target']+'|'+c['lever'];prior=archive.get(cell)
            accept=s['eligible'] and (prior is None or s['quality']>prior['quality'])
            events.append({'candidateId':c['id'],'round':round_id,'cell':cell,'accepted':accept,'replaced':prior['candidateId'] if prior and accept else None,'reason':'ineligible' if not s['eligible'] else 'new niche' if accept and prior is None else 'higher AI quality' if accept else 'incumbent retained'})
            if accept:archive[cell]={'cell':cell,'target':c['target'],'lever':c['lever'],'candidateId':c['id'],'quality':s['quality'],'scoreSpread':s['scoreSpread']}
        snapshots.append({'round':round_id,'coverage':len(archive),'qdScore':sum(a['quality'] for a in archive.values()),'archive':list(archive.values())})
    return scored,snapshots,events

def main():
    parser=argparse.ArgumentParser();parser.add_argument('--initial-only',action='store_true');parser.add_argument('--run-dir',type=Path,default=ROOT/'run');parser.add_argument('--dist-dir',type=Path,default=ROOT/'dist');args=parser.parse_args()
    data_dir=args.run_dir.resolve();public_dir=args.dist_dir.resolve();public_dir.mkdir(parents=True,exist_ok=True)
    config=load(data_dir/'config.json');candidates=sum([load(data_dir/('initial-'+t+'.json')) for t in config['targets']],[])
    if not args.initial_only:
        for t in config['targets']:
            path=data_dir/('revised-'+t+'.json')
            if path.exists():candidates+=load(path)
    evaluations=[]
    for name in ['evidence','feasibility']:
        evaluations+=load(data_dir/('feedback-initial-'+name+'.json'))
        path=data_dir/('feedback-revised-'+name+'.json')
        if not args.initial_only and path.exists():evaluations+=load(path)
    scored,snapshots,events=build(config,candidates,evaluations)
    run={'name':config.get('name','ALife × Buehler paper mixer'),'generatedAt':'2026-10-15','method':'Small QDAIF-inspired stratified search with recorded AI generation, critique and feedback-guided mutation.','model':'All contexts inherit the same parent model; exact model identifier not independently verified.','tokens':'Not measured; no equal-budget performance comparison.','proposalsTested':False,'rubricInterpretation':'AI-rated proposal quality, not empirical correctness or certified novelty.','initialization':'Two targeted initial candidates per predefined niche; coverage is deliberately seeded.','limitation':'A two-round demonstration, not original QDAIF reproduction or scientific discovery validation.'}
    out={'config':config,'run':run,'candidates':candidates,'evaluations':evaluations,'scores':scored,'archive':snapshots[-1]['archive'],'snapshots':snapshots,'events':events}
    dest=data_dir/('initial-archive.json' if args.initial_only else 'results.json');dest.write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
    if not args.initial_only:
        (public_dir/'run.json').write_text(json.dumps(out,ensure_ascii=False))
        with (public_dir/'candidates.csv').open('w',newline='') as f:
            writer=csv.writer(f);writer.writerow(['id','title','round','target','lever','source_ids','parent_ids','ai_quality_0_100','critic_spread','eligible','final_elite','hypothesis','experiment','falsifier'])
            elites={a['candidateId'] for a in out['archive']}
            for c in candidates:
                s=scored[c['id']];writer.writerow([c['id'],c['title'],c['round'],c['target'],c['lever'],';'.join(c['sourceIds']),';'.join(c['parentIds']),s['quality'],s['scoreSpread'],s['eligible'],c['id'] in elites,c['hypothesis'],c['experiment'],c['falsifier']])
    print(json.dumps({'candidates':len(candidates),'evaluations':len(evaluations),'snapshots':[{k:s[k] for k in ['round','coverage','qdScore']} for s in snapshots],'eligible':sum(s['eligible'] for s in scored.values()),'destination':str(dest)}))
if __name__=='__main__':main()
