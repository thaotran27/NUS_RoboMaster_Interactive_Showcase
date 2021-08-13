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
  const [timeLeftToPlay, setTimeLeftToPlay] = useState(30);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [whenTimerStarted, setWhenTimerStarted] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => {
    
    if (!location.username) {
      window.alert("Please log in before playing a game!");
      history.push("/");
    } else if (location.purpose === "playing") {
      webRTC.setVideoCallback(setVideoStream);
      keyboardController.setKeyPressCallback((pressedKeys) => {
        webRTC.sendKeyPress(pressedKeys);
      });
      keyboardController.start();

      // Start UI Timer at 30s
      setWhenTimerStarted(Date.now());
      setTimeLeftToPlay(30);
      setIsTimerRunning(true);
      
      // Create timeout to remove user once user has played for 30s
      setTimeout(() => {
        // Disconnect from robot
        webRTC.closePeerConnection();
        signallingServer._send({
          type: "leave",
          leaveType: "timer-end",
        });

        // Change purpose to "waiting"
        history.push({
          pathname: "/game-select",
          username: location.username,
        });
      }, 30000);

    } else if (location.purpose === "waiting") {
      // Check if user has received an offer from a free robot
      webRTC.setVideoCallback(setVideoStream);
      const myVar = setInterval(() => {
        if (signallingServer.offerMessage) {
          // Stop checking if user has received an offer from a free robot
          clearInterval(myVar);

          // If offer received, initialise connection and send offer to free robot
          webRTC.closePeerConnection();
          webRTC
            .initializePeerConnection()
            .then(() => {
              openNotification(
                "success",
                "",
                "Get ready! Your turn is coming up next"
              );
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

                  // Clear offer message
                  signallingServer.offerMessage = null;

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

  // Timer function to be updated every second while
  useEffect(() => {
    if (isTimerRunning && timeLeftToPlay > 0) {
      setTimeout(() => {
        const TimeLeft = whenTimerStarted + 30000 - Date.now();
        setTimeLeftToPlay(Math.floor(TimeLeft / 1000));
      }, 1000);
    }
    else if (timeLeftToPlay === 0) {
      setIsTimerRunning(false);
    }
  }, [isTimerRunning, timeLeftToPlay, whenTimerStarted]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = videoStream;
    }
  }, [videoStream]);

  useEffect(() => {
    // If user clicks back button, start leaveHandler
    window.onpopstate = () => {
      webRTC.closePeerConnection();
      signallingServer._send({
        type: "leave",
        leaveType: "hard-exit",
      });
    };
  });

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
        <span id="battleTimeTitle">Time Left:</span>
        <span id="battleTime" className="seconds">
          {location.purpose === "playing" ? timeLeftToPlay : "-"}
        </span>
      </div>

      <WaitingQueue></WaitingQueue>
    </div>
  );
}

export default withRouter(Battle);
