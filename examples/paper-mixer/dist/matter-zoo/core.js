export const kinds=['Hypothesis','Design','Calculation','DescriptorProposal','SchemaProposal','Review'];
export function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null;}catch{return null;}}
export function restrict(record,keys){return Object.fromEntries(keys.filter(k=>Object.hasOwn(record,k)).map(k=>[k,record[k]]));}
export function overlap(a,b){const shared=Object.keys(a).filter(k=>Object.hasOwn(b,k));return {conflicts:shared.filter(k=>a[k]!==null&&b[k]!==null&&JSON.stringify(a[k])!==JSON.stringify(b[k])),unknown:shared.filter(k=>a[k]===null||b[k]===null)};}
export function template(kind='Hypothesis'){
 return {schemaVersion:'matter-zoo-extension/1.0',artifactId:'REPLACE_WITH_UNIQUE_ID',kind,producer:{agent:'REPLACE_WITH_AGENT',method:'REPLACE_WITH_METHOD',evidence:'REPLACE_WITH_EVIDENCE',assumptions:'REPLACE_WITH_ASSUMPTIONS',runtimeOverlap:'Declare shared model/tools/data or unknown'},sourceSections:['S22'],parentArtifactIds:[],family:'mechanical',evidenceLevel:'proposal',status:'proposed',claim:'REPLACE_WITH_CLAIM',payload:kind==='SchemaProposal'?{oldVersion:'matter-zoo/1.0',proposedChange:null,counterexample:null,migration:null,adversarialTests:[]}:kind==='Calculation'?{codeRef:null,parameters:null,seed:null,solver:null,convergence:null,outputs:null}:kind==='DescriptorProposal'?{formula:null,units:null,domain:null,normalization:null,robustnessTests:[]}:kind==='Review'?{targetArtifactId:null,competingExplanation:null,checks:[],outcome:null}:{design:null,alternative:null,discriminatingTest:null,failureCriterion:null},sources:[],validation:{status:'unrun',controls:[],limitations:['No calculation or experiment has been executed.']},results:null};
}
export function validateExtension(x){
 const errors=[];const nonempty=v=>typeof v==='string'&&v.trim().length>0&&!v.includes('REPLACE_WITH');
 if(!x||typeof x!=='object'||Array.isArray(x))return ['Packet must be an object.'];
 if(x.schemaVersion!=='matter-zoo-extension/1.0')errors.push('Unknown extension schema version.');
 if(!nonempty(x.artifactId)||!/^[A-Za-z0-9_-]{3,100}$/.test(x.artifactId||''))errors.push('Provide a unique artifactId using letters, digits, underscore or hyphen.');
 if(!kinds.includes(x.kind))errors.push('Unknown artifact kind.');
 for(const k of ['agent','method','evidence','assumptions','runtimeOverlap'])if(!nonempty(x.producer?.[k]))errors.push('Declare producer.'+k+'.');
 if(!['mechanical','tight_binding','photonic','cross_family'].includes(x.family))errors.push('Declare the model family.');
 if(!['proposal','simulation','experiment'].includes(x.evidenceLevel))errors.push('Declare evidenceLevel.');
 if(!['proposed','completed','failed','inconclusive'].includes(x.status))errors.push('Invalid status.');
 if(!nonempty(x.claim))errors.push('Provide the scoped claim.');
 if(!Array.isArray(x.sourceSections)||!x.sourceSections.length||x.sourceSections.some(v=>!/^S(?:[1-9]|1[0-9]|2[0-7])$/.test(v)))errors.push('Link sourceSections S1–S27.');
 if(!Array.isArray(x.parentArtifactIds)||x.parentArtifactIds.some(v=>!nonempty(v)))errors.push('parentArtifactIds must be an array of IDs.');
 if(!x.payload||typeof x.payload!=='object'||Array.isArray(x.payload))errors.push('Provide a payload object.');
 if(!Array.isArray(x.sources)||x.sources.some(v=>!safeUrl(v)))errors.push('sources must be HTTPS URLs.');
 if(!['unrun','passed','failed','inconclusive'].includes(x.validation?.status)||!Array.isArray(x.validation?.controls)||!Array.isArray(x.validation?.limitations))errors.push('Provide validation status, controls and limitations.');
 if(x.status==='proposed'&&(x.results!==null||x.evidenceLevel!=='proposal'||x.validation?.status!=='unrun'))errors.push('A proposed packet has null results, proposal evidence and unrun validation.');
 if(x.status!=='proposed'&&(!x.sources?.length||!x.validation?.limitations?.length||!x.validation?.controls?.length))errors.push('Executed/reviewed packets need source artifacts, controls and limitations.');
 if(['failed','inconclusive'].includes(x.status)&&!['numerical_failure','implementation_error','physical_refutation','missing_data','underpowered_test','not_determined'].includes(x.payload?.failureClass))errors.push('Classify the failure or uncertainty in payload.failureClass; numerical failure is not physical refutation.');
 if(x.kind==='Calculation'&&x.status!=='proposed'){
  for(const k of ['codeRef','parameters','seed','solver','convergence','outputs'])if(x.payload?.[k]===null||x.payload?.[k]===undefined)errors.push('Executed calculation needs payload.'+k+'.');
  if(x.evidenceLevel!=='simulation')errors.push('A calculation reports simulation evidence.');
  if(x.status==='completed'&&(x.results===null||x.results===undefined))errors.push('Completed calculation requires results.');
 }
 if(x.kind==='SchemaProposal')for(const k of ['oldVersion','proposedChange','counterexample','migration','adversarialTests'])if(!Object.hasOwn(x.payload||{},k))errors.push('Schema proposal needs '+k+'.');
 if(x.family==='cross_family'&&!x.payload?.transferContract)errors.push('Cross-family comparison needs an explicit transferContract.');
 return errors;
}
export function validateProgram(p){if(p?.schemaVersion!=='matter-zoo/1.0'||p.sections?.length!==27||p.specialties?.length!==23||!p.types?.length||!p.tasks?.length||!p.experiments?.length)throw Error('Incomplete program record');const ids=new Set(p.tasks.map(x=>x.id));for(const t of p.tasks)for(const d of t.dependencies)if(!ids.has(d))throw Error('Unknown task dependency');return p;}
