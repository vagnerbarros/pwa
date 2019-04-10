var deferredPrompt;

if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js')
    .then( function() {
        console.log('service worker registred')
    })
    .catch((err) => {
        console.log(err)
    });
}

window.addEventListener('beforeinstallprompt', function(event){
    console.log('beforeinstallprompt fired');
    event.preventDefault();
    deferredPrompt = event;
    return false;
});

fetch('https://httpbin.org/ip')
.then((response) => {
  console.log(response);  
  return response.json();
})
.then((data) => {
    console.log(data);
})
.catch((erro) => {
    console.log(erro);
});

fetch('https://httpbin.org/post', {
    method: 'POST',
    mode: 'cors',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    body: JSON.stringify({
        message: 'Does this work?'
    })
})
.then((response) => {
  console.log(response);  
  return response.json();
})
.then((data) => {
    console.log(data);
})
.catch((erro) => {
    console.log(erro);
});