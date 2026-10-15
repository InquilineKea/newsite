#!/usr/bin/env python3
"""Metadata bridge for native ScienceClaw Artifact 1.0 JSONL (Python standard library)."""
import argparse
import hashlib
import json
import os
import re
import sys
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

FIELDS = ('artifact_id', 'artifact_type', 'producer_agent', 'skill_used', 'schema_version', 'investigation_id', 'timestamp', 'content_hash', 'parent_artifact_ids', 'result_quality', 'needs', 'summary')
DEFAULTS = {'parent_artifact_ids': [], 'result_quality': 'ok', 'needs': [], 'summary': ''}


def prepare_record(raw, context=None):
    """Match Artifact._hash_payload exactly, including Unicode, spaces and 1.0."""
    if not isinstance(raw, dict) or not isinstance(raw.get('payload'), dict):
        raise ValueError('Use full per-agent ArtifactStore records with a payload, not global_index.jsonl.')
    canonical = json.dumps(raw['payload'], sort_keys=True, ensure_ascii=False, allow_nan=False)
    digest = hashlib.sha256(canonical.encode('utf-8')).hexdigest()
    if digest != raw.get('content_hash'):
        raise ValueError('Payload hash mismatch for artifact ' + str(raw.get('artifact_id')))
    if len(canonical.encode('utf-8')) > 100000:
        raise ValueError('Payload exceeds 100 KB verification limit. Keep the original locally and import metadata through MCP if appropriate.')
    record = {}
    for field in FIELDS:
        if field in raw:
            record[field] = raw[field]
        elif field in DEFAULTS:
            record[field] = DEFAULTS[field]
        else:
            raise ValueError('Missing native artifact field: ' + field)
    if record['schema_version'] != '1.0':
        raise ValueError('Unsupported ScienceClaw artifact schema version.')
    context = context or raw['payload'].get('analysis_context')
    is_de = re.search(r'deseq|edger|limma|differential[_-]?expression', record['skill_used'] + ' ' + record['artifact_type'], re.I) or raw['payload'].get('analysis_type') == 'differential_expression' or raw['payload'].get('analysis_kind') == 'differential_expression'
    if is_de and not context:
        raise ValueError('Differential expression requires an analysis context; use --artifact-id ID --context-file FILE or payload.analysis_context.')
    result = {'record': record, 'canonicalPayload': canonical}
    if context:
        result['analysisContext'] = context
    return result


def read_records(path, artifact_id=None):
    records = []
    with Path(path).expanduser().open(encoding='utf-8') as handle:
        for lineno, line in enumerate(handle, 1):
            if not line.strip():
                continue
            try:
                raw = json.loads(line)
            except json.JSONDecodeError as exc:
                raise ValueError(f'Invalid or incomplete JSONL at line {lineno}; rerun after the writer finishes.') from exc
            if artifact_id is None or raw.get('artifact_id') == artifact_id:
                records.append(raw)
    if not records:
        raise ValueError('No matching artifacts in the supplied store.')
    return records


class NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


class Client:
    def __init__(self, origin=None, token=None):
        self.origin = origin or os.environ.get('AGENT_COMMONS_URL', 'https://agent-commons-h.stochasticcockatoo.chatgpt.site')
        parsed = urllib.parse.urlsplit(self.origin)
        if parsed.scheme != 'https' and not (parsed.scheme == 'http' and parsed.hostname in ('localhost', '127.0.0.1', '::1')):
            raise ValueError('Use HTTPS for a remote workspace.')
        if parsed.username or parsed.password or parsed.path not in ('', '/') or parsed.query or parsed.fragment:
            raise ValueError('AGENT_COMMONS_URL must be an origin without credentials, path, query or fragment.')
        self.origin = self.origin.rstrip('/')
        self.token = token or os.environ.get('OAI_SITES_TOKEN')
        if not self.token:
            raise ValueError('Set OAI_SITES_TOKEN in the environment to the private Site service credential.')
        self.opener = urllib.request.build_opener(NoRedirect())

    def request(self, path, operation=None):
        data = json.dumps(operation, ensure_ascii=False).encode('utf-8') if operation is not None else None
        request = urllib.request.Request(self.origin + path, data=data, headers={'OAI-Sites-Authorization': 'Bearer ' + self.token, 'Content-Type': 'application/json'})
        try:
            with self.opener.open(request, timeout=45) as response:
                return json.load(response)
        except urllib.error.HTTPError as exc:
            if exc.code == 409:
                raise ValueError('Workspace conflict: read the latest state and reconsider. Re-running sync safely reuses identical artifacts.') from exc
            detail = ''
            try:
                detail = str(json.load(exc).get('error', ''))[:500]
            except (ValueError, OSError):
                pass
            raise ValueError(f'Workspace returned HTTP {exc.code}: {detail or "check authorization and the analysis contract"}. Credentials were not forwarded.') from exc
        except (json.JSONDecodeError, urllib.error.URLError) as exc:
            raise ValueError('Cannot read a JSON response from the workspace. Check the URL and private service access.') from exc

    def op(self, operation):
        snapshot = self.request('/api/workspace')
        return self.request('/api/workspace', {**operation, 'version': snapshot['version']})


def sync(client, records, project, skills=None, context=None, task_id=None, need_id=None):
    prepared = [prepare_record(record, context) for record in records]  # Validate every record before any network writes.
    if len(prepared) > 500:
        raise ValueError('Select a smaller store or a single artifact; maximum 500 per import.')
    agents = client.request('/api/workspace')['state']['agents']
    for item in prepared:
        name = item['record']['producer_agent']
        agent = next((a for a in agents if a.get('scienceclawName') == name), None)
        if agent is None:
            snapshot = client.op({'action': 'register_agent', 'name': name, 'role': 'Research', 'perspective': 'Native ScienceClaw worker. Publish reproducible artifacts, explicit assumptions and unmet needs.', 'scienceclawName': name, 'preferredTools': skills or []})
            agents = snapshot['state']['agents']
            agent = next(a for a in agents if a.get('scienceclawName') == name)
        operation = {'action': 'publish_artifact', 'project': project, 'agentId': agent['id'], **item}
        if task_id:
            operation['taskId'] = task_id
        if need_id:
            operation['fulfillsNeedId'] = need_id
        client.op(operation)
    return {'processed': len(prepared), 'payloadsStored': False}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest='command', required=True)
    upload = sub.add_parser('sync', help='Import verified provenance from a per-agent JSONL store. No models or ScienceClaw processes are launched.')
    upload.add_argument('--store', required=True)
    upload.add_argument('--project', required=True)
    upload.add_argument('--artifact-id')
    upload.add_argument('--context-file', help='Statistical context JSON for one explicitly selected artifact.')
    upload.add_argument('--task-id')
    upload.add_argument('--need-id')
    upload.add_argument('--skills', nargs='*', default=[])
    upload.add_argument('--dry-run', action='store_true', help='Verify locally without reading credentials or contacting the website.')
    sub.add_parser('needs', help='Read shared research needs and provenance metadata.')
    propose = sub.add_parser('propose', help='Create bounded follow-up work from a shared need.')
    propose.add_argument('--need-id', required=True)
    propose.add_argument('--agent-id', required=True)
    args = parser.parse_args(argv)
    if args.command == 'sync':
        if (args.context_file or args.task_id or args.need_id) and not args.artifact_id:
            raise ValueError('Select --artifact-id when attaching context, a task, or a need.')
        records = read_records(args.store, args.artifact_id)
        context = json.loads(Path(args.context_file).read_text(encoding='utf-8')) if args.context_file else None
        prepared = [prepare_record(raw, context) for raw in records]
        if args.dry_run:
            print(json.dumps({'verified': len(prepared), 'artifacts': [{'id': x['record']['artifact_id'], 'type': x['record']['artifact_type'], 'hasAnalysisContext': 'analysisContext' in x} for x in prepared], 'networkWrites': 0}))
            return
        print(json.dumps(sync(Client(), records, args.project, args.skills, context, args.task_id, args.need_id)))
    elif args.command == 'needs':
        print(json.dumps(Client().request('/api/scienceclaw'), ensure_ascii=False, indent=2))
    elif args.command == 'propose':
        print(json.dumps(Client().op({'action': 'create_task_from_need', 'needId': args.need_id, 'agentId': args.agent_id}), ensure_ascii=False))


if __name__ == '__main__':
    try:
        main()
    except (ValueError, OSError, KeyError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
