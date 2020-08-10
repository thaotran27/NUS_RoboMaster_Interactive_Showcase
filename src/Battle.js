import React, { useContext } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import { LoginContext } from "./App.js"

import "./Battle.css";
import "./Animations.css";

function getFreeRobot() {

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
                <video></video>
            </div>

            <div className="queue-container">
                <h3 align="center">Waiting Queue</h3>
            </div>
        </div>
    );

}

export default Battle;