import React, { useContext } from 'react';
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";

import { LoginContext } from "./App.js"

import "./Battle.css";
import "./Animations.css";

var keysPressed = {};

function findFreeRobot(props) {
    props.server.send(JSON.stringify({
        type: "find-robot",
        joinedGame: "battle"
    }));

    props.peerConnection.addEventListener("track", function(event) {
        console.log("Incoming track detected");
        document.getElementById("localRobotFeed").srcObject = event.streams[0];
    });

    window.addEventListener("keydown", function(event) {
        if (props.location.pathname !== "/game-select/battle") {
            return;
        }
        keysPressed[event.key] = true;
        console.log(keysPressed);
        try {
            props.dataChannel.send(JSON.stringify(keysPressed));
        } catch (e) {
            //console.log(e);
            // Silent exception handling lmao
        }
    });

    window.addEventListener("keyup", function(event) {
        console.log(props.location.pathname);
        if (props.location.pathname !== "/game-select/battle") {
            return;
        }
        delete keysPressed[event.key];
        console.log(keysPressed);
        try {
            props.dataChannel.send(JSON.stringify(keysPressed));
        } catch (e) {
            //console.log(e);
            // Silent exception handling lmao
        }
    });
}

function Battle(props) {
    if (useContext(LoginContext) === false) {
        console.log("User not logged in, heading back to home");
        props.history.push("/");
    }

    console.log(props);

    return (
        <div className="window-container">
            <div className="help-container">
                <h3 align="center">How To Play</h3>
            </div>

            <div className="game-container">
                <h3 align="center">Game</h3>
                <video id="localRobotFeed" autoPlay={true} playsInline={true}></video>
                <button onClick={() => findFreeRobot(props)}>Send Offer</button>
            </div>

            <div className="queue-container">
                <h3 align="center">Waiting Queue</h3>
            </div>
        </div>
    );

}

export default withRouter(Battle);