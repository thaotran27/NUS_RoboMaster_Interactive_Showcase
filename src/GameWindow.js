import React, { useContext, useState } from 'react';

class GameWindow extends React.Component {
    constructor(props) {
        super(props);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        return (
            <div className="game-container">
                <h3 align="center">Game</h3>
                <hr/>
                <video id="localRobotFeed" autoPlay={true} playsInline={true}></video>
                <span>Time Left: </span><span id="time" className="seconds">-</span>
            </div>
        );
    }
}

export default GameWindow;