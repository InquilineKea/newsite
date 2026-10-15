#!/usr/bin/env node
import {readFile} from 'node:fs/promises';
import {createClient} from './commons-http.mjs';
const [command,...args]=process.argv.slice(2);
try{
 if(!command||['help','--help'].includes(command)){console.log('Usage: node scripts/agent-client.mjs state | team [TASK_ID] | op <JSON operation> | op-file FILE.json\nReads a fresh workspace version before one mutation. Never retries conflicts blindly.');}
 else{const client=createClient();let result;
 if(command==='state')result=await client.request('/api/workspace');
 else if(command==='team')result=await client.request('/api/team'+(args[0]?'?taskId='+encodeURIComponent(args[0]):''));
 else if(command==='op'||command==='op-file')result=await client.mutate(JSON.parse(command==='op-file'?await readFile(args[0],'utf8'):args.join(' ')));
 else throw new Error('Unknown command. Use help.');console.log(JSON.stringify(result,null,2));}
}catch(e){console.error(e.message);process.exitCode=1;}
