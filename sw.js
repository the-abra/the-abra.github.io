const CACHE_NAME = 'the-abra-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/css/style.css',
  '/js/script.js',
  '/images/background2.webp',
  '/images/logo.webp',
  '/images/my-avatar.webp',
  '/images/556x590-card-short-beige.webp',
  '/images/556x590-card-short-blue.webp',
  '/images/556x590-card-short-grey.webp',
  '/images/556x590-card-short-red.webp',
  '/images/btnBlue.webp',
  '/images/btnGreen.webp',
  '/images/ButtonBorderBlock.webp',
  '/images/messagebox.webp',
  '/images/tag.webp',
  '/static/click.webm',
  '/static/hover.webm'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
