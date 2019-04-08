var deferredPrompt;

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then( function() {
        console.log('service worker registred')
    });
}

window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});