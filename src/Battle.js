import React, { useContext } from 'react';
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";

import { LoginContext } from "./App.js"

import "./Battle.css";
import "./Animations.css";

function findFreeRobot(server, peerConnection) {
    server.send(JSON.stringify({
        type: "find-robot",
        joinedGame: "battle"
    }));

    peerConnection.addEventListener("track", function(event) {
        console.log("Incoming track detected");
        document.getElementById("localRobotFeed").srcObject = event.streams[0];
    });
}

function Battle(props) {
    if (useContext(LoginContext) === false) {
        console.log("User not logged in, heading back to home");
        props.history.push("/");
    }

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
            </div>

            <div className="game-container">
                <h3 align="center">Game</h3>
                <video id="localRobotFeed" autoplay="true" playsinline="true"></video>
                <button onClick={() => findFreeRobot(props.server, props.peerConnection)}>Send Offer</button>
            </div>

            <div className="queue-container">
                <h3 align="center">Waiting Queue</h3>
            </div>
        </div>
    );

}

export default withRouter(Battle);