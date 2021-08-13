import React, { useState, useEffect } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";

import Notification from "./common/Notification";
import Home from "./components/Home.js";
import GameSelect from "./components/GameSelect.js";
import Battle from "./components/Battle.js";
import Shooting from "./components/Shooting.js";

import signallingServer from './api/SignallingServer';

import './App.css';
import "./common/Animations.css";

import slide1 from "./assets/robot-photo2.jpg";
import slide2 from "./assets/aerial-robot2.jpg";
import slide3 from "./assets/arena-2018.jpg";
import slide4 from "./assets/robot-engineer.jpg";
import slide5 from "./assets/robot-photo3.jpg";

// window.closePeerConnection = function (leaveKind) {
//     // If this function is called, the user is only leaving in a controlled manner
//     // i.e. not closing the entire browser window
//     window.serverConnection.send(JSON.stringify({
//         type: "leave",
//         leaveType: leaveKind
//     }));
// }
//     try {
//         if (startValue === -1) {
//             timer.innerHTML = "-";
//             window.closePeerConnection("end-game");
//             props.history.push("/game-select");
//             return;
//         }

//         timer.innerHTML = startValue;
//     } catch (e) {
//         console.log(e);
//     }
// }


function App() {

    const bgImageList = [slide1, slide2, slide3, slide4, slide5];
    window.appComponent = this;

    useEffect(() => {
        console.log("started");
        // signallingServer.initialize("localhost", 49621); // Comment this if running on AWS
        signallingServer.initialize("18.142.123.26", 49621); // Uncomment this if running on AWS
    }, []);

    return (
        <div className="main">

            <div className="nav-bar init-top">
                <img src={require("./assets/luminus_logo2.png")} className="luminus-logo" alt="team luminus logo" />
                <div className="title">
                    <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
                </div>
                <img src={require("./assets/nus_engineering_logo.png")} className="nus-engin-logo" alt="nus engineering logo" />

            </div>

            <div id="slides" className="slides">
                <img src={bgImageList[0]} alt="background robot"></img>
            </div>

            <Switch>
                <Route path="/" exact component={() => (<Home />)} />
                <Route path="/game-select/" exact component={() => (<GameSelect />)} />
                <Route path="/game-select/battle" exact component={() => (<Battle placeholder={""} />)} />
                <Route path="/game-select/shooting" exact component={() => (<Shooting placeholder={""} />)} />
            </Switch>

        </div>
    );
}


//     this.props.history.listen(function (location, action) {
//         if (location.pathname === "/game-select" && action === "POP") {
//             // Do not delete user connection object from server in this case.
//             // Only remove references to the robot and back, and remove from queues.
//             window.closePeerConnection("browser-back");
//         } else if (location.pathname === "/" && action === "POP") {
//             // Going back to home screen means that user needs to perform login from
//             // scratch. Delete connection object, remove from queues.
//             window.closePeerConnection("hard-exit");
//         }
//     });

//             case "update-queue":
//                 this.updateQueueHandler(parsedMessage);
//                 break;

//             case "leave":
//                 window.closePeerConnection("browser-back");
//                 console.log("Closing RTCPeerConnection to robot " + parsedMessage.name);
//                 window.alert("Sorry, the robot has disconnected, please select a game again.");
//                 this.props.history.push("/game-select");
//                 break;

//             default:
//                 console.log("Received unknown message from signalling server.");
//                 break;
//         }
//     };
// }

// requestOfferHandler(parsedMessage) {
//     window.rtcPeerConnection.ondatachannel = function (event) {
//         event.channel.onerror = function (e) {
//             console.log("Data channel error: ", e);
//         };
//         event.channel.onmessage = function (e) {
//             console.log("Data received: ", e.data);
//         }
//     };

// // This will re-render the ENTIRE website for all users if it is called. 
// // For a start, I do not want to re-render while the user is in a game, they couldn't care less about the queue anyways.
// updateQueueHandler(parsedMessage) {
//     //if (parsedMessage.instruction === "normal-update") {
//     if (window.rtcPeerConnection != null) {
//         // rtcPeerConnection exists, however we want to check if it is in a connected state.
//         if (window.rtcPeerConnection.connectionState === "connected") {
//             return; // We do not perform an update.
//         }
//     } else {
//         // Continue with update if there is no window.rtcPeerConnection. This just means user is in queue 
//     }
//     //}

//     if (parsedMessage.game === "battle" && this.props.location.pathname === "/game-select/battle") {
//         if (!this.state.userBattleQueue.includes(window.username)) { // Indicates user is entering queue for the first time
//             window.placeInQueue = parsedMessage.updatedQueue.indexOf(window.username) + 1;
//             var waitTime = window.placeInQueue * turnTime;
//             waitTimerTick(waitTime, parsedMessage.game);
//         } else {
//             var newPlaceInQueue = parsedMessage.updatedQueue.indexOf(window.username) + 1;
//             if (newPlaceInQueue < window.placeInQueue) {
//                 if (waitTimer != null) {
//                     clearTimeout(waitTimer);
//                 }
//                 window.placeInQueue = newPlaceInQueue;
//                 waitTime = newPlaceInQueue * turnTime;
//                 waitTimerTick(waitTime, parsedMessage.game);
//             }
//         }

//     } else if (parsedMessage.game === "shooting" && this.props.location.pathname === "/game-select/shooting") {
//         if (!this.state.userShootingQueue.includes(window.username)) { // Indicates user is entering queue for the first time
//             window.placeInQueue = parsedMessage.updatedQueue.indexOf(window.username) + 1;
//             var waitTime = window.placeInQueue * turnTime;
//             waitTimerTick(waitTime, parsedMessage.game);
//         } else {
//             var newPlaceInQueue = parsedMessage.updatedQueue.indexOf(window.username) + 1;
//             if (newPlaceInQueue < window.placeInQueue) {
//                 if (waitTimer != null) {
//                     clearTimeout(waitTimer);
//                 }
//                 window.placeInQueue = newPlaceInQueue;
//                 waitTime = newPlaceInQueue * turnTime;
//                 waitTimerTick(waitTime, parsedMessage.game);
//             }
//         }

//     } else { // User is on another page. In this case we do not update the estimated wait time.
//         // nop
//     }

//     if (parsedMessage.game === "battle") {
//         console.log("Received battle queue: " + parsedMessage.updatedQueue);
//         this.setState({ userBattleQueue: parsedMessage.updatedQueue });
//     } else if (parsedMessage.game === "shooting") {
//         console.log("Received shooting queue: " + parsedMessage.updatedQueue);
//         this.setState({ userShootingQueue: parsedMessage.updatedQueue });
//     } else {
//         console.error("Queue received for unknown game: " + parsedMessage.game);
//     }
// }
// }

export default withRouter(App);
