import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Login from "./Auth/Login";
import Chat from "./Chat/Chat";
import { login, logout, selectUser } from "./features/userSlice";
import firebase from "./firebase";
import Sidebar from "./Sidebar/Sidebar";
import M from "materialize-css";

const db = firebase.firestore();
const auth = firebase.auth();
const messaging = firebase.messaging();

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
    Notification.requestPermission().catch(() =>
      M.toast({
        html: "Permission required to send push notifications",
        classes: "toast error-toast",
      })
    );
    messaging
      .getToken()
      .then((token) => {
        db.collection("fcm")
          .doc("fcm")
          .update({
            tokens: firebase.firestore.FieldValue.arrayUnion(token),
          });
      })
      .catch((err) => console.log(err.message));
    auth.onAuthStateChanged((user) => {
      if (user) {
        dispatch(
          login({
            uid: user.uid,
            photo: user.photoURL,
            email: user.email,
            displayName: user.displayName,
          })
        );
      } else {
        dispatch(logout());
      }
    });
  }, [dispatch]);
  messaging.onMessage((payload) => {
    console.log(payload);
  });
  return (
    // BEM naming convention
    <div className="app">
      {user ? (
        <>
          <Sidebar />
          <Chat />
        </>
      ) : (
        <Login />
      )}
    </div>
  );
}

export default App;
