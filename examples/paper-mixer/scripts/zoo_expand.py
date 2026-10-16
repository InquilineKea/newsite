#!/usr/bin/env python3
"""Validate a Matter Zoo extension; optionally append to a new immutable intake directory.

Requires Python 3 and Node.js. Intake is pending review, not scientific promotion.
"""
import argparse, hashlib, json, subprocess
from datetime import datetime, timezone
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def ingest(path,output=None):
    value=json.loads(path.read_text(),parse_constant=lambda x:(_ for _ in ()).throw(ValueError('Non-finite JSON number '+x)))
    canonical=json.dumps(value,ensure_ascii=False,sort_keys=True,allow_nan=False)
    code="import {readFileSync} from 'node:fs'; import {validateExtension} from './dist/matter-zoo/core.js'; const x=JSON.parse(readFileSync(0,'utf8'));const errors=validateExtension(x);process.stdout.write(JSON.stringify(errors));process.exitCode=errors.length?1:0;"
    check=subprocess.run(['node','--input-type=module','-e',code],input=canonical,text=True,capture_output=True,cwd=ROOT)
    if check.returncode:raise ValueError(check.stdout or check.stderr)
    digest=hashlib.sha256(canonical.encode()).hexdigest()
    receipt={'artifactId':value['artifactId'],'payloadHash':digest,'hashConvention':'SHA-256 of Python json.dumps(sort_keys=True, ensure_ascii=False, allow_nan=False), default separators','reviewState':'pending','schemaPromotion':False,'receivedAt':datetime.now(timezone.utc).isoformat()}
    if output:
        output.mkdir(parents=True,exist_ok=True)
        target=output/value['artifactId'];target.mkdir(exist_ok=False)
        try:
            (target/'payload.json').write_text(canonical+'\n')
            (target/'receipt.json').write_text(json.dumps(receipt,indent=2)+'\n')
        except Exception:
            for p in target.iterdir():p.unlink()
            target.rmdir();raise
        receipt['path']=str(target)
    return receipt
if __name__=='__main__':
    p=argparse.ArgumentParser(description=__doc__);p.add_argument('submission',type=Path);p.add_argument('--output-dir',type=Path,help='Write a new artifact folder; omitted means validation only. Existing IDs are never overwritten.')
    a=p.parse_args()
    try:print(json.dumps(ingest(a.submission,a.output_dir),ensure_ascii=False,indent=2))
    except (ValueError,OSError) as e:p.exit(1,str(e)+'\n')
