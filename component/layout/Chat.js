import classes from "./Chat.module.css";
import React, { useEffect, useState } from "react";
import avatar from "../../assets/avatar.jpg";

import { api } from "../../api/api";

import Cookies from "js-cookie";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import Media from "react-media";
const icon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="30"
    width="30"
    viewBox="0 0 512 512"
  >
    <path d="M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z" />
  </svg>
);

const paperClip = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="16"
    viewBox="0 0 448 512"
  >
    <path d="M364.2 83.8c-24.4-24.4-64-24.4-88.4 0l-184 184c-42.1 42.1-42.1 110.3 0 152.4s110.3 42.1 152.4 0l152-152c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-152 152c-64 64-167.6 64-231.6 0s-64-167.6 0-231.6l184-184c46.3-46.3 121.3-46.3 167.6 0s46.3 121.3 0 167.6l-176 176c-28.6 28.6-75 28.6-103.6 0s-28.6-75 0-103.6l144-144c10.9-10.9 28.7-10.9 39.6 0s10.9 28.7 0 39.6l-144 144c-6.7 6.7-6.7 17.7 0 24.4s17.7 6.7 24.4 0l176-176c24.4-24.4 24.4-64 0-88.4z" />
  </svg>
);

const faceSmile = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="16"
    viewBox="0 0 512 512"
  >
    <path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM164.1 325.5C182 346.2 212.6 368 256 368s74-21.8 91.9-42.5c5.8-6.7 15.9-7.4 22.6-1.6s7.4 15.9 1.6 22.6C349.8 372.1 311.1 400 256 400s-93.8-27.9-116.1-53.5c-5.8-6.7-5.1-16.8 1.6-22.6s16.8-5.1 22.6 1.6zM144.4 208a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm192-32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z" />
  </svg>
);

const send = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="16"
    width="16"
    viewBox="0 0 512 512"
  >
    <path d="M498.1 5.6c10.1 7 15.4 19.1 13.5 31.2l-64 416c-1.5 9.7-7.4 18.2-16 23s-18.9 5.4-28 1.6L284 427.7l-68.5 74.1c-8.9 9.7-22.9 12.9-35.2 8.1S160 493.2 160 480V396.4c0-4 1.5-7.8 4.2-10.7L331.8 202.8c5.8-6.3 5.6-16-.4-22s-15.7-6.4-22-.7L106 360.8 17.7 316.6C7.1 311.3 .3 300.7 0 288.9s5.9-22.8 16.1-28.7l448-256c10.7-6.1 23.9-5.5 34 1.4z" />
  </svg>
);
// tao avatar
const getAvatar = <img className={classes.avatar} src={avatar} />;

// tao chat
const customerChat = (chat) => {
  return (
    <div className={classes.customer}>
      <p></p>
      <div>{chat}</div>
    </div>
  );
};

const adminChat = (chat) => {
  return (
    <div className={classes.admin}>
      {getAvatar}
      <div>ADMIN: {chat}</div>
    </div>
  );
};

const createChat = (type, chat) => {
  if (type === "customer") return customerChat(chat);
  else if (type === "admin") return adminChat(chat);
};
var stompClient = null;
// component
const Chat = () => {
  const email = Cookies.get("email");
  const tempId = Cookies.get("userTempId");

  let identify;

  if (email) identify = email;
  else identify = "Stranger_" + tempId;

  const [chating, setChat] = useState(false);
  const [privateChats, setPrivateChats] = useState([]);
  const [existed, setExisted] = useState(false);
  const [newData, setNewData] = useState({});

  const [userData, setUserData] = useState("");
  useEffect(() => {
    if (email === null || email === undefined) identify = "Stranger_" + tempId;
  }, [email, tempId]);

  const connect = () => {
    let socket = new SockJS(api + "/ws");
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  const loadNewMess = () => {
    stompClient.subscribe("/user/" + identify + "/private", (payload) => {
      let payloadData = JSON.parse(payload.body);
      setNewData(payloadData);
    });
  };

  const getOldMess = async (chatMessage) => {
    await stompClient.subscribe(
      "/user/" + identify + "/get-private",
      (payload) => {
        let payloadData = JSON.parse(payload.body);

        if (payloadData.length > 0) setExisted(true);
        let newChat = [];
        newChat.push(...payloadData);
        setPrivateChats([...newChat]);
      }
    );

    await stompClient.send(
      "/app/get-private-message",
      {},
      JSON.stringify(chatMessage)
    );
  };

  const onConnected = async () => {
    let chatMessage = {
      email: identify,
    };

    getOldMess(chatMessage);
    loadNewMess();
  };

  const onError = (err) => {
    console.log(err);
  };

  const handleMessage = (event) => {
    setUserData(event.target.value);
  };

  const handleChat = () => {
    setChat(!chating);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (stompClient) {
      let chatMessage = {
        email: identify,
        message: userData,
        type: 1,
      };

      if (!existed) chatMessage.create = true;

      setUserData("");

      await stompClient.send(
        "/app/private-message",
        {},
        JSON.stringify(chatMessage)
      );
    }
  };

  useEffect(() => {
    if (chating) connect();
  }, [chating]);

  useEffect(() => {
    console.log(newData);
    if (newData.type == 0 && newData.message === "/end") {
      setPrivateChats([]);
    }
    //
    else {
      privateChats.push(newData);
      setPrivateChats([...privateChats]);
    }
  }, [newData]);
  return (
    <div>
      {chating && (
        <div className={classes.chat}>
          <div className={classes.content}>
            <div className={classes.title}>
              <p>Customer Support</p>
              <div className={classes.message}>
                {privateChats.length > 0 &&
                  privateChats?.map((chat, index) => {
                    if (chat.type == 0)
                      return (
                        <React.Fragment key={index}>
                          {createChat("admin", chat.message)}
                        </React.Fragment>
                      );
                    else
                      return (
                        <React.Fragment key={index}>
                          {createChat("customer", chat.message)}
                        </React.Fragment>
                      );
                  })}
              </div>
            </div>
            <form className={classes.container} onSubmit={handleSend}>
              {getAvatar}
              <textarea
                placeholder="Enter Message!"
                onChange={handleMessage}
                value={userData}
                required={true}
              ></textarea>

              <button className={classes.btn}>{paperClip}</button>
              {/* <button className={classes.btn}>{faceSmile}</button> */}
              <button className={classes.btn} type="submit">
                {send}
              </button>
            </form>
          </div>

          <Media
            queries={{
              largerIpad: "(min-width: 481px)",
            }}
          >
            {(matches) => (
              <React.Fragment>
                {matches.largerIpad && (
                  <button className={classes.chatApp}>Let's Chat App</button>
                )}
              </React.Fragment>
            )}
          </Media>
        </div>
      )}
      <button className={classes.open} onClick={handleChat}>
        {icon}
      </button>
    </div>
  );
};
export default Chat;
