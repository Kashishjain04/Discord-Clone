import React, { useEffect, useState } from "react";
import "./Sidebar.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SidebarChannel from "./SidebarChannel";
import {
  Add,
  Call,
  ExpandMore,
  Headset,
  InfoOutlined,
  Mic,
  Settings,
  SignalCellularAlt,
} from "@material-ui/icons";
import { Avatar } from "@material-ui/core";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";
import firebase from "../firebase";

const auth = firebase.auth();
const db = firebase.firestore();

const Sidebar = () => {
  const user = useSelector(selectUser);
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    db.collection("users")
      .doc(user.uid)
      .onSnapshot((snap) => setChannels(snap.data().channels));
  }, [user.uid]);

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
    <div className="sidebar">
      <div className="sidebar__top">
        <h3>{user.displayName}</h3>
        <ExpandMoreIcon />
      </div>
      <div className="sidebar__channels">
        <div className="sidebar__channelsHeader">
          <div className="sidebar__header">
            <ExpandMore />
            <h4>Text Channels</h4>
          </div>
          <Add onClick={handleAddChannel} className="sidebar__addChannel" />
        </div>
        <div className="sidebar__channelsList">
          {channels?.map(({ channelId, channelName }) => (
            <SidebarChannel
              key={channelId}
              channelId={channelId}
              channelName={channelName}
            />
          ))}
        </div>
      </div>
      <div className="sidebar__voice">
        <SignalCellularAlt className="sidebar__voiceIcon" fontSize="large" />
        <div className="sidebar__voiceInfo">
          <h3>Voice Connected</h3>
          <p>General</p>
        </div>
        <div className="sidebar__voiceIcons">
          <InfoOutlined />
          <Call />
        </div>
      </div>
      <div className="sidebar__profile">
        <Avatar src={user.photo} onClick={() => auth.signOut()} />
        <div className="sidebar__profileInfo">
          <h3>{user.displayName}</h3>
          <p>#{user.uid.substring(0, 5)}</p>
        </div>
        <div className="sidebar__profileIcons">
          <Mic />
          <Headset />
          <Settings />
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
