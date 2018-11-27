importScripts('https://www.gstatic.com/firebasejs/5.5.9/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/5.5.9/firebase-messaging.js');
firebase.initializeApp({
    messagingSenderId: "608021495687"
});
const messaging = firebase.messaging();
