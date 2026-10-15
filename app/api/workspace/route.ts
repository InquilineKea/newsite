import {readWorkspace,mutate,requestBody,errorResponse} from '@/lib/store';
import {RuleError} from '@/lib/domain';
export const dynamic='force-dynamic';
export async function GET(){try{return Response.json(await readWorkspace(),{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
export async function POST(request:Request){try{
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin)throw new RuleError('Cross-origin writes are not allowed.',403);
 return Response.json(await mutate(await requestBody(request),Boolean(request.headers.get('oai-authenticated-user-id'))),{headers:{'Cache-Control':'no-store'}});
}catch(e){return errorResponse(e);}}
