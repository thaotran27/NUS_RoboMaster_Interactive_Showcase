import React, { useContext, useState } from 'react';
import { withRouter } from "react-router-dom";

import { GlobalVals } from "./App.js"
import KeyboardController from "./KeyboardController.js"
import WaitingQueue from "./WaitingQueue.js"

import "./Battle.css";
import "./Animations.css";

var keyboardController;

function Battle(props) {
    if (useContext(GlobalVals).isLoggedIn === false) {
        console.log("User not logged in, heading back to home");
        props.history.push("/");
        return <div></div>;
    }

    keyboardController = new KeyboardController();

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
                <hr/>
                <img src={require("./imgs/game_instructions.png")} alt="Gameplay Instructions"/>
            </div>

            <div className="game-container">
                <h3 align="center">Game</h3>
                <hr/>
                <video id="localRobotFeed" autoPlay={true} playsInline={true}></video>
                <span>Time Left: </span><span id="time" className="seconds">-</span>
            </div>

            <WaitingQueue></WaitingQueue>

        </div>
    );
}

export default withRouter(Battle);