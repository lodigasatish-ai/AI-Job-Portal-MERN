const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Backend connection. Same origin when served by the backend; localhost:3000 when index.html is opened as a file.
// Use the Express backend even when the frontend is opened with VS Code Live Server (5500),
// another local preview port, or directly as a file. When served by Express, use same-origin.
const isLocalHost=['localhost','127.0.0.1','[::1]'].includes(location.hostname);
const API=(location.protocol==='file:' || (isLocalHost && location.port && location.port!=='3000'))?'http://localhost:3000':'';
const tok=()=>{try{return localStorage.getItem('tok')}catch(e){return null}};
const setTok=t=>{try{t?localStorage.setItem('tok',t):localStorage.removeItem('tok')}catch(e){}};
async function api(path,method='GET',body){
  try{
    const r=await fetch(API+'/api'+path,{method,headers:{'Content-Type':'application/json',...(tok()?{Authorization:'Bearer '+tok()}:{})},body:body?JSON.stringify(body):undefined});
    const j=await r.json().catch(()=>({}));
    return {ok:r.ok,status:r.status,...j};
  }catch(e){return {ok:false,error:'Cannot reach the backend at '+(API||location.origin)+'. Start it in the backend folder with: npm start, then refresh this page.'}}
}
