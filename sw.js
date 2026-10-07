'use strict';
// Bump this for EVERY release that changes a cached page, script, style or asset. See docs/offline.md.
const CACHE_VERSION = '2026-10-07.1';
const ROOT = new URL('./', self.location.href);
const PREFIX = 'idle-arcade-shell:' + ROOT.href + ':';
const CACHE = PREFIX + CACHE_VERSION;
const PAGES = ['index.html', 'promo.html', 'promo-wildbond.html',
  'games/primordial/index.html', 'games/starfall-guild/index.html', 'games/realmbound/index.html', 'games/wildbond/index.html'];
const CORE = ['manifest.webmanifest', 'shared/offline.js', 'icons/arcade.svg', 'icons/arcade-192.png', 'icons/arcade-512.png'];
function local(path, base) { const u = new URL(path, base || ROOT); return u.origin === ROOT.origin && u.pathname.startsWith(ROOT.pathname) ? u : null; }
// HTML is authored in this repo. Only explicit scripts/styles and credits notices are followed; no crawled links or remote assets.
function dependencies(html, url) {
  const out = [];
  for (const tag of html.matchAll(/<(script|link|a)\b[^>]*>/gi)) {
    const attrs = {}; for (const a of tag[0].matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)) attrs[a[1].toLowerCase()] = a[2].replace(/&amp;/g, '&');
    const kind = tag[1].toLowerCase();
    const path = kind === 'script' ? attrs.src : kind === 'link' && attrs.rel === 'stylesheet' ? attrs.href :
      kind === 'a' && /^(?:credits\.html|CREDITS\.md|licenses\/)/.test(attrs.href || '') ? attrs.href : null;
    if (path) { const u = local(path, url); if (u) out.push(u.href); }
  }
  return out;
}
self.addEventListener('install', e => e.waitUntil((async () => {
  // Never overwrite a live release if a maintainer forgot to change the version.
  if (self.registration.active && (await caches.keys()).includes(CACHE)) throw Error('Change CACHE_VERSION before releasing an update.');
  const cache = await caches.open(CACHE), seen = new Set(), queue = [...PAGES, ...CORE].map(p => new URL(p, ROOT).href);
  try {
    while (queue.length) {
      const url = queue.shift(); if (seen.has(url)) continue; seen.add(url);
      const response = await fetch(new Request(url, { cache: 'reload', headers: { 'X-Arcade-Prepare': '1' } }));
      if (!response.ok || response.type === 'opaque') throw Error('Offline file unavailable: ' + url);
      if (new URL(url).pathname.endsWith('.html')) queue.push(...dependencies(await response.clone().text(), url));
      await cache.put(url, response);
    }
  } catch (error) { await caches.delete(CACHE); throw error; }
  // Default lifecycle: no skipWaiting or clients.claim; never replace code underneath an open game.
})()));
self.addEventListener('activate', e => e.waitUntil((async () => {
  for (const name of await caches.keys()) if (name.startsWith(PREFIX) && name !== CACHE) await caches.delete(name);
})()));
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET' || e.request.headers.has('X-Arcade-Prepare')) return;
  const url = local(e.request.url); if (!url || url.pathname.endsWith('/sw.js')) return;
  // Directory navigation and harmless query strings still use the same complete release.
  if (url.pathname.endsWith('/')) url.pathname += 'index.html'; url.search = ''; url.hash = '';
  e.respondWith((async () => { const cache = await caches.open(CACHE); return (await cache.match(url.href)) || fetch(e.request); })());
});
