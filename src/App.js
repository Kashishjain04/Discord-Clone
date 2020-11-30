import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Login from "./Auth/Login";
import Chat from "./Chat/Chat";
import { login, logout, selectUser } from "./features/userSlice";
import firebase from "./firebase";
import Sidebar from "./Sidebar/Sidebar";

const auth = firebase.auth();

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  useEffect(() => {
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

  return (
    // BEM classes naming convention
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
