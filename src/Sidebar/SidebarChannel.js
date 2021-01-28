import React from "react";
import { useDispatch } from "react-redux";
import { setChannelInfo } from "../features/appSlice";
import "./SidebarChannel.css";

const SidebarChannel = ({ channelId, channelName }) => {
  const dispatch = useDispatch();
  const setChannel = () => {
    dispatch(
      setChannelInfo({
        channelId,
        channelName,
      })
    );
  };
  return (
    <div className="sidebarChannel" onClick={setChannel}>
      <h4>
        <span className="sidebarChannel__hash">#</span>
        {channelName}
      </h4>
    </div>
  );
};

export default SidebarChannel;
