/* ---------- assistant ---------- */
function ask(){const el=document.getElementById('ci'),q=el.value.trim();if(!q)return;const m=document.getElementById('msgs');m.innerHTML+=`<div class="m u">${esc(q)}</div>`;el.value='';
const l=q.toLowerCase(),d=D(),c=car(d.rc);let a='I can help with careers, skills, resume, interviews, projects and roadmaps. Try asking about one of these!';
if(/career|choose|which field/.test(l))a=`Based on your skills, a good starting point is ${CAR.map(x=>({x,m:x.sk.filter(s=>d.skills.includes(s)).length})).sort((a,b)=>b.m-a.m)[0].x.t}. Check the Career Explorer for details.`;
else if(/skill|learn/.test(l))a=`For ${c.t}, focus on: ${c.sk.filter(s=>!d.skills.includes(s)).slice(0,3).join(', ')||'advanced topics'}. Use the Skill Gap Analyzer for a full plan.`;
else if(/resume|cv/.test(l))a='Keep it to one page, add quantified project results, mirror job-description keywords, and run the Resume Analyzer.';
else if(/interview|placement/.test(l))a='Practice DSA daily, revise OOP/DBMS/OS basics, prepare 2 projects in depth, and do mock interviews. See Company Intelligence for rounds.';
else if(/project/.test(l))a=`Try "${PROJ[3].t}" or "${PROJ[4].t}". See Project Recommendations for more.`;
else if(/roadmap|plan/.test(l))a=`Your roadmap for ${c.t} is ${progress(d)}% complete. Open Career Roadmap to continue.`;
setTimeout(()=>{m.innerHTML+=`<div class="m a">${esc(a)}</div>`;m.scrollTop=m.scrollHeight},400)}
