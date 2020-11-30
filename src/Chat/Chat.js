import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectChannelId, selectChannelName } from "../features/appSlice";
import { selectUser } from "../features/userSlice";
import {
  AddCircle,
  CardGiftcard,
  EmojiEmotions,
  Gif,
} from "@material-ui/icons";
import "./Chat.css";
import ChatHeader from "./ChatHeader";
import Message from "./Message";
import firebase from "../firebase";

const db = firebase.firestore();

const Chat = () => {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isMount, setMount] = useState(false);

  useEffect(() => {
    setMount(true);
    if (channelId) {
      db.collection("channels")
        .doc(channelId)
        .collection("messages")
        .orderBy("timestamp", "desc")
        .onSnapshot((snap) => setMessages(snap.docs.map((doc) => doc.data())));
    }
  }, [channelId]);

  if (!isMount) {
    return null;
  }

  const sendMessage = (e) => {
    e.preventDefault();
    db.collection("channels").doc(channelId).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user,
    });
    setInput("");
  };

  return (
    <div className="chat">
      <ChatHeader channelName={channelName} />
      <div className="chat__messages">
        {messages.map((message) => (
          <Message key={messages.user + message.timestamp} message={message} />
        ))}
      </div>
      <div className="chat__input">
        <AddCircle fontSize="large" />
        <form>
          <input
            disabled={!channelId}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={"Message #" + channelName}
          />
          <button
            onClick={sendMessage}
            className="chat__inputButton"
            type="submit"
          >
            Send
          </button>
        </form>
        <div className="chat__inputIcons">
          <CardGiftcard fontSize="large" />
          <Gif fontSize="large" />
          <EmojiEmotions fontSize="large" />
        </div>
      </div>
    </div>
  );
};

export default Chat;
