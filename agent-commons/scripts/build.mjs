import {readFile,mkdir,rm,writeFile,cp} from 'node:fs/promises';
await rm('dist',{recursive:true,force:true});
await mkdir('dist/server',{recursive:true});await mkdir('dist/.openai',{recursive:true});
const html=await readFile('worker/app.html','utf8');
const js=(await readFile('worker/index.js','utf8')).replace('"__APP_HTML__"',()=>JSON.stringify(html));
await writeFile('dist/server/index.js',js);
await cp('.openai/hosting.json','dist/.openai/hosting.json');
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Built standalone Worker with dashboard and schema migrations.');
