import {validateModel,assessBridge,restrict,availableArtifacts,safeUrl} from './core.js';

const statusLabels={compatible:'Compatible under declared screen',unresolved:'Unresolved · missing evidence',blocked:'Blocked · joint contract fails',local_failure:'Local admissibility fails',overlap_conflict:'Overlap conflict · incompatible assignments'};
const humanize=value=>String(value).replace(/([a-z])([A-Z])/g,'$1 $2').replace(/[_-]/g,' ').replace(/^./,c=>c.toUpperCase());
const text=value=>typeof value==='string'?value:value==null?'Unknown':JSON.stringify(value,null,2);
export function visiblePapers(model,context='all') {return model.papers.filter(p=>context==='all'||p.contexts.includes(context));}
export function contextScope(model,context='all') {return model.ports.filter(p=>context==='all'||p.contextIds.includes(context)).map(p=>p.id).sort();}

export async function mountPresheaf(doc=globalThis.document,fetcher=globalThis.fetch) {
  const $=id=>doc.getElementById(id);
  const make=(tag,content,className)=>{const node=doc.createElement(tag);if(content!==undefined)node.textContent=String(content);if(className)node.className=className;return node;};
  const add=(parent,tag,content,className)=>{const child=make(tag,content,className);parent.append(child);return child;};
  const source=(parent,url,label)=>{const clean=safeUrl(url);if(!clean)return add(parent,'span',label+' (link unavailable)','small-meta');const a=add(parent,'a',label,'evidence-link');a.href=clean;a.target='_blank';a.rel='noopener noreferrer';return a;};
  const paragraph=(parent,label,value)=>{if(value==null)return;const p=add(parent,'p');add(p,'strong',label+' ');add(p,'span',text(value));};
  const list=(parent,values,empty='None declared.')=>{if(!values?.length)return add(parent,'p',empty,'micro-copy');const ul=add(parent,'ul');for(const item of values)add(ul,'li',text(item));return ul;};
  const checks=(parent,items)=>{for(const check of items||[]){const row=add(parent,'div',undefined,'check-item');add(row,'span',check.status,'check-badge '+check.status);add(row,'strong',check.label||check.id);if(check.support)add(row,'p','Exact support: '+check.support.join(', '));}};
  let model;
  try {
    const response=await fetcher('./model.json');if(!response.ok)throw new Error('HTTP '+response.status);
    model=await response.json();validateModel(model);
    if(!model.papers?.length||!model.bridges?.length)throw new Error('The model must contain papers and bridges.');
  }catch(error){$('load-status').textContent='The evidence model could not be loaded: '+error.message;$('load-status').className='load-status error';$('explorer-content').hidden=true;return null;}
  $('model-description').textContent=model.description;
  $('model-date').textContent='Model snapshot · '+model.date;
  let context='all',selectedPaper=model.papers[0].id;
  const paperById=new Map(model.papers.map(p=>[p.id,p]));
  const portById=new Map(model.ports.map(p=>[p.id,p]));
  const factRecord=Object.fromEntries(model.ports.map(p=>[p.id,p.value]));
  const contextName=id=>model.contexts.find(c=>c.id===id)?.label||id;
  const artifactIds=keys=>availableArtifacts(model.artifacts,keys);
  function renderPaper(){
    const paper=paperById.get(selectedPaper),panel=$('paper-detail');panel.replaceChildren();
    add(panel,'p',paper.id+' · '+paper.contexts.map(contextName).join(' / '),'eyebrow');add(panel,'h2',paper.title);
    paragraph(panel,'Reading coverage:',paper.readingLevel);paragraph(panel,'Version:',paper.version);source(panel,paper.url,'Read primary source ↗');
    const notes=add(panel,'div',undefined,'detail-notes');
    for(const [label,value] of [['What changes the view?',paper.surprise],['Careful-reading detail',paper.detail]]){const box=add(notes,'div');add(box,'h3',label);if(value&&typeof value==='object')for(const [key,item] of Object.entries(value))paragraph(box,humanize(key)+':',item);else add(box,'p',text(value));}
    const ports=paper.ports.map(id=>portById.get(id)).filter(p=>p&&(context==='all'||p.contextIds.includes(context)));
    add(panel,'h3',ports.length+' scoped fact ports');
    for(const port of ports){
      const details=add(panel,'details',undefined,'fact-port');add(details,'summary',port.label+' · '+(port.value===null?'unknown':text(port.value)));
      const meta=add(details,'div',undefined,'port-meta');add(meta,'span','Confidence: '+text(port.confidence));add(meta,'span','Reading: '+(port.readingLevel||paper.readingLevel));add(meta,'span',port.contextIds.map(contextName).join(' / '));
      const dl=add(details,'dl');for(const [label,value] of [['Literal variable',port.id],['Domain',port.domain],['Observed value',port.value],['Source locator',port.locator],['Evidence',port.evidence],['Boundary',port.boundary]]){add(dl,'dt',label);add(dl,'dd',text(value));}
      source(details,port.url||paper.url,'Primary evidence ↗');
    }
    if(!ports.length)add(panel,'p','This selected view contains no fact ports for this paper.','empty-state');
  }
  function renderPapers(){
    const papers=visiblePapers(model,context),scope=contextScope(model,context),values=restrict(factRecord,scope),known=Object.values(values).filter(v=>v!==null).length;
    if(!papers.some(p=>p.id===selectedPaper))selectedPaper=papers[0]?.id||model.papers[0].id;
    $('paper-count').textContent=papers.length+' of '+model.papers.length+' papers';
    $('context-question').textContent=context==='all'?'All five factor contexts: inspect the union, then narrow the question.':model.contexts.find(c=>c.id===context).question;
    const stats=$('context-stats');stats.replaceChildren();for(const value of [scope.length+' literal variables',known+' known values',(scope.length-known)+' unknown values',artifactIds(scope).length+' fixed artifacts available'])add(stats,'span',value);
    $('context-scope').textContent=JSON.stringify(scope,null,2);
    const rows=$('paper-rows');rows.replaceChildren();
    for(const paper of papers){const tr=add(rows,'tr'),name=add(tr,'td'),button=add(name,'button',paper.title,'paper-button');button.type='button';button.setAttribute('aria-pressed',String(selectedPaper===paper.id));button.setAttribute('aria-label','Inspect '+paper.title);button.addEventListener('click',()=>{selectedPaper=paper.id;renderPapers();});add(name,'span',paper.id+' · '+text(paper.version),'paper-version');add(tr,'td',paper.contexts.map(contextName).join(' · '));const ports=paper.ports.map(id=>portById.get(id)).filter(p=>p&&(context==='all'||p.contextIds.includes(context)));add(tr,'td',ports.length+' scoped / '+ports.filter(p=>p.value===null).length+' unknown');add(tr,'td',paper.readingLevel);}
    if(!papers.length){const td=add(add(rows,'tr'),'td','No papers in this factor context.');td.colSpan=4;}
    for(const button of $('context-filters').children)button.setAttribute('aria-pressed',String(button.dataset.context===context));
    renderPaper();
  }
  for(const item of [{id:'all',label:'All contexts'},...model.contexts]){const button=add($('context-filters'),'button',item.label);button.type='button';button.dataset.context=item.id;button.setAttribute('aria-pressed',String(item.id==='all'));button.addEventListener('click',()=>{context=item.id;renderPapers();});}
  for(const bridge of model.bridges){const option=add($('bridge-select'),'option',bridge.label);option.value=bridge.id;}
  $('bridge-select').value=model.bridges[0].id;
  function renderBridge(){
    const bridge=model.bridges.find(b=>b.id===$('bridge-select').value),mode=$('mode-stronger').checked?'stronger':'bounded';
    const result=assessBridge(model,bridge.id,{mode,withhold:$('withhold-fact').checked,conflict:$('overlap-conflict').checked});
    const claim=$('bridge-claim');claim.replaceChildren();add(claim,'h3',bridge.label);paragraph(claim,mode==='bounded'?'Bounded claim:':'Stronger claim:',mode==='bounded'?bridge.boundedClaim:bridge.strongerClaim);add(claim,'p','Tempting overreach: '+text(bridge.temptingOverreach),'claim-boundary');
    const status=$('assessment-status');status.replaceChildren();status.dataset.status=result.status;add(status,'strong',statusLabels[result.status]||humanize(result.status));add(status,'span',result.message);
    if(result.isGluingFailure)add(status,'p','Modeled gluing failure: locally admissible views agree on overlaps, but their joint assignment fails the declared cross-context contract.');
    if($('overlap-conflict').checked)add(status,'p','Synthetic demonstration is active. The altered scope value is not evidence from a paper.');
    if(result.withheldKey)add(status,'p','Temporary missingness: '+result.withheldKey+' was withheld consistently across views.');
    const locals=$('local-records');locals.replaceChildren();
    for(const patch of result.patches){const box=add(locals,'article',undefined,'record-card'),paper=paperById.get(patch.paperId);add(box,'h4',paper?.title||patch.paperId);paragraph(box,'Reading:',paper?.readingLevel);add(box,'p','Scope: '+patch.keys.join(', '));checks(box,patch.localChecks);if(!patch.localChecks.length)add(box,'p','No cross-context predicate has its entire support inside this local view.');add(box,'pre',JSON.stringify(patch.assignment,null,2));for(const key of patch.keys){const port=portById.get(key);if(!port)continue;const evidence=add(box,'details',undefined,'fact-port');add(evidence,'summary',key+' · '+port.confidence+' confidence');paragraph(evidence,'Source locator:',port.locator);paragraph(evidence,'Evidence:',port.evidence);paragraph(evidence,'Boundary:',port.boundary);source(evidence,port.url||paper?.url,'Primary evidence ↗');}if(paper)source(box,paper.url,'Paper source ↗');}
    const overlaps=$('overlap-records');overlaps.replaceChildren();
    for(const overlap of result.overlaps){const box=add(overlaps,'article',undefined,'record-card');add(box,'h4',overlap.left+' ∩ '+overlap.right);add(box,'p','Shared scope: '+(overlap.keys.length?overlap.keys.join(', '):'(empty)'));if(overlap.conflicts.length){add(box,'p','Conflicts: '+overlap.conflicts.length);add(box,'pre',JSON.stringify(overlap.conflicts,null,2));}else add(box,'p','No unequal known assignments on this overlap.');add(box,'p','Unresolved: '+(overlap.unresolved.length?overlap.unresolved.join(', '):'none'));}
    if(!result.overlaps.length)add(overlaps,'p','No pairwise overlaps in this packet.','empty-state');
    const constraints=$('constraint-records');constraints.replaceChildren();checks(constraints,result.checks);
    $('restriction-trace').textContent=JSON.stringify(result.restrictionTrace,null,2);
    $('merged-trace').textContent=JSON.stringify(result.merged,null,2);
    const c=result.completions;$('completion-count').textContent='Declared finite-domain completions: '+c.total+' total; '+c.accepted+' accepted; '+c.rejected+' rejected.'+(c.truncated?' Enumeration was truncated; these counts are incomplete.':' No truncation.');
    $('unknown-keys').textContent='Unknown keys: '+(result.unknownKeys.length?result.unknownKeys.join(', '):'none')+'.';
    const repairs=$('repair-requirements');repairs.replaceChildren();add(repairs,'h4','Bridge requirements');list(repairs,bridge.requirements);add(repairs,'h4','Evidence gaps');list(repairs,bridge.gaps);add(repairs,'h4','Interface meanings');for(const variable of bridge.interfaceVariables||[])paragraph(repairs,variable.name+':',variable.meaning);add(repairs,'h4','Source locators');list(repairs,bridge.locators);
    const availability=$('artifact-availability');availability.replaceChildren();
    for(const local of result.artifacts.local)add(availability,'p',local.paperId+': '+local.ids.length+' available · '+(local.ids.join(', ')||'none'));
    add(availability,'p','Union of local availability: '+result.artifacts.union.length+' · '+(result.artifacts.union.join(', ')||'none'));
    const jointIds=artifactIds(Object.keys(result.merged));add(availability,'p','Availability on the joint scope: '+jointIds.length+' · '+(jointIds.join(', ')||'none')+'. Scope availability does not certify the bridge.');
    for(const artifact of model.artifacts.filter(a=>jointIds.includes(a.id))){const item=add(availability,'p');source(item,artifact.url,artifact.label);add(item,'span',' · support: '+artifact.support.join(', '));}
  }
  for(const id of ['bridge-select','mode-bounded','mode-stronger','withhold-fact','overlap-conflict'])$(id).addEventListener('change',renderBridge);
  for(const [key,value] of Object.entries(model.mathematics)){const note=add($('math-notes'),'article',undefined,'math-note');add(note,'h3',humanize(key));add(note,'p',text(value));}
  for(const limitation of model.limitations)add($('limitations'),'li',text(limitation));
  for(const reference of model.references){const box=add($('references'),'div',undefined,'reference');source(box,reference.url,reference.title+' ↗');add(box,'p',reference.scope);}
  renderPapers();renderBridge();$('load-status').hidden=true;$('explorer-content').hidden=false;
  return {model,renderBridge,renderPapers};
}
if(typeof document!=='undefined')mountPresheaf();
