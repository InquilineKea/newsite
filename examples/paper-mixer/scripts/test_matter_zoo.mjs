import assert from 'node:assert/strict';
import {readFile,mkdtemp,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const root=new URL('../dist/matter-zoo/',import.meta.url);
const [html,code,core,raw]=await Promise.all(['index.html','zoo.js','core.js','program.json'].map(f=>readFile(new URL(f,root),'utf8')));
const coreUrl='data:text/javascript;base64,'+Buffer.from(core).toString('base64');
const {template,validateExtension,validateProgram,restrict,overlap}=await import(coreUrl);
const {mountZoo}=await import('data:text/javascript;base64,'+Buffer.from(code.replace("'./core.js'",JSON.stringify(coreUrl))).toString('base64'));
const p=validateProgram(JSON.parse(raw));
assert.equal(p.types.length,19);assert.equal(p.hypotheses.length,7);assert.equal(p.tasks.length,6);assert.equal(p.roadmap.length,14);
for(const e of p.experiments){assert.equal(e.results,null);assert.equal(e.status,'planned_not_run');assert(e.baseline&&e.controls.length&&e.failureCriterion);}
assert(!code.includes('.innerHTML'));const paths=['program.json','source.md','extension.schema.json','AGENT_GUIDE.md','audit.json','matter-zoo-bundle.zip'];for(const f of paths)assert(html.includes('href="./'+f+'" download'));
assert.deepEqual(restrict({a:1,b:2,c:3},['b','a']),{b:2,a:1});assert.deepEqual(restrict(restrict({a:1,b:2,c:3},['a','b']),['a']),restrict({a:1,b:2,c:3},['a']));assert.deepEqual(overlap({family:'mechanical',units:null},{family:'photonic',units:'eV'}),{conflicts:['family'],unknown:['units']});
const valid=()=>{const x=template();x.artifactId='test-counterexample-001';x.claim='Test whether a putative new channel survives a damping sweep.';for(const k of Object.keys(x.producer))x.producer[k]='Declared '+k;return x;};
assert(validateExtension(template()).length>3);assert.deepEqual(validateExtension(valid()),[]);
for(const change of [x=>x.results={invented:3},x=>x.sources=['javascript:alert(1)'],x=>x.sourceSections=['S28'],x=>x.family='cross_family',x=>x.parentArtifactIds='bad',x=>x.producer=null]){const x=valid();change(x);assert(validateExtension(x).length>0);}
const calc=valid();calc.kind='Calculation';calc.status='completed';calc.evidenceLevel='simulation';calc.sources=['https://example.org/run'];calc.validation.controls=['Analytic baseline'];calc.validation.limitations=['Only toy model'];assert(validateExtension(calc).length>0);Object.assign(calc.payload,{codeRef:'abc123',parameters:{mass:1},seed:0,solver:'test fixture',convergence:{residual:1e-9},outputs:['https://example.org/matrix']});calc.results={toy:1};assert.deepEqual(validateExtension(calc),[]);calc.status='failed';calc.results=null;assert(validateExtension(calc).length);calc.payload.failureClass='numerical_failure';assert.deepEqual(validateExtension(calc),[]);
class Element{constructor(tag){this.tag=tag;this.children=[];this.events={};this.attrs={};this.dataset={};this.textContent='';this.value='';this.hidden=false;}append(...x){this.children.push(...x);}replaceChildren(...x){this.children=[...x];this.textContent='';}setAttribute(k,v){this.attrs[k]=v;}addEventListener(k,v){this.events[k]=v;}click(){return this.events.click?.({target:this});}}
function dom(){const ids=new Map([...html.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element('div')]));ids.get('zoo-content').hidden=true;return {ids,document:{getElementById:id=>{assert(ids.has(id),'Unknown ID '+id);return ids.get(id);},createElement:tag=>new Element(tag)}};}
const text=n=>[n.textContent,...n.children.map(text)].join(' '),downloads=[];
const {ids,document}=dom();const model=structuredClone(p);model.hypotheses[0].claim='<img onerror=alert(1)> literal hypothesis';
const app=await mountZoo(document,async()=>({ok:true,json:async()=>model}),(name,value)=>downloads.push({name,value}));assert(app);assert.equal(ids.get('zoo-content').hidden,false);assert.equal(ids.get('load-status').hidden,true);
assert.equal(ids.get('source-sections').children.length,27);assert.equal(ids.get('tasks').children.length,6);assert.equal(ids.get('specialties').children.length,23);assert.equal(ids.get('types').children.length,19);assert(text(ids.get('hypotheses')).includes('<img onerror=alert(1)>'));
for(const b of ids.get('view-nav').children){b.click();assert.equal(ids.get(b.dataset.view).hidden,false);assert.equal(b.attrs['aria-pressed'],'true');}
for(const e of p.experiments){ids.get('experiment-select').value=e.id;ids.get('experiment-select').events.change();assert(text(ids.get('experiment-detail')).includes(e.failureCriterion));ids.get('download-experiment').click();assert.equal(downloads.at(-1).value.id,e.id);}
for(const t of p.tasks){ids.get('task-select').value=t.id;ids.get('task-select').events.change();assert.equal(JSON.parse(ids.get('worker-brief').textContent).task,t.id);ids.get('download-task').click();assert.equal(downloads.at(-1).value.task,t.id);}
ids.get('source-search').value='resolvent';ids.get('source-search').events.input();assert(ids.get('source-sections').children.length>0&&ids.get('source-sections').children.length<27);
ids.get('extension-editor').value='{';ids.get('validate-extension').click();assert.equal(ids.get('extension-status').dataset.status,'error');ids.get('extension-editor').value=JSON.stringify(valid());ids.get('download-extension').click();assert.equal(ids.get('extension-status').dataset.status,'valid');assert.equal(downloads.at(-1).value.artifactId,valid().artifactId);
const bad=dom();assert.equal(await mountZoo(bad.document,async()=>({ok:false,status:503}),()=>{}),null);assert.equal(bad.ids.get('zoo-content').hidden,true);
const tmp=await mkdtemp(join(tmpdir(),'matter-zoo-'));
try{const input=join(tmp,'submission.json'),output=join(tmp,'intake');await writeFile(input,JSON.stringify(valid()));const run=args=>spawnSync('python',['scripts/zoo_expand.py',input,...args],{cwd:new URL('../',import.meta.url),encoding:'utf8'});const check=run([]);assert.equal(check.status,0,check.stderr);assert.equal(JSON.parse(check.stdout).reviewState,'pending');const first=run(['--output-dir',output]);assert.equal(first.status,0,first.stderr);const second=run(['--output-dir',output]);assert.notEqual(second.status,0);const saved=await readFile(join(output,valid().artifactId,'payload.json'),'utf8');assert.equal(JSON.parse(saved).results,null);const invalid=valid();invalid.results={invented:1};await writeFile(input,JSON.stringify(invalid));assert.notEqual(run([]).status,0);}finally{await rm(tmp,{recursive:true,force:true});}
console.log('Passed Matter Zoo source coverage, planned evidence, projections, packet gates, actual-data DOM interactions, safe text, downloads, failure handling and immutable intake checks. No browser QA performed.');
