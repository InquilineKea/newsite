import json,hashlib,unittest,importlib.util
from pathlib import Path
R=Path(__file__).resolve().parents[1];D=R/'dist/idea-qd'
spec=importlib.util.spec_from_file_location('controls',R/'scripts/idea_qd_controls.py');module=importlib.util.module_from_spec(spec);spec.loader.exec_module(module)
class ArchiveTests(unittest.TestCase):
 @classmethod
 def setUpClass(cls):cls.a=json.loads((D/'archive.json').read_text());cls.m=json.loads((D/'messages.json').read_text())
 def test_exact_source_anchors(self):
  mm={m['id']:m for m in self.m};self.assertEqual(len(mm),72)
  for x in self.a['ideas']:
   s=x['source'];self.assertEqual(mm[s['messageId']]['text'][s['start']:s['end']],s['quote'])
  self.assertEqual(hashlib.sha256((D/'messages.json').read_bytes()).hexdigest(),self.a['source']['sha256'])
 def test_frozen_reviews(self):
  audit=json.loads((D/'review-audit.json').read_text());self.assertEqual(len(audit['reviewers']),3)
  for review in audit['reviewers']:self.assertEqual(hashlib.sha256((D/review['file']).read_bytes()).hexdigest(),review['sha256'])
  self.assertEqual(len(self.a['reviews']),3)
 def test_no_unearned_novelty_or_evidence(self):
  self.assertTrue(all(x['literatureNovelty'] is None for x in self.a['ideas']))
  self.assertEqual(len({x['id'] for x in self.a['ideas']}),33)
  for x in self.a['ideas']:
   self.assertTrue(all(v in range(5) for v in x['scores'].values()));self.assertTrue(x['nextTest'] and x['falsifier'] and x['confounds'])
 def test_queue_and_pareto_replay(self):
  def dom(a,b):return all(a[k]>=b[k] for k in a) and any(a[k]>b[k] for k in a)
  for x in self.a['ideas']:
   q=x['scores'];eligible=q['specification']>=3 and q['discrimination']>=3 and q['tractability']>=2
   self.assertEqual(x['queueEligible'],eligible)
   expected=[p['id'] for p in self.a['ideas'] if p['id']!=x['id'] and p['niche']==x['niche'] and p['queueEligible'] and dom(p['scores'],q)]
   self.assertEqual(x['dominatedBy'],expected);self.assertEqual(x['nominalNicheFrontier'],eligible and not expected)
  self.assertEqual(self.a['summary']['robustlyDominated'],0)
 def test_controls_reexecute(self):
  c=module.run();self.assertEqual(len(c['checks']),13);self.assertTrue(all(x['passed'] for x in c['checks']))
  saved=json.loads((D/'controls.json').read_text());self.assertEqual(c,saved)
 def test_useful_function_not_count(self):
  c=json.loads((D/'controls.json').read_text());rows=c['eca']['rows'];self.assertEqual(rows[43]['distinctFunctions'],16);self.assertEqual(rows[43]['distinctBijectiveFunctions'],0)
  self.assertEqual(rows[204]['distinctFunctions'],1);self.assertEqual(rows[204]['bestInputOutputInformationBits'],2)
 def test_old_results_immutable(self):
  for path,sha in [('run.json','1b81ee5895a650b537388739ef8ff48b83f67a183030ab071242570c9f2931ff'),('controversies/run.json','d53db78d237394e9429eb7301af93dc00ac961abc62127cc23b16ee2e6b03dab')]:self.assertEqual(hashlib.sha256((R/'dist'/path).read_bytes()).hexdigest(),sha)
if __name__=='__main__':unittest.main()
