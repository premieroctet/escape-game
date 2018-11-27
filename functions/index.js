const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Function to push notification to a topic.
function pushMessage(message) {
    const payload = {
        notification: {
        title: message,
        }
    };

    admin.messaging().sendToTopic("notifications", payload)
    .then(function(response) {
        console.log("Successfully sent message:", response);
    })
    .catch(function(error) {
        console.log("Error sending message:", error);
    });
}

exports.updateGame = functions.firestore.document('games/{gameId}').onUpdate((change, context) => {
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
