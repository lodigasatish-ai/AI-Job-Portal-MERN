let users=[],me=null,cur={},cos=COS,DATA=null,page='',cq='',chatOpen=false,side=true,tmr;
const DEF=()=>({saved:[],apps:[],done:{},rc:'ai-ml',proj:[],skills:[],prof:{},theme:'auto'});
const D=()=>DATA||(DATA=DEF());const SD=d=>{DATA=d;clearTimeout(tmr);tmr=setTimeout(()=>api('/data','PUT',DATA),300)};
const U=()=>cur;
const toast=m=>{const t=document.getElementById('tt');t.innerHTML=`<div class="toast">${esc(m)}</div>`;setTimeout(()=>t.innerHTML='',2500)};
const bar=p=>`<div class="bar"><i style="width:${Math.max(0,Math.min(100,p))}%"></i></div>`;
const tags=(a,c='')=>a.map(x=>`<span class="tag ${c}">${esc(x)}</span>`).join('');
const car=id=>CAR.find(c=>c.id===id)||CAR[0];
const opts=(a,sel,f=x=>x)=>a.map(x=>`<option value="${esc(f(x))}" ${f(x)==sel?'selected':''}>${esc(f(x)===x?x:x)}</option>`).join('');
const copts=sel=>CAR.map(c=>`<option value="${c.id}" ${c.id==sel?'selected':''}>${c.t}</option>`).join('');
const v=id=>document.getElementById(id)?.value??'';
function progress(d){const n=PH.length*3,k=Object.keys(d.done).filter(x=>d.done[x]&&x.startsWith(d.rc)).length;return Math.round(k/n*100)}
function ring(p){return `<svg width="120" height="120" viewBox="0 0 120 120"><circle cx="60" cy="60" r="50" fill="none" stroke="var(--bd)" stroke-width="12"/><circle cx="60" cy="60" r="50" fill="none" stroke="var(--p)" stroke-width="12" stroke-linecap="round" stroke-dasharray="${p*3.14} 314" transform="rotate(-90 60 60)"/><text x="60" y="67" text-anchor="middle" font-size="22" font-weight="800" fill="var(--tx)">${p}%</text></svg>`}
/* ---------- router ---------- */
const PUB=['home','login','register'];
function go(h){location.hash=h}
window.onhashchange=()=>{window._al=0;render()};
function render(){page=location.hash.slice(1)||'home';if(!PUB.includes(page)&&!me){page='login'}if(page==='admin'&&cur.role==='admin'&&!window._al){window._al=1;api('/admin/students').then(r=>{users=r.students||[];render()});return}if(PUB.slice(1).includes(page)&&me){return go('dashboard')}
const d=me?D():{};document.documentElement.dataset.theme=d.theme&&d.theme!=='auto'?d.theme:'';
let h;if(page==='home')h=landing();else if(page==='login'||page==='register')h=authPg();else h=shell();
document.getElementById('root').innerHTML=h;window.scrollTo(0,0);}
const NAV=[['dashboard','Dashboard'],['profile','My Profile'],['careers','Career Explorer & Roles'],['gap','Skill Gap Analyzer'],['resume','Resume Analyzer'],['projects','Project Recommendations'],['companies','Company Intelligence'],['roadmap','Career Roadmap'],['jobs','Jobs & Internships'],['applications','My Applications'],['settings','Settings']];
function shell(){const adm=U().role==='admin';const nav=(adm?[...NAV,['admin','Admin Dashboard']]:NAV);let pg;const p=page;
if(p.startsWith('career-'))pg=careerDetail(p.slice(7));else if(p.startsWith('company-'))pg=companyDetail(+p.slice(8));else pg=({dashboard,profile,careers,gap,resume,projects,companies,roadmap,jobs,applications,settings,admin:adm?admin:dashboard}[p]||dashboard)();
return `<div class="app"><aside class="side ${side?'':'c'}"><div class="logo" style="padding:.4rem .8rem 1rem">🧭 CareerPilot AI</div>${nav.map(n=>`<a class="${page===n[0]||page.startsWith(n[0].slice(0,6))&&n[0]!=='dashboard'&&page.includes('-')&&n[0]===(page.startsWith('career-')?'careers':page.startsWith('company-')?'companies':'')?'on':''}" href="#${n[0]}">${n[1]}</a>`).join('')}</aside>
<div class="main"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:1rem"><button class="btn o s" onclick="side=!side;render()">☰ Menu</button><span>👤 ${esc(U().name||'')} <a onclick="logout()">Logout</a></span></div>${pg}</div></div>
<button class="btn fab" onclick="chatOpen=!chatOpen;document.getElementById('chat').style.display=chatOpen?'block':'none'">🤖 Career AI Assistant</button>
<div id="chat" class="card"><b>Career AI Assistant</b><div class="msgs" id="msgs"><div class="m a">Hi! Ask me about careers, skills, resume, interviews, projects or roadmaps.</div></div><div style="display:flex;gap:.3rem"><input id="ci" placeholder="Type a question…" onkeydown="if(event.key==='Enter')ask()"><button class="btn s" onclick="ask()">Send</button></div></div>`}
