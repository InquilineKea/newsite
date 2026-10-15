#!/usr/bin/env python3
from pathlib import Path
import argparse,json,hashlib
ROOT=Path(__file__).resolve().parents[1]
def display_path(path):
 try:return str(path.relative_to(ROOT))
 except ValueError:return str(path)
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--run-dir',type=Path,default=ROOT/'run');parser.add_argument('--dist-dir',type=Path,default=ROOT/'dist');args=parser.parse_args();data_dir=args.run_dir.resolve();public_dir=args.dist_dir.resolve();r=json.loads((data_dir/'results.json').read_text());candidates={c['id']:c for c in r['candidates']};first,last=r['snapshots'][0],r['snapshots'][-1];initialids={a['candidateId'] for a in first['archive']};changed=[a for a in last['archive'] if a['candidateId'] not in initialids]
 lines=['# '+r['config'].get('name','Paper Mixer: ALife × Buehler'), '', 'Recorded October 15, 2026. All outputs below are **untested research proposals**. AI scores judge proposal formulation, not scientific truth, certified novelty, or predicted probability of success.','', '## Actual run', '',f"Mixed {len(r['config']['papers'])} source papers into {len(r['candidates'])} candidate proposals and obtained {len(r['evaluations'])} AI feedback records. Three generator contexts produced the initial proposals. Two different critic contexts provided source/mechanism and execution/evaluation feedback; generators revised selected parents. All inherit one model family. The deterministic archive code selected elites; it did not fabricate model ratings.",'', '| Snapshot | Occupied niches | Sum of elite AI scores (max 1200) | Mean elite AI quality /100 |','|---|---:|---:|---:|']
 for s in r['snapshots']:lines.append(f"| Round {s['round']} | {s['coverage']}/12 | {s['qdScore']:.3f} | {s['qdScore']/s['coverage'] if s['coverage'] else 0:.3f} |")
 lines+=['',f"{len(changed)} final elites were new feedback-guided candidates. Any improvement here is in these critics' ratings of the proposals, not an observed experimental effect.",'','Initial proposals were intentionally allocated two per niche. This is targeted coverage, not evidence that search discovered the descriptor space or outperformed an equal-budget baseline.','', '## Why this is quality-diversity','',r['config']['archiveRule'],'','The niches cross '+', '.join(r['config']['targets'])+' with '+', '.join(r['config']['levers'])+'. Candidates compete only within their niche. Source provenance, transfer boundaries and critic gates are required before quality can matter. Original candidates, feedback and parent links are retained.','', '## Final elite archive','', '| Niche | Candidate | AI quality /100 | Critic spread |','|---|---|---:|---:|']
 for a in last['archive']:
  c=candidates[a['candidateId']];lines.append(f"| {a['target']} × {a['lever']} | {c['id']}: {c['title']} | {a['quality']:.3f} | {a['scoreSpread']:.3f} |")
 lines+=['','## A practical starting point in each target','']
 for target in r['config']['targets']:
  es=[a for a in last['archive'] if a['target']==target]
  if not es:continue
  a=max(es,key=lambda a:a['quality']);c=candidates[a['candidateId']]
  lines += [f"### {c['title']} ({c['id']})",'',f"**Mix:** {' + '.join(c['sourceIds'])}",'',c['mechanism'],'',f"**Hypothesis:** {c['hypothesis']}",'',f"**Minimal experiment:** {c['experiment']}",'',f"**Control:** {c['baseline']}",'',f"**Measure:** {c['metric']}",'',f"**Falsifier:** {c['falsifier']}",'',f"**Alternative explanation:** {c['confound']}",'',f"**Resources:** {c['feasibility']}",'']
 lines+=['## Feedback and uncertainty','']
 disagreements=sorted(last['archive'],key=lambda a:a['scoreSpread'],reverse=True)[:3]
 for a in disagreements:
  c=candidates[a['candidateId']];lines.append(f"### {c['id']}: {c['title']}")
  for e in r['evaluations']:
   if e['candidateId']==c['id']:lines += ['',f"**{e['critic']} critic:** {e['feedback']}",f"**Suggested repair:** {e['revision']}"]
 lines+=['','Score averaging can conceal disagreement; inspect the full per-dimension feedback in run.json before choosing an experiment. No human-rated calibration or literature-wide novelty search was completed.','', '## Source mechanisms and boundaries','']
 for p in r['config']['papers']:
  lines += [f"- [{p['title']}]({p['url']}) — {p['locator']}. {p['mechanism']} Boundary: {p['boundary']}"]
  if p.get('status'):lines += ['  Dispute scope: '+p['status']]
  if p.get('attention'):lines += ['  Attention rationale: '+p['attention']]
  for ref in p.get('references',[]):lines += [f"  - [{ref['title']}]({ref['url']}): {ref['relation']}. {ref['scope']}"]
 lines+=['','## Corpus-specific limits','']+['- '+item for item in r['config']['limitations']]
 lines+=['','## Reproduce / extend','', 'Run `python scripts/replay.py --run-dir '+display_path(data_dir)+' --dist-dir '+display_path(public_dir)+'` to rebuild the archive from recorded model outputs and `python scripts/test_archive.py` for the archive invariants. `python scripts/search.py --help` describes the adapter-backed runner for a new source packet. It requires your own configured agent adapter; the hosted explorer does not execute fresh AI calls.','', 'The method is QDAIF-inspired, using a manually specified niche archive and explicit critique-guided mutation. It is not a reproduction of the original paper implementation. No physical experiment, ALife optimization result, multiagent superiority benchmark or emergent-cognition demonstration is claimed.','']
 (public_dir/'report.md').write_text('\n'.join(lines))
 manifest={'run_file':'run.json','sha256':hashlib.sha256((public_dir/'run.json').read_bytes()).hexdigest(),'source_packet_sha256':hashlib.sha256((data_dir/'config.json').read_bytes()).hexdigest(),'candidate_count':len(r['candidates']),'feedback_records':len(r['evaluations']),'final_elites':len(r['archive']),'new_final_elites':len(changed),'rating_scale':'0–100 AI-rated formulation quality','physical_experiments':0,'executed_model_calls':'Actual subagent generation, critique and revision, orchestrated by coordinator. Adapter runner supplied separately; sample did not invoke an external provider API.','shared_inherited_model':True}
 (public_dir/'manifest.json').write_text(json.dumps(manifest,indent=2)+'\n')
 print(json.dumps(manifest))
if __name__=='__main__':main()
