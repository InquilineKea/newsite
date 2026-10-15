const AXIS_IDS=['conceptual','observability','diversity','controls','statistics','scope','reproducibility','depth'];
const COLORS=['#326c64','#bd563b','#777291','#987238'];
export function safeUrl(value){
  try {const url=new URL(value);return ['http:','https:'].includes(url.protocol)?url.href:null;}catch{return null;}
}
export function validateProfiles(data){
  const fail=message=>{throw new Error(message);};
  if(!data||!Array.isArray(data.papers)||!Array.isArray(data.rubric?.axes))fail('The profile file has no paper list or rubric.');
  const ids=new Set(),axisIds=new Set();
  for(const a of data.rubric.axes){if(!AXIS_IDS.includes(a.id)||axisIds.has(a.id)||!a.label||!a.question||!Array.isArray(a.anchors)||a.anchors.length!==5)fail('The rubric contains an invalid axis.');axisIds.add(a.id);}
  if(axisIds.size!==8)fail('All eight rubric axes are required.');
  for(const p of data.papers){
    if(!p.id||ids.has(p.id)||!p.title||!p.group||!safeUrl(p.url))fail('A paper has a missing or duplicate identity, title, collection or source URL.');ids.add(p.id);
    if(!Array.isArray(p.details)||!p.coverage||!p.tags||!p.novelty)fail(`Profile ${p.id} is missing its reading record.`);
    for(const key of ['mechanism','scale','evidence','validation'])if(!Array.isArray(p.tags[key]))fail(`Profile ${p.id} has invalid ${key} tags.`);
    for(const id of AXIS_IDS){const a=p.assessments?.[id];if(!a||!(a.score===null||(Number.isInteger(a.score)&&a.score>=0&&a.score<=4))||!['low','medium','high'].includes(a.confidence)||typeof a.rationale!=='string'||typeof a.locator!=='string')fail(`Profile ${p.id} has an invalid ${id} assessment.`);}
  }
  return data;
}
export function filterPapers(papers,{query='',group='all'}={}){
  const terms=String(query).toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return papers.filter(p=>(group==='all'||p.group===group)&&terms.every(term=>JSON.stringify([p.title,p.authors,p.group,p.summary,p.tags,p.details,p.novelty]).toLocaleLowerCase().includes(term)));
}
export function pointLayout(papers,xAxis,yAxis,{width=560,height=420}={}){
  const box={left:66,right:width-36,top:35,bottom:height-78},points=[],omitted=[];
  const groups=new Map();
  for(const p of papers){const x=p.assessments?.[xAxis]?.score,y=p.assessments?.[yAxis]?.score;if(!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>4||y<0||y>4){omitted.push(p.id);continue;}const key=`${x},${y}`;groups.set(key,(groups.get(key)||0)+1);}
  for(const p of papers){
    const sx=p.assessments?.[xAxis]?.score,sy=p.assessments?.[yAxis]?.score;if(omitted.includes(p.id))continue;
    const exactX=box.left+sx*(box.right-box.left)/4,exactY=box.bottom-sy*(box.bottom-box.top)/4;
    let x=exactX,y=exactY;
    const clear=(cx,cy)=>points.every(q=>Math.hypot(q.x-cx,q.y-cy)>=26);
    if(!clear(x,y)){
      let found=false;
      for(let radius=28;radius<=140&&!found;radius+=14)for(let k=0;k<24;k++){
        const angle=2*Math.PI*k/24,cx=exactX+radius*Math.cos(angle),cy=exactY+radius*Math.sin(angle);
        if(cx>=box.left-12&&cx<=box.right+12&&cy>=box.top-12&&cy<=box.bottom+12&&clear(cx,cy)){x=cx;y=cy;found=true;break;}
      }
      if(!found)throw new Error('Too many overlapping points for this plot. Use the table to inspect profiles.');
    }
    points.push({id:p.id,x,y,exactX,exactY,scoreX:sx,scoreY:sy,displaced:x!==exactX||y!==exactY,coincident:groups.get(`${sx},${sy}`)});
  }
  return {points,omitted,collisionGroups:[...groups.values()].filter(n=>n>1).length,box,width,height};
}
export function compareTags(a,b){return Object.fromEntries(['mechanism','scale','evidence','validation'].map(key=>{
  const aa=a.tags?.[key]||[],bb=b.tags?.[key]||[];
  return [key,{shared:aa.filter(t=>bb.includes(t)),onlyA:aa.filter(t=>!bb.includes(t)),onlyB:bb.filter(t=>!aa.includes(t))}];
}));}
export function makePairBrief(a,b,constraint=''){
  if(!a||!b||a.id===b.id)throw new Error('Choose two different papers.');
  const lines=['PAPER MIXER — TWO-PAPER RESEARCH BRIEF','These are evidence-linked reading judgments, not experimentally validated transfers.',''];
  for(const [index,p] of [a,b].entries()){
    lines.push(`PAPER ${index+1}: ${p.title} (${p.year})`,p.url,`Mechanism: ${(p.tags.mechanism||[]).join('; ')}`,`Evidence: ${(p.tags.evidence||[]).join('; ')}`,`Novelty relative to comparator: ${p.novelty.increment}`,`Comparator: ${p.novelty.comparator}`,`Boundary: ${p.novelty.limit}`);
    for(const d of p.details)lines.push(`Consequential detail: ${d.observation} Interpretation: ${d.interpretation} Boundary: ${d.boundary} Source: ${d.locator}`);
    lines.push(`Next falsifiable test: ${p.nextTest}`,'');
  }
  const diff=compareTags(a,b);
  lines.push('COMPLEMENTARY DIMENSIONS (differences suggest questions, not compatibility):');
  for(const [key,value] of Object.entries(diff))lines.push(`${key}: Paper 1 only [${value.onlyA.join('; ')||'none'}]; Paper 2 only [${value.onlyB.join('; ')||'none'}]; shared [${value.shared.join('; ')||'none'}].`);
  lines.push('','TASK: Propose one testable transfer. Explain the mechanism and assumptions, a baseline, discriminating control, measurable endpoint and falsifier. Identify the experimental unit, selection, filtering, covariates and uncertainty where relevant. Separate observation, representation, causal interpretation and extrapolation. Name a failure mode for each source. Preserve source locators and unknowns. Assign complementary reviews: an evidence critic checks source support and comparator claims; a methods critic checks experimental units, selection, covariates, uncertainty and discriminating controls. Keep their disagreements. Do not average the axes into a quality score or treat author names as evidence.',`USER CONSTRAINT: ${String(constraint).trim()||'No additional constraint supplied.'}`,'This page only prepared the brief; it did not run agents or experiments.');
  return lines.join('\n');
}
const textValue=value=>Array.isArray(value)?value.join(', '):String(value??'');
function node(tag,text,className){const n=document.createElement(tag);if(text!==undefined)n.textContent=textValue(text);if(className)n.className=className;return n;}
function svgNode(tag,attrs={}){const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [key,value] of Object.entries(attrs))n.setAttribute(key,String(value));return n;}
function link(text,url){const n=node('a',text),safe=safeUrl(url);if(safe){n.href=safe;n.target='_blank';n.rel='noopener noreferrer';}else{n.removeAttribute('href');n.title='No valid source link supplied';}return n;}
function paragraph(label,value,parent){const p=node('p');if(label)p.append(node('strong',label+' '));p.append(document.createTextNode(textValue(value)));parent.append(p);return p;}
async function boot(){
  const $=id=>document.getElementById(id),status=$('map-status');
  try{
    const response=await fetch('./papers.json');if(!response.ok)throw new Error(`Profile download failed (HTTP ${response.status}).`);
    const data=validateProfiles(await response.json()),axes=data.rubric.axes;
    let visible=[...data.papers],selected=data.papers[0]?.id;
    const groups=[...new Set(data.papers.map(p=>p.group))],color=group=>COLORS[groups.indexOf(group)%COLORS.length];
    const numbers=new Map(data.papers.map((p,i)=>[p.id,i+1]));
    let listButtons=new Map(),matrixButtons=new Map(),plotButtons=new Map();
    function option(value,label){const o=node('option',label);o.value=value;return o;}
    for(const group of groups){$('group-filter').append(option(group,group));const item=node('span');const dot=node('i');dot.style.backgroundColor=color(group);item.append(dot,document.createTextNode(group));$('group-legend').append(item);}
    for(const a of axes){$('axis-x').append(option(a.id,a.label));$('axis-y').append(option(a.id,a.label));}
    $('axis-x').value='conceptual';$('axis-y').value='observability';
    for(const id of ['pair-a','pair-b'])for(const p of data.papers)$(id).append(option(p.id,p.title));
    $('pair-a').value=data.papers[0]?.id||'';$('pair-b').value=data.papers.find(p=>p.group!==data.papers[0]?.group)?.id||data.papers[1]?.id||'';
    function select(id,source){selected=id;renderPlot();renderList();renderMatrix();renderDetail();const buttons=source==='plot'?plotButtons:source==='matrix'?matrixButtons:listButtons;buttons.get(id)?.focus();}
    function renderPlot(){
      const target=$('paper-plot');target.replaceChildren();plotButtons=new Map();
      if(!visible.length){target.append(node('p','No matching papers. Change the search or collection filter.','map-empty'));$('plot-note').textContent='No papers match these filters.';return;}
      const xId=$('axis-x').value,yId=$('axis-y').value,xAxis=axes.find(a=>a.id===xId),yAxis=axes.find(a=>a.id===yId);
      let layout;try{layout=pointLayout(visible,xId,yId);}catch(error){target.append(node('p',error.message,'map-empty'));$('plot-note').textContent='Every paper remains available in the list and table.';return;}
      const {width,height,box}=layout,svg=svgNode('svg',{viewBox:`0 0 ${width} ${height}`,role:'group','aria-label':`Paper profiles: ${xAxis.label} horizontally and ${yAxis.label} vertically. Values are ordinal, 0 to 4. Select numbered points or use the paper list.`});
      for(let i=0;i<5;i++){
        const x=box.left+i*(box.right-box.left)/4,y=box.bottom-i*(box.bottom-box.top)/4;
        svg.append(svgNode('line',{x1:x,y1:box.top,x2:x,y2:box.bottom,class:'plot-grid'}),svgNode('line',{x1:box.left,y1:y,x2:box.right,y2:y,class:'plot-grid'}));
        const tx=svgNode('text',{x,y:box.bottom+22,'text-anchor':'middle',class:'plot-tick'});tx.textContent=i;const ty=svgNode('text',{x:box.left-20,y:y+4,'text-anchor':'middle',class:'plot-tick'});ty.textContent=i;svg.append(tx,ty);
      }
      const xlabel=svgNode('text',{x:(box.left+box.right)/2,y:height-14,'text-anchor':'middle',class:'plot-axis'});xlabel.textContent=xAxis.label+' →';
      const ylabel=svgNode('text',{transform:`translate(18 ${(box.top+box.bottom)/2}) rotate(-90)`,'text-anchor':'middle',class:'plot-axis'});ylabel.textContent=yAxis.label+' →';svg.append(xlabel,ylabel);
      for(const point of layout.points){const p=data.papers.find(p=>p.id===point.id);
        if(point.displaced){svg.append(svgNode('line',{x1:point.exactX,y1:point.exactY,x2:point.x,y2:point.y,class:'plot-leader'}),svgNode('circle',{cx:point.exactX,cy:point.exactY,r:2,class:'exact-marker'}));}
        const g=svgNode('g',{class:'plot-point',role:'button',tabindex:0,'aria-pressed':selected===p.id,'aria-label':`${numbers.get(p.id)}. ${p.title}. ${xAxis.label}: ${point.scoreX}; ${yAxis.label}: ${point.scoreY}. ${point.coincident>1?`${point.coincident} papers at these values. `:''}Open profile.`});
        const title=svgNode('title');title.textContent=`${p.title} · ${point.scoreX}, ${point.scoreY}${point.displaced?' · offset from dotted anchor to avoid overlap':''}`;
        const number=svgNode('text',{x:point.x,y:point.y+3.5,'text-anchor':'middle'});number.textContent=numbers.get(p.id);
        g.append(title,svgNode('circle',{cx:point.x,cy:point.y,r:11,fill:color(p.group)}),number);g.addEventListener('click',()=>select(p.id,'plot'));g.addEventListener('keydown',event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();select(p.id,'plot');}});svg.append(g);plotButtons.set(p.id,g);
      }
      target.append(svg);
      const hiddenTitles=layout.omitted.map(id=>data.papers.find(p=>p.id===id).title);
      $('plot-note').textContent=`${layout.points.length} plotted. ${layout.omitted.length?`${layout.omitted.length} missing an axis rating; not plotted: ${hiddenTitles.join('; ')}. `:'Unknown ratings are never plotted as zero. '}${layout.collisionGroups?`${layout.collisionGroups} shared coordinate${layout.collisionGroups===1?'':'s'}: numbered points are displaced with dotted lines to their exact values. `:''}Spacing shows ordinal categories, not measured distances.${xId===yId?' Both axes currently show the same dimension.':''}`;
    }
    function renderList(){const list=$('paper-list');list.replaceChildren();listButtons=new Map();if(!visible.length){list.append(node('li','No matching papers.','map-empty'));return;}
      for(const p of visible){const li=node('li'),button=node('button');button.type='button';button.setAttribute('aria-pressed',String(selected===p.id));const number=node('span',numbers.get(p.id),'paper-number');number.style.backgroundColor=color(p.group);const info=node('span');info.append(node('span',p.title,'list-paper-title'),node('span',`${p.group} · ${p.year} · ${p.status}`,'list-paper-meta'));button.append(number,info);button.addEventListener('click',()=>select(p.id,'list'));li.append(button);list.append(li);listButtons.set(p.id,button);}
    }
    function renderMatrix(){
      const head=$('matrix-head'),body=$('matrix-body');head.replaceChildren();body.replaceChildren();matrixButtons=new Map();const tr=node('tr'),first=node('th','Paper');first.scope='col';tr.append(first);
      for(const a of axes){const th=node('th',a.label);th.scope='col';th.append(node('small',a.group));tr.append(th);}head.append(tr);
      for(const p of visible){const row=node('tr');row.dataset.selected=String(p.id===selected);const th=node('th');th.scope='row';const button=node('button',`${numbers.get(p.id)}. ${p.title}`);button.type='button';button.addEventListener('click',()=>select(p.id,'matrix'));th.append(button);row.append(th);matrixButtons.set(p.id,button);
        for(const a of axes){const rating=p.assessments[a.id],td=node('td'),cell=node('span',undefined,'rating-cell');cell.style.setProperty('--rating-bg',rating.score===null?'#f1f0e9':['#f2eee7','#e9eee4','#dce8da','#cadfcd','#b3d1bd'][rating.score]);cell.append(node('strong',rating.score===null?'?':rating.score),node('small',rating.confidence));td.title=`${a.label}: ${rating.score===null?'insufficient reviewed evidence':rating.score+'/4'}; ${rating.confidence} confidence. ${rating.rationale} Source: ${rating.locator}`;cell.setAttribute('aria-label',`${rating.score===null?'Insufficient reviewed evidence':rating.score+' of 4'}, ${rating.confidence} confidence`);td.append(cell);row.append(td);}body.append(row);
      }
      if(!visible.length){const tr=node('tr'),td=node('td','No matching papers. Reset the filters to see the full map.');td.colSpan=9;tr.append(td);body.append(tr);}
    }
    function renderDetail(){const detail=$('paper-detail');detail.replaceChildren();const p=visible.find(p=>p.id===selected);if(!p){const title=node('h3','No paper selected');title.id='detail-title';detail.append(title,node('p','Choose a paper from the plot, list or table.'));return;}
      detail.append(node('p',`${p.group.toUpperCase()} / ${numbers.get(p.id).toString().padStart(2,'0')}`,'eyebrow'));const title=node('h3',p.title);title.id='detail-title';detail.append(title,node('p',p.authors),node('p',`${p.year} · ${p.status}${p.version?' · '+p.version:''}`),node('p',p.summary));const source=node('p');source.append(link('Read primary paper ↗',p.url));if(p.doi)source.append(document.createTextNode(' · DOI '+p.doi));detail.append(source);
      function section(title){const s=node('section',undefined,'detail-section');s.append(node('h4',title));detail.append(s);return s;}
      const novelty=section('What changes—and what does not');const comp=node('p');comp.append(node('strong','Nearby comparator: '),safeUrl(p.novelty.comparatorUrl)?link(p.novelty.comparator,p.novelty.comparatorUrl):document.createTextNode(p.novelty.comparator));novelty.append(comp);paragraph('Increment:',p.novelty.increment,novelty);paragraph('Boundary:',p.novelty.limit,novelty);
      const details=section('Details easy to miss from the abstract');const list=node('ol');for(const d of p.details){const li=node('li');paragraph('Observation:',d.observation,li);paragraph('Interpretation:',d.interpretation,li);paragraph('Boundary:',d.boundary,li);li.append(node('p',d.locator,'detail-locator'));list.append(li);}details.append(list);
      const assessments=section('Ratings with their evidence');for(const a of axes){const r=p.assessments[a.id],block=node('div',undefined,'assessment'),header=node('div',undefined,'assessment-head');header.append(node('h5',a.label));const score=node('span',r.score===null?'? / insufficient evidence':`${r.score} / 4`,'assessment-score');score.append(node('span',` · ${r.confidence} confidence`,'confidence'));header.append(score);block.append(header);paragraph('',r.rationale,block);block.append(node('p',r.locator,'detail-locator'));if(r.score!==null)paragraph('Category:',a.anchors[r.score],block);assessments.append(block);}
      const test=section('A next falsifiable test');paragraph('',p.nextTest,test);
      const tags=section('Mechanism, scale and evidence');for(const key of ['mechanism','scale','evidence','validation']){paragraph(key[0].toUpperCase()+key.slice(1)+':',(p.tags[key]||[]).join(' · '),tags);}
      const coverage=section('Reading coverage');paragraph('Reviewed:',p.coverage.read,coverage);paragraph('Not reviewed:',p.coverage.notRead?.length?p.coverage.notRead:'No additional omission specified; this is not an independent reproduction.',coverage);for(const reference of p.references||[]){if(!safeUrl(reference.url))continue;const ref=node('p');ref.append(link(reference.title,reference.url));coverage.append(ref);if(reference.scope)paragraph('Reading scope:',reference.scope,coverage);}
    }
    function renderFiltered(){visible=filterPapers(data.papers,{query:$('paper-search').value,group:$('group-filter').value});if(!visible.some(p=>p.id===selected))selected=visible[0]?.id;$('paper-count').textContent=`${visible.length} of ${data.papers.length} papers`;renderPlot();renderList();renderMatrix();renderDetail();}
    function renderPair(){const target=$('pair-comparison');target.replaceChildren();const a=data.papers.find(p=>p.id===$('pair-a').value),b=data.papers.find(p=>p.id===$('pair-b').value);const valid=a&&b&&a.id!==b.id;$('copy-pair').disabled=!valid;if(!valid){target.append(node('p','Choose two different papers to compare their mechanisms and boundaries.','map-empty'));return;}
      target.append(node('p','Tag differences are descriptive. No scalar complementarity score is assigned.','pair-summary'));const diffs=compareTags(a,b);
      for(const [key,diff] of Object.entries(diffs)){const section=node('section',undefined,'pair-category');section.append(node('h4',key[0].toUpperCase()+key.slice(1)));paragraph('First only:',diff.onlyA.join(' · ')||'No unique tags',section);paragraph('Second only:',diff.onlyB.join(' · ')||'No unique tags',section);paragraph('Shared:',diff.shared.join(' · ')||'No exact shared tags',section);target.append(section);}
      $('copy-status').textContent='Copies a brief for your agents. This static page does not execute AI calls.';$('brief-fallback').hidden=true;
    }
    $('paper-search').addEventListener('input',renderFiltered);$('group-filter').addEventListener('change',renderFiltered);$('reset-filters').addEventListener('click',()=>{$('paper-search').value='';$('group-filter').value='all';renderFiltered();});for(const id of ['axis-x','axis-y'])$(id).addEventListener('change',renderPlot);for(const id of ['pair-a','pair-b'])$(id).addEventListener('change',renderPair);
    $('copy-pair').addEventListener('click',async()=>{try{const a=data.papers.find(p=>p.id===$('pair-a').value),b=data.papers.find(p=>p.id===$('pair-b').value),brief=makePairBrief(a,b,$('pair-constraint').value);try{await navigator.clipboard.writeText(brief);$('copy-status').textContent='Mixer brief copied. Run it in your own agent environment; no AI calls were made here.';}catch{$('brief-fallback').value=brief;$('brief-fallback').hidden=false;$('brief-fallback').focus();$('brief-fallback').select();$('copy-status').textContent='Clipboard access is unavailable. The brief is selected below; copy it manually.';}}catch(error){$('copy-status').textContent=error.message;}});
    $('rubric-scale').textContent=data.rubric.scale;$('rubric-missing').textContent=data.rubric.missing;
    for(const a of axes){const d=node('details'),summary=node('summary',`${a.group} / ${a.label}`);d.append(summary,node('p',a.question));const ol=node('ol');ol.start=0;for(const anchor of a.anchors)ol.append(node('li',anchor));d.append(ol);$('axis-rubric').append(d);}
    for(const rule of data.rubric.protocol||[])$('map-protocol').append(node('li',rule));for(const rule of data.limitations||[])$('map-limitations').append(node('li',rule));$('map-date').textContent=data.date||'';
    renderFiltered();renderPair();status.hidden=true;$('map-content').hidden=false;
  }catch(error){status.textContent=`The paper map could not load. ${error.message} Reload to try again, or download the profiles directly.`;status.classList.add('error');const a=node('a',' Download profiles JSON','');a.href='./papers.json';status.append(a);}
}
if(typeof document!=='undefined')boot();
