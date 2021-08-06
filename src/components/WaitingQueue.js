import React, { useState, useEffect } from "react";

import "./Battle.css";
import "../common/Animations.css";
import signallingServer from "../api/SignallingServer.js";

function updateQueue(userQueue) {
  return userQueue.map((name) => (
    <span key={userQueue.indexOf(name) + 1}>
      {userQueue.indexOf(name) + 1}. {name}
    </span>
  ));
}

function WaitingQueue() {
  const [userQueue, setUserQueue] = useState([]);

  useEffect(() => {
    setInterval(() => {
      setUserQueue(
        signallingServer.updatedQueueMessage
          ? signallingServer.updatedQueueMessage.updatedQueue
          : []
      );
    }, 1000);
  }, [])
  

  return (
    <div className="queue-container">
      <h3 align="center">Waiting Queue</h3>
      <hr />
      <div className="queue-scroll-container">{updateQueue(userQueue)}</div>
    </div>
  );
}

export default WaitingQueue;
