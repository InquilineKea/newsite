#!/usr/bin/env python3
"""Package a verified recorded run and reusable source, excluding Site identity."""
import argparse,hashlib,json,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def main():
 parser=argparse.ArgumentParser();parser.add_argument('--run-dir',type=Path,required=True);parser.add_argument('--dist-dir',type=Path,required=True);args=parser.parse_args();data_dir=args.run_dir.resolve();public=args.dist_dir.resolve();r=json.loads((data_dir/'results.json').read_text())
 provenance={'contexts':{'generators':['controversy_gen_ai','controversy_gen_psych','controversy_gen_econ'],'critics':['controversy_critic_evidence','controversy_critic_feasibility'],'revision':'Same generator contexts, given the two real reviews of selected parents'},'model_independence':'All contexts share the inherited parent model. No independent empirical replication or truth vote is claimed.','selection':'Curated documented attention, not a verified citation ranking; source access and claim scopes are in config.json.','scientific_execution':'Actual AI generation, critique and revision; deterministic archive replay. Proposed scientific studies, audits and reanalyses were not run.','checks':['11 archive and corpus-policy invariants','Original and new actual-data DOM unit tests','JavaScript syntax and Python compilation','Generic JSON adapter fixture parity; fixture makes no new model calls'],'browser_qa':'Unavailable; no managed browser capability was available.','count':{'candidates':len(r['candidates']),'reviews':len(r['evaluations']),'elites':len(r['archive'])},'record_hashes':{f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(data_dir.glob('*.json')) if f.name!='provenance.json'}}
 (data_dir/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n');(public/'provenance.json').write_text(json.dumps(provenance,indent=2)+'\n')
 files=[ROOT/'README.md']+[f for folder in ['scripts','run','runs','dist'] for f in (ROOT/folder).rglob('*') if f.is_file() and '__pycache__' not in f.parts and f.suffix not in ['.pyc','.zip']]
 bundle=public/'paper-mixer-bundle.zip'
 with zipfile.ZipFile(bundle,'w',zipfile.ZIP_DEFLATED) as z:
  for f in files:z.write(f,f.relative_to(ROOT))
 print(json.dumps({'bundle':str(bundle),'files':len(files),'bytes':bundle.stat().st_size}))
if __name__=='__main__':main()
