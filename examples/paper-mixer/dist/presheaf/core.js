// A finite constraint presheaf and a separate fixed-artifact availability functor.
// Scientific predicates are curated screens; arithmetic here does not validate physics.
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
export function safeUrl(value){try{const u=new URL(value);return ['https:','http:'].includes(u.protocol)?u.href:null;}catch{return null;}}
export function expressionKeys(expr){
  if(!expr||typeof expr!=='object')throw Error('Invalid constraint expression.');
  if(['eq','in'].includes(expr.op))return [expr.key];
  if(['all','any'].includes(expr.op))return [...new Set(expr.args.flatMap(expressionKeys))].sort();
  if(expr.op==='if')return [...new Set([expr.test,expr.then,expr.else].flatMap(expressionKeys))].sort();
  throw Error('Unsupported constraint operator: '+expr.op);
}
export function evaluate(expr,section){
  if(expr.op==='eq'||expr.op==='in'){
    if(!own(section,expr.key)||section[expr.key]===null)return null;
    return expr.op==='eq'?section[expr.key]===expr.value:expr.values.includes(section[expr.key]);
  }
  if(expr.op==='all'){const v=expr.args.map(x=>evaluate(x,section));return v.includes(false)?false:v.includes(null)?null:true;}
  if(expr.op==='any'){const v=expr.args.map(x=>evaluate(x,section));return v.includes(true)?true:v.includes(null)?null:false;}
  if(expr.op==='if'){const t=evaluate(expr.test,section);if(t!==null)return evaluate(t?expr.then:expr.else,section);const a=evaluate(expr.then,section),b=evaluate(expr.else,section);return a===b?a:null;}
  throw Error('Unsupported constraint operator.');
}
export function restrict(section,keys){
  const out={};for(const k of [...new Set(keys)].sort()){if(!own(section,k))throw Error('Restriction target is not contained in source: '+k);out[k]=section[k];}return out;
}
export function applicableConstraints(constraints,keys){const set=new Set(keys);return constraints.filter(c=>c.support.every(k=>set.has(k)));}
export function admissible(constraints,section){return Object.values(section).every(v=>v!==null)&&applicableConstraints(constraints,Object.keys(section)).every(c=>evaluate(c.expr,section)===true);}
export function mergeSections(sections){
  const merged={},conflicts=[];
  for(const s of sections)for(const [key,value] of Object.entries(s)){
    if(own(merged,key)&&merged[key]!==null&&value!==null&&merged[key]!==value)conflicts.push({key,left:merged[key],right:value});
    else if(!own(merged,key)||merged[key]===null)merged[key]=value;
  }
  return {merged,conflicts};
}
export function availableArtifacts(artifacts,keys){const set=new Set(keys);return artifacts.filter(a=>a.support.every(k=>set.has(k))).map(a=>a.id).sort();}
export function completionCounts(section,domains,constraints,limit=10000){
  const unknown=Object.keys(section).filter(k=>section[k]===null).sort();let total=0,accepted=0,witness=null,truncated=false;
  function visit(i,current){if(total>=limit){truncated=true;return;}if(i===unknown.length){total++;if(admissible(constraints,current)){accepted++;if(!witness)witness={...current};}return;}
    const key=unknown[i];if(!domains[key]?.length)throw Error('Missing finite domain: '+key);for(const v of domains[key]){visit(i+1,{...current,[key]:v});if(truncated)break;}}
  visit(0,{...section});return {total,accepted,rejected:total-accepted,truncated,witness};
}
export function validateModel(model){
  if(!model||!Array.isArray(model.ports)||!Array.isArray(model.bridges)||!Array.isArray(model.papers))throw Error('Model has no scoped paper records.');
  const ids=new Set(),paperIds=new Set(model.papers.map(p=>p.id)),contexts=new Set(model.contexts.map(c=>c.id)),domains={};
  if(paperIds.size!==model.papers.length)throw Error('Duplicate paper.');
  for(const p of model.papers)if(!safeUrl(p.url)||!Array.isArray(p.ports))throw Error('Invalid paper source or ports.');
  for(const p of model.ports){if(ids.has(p.id)||!paperIds.has(p.paperId)||!p.id.startsWith(p.paperId+'.'))throw Error('Duplicate or unscoped port.');ids.add(p.id);if(!Array.isArray(p.domain)||!p.domain.length||new Set(p.domain).size!==p.domain.length||p.domain.some(v=>typeof v!=='string'))throw Error('Invalid finite domain.');if(p.value!==null&&!p.domain.includes(p.value))throw Error('Observed value outside domain: '+p.id);if(!p.locator||!p.evidence||!p.boundary||!p.contextIds.every(x=>contexts.has(x)))throw Error('Missing evidence or context.');domains[p.id]=p.domain;}
  for(const p of model.papers)for(const id of p.ports)if(!ids.has(id)||!id.startsWith(p.id+'.'))throw Error('Paper port membership mismatch.');
  const bridgeIds=new Set();
  for(const b of model.bridges){if(bridgeIds.has(b.id)||ids.has(b.sharedKey)||!b.paperIds.every(p=>paperIds.has(p)))throw Error('Invalid bridge identity.');bridgeIds.add(b.id);ids.add(b.sharedKey);domains[b.sharedKey]=['bounded','stronger'];}
  function checkLiterals(expr){
    if(['eq','in'].includes(expr.op)){const values=expr.op==='eq'?[expr.value]:expr.values;if(!Array.isArray(values)||!values.length||values.some(v=>!domains[expr.key]?.includes(v)))throw Error('Constraint literal outside domain: '+expr.key);}
    else if(['all','any'].includes(expr.op)){if(!Array.isArray(expr.args)||!expr.args.length)throw Error('Empty constraint operation.');expr.args.forEach(checkLiterals);}
    else if(expr.op==='if')[expr.test,expr.then,expr.else].forEach(checkLiterals);
  }
  for(const b of model.bridges){const keys=expressionKeys(b.constraint.expr);if(!keys.length||keys.some(k=>!ids.has(k))||JSON.stringify(keys)!==JSON.stringify([...new Set(b.constraint.support)].sort()))throw Error('Constraint support differs from expression: '+b.id);if(!keys.includes(b.sharedKey)||!b.paperIds.every(id=>keys.some(k=>k.startsWith(id+'.'))))throw Error('Bridge does not cover each paper.');if(keys.some(k=>k!==b.sharedKey&&!b.paperIds.some(id=>k.startsWith(id+'.'))))throw Error('Bridge uses a port outside its paper cover.');checkLiterals(b.constraint.expr);}
  for(const a of model.artifacts||[])if(!a.support.every(k=>ids.has(k))||!safeUrl(a.url))throw Error('Invalid fixed artifact support or URL.');
  return model;
}
export function assessBridge(model,id,{mode='bounded',withhold=false,conflict=false}={}){
  if(!['bounded','stronger'].includes(mode))throw Error('Invalid scope mode.');
  const b=model.bridges.find(b=>b.id===id);if(!b)throw Error('Unknown bridge.');
  const ports=new Map(model.ports.map(p=>[p.id,p])),domains=Object.fromEntries(model.ports.map(p=>[p.id,p.domain]));domains[b.sharedKey]=['bounded','stronger'];
  const constraints=[b.constraint],keys=b.constraint.support;
  const withheldKey=withhold?keys.find(k=>ports.has(k)&&ports.get(k).value!==null)??null:null;
  const patches=b.paperIds.map((paperId,i)=>{
    const ownKeys=keys.filter(k=>k===b.sharedKey||k.startsWith(paperId+'.')).sort(),assignment={};
    for(const k of ownKeys)assignment[k]=k===b.sharedKey?(conflict&&i===1?(mode==='bounded'?'stronger':'bounded'):mode):k===withheldKey?null:ports.get(k).value;
    const localChecks=applicableConstraints(constraints,ownKeys).map(c=>({id:c.id,label:c.label,status:evaluate(c.expr,assignment)===true?'pass':evaluate(c.expr,assignment)===false?'fail':'unknown'}));
    return {paperId,keys:ownKeys,assignment,localChecks};
  });
  const overlaps=[];
  for(let i=0;i<patches.length;i++)for(let j=i+1;j<patches.length;j++){
    const a=patches[i],b=patches[j],common=a.keys.filter(k=>b.keys.includes(k)),conflicts=[],unresolved=[];
    for(const k of common){const x=a.assignment[k],y=b.assignment[k];if(x===null||y===null)unresolved.push(k);else if(x!==y)conflicts.push({key:k,left:x,right:y});}
    overlaps.push({left:a.paperId,right:b.paperId,keys:common,conflicts,unresolved});
  }
  const {merged,conflicts}=mergeSections(patches.map(p=>p.assignment));
  if(keys.some(k=>!own(merged,k))||Object.keys(merged).some(k=>!keys.includes(k)))throw Error('Local cover does not cover constraint support.');
  const checks=constraints.map(c=>({id:c.id,label:c.label,support:c.support,status:evaluate(c.expr,merged)===true?'pass':evaluate(c.expr,merged)===false?'fail':'unknown'}));
  const unknownKeys=Object.keys(merged).filter(k=>merged[k]===null);
  const completions=conflicts.length?{total:0,accepted:0,rejected:0,truncated:false,witness:null}:completionCounts(merged,domains,constraints);
  let status,message;
  if(conflicts.length){status='overlap_conflict';message='The selected local records disagree on the same scoped variable. This synthetic packet has no compatible merge.';}
  else if(patches.some(p=>p.localChecks.some(c=>c.status==='fail'))){status='local_failure';message='A selected local record already fails an applicable contract; this is not a gluing counterexample.';}
  else if(completions.truncated){status='unresolved';message='Completion budget reached; no complete compatibility conclusion is made.';}
  else if(completions.accepted===0){status='blocked';message='No completion of this selected packet passes the declared screen. This does not disprove the hypothesis or rule out other global sections.';}
  else if(unknownKeys.length){status='unresolved';message='Compatible completions exist, but relevant interface facts are unread or withheld. A possible completion is not observed evidence.';}
  else if(checks.every(c=>c.status==='pass')){status='compatible';message='The recorded interfaces pass this contract screen. This is consistency of the encoding, not empirical validation of a new scientific claim.';}
  else {status='unresolved';message='The available records do not establish every contract condition.';}
  const isGluingFailure=status==='blocked'&&unknownKeys.length===0&&patches.every(p=>Object.values(p.assignment).every(v=>v!==null)&&p.localChecks.every(c=>c.status==='pass'))&&overlaps.every(o=>o.conflicts.length===0&&o.unresolved.length===0);
  return {bridgeId:id,mode,status,message,patches,overlaps,merged,checks,completions,unknownKeys,withheldKey,isGluingFailure,restrictionTrace:patches.map(p=>({paperId:p.paperId,keys:[b.sharedKey],value:restrict(p.assignment,[b.sharedKey])})),artifacts:{local:patches.map(p=>({paperId:p.paperId,ids:availableArtifacts(model.artifacts||[],p.keys)})),union:availableArtifacts(model.artifacts||[],Object.keys(merged))}};
}
