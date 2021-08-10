import React, { useContext, useState, useEffect, useRef } from "react";
import { withRouter, useLocation, useHistory } from "react-router-dom";

import keyboardController from "../common/KeyboardController.js";
import WaitingQueue from "./WaitingQueue.js";

import webRTC from "../api/WebRTC.js";

import "./Battle.css";
import "../common/Animations.css";
import signallingServer from "../api/SignallingServer.js";

import { openNotification } from "./Notification";

function Battle(props) {
  const history = useHistory();
  const location = useLocation();

  const [videoStream, setVideoStream] = useState(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!location.username) {
      window.alert("Please log in before playing a game!");
      history.push("/");
    } else if (location.purpose === "playing") {
      console.log(location);
      webRTC.setVideoCallback(setVideoStream);
      keyboardController.setKeyPressCallback((pressedKeys) => {
        webRTC.sendKeyPress(pressedKeys);
      });
      keyboardController.start();
    } else if (location.purpose === "waiting") {
      // Check if user has received an offer from a free robot
      const myVar = setInterval(() => {
        if (signallingServer.offerMessage) {
          // If offer received, initialise connection and send offer to free robot
          webRTC
            .initializePeerConnection()
            .then(() => {
                openNotification('success', '', 'Get ready! Your turn is coming up next');
              signallingServer
                .sendOffer(
                  signallingServer.offerMessage.robotName,
                  webRTC.getOffer()
                )
                .then((answer) => {
                  // Once offer answered, start the game
                  console.log("Game can be started");
                  webRTC.setAnswer(answer);
                  signallingServer.startGame();

                  // Stop checking if user has received an offer from a free robot
                  clearInterval(myVar);

                  // Change purpose to "playing"
                  history.push({
                    pathname: "/game-select/battle",
                    username: location.username,
                    purpose: "playing",
                  });
                })
                .catch((error) => {
                  openNotification("error", "Error", error.message);
                });
            })
            .catch((error) => {
              openNotification("error", "Error", error.message);
            });
        }
      }, 3000);
    }
  }, []);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  return (
    <div className="window-container">
      <div className="help-container">
        <h3 align="center">How To Play</h3>
        <hr />
        <img
          src={require("../assets/battle_instructions.png")}
          alt="Gameplay Instructions"
        />
      </div>

      <div className="game-container">
        <h3 align="center">1v1 Battle</h3>
        <hr />
        <video
          id="localRobotFeed"
          autoPlay={true}
          playsInline={true}
          ref={videoRef}
        ></video>
        <span id="battleTimeTitle">Time Left: </span>
        <span id="battleTime" className="seconds">
          -
        </span>
      </div>

      <WaitingQueue></WaitingQueue>
    </div>
  );
}

export default withRouter(Battle);
