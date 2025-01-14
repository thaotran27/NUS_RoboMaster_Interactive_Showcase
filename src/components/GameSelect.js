import React, { useContext, useEffect } from 'react';
import { withRouter, Link, useHistory, useLocation } from 'react-router-dom'

import signallingServer from '../api/SignallingServer.js';
import webRTC from '../api/WebRTC.js';

import "./GameSelect.css";
import "../common/Animations.css";

import { openNotification } from "./Notification"

function GameSelect(props) {
    const history = useHistory();
    const location = useLocation();

    useEffect(() => {
        if (!location.username) {
            // window.alert("Please log in before playing a game!");
            openNotification('error', "Login Error", "Please log in before playing a game!");
            history.push("/");
        }
    }, []);

    const goToBattle = () => {
        signallingServer.findRobot("battle")
            .then((robotName) => {
                console.log("Initializing peer connection");
                openNotification('info', "", "Looking for robots...");
                webRTC.initializePeerConnection()
                    .then(() => {
                        console.log("Sending offer to robot: " + robotName);
                        signallingServer.sendOffer(robotName, webRTC.getOffer())
                            .then((answer) => {
                                console.log("Game can be started");
                                openNotification('success', "", "Game successfully started!");
                                webRTC.setAnswer(answer);
                                signallingServer.startGame();

                                history.push({
                                    pathname: "/game-select/battle",
                                    username: location.username
                                });
                            })
                            .catch((error) => {
                                openNotification('error',"Error", error.message);
                            });
                    })
                    .catch((error) => {
                        openNotification('error',"Error", error.message);
                    });
            })
            .catch((error) => {
                // TODO Handle no robot found
                openNotification('error',"Error", error.message);
            })
    }

    const goToShooting = () => {
        signallingServer.findRobot("shooting");
    }

    return (
        <div className="selection-container init-top">
            <div className="selection-box">

                <h3 align="center">Please choose a game you would like to play</h3>

                <div className="tile-container">
                    <div className="image-container">
                        <div
                            // to="/game-select/battle"
                            onClick={() => goToBattle()}>

                            <img
                                src={require("../assets/battle_image.PNG")}
                                alt="1v1 Battle Selection" />
                        </div>
                        <h3 align="center" className="image-para">1v1 Battle</h3>
                    </div>

                    <div className="image-container">
                        <Link
                            onClick={() => {
                                window.appComponent.setState({ notificationMessage: "Sorry, the shooting game is not ready yet!" });
                            }}>

                            <img
                                src={require("../assets/shooting_image.PNG")}
                                alt="Shooting Selection" />
                        </Link>
                        <h3 align="center" className="image-para">Shooting</h3>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default withRouter(GameSelect);