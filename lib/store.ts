import {env} from 'cloudflare:workers';
import {seedState,applyOperation,operationSchema,RuleError,normalizeState,type Snapshot} from './domain';
import {verifyArtifactPayload,ResearchError} from './research';
export async function readWorkspace():Promise<Snapshot>{
 if(!env.DB)throw new RuleError('Database is unavailable.',503);
 await env.DB.prepare('INSERT OR IGNORE INTO workspace (id,version,state) VALUES (?,0,?)').bind('main',JSON.stringify(seedState())).run();
 const row=await env.DB.prepare('SELECT version,state FROM workspace WHERE id=?').bind('main').first<{version:number;state:string}>();
 if(!row)throw new RuleError('Workspace unavailable.',503);
 return {version:row.version,state:normalizeState(JSON.parse(row.state))};
}
export async function mutate(body:unknown,human=false):Promise<Snapshot>{
 if(!body||typeof body!=='object')throw new RuleError('Expected an operation object.',400);
 const b=body as Record<string,unknown>;
 if(!Number.isInteger(b.version)||Number(b.version)<0)throw new RuleError('Include the latest workspace version.',400);
 const op=operationSchema.safeParse(b);
 if(!op.success)throw new RuleError(op.error.issues.map(i=>i.path.join('.')+': '+i.message).join('; '),400);
 const current=await readWorkspace();
 if(current.version!==b.version)throw new RuleError('Workspace changed. Refresh and retry.');
 if(op.data.action==='publish_artifact')await verifyArtifactPayload(op.data);
 const state=applyOperation(current.state,op.data,human);
 if(state===current.state)return current;
 if(new TextEncoder().encode(JSON.stringify(state)).byteLength>1500000)throw new RuleError('Workspace is full. Export it before adding more records.',413);
 const r=await env.DB!.prepare('UPDATE workspace SET state=?,version=version+1 WHERE id=? AND version=?').bind(JSON.stringify(state),'main',current.version).run();
 if(r.meta.changes!==1)throw new RuleError('Another agent updated the workspace. Refresh before retrying.');
 return {version:current.version+1,state};
}
export async function requestBody(request:Request){
 if(Number(request.headers.get('content-length'))>131072)throw new RuleError('Request too large.',413);
 const raw=await request.text();if(raw.length>131072)throw new RuleError('Request too large.',413);
 try{return JSON.parse(raw);}catch{throw new RuleError('Invalid JSON.',400);}
}
export function errorResponse(e:unknown){return Response.json({error:e instanceof RuleError||e instanceof ResearchError?e.message:'The request could not be completed. Please retry.'},{status:e instanceof RuleError||e instanceof ResearchError?e.status:500,headers:{'Cache-Control':'no-store'}});}
