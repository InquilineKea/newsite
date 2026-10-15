#!/usr/bin/env python3
"""Export recorded ordinal assessments; no model calls or scientific reruns."""
import csv
import hashlib
import json
import math
import statistics
import zipfile
from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
SOURCE=ROOT/'runs/buehler'
PUBLIC=ROOT/'dist/buehler'

def known(x):
    return type(x) is int and 0 <= x <= 4

def axis_ranks(papers,axis):
    rows=[p for p in papers if p['role']=='Buehler']
    vals=[p['assessments'][axis]['score'] for p in rows]
    return {p['id']:1+sum(known(v) and v>s for v in vals) if known(s:=p['assessments'][axis]['score']) else None for p in rows}

def average_ranks(values):
    return [1+sum(x<v for x in values)+(sum(x==v for x in values)-1)/2 for v in values]

def correlation(papers,a,b):
    pairs=[(p['assessments'][a]['score'],p['assessments'][b]['score']) for p in papers if p['role']=='Buehler']
    pairs=[(x,y) for x,y in pairs if known(x) and known(y)]
    n=len(pairs)
    if n<2:return {'rho':None,'n':n}
    x=average_ranks([x for x,y in pairs]);y=average_ranks([y for x,y in pairs]);mx=statistics.mean(x);my=statistics.mean(y)
    den=math.sqrt(sum((v-mx)**2 for v in x)*sum((v-my)**2 for v in y))
    return {'rho':sum((v-mx)*(w-my) for v,w in zip(x,y))/den if den else None,'n':n}

def main():
    data=json.loads((SOURCE/'papers.json').read_text());rubric=json.loads((SOURCE/'rubric.json').read_text());data['rubric']=rubric
    papers=data['papers'];axes=rubric['axes'];ids=[p['id'] for p in papers]
    assert len(ids)==len(set(ids))
    assert sum(p['role']=='Buehler' for p in papers)==18
    assert sum(p['role']=='Comparator' for p in papers)==3
    for p in papers:
        assert p['url'].startswith('https://') and p['coverage']['read']
        assert set(p['assessments'])=={a['id'] for a in axes}
        for key in ['observation','interpretation','boundary','locator']:assert p['surprise'][key]
        for a in p['assessments'].values():
            assert a['score'] is None or known(a['score'])
            assert a['confidence'] in ['low','medium','high'] and a['rationale'] and a['locator']
    ranks={a['id']:axis_ranks(papers,a['id']) for a in axes}
    diagnostics={a['id']:{b['id']:correlation(papers,a['id'],b['id']) for b in axes} for a in axes}
    PUBLIC.mkdir(parents=True,exist_ok=True)
    (PUBLIC/'papers.json').write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
    (PUBLIC/'diagnostics.json').write_text(json.dumps({'ranks':ranks,'correlations':diagnostics},indent=2)+'\n')
    with (PUBLIC/'rankings.csv').open('w',newline='') as f:
        w=csv.writer(f);w.writerow(['paper_id','short_title','year','role','axis','category_0_to_4','corpus_competition_rank','confidence','rationale','locator','reading_level','version','source'])
        for p in papers:
            for a in axes:
                v=p['assessments'][a['id']]
                w.writerow([p['id'],p['shortTitle'],p['year'],p['role'],a['label'],v['score'],ranks[a['id']].get(p['id']),v['confidence'],v['rationale'],v['locator'],p['readingLevel'],p['version'],p['url']])
    lines=['# Buehler: different kinds of departure','',data['date'],'',data['description'],'',data['scope'],'',rubric['scale'],'',rubric['independence'],'','## Scope and limits','']+[f'- {x}' for x in data['limitations']]
    lines+=['','## Separate rankings','', 'Competition ranks preserve ties (1, 1, 3); unknown is unranked. These are within the selected corpus, not global novelty ranks.','']
    for a in axes:
        key=a['id'];lines += [f"### {a['label']}",'',a['question'],'','| Rank | Paper | Category | Confidence |','|---:|---|---:|---|']
        ordered=sorted([p for p in papers if p['role']=='Buehler'],key=lambda p:(-(p['assessments'][key]['score'] if known(p['assessments'][key]['score']) else -1),p['title']))
        for p in ordered:
            v=p['assessments'][key];rank=ranks[key][p['id']]
            lines.append(f"| {rank if rank is not None else '—'} | [{p['shortTitle']}]({p['url']}) | {v['score'] if v['score'] is not None else '?'} | {v['confidence']} |")
        vals=[p['assessments'][key]['score'] for p in papers if p['role']=='Comparator' and known(p['assessments'][key]['score'])]
        lines+=['',f"Three comparator categories: {', '.join(p['shortTitle']+' '+str(p['assessments'][key]['score']) for p in papers if p['role']=='Comparator')}. Range {min(vals)}–{max(vals)}. This is not a field percentile.",'']
    lines+=['## Axis overlap','', 'Spearman correlations on available Buehler-paper pairs; each entry is rho (pairwise n). Correlation of these assigned ratings is descriptive, not a test of scientific independence.','', '| Axis | '+' | '.join(a['short'] for a in axes)+' |','|---|'+'---|'*len(axes)]
    for a in axes:
        cells=[diagnostics[a['id']][b['id']] for b in axes]
        lines.append('| '+a['short']+' | '+' | '.join((f"{c['rho']:.2f}" if c['rho'] is not None else 'undefined')+f" ({c['n']})" for c in cells)+' |')
    lines+=['','## Full paper profiles','']
    for p in papers:
        lines += [f"### {p['shortTitle']} — {p['title']}",'',f"{', '.join(p['authors'])} · {p['year']} · {p['role']}",'',p['status']+'; '+p['version'],'',f"Reading level: **{p['readingLevel']}**",'',f"[Primary source]({p['url']})",'',p['summary'],'','| Axis | Category | Corpus rank | Confidence | Evidence |','|---|---:|---:|---|---|']
        for a in axes:
            v=p['assessments'][a['id']];rank=ranks[a['id']].get(p['id'])
            lines.append(f"| {a['label']} | {v['score'] if v['score'] is not None else '?'} | {rank if rank is not None else '—'} | {v['confidence']} | {v['rationale'].replace('|','/')} ({v['locator'].replace('|','/')}) |")
            for alt in v.get('alternativeScores',[]):lines.append(f"| Auditor dissent | {alt['score']} | — | — | {alt['reviewer']}: {alt['rationale']} |")
        s=p['surprise'];d=p['detail']
        lines+=['',f"**Surprise:** {s['observation']} {s['interpretation']} Boundary: {s['boundary']} ({s['locator']})",'',f"**Careful reading:** {d['observation']} {d['consequence']} ({d['locator']})",'', '**Coverage**','']+[f'- Read: {x}' for x in p['coverage']['read']]+[f'- Not reviewed: {x}' for x in p['coverage']['notRead']]
        lines += ['', '**Sources and access**','']+[f"- [{x['title']}]({x['url']}): {x['scope']}" for x in p.get('references',[])]+['']
    lines+=['## Rubric anchors','']
    for a in axes:
        lines += [f"### {a['label']}",'',a['question'],'']+[f'- {i}: {s}' for i,s in enumerate(a['anchors'])]+['']
    (PUBLIC/'report.md').write_text('\n'.join(lines))
    for name in ['audit.json','provenance.json']:
        doc=json.loads((SOURCE/name).read_text())
        if name=='provenance.json':doc['recordHashes']={str(p.relative_to(SOURCE)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(SOURCE.rglob('*.json')) if p.name!='provenance.json'}
        (PUBLIC/name).write_text(json.dumps(doc,ensure_ascii=False,indent=2)+'\n')
    files=[p for folder in ['runs/buehler','dist/buehler'] for p in (ROOT/folder).rglob('*') if p.is_file() and p.suffix!='.zip']+[ROOT/'README.md',ROOT/'dist/style.css',ROOT/'scripts/build_buehler.py',ROOT/'scripts/test_buehler.mjs']
    with zipfile.ZipFile(PUBLIC/'buehler-bundle.zip','w',zipfile.ZIP_DEFLATED) as z:
        for p in files:z.write(p,p.relative_to(ROOT))
    print(json.dumps({'buehler':18,'comparators':3,'assessments':len(papers)*len(axes),'unknown':sum(v['score'] is None for p in papers for v in p['assessments'].values()),'bundleFiles':len(files)}))

if __name__=='__main__':main()
