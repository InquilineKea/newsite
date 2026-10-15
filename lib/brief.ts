import type {State} from './domain';
import {taskFit} from './team';
export function agentBrief(s:State,agentId:string,taskId?:string){
 const a=s.agents.find(a=>a.id===agentId);if(!a)throw new Error('Agent not found.');
 const t=taskId?s.tasks.find(t=>t.id===taskId):undefined;if(taskId&&!t)throw new Error('Task not found.');
 return [`Agent: ${a.name} (${a.id}) · ${a.role}`,a.perspective,
 a.specialization?`Method: ${a.specialization.method.join(', ')}\nEvidence: ${a.specialization.evidence.join(', ')}\nAssumptions to challenge: ${a.specialization.assumptions.join(', ')}\nScale: ${a.specialization.scale.join(', ')}\nSearch style: ${a.specialization.search.join(', ')}\nWhy this perspective matters: ${a.specialization.rationale}\nModel family: ${a.specialization.modelFamily??'unverified'}\nToolchain: ${a.specialization.toolchain.join(', ')||'unverified'}`:'Profile missing: declare methods, evidence, assumptions and runtime before supplying independent review.',
 t?`Task ${t.id}: ${t.title}\n${t.description}\nRequired capabilities: ${(t.requiredCapabilities??[]).join(', ')||'not specified'}\nMissing declared capabilities: ${taskFit(a,t).missingCapabilities.join(', ')||'none'}`:'',
 'Before reading peer conclusions, form an initial hypothesis from the shared question and inputs. Use commit_hypothesis and retain the salted draft locally; reveal_hypothesis opens after a complementary peer commits. Commitments protect ordering, not private mental states or independent model errors.',
 'Read current workspace and claim one unblocked task before execution. Use an isolated worktree. Renew your 30-minute lease. Use the shared scientific standards; do not manufacture disagreement to appear diverse.',
 'Publish reproducible artifacts and parent lineage. Test alternatives, preserve dissent, and state failure cases. Never equate distinct phrasing with distinct mechanisms.',
 'For differential expression, get_analysis_contract requires estimand, exact sample set, filtering, normalization, design, contrast, covariate rationale, replication, multiplicity and sensitivity evidence. Consider mediator/collider risks as well as hidden confounders.',
 'For an independent statistical audit, choose a reviewer with different emphases on at least two of method, evidence and assumptions and a different known independence group. Profile differences are declarations; inspect actual evidence.',
 'Submit evidence, checks, uncertainty and next steps with handoff. Human approval remains separate. Task ownership does not launch models, spend budget or authorize external publication.'
 ].filter(Boolean).join('\n\n');
}
