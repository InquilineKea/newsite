#!/usr/bin/env python3
"""Export a recorded finite presheaf model and deterministic check record."""
import hashlib,json,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'runs/presheaf'
PUBLIC=ROOT/'dist/presheaf'

def main():
    model=json.loads((SOURCE/'model.json').read_text())
    checks=json.loads((PUBLIC/'checks.json').read_text())
    assert checks['status']=='passed' and len(checks['results'])==48
    assert len(model['papers'])==18 and len(model['ports'])==109 and len(model['bridges'])==8
    (PUBLIC/'model.json').write_text(json.dumps(model,ensure_ascii=False,indent=2)+'\n')
    for name in ['audit.json','provenance.json']:
        d=json.loads((SOURCE/name).read_text())
        if name=='provenance.json':d['recordHashes']={str(p.relative_to(SOURCE)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(SOURCE.rglob('*.json')) if p.name!='provenance.json'}
        (PUBLIC/name).write_text(json.dumps(d,ensure_ascii=False,indent=2)+'\n')
    lines=['# Papers as local views','',model['date'],'',model['description'],'','## Formal model and scientific interpretation','']
    for key,value in model['mathematics'].items():lines += [f'**{key}**: {value}','']
    lines += ['## Why restriction is valid','', 'If V is contained in U, every constraint supported in V is also supported in U. Therefore a complete assignment admissible on U restricts to an admissible assignment on V. Literal projection preserves identity and composes. Compatible total assignments have at most one merge because their values fix every coordinate of the union. A cross-patch constraint may reject that unique merge, so existence can fail. These statements concern this explicit finite model; the scientific choice of variables and predicates remains a modeling judgment.','','## Factor contexts','']
    for c in model['contexts']:lines += [f"- **{c['label']}**: {c['question']}"]
    lines += ['','## Recorded bridge screens','', '| Bridge | Bounded scope | Stronger scope | Complete local gluing counterexample? |','|---|---|---|---|']
    by={(x['bridgeId'],x['mode'],x['scenario']):x for x in checks['results']}
    for b in model['bridges']:
        a=by[(b['id'],'bounded','recorded')];s=by[(b['id'],'stronger','recorded')]
        lines.append(f"| {b['label']} | {a['status']} | {s['status']} | {'Yes, for the selected stronger packet' if s['isGluingFailure'] else 'No certified complete-family example for this packet'} |")
    lines += ['', 'These outcomes are intentionally scoped to curated screens. They are not a benchmark, causal proof or measurement of the truth of an original paper. Stronger claims are explanatory probes, not necessarily claims made by the authors.','']
    for b in model['bridges']:
        lines += [f"### {b['label']}",'','Papers: '+', '.join(b['paperIds']),'',f"**Bounded target:** {b['boundedClaim']}",'',f"**Stronger target:** {b['strongerClaim']}",'','**Shared interface meanings**','']
        lines += [f"- {v['name']}: {v['meaning']}" for v in b['interfaceVariables']]
        lines += ['', '**Requirements**','']+[f'- {x}' for x in b['requirements']]+['','**Gaps**','']+[f'- {x}' for x in b['gaps']]
        lines += ['', '**Exact constraint support and predicate**','','```json',json.dumps(b['constraint'],ensure_ascii=False,indent=2),'```','', 'Locators: '+'; '.join(b['locators']),'']
    lines += ['## Source-scoped paper ports','']
    ports={p['id']:p for p in model['ports']}
    for p in model['papers']:
        lines += [f"### {p['shortTitle']}",'',f"[Primary source]({p['url']}) · {p['version']} · {p['readingLevel']}",'']
        for key in p['ports']:
            v=ports[key];lines += [f"- **{key}** = {v['value'] if v['value'] is not None else 'UNKNOWN'} ({v['confidence']} confidence). {v['evidence']} Boundary: {v['boundary']} Source: {v['locator']}"]
        lines.append('')
    lines += ['## Verification','',checks['formalScope'],'','```json',json.dumps(checks['tests'],indent=2),'```','',checks['browserQA'],'','## Limits','']+[f'- {x}' for x in model['limitations']]+['','## References','']+[f"- [{s['title']}]({s['url']}): {s['scope']}" for s in model['references']]
    (PUBLIC/'report.md').write_text('\n'.join(lines)+'\n')
    files=[p for folder in ['runs/presheaf','dist/presheaf'] for p in (ROOT/folder).rglob('*') if p.is_file() and p.suffix!='.zip']+[ROOT/'README.md',ROOT/'dist/style.css',ROOT/'scripts/build_presheaf.py',ROOT/'scripts/test_presheaf.mjs',ROOT/'scripts/test_presheaf_ui.mjs']
    with zipfile.ZipFile(PUBLIC/'presheaf-bundle.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in files:z.write(p,p.relative_to(ROOT))
    print(json.dumps({'papers':len(model['papers']),'ports':len(model['ports']),'bridges':len(model['bridges']),'bundleFiles':len(files)}))

if __name__=='__main__':main()
