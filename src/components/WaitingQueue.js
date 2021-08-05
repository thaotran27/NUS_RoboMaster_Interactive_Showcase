import React, { useContext } from 'react';

import "./Battle.css";
import "../common/Animations.css";

function updateQueue(userQueue) {
    return (
        userQueue.map((name) => (
            <span key={userQueue.indexOf(name) + 1}>{userQueue.indexOf(name) + 1}. {name}</span>
        ))
    );
}

function WaitingQueue() {
    //const [userQueue] = useState(useContext(GlobalVals).userBattleQueue);

    return (
        <div className="queue-container">
            <h3 align="center">Waiting Queue</h3>
            <hr />
            <div className="queue-scroll-container">
                { }
            </div>
        </div>
    );
}

export default WaitingQueue;