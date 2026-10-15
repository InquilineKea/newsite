import copy,unittest
from replay import build
CFG={'targets':['organism'],'levers':['representation'],'rubric':['grounding','mechanism','falsifiability','feasibility'],'papers':[{'id':'a','family':'alife'},{'id':'b','family':'buehler'}]}
def candidate(id='p',round=0,parent=None):
    c={k:'Synthetic test fixture only' for k in ['title','mechanism','hypothesis','experiment','baseline','metric','falsifier','confound','feasibility']}
    return {**c,'id':id,'round':round,'parentIds':[] if parent is None else [parent],'changes':'Test revision','target':'organism','lever':'representation','sourceIds':['a','b'],'sources':[{'paperId':p,'locator':'fixture','use':'test','boundary':'not a real paper'} for p in ['a','b']]}
def feedback(id,score):return [{'candidateId':id,'critic':n,'scores':dict.fromkeys(CFG['rubric'],score),'nicheFit':True,'fatal':False,'feedback':'fixture','revision':'fixture'} for n in ['evidence','feasibility']]
class ArchiveTests(unittest.TestCase):
    def test_weak_grounding_cannot_be_offset_by_other_scores(self):
        ev=feedback('p',4);ev[0]['scores']['grounding']=1
        scores,snapshots,_=build(CFG,[candidate()],ev)
        self.assertFalse(scores['p']['eligible']);self.assertEqual(snapshots[0]['coverage'],0)
    def test_low_quality_child_does_not_replace_parent(self):
        _,s,e=build(CFG,[candidate(),candidate('child',1,'p')],feedback('p',3)+feedback('child',2))
        self.assertEqual(s[-1]['archive'][0]['candidateId'],'p');self.assertFalse(e[-1]['accepted'])
    def test_equal_score_retains_incumbent(self):
        _,s,_=build(CFG,[candidate(),candidate('other')],feedback('p',3)+feedback('other',3))
        self.assertEqual(s[0]['archive'][0]['candidateId'],'p')
    def test_higher_quality_child_replaces_and_preserves_lineage(self):
        _,s,e=build(CFG,[candidate(),candidate('child',1,'p')],feedback('p',2)+feedback('child',4))
        self.assertEqual(s[-1]['archive'][0]['candidateId'],'child');self.assertEqual(e[-1]['replaced'],'p')
    def test_single_critic_cannot_fill_niche(self):
        with self.assertRaises(AssertionError):build(CFG,[candidate()],feedback('p',4)[:1])
    def test_one_domain_and_unknown_sources_rejected(self):
        c=candidate();c['sourceIds']=['a'];c['sources']=c['sources'][:1]
        with self.assertRaises(AssertionError):build(CFG,[c],feedback('p',4))
    def test_parent_must_precede_revision(self):
        with self.assertRaises(AssertionError):build(CFG,[candidate('child',1,'missing')],feedback('child',4))

class CorpusPolicyTests(unittest.TestCase):
    def config(self):
        c=copy.deepcopy(CFG);c['targets']=['ai','economics'];c['papers']=[{'id':'a','family':'ai'},{'id':'b','family':'psychology'}];c['sourceRequirements']={'minimumDistinctPapers':2,'minimumDistinctFamilies':2,'requiredFamilies':[],'requireTargetFamily':True};return c
    def test_cross_domain_transfer_can_replace_old_family_rule(self):
        c=candidate();c['target']='ai';_,s,_=build(self.config(),[c],feedback('p',3));self.assertEqual(s[0]['coverage'],1)
    def test_target_domain_must_be_represented(self):
        c=candidate();c['target']='economics'
        with self.assertRaises(AssertionError):build(self.config(),[c],feedback('p',3))
    def test_two_papers_in_one_family_do_not_count_as_cross_domain(self):
        cfg=self.config();cfg['papers'][1]['family']='ai';c=candidate();c['target']='ai'
        with self.assertRaises(AssertionError):build(cfg,[c],feedback('p',3))
    def test_attention_is_not_a_quality_bonus(self):
        one=candidate();two=candidate('popular');two['citationCount']=1000000;two['attention']='viral'
        _,s,_=build(CFG,[one,two],feedback('p',3)+feedback('popular',2));self.assertEqual(s[0]['archive'][0]['candidateId'],'p')

if __name__=='__main__':unittest.main()
