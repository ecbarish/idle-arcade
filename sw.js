// The old Idle Arcade site installed a service worker at /idle-arcade/. This replacement removes it:
// it clears only the old site's caches (never the new /generations/ ones), unregisters itself and
// reloads any open tab, which then lands on the forwarding page.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil((async () => {
  const old = 'idle-arcade-shell:' + new URL('./', self.location.href).href + ':';
  for (const name of await caches.keys()) if (name.startsWith(old)) await caches.delete(name);
  await self.registration.unregister();
  for (const client of await self.clients.matchAll({ type: 'window' })) client.navigate(client.url);
})()));
