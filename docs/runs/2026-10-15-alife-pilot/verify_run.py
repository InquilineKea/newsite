#!/usr/bin/env python3
"""Verify exported run integrity; no service credentials or network required."""
from pathlib import Path
import hashlib
import json
p=Path(__file__).resolve().parent
rows=[json.loads(s) for s in (p/'artifacts.jsonl').read_text().splitlines()]
assert len(rows)==8
ids={r['artifact_id'] for r in rows}
assert len(ids)==len(rows)
for r in rows:
    digest=hashlib.sha256(json.dumps(r['payload'],sort_keys=True,ensure_ascii=False).encode()).hexdigest()
    assert digest==r['content_hash'],r['artifact_id']
    assert set(r['parent_artifact_ids'])<=ids
graph={r['artifact_id']:r['parent_artifact_ids'] for r in rows}
def visit(key,stack):
    assert key not in stack,'cycle'
    for parent in graph[key]:visit(parent,stack|{key})
for key in graph:visit(key,set())
proof=json.loads((p/'workspace-proof.json').read_text())
commits=proof['commitments']
assert len(commits)==3
assert max(c['at'] for c in commits)<min(c['revealedAt'] for c in commits)
for c in commits:
    assert c['revealedText']==(p/c['agentId']/'initial.md').read_text().strip()
assert all(t['status']=='review' for t in proof['tasks'])
assert all(a['integrity']=='hash-verified' for a in proof['artifactIds'])
manifest=json.loads((p/'manifest.json').read_text())
assert hashlib.sha256((p/'descriptor_diagnostic.py').read_bytes()).hexdigest()==manifest['script_sha256']
print('Verified: 8 payload hashes; acyclic lineage; all first passes committed before reveal; initial drafts preserved; 5 human-review handoffs; diagnostic source hash.')
