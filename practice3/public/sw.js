
var CACHE_STATIC_NAME = 'static-v5';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';
var STATIC_FILES = [
  '/',
  '/index.html',
  '/src/css/app.css',
  '/src/css/main.css',
  '/src/js/main.js',
  '/src/js/material.min.js',
  'https://fonts.googleapis.com/css?family=Roboto:400,700',
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
]

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.addAll(STATIC_FILES);
      })
  )
});

function isInArray(string, array){

  for(let i = 0; i < array.length; i++){
    if(array[i] === string){
      return true;
    }
  }
  return false;
}

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            return caches.delete(key);
          }
        }));
      })
  );
});

//dynamic caching for cache, then network
self.addEventListener('fetch', (event) => {
  let url = 'https://httpbin.org/get';
  if(event.request.url.indexOf(url) > -1){

    event.respondWith(
      caches.open(CACHE_DYNAMIC_NAME)
      .then(cache => {
        return fetch(event.request)
        .then(res => {
          cache.put(event.request, res.clone());
          return res;
        })
      })
    );
  }
  else if(isInArray(event.request.url, STATIC_FILES)){
    event.respondWith(
      caches.match(event.request)
    );
  }
  else{
    event.respondWith(
      caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        } else {
          return fetch(event.request)
            .then(function(res) {
              return caches.open(CACHE_DYNAMIC_NAME)
                .then(function(cache) {
                  cache.put(event.request.url, res.clone());
                  return res;
                })
            })
            .catch(function(err) {
              
            });
        }
      })
    );
  }
})

//cache with network fallback
// self.addEventListener('fetch', function(event) {
//   event.respondWith(
//     caches.match(event.request)
//       .then(function(response) {
//         if (response) {
//           return response;
//         } else {
//           return fetch(event.request)
//             .then(function(res) {
//               return caches.open(CACHE_DYNAMIC_NAME)
//                 .then(function(cache) {
//                   cache.put(event.request.url, res.clone());
//                   return res;
//                 });
//             })
//             .catch(function(err) {

//             });
//         }
//       })
//   );
// });

//network only
// self.addEventListener('fetch', (event) => {
//   event.waitUntil(
//     fetch(event.request)
//   );
// });

//cache only
// self.addEventListener('fetch', (event) => {
//   event.waitUntil(
//     caches.match(event.request)
//   );
// })

//network with cache fallback
// self.addEventListener('fetch', (event) => {
//   event.waitUntil(
//     fetch(event.request)
//     .then(res => {
//       return caches.open(CACHE_DYNAMIC_NAME)
//       .then(cache => {
//         cache.put(event.request.url, res.clone());
//         return res;
//       })
//     })
//     .catch(erro => {
//       return caches.match(event.request);
//     })
//   );
// })