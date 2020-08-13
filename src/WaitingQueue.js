import React, { useContext, useState } from 'react';
import { withRouter } from "react-router-dom";

import { GlobalVals } from "./App.js"

import "./Battle.css";
import "./Animations.css";

function updateQueue(userQueue) {
    return (
        userQueue.map((name) => (
            <span key={userQueue.indexOf(name)+1}>{userQueue.indexOf(name)+1}. {name}</span>
        ))
    );
}

function WaitingQueue() {
    const [userQueue] = useState(useContext(GlobalVals).userBattleQueue);

    return (
        <div className="queue-container">
            <h3 align="center">Waiting Queue</h3>
            <hr/>
            <div className="queue-scroll-container">
                {updateQueue(userQueue)}
            </div>
        </div>
    );
}

export default WaitingQueue;