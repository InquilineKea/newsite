#!/usr/bin/env python3
"""Validate and export the recorded paper map. Does not call a model."""
import csv
import hashlib
import json
import zipfile
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'runs/paper-map'
PUBLIC = ROOT / 'dist/paper-map'

def main():
    data = json.loads((SOURCE / 'papers.json').read_text())
    rubric = json.loads((SOURCE / 'rubric.json').read_text())
    data['rubric'] = rubric
    axes = rubric['axes']
    ids = [p['id'] for p in data['papers']]
    assert len(ids) == len(set(ids)), 'duplicate paper IDs'
    assert len(ids) >= 9
    for p in data['papers']:
        assert p['url'].startswith('https://')
        assert p['group'] and p['coverage']['read']
        assert len(p['details']) >= 2
        assert p['novelty']['comparator'] and p['novelty']['comparatorUrl'].startswith('https://')
        for field in ['mechanism', 'scale', 'evidence', 'validation']:
            assert isinstance(p['tags'][field], list) and p['tags'][field]
        assert set(p['assessments']) == {a['id'] for a in axes}
        for a in axes:
            v = p['assessments'][a['id']]
            assert v['score'] is None or type(v['score']) is int and 0 <= v['score'] <= 4
            assert v['confidence'] in ['low', 'medium', 'high']
            assert v['rationale'] and v['locator']
        for d in p['details']:
            assert all(d[k] for k in ['observation', 'interpretation', 'boundary', 'locator'])
    PUBLIC.mkdir(parents=True, exist_ok=True)
    (PUBLIC/'papers.json').write_text(json.dumps(data, ensure_ascii=False, indent=2)+'\n')
    with (PUBLIC/'papers.csv').open('w', newline='') as f:
        w = csv.writer(f)
        w.writerow(['paper_id','title','group','year','version','axis','ordinal_score','confidence','rationale','locator','source_url'])
        for p in data['papers']:
            for a in axes:
                v = p['assessments'][a['id']]
                w.writerow([p['id'],p['title'],p['group'],p['year'],p.get('version',''),a['label'],v['score'],v['confidence'],v['rationale'],v['locator'],p['url']])
    lines = ['# Paper Mixer — Paper Map', '', data['date'], '', data['description'], '', rubric['scale'], '', rubric['missing'], '', '## Reading protocol', '']
    lines += [f'- {x}' for x in rubric['protocol']]
    lines += ['', '## Scope and limits', ''] + [f'- {x}' for x in data['limitations']]
    lines += ['', '## Axis definitions', '']
    for a in axes:
        lines += [f"### {a['label']}", '', a['question'], '']
        lines += [f"- {i}: {x}" for i,x in enumerate(a['anchors'])]
        lines.append('')
    for p in data['papers']:
        lines += [f"## {p['id']} · {p['title']}", '', f"{', '.join(p['authors'])} · {p['year']} · {p['status']} · {p.get('version','')}", '', f"[Primary source]({p['url']})", '', p['summary'], '', '**Diversity descriptors**', '']
        lines += [f"- {k.capitalize()}: {', '.join(v)}" for k,v in p['tags'].items()]
        lines += ['', '| Axis | Ordinal category | Confidence | Rationale and locator |', '|---|---:|---|---|']
        for a in axes:
            v=p['assessments'][a['id']]
            lines.append(f"| {a['label']} | {v['score'] if v['score'] is not None else 'Unknown'} | {v['confidence']} | {v['rationale'].replace('|','/')} — {v['locator'].replace('|','/')} |")
        n=p['novelty']
        lines += ['', '**Novelty comparator**', '', f"[{n['comparator']}]({n['comparatorUrl']})", '', f"Increment: {n['increment']}", '', f"Limit: {n['limit']}", '', '**Easy to miss from the abstract**', '']
        for d in p['details']:
            lines += [f"- Observation: {d['observation']} Interpretation: {d['interpretation']} Boundary: {d['boundary']} ({d['locator']})"]
        lines += ['', f"**Next falsifiable test:** {p['nextTest']}", '', '**Reading coverage**', '']
        lines += [f"- Read: {x}" for x in p['coverage']['read']]
        lines += [f"- Not read/tested: {x}" for x in p['coverage']['notRead']]
        lines.append('')
    (PUBLIC/'report.md').write_text('\n'.join(lines))
    # This route owns its own provenance; prior recorded runs remain byte-identical.
    provenance = json.loads((SOURCE/'provenance.json').read_text())
    provenance['recordHashes'] = {f.name:hashlib.sha256(f.read_bytes()).hexdigest() for f in sorted(SOURCE.glob('*.json')) if f.name != 'provenance.json'}
    (PUBLIC/'provenance.json').write_text(json.dumps(provenance, ensure_ascii=False, indent=2)+'\n')
    files = [f for folder in ['scripts','runs/paper-map','dist/paper-map'] for f in (ROOT/folder).rglob('*') if f.is_file() and '__pycache__' not in f.parts and f.suffix not in ['.pyc','.zip']]
    files += [ROOT/'README.md', ROOT/'dist/style.css']
    with zipfile.ZipFile(PUBLIC/'paper-map-bundle.zip', 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files:
            z.write(f, f.relative_to(ROOT))
    print(json.dumps({'papers':len(ids),'axisAssessments':len(ids)*len(axes),'details':sum(len(p['details']) for p in data['papers']),'bundleFiles':len(files)}))

if __name__ == '__main__':
    main()
