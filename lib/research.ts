import {z} from 'zod';
import type {State,Task} from './domain';
import {analysisContextSchema,auditInputSchema,assertAuditVerdict,type AnalysisContext} from './analysis';

const identifier=z.string().trim().min(1).max(200);
export const needSchema=z.object({
 artifact_type:z.string().trim().min(1).max(100),query:z.string().trim().min(5).max(1000),rationale:z.string().trim().min(20).max(2000),
 branch:z.boolean().default(false),max_variants:z.number().int().min(1).max(6).default(1),
 preferred_skills:z.array(z.string().min(1).max(100)).max(8).default([]),param_variants:z.array(z.record(z.unknown())).max(6).default([])
});
// Payloads are deliberately excluded. The bridge supplies Python's exact canonical
// payload bytes separately for verification; only provenance metadata is retained.
export const artifactSchema=z.object({
 artifact_id:identifier,artifact_type:z.string().trim().min(1).max(100),producer_agent:z.string().trim().min(1).max(100),
 skill_used:z.string().trim().min(1).max(100),schema_version:z.literal('1.0'),investigation_id:z.string().max(300),
 timestamp:z.string().datetime({offset:true}),content_hash:z.string().regex(/^[a-f0-9]{64}$/),
 parent_artifact_ids:z.array(identifier).max(100).default([]),result_quality:z.enum(['ok','empty','irrelevant']).default('ok'),
 needs:z.array(needSchema).max(2).default([]),summary:z.string().max(1000).default('')
});
export type ArtifactRecord=z.infer<typeof artifactSchema>;
export type ResearchArtifact={record:ArtifactRecord;project:string;agentId:string;taskId?:string;fulfillsNeedId?:string;url:string;integrity:'hash-verified'|'metadata-only';analysisContext?:AnalysisContext;receivedAt:number};
export const researchOperations=[
 z.object({action:z.literal('publish_artifact'),project:identifier,agentId:identifier,record:artifactSchema,taskId:identifier.optional(),fulfillsNeedId:identifier.optional(),url:z.string().url().regex(/^https?:\/\//i).max(2000).optional(),canonicalPayload:z.string().max(100000).optional(),analysisContext:analysisContextSchema.optional()}),
 z.object({action:z.literal('review_analysis'),...auditInputSchema.shape}),
 z.object({action:z.literal('create_task_from_need'),needId:z.string().min(1).max(250),agentId:identifier})
] as const;
export type ResearchOperation=z.infer<(typeof researchOperations)[number]>;
export class ResearchError extends Error{constructor(message:string,public status=409){super(message);}}
export function researchNeeds(s:State){return (s.artifacts??[]).flatMap(a=>a.record.needs.map((need,index)=>{
 const id=a.record.artifact_id+'#'+index,responses=s.artifacts.filter(x=>x.fulfillsNeedId===id),taskIds=s.tasks.filter(t=>t.researchNeedId===id&&t.status!=='done'&&!responses.some(x=>x.taskId===t.id)).map(t=>t.id);
 const limit=need.branch?need.max_variants:1;
 return {id,project:a.project,sourceArtifactId:a.record.artifact_id,...need,maxVariants:limit,responses:responses.map(x=>x.record.artifact_id),taskIds,openSlots:Math.max(0,limit-responses.length-taskIds.length),status:responses.length>=limit?'answered':taskIds.length?'work-proposed':'open'};
}));}
export function researchSnapshot(s:State){return {contract:'scienceclaw-artifact-1.0',artifacts:s.artifacts??[],needs:researchNeeds(s),agents:s.agents,projects:s.projects,analysisReviews:s.analysisReviews??[]};}
export async function verifyArtifactPayload(op:ResearchOperation){
 if(op.action!=='publish_artifact'||op.canonicalPayload===undefined)return;
 let parsed:unknown;try{parsed=JSON.parse(op.canonicalPayload);}catch{throw new ResearchError('Canonical payload must be valid JSON.',400);}
 if(!parsed||typeof parsed!=='object'||Array.isArray(parsed))throw new ResearchError('ScienceClaw payload must be a JSON object.',400);
 const payload=parsed as Record<string,unknown>;
 if((payload.analysis_type==='differential_expression'||payload.analysis_kind==='differential_expression'||(payload.analysis_context as Record<string,unknown>|undefined)?.kind==='differential_expression')&&!op.analysisContext)throw new ResearchError('Differential-expression output requires a statistical analysisContext.',400);
 const bytes=new TextEncoder().encode(op.canonicalPayload);if(bytes.byteLength>100000)throw new ResearchError('Canonical payload exceeds 100 KB.',413);
 const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',bytes))].map(x=>x.toString(16).padStart(2,'0')).join('');
 if(hash!==op.record.content_hash)throw new ResearchError('Payload content hash does not match the ScienceClaw record.',400);
}
function assertAcyclic(artifacts:ResearchArtifact[]){
 const graph=new Map(artifacts.map(a=>[a.record.artifact_id,a.record.parent_artifact_ids])),visited=new Set<string>(),visiting=new Set<string>();
 const visit=(key:string)=>{if(visiting.has(key))throw new ResearchError('Artifact parent links would create a cycle.',400);if(visited.has(key)||!graph.has(key))return;visiting.add(key);for(const p of graph.get(key)!)visit(p);visiting.delete(key);visited.add(key);};
 for(const key of graph.keys())visit(key);
}
export function applyResearchOperation(original:State,op:ResearchOperation,now:number):State{
 const agent=original.agents.find(a=>a.id===op.agentId);if(!agent)throw new ResearchError('Register the agent first.',400);
 const s=structuredClone(original),log=(text:string)=>{s.events.unshift({id:crypto.randomUUID(),text,at:now});s.events=s.events.slice(0,200);};
 if(op.action==='review_analysis'){
  const a=s.artifacts.find(a=>a.record.artifact_id===op.artifactId);if(!a?.analysisContext)throw new ResearchError('A differential-expression artifact is required.',400);
  if(a.agentId===agent.id||a.record.producer_agent===(agent.scienceclawName??agent.name))throw new ResearchError('Statistical review requires a different agent.');
  try{assertAuditVerdict(a.analysisContext,op);}catch(e){throw new ResearchError((e as Error).message,400);}
  if(s.analysisReviews.length>=1000)throw new ResearchError('Review limit reached.');
  s.analysisReviews.push({artifactId:op.artifactId,agentId:op.agentId,verdict:op.verdict,summary:op.summary,checks:op.checks,createdAt:now});log(agent.name+' reviewed statistical assumptions: '+op.verdict);return s;
 }
 if(op.action==='create_task_from_need'){
  if(s.tasks.length>=500)throw new ResearchError('Workspace task limit reached.');
  const need=researchNeeds(s).find(n=>n.id===op.needId);if(!need)throw new ResearchError('Research need not found.',404);
  if(!need.openSlots)throw new ResearchError('This need already has its allowed responses or proposed work.');
  const source=s.artifacts.find(a=>a.record.artifact_id===need.sourceArtifactId)!;
  const t:Task={id:'T-'+crypto.randomUUID().slice(0,8),project:need.project,title:('Investigate: '+need.query).slice(0,160),role:agent.role,description:`Produce ${need.artifact_type} for: ${need.query}\n\nWhy: ${need.rationale}\nPreferred skills: ${need.preferred_skills.join(', ')||'choose an appropriate tool'}\nSource artifact: ${source.record.artifact_id}\n\nPublish the response with fulfillsNeedId=${need.id}; attach parent lineage. Distinguish evidence from inference, report checks and limitations, then hand off for human review.`,priority:'normal',dependencies:[],status:'backlog',owner:null,leaseUntil:null,evidence:'',artifact:'',createdAt:now,researchNeedId:need.id};
  s.tasks.push(t);log(agent.name+' proposed work for '+need.query);return s;
 }
 if(!s.projects.some(p=>p.id===op.project))throw new ResearchError('Unknown project.',400);
 if(/deseq|edger|limma|differential[_-]?expression/i.test(op.record.skill_used+' '+op.record.artifact_type)&&!op.analysisContext)throw new ResearchError('Differential-expression artifacts require statistical context.',400);
 if(op.record.producer_agent!==(agent.scienceclawName??agent.name))throw new ResearchError('Artifact producer must match the registered ScienceClaw name.',400);
 if(op.taskId){const t=s.tasks.find(t=>t.id===op.taskId);if(!t||t.project!==op.project||t.owner!==agent.id||t.status!=='working'||(t.leaseUntil??0)<=now)throw new ResearchError('Linking an artifact to a task requires this agent’s current lease in the same project.');if(t.analysisKind==='differential_expression'&&!op.analysisContext)throw new ResearchError('This task requires differential-expression analysisContext.',400);if(t.researchNeedId&&t.researchNeedId!==op.fulfillsNeedId)throw new ResearchError('Use the task’s researchNeedId when publishing its response.',400);}
 const candidate:ResearchArtifact={record:op.record,project:op.project,agentId:agent.id,...(op.taskId?{taskId:op.taskId}:{}),...(op.fulfillsNeedId?{fulfillsNeedId:op.fulfillsNeedId}:{}),url:op.url??'',...(op.analysisContext?{analysisContext:op.analysisContext}:{}),integrity:op.canonicalPayload!==undefined?'hash-verified':'metadata-only',receivedAt:now};
 const existing=s.artifacts.find(a=>a.record.artifact_id===op.record.artifact_id);
 if(existing){const immutable=(a:ResearchArtifact)=>JSON.stringify({record:a.record,project:a.project,agentId:a.agentId,taskId:a.taskId,fulfillsNeedId:a.fulfillsNeedId,url:a.url,analysisContext:a.analysisContext});if(immutable(existing)!==immutable(candidate))throw new ResearchError('Artifact ID already exists with different metadata. Records are immutable.');if(existing.integrity==='metadata-only'&&candidate.integrity==='hash-verified'){existing.integrity='hash-verified';log('Verified payload hash for '+op.record.artifact_id);return s;}return original;}
 if(s.artifacts.length>=500)throw new ResearchError('Artifact metadata limit reached; export this workspace before starting a new instance.');
 if(op.fulfillsNeedId){const need=researchNeeds(s).find(n=>n.id===op.fulfillsNeedId);if(!need||need.project!==op.project)throw new ResearchError('Unknown research need in this project.',400);if(need.artifact_type!==op.record.artifact_type)throw new ResearchError('Response artifact type does not match the need.',400);if(!op.record.parent_artifact_ids.includes(need.sourceArtifactId))throw new ResearchError('A response must include its source artifact as a parent.',400);if(need.responses.length>=need.maxVariants)throw new ResearchError('This need already has its allowed responses.');}
 s.artifacts.push(candidate);assertAcyclic(s.artifacts);log(agent.name+' published '+op.record.artifact_type+' · '+op.record.skill_used);return s;
}
