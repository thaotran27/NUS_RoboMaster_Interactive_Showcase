import React, { Component, useEffect, useState } from 'react';
import { useHistory } from "react-router-dom";

import signallingServer from '../api/SignallingServer';

import "./Home.css";
import "../common/Animations.css";
import keyboardController from '../common/KeyboardController';

function Home(props) {
    const history = useHistory();

    const [username, setUsername] = useState("");

    function startButtonHandler() {
        signallingServer.userLogin(username)
            .then(() => {
                history.push({
                    pathname: "/game-select",
                    username: username
                });
            })
            .catch((error) => {
                window.alert(error);
            });
    }

    return (
        <div className="welcome-container">
            <div className="welcome-box init-left">

                <img src={require("../assets/rm_logo.png")} className="rm-logo" alt="robomaster logo" />
                <h2 align="center">Welcome to Team LumiNUS's Interactive Robot Showcase!</h2>
                <p align="center">
                    Get ready to experience the exciting gameplay elements of the RoboMaster competition <br />
                    by controlling our robots live from the comfort of your home!
                </p>
                <p>Please enter your nickname below to begin :)</p>
                <br />

                <div className="usernameEntry">

                    <input
                        id="usernameTextBox"
                        type="text"
                        placeholder="Enter any nickname..."
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }} />

                    <button
                        onClick={() => {
                            startButtonHandler();
                        }}>Start!</button>
                </div>

                <br />
                <h3>For the best experience, please use Chrome on Windows.</h3>
            </div>
        </div>
    );
}

export default Home;