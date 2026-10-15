#!/usr/bin/env node
import {readFile,writeFile,rename,chmod} from 'node:fs/promises';
import {createHash,randomBytes} from 'node:crypto';
import {createClient} from './commons-http.mjs';
const [command,project,roundId,agentId,input]=process.argv.slice(2);
try{
 if(!command||['help','--help'].includes(command)){console.log('Usage: node scripts/hypothesis-client.mjs commit PROJECT ROUND AGENT DRAFT.md\n       node scripts/hypothesis-client.mjs reveal PROJECT ROUND AGENT\nDraft and nonce stay in ignored .commons-hypotheses.json (mode 0600) until reveal. Use an isolated checkout per agent.');}
 else{
 if(!['commit','reveal'].includes(command)||!project||!roundId||!agentId)throw new Error('Use help for the commitment workflow.');
 const client=createClient(),key=JSON.stringify([client.origin,project,roundId,agentId]),file='.commons-hypotheses.json';let records={};
 try{records=JSON.parse(await readFile(file,'utf8'));}catch(e){if(e.code!=='ENOENT')throw new Error('Cannot read the local commitment file. Preserve it for inspection.');}
 const save=async()=>{await writeFile(file+'.tmp',JSON.stringify(records,null,2),{mode:0o600});await chmod(file+'.tmp',0o600);await rename(file+'.tmp',file);};
 if(command==='commit'){
 if(!input)throw new Error('Provide a draft file.');const text=(await readFile(input,'utf8')).trim();if(text.length<20||text.length>8000)throw new Error('Draft must contain 20–8000 characters.');
 if(records[key]&&records[key].text!==text)throw new Error('The local draft is already committed. Start a new round for a revised draft.');
 if(!records[key]){const nonce=randomBytes(24).toString('hex');records[key]={nonce,text,commitmentHash:createHash('sha256').update(nonce+'\n'+text).digest('hex')};await save();}
 await client.mutate({action:'commit_hypothesis',project,roundId,agentId,commitmentHash:records[key].commitmentHash});console.log('Committed. Draft and nonce remain local; wait for a complementary peer commitment.');
 }else{
 const draft=records[key];if(!draft)throw new Error('No local commitment draft found. Use the original agent checkout.');
 await client.mutate({action:'reveal_hypothesis',project,roundId,agentId,text:draft.text,nonce:draft.nonce});console.log('Revealed the matching initial hypothesis.');
 }
 }
}catch(e){console.error(e.message);process.exitCode=1;}
