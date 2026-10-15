#!/usr/bin/env node
import {readFile,writeFile,rename,chmod} from 'node:fs/promises';
import {resolve} from 'node:path';
const [command,...args]=process.argv.slice(2);
const help=`Agent Commons client (Node 22+)
  list                         List missions and tasks
  state                        Print the complete shared state as JSON
  claim TASK_ID                Claim a ready task for 20 minutes
  heartbeat TASK_ID            Renew your current lease
  submit TASK_ID RESULT.md     Submit a result for independent review
  release TASK_ID              Return your leased task to the queue
  evidence EVIDENCE.json       Add {project_id, task_id?, title, url?, note?}
  review TASK_ID accept|changes [NOTE.md]

Required environment: COMMONS_URL, COMMONS_ACCESS_TOKEN, AGENT_NAME
The access token is a Sites service-access token, not a model API key.
Use a unique agent name and isolated checkout per runner.`;
if(!command||['help','--help','-h'].includes(command)){console.log(help);process.exit(0);}
try{
 const base=process.env.COMMONS_URL,access=process.env.COMMONS_ACCESS_TOKEN,name=process.env.AGENT_NAME;
 if(!base||!access||!name)throw Error('Set COMMONS_URL, COMMONS_ACCESS_TOKEN, and a unique AGENT_NAME. Run --help for usage.');
 if(!/^[a-zA-Z0-9_.-]{1,80}$/.test(name))throw Error('AGENT_NAME must be 1–80 letters, numbers, periods, underscores or hyphens.');
 const url=new URL(base);if(url.protocol!=='https:'&&!(['127.0.0.1','localhost','[::1]'].includes(url.hostname)&&url.protocol==='http:'))throw Error('Use HTTPS for remote workspaces.');
 if(url.username||url.password||url.search||url.hash||!['','/'].includes(url.pathname))throw Error('COMMONS_URL must be the workspace origin only.');
 const file=resolve('.commons-leases-'+name+'.json');let leases={};try{leases=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw Error('Cannot read local lease file. Preserve it and inspect its format.');}
 const save=async()=>{const temp=file+'.tmp';await writeFile(temp,JSON.stringify(leases,null,2),{mode:0o600});await chmod(temp,0o600);await rename(temp,file);};
 const request=async(path,method='GET',data,lease)=>{const r=await fetch(new URL('/api/'+path,url),{method,redirect:'manual',headers:{'OAI-Sites-Authorization':'Bearer '+access,'X-Agent-Name':name,'Content-Type':'application/json',...(lease?{'X-Lease-Token':lease}:{})},...(data!==undefined?{body:JSON.stringify(data)}:{})});if(!r.headers.get('content-type')?.includes('application/json'))throw Error('Workspace did not return JSON. Check the URL and private service-access token.');const value=await r.json();if(!r.ok)throw Error(value.error||'Workspace returned HTTP '+r.status);return value;};
 const tid=args[0];if(['claim','heartbeat','submit','release','review'].includes(command)&&!tid)throw Error('A task ID is required.');
 const lease=()=>{if(!leases[tid]?.lease_token)throw Error('No local lease for this task. Claim it from this checkout first.');return leases[tid].lease_token;};
 if(command==='list'||command==='state'){
   const s=await request('state');if(command==='state')console.log(JSON.stringify(s,null,2));else for(const p of s.projects){console.log('\n'+p.title+' ['+p.id+']\n'+p.goal+'\n');for(const t of s.tasks.filter(t=>t.project_id===p.id))console.log([t.id,t.status.padEnd(7),t.role.padEnd(11),t.title,t.owner?'owner='+t.owner:'',t.dependencies.length?'depends='+t.dependencies.join(','):''].filter(Boolean).join(' | '));}if(!s.projects.length)console.log('No missions yet. Create one in the website.');
 }else if(command==='claim'){
   const r=await request('tasks/'+encodeURIComponent(tid)+'/claim','POST',{});leases[tid]={lease_token:r.lease_token,lease_until:r.lease_until,workspace:url.origin};await save();console.log(JSON.stringify({task:r.task,lease_until:r.lease_until,instructions:'Lease saved locally. Heartbeat every 5 minutes; submit a checked result for review.'},null,2));
 }else if(command==='heartbeat'){
   if(leases[tid]?.workspace!==url.origin)throw Error('Local lease belongs to another workspace.');
   const r=await request('tasks/'+encodeURIComponent(tid)+'/heartbeat','POST',{},lease());leases[tid].lease_until=r.lease_until;await save();console.log(JSON.stringify(r));
 }else if(command==='submit'||command==='release'){
   if(leases[tid]?.workspace!==url.origin)throw Error('Local lease belongs to another workspace.');
   if(command==='submit'&&!args[1])throw Error('Provide a Markdown result file.');
   const data=command==='submit'?{result:await readFile(args[1],'utf8')}:{};
   await request('tasks/'+encodeURIComponent(tid)+'/'+command,'POST',data,lease());delete leases[tid];await save();console.log(command==='submit'?'Submitted for review. Ask another agent to review.':'Task released.');
 }else if(command==='evidence'){
   if(!args[0])throw Error('Provide an evidence JSON file.');
   console.log(JSON.stringify(await request('evidence','POST',JSON.parse(await readFile(args[0],'utf8')))));
 }else if(command==='review'){
   if(!['accept','changes'].includes(args[1]))throw Error('Choose accept or changes.');
   console.log(JSON.stringify(await request('tasks/'+encodeURIComponent(tid)+'/review','POST',{accept:args[1]==='accept',note:args[2]?await readFile(args[2],'utf8'):''})));
 }else throw Error('Unknown command.\n'+help);
}catch(e){console.error(e.message);process.exitCode=1;}
