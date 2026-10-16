// Mathematical property fixtures and actual-packet regressions, not theorem-prover certification.
import assert from 'node:assert/strict';
import fs from 'node:fs';
const root=new URL('../',import.meta.url),read=p=>fs.readFileSync(new URL(p,root),'utf8');
const code=read('dist/presheaf/core.js'),core=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const model=core.validateModel(JSON.parse(read('dist/presheaf/model.json')));
let identity=0,composition=0,closure=0,availability=0,actualPackets=0;
const eq=(key,value)=>({op:'eq',key,value}),all=(...args)=>({op:'all',args}),any=(...args)=>({op:'any',args});
const equality={id:'equal',support:['x','y'],expr:any(all(eq('x','0'),eq('y','0')),all(eq('x','1'),eq('y','1')))};
const vars=['x','y','z'],subsets=Array.from({length:8},(_,mask)=>vars.filter((_,i)=>mask&(1<<i)));
const assignments=keys=>keys.reduce((acc,k)=>acc.flatMap(s=>['0','1'].map(v=>({...s,[k]:v}))),[{}]);
for(const U of subsets)for(const s of assignments(U)){
  assert.deepEqual(core.restrict(s,U),s);identity++;
  for(const V of subsets.filter(v=>v.every(k=>U.includes(k)))){
    if(core.admissible([equality],s)){assert(core.admissible([equality],core.restrict(s,V)));closure++;}
    for(const W of subsets.filter(w=>w.every(k=>V.includes(k)))){assert.deepEqual(core.restrict(core.restrict(s,V),W),core.restrict(s,W));composition++;}
  }
}
assert.deepEqual(core.restrict({x:'0'},[]),{});assert.throws(()=>core.restrict({x:'0'},['y']),/contained/);
assert.equal(core.admissible([equality],{x:null}),false,'A partial observation is not a total section.');
const locals=[{x:'0'},{y:'1'}];assert(locals.every(s=>core.admissible([equality],s)));
const badGlue=core.mergeSections(locals);assert.equal(badGlue.conflicts.length,0);assert(!core.admissible([equality],badGlue.merged));
assert(core.admissible([equality],{x:'0',y:'0'}),'Other global sections still exist.');
assert(core.admissible([equality],{x:'1',y:'1'}));
assert(core.mergeSections([{x:'0'},{x:'1'}]).conflicts.length===1);
assert.deepEqual(core.mergeSections([{x:null},{x:'0'}]).merged,{x:'0'});
const artifacts=[{id:'a',support:['x']},{id:'joint',support:['x','y']}];
for(const U of subsets)for(const V of subsets.filter(v=>U.every(k=>v.includes(k)))){const a=core.availableArtifacts(artifacts,U),b=core.availableArtifacts(artifacts,V);assert(a.every(x=>b.includes(x)));availability++;}
assert(!core.availableArtifacts(artifacts,['x']).includes('joint'));assert(core.availableArtifacts(artifacts,['x','y']).includes('joint'));
assert.deepEqual(core.completionCounts({x:null,y:'1'},{x:['0','1'],y:['0','1']},[equality]).accepted,1);
assert.equal(core.evaluate(all(eq('x','0'),eq('y','0')),{x:'1',y:null}),false);
assert.equal(core.evaluate(any(eq('x','0'),eq('y','0')),{x:'0',y:null}),true);
assert.equal(core.evaluate(eq('x','0'),{x:null}),null);
assert.equal(core.completionCounts({x:null},{x:['0','1']},[],1).truncated,true);
assert.equal(model.papers.length,18);assert.equal(model.ports.length,109);
const results=[];
for(const b of model.bridges){
  for(const mode of ['bounded','stronger'])for(const options of [{},{withhold:true},{conflict:true}]){
    const result=core.assessBridge(model,b.id,{mode,...options});actualPackets++;
    assert.deepEqual(Object.keys(result.merged).sort(),[...b.constraint.support].sort());
    if(options.conflict)assert.equal(result.status,'overlap_conflict');
    if(result.status==='compatible')assert(result.checks.every(c=>c.status==='pass')&&result.unknownKeys.length===0);
    if(result.isGluingFailure){assert(result.status==='blocked');assert(result.patches.every(p=>Object.values(p.assignment).every(v=>v!==null)));assert(result.overlaps.every(o=>!o.conflicts.length&&!o.unresolved.length));}
    for(const p of result.patches){assert.deepEqual(core.restrict(p.assignment,p.keys),p.assignment);for(const trace of result.restrictionTrace.filter(t=>t.paperId===p.paperId))assert.deepEqual(core.restrict(p.assignment,trace.keys),trace.value);}
    results.push({bridgeId:b.id,mode,scenario:options.conflict?'synthetic_overlap_conflict':options.withhold?'withheld_fact':'recorded',status:result.status,isGluingFailure:result.isGluingFailure,unknownKeys:result.unknownKeys,completions:{total:result.completions.total,accepted:result.completions.accepted,truncated:result.completions.truncated}});
  }
}
assert.equal(core.assessBridge(model,'partial_embodiment').status,'unresolved');
assert.equal(core.assessBridge(model,'modal_contract',{mode:'stronger'}).isGluingFailure,true);
assert.equal(core.assessBridge(model,'partial_embodiment',{mode:'stronger'}).isGluingFailure,false);
const outside=structuredClone(model),b=outside.bridges[0];b.constraint.expr.else.args.push(eq('COLLAGEN.evidence','physics_simulation'));b.constraint.support=core.expressionKeys(b.constraint.expr);assert.throws(()=>core.validateModel(outside),/outside its paper cover/,'Regression: no silent inapplicable constraint.');
assert.throws(()=>core.assessBridge(outside,b.id),/cover does not cover/);
const typo=structuredClone(model);typo.bridges[0].constraint.expr.then.args[0].value='misspelled';assert.throws(()=>core.validateModel(typo),/literal outside domain/);
const incomplete=structuredClone(model);incomplete.bridges[0].constraint.support.pop();assert.throws(()=>core.validateModel(incomplete),/support differs/);
const wrong=structuredClone(model);wrong.ports[0].value='not-in-domain';assert.throws(()=>core.validateModel(wrong),/outside domain/);
for(const url of ['javascript:alert(1)','data:text/html,x','file:///tmp/test'])assert.equal(core.safeUrl(url),null);
const checks={date:'2026-10-16',status:'passed',formalScope:'Finite-fixture property checks and actual packet regressions; no exhaustive enumeration of the full powerset base and no theorem-prover certification.',tests:{identity,composition,restrictionClosure:closure,covariantAvailability:availability,actualPacketScenarios:actualPackets,validGluingCounterexample:true,otherGlobalSectionsPreserved:true,unknownNotEvidence:true,malformedCoverRegression:true,domainLiteralValidation:true},results,browserQA:'Unavailable; no browser QA performed.'};
if(process.argv.includes('--write'))fs.writeFileSync(new URL('dist/presheaf/checks.json',root),JSON.stringify(checks,null,2)+'\n');
console.log(JSON.stringify(checks.tests));
