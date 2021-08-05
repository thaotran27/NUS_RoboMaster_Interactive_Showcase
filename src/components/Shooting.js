import React, { useContext, useState } from 'react';
import { withRouter } from "react-router";

import keyboardController from "../common/KeyboardController.js"
import WaitingQueue from "./WaitingQueue.js"

import "./Battle.css";
import "../common/Animations.css";

function Shooting(props) {
    const [userShootingQueue, setUserShootingQueue] = useState([]);

    // if (useContext(GlobalVals).isLoggedIn === false) {
    //     console.log("User not logged in, heading back to home");
    //     props.history.push("/");
    //     return <div></div>;
    // }

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
                <hr />
                <img src={require("../assets/shooting_instructions.png")} alt="Gameplay Instructions" />
            </div>

            <div className="game-container">
                <h3 align="center">Shooting</h3>
                <hr />
                <video id="localRobotFeed" autoPlay={true} playsInline={true}></video>
                <span id="shootingTimeTitle">Time Left: </span><span id="shootingTime" className="seconds">-</span>
            </div>

            <WaitingQueue></WaitingQueue>

        </div>
    );
}

export default withRouter(Shooting);