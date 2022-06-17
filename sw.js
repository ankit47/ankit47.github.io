importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.0.0/workbox-sw.js');
const staticCacheName = 'LSquared-s-v1';
const dynamicCacheName = 'LSquared-d-v1';

console.warn("SW loaded");

const assets = [
  '/',
  'index.html',
  'js/common.js',
  'js/index.js',
  'js/frame.js',
  'js/idb.js',
  'js/widgets/imgLoader.js',
  'js/widgets/vidLoader.js',
  'js/library/jquery-3.6.0.min.js',
  'js/library/TweenMax.min.js',
  'css/style.css',
  'css/flex.css',
  'img/bg-p.png',
  'img/bg.png',
  'img/cal-na.png',
  'img/calendar.svg',
  'img/check-white.png',
  'img/check.png',
  'img/client-update.png',
  'img/clock.svg',
  'img/download.gif',
  'img/error.png',
  'img/fb.svg',
  'img/flight.svg',
  'img/info.png',
  'img/insta.png',
  'img/instagram.svg',
  'img/linkedin.svg',
  'img/loading.png',
  'img/logo-sm-colored.png',
  'img/logo.ico',
  'img/network-off.png',
  'img/next.svg',
  'img/no-network-intro1.png',
  'img/no-network-intro2.png',
  'img/no-network-intro3.png',
  'img/no-network.png',
  'img/spectrum-next.png',
  'img/squared.png',
  'img/twitter.svg',
  'img/webos-logo.jpg',
  'img/wifi.svg'
]

// self.addEventListener('install', e => {
//  e.waitUntil(
//    caches.open('video-store').then(function(cache) {
//      return cache.addAll([
//        '/',
//        'index.html',
//        'index.js',
//        'style.css'
//      ]);
//    })
//  );
// });

// self.addEventListener('fetch', e => {
//   console.log(e.request.url);
//   e.respondWith(
//     caches.match(e.request).then(response => response || fetch(e.request))
//   );
// });

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName).then(cache => {
      return cache.addAll(assets);
    })
  );
});

self.addEventListener('activate', e => {
  console.log("Servie worker has been activated")
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(keys
        .filter(key => key !== staticCacheName)
        .map(key => caches.delete(key))
      );
    })
  );
});

self.addEventListener('fetch', e => {
  // console.log(e.request.url);
  e.respondWith(
    caches.match(e.request).then(response => response || fetch(e.request))
  );
});

// self.addEventListener('fetch', e => {
//   console.log(e.request.url);
//   e.respondWith(
//     // caches.match(e.request).then(response => response || fetch(e.request))
//     caches
//       .match(e.request)
//       .then(cacheRes => {
//         return cacheRes || fetch(e.request).then(fetchRes => {
//           return caches.open(dynamicCacheName).then(cache =>{
//             cache.put(e.request.url, fetchRes.clone());
//             return fetchRes;
//           })
//         });
//       })
//   )
// });


// https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.routing#registerRoute
workbox.routing.registerRoute(
  /index\.html/,
  // https://developers.google.com/web/tools/workbox/reference-docs/latest/workbox.strategies
  workbox.strategies.networkFirst({
    cacheName: 'workbox:html',
  })
);

workbox.routing.registerRoute(
  new RegExp('.*\.js'),
  workbox.strategies.networkFirst({
    cacheName: 'workbox:js',
  })
);

workbox.routing.registerRoute(
  // Cache CSS files
  /.*\.css/,
  // Use cache but update in the background ASAP
  workbox.strategies.staleWhileRevalidate({
    // Use a custom cache name
    cacheName: 'workbox:css',
  })
);

workbox.routing.registerRoute(
  // Cache image files
  /.*\.(?:png|jpg|jpeg|svg|gif)/,
  // Use the cache if it's available
  workbox.strategies.cacheFirst({
    // Use a custom cache name
    cacheName: 'workbox:image',
    plugins: [
      new workbox.expiration.Plugin({
        // Cache only 20 images
        maxEntries: 20,
        // Cache for a maximum of a week
        maxAgeSeconds: 7 * 24 * 60 * 60,
      })
    ],
  })
);