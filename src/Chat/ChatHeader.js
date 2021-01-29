import { Add, Create, SearchRounded } from "@material-ui/icons";
import React from "react";
import "./ChatHeader.css";
import firebase from "../firebase";
import { selectUser } from "../features/userSlice";
import { useSelector } from "react-redux";

const db = firebase.firestore();

const ChatHeader = ({ channelName }) => {
  const user = useSelector(selectUser);

  const handleJoinChannel = () => {
    const channelId = prompt("Enter Channel ID");
    if (channelId) {
      db.collection("channels")
        .doc(channelId)
        .get()
        .then((doc) => {
          if (!doc.exists) {
            return alert("Invalid Channel ID!!");
          } else {
            db.collection("users")
              .doc(user.uid)
              .update({
                channels: firebase.firestore.FieldValue.arrayUnion({
                  channelId,
                  channelName: doc.data().channelName,
                }),
              });
          }
        });
    }
  };

  const handleAddChannel = () => {
    const channelName = prompt("Enter name of new channel");
    if (channelName) {
      db.collection("channels")
        .add({
          channelName,
        })
        .then((doc) => {
          db.collection("users")
            .doc(user.uid)
            .update({
              channels: firebase.firestore.FieldValue.arrayUnion({
                channelId: doc.id,
                channelName,
              }),
            });
        });
    }
  };

  return (
    <div className="chatHeader">
      <div className="chatHeader__left">
        <h3>
          <span className="chatHeader__hash">#</span> {channelName}
        </h3>
      </div>
      <div className="chatHeader__right">
        <Add
          titleAccess="Create A Channel"
          onClick={handleAddChannel}
          className="sidebar__addChannel"
        />
        <Create
          titleAccess="Join A Channel"
          onClick={handleJoinChannel}
          className="sidebar__addChannel"
        />
        <div className="chatHeader__search">
          <input placeholder="Search" />
          <SearchRounded />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
