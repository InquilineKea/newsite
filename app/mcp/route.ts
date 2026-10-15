import {readWorkspace,mutate,requestBody} from '@/lib/store';
import {researchSnapshot} from '@/lib/research';
import {tools,analysisContract} from '@/lib/mcp-tools';
export const dynamic='force-dynamic';
export async function POST(request:Request){let id:unknown=null;try{
 const b=await requestBody(request);id=b.id??null;
 const reply=(result:unknown)=>Response.json({jsonrpc:'2.0',id,result});
 if(b.method==='server/discover')return reply({supportedVersions:['2026-07-28'],capabilities:{tools:{}}});
 if(b.method==='initialize')return reply({protocolVersion:'2025-03-26',capabilities:{tools:{}},serverInfo:{name:'agent-commons',version:'1.1.0'}});
 if(b.method==='notifications/initialized')return new Response(null,{status:204});
 if(b.method==='ping')return reply({});
 if(b.method==='tools/list')return reply({tools});
 if(b.method==='tools/call'){
  const name=b.params?.name;
  if(!tools.some(t=>t.name===name))return reply({isError:true,content:[{type:'text',text:'Unknown tool.'}]});
  try{let result:unknown;
   if(name==='get_analysis_contract')result=analysisContract();
   else if(name==='get_workspace')result=await readWorkspace();
   else if(name==='get_research'){const s=await readWorkspace();result={version:s.version,...researchSnapshot(s.state)};}
   else result=await mutate({...b.params.arguments,action:name},false);
   return reply({content:[{type:'text',text:JSON.stringify(result)}]});
  }catch(e){return reply({isError:true,content:[{type:'text',text:e instanceof Error?e.message:'Operation failed.'}]});}
 }
 return Response.json({jsonrpc:'2.0',id,error:{code:-32601,message:'Method not found'}});
}catch{return Response.json({jsonrpc:'2.0',id,error:{code:-32600,message:'Invalid request'}},{status:400});}}
