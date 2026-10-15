import {z} from 'zod';
import {teamOperations,applyTeamOperation,withDefaultProfile,taskFit,specializationSchema,type Specialization,type Commitment} from './team';
import {assertStatisticalReview,type AnalysisReview} from './analysis';
import {researchOperations,applyResearchOperation,type ResearchArtifact} from './research';
export type Project={id:string;name:string;subtitle:string;brief:string;outcome:string;color:string};
export type Agent={id:string;name:string;role:string;perspective:string;color:string;scienceclawName?:string;preferredTools?:string[];specialization?:Specialization;profileSource?:'suggested-default'|'declared'};
export type Task={id:string;project:string;title:string;description:string;role:string;status:'backlog'|'working'|'review'|'done';priority:'high'|'normal';dependencies:string[];owner:string|null;leaseUntil:number|null;evidence:string;artifact:string;createdAt:number;researchNeedId?:string;analysisKind?:'differential_expression';requiredCapabilities?:string[]};
export type State={schemaVersion:3;commitments:Commitment[];analysisReviews:AnalysisReview[];artifacts:ResearchArtifact[];projects:Project[];agents:Agent[];tasks:Task[];events:{id:string;text:string;at:number}[];concurrency:number};
export type Snapshot={version:number;state:State};
const text=z.string().trim().min(1).max(8000),id=z.string().min(1).max(100),ref={taskId:id,agentId:id};
export const operationSchema=z.discriminatedUnion('action',[
 ...researchOperations,
 ...teamOperations,
 z.object({action:z.literal('create_task'),project:id,title:text.max(160),description:text,role:text.max(80),priority:z.enum(['high','normal']),dependencies:z.array(id).max(20),analysisKind:z.literal('differential_expression').optional(),requiredCapabilities:z.array(z.string().trim().min(1).max(100)).max(20).optional()}),
 z.object({action:z.literal('register_agent'),name:text.max(80),role:text.max(80),perspective:text.max(500),scienceclawName:z.string().trim().min(1).max(100).optional(),preferredTools:z.array(z.string().min(1).max(100)).max(100).optional(),specialization:specializationSchema.optional()}),
 z.object({action:z.literal('claim_task'),...ref}),
 z.object({action:z.literal('heartbeat'),...ref}),
 z.object({action:z.literal('release_task'),...ref}),
 z.object({action:z.literal('handoff'),...ref,evidence:text,artifact:z.string().trim().max(2000)}),
 z.object({action:z.literal('review_task'),taskId:id,decision:z.enum(['approve','revise']),note:text}),
 z.object({action:z.literal('update_brief'),project:id,brief:text}),
 z.object({action:z.literal('set_concurrency'),limit:z.number().int().min(1).max(12)})
]);
export type Operation=z.infer<typeof operationSchema>;
export class RuleError extends Error{constructor(message:string,public status=409){super(message);}}
export const LEASE_MS=30*60*1000;
export function seedState():State{
 const projects:Project[]=[
 {id:'diversity',name:'Diversity Lab',subtitle:'Explore → challenge → build',color:'#ee6347',brief:'Build an archive of genuinely different solutions to one scientific problem. H chooses the question and diversity descriptors. Explore independently before comparing results. Preserve dissent and attach evidence to claims.',outcome:'A quality-diversity archive and a reproducible comparison against a single-agent baseline.'},
 {id:'atlas',name:'Research Atlas',subtitle:'Connect ideas across disciplines',color:'#809a80',brief:'Build an evidence graph connecting papers, concepts and open questions. Keep sources attached to claims. Separate direct evidence, inference and speculation. Ask permission before accessing private accounts.',outcome:'A searchable map of concepts, counterarguments and unexplored connections.'},
 {id:'operators',name:'Operator Sandbox',subtitle:'Simulate → measure → compare',color:'#a594bb',brief:'Explore how communication topology changes collective problem solving. Start with a small reproducible simulation, compare topologies and measure diversity, robustness and task performance.',outcome:'An interactive simulation with falsifiable hypotheses and saved experiment configurations.'}];
 const agents:Agent[]=[
 {id:'explorer',name:'Explorer',role:'Explore',perspective:'Generate distinct hypotheses; vary assumptions and methods.',color:'#ee6347'},
 {id:'skeptic',name:'Skeptic',role:'Challenge',perspective:'Find counterexamples and missing evidence; preserve disagreement.',color:'#ad93ba'},
 {id:'builder',name:'Builder',role:'Build',perspective:'Make the smallest reproducible implementation.',color:'#7b9d9a'},
 {id:'evaluator',name:'Evaluator',role:'Evaluate',perspective:'Compare results against a baseline and inspect failure cases.',color:'#be9f60'},
 {id:'synthesizer',name:'Synthesizer',role:'Synthesize',perspective:'Connect results without erasing differences; prepare a decision for H.',color:'#829b72'}];
 const task=(id:string,project:string,title:string,role:string,description:string,dependencies:string[]=[],priority:'high'|'normal'='normal'):Task=>({id,project,title,role,description,dependencies,priority,status:'backlog',owner:null,leaseUntil:null,evidence:'',artifact:'',createdAt:Date.now()});
 return {schemaVersion:3,commitments:[],analysisReviews:[],artifacts:[],projects,agents:agents.map(withDefaultProfile),concurrency:3,events:[],tasks:[
 task('DIV-01','diversity','Define what “different” means','Explore','Propose three competing diversity descriptors. Explain what each captures, what it misses, and a concrete failure case.',[],'high'),
 task('DIV-02','diversity','Challenge the descriptors','Challenge','Find examples that look diverse under each descriptor but are functionally redundant. Propose one repair.',['DIV-01']),
 task('DIV-03','diversity','Build a minimal archive','Build','Implement an archive using reviewed descriptors. Record the random seed and exact run instructions.',['DIV-02']),
 task('DIV-04','diversity','Compare against a single agent','Evaluate','Use equal total compute budgets. Report quality, coverage, redundancy and failure cases.',['DIV-03']),
 task('DIV-05','diversity','Prepare the next decision','Synthesize','Summarize what survives criticism, retain unresolved disagreement and propose the next experiment.',['DIV-04']),
 task('ATL-01','atlas','Design a claim–evidence record','Build','Define a compact record for a claim, source, support strength, counterevidence and provenance.'),
 task('OP-01','operators','Specify a topology experiment','Explore','Choose one task, three communication graphs and a fixed message budget. State a falsifiable prediction.') ]};
}
export const active=(t:Task,now=Date.now())=>t.status==='working'&&(t.leaseUntil??0)>now;
export const blocked=(t:Task,s:State)=>t.dependencies.some(id=>s.tasks.find(x=>x.id===id)?.status!=='done');
export function applyOperation(original:State,op:Operation,human:boolean,now=Date.now()):State{
 if(op.action==='update_agent_profile'||op.action==='commit_hypothesis'||op.action==='reveal_hypothesis')return applyTeamOperation(original,op,now);
 if(op.action==='publish_artifact'||op.action==='create_task_from_need'||op.action==='review_analysis')return applyResearchOperation(original,op,now);
 const s=structuredClone(original),log=(text:string)=>{s.events.unshift({id:crypto.randomUUID(),text,at:now});s.events=s.events.slice(0,200);};
 if(op.action==='create_task'){
  if(s.tasks.length>=500)throw new RuleError('Workspace task limit reached.');
  if(!s.projects.some(p=>p.id===op.project))throw new RuleError('Unknown project.',400);
  if(op.dependencies.some((id:string)=>!s.tasks.some(t=>t.id===id&&t.project===op.project)))throw new RuleError('Dependencies must belong to this project.',400);
  s.tasks.push({id:'T-'+crypto.randomUUID().slice(0,8),project:op.project,title:op.title,description:op.description,role:op.role,priority:op.priority,dependencies:[...new Set<string>(op.dependencies)],...(op.analysisKind?{analysisKind:op.analysisKind}:{}),...(op.requiredCapabilities?{requiredCapabilities:[...new Set(op.requiredCapabilities)]}:{}),status:'backlog',owner:null,leaseUntil:null,evidence:'',artifact:'',createdAt:now});log('Added “'+op.title+'”');return s;
 }
 if(op.action==='register_agent'){
  if(op.scienceclawName){const existing=s.agents.find(a=>a.scienceclawName===op.scienceclawName);if(existing){if(existing.name!==op.name||existing.role!==op.role||existing.perspective!==op.perspective||JSON.stringify(existing.preferredTools??[])!==JSON.stringify(op.preferredTools??[])||(op.specialization&&JSON.stringify(existing.specialization)!==JSON.stringify(op.specialization)))throw new RuleError('ScienceClaw agent already registered with different settings. Reuse its ID.');return original;}}
  if(s.agents.length>=50)throw new RuleError('Maximum 50 registered agents.');
  s.agents.push({id:'a-'+crypto.randomUUID().slice(0,8),name:op.name,role:op.role,perspective:op.perspective,color:'#7b9d9a',...(op.scienceclawName?{scienceclawName:op.scienceclawName}:{}),...(op.preferredTools?{preferredTools:op.preferredTools}:{}),...(op.specialization?{specialization:op.specialization,profileSource:'declared' as const}:{})});log('Registered '+op.name);return s;
 }
 if(op.action==='update_brief'){const p=s.projects.find(p=>p.id===op.project);if(!p)throw new RuleError('Unknown project.',400);p.brief=op.brief;log('Updated '+p.name+' context');return s;}
 if(op.action==='set_concurrency'){s.concurrency=op.limit;log('Concurrency set to '+op.limit);return s;}
 const t=s.tasks.find(t=>t.id===op.taskId);if(!t)throw new RuleError('Task not found.',404);
 if(op.action==='review_task'){
  if(!human)throw new RuleError('Review requires a signed-in human using the website.',403);
  if(t.status!=='review')throw new RuleError('Only submitted work can be reviewed.');
  if(op.decision==='approve'){try{assertStatisticalReview(s,t);}catch(e){throw new RuleError((e as Error).message);}}
  t.status=op.decision==='approve'?'done':'backlog';t.leaseUntil=null;
  if(op.decision==='revise'){t.owner=null;t.description+='\n\nReview feedback: '+op.note;}
  log((op.decision==='approve'?'Approved ':'Requested revision: ')+t.title+' — '+op.note);return s;
 }
 const a=s.agents.find(a=>a.id===op.agentId);if(!a)throw new RuleError('Register the agent first.',400);
 if(op.action==='claim_task'){
  const fit=taskFit(a,t);if(!fit.eligible)throw new RuleError('Missing declared capabilities: '+fit.missingCapabilities.join(', '));
  if(!['backlog','working'].includes(t.status)||active(t,now))throw new RuleError('Task is already claimed or submitted.');
  if(blocked(t,s))throw new RuleError('Approve the dependencies first.');
  if(s.tasks.filter(t=>active(t,now)).length>=s.concurrency)throw new RuleError('Concurrency limit reached.');
  if(s.tasks.some(t=>active(t,now)&&t.owner===a.id))throw new RuleError('This agent already has an active task.');
  t.status='working';t.owner=a.id;t.leaseUntil=now+LEASE_MS;log(a.name+' claimed '+t.title);return s;
 }
 if(t.owner!==a.id||!active(t,now))throw new RuleError('A current lease owned by this agent is required. Reclaim expired work first.');
 if(op.action==='heartbeat'){t.leaseUntil=now+LEASE_MS;return s;}
 if(op.action==='release_task'){t.status='backlog';t.owner=null;t.leaseUntil=null;log(a.name+' released '+t.title);return s;}
 if(op.action==='handoff'){
  if(op.artifact&&!/^https?:\/\//i.test(op.artifact))throw new RuleError('Artifact must be an http or https URL.',400);
  t.status='review';t.evidence=op.evidence;t.artifact=op.artifact;t.leaseUntil=null;log(a.name+' submitted '+t.title+' for review');return s;
 }
 throw new RuleError('Unknown operation.',400);
}

// Additive read upgrade: retain every existing project, lease and review record.
export function normalizeState(s:State):State{return {...s,schemaVersion:3,commitments:s.commitments??[],agents:s.agents.map(withDefaultProfile),artifacts:s.artifacts??[],analysisReviews:s.analysisReviews??[]};}
