import {z} from 'zod';
import type {compareAgents} from './team';
import type {State,Task} from './domain';
const note=z.string().trim().min(10).max(2000);
export const auditCategories=['sample-selection','gene-filtering','batch-and-covariates','maturity','cell-composition','sequencing-depth','independent-replication','model-and-multiplicity'] as const;
const category=z.enum(auditCategories);
const allCategories=(x:{category:string}[])=>new Set(x.map(c=>c.category)).size===auditCategories.length&&x.length===auditCategories.length;
export const analysisContextSchema=z.object({
 kind:z.literal('differential_expression'),question:note,estimand:note,choiceTiming:z.enum(['prespecified','exploratory','retrospective']),dataProvenance:note,experimentalUnit:note,
 includedSamples:z.array(z.string().trim().min(1).max(100)).min(2).max(500),
 excludedSamples:z.array(z.object({sample:z.string().min(1).max(100),reason:note})).max(500),
 replicateCounts:z.array(z.object({group:z.string().min(1).max(100),independentReplicates:z.number().int().min(1).max(10000)})).min(2).max(50),
 geneFilter:note,normalization:note,designFormula:z.string().trim().min(1).max(1000),contrast:note,
 covariates:z.array(z.object({name:z.string().min(1).max(100),causalRole:z.enum(['technical','confounder','mediator','collider','proxy','effect-modifier','unknown']).default('unknown'),handling:z.enum(['adjusted','stratified','sensitivity-only','unmeasured','not-applicable']),reason:note,confoundedWithCondition:z.boolean()})).max(50),
 identifiability:z.enum(['estimable','partially-confounded','not-identifiable','unknown']),
 software:note,multipleTesting:note,effectSize:note,
 sensitivityChecks:z.array(z.object({category,status:z.enum(['passed','failed','not-run','not-applicable']),finding:note,artifactIds:z.array(z.string().min(1).max(200)).max(20)})).length(8).refine(allCategories,'Include each audit category exactly once.'),
 claim:z.object({scope:z.literal('association'),statement:note}),limitations:z.array(note).min(1).max(30)
}).superRefine((c,ctx)=>{if(new Set(c.includedSamples).size!==c.includedSamples.length)ctx.addIssue({code:z.ZodIssueCode.custom,message:'Included samples must be unique.'});if(c.excludedSamples.some(x=>c.includedSamples.includes(x.sample)))ctx.addIssue({code:z.ZodIssueCode.custom,message:'A sample cannot be both included and excluded.'});});
export type AnalysisContext=z.infer<typeof analysisContextSchema>;
export const auditInputSchema=z.object({artifactId:z.string().min(1).max(200),agentId:z.string().min(1).max(200),verdict:z.enum(['supported','qualified','blocked']),summary:note,checks:z.array(z.object({category,status:z.enum(['supported','concern','untested','not-applicable']),evidence:note})).length(8).refine(allCategories,'Review every audit category exactly once.')});
export type AnalysisReview=z.infer<typeof auditInputSchema>&{createdAt:number;profileComparison?:ReturnType<typeof compareAgents>};
export function assertAuditVerdict(context:AnalysisContext,review:z.infer<typeof auditInputSchema>){
 if(review.verdict!=='blocked'&&context.identifiability==='not-identifiable')throw new Error('The contrast is not identifiable. Record a blocked review and request a revised analysis or claim.');
 if(review.verdict==='supported'&&(context.identifiability!=='estimable'||context.covariates.some(c=>c.confoundedWithCondition)||context.sensitivityChecks.some(c=>['failed','not-run'].includes(c.status))||review.checks.some(c=>['concern','untested'].includes(c.status))))throw new Error('Unresolved confounding, failed checks or untested alternatives require a qualified or blocked verdict.');
}
export function assertStatisticalReview(s:State,t:Task){
 const artifacts=s.artifacts.filter(a=>a.taskId===t.id&&a.analysisContext);
 if(t.analysisKind==='differential_expression'&&!artifacts.length)throw new Error('This task requires a differential-expression artifact with its statistical context.');
 const descendsFrom=(node:string,ancestor:string,seen=new Set<string>()):boolean=>{if(seen.has(node))return false;seen.add(node);const parents=s.artifacts.find(a=>a.record.artifact_id===node)?.record.parent_artifact_ids??[];return parents.some(p=>p===ancestor||descendsFrom(p,ancestor,seen));};
 const current=artifacts.filter(a=>!artifacts.some(b=>a!==b&&descendsFrom(b.record.artifact_id,a.record.artifact_id)));
 for(const a of current){const reviews=s.analysisReviews.filter(r=>r.artifactId===a.record.artifact_id),latest=reviews.at(-1);if(!latest||latest.verdict==='blocked')throw new Error('Complete an independent statistical review before approving this task.');}
}
