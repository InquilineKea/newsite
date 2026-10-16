// Dependency-free DOM units with the actual finite model. This is not browser QA.
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const root=new URL('../dist/presheaf/',import.meta.url);
const [html,code,coreCode,modelText]=await Promise.all(['index.html','presheaf.js','core.js','model.json'].map(name=>readFile(new URL(name,root),'utf8')));
const coreUrl='data:text/javascript;base64,'+Buffer.from(coreCode).toString('base64');
const uiCode=code.replace("'./core.js'",JSON.stringify(coreUrl));
const ui=await import('data:text/javascript;base64,'+Buffer.from(uiCode).toString('base64'));
const core=await import(coreUrl),actual=JSON.parse(modelText);
core.validateModel(actual);
assert.equal(actual.papers.length,18);assert.equal(actual.contexts.length,5);assert.equal(actual.bridges.length,8);
assert(!code.includes('.innerHTML'),'Paper text must not become HTML.');
for(const path of ['model.json','report.md','audit.json','provenance.json','checks.json','presheaf-bundle.zip'])assert(html.includes('href="./'+path+'" download'),'Download link for '+path);
for(const path of ['../','../controversies/','../paper-map/','../buehler/','./'])assert(html.includes('href="'+path+'"'),'Navigation to '+path);
class Element {
  constructor(tag){this.tag=tag;this.children=[];this.events={};this.attrs={};this.dataset={};this.textContent='';this.value='';this.hidden=false;this.checked=false;}
  append(...children){this.children.push(...children);}
  replaceChildren(...children){this.children=[...children];this.textContent='';}
  setAttribute(key,value){this.attrs[key]=value;}
  addEventListener(key,fn){this.events[key]=fn;}
  click(){return this.events.click?.({target:this});}
}
function dom(){const ids=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element('div')]));ids.get('mode-bounded').checked=true;ids.get('explorer-content').hidden=true;return {ids,document:{getElementById:id=>{assert(ids.has(id),'Unknown DOM id '+id);return ids.get(id);},createElement:tag=>new Element(tag)}};}
const allText=node=>[node.textContent||'',...(node.children||[]).map(allText)].join(' ');
const descendants=node=>[node,...node.children.flatMap(descendants)];
const model=structuredClone(actual);model.papers[0].title='<img src=x onerror=alert(1)> '+model.papers[0].title;model.references.push({title:'Unsafe reference',url:'javascript:alert(1)',scope:'Display as literal text without a link.'});
const {ids,document}=dom();
const app=await ui.mountPresheaf(document,async()=>({ok:true,json:async()=>model}));assert(app);
assert.equal(ids.get('explorer-content').hidden,false);assert.equal(ids.get('load-status').hidden,true);
assert.equal(ids.get('paper-rows').children.length,18);assert.equal(ids.get('context-filters').children.length,6);assert.equal(ids.get('bridge-select').children.length,8);
assert(allText(ids.get('paper-detail')).includes('<img src=x onerror=alert(1)>'),'Markup appears literally.');
assert(!descendants(ids.get('references')).some(n=>n.href?.startsWith('javascript:')),'Unsafe reference URL never becomes a link.');
const scopeCounts=[];
for(const context of model.contexts){const button=ids.get('context-filters').children.find(b=>b.dataset.context===context.id);button.click();const visible=ui.visiblePapers(model,context.id),scope=ui.contextScope(model,context.id);scopeCounts.push(scope.length);assert.equal(ids.get('paper-rows').children.length,visible.length);assert.equal(ids.get('context-question').textContent,context.question);assert.deepEqual(JSON.parse(ids.get('context-scope').textContent),scope);assert.equal(button.attrs['aria-pressed'],'true');assert(allText(ids.get('context-stats')).includes(scope.length+' literal variables'));for(const paper of visible)assert(allText(ids.get('paper-rows')).includes(paper.title));}
assert(new Set(scopeCounts).size>1,'Factor views have different literal variable scopes.');
ids.get('context-filters').children[0].click();assert.equal(ids.get('paper-rows').children.length,18);
ids.get('paper-rows').children.at(-1).children[0].children[0].click();assert(allText(ids.get('paper-detail')).includes(model.papers.at(-1).title));assert(allText(ids.get('paper-detail')).includes('Reading coverage:'));
for(const bridge of model.bridges){
  ids.get('bridge-select').value=bridge.id;ids.get('mode-stronger').checked=false;ids.get('mode-bounded').checked=true;ids.get('withhold-fact').checked=false;ids.get('overlap-conflict').checked=false;ids.get('bridge-select').events.change();
  const expected=core.assessBridge(model,bridge.id,{mode:'bounded'});assert.equal(ids.get('assessment-status').dataset.status,expected.status);assert.equal(ids.get('local-records').children.length,bridge.paperIds.length);assert.deepEqual(JSON.parse(ids.get('restriction-trace').textContent),expected.restrictionTrace);assert.deepEqual(JSON.parse(ids.get('merged-trace').textContent),expected.merged);assert(allText(ids.get('bridge-claim')).includes(bridge.boundedClaim));assert(allText(ids.get('constraint-records')).includes(bridge.constraint.support[0]));
  ids.get('mode-stronger').checked=true;ids.get('mode-bounded').checked=false;ids.get('mode-stronger').events.change();const strong=core.assessBridge(model,bridge.id,{mode:'stronger'});assert.equal(ids.get('assessment-status').dataset.status,strong.status);assert(allText(ids.get('bridge-claim')).includes(bridge.strongerClaim));if(strong.isGluingFailure)assert(allText(ids.get('assessment-status')).includes('Modeled gluing failure'));
}
ids.get('bridge-select').value=model.bridges[0].id;ids.get('mode-stronger').checked=false;ids.get('mode-bounded').checked=true;ids.get('withhold-fact').checked=true;ids.get('withhold-fact').events.change();const missing=core.assessBridge(model,model.bridges[0].id,{withhold:true});assert.equal(ids.get('assessment-status').dataset.status,missing.status);assert(allText(ids.get('assessment-status')).includes('Temporary missingness: '+missing.withheldKey));assert(allText(ids.get('unknown-keys')).includes(missing.withheldKey));assert.equal(JSON.parse(ids.get('merged-trace').textContent)[missing.withheldKey],null);
ids.get('withhold-fact').checked=false;ids.get('overlap-conflict').checked=true;ids.get('overlap-conflict').events.change();assert.equal(ids.get('assessment-status').dataset.status,'overlap_conflict');assert(allText(ids.get('assessment-status')).includes('Synthetic demonstration is active'));assert(allText(ids.get('overlap-records')).includes('Conflicts: 1'));
ids.get('overlap-conflict').checked=false;ids.get('overlap-conflict').events.change();assert.equal(ids.get('assessment-status').dataset.status,'compatible');assert.equal(JSON.stringify(model.ports),JSON.stringify(actual.ports),'Interactive demonstrators do not alter saved paper facts.');
assert(allText(ids.get('artifact-availability')).includes('Availability on the joint scope:'));assert(allText(ids.get('math-notes')).length>200);assert(ids.get('references').children.length>0);
for(const failure of [async()=>({ok:false,status:503}),async()=>({ok:true,json:async()=>({...actual,papers:[]})}),async()=>{throw Error('Network disconnected');}]){const failed=dom();assert.equal(await ui.mountPresheaf(failed.document,failure),null);assert.equal(failed.ids.get('explorer-content').hidden,true);assert.match(failed.ids.get('load-status').textContent,/could not be loaded/);}
console.log('Passed actual-model Presheaf DOM units: 18 papers, five factor scopes, eight bridges, modes, restriction traces, missingness, synthetic conflict, literal text, safe links, downloads and load failures. No browser QA performed.');
