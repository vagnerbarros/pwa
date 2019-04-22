
var functions = require('firebase-functions');
var admin = require('firebase-admin');
var cors = require('cors')({origin: true});
var webpush = require('web-push');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

var serviceAccount = require("./pwagram-fb-key.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://pwagram-99adf.firebaseio.com/'
});

exports.storePostData = functions.https.onRequest(function(request, response) {
 cors(request, response, function() {
   admin.database().ref('posts').push({
     id: request.body.id,
     title: request.body.title,
     location: request.body.location,
     image: request.body.image
   })
     .then(function() {
       webpush.setVapidDetails('mailto:vagnerbarrospereira@gmail.com', 'BLlubZy8EnUODg-C0c2JUgF6DVS5nFijwSkdQmhTsYKzkly_S1NGJZBCaOjhLWLR1oyqELm3-Q5JVJz9MTdtEF0', 'J7vIN70Hoi4GYio9LK_f46Gz6Lk_iYDivpplArjX9CY')
       return admin.database().ref('subscriptions').once('value');
     })
     .then(subscriptions => {
      subscriptions.forEach(sub => {
        let pushConfig = {
          endpoint: sub.val().endpoint,
          keys: {
            auth: sub.val().keys.auth,
            p256dh: sub.val().keys.p256dh
          }
        }
        webpush.sendNotification(pushConfig, JSON.stringify({title: 'New Post', content: 'New Post Added!'}))
        .catch(err => {
          console.log(err);
        });
      })
      response.status(201).json({message: 'Data stored', id: request.body.id});
     })
     .catch(function(err) {
       response.status(500).json({error: err});
     });
 });
});
