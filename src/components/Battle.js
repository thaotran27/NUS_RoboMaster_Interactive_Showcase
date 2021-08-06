import React, { useContext, useState, useEffect, useRef } from 'react';
import { withRouter, useLocation, useHistory } from "react-router-dom";

import keyboardController from "../common/KeyboardController.js"
import WaitingQueue from "./WaitingQueue.js"

import webRTC from '../api/WebRTC.js';

import "./Battle.css";
import "../common/Animations.css";

function Battle(props) {
    const history = useHistory();
    const location = useLocation();

    const [videoStream, setVideoStream] = useState(null);
    const videoRef = useRef(null);

    useEffect(() => {
        if (!location.username) {
            window.alert("Please log in before playing a game!");
            history.push("/");
        } else if (history.purpose === "playing") {
            webRTC.setVideoCallback(setVideoStream);
        }
    }, []);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = videoStream
        }
    }, [videoStream]);

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
                <hr />
                <img src={require("../assets/battle_instructions.png")} alt="Gameplay Instructions" />
            </div>

            <div className="game-container">
                <h3 align="center">1v1 Battle</h3>
                <hr />
                <video
                    id="localRobotFeed"
                    autoPlay={true}
                    playsInline={true}
                    ref={videoRef}>
                </video>
                <span id="battleTimeTitle">Time Left: </span><span id="battleTime" className="seconds">-</span>
            </div>

            <WaitingQueue></WaitingQueue>

        </div>
    );
}

export default withRouter(Battle);