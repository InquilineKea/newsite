// DOM unit harness, not interactive browser QA.
import {readFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
const root=new URL('../',import.meta.url);
const data=JSON.parse(await readFile(new URL('dist/run.json',root),'utf8'));
const code=await readFile(new URL('dist/app.js',root),'utf8');
const core=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
assert.equal(core.validateRun(data),data);
for(const c of data.candidates){
 const ev=data.evaluations.filter(e=>e.candidateId===c.id);
 assert.equal(core.meanQuality(ev),data.scores[c.id].quality);
 assert.equal(core.candidateEligible(c,ev,data.config.papers),data.scores[c.id].eligible);
}
assert.equal(core.filterCandidates(data.candidates,{selectedSources:new Set(),evaluations:data.evaluations,papers:data.config.papers}).length,0);
const all=new Set(data.config.papers.map(p=>p.id));
assert.equal(core.filterCandidates(data.candidates,{selectedSources:all}).length,data.candidates.length);
const sourceOnly=core.filterCandidates(data.candidates,{selectedSources:new Set(['LENIA'])});
assert(sourceOnly.every(c=>c.sourceIds.includes('LENIA')));
assert.equal(core.summarizeArchive(data.archive).qdScore,data.snapshots.at(-1).qdScore);
class Element{
 constructor(tag){this.tag=tag;this.children=[];this.attrs={};this.events={};this.dataset={};this.style={};this.value='';this.hidden=false;this.classes=new Set();this.classList={add:x=>this.classes.add(x),toggle:(x,v)=>v?this.classes.add(x):this.classes.delete(x)};}
 append(...a){this.children.push(...a)}replaceChildren(...a){this.children=[...a]}setAttribute(k,v){this.attrs[k]=v}removeAttribute(k){delete this.attrs[k]}addEventListener(k,v){this.events[k]=v}scrollIntoView(){}focus(){}select(){}click(){this.events.click?.({target:this})}
}
const html=await readFile(new URL('dist/index.html',root),'utf8');
const ids=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element('div')]));
globalThis.document={getElementById:id=>{assert(ids.has(id),'Unknown DOM ID '+id);return ids.get(id)},createElement:tag=>new Element(tag)};
globalThis.window={matchMedia:()=>({matches:false})};
globalThis.fetch=async()=>({ok:true,json:async()=>data});
await import('data:text/javascript;base64,'+Buffer.from(code+'\n// DOM harness').toString('base64'));
await new Promise(r=>setImmediate(r));
assert.equal(ids.get('load-status').hidden,true,ids.get('load-status').textContent);
assert.equal(ids.get('experiment').hidden,false);
assert.equal(ids.get('archive').children.filter(e=>e.tag==='button').length,12);
assert.equal(ids.get('candidate-list').children.length,data.candidates.length);
ids.get('sources-clear').click();assert.equal(ids.get('candidate-list').children.length,1);assert.match(ids.get('candidate-count').textContent,/^0 /);
ids.get('sources-reset').click();assert.equal(ids.get('candidate-list').children.length,data.candidates.length);
ids.get('round-controls').children[0].click();assert.equal(ids.get('archive').children.filter(e=>e.tag==='button').length,12);
ids.get('status-filter').events.change({target:{value:'elites'}});assert.equal(ids.get('candidate-list').children.length,data.snapshots[0].coverage);
console.log('Passed: actual-data quality parity, eligibility, source filters, rendered archive/detail, source clear/reset, round switching and elite filter. Browser click QA unavailable.');
