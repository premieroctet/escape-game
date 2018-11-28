import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/messaging";

const config = {
  apiKey: "AIzaSyAGH4ZF6uUkxAe1lg9Qhd_nqrGmWM19Uf8",
  authDomain: "escape-game-7abf7.firebaseapp.com",
  databaseURL: "https://escape-game-7abf7.firebaseio.com",
  projectId: "escape-game-7abf7",
  storageBucket: "escape-game-7abf7.appspot.com",
  messagingSenderId: "608021495687"
};

class Firebase {
  constructor() {
    firebase.initializeApp(config);

    this.db = firebase.firestore();
  }

  games = () => {
    return this.db.collection("games")
  };

  askForPermissioToReceiveNotifications = async () => {
    const messaging = firebase.messaging();
    messaging.usePublicVapidKey("BL9f6pv76RE9F64Md-Yl-BHAl88X1i8jZBaEzA7eCOJB_U77Agm-qibxc0px0klu31HLUXbjwklfUJMTw8H5_vw");

    try {
      await messaging.requestPermission();
      const token = await messaging.getToken();
      console.log('token:', token);
      this.subscribeTokenToTopic(token, 'notifications')

      return token;
    } catch (error) {
      console.error(error);
    }

    messaging.onMessage(payload => {
      console.log("Notification Received", payload);
   });
  }

  subscribeTokenToTopic = (token) => {
    fetch(`https://europe-west1-escape-game-7abf7.cloudfunctions.net/app/subscribe/${token}`).then(response => {
      console.log('Subscribed', response);
    }).catch(error => {
      console.error(error);
    })
  }
}

export default Firebase;
