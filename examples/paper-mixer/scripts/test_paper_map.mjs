// Dependency-free logic and DOM unit tests. This is not browser QA.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const code=await readFile(new URL('dist/paper-map/map.js',root),'utf8');
const core=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const rubric=JSON.parse(await readFile(new URL('runs/paper-map/rubric.json',root),'utf8'));
const profile=(id,group='Fedichev')=>({id,title:'Paper '+id,authors:['Reader A'],year:2026,status:'preprint',version:'v1',url:'https://example.org/'+id,group,summary:'Latent dynamics and an assay',novelty:{comparator:'Earlier representation',comparatorUrl:'https://example.org/prior',increment:'A testable capability',limit:'Does not identify a cause'},details:[{observation:'Normalization changes the endpoint',interpretation:'A measurement choice matters',boundary:'No independent reproduction',locator:'Methods §2'}],nextTest:'Measure on a held-out cohort.',coverage:{read:['Main text'],notRead:['Supplement']},references:[{title:'Read text',url:'https://example.org/text',scope:'Author manuscript'}],tags:{mechanism:['latent model'],scale:['organism'],evidence:['longitudinal data'],validation:['held-out cohort']},assessments:Object.fromEntries(rubric.axes.map(a=>[a.id,{score:2,confidence:'medium',rationale:'Primary text supports a scoped inference.',locator:'Fig. 2'}]))});
const a=profile('a'),b=profile('b','Gootenberg'),c=profile('c');b.tags.mechanism=['integrase'];b.tags.scale=['cell'];b.tags.evidence=['editing assay'];b.tags.validation=['junction sequencing'];c.assessments.conceptual.score=null;
const fixture={title:'Paper Map',date:'2026-10-15',limitations:['No experiment executed.'],rubric,papers:[a,b,c]};
assert.equal(core.validateProfiles(fixture),fixture);
for(const invalid of [-1,5,1.5,'2',undefined]){const bad=structuredClone(fixture);bad.papers[0].assessments.conceptual.score=invalid;assert.throws(()=>core.validateProfiles(bad),/assessment/);}
const duplicate=structuredClone(fixture);duplicate.papers[1].id='a';assert.throws(()=>core.validateProfiles(duplicate),/duplicate/);
assert.equal(core.safeUrl('https://example.org/a?q=1'),'https://example.org/a?q=1');
for(const url of ['javascript:alert(1)','data:text/html,test','file:///etc/passwd','/relative','https://','mailto:x@example.org'])assert.equal(core.safeUrl(url),null);
assert.deepEqual(core.filterPapers(fixture.papers,{group:'Gootenberg'}).map(p=>p.id),['b']);
assert.deepEqual(core.filterPapers(fixture.papers,{query:' LATENT normalization '}).map(p=>p.id),['a','b','c']);
assert.equal(core.filterPapers(fixture.papers,{query:'no such paper'}).length,0);
const layout=core.pointLayout(fixture.papers,'conceptual','observability');assert.deepEqual(layout.omitted,['c']);assert.equal(layout.points.length,2);assert.equal(layout.collisionGroups,1);assert(layout.points[1].displaced);assert(Math.hypot(layout.points[0].x-layout.points[1].x,layout.points[0].y-layout.points[1].y)>=26);
const crowded=Array.from({length:9},(_,i)=>profile('p'+i));for(const p of crowded){p.assessments.conceptual.score=0;p.assessments.observability.score=4;}
const packed=core.pointLayout(crowded,'conceptual','observability');for(let i=0;i<packed.points.length;i++)for(let j=i+1;j<packed.points.length;j++)assert(Math.hypot(packed.points[i].x-packed.points[j].x,packed.points[i].y-packed.points[j].y)>=26);
assert.deepEqual(core.pointLayout(crowded,'conceptual','observability'),packed,'Layout must be deterministic.');
assert.equal(core.pointLayout([c],'conceptual','observability').points.length,0,'Missing is never plotted at zero.');
const diffs=core.compareTags(a,b);assert.deepEqual(diffs.mechanism.onlyA,['latent model']);assert.deepEqual(diffs.mechanism.onlyB,['integrase']);assert.deepEqual(diffs.mechanism.shared,[]);
const brief=core.makePairBrief(a,b,'Use public data.');assert.match(brief,/Use public data/);assert.match(brief,/Does not identify a cause/);assert.match(brief,/covariates/);assert.match(brief,/not compatibility/);assert.match(brief,/did not run agents/);assert.throws(()=>core.makePairBrief(a,a),/different/);
assert(!code.includes('.innerHTML'),'Paper data must use safe DOM text construction.');
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.events={};this.dataset={};this.value='';this.hidden=false;this.style={setProperty:(k,v)=>{this.style[k]=v}};this.classList={add:()=>{}};}
 append(...items){this.children.push(...items);}replaceChildren(...items){this.children=[...items];}setAttribute(k,v){this.attrs[k]=v;}removeAttribute(k){delete this.attrs[k];}addEventListener(k,v){this.events[k]=v;}focus(){}select(){}click(){return this.events.click?.({target:this});}
}
const html=await readFile(new URL('dist/paper-map/index.html',root),'utf8');
const ids=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element('div')]));
ids.get('group-filter').value='all';
let data=fixture;try{data=JSON.parse(await readFile(new URL('dist/paper-map/papers.json',root),'utf8'));core.validateProfiles(data);}catch(error){if(error.code!=='ENOENT')throw error;}
// Include adversarial text to ensure it is retained literally, never interpreted as markup.
const displayed=structuredClone(data);displayed.papers[0].title='<img src=x onerror=alert(1)> '+displayed.papers[0].title;
globalThis.document={getElementById:id=>{assert(ids.has(id),'Unknown DOM ID '+id);return ids.get(id);},createElement:tag=>new Element(tag),createElementNS:(_ns,tag)=>new Element(tag),createTextNode:text=>({tag:'#text',textContent:String(text)})};
globalThis.fetch=async()=>({ok:true,json:async()=>displayed});
await import('data:text/javascript;base64,'+Buffer.from(code+'\n// DOM unit boot').toString('base64'));
await new Promise(r=>setImmediate(r));
assert.equal(ids.get('map-status').hidden,true,ids.get('map-status').textContent);
assert.equal(ids.get('map-content').hidden,false);
assert.equal(ids.get('paper-list').children.length,data.papers.length);
assert.equal(ids.get('matrix-body').children.length,data.papers.length);
assert.equal(ids.get('axis-rubric').children.length,8);
assert(ids.get('paper-list').children[0].children[0].children[1].children[0].textContent.startsWith('<img'),'Unsafe-looking text remains literal text.');
ids.get('group-filter').value=data.papers[0].group;ids.get('group-filter').events.change();assert.equal(ids.get('paper-list').children.length,data.papers.filter(p=>p.group===data.papers[0].group).length);
ids.get('paper-search').value='NO_MATCH_FOR_THIS_QUERY';ids.get('paper-search').events.input();assert.equal(ids.get('matrix-body').children[0].children[0].colSpan,9);assert.match(ids.get('paper-count').textContent,/^0 of /);
ids.get('reset-filters').click();assert.equal(ids.get('paper-list').children.length,data.papers.length);
ids.get('axis-x').value='controls';ids.get('axis-y').value='statistics';ids.get('axis-x').events.change();assert.match(ids.get('paper-plot').children[0].attrs['aria-label'],/Design and controls/);
ids.get('pair-a').value=data.papers[0].id;ids.get('pair-b').value=data.papers[0].id;ids.get('pair-a').events.change();assert.equal(ids.get('copy-pair').disabled,true);
ids.get('pair-b').value=data.papers[1].id;ids.get('pair-b').events.change();assert.equal(ids.get('copy-pair').disabled,false);
await ids.get('copy-pair').click();assert.equal(ids.get('brief-fallback').hidden,false);assert.match(ids.get('brief-fallback').value,/PAPER MIXER/);
// An HTTP error remains visible with a direct data link.
const oldStatus=ids.get('map-status');oldStatus.hidden=false;globalThis.fetch=async()=>({ok:false,status:503});
await import('data:text/javascript;base64,'+Buffer.from(code+'\n// DOM failure boot').toString('base64'));await new Promise(r=>setImmediate(r));assert.match(oldStatus.textContent,/HTTP 503/);
console.log(`Passed paper map logic + DOM units (${data.papers.length} profiles): rubric validation, safe URLs/text, filters/empty state, null exclusion, collision layout, comparison/brief, axis controls, clipboard fallback and load errors. No browser QA performed.`);
