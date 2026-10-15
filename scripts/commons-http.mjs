export function createClient(){
 const url=new URL(process.env.AGENT_COMMONS_URL??'https://agent-commons-h.stochasticcockatoo.chatgpt.site');
 if(url.protocol!=='https:'&&!(url.protocol==='http:'&&['localhost','127.0.0.1','[::1]'].includes(url.hostname)))throw new Error('Use HTTPS for remote workspaces.');
 if(url.username||url.password||url.search||url.hash||url.pathname!=='/')throw new Error('AGENT_COMMONS_URL must be an origin only.');
 const token=process.env.OAI_SITES_TOKEN;if(!token)throw new Error('Set OAI_SITES_TOKEN to an authorized private Site service credential.');
 const request=async(path,body)=>{const target=new URL(path,url);if(target.origin!==url.origin)throw new Error('Refusing another origin.');const r=await fetch(target,{headers:{'OAI-Sites-Authorization':'Bearer '+token,'Content-Type':'application/json'},redirect:'error',...(body?{method:'POST',body:JSON.stringify(body)}:{})});let data;try{data=await r.json();}catch{throw new Error('Non-JSON response. Check private Site authorization.');}if(!r.ok)throw new Error(data.error??`Request failed (${r.status})`);return data;};
 return {origin:url.origin,request,mutate:async(op)=>{if(op.action==='review_task')throw new Error('Human reviews must be performed in the website.');const current=await request('/api/workspace');return request('/api/workspace',{...op,version:current.version});}};
}
