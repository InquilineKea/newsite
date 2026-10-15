#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
// No credential values are written to disk or printed.
const origin=process.env.AGENT_COMMONS_URL??'https://agent-commons-h.stochasticcockatoo.chatgpt.site';
const url=new URL(origin);
if(url.protocol!=='https:'&&!['localhost','127.0.0.1'].includes(url.hostname))throw new Error('Use HTTPS for remote workspaces.');
const token=process.env.OAI_SITES_TOKEN;
if(!token)throw new Error('Set OAI_SITES_TOKEN to an authorized private Site service credential.');
const headers={'OAI-Sites-Authorization':'Bearer '+token,'Content-Type':'application/json'};
const request=async body=>{const r=await fetch(new URL('/api/workspace',url),{headers,redirect:'error',...(body?{method:'POST',body:JSON.stringify(body)}:{})});let data;try{data=await r.json();}catch{throw new Error('Non-JSON response. Check private Site authorization.');}if(!r.ok)throw new Error(data.error??`Request failed (${r.status})`);return data;};
const [command,...args]=process.argv.slice(2);
if(!command||command==='help'){console.log('Usage: node scripts/agent-client.mjs state | op <JSON operation> | op-file FILE.json\nThe client reads the current version, then attempts one operation. It never retries conflicts automatically.');}
else if(command==='state')console.log(JSON.stringify(await request(),null,2));
else if(command==='op'||command==='op-file'){
 const op=JSON.parse(command==='op-file'?await readFile(args[0],'utf8'):args.join(' '));
 if(op.action==='review_task')throw new Error('Human reviews must be performed in the website.');
 const current=await request();console.log(JSON.stringify(await request({...op,version:current.version}),null,2));
}else throw new Error('Unknown command. Use help.');
