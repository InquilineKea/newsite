import {z} from 'zod';
import type {Agent,State,Task} from './domain';
export const axes={
 method:['mechanistic','causal-statistical','computational','formal','empirical','integrative'],
 evidence:['primary-literature','raw-data','metadata','simulation','executable-tests','held-out-data','replication','artifact-lineage'],
 assumptions:['causal-identifiability','measurement-validity','selection-bias','implementation-correctness','numerical-stability','generalization','logical-consistency'],
 scale:['component','system','cross-scale'],
 search:['divergent','adversarial','constructive','confirmatory','integrative']
} as const;
export type Axis=keyof typeof axes;
const tags=<T extends readonly [string,...string[]]>(values:T)=>z.array(z.enum(values)).min(1).max(4).refine(a=>new Set(a).size===a.length,'Use unique tags.');
export const specializationSchema=z.object({method:tags(axes.method),evidence:tags(axes.evidence),assumptions:tags(axes.assumptions),scale:tags(axes.scale),search:tags(axes.search),modelFamily:z.string().trim().min(1).max(100).optional(),toolchain:z.array(z.string().trim().min(1).max(100)).max(30).default([]),independenceGroup:z.string().trim().min(1).max(100).optional(),rationale:z.string().trim().min(20).max(1500)});
export type Specialization=z.infer<typeof specializationSchema>;
export type Commitment={project:string;roundId:string;agentId:string;commitmentHash:string;profile:Specialization;at:number;revealedText?:string;revealedAt?:number};
const ident=z.string().trim().min(1).max(100);
export const teamOperations=[
 z.object({action:z.literal('update_agent_profile'),agentId:ident,specialization:specializationSchema,preferredTools:z.array(z.string().trim().min(1).max(100)).max(100).optional()}),
 z.object({action:z.literal('commit_hypothesis'),project:ident,roundId:ident,agentId:ident,commitmentHash:z.string().regex(/^[a-f0-9]{64}$/)}),
 z.object({action:z.literal('reveal_hypothesis'),project:ident,roundId:ident,agentId:ident,text:z.string().trim().min(20).max(8000),nonce:z.string().min(16).max(200)})
] as const;
export type TeamOperation=z.infer<(typeof teamOperations)[number]>;
const profile=(p:Omit<Specialization,'toolchain'>):Specialization=>({...p,toolchain:[]});
export const defaultSpecializations:Record<string,Specialization>={
 explorer:profile({method:['mechanistic','computational'],evidence:['primary-literature','simulation'],assumptions:['causal-identifiability'],scale:['component','system'],search:['divergent'],rationale:'Explore distinct generative mechanisms and descriptors; expose which assumptions make each mechanism plausible.'}),
 skeptic:profile({method:['causal-statistical','empirical'],evidence:['metadata','raw-data','replication'],assumptions:['causal-identifiability','selection-bias','measurement-validity'],scale:['system'],search:['adversarial'],rationale:'Test alternative explanations, confounding and selection; identify what the data cannot distinguish.'}),
 builder:profile({method:['computational','formal'],evidence:['executable-tests','simulation'],assumptions:['implementation-correctness','numerical-stability'],scale:['component'],search:['constructive'],rationale:'Turn claims into executable artifacts; check implementation correctness, units and numerical behavior.'}),
 evaluator:profile({method:['causal-statistical','empirical'],evidence:['held-out-data','replication','raw-data'],assumptions:['generalization','measurement-validity'],scale:['system','cross-scale'],search:['confirmatory'],rationale:'Use held-out or replicated observations and equal-budget baselines to assess generalization and calibration.'}),
 synthesizer:profile({method:['integrative','formal'],evidence:['artifact-lineage','primary-literature'],assumptions:['logical-consistency','causal-identifiability'],scale:['cross-scale'],search:['integrative'],rationale:'Connect compatible results across scales, preserve disagreement, and separate warranted conclusions from speculative bridges.'})
};
export function withDefaultProfile(a:Agent):Agent{const p=defaultSpecializations[a.id];return !a.specialization&&p?{...a,specialization:structuredClone(p),profileSource:'suggested-default'}:a;}
const norm=(s:string)=>s.trim().toLowerCase();
const overlap=(a:string[],b:string[])=>{const aa=new Set(a.map(norm)),bb=new Set(b.map(norm)),union=new Set([...aa,...bb]);return union.size?[...aa].filter(x=>bb.has(x)).length/union.size:0;};
export function compareAgents(a:Agent,b:Agent){const pa=a.specialization,pb=b.specialization;
 const byAxis=pa&&pb?Object.fromEntries((Object.keys(axes) as Axis[]).map(key=>[key,{shared:pa[key].filter(x=>(pb[key] as string[]).includes(x)),distance:1-overlap(pa[key],pb[key])}])) as Record<Axis,{shared:string[];distance:number}>:null;
 const coreAxes=['method','evidence','assumptions'] as const;
 const differentCoreAxes=byAxis?coreAxes.filter(k=>byAxis[k].distance>=0.5):[];
 const sameModel=pa?.modelFamily&&pb?.modelFamily?norm(pa.modelFamily)===norm(pb.modelFamily):null;
 const sameGroup=pa?.independenceGroup&&pb?.independenceGroup?norm(pa.independenceGroup)===norm(pb.independenceGroup):null;
 const sharedTools=pa&&pb?pa.toolchain.filter(x=>pb.toolchain.some(y=>norm(x)===norm(y))):[];
 return {agentA:a.id,agentB:b.id,byAxis,differentCoreAxes,sameModel,sameGroup,sharedTools,reviewComplementary:!!byAxis&&differentCoreAxes.length>=2&&sameGroup!==true,
 warnings:[...(!byAxis?['One or both profiles are unspecified.']:[]),...(sameModel===null?['Model-family independence is unverified.']:sameModel?['Shared model family may correlate errors.']:[]),...(sameGroup===true?['Shared independence group: this pair cannot provide the required independent statistical review.']:[]),...(byAxis&&differentCoreAxes.length<2?['Core method, evidence and assumption emphases overlap too much for the review rule.']:[])]};
}
export function taskFit(agent:Agent,task:Task){const required=task.requiredCapabilities??[],tools=(agent.preferredTools??[]).map(norm),missing=required.filter(x=>!tools.includes(norm(x)));return {agentId:agent.id,missingCapabilities:missing,eligible:missing.length===0,roleMatch:norm(agent.role)===norm(task.role)};}
export function teamSnapshot(s:State,taskId?:string){
 const task=taskId?s.tasks.find(t=>t.id===taskId):undefined;
 const pairs=s.agents.flatMap((a,i)=>s.agents.slice(i+1).map(b=>compareAgents(a,b)));
 const coverage=Object.fromEntries((Object.keys(axes) as Axis[]).map(key=>[key,{covered:[...new Set(s.agents.flatMap(a=>a.specialization?.[key]??[]))],missing:axes[key].filter(v=>!s.agents.some(a=>(a.specialization?.[key] as string[]|undefined)?.includes(v)))}]));
 const sharedPayloads=s.artifacts.flatMap((a,i)=>s.artifacts.slice(i+1).filter(b=>a.agentId!==b.agentId&&a.record.content_hash===b.record.content_hash).map(b=>({artifactA:a.record.artifact_id,artifactB:b.record.artifact_id,agents:[a.agentId,b.agentId]})));
 return {axes,agents:s.agents,pairs,coverage,unprofiledAgents:s.agents.filter(a=>!a.specialization).map(a=>a.id),runtimeUnknown:s.agents.filter(a=>!a.specialization?.modelFamily).map(a=>a.id),sharedPayloads,commitments:s.commitments??[],...(task?{taskFit:s.agents.map(a=>taskFit(a,task))}:{}),policy:{coreAxes:['method','evidence','assumptions'],minimumDifferentAxes:2,minimumJaccardDistance:0.5,meaning:'Declared coverage and overlap diagnostics, not a statistical proof of independence. Shared inputs and standards can be useful; maximize task-relevant complementarity, not difference for its own sake.'}};
}
export class TeamError extends Error{constructor(message:string,public status=409){super(message);}}
export function assertComplementaryReview(s:State,producerId:string,reviewerId:string){const producer=s.agents.find(a=>a.id===producerId),reviewer=s.agents.find(a=>a.id===reviewerId);if(!producer||!reviewer||!compareAgents(producer,reviewer).reviewComplementary)throw new TeamError('Review needs declared differences on at least two of method, evidence and assumptions, with no shared independence group. Configure profiles first.');}
export async function verifyTeamOperation(s:State,op:TeamOperation){if(op.action!=='reveal_hypothesis')return;const c=s.commitments.find(c=>c.project===op.project&&c.roundId===op.roundId&&c.agentId===op.agentId);if(!c)throw new TeamError('Commit your hypothesis before revealing.');const hash=[...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(op.nonce+'\n'+op.text)))].map(x=>x.toString(16).padStart(2,'0')).join('');if(hash!==c.commitmentHash)throw new TeamError('Revealed hypothesis does not match its salted commitment.',400);}
export function applyTeamOperation(original:State,op:TeamOperation,now:number):State{
 const s=structuredClone(original),a=s.agents.find(a=>a.id===op.agentId);if(!a)throw new TeamError('Register the agent first.',400);
 const log=(text:string)=>{s.events.unshift({id:crypto.randomUUID(),text,at:now});s.events=s.events.slice(0,200);};
 if(op.action==='update_agent_profile'){a.specialization=op.specialization;a.profileSource='declared';if(op.preferredTools)a.preferredTools=[...new Set(op.preferredTools)];log('Updated complementary profile for '+a.name);return s;}
 if(!s.projects.some(p=>p.id===op.project))throw new TeamError('Unknown project.',400);
 if(!a.specialization)throw new TeamError('Declare an agent profile before joining an independent round.');
 const round=s.commitments.filter(c=>c.project===op.project&&c.roundId===op.roundId),own=round.find(c=>c.agentId===op.agentId);
 if(op.action==='commit_hypothesis'){
  if(round.some(c=>c.revealedText!==undefined))throw new TeamError('The round is already revealing. Start a new round to add a participant.');
  if(own){if(own.commitmentHash===op.commitmentHash)return original;throw new TeamError('A committed hypothesis cannot be replaced. Start a new round.');}
  if(round.some(c=>c.commitmentHash===op.commitmentHash))throw new TeamError('A peer already submitted this commitment hash. Commit your own independently salted draft.');
  if(s.commitments.length>=500)throw new TeamError('Commitment limit reached.');
  s.commitments.push({project:op.project,roundId:op.roundId,agentId:op.agentId,commitmentHash:op.commitmentHash,profile:structuredClone(a.specialization),at:now});log(a.name+' committed an independent hypothesis (text remains local)');return s;
 }
 if(!own)throw new TeamError('Commit your hypothesis before revealing.');
 if(own.revealedText!==undefined){if(own.revealedText===op.text)return original;throw new TeamError('A revealed hypothesis cannot be replaced.');}
 if(!round.some(c=>c.agentId!==a.id&&compareAgents({...a,specialization:own.profile},{...s.agents.find(x=>x.id===c.agentId)!,specialization:c.profile}).reviewComplementary))throw new TeamError('A complementary peer must commit before either hypothesis is revealed.');
 own.revealedText=op.text;own.revealedAt=now;log(a.name+' revealed an independently committed hypothesis');return s;
}
