import { Button } from "@material-ui/core";
import React from "react";
import firebase from "../firebase";
import "./Login.css";
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

const Login = () => {
  const login = () => {
    auth.signInWithPopup(provider).catch((err) => alert(err.message));
  };
  return (
    <div className="login">
      <div className="login__logo">
        <img
          width="800px"
          src="https://1000logos.net/wp-content/uploads/2020/10/Discord-logo.png"
          alt="logo"
        />
      </div>
      <Button onClick={login}>Signin</Button>
    </div>
  );
};

export default Login;
