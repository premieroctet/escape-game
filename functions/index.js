const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors')({origin: true});

admin.initializeApp(functions.config().firebase);

const app = express();
app.use(cors);

// Function to push notification to a topic.
function pushMessage(message) {
    const payload = {
        notification: {
            title: message,
        },
        topic: "notifications"
    };

    admin.messaging().send(payload)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
}

exports.updateGame = functions.region('europe-west1').firestore.document('games/{gameId}').onUpdate((change, context) => {
    const newValue = change.after.data();
    const previousValue = change.before.data();

    console.log("New value :", JSON.stringify(newValue));
    console.log("Previous value :", JSON.stringify(previousValue));

    if (!previousValue.endedAt && newValue.endedAt) {
        console
        pushMessage(`${newValue.player1} et ${newValue.player2} sont sauvés !`);
    }

    return true;
});

app.use(cors);
app.get('/subscribe/:token', (req, res) => {
    admin.messaging().subscribeToTopic([req.params.token], "notifications")
    .then(function(response) {
      console.log('Successfully subscribed to topic:', response);
      res.status(200).send('Successfully subscribed to topic');
      return;
    })
    .catch(function(error) {
      console.log('Error subscribing to topic:', error);
      res.status(500).send('Error subscribing to topic');
      return;
    });
});

exports.app = functions.region('europe-west1').https.onRequest(app);
