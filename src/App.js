import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";

import Notification from "./Notification";
import Home from "./Home.js";
import GameSelect from "./GameSelect.js";
import Battle from "./Battle.js";
import Shooting from "./Shooting.js";
import { GlobalVals } from "./GlobalVals.js";

import './App.css';
import "./Animations.css";

import slide1 from "./imgs/robot-photo2.jpg";
import slide2 from "./imgs/aerial-robot2.jpg";
import slide3 from "./imgs/arena-2018.jpg";
import slide4 from "./imgs/robot-engineer.jpg";
import slide5 from "./imgs/robot-photo3.jpg";


window.initializePeerConnection = function () {
    window.rtcConfiguration = {
        "iceServers": [
            { "url": "stun:stun.1.google.com:19302" },
            {
                "url": "turn:54.179.2.91:3478",
                "username": "RaghavB",
                "credential": "RMTurnServer"
            }]
    };
    window.rtcPeerConnection = new RTCPeerConnection(window.rtcConfiguration);
    window.rtcDataChannel = window.rtcPeerConnection.createDataChannel("control_channel", {
        reliable: true
    });

    if (waitTimer != null) {
        clearTimeout(waitTimer);
    }
    console.log("Peer connection initialized");
}


window.closePeerConnection = function (leaveKind) {
    if (turnTimer != null) {
        clearTimeout(turnTimer);
    }
    if (waitTimer != null) {
        clearTimeout(waitTimer);
    }

    for (var key in window.keyTimers)
        if (window.keyTimers[key] !== null)
            clearInterval(window.keyTimers[key]);
    window.keyTimers= {};
    window.joinedGame = null;
    document.onkeydown = null;
    document.onkeyup = null;

    // If this function is called, the user is only leaving in a controlled manner
    // i.e. not closing the entire browser window
    window.serverConnection.send(JSON.stringify({
        type: "leave",
        leaveType: leaveKind
    }));

    try {
        window.rtcDataChannel.send(JSON.stringify({}));
        window.rtcDataChannel.close();
        window.rtcPeerConnection.close();
        console.log("Peer connection ended");
        window.appComponent.setState({
            notificationMessage: 
            "Your turn has ended, please select a game again if you wish to continue :)"
        });
    } catch (e) {
        console.warn("Peer connection was not yet initialized");
    }
}


var turnTimer = null;
var turnTime = 40;
function turnTimerTick(startValue, props, joinedGame) {
    var timer = null;
    if (joinedGame === "battle") {
        document.getElementById("battleTimeTitle").innerHTML = "Time Left:";
        timer = document.getElementById("battleTime");
    } else if (joinedGame === "shooting") {
        document.getElementById("shootingTimeTitle").innerHTML = "Time Left:";
        timer = document.getElementById("shootingTime");
    } else {
        console.error("User not in any game, but attempted to start game timer: " + joinedGame);
        return;
    }

    try {
        if (startValue === -1) {
            timer.innerHTML = "-";
            window.closePeerConnection("end-game");
            props.history.push("/game-select");
            return;
        }

        timer.innerHTML = startValue;
    } catch (e) {
        console.log(e);
    }

    turnTimer = setTimeout(() => turnTimerTick(startValue-1, props, joinedGame), 1000);
}


var waitTimer = null;
function waitTimerTick(startValue, joinedGame) {
    var timer = null;
    if (joinedGame === "battle") {
        document.getElementById("battleTimeTitle").innerHTML = "Estimated wait time:";
        timer = document.getElementById("battleTime");
    } else if (joinedGame === "shooting") {
        document.getElementById("shootingTimeTitle").innerHTML = "Estimated wait time:";
        timer = document.getElementById("shootingTime");
    } else {
        console.error("User not in any game, but attempted to start wait timer: " + joinedGame);
        return;
    }

    try {
        if (startValue === -1) {
            clearTimeout(waitTimer);
            return;
        }

        timer.innerHTML = startValue;
    } catch (e) {
        console.log(e);
    }

    waitTimer = setTimeout(() => waitTimerTick(startValue-1, joinedGame), 1000);
}


class App extends Component {
    state = {
        isLoggedIn: false,
        userBattleQueue: [],
        userShootingQueue: [],
        notificationMessage: ""
    }

    constructor(props) {
        super(props);
        this.bgImageList = [slide1, slide2, slide3, slide4, slide5];
        window.appComponent = this;
    }

    componentWillMount() {
        window.serverConnection = new WebSocket("ws://54.179.2.91:49621");
        //window.serverConnection = new WebSocket("ws://localhost:49621");

        this.props.history.listen(function (location, action) {
            if (location.pathname === "/game-select" && action === "POP") {
                // Do not delete user connection object from server in this case.
                // Only remove references to the robot and back, and remove from queues.
                window.closePeerConnection("browser-back");
            } else if (location.pathname === "/" && action === "POP") {
                // Going back to home screen means that user needs to perform login from
                // scratch. Delete connection object, remove from queues.
                window.closePeerConnection("hard-exit");
            }
        });

        // Handle messages from the server.
        window.serverConnection.onmessage = (receivedMessage) => {
            console.log("Got message from server: ", receivedMessage);
            var parsedMessage = JSON.parse(receivedMessage.data);

            switch (parsedMessage.type) {
                case "login":
                    this.loginHandler(parsedMessage);
                    break;

                case "request-offer":
                    this.requestOfferHandler(parsedMessage);
                    break;

                case "answer":
                    this.answerHandler(parsedMessage);
                    break;

                case "update-queue":
                    this.updateQueueHandler(parsedMessage);
                    break;

                case "leave":
                    window.closePeerConnection("browser-back");
                    console.log("Closing RTCPeerConnection to robot " + parsedMessage.name);
                    window.alert("Sorry, the robot has disconnected, please select a game again.");
                    this.props.history.push("/game-select");
                    break;

                default:
                    console.log("Received unknown message from signalling server.");
                    break;
            }
        };
    }

    render() {
        return (
            <GlobalVals.Provider value={this.state}>
                <div className="main">

                    <Notification></Notification>

                    <div className="nav-bar init-top">
                        <img src={require("./imgs/luminus_logo2.png")} className="luminus-logo" alt="team luminus logo" />
                        <div className="title">
                            <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
                        </div>
                        <img src={require("./imgs/nus_engineering_logo.png")} className="nus-engin-logo" alt="nus engineering logo" />
                    </div>

                    <div id="slides" className="slides">
                        <img src={this.bgImageList[0]} alt="background robot"></img>
                    </div>

                    <Switch>
                        <Route path="/" exact component={() => (<Home server={this.serverConnection} />)} />
                        <Route path="/game-select/" exact component={() => (<GameSelect server={this.serverConnection} />)} />
                        <Route path="/game-select/battle" exact component={() => (<Battle placeholder={""} />)} />
                        <Route path="/game-select/shooting" exact component={() => (<Shooting placeholder={""} />)} />
                    </Switch>

                </div>
            </GlobalVals.Provider>
        );
    }

    sendToServer(jsonObject) {
        window.serverConnection.send(JSON.stringify(jsonObject));
    }

    loginHandler(parsedMessage) {
        if (parsedMessage.success) {
            this.setState({ isLoggedIn: true, notificationMessage: "Successfully logged in!" });
            this.props.history.push("/game-select");
        } else {
            window.alert("Username already in use, please pick a different one!");
        }
    }

    requestOfferHandler(parsedMessage) {
        console.log("Robot requested offer from user");

        window.initializePeerConnection();

        window.rtcPeerConnection.addEventListener("icegatheringstatechange", function () {
            if (window.rtcPeerConnection.iceGatheringState === "complete") {
                console.log("Sending offer to robot: " + parsedMessage.robotName);
                window.serverConnection.send(JSON.stringify({
                    type: "offer",
                    name: parsedMessage.robotName,
                    offer: window.rtcPeerConnection.localDescription.sdp
                }));
            }
        }, false);
    
        window.rtcPeerConnection.addEventListener("track", function (event) {
            console.log("Incoming track detected");
            window.myStream = event.streams[0];
            document.getElementById("localRobotFeed").srcObject = window.myStream;
        });

        window.rtcPeerConnection.ondatachannel = function (event) {
            event.channel.onerror = function (e) {
                console.log("Data channel error: ", e);
            };
            event.channel.onmessage = function (e) {
                console.log("Data received: ", e.data);
            }
        };

        window.rtcPeerConnection.createOffer(function (sessionDescription) {
            window.rtcPeerConnection.setLocalDescription(sessionDescription);
        }, function (error) {
            window.alert(error);
        }, {
            "mandatory": {
                "OfferToReceiveAudio": false,
                "OfferToReceiveVideo": true
            }
        });
    }

    answerHandler(parsedMessage) {
        window.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(parsedMessage.answer));
        turnTimerTick(turnTime, this.props, window.joinedGame);
        console.log("Received answer: " + parsedMessage.answer.answer);
        this.setState({notificationMessage: "Game started!"});
        this.sendToServer({
            type: "user-start-game"
        });
    }

    // This will re-render the ENTIRE website for all users if it is called. 
    // For a start, I do not want to re-render while the user is in a game, they couldn't care less about the queue anyways.
    updateQueueHandler(parsedMessage) {
        //if (parsedMessage.instruction === "normal-update") {
        if (window.rtcPeerConnection != null) {
            // rtcPeerConnection exists, however we want to check if it is in a connected state.
            if (window.rtcPeerConnection.connectionState === "connected") {
                return; // We do not perform an update.
            }
        } else {
            // Continue with update if there is no window.rtcPeerConnection. This just means user is in queue 
        }
        //}

        if (parsedMessage.game === "battle" && this.props.location.pathname === "/game-select/battle") {
            if (!this.state.userBattleQueue.includes(window.username)) { // Indicates user is entering queue for the first time
                window.placeInQueue = parsedMessage.updatedQueue.indexOf(window.username)+1;
                var waitTime = window.placeInQueue * turnTime;
                waitTimerTick(waitTime, parsedMessage.game);
            } else {
                var newPlaceInQueue = parsedMessage.updatedQueue.indexOf(window.username)+1;
                if (newPlaceInQueue < window.placeInQueue) {
                    if (waitTimer != null) {
                        clearTimeout(waitTimer);
                    }
                    window.placeInQueue = newPlaceInQueue;
                    waitTime = newPlaceInQueue * turnTime;
                    waitTimerTick(waitTime, parsedMessage.game);
                }
            }

        } else if (parsedMessage.game === "shooting" && this.props.location.pathname === "/game-select/shooting") {
            if (!this.state.userShootingQueue.includes(window.username)) { // Indicates user is entering queue for the first time
                window.placeInQueue = parsedMessage.updatedQueue.indexOf(window.username)+1;
                var waitTime = window.placeInQueue * turnTime;
                waitTimerTick(waitTime, parsedMessage.game);
            } else {
                var newPlaceInQueue = parsedMessage.updatedQueue.indexOf(window.username)+1;
                if (newPlaceInQueue < window.placeInQueue) {
                    if (waitTimer != null) {
                        clearTimeout(waitTimer);
                    }
                    window.placeInQueue = newPlaceInQueue;
                    waitTime = newPlaceInQueue * turnTime;
                    waitTimerTick(waitTime, parsedMessage.game);
                }
            }

        } else { // User is on another page. In this case we do not update the estimated wait time.
            // nop
        }

        if (parsedMessage.game === "battle") {
            console.log("Received battle queue: " + parsedMessage.updatedQueue);
            this.setState({ userBattleQueue: parsedMessage.updatedQueue });
        } else if (parsedMessage.game === "shooting") {
            console.log("Received shooting queue: " + parsedMessage.updatedQueue);
            this.setState({ userShootingQueue: parsedMessage.updatedQueue });
        } else {
            console.error("Queue received for unknown game: " + parsedMessage.game);
        }
    }
}

export default withRouter(App);
