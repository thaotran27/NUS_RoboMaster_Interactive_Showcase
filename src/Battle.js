import React, { useContext, useState, useEffect } from 'react';
import { withRouter } from "react-router-dom";

import { GlobalVals } from "./App.js"
import KeyboardController from "./KeyboardController.js"


import "./Battle.css";
import "./Animations.css";

var keyboardController;

function Battle(props) {
    const [userQueue, setThing] = useState(useContext(GlobalVals).userBattleQueue);

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
            </div>

            <div className="queue-container">
                <h3 align="center">Waiting Queue</h3>
                <hr/>
                <div className="queue-scroll-container">
                    {userQueue.map((name) => (
                        <span key={userQueue.indexOf(name)+1}>{userQueue.indexOf(name)+1}. {name}</span>
                    ))}
                </div>
            </div>
        </div>
    );

}

export default withRouter(Battle);