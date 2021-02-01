import { Delete } from "@material-ui/icons";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectChannelId, setChannelInfo } from "../features/appSlice";
import "./SidebarChannel.css";
import firebase from "../firebase";
import { selectUser } from "../features/userSlice";

const db = firebase.firestore();

const SidebarChannel = ({ channelId, channelName }) => {
  const dispatch = useDispatch(),
    user = useSelector(selectUser),
    currentChannel = useSelector(selectChannelId);

  const setChannel = () => {
    dispatch(
      setChannelInfo({
        channelId,
        channelName,
      })
    );
  };

  const deleteChannel = () => {
    db.collection("users")
      .doc(user.uid)
      .update({
        channels: firebase.firestore.FieldValue.arrayRemove({
          channelName,
          channelId,
        }),
      });
    if (currentChannel === channelId) {
      dispatch(
        setChannelInfo({
          channelId: null,
          channelName: null,
        })
      );
    }
  };

  return (
    <div className="sidebarChannel">
      <h4>
        <div onClick={setChannel} className="sidebarChannel__left">
          <span className="sidebarChannel__hash">#</span>
          {channelName}
        </div>
        <Delete
          onClick={deleteChannel}
          titleAccess="Leave Channel"
          className="sidebarChannel__delete"
        />
      </h4>
    </div>
  );
};

export default SidebarChannel;
