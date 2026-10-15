import {z,type ZodTypeAny} from 'zod';
import {operationSchema} from './domain';
import {analysisContextSchema,auditCategories} from './analysis';
// Keep discovery schemas derived from the same Zod schemas used for writes.
// Cross-field refinements are enforced server-side, not represented in JSON Schema.
export function jsonSchema(schema:ZodTypeAny):Record<string,unknown>{
 if(schema instanceof z.ZodEffects)return jsonSchema(schema.innerType());
 if(schema instanceof z.ZodOptional||schema instanceof z.ZodDefault)return jsonSchema(schema._def.innerType);
 if(schema instanceof z.ZodObject){const properties:Record<string,unknown>={},required:string[]=[];for(const [key,value] of Object.entries(schema.shape) as [string,ZodTypeAny][]){properties[key]=jsonSchema(value);if(!value.isOptional())required.push(key);}return {type:'object',properties,required,additionalProperties:false};}
 if(schema instanceof z.ZodString){const out:Record<string,unknown>={type:'string'};for(const check of schema._def.checks){if(check.kind==='min')out.minLength=check.value;if(check.kind==='max')out.maxLength=check.value;if(check.kind==='regex')out.pattern=check.regex.source;if(check.kind==='url')out.format='uri';if(check.kind==='datetime')out.format='date-time';}return out;}
 if(schema instanceof z.ZodNumber){const out:Record<string,unknown>={type:'number'};for(const c of schema._def.checks){if(c.kind==='int')out.type='integer';if(c.kind==='min')out.minimum=c.value;if(c.kind==='max')out.maximum=c.value;}return out;}
 if(schema instanceof z.ZodArray)return {type:'array',items:jsonSchema(schema.element),...(schema._def.minLength?{minItems:schema._def.minLength.value}:{}),...(schema._def.maxLength?{maxItems:schema._def.maxLength.value}:{}),...(schema._def.exactLength?{minItems:schema._def.exactLength.value,maxItems:schema._def.exactLength.value}:{})};
 if(schema instanceof z.ZodEnum)return {type:'string',enum:schema.options};
 if(schema instanceof z.ZodLiteral)return {type:typeof schema.value,const:schema.value};
 if(schema instanceof z.ZodBoolean)return {type:'boolean'};
 if(schema instanceof z.ZodRecord)return {type:'object',additionalProperties:jsonSchema(schema._def.valueType)};
 if(schema instanceof z.ZodUnknown)return {};
 throw new Error('Unsupported discovery schema: '+schema._def.typeName);
}
const descriptions:Record<string,string>={
 register_agent:'Register a trusted worker. Optional scienceclawName and preferredTools link a native ScienceClaw identity. Identical native registrations are idempotent.',
 create_task:'Add scoped work with existing dependencies. Set analysisKind=differential_expression to require statistical provenance and independent audit before human approval.',
 claim_task:'Atomically claim an available task for 30 minutes. Respects dependencies and concurrency limit.',
 heartbeat:'Renew a current task lease before it expires.',release_task:'Release a current task lease.',
 handoff:'Submit evidence and an optional artifact URL for human review. Does not approve work.',
 publish_artifact:'Publish immutable ScienceClaw Artifact 1.0 metadata, parent lineage and unmet needs. canonicalPayload verifies SHA-256 but is never retained. Differential expression requires analysisContext; use get_analysis_contract.',
 create_task_from_need:'Propose bounded work in response to an artifact need. Preserves its source and competing-variant limit; does not claim or execute the task.',
 review_analysis:'Independently audit a differential-expression artifact. Review sample selection, filtering, covariates, maturity, composition, depth, replication, and model/multiplicity. Producer cannot review itself. Does not approve the task.'
};
export const tools=[
 {name:'get_workspace',description:'Read projects, agents, tasks, dependencies, artifact metadata and workspace version.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'get_research',description:'Read ScienceClaw artifact lineage, unmet needs, competing responses and statistical reviews with the current workspace version.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 {name:'get_analysis_contract',description:'Read the required statistical context schema and independent audit checklist before differential-expression work.',inputSchema:{type:'object',properties:{},additionalProperties:false}},
 ...operationSchema.options.filter(op=>descriptions[op.shape.action.value]).map(op=>{
  const {action,...properties}=op.shape;
  const inputSchema=jsonSchema(z.object({...properties,version:z.number().int().min(0)}));
  return {name:action.value,description:descriptions[action.value],inputSchema};
 })
];
export const analysisContract=()=>({kind:'differential_expression',contextSchema:jsonSchema(analysisContextSchema),auditCategories,policy:[
 'Record exact sample inclusion/exclusion, experimental unit, independent replicate counts, gene filtering, normalization, design formula, contrast, software and data provenance.',
 'State the target estimand and whether choices were prespecified, exploratory or retrospective. Classify covariates as technical factors, confounders, mediators, colliders, proxies, effect modifiers or unknown; justify adjustment instead of controlling for everything.',
 'Explain both adjusted covariates and unmeasured alternatives. Do not treat covariate adjustment as proof that a confounder has been removed.',
 'A statistically significant contrast supports an association within the stated samples and model; it does not establish mutation-specific causation.',
 'Assess developmental maturity, cell-type composition, sequencing depth and technical batches; document unavailable measurements and non-identifiable contrasts.',
 'Every sensitivity category needs a result or an explicit not-run/not-applicable rationale. A separate agent reviews the evidence.',
 'Untested alternatives or failed checks cannot receive a supported verdict. Fully non-identifiable contrasts are blocked. Human task approval remains separate.'
]});
