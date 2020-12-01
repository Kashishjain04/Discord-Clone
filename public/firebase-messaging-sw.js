importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.1.1/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyCFzdQXtuuyFDDC1tGEO-RJfhLvVyB2JuI",
  authDomain: "discord-04.firebaseapp.com",
  databaseURL: "https://discord-04.firebaseio.com",
  projectId: "discord-04",
  storageBucket: "discord-04.appspot.com",
  messagingSenderId: "238008901705",
  appId: "1:238008901705:web:c11480ba8b19dfff34df98",
  measurementId: "G-Q39F36W77Q",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  // Customize notification here
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
