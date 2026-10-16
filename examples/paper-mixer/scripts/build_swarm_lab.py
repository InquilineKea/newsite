#!/usr/bin/env python3
"""Package the already recorded fixture and agent pass; no new model calls."""
import hashlib,json,shutil,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1];RUN=ROOT/'runs/strategic-coupling';OUT=ROOT/'dist/swarm-lab'
def build():
    for name in ['run.json','physics-audit.json','agent-run.json','protocol-audit.json']:
        shutil.copyfile(RUN/name,OUT/name)
    run=json.loads((RUN/'run.json').read_text());agents=json.loads((RUN/'agent-run.json').read_text())
    assert len(agents['firstPasses'])==6 and len(agents['coalitionOutputs'])==3
    assert not agents['sharedOntologyPromoted']
    report=['# Strategic Coupling — recorded prototype','','Source: '+run['sourceUrl'],'','28 fixed candidate evaluations; 196 scattering solves; 29 physics checks. Six actual isolated first passes, then three bounded coalition outputs. No equal-token AI strategy comparison.','','## Representation loss','',json.dumps(run['representationLoss'],indent=2),'','## Limits','']+['- '+x for x in run['limits']]
    (OUT/'report.md').write_text('\n'.join(report)+'\n')
    manifest={'schemaVersion':'swarm-lab-build/1.0','sourceSha256':hashlib.sha256((RUN/'source/conversation.json').read_bytes()).hexdigest(),'runSha256':hashlib.sha256((RUN/'run.json').read_bytes()).hexdigest(),'agentPassSha256':hashlib.sha256((RUN/'agent-run.json').read_bytes()).hexdigest(),'physicsChecks':29,'firstPasses':6,'coalitionOutputs':3,'modelTokenUsage':None,'ontologyPromoted':False,'browserQA':False,'semanticScope':'Finite scattering fixture, actual bounded readings and deterministic routing replay; no materials or agent-strategy superiority claim.'}
    for p in [RUN/'build-manifest.json',OUT/'build-manifest.json']:p.write_text(json.dumps(manifest,indent=2)+'\n')
    with zipfile.ZipFile(OUT/'swarm-lab-bundle.zip','w',zipfile.ZIP_DEFLATED) as z:
        z.write(ROOT/'dist/style.css','dist/style.css')
        for p in sorted(OUT.iterdir()):
            if p.is_file() and p.suffix!='.zip':z.write(p,str(p.relative_to(ROOT)))
        for p in sorted(RUN.rglob('*')):
            if p.is_file():z.write(p,str(p.relative_to(ROOT)))
        for f in ['swarm_lab.py','swarm_runtime.py','check_triangle.py','test_swarm_lab.py','test_swarm_lab_ui.mjs','build_swarm_lab.py']:
            z.write(ROOT/'scripts'/f,'scripts/'+f)
    print('Packaged measured Swarm Lab and recorded agent pass.')
if __name__=='__main__':build()
