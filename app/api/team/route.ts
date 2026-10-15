import {readWorkspace,errorResponse} from '@/lib/store';
import {teamSnapshot} from '@/lib/team';
export const dynamic='force-dynamic';
export async function GET(request:Request){try{const s=await readWorkspace();return Response.json({version:s.version,...teamSnapshot(s.state,new URL(request.url).searchParams.get('taskId')??undefined)},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
