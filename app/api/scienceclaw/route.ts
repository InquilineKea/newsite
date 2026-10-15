import {readWorkspace,errorResponse} from '@/lib/store';
import {researchSnapshot} from '@/lib/research';
export const dynamic='force-dynamic';
export async function GET(){try{const snapshot=await readWorkspace();return Response.json({version:snapshot.version,...researchSnapshot(snapshot.state)},{headers:{'Cache-Control':'no-store'}});}catch(e){return errorResponse(e);}}
