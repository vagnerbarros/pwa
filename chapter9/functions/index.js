const functions = require('firebase-functions');
let admin = require('firebase-admin');
let cors = require('cors')({origin: true});

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.storePostData = functions.https.onRequest(function (request, response){
 cors(function (request, response) {
     admin.database().ref('posts').push({
         id: request.body.id,
         title: request.body.title,
         location: request.body.location,
         image: request.body.image
     })
     .then(function() {
         response.status(200).json({message: 'Data stored', id: request.body.id});
     })
     .catch(function(err) {
         response.status(500).json({error: err});
     })
 })
});
