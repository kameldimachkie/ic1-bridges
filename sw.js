// Minimal service worker — exists only to make Chrome offer the automatic
// "Install app" prompt on Android. Deliberately does NOT cache or serve
// anything offline, since SiteSync needs a live Firebase connection to be
// useful; caching stale data would be actively misleading on a
// construction-progress app. This just passes every request straight
// through to the network.
self.addEventListener('install', function(e){ self.skipWaiting(); });
self.addEventListener('activate', function(e){ self.clients.claim(); });
self.addEventListener('fetch', function(e){
  e.respondWith(fetch(e.request));
});
