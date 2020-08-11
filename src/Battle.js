import React, { useContext } from 'react';
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";

import { LoginContext } from "./App.js"
import KeyboardController from "./KeyboardController.js"


import "./Battle.css";
import "./Animations.css";

var keyboardController;

function findFreeRobot(props) {
    
}

function Battle(props) {
    if (useContext(LoginContext) === false) {
        console.log("User not logged in, heading back to home");
        props.history.push("/");
        return <div></div>;
    }

    window.serverConnection.send(JSON.stringify({
        type: "find-robot",
        joinedGame: "battle"
    }));

    keyboardController = new KeyboardController();

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
            </div>

            <div className="game-container">
                <h3 align="center">Game</h3>
                <video id="localRobotFeed" autoPlay={true} playsInline={true}></video>
            </div>

            <div className="queue-container">
                <h3 align="center">Waiting Queue</h3>
            </div>
        </div>
    );

}

export default withRouter(Battle);