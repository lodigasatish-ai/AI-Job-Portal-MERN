// App entry point: restore the session from the server, then draw the UI
async function boot(){
  if(!tok()){me=null;return}
  const r=await api('/me');
  if(r.ok){me=r.user.email;cur=r.user;DATA=r.data||DEF();cos=r.cos||COS}
  else{if(r.status===401)setTok(null);me=null}
}
boot().then(render);
