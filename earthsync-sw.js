// EarthSync offline helper. Controls only earthsync.html (SiteSync keeps sw.js).
// Online: always loads the newest app from GitHub and saves a copy.
// Offline: opens the last saved copy; the app then shows the data it saved on this phone.
const CACHE='earthsync-v2';
const PRE=['earthsync.html','https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
self.addEventListener('install',e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRE.map(u=>c.add(new Request(u,{cache:'reload'})).catch(()=>{}))))) });
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(n=>n.startsWith('earthsync-')&&n!==CACHE).map(n=>caches.delete(n)))).then(()=>self.clients.claim()))});
const LIB=/^https:\/\/(cdnjs\.cloudflare\.com|fonts\.googleapis\.com|fonts\.gstatic\.com|cdn\.jsdelivr\.net)\//;
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!=='GET')return;
  const u=new URL(r.url);
  if(r.mode==='navigate'||(u.origin===location.origin&&u.pathname.endsWith('/earthsync.html'))){
    e.respondWith(fetch(r.url,{cache:'no-store',credentials:'same-origin'}).then(res=>{if(res.ok){const cp=res.clone();caches.open(CACHE).then(c=>c.put('earthsync.html',cp))}return res})
      .catch(()=>caches.open(CACHE).then(c=>c.match('earthsync.html')).then(m=>m||new Response('<h2 style="font-family:sans-serif;padding:20px">EarthSync is not saved on this device yet. Open it once with internet.</h2>',{headers:{'Content-Type':'text/html'}}))));
    return}
  if(LIB.test(r.url)){
    e.respondWith(caches.open(CACHE).then(c=>c.match(r).then(m=>m||fetch(r).then(res=>{if(res.ok||res.type==='opaque')c.put(r,res.clone());return res}))));
    return}
  // everything else (live database, sign-in) goes straight to the network as before
});
