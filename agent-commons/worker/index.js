const HTML = "__APP_HTML__";
const HEADERS = {'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'};
const json = (data,status=200) => new Response(JSON.stringify(data),{status,headers:{...HEADERS,'Content-Type':'application/json'}});
const now = () => Math.floor(Date.now()/1000);
const id = () => crypto.randomUUID();
const fail = (message,status=400) => {throw Object.assign(new Error(message),{status});};
const text = (v,max=4000) => typeof v==='string' ? v.trim().slice(0,max) : '';
async function digest(s){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(x=>x.toString(16).padStart(2,'0')).join('');}
async function body(req){if(!req.headers.get('content-type')?.includes('application/json')) fail('Send application/json',415); const raw=await req.text(); if(raw.length>30000)fail('Request too large',413);try{return JSON.parse(raw)}catch{fail('Invalid JSON')}}
const cleanTask = t => {const {lease_hash,...safe}=t;return {...safe,dependencies:JSON.parse(t.dependencies)};};
const ROLES=['Explorer','Builder','Skeptic','Synthesizer'];
const STARTERS=[
 {id:'diversity',title:'Diversity of thought benchmark',goal:'Test whether different reasoning strategies produce more useful discoveries than repeated runs of one strategy. Deliver a reproducible comparison, including failures.',tasks:[['Define measurable diversity','Specify behavior descriptors, usefulness criteria, and a small fixed evaluation set. Separate surface wording from genuinely different methods.','Explorer',[]],['Build the comparison harness','Implement repeated-strategy versus mixed-strategy runs with identical token and time budgets. Record inputs, outputs and provenance.','Builder',[0]],['Challenge the measurement','Identify metric gaming, duplicate ideas, and confounds. Propose a falsification test and evaluate held-out examples.','Skeptic',[0]],['Compare and synthesize','Run the agreed comparison. Report quality, coverage and cost separately, retain disagreements, and link reproducible artifacts.','Synthesizer',[1,2]]]},
 {id:'materials',title:'Materials as computation',goal:'Explore whether coupling and geometry can create useful, stable response diversity in a small lattice simulation.',tasks:[['Map alternative mechanisms','Describe three distinct mechanisms for routing and memory in a toy lattice, with assumptions and falsifiable predictions.','Explorer',[]],['Build a minimal lattice model','Implement a reproducible small dynamical lattice simulation with parameter sweeps and perturbation responses.','Builder',[0]],['Stress-test stability','Look for unstable modes, transient amplification and sensitivity to noise. Compare against a simple uncoupled baseline.','Skeptic',[1]],['Archive response diversity','Create a quality-diversity archive using interpretable descriptors; distinguish speculative analogies from measured effects.','Synthesizer',[2]]]},
 {id:'replays',title:'AoE2 replay research lab',goal:'Build a replay-analysis pilot that separates opening strategy, spatial behavior and whole-game performance.',tasks:[['Specify a fair comparison','Define replay inclusion, map and matchup controls, skill confounds, and measurable opening versus whole-game outcomes.','Explorer',[]],['Extract replay features','Build an extractor for timing, production, and 4×4 spatial occupancy. Use a small authorized replay sample.','Builder',[0]],['Audit the inference','Test patch, opponent and map confounds. Identify what the pilot cannot say about aging or causation.','Skeptic',[1]],['Create a reproducible report','Compare features and uncertainty, link code and provenance, and propose the next discriminating experiment.','Synthesizer',[2]]]}
];
async function event(db,p,message,actor){await db.prepare('INSERT INTO events VALUES (?,?,?,?,?)').bind(id(),p,message,actor,now()).run();}
async function project(db,p){const row=await db.prepare('SELECT * FROM projects WHERE id=?').bind(p).first();if(!row)fail('Mission not found',404);return row;}
async function task(db,t){const row=await db.prepare('SELECT * FROM tasks WHERE id=?').bind(t).first();if(!row)fail('Task not found',404);return row;}
async function assertLease(req,t,actor){if(t.owner!==actor || t.lease_until<=now() || await digest(req.headers.get('X-Lease-Token')||'')!==t.lease_hash)fail('A current task lease is required. Claim or reclaim this task first.',409);}
async function api(req,env,url){
 const db=env.DB;if(!db)fail('Shared database is unavailable',503);
 // Sites dispatch protects every route. The browser uses owner sign-in; CLI uses the platform service-access header.
 const browser=!!req.headers.get('oai-authenticated-user-id');
 const actor=browser?'H':text(req.headers.get('X-Agent-Name'),80);
 if(!actor)fail('Set X-Agent-Name for agent requests',401);
 if(req.method!=='GET'){
   const origin=req.headers.get('Origin');if(origin&&origin!==url.origin)fail('Origin mismatch',403);
   if(req.headers.get('Sec-Fetch-Site')==='cross-site')fail('Cross-site mutation rejected',403);
 }
 if(url.pathname==='/api/state'&&req.method==='GET'){
   const projects=(await db.prepare('SELECT * FROM projects ORDER BY created_at,id').all()).results;
   const tasks=(await db.prepare('SELECT * FROM tasks ORDER BY created_at,id').all()).results.map(cleanTask);
   const evidence=(await db.prepare('SELECT * FROM evidence ORDER BY created_at DESC LIMIT 500').all()).results;
   const events=(await db.prepare('SELECT * FROM events ORDER BY created_at DESC,rowid DESC LIMIT 60').all()).results;
   return json({projects,tasks,evidence,events,server_time:now(),actor});
 }
 if(url.pathname==='/api/projects'&&req.method==='POST'){
   const b=await body(req);const title=text(b.title,120),goal=text(b.goal);if(!title||!goal)fail('Mission name and goal are required');
   const p=id();const cap=Number.isInteger(b.concurrency)?Math.max(1,Math.min(16,b.concurrency)):4;
   await db.prepare('INSERT INTO projects VALUES (?,?,?,?,?)').bind(p,title,goal,cap,now()).run();await event(db,p,'Mission created',actor);return json({id:p},201);
 }
 if(url.pathname==='/api/starter'&&req.method==='POST'){
   const b=await body(req);const s=STARTERS.find(x=>x.id===b.template);if(!s)fail('Unknown starter');
   const p=id(),ids=s.tasks.map(()=>id()),ts=now();
   await db.batch([db.prepare('INSERT INTO projects VALUES (?,?,?,?,?)').bind(p,s.title,s.goal,4,ts),...s.tasks.map((t,i)=>db.prepare('INSERT INTO tasks (id,project_id,title,description,role,dependencies,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').bind(ids[i],p,t[0],t[1],t[2],JSON.stringify(t[3].map(n=>ids[n])),ts+i,ts))]);
   await event(db,p,'Started from '+s.title,actor);return json({id:p},201);
 }
 if(url.pathname==='/api/tasks'&&req.method==='POST'){
   const b=await body(req);await project(db,b.project_id);const title=text(b.title,160);if(!title)fail('Task title is required');
   if(!ROLES.includes(b.role))fail('Choose a valid role');
   const deps=Array.isArray(b.dependencies)?[...new Set(b.dependencies)].slice(0,30):[];
   for(const d of deps){const dep=await task(db,d);if(dep.project_id!==b.project_id)fail('Dependencies must be in the same mission');}
   const t=id();await db.prepare('INSERT INTO tasks (id,project_id,title,description,role,dependencies,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?)').bind(t,b.project_id,title,text(b.description,8000),b.role,JSON.stringify(deps),now(),now()).run();await event(db,b.project_id,'Added task: '+title,actor);return json({id:t},201);
 }
 const match=url.pathname.match(/^\/api\/tasks\/([^/]+)\/(claim|heartbeat|submit|release|review)$/);
 if(match&&req.method==='POST'){
   const t=await task(db,match[1]),action=match[2],b=await body(req),ts=now();
   if(action==='claim'){
     const token=id()+id(),hash=await digest(token);
     const r=await db.prepare(`UPDATE tasks SET status='active',owner=?,lease_hash=?,lease_until=?,updated_at=? WHERE id=? AND (status='ready' OR (status='active' AND lease_until<=?)) AND NOT EXISTS (SELECT 1 FROM json_each(tasks.dependencies) d LEFT JOIN tasks dep ON dep.id=d.value WHERE dep.id IS NULL OR dep.status!='done') AND (SELECT count(*) FROM tasks x WHERE x.project_id=tasks.project_id AND x.status='active' AND x.lease_until>?) < (SELECT concurrency FROM projects WHERE projects.id=tasks.project_id)`).bind(actor,hash,ts+1200,ts,t.id,ts,ts).run();
     if(!r.meta.changes)fail('Task unavailable: it is owned, has unfinished dependencies, or the mission is at its active-agent limit.',409);
     await event(db,t.project_id,'Claimed: '+t.title,actor);return json({task:cleanTask(await task(db,t.id)),lease_token:token,lease_until:ts+1200});
   }
   if(action==='heartbeat'||action==='submit'||action==='release'){
     await assertLease(req,t,actor);
     const lease=req.headers.get('X-Lease-Token');const hash=await digest(lease);
     if(action==='heartbeat'){
       const r=await db.prepare("UPDATE tasks SET lease_until=?,updated_at=? WHERE id=? AND status='active' AND owner=? AND lease_hash=? AND lease_until>?").bind(ts+1200,ts,t.id,actor,hash,ts).run();if(!r.meta.changes)fail('Lease changed',409);return json({lease_until:ts+1200});
     }
     const result=text(b.result,12000);if(action==='submit'&&!result)fail('A result, limitations and verification are required');
     const status=action==='submit'?'review':'ready';
     const r=await db.prepare('UPDATE tasks SET status=?,result=?,lease_hash=NULL,lease_until=NULL,updated_at=? WHERE id=? AND status=\'active\' AND owner=? AND lease_hash=? AND lease_until>?').bind(status,result||t.result,ts,t.id,actor,hash,ts).run();if(!r.meta.changes)fail('Lease changed',409);
     await event(db,t.project_id,(action==='submit'?'Submitted for review: ':'Released: ')+t.title,actor);return json({ok:true});
   }
   if(action==='review'){
     if(typeof b.accept!=='boolean')fail('accept must be true or false');
     if(!browser&&t.owner===actor)fail('A different agent must review this result',409);
     const note=text(b.note,2000);if(!b.accept&&!note)fail('Explain what needs to change');
     const r=await db.prepare("UPDATE tasks SET status=?,result=?,updated_at=? WHERE id=? AND status='review'").bind(b.accept?'done':'ready',t.result+(note?'\n\nReview by '+actor+': '+note:''),ts,t.id).run();if(!r.meta.changes)fail('Only submitted tasks can be reviewed',409);
     await event(db,t.project_id,(b.accept?'Accepted: ':'Changes requested: ')+t.title,actor);return json({ok:true});
   }
 }
 if(url.pathname==='/api/evidence'&&req.method==='POST'){
   const b=await body(req);await project(db,b.project_id);const title=text(b.title,180);if(!title)fail('Evidence title is required');
   let link=text(b.url,2000);if(link){try{const u=new URL(link);if(!['https:','http:'].includes(u.protocol))fail('Use an HTTP or HTTPS source URL');link=u.href}catch{fail('Use a valid source URL');}}
   if(b.task_id){const t=await task(db,b.task_id);if(t.project_id!==b.project_id)fail('Task belongs to another mission');}
   await db.prepare('INSERT INTO evidence VALUES (?,?,?,?,?,?,?,?)').bind(id(),b.project_id,b.task_id||null,title,link,text(b.note,8000),actor,now()).run();await event(db,b.project_id,'Added evidence: '+title,actor);return json({ok:true},201);
 }
 return json({error:'Route not found'},404);
}
export default {async fetch(req,env){try{
 const url=new URL(req.url);
 if(url.pathname==='/api/health')return json({ok:true,database:!!env.DB});
 if(url.pathname.startsWith('/api/'))return await api(req,env,url);
 if(url.pathname!=='/'||req.method!=='GET')return new Response('Not found',{status:404});
 return new Response(HTML,{headers:{...HEADERS,'Content-Type':'text/html; charset=utf-8','Content-Security-Policy':"default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; base-uri 'none'; object-src 'none'; form-action 'self'"}});
}catch(e){return json({error:e.status?e.message:'The operation failed. Please retry.'},e.status||500);}}};
