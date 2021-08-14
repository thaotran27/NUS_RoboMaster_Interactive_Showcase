import React, { useEffect, useState } from "react";
import { withRouter, Link, useHistory, useLocation } from "react-router-dom";

import signallingServer from "../api/SignallingServer.js";
import webRTC from "../api/WebRTC.js";

import "./GameSelect.css";
import "../common/Animations.css";

import { openNotification } from "./Notification";

function GameSelect(props) {
  const history = useHistory();
  const location = useLocation();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (!location.username) {
      openNotification(
        "error",
        "Login Error",
        "Please log in before playing a game!"
      );
      history.push("/");
    }
  }, []);

  const goToBattle = () => {
    setButtonDisabled(true);
    signallingServer
      .findRobot("battle")
      .then((robotName) => {
        console.log("Initializing peer connection");
        openNotification("info", "", "Looking for robots...");
        webRTC
          .initializePeerConnection()
          .then(() => {
            console.log("Sending offer to robot: " + robotName);
            signallingServer
              .sendOffer(robotName, webRTC.getOffer())
              .then((answer) => {
                console.log("Game can be started");
                openNotification("success", "", "Game successfully started!");
                webRTC.setAnswer(answer);
                signallingServer.startGame();
                setButtonDisabled(false);

                history.push({
                  pathname: "/game-select/battle",
                  username: location.username,
                  purpose: "playing",
                });
              })
              .catch((error) => {
                openNotification("error", "Error", error.message);
                setButtonDisabled(false);
              });
          })
          .catch((error) => {
            openNotification("error", "Error", error.message);
            setButtonDisabled(false);
          });
      })

      .catch((error) => {
        // Handle no robot found
        openNotification(
          "info",
          "Info",
          "No robots available, entering spectator mode..."
        );

        webRTC
          .initializePeerConnection()
          .then(() => {
            console.log("Sending offer to arena-cam");
            signallingServer
              .sendOffer("arena-cam", webRTC.getOffer())
              .then((answer) => {
                webRTC.setAnswer(answer);
                setButtonDisabled(false);

                history.push({
                  pathname: "/game-select/battle",
                  username: location.username,
                  purpose: "waiting",
                });
              })
              .catch((error) => {
                openNotification("error", "Error", error.message);
                setButtonDisabled(false);
              });
          })
          .catch(() => {
            openNotification("error", "Error", error.message);
            setButtonDisabled(false);
          });
      });
  };

  const goToShooting = () => {
    setButtonDisabled(true);
    signallingServer
      .findRobot("shooting")
      .then((robotName) => {
        console.log("Initializing peer connection");
        openNotification("info", "", "Looking for robots...");
        webRTC
          .initializePeerConnection()
          .then(() => {
            console.log("Sending offer to robot: " + robotName);
            signallingServer
              .sendOffer(robotName, webRTC.getOffer())
              .then((answer) => {
                console.log("Game can be started");
                openNotification("success", "", "Game successfully started!");
                webRTC.setAnswer(answer);
                signallingServer.startGame();
                setButtonDisabled(false);

                history.push({
                  pathname: "/game-select/shooting",
                  username: location.username,
                  purpose: "playing",
                });
              })
              .catch((error) => {
                openNotification("error", "Error", error.message);
                setButtonDisabled(false);
              });
          })
          .catch((error) => {
            openNotification("error", "Error", error.message);
            setButtonDisabled(false);
          });
      })

      .catch((error) => {
        // Handle no robot found
        openNotification(
          "info",
          "Info",
          "No robots available, entering spectator mode..."
        );

        webRTC
          .initializePeerConnection()
          .then(() => {
            console.log("Sending offer to arena-cam");
            signallingServer
              .sendOffer("arena-cam", webRTC.getOffer())
              .then((answer) => {
                webRTC.setAnswer(answer);
                setButtonDisabled(false);

                history.push({
                  pathname: "/game-select/shooting",
                  username: location.username,
                  purpose: "waiting",
                });
              })
              .catch((error) => {
                openNotification("error", "Error", error.message);
                setButtonDisabled(false);
              });
          })
          .catch(() => {
            openNotification("error", "Error", error.message);
            setButtonDisabled(false);
          });
      });
  };

  return (
    <div className="selection-container init-top">
      <div className="selection-box">
        {buttonDisabled ? (
          <>
            <div className="loader" style={{ color: "lightgray" }}></div>
            <h3 style={{ color: "lightgray" }}>
              <strong>
                Loading
                <span className="loaderdotone" style={{ color: "lightgray" }}>
                  .
                </span>
                <span className="loaderdottwo" style={{ color: "lightgray" }}>
                  .
                </span>
                <span className="loaderdotthree" style={{ color: "lightgray" }}>
                  .
                </span>
              </strong>
            </h3>
          </>
        ) : (
          <h3 align="center" style={{ color: "lightgray" }}>
            <strong>Please choose a game you would like to play</strong>
          </h3>
        )}

        {buttonDisabled ? null : (
          <div className="tile-container">
            <div className="image-container">
              <div
                // to="/game-select/battle"
                onClick={() => goToBattle()}
              >
                <img
                  src={require("../assets/battle_image.PNG")}
                  alt="1v1 Battle Selection"
                />
              </div>

              <h3 align="center" className="image-para">
                1v1 Battle
              </h3>
            </div>

            <div className="image-container">
              <Link
                onClick={() => {
                  goToShooting();
                }}
              >
                <img
                  src={require("../assets/shooting_image.PNG")}
                  alt="Shooting Selection"
                />
              </Link>
              <h3 align="center" className="image-para">
                Shooting
              </h3>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default withRouter(GameSelect);
