
var deferredPrompt;
var enableNotificationsButtons = document.querySelectorAll('.enable-notifications');

if (!window.Promise) {
  window.Promise = Promise;
}

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
    .register('/sw.js')
    .then(function () {
      console.log('Service worker registered!');
    })
    .catch(function(err) {
      console.log(err);
    });
}

window.addEventListener('beforeinstallprompt', function(event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification(){
  if('serviceWorker' in navigator){
    let options = {
      body: 'You sucessfully subscribed to our Notification Server',
      icon: '/src/images/icons/app-icon-96x96.png',
      image: '/src/images/sf-boat.jpg',
      dir: 'ltr',
      lang: 'en-US',
      vibrate: [100, 50, 200],
      badge: '/src/images/icons/app-icon-96x96.png',
      tag: 'confirm-notification',
      renotify: true,
      actions: [
        { action: 'confirm', title: 'Okay', icon: '/src/images/icons/app-icon-96x96.png' },
        { action: 'cancel', title: 'Cancel', icon: '/src/images/icons/app-icon-96x96.png' },
      ]
    };
    navigator.serviceWorker.ready
    .then(swreg => {
      swreg.showNotification('Sucessfully subscribed!', options);
    })  
  }
}

function configurePushSub(){

  if(!('serviceWorker' in navigator)){
    return;
  }

  let reg;
  navigator.serviceWorker.ready
  .then(swreg => {
    reg = swreg;
    return swreg.pushManager.getSubscription();
  })
  .then(sub => {
    if(!sub){
      //create a new subscription
      let vapidPublicKey = 'BLlubZy8EnUODg-C0c2JUgF6DVS5nFijwSkdQmhTsYKzkly_S1NGJZBCaOjhLWLR1oyqELm3-Q5JVJz9MTdtEF0';
      let convertedVapidPublicKey = urlBase64ToUint8Array(vapidPublicKey);
      return reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: convertedVapidPublicKey
      });
    }
    else{
      // we have a subscription
    }
  })
  .then(newSub => {
    return fetch('https://primeiro-firebase-e98b5.firebaseio.com/subscription.json', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(newSub)
    })
  })
  .then(res => {
    if(res.ok){
      displayConfirmNotification();
    }
  })
  .catch(err => {
    console.log(err);
  })
}

function askForNotificationPermission() {
  Notification.requestPermission(function(result) {
    console.log('User Choice', result);
    if (result !== 'granted') {
      console.log('No notification permission granted!');
    } else {
      configurePushSub();
      // displayConfirmNotification();
    }
  });
}

if ('Notification' in window && 'serviceWorker' in navigator) {
  for (var i = 0; i < enableNotificationsButtons.length; i++) {
    enableNotificationsButtons[i].style.display = 'inline-block';
    enableNotificationsButtons[i].addEventListener('click', askForNotificationPermission);
  }
}