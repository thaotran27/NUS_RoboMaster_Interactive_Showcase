import React, { useEffect, useState } from "react";
import { withRouter, Link, useHistory, useLocation } from "react-router-dom";

import signallingServer from "../api/SignallingServer.js";
import webRTC from "../api/WebRTC.js";

import "./GameSelect.css";
import "../common/Animations.css";

function GameSelect(props) {
  const history = useHistory();
  const location = useLocation();

  const [buttonDisabled, setButtonDisabled] = useState(false);

  useEffect(() => {
    if (!location.username) {
      window.alert("Please log in before playing a game!");
      history.push("/");
    }
  }, []);

  const goToBattle = () => {
    setButtonDisabled(true);
    signallingServer
      .findRobot("battle")
      .then((robotName) => {
        console.log("Initializing peer connection");
        webRTC
          .initializePeerConnection()
          .then(() => {
            console.log("Sending offer to robot: " + robotName);
            signallingServer
              .sendOffer(robotName, webRTC.getOffer())
              .then((answer) => {
                console.log("Game can be started");
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
                window.alert(error);
                setButtonDisabled(false);
              });
          })
          .catch((error) => {
            window.alert(error);
            setButtonDisabled(false);
          });
      })
      .catch((error) => {
        // Handle no robot found
        setButtonDisabled(false);
        history.push({
          pathname: "/game-select/battle",
          username: location.username,
          purpose: "waiting",
        });
      });
  };

  const goToShooting = () => {
    signallingServer.findRobot("shooting");
  };

  return (
    <div className="selection-container init-top">
      <div className="selection-box">
        {buttonDisabled ? (
          <>
            <div class="loader"></div>
            <h3>
              Loading
              <span class="loaderdotone">.</span>
              <span class="loaderdottwo">.</span>
              <span class="loaderdotthree">.</span>
            </h3>
          </>
        ) : (
          <h3 align="center">
            {buttonDisabled
              ? "Loading"
              : "Please choose a game you would like to play"}
          </h3>
        )}

        {buttonDisabled ? null : (
          <div className="tile-container">
            <div className="image-container">
              <div
                // to="/game-select/battle"
                onClick={() => goToBattle()}
                style={
                  buttonDisabled
                    ? { pointerEvents: "none", opacity: "70%" }
                    : null
                }
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
                  window.appComponent.setState({
                    notificationMessage:
                      "Sorry, the shooting game is not ready yet!",
                  });
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
