import firebase from "firebase/app";
import "firebase/firestore";

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
}

export default Firebase;
