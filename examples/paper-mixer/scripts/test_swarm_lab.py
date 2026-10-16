import importlib.util, itertools, json, math, tempfile, unittest
from pathlib import Path
import numpy as np
from swarm_lab import fixture, Router, QDArchive, effective_diversity, ROLES
from swarm_runtime import Runtime
from check_triangle import make_audit
class ProtocolTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):cls.fixtureRun=fixture();cls.packet=cls.fixtureRun['spotlight']['event']
    def test_physics_controls(self):
        a=make_audit();self.assertEqual(len(a['checks']),29);self.assertTrue(all(x['pass'] for x in a['checks'].values()));self.assertTrue(all(x['detected'] for x in a['negative_controls'].values()))
    def test_spotlight_and_holdout(self):
        a,b=[next(c for c in self.fixtureRun['candidates'] if c['id']==i) for i in self.packet['candidateIds']]
        self.assertLess(np.max(np.abs(np.array(a['eigenvalues'])-b['eigenvalues'])),1e-12);self.assertGreater(np.linalg.norm(np.array(a['transport'])-b['transport']),2)
        self.assertEqual(self.fixtureRun['calibration']['heldOutLeakage'],False);self.assertEqual(self.fixtureRun['distances']['skeptic'],None)
        loss=self.fixtureRun['representationLoss'];self.assertEqual(loss['spectrumOnly']['falseMergesAgainstHeldOutFixedPortResponse'],16);self.assertEqual(loss['spectrumPlusLoopAndOnsite']['falseMergesAgainstHeldOutFixedPortResponse'],0)
    def test_graph_entropy_counterexample(self):
        n=6;L=n*np.eye(n)-np.ones((n,n));v=np.linalg.eigvalsh(L);p=v[v>1e-8]/np.sum(v);er=math.exp(-sum(p*np.log(p)));self.assertAlmostEqual(er,5)
        self.assertEqual(effective_diversity([[0,1,2]]*n)['effectiveRank'],0);self.assertGreater(effective_diversity([[0,1,2],[1,0,2],[2,1,0]])['effectiveRank'],1)
    def test_router_privacy_and_gates(self):
        r=Router();bad=dict(self.packet,rawPrivateTranscript='secret')
        with self.assertRaises(ValueError):r.route(bad)
        low=dict(self.packet,delta=.2);self.assertEqual(r.route(low)['reason'],'below_threshold')
        self.assertEqual(Router(budget=2).route(self.packet)['reason'],'communication_budget')
        e=r.route(self.packet);self.assertEqual(len(set(e['members'])),3);self.assertEqual(r.route(self.packet)['reason'],'cooldown')
    def test_coalition_dissolution_and_reviewed_learning(self):
        r=Router();e=r.route(self.packet)
        with self.assertRaises(ValueError):r.close(e['id'],{'kind':'Review','humanPromotion':True})
        r.close(e['id'],{'kind':'DescriptorProposal','results':None})
        with self.assertRaises(ValueError):r.close(e['id'],{'kind':'Review'})
        with self.assertRaises(ValueError):r.update('spectrum','gauge',{'gain':1,'cost':0,'evidence':'self_report'})
        up=r.update('spectrum','gauge',{'gain':1,'cost':0,'evidence':'held_out_measurement','reviewArtifactId':'TEST-only'});self.assertGreater(up['after'],up['before'])
        down=r.update('spectrum','gauge',{'gain':0,'cost':1,'evidence':'held_out_measurement','reviewArtifactId':'TEST-only'});self.assertLess(down['after'],down['before'])
        for _ in range(30):r.update('spectrum','gauge',{'gain':1,'cost':0,'evidence':'held_out_measurement','reviewArtifactId':'TEST-only'})
        self.assertLessEqual(r.weights['gauge|spectrum'],1)
    def test_cross_modal_probe_and_budgets(self):
        r=Router(budget=30)
        for i in range(6):
            e=r.route(dict(self.packet,eventId='unique-'+str(i)));self.assertEqual(e['status'],'opened');r.close(e['id'],{'kind':'Hypothesis'})
        self.assertTrue(r.events[4]['probe']);self.assertEqual(r.budget,12)
        arms=self.fixtureRun['archives']['swarm'];self.assertEqual({x['candidateEvaluations'] for x in arms},{28});self.assertEqual({x['scatteringSolves'] for x in arms},{196});self.assertTrue(all(x['llmTokens']==0 and x['aiSuperiority'] is None for x in arms))
    def test_actual_commitments(self):
        import hashlib
        folder=Path(__file__).resolve().parents[1]/'runs/strategic-coupling/agent-run/first-passes'
        self.assertEqual(len(list(folder.glob('*/commit.json'))),6)
        for role in ROLES:
            d=folder/role;raw=(d/'draft.json').read_bytes();salt=(d/'nonce.txt').read_text().strip();c=json.loads((d/'commit.json').read_text());self.assertEqual(hashlib.sha256((salt+'\n').encode()+raw).hexdigest(),c.get('commitment',c.get('sha256')))
    def test_adapter_visibility_and_four_arms(self):
        # A no-LLM protocol fixture tests boundaries, not scientific reasoning performance.
        adapter="""import json,sys
from pathlib import Path
x=json.load(sys.stdin)
with Path(sys.argv[1]).open('a') as f:f.write(json.dumps(x)+'\\n')
print(json.dumps({'published':{'kind':'Hypothesis','claim':'Recorded protocol fixture only','candidateIds':['X00'],'uncertainty':'No scientific inference','requestedTest':'External validation'},'private':{'secret':'private-'+x['worker']},'usage':{'total_tokens':0}}))
"""
        with tempfile.TemporaryDirectory() as tmp:
            root=Path(tmp);script=root/'adapter.py';script.write_text(adapter)
            for arm in ['single','broadcast','isolated','event']:
                log=root/(arm+'.jsonl');rt=Runtime(self.fixtureRun,['python',str(script),str(log)],root/arm,arm);summary=rt.run_protocol();self.assertEqual(summary['calls'],12);self.assertEqual(summary['tokens'],0);self.assertFalse(summary['sharedOntologyPromoted'])
                req=[json.loads(x) for x in log.read_text().splitlines()]
                for x in req[:6]:self.assertEqual(x['packet']['peerEvidence'],[])
                for x in req:
                    # No other worker's private state ever crosses the adapter boundary.
                    s=json.dumps(x['packet']['peerEvidence']);self.assertNotIn('private-',s)
                    if arm=='isolated':self.assertEqual(x['packet']['peerEvidence'],[])
                    view=x['packet']['view'];states=view.values() if arm=='single' else [view]
                    self.assertTrue(all(len(s['observations'])==2 for s in states),'Scope views to the discrepancy pair')
                if arm=='event':self.assertEqual(sum(x['packet'].get('coalition') is not None for x in req),3)
    def test_budget_failure_stops(self):
        with tempfile.TemporaryDirectory() as tmp:
            rt=Runtime(self.fixtureRun,['python','-c','raise RuntimeError("must not run")'],Path(tmp)/'new',token_cap=1,call_cap=2000)
            with self.assertRaisesRegex(ValueError,'reservation'):rt.run_protocol()
    def test_versioned_quality_archive(self):
        q=QDArchive('fixed-v1');a={'id':'a','niche':'one','quality':.5,'valid':True,'descriptorVersion':'fixed-v1'}
        self.assertTrue(q.offer(a));self.assertFalse(q.offer(dict(a,id='tie')));self.assertEqual(q.elites['one']['id'],'a')
        self.assertTrue(q.offer(dict(a,id='better',quality=.7)));self.assertFalse(q.offer(dict(a,id='invalid',valid=False,quality=1)))
        self.assertFalse(q.offer(dict(a,id='unscored',quality=None)))
        with self.assertRaises(ValueError):q.offer(dict(a,descriptorVersion='silent-new-axis'))
if __name__=='__main__':unittest.main()
