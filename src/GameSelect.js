import React, { useContext } from 'react';
import { withRouter, Link } from 'react-router-dom'

import { GlobalVals }  from "./GlobalVals.js";

import "./GameSelect.css";
import "./Animations.css";

function goToBattle() {
    window.appComponent.setState({notificationMessage: "Joining 1v1 battle game..."});
    window.joinedGame = "battle";
    window.serverConnection.send(JSON.stringify({
        type: "find-robot",
        joinedGame: "battle"
    }));
}

function goToShooting() {
    window.appComponent.setState({notificationMessage: "Joining shooting game..."});
    window.joinedGame = "shooting";
    window.serverConnection.send(JSON.stringify({
        type: "find-robot",
        joinedGame: "shooting"
    }));
}

function GameSelect(props) {
    if (useContext(GlobalVals).isLoggedIn === false) {
        console.log("User not logged in, heading back to home");
        props.history.push("/");
    }

    return (
        <div className="selection-container init-top">
            <div className="selection-box">
                
                <h3 align="center">Please choose a game you would like to play</h3>

                <div className="tile-container">
                    <div className="image-container">
                        <Link to="/game-select/battle" onClick={() => goToBattle()}>
                            <img src={require("./imgs/battle_image.PNG")} alt="1v1 Battle Selection"/>
                        </Link>
                        <h3 align="center" className="image-para">1v1 Battle</h3>
                    </div>

                    <div className="image-container">
                        <Link onClick={() => window.appComponent.setState({notificationMessage: "Sorry, the shooting game is not ready yet!"})}>
                            <img src={require("./imgs/shooting_image.PNG")} alt="Shooting Selection"/>
                        </Link>
                        <h3 align="center" className="image-para">Shooting</h3>
                    </div>
                </div>
            </div>
        
        </div>
    );

    //<Link to="game-select/shooting" onClick={() => goToShooting()}>
    //    <img src={require("./imgs/shooting_image.PNG")} alt="Shooting Selection"/>
    //</Link>
}

export default withRouter(GameSelect);