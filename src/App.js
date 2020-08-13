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
    console.log("Peer connection initialized");
}


window.closePeerConnection = function () {
    clearTimeout(myTimer);
    countdownVal = 40;

    // If this function is called, the user is only leaving in a controlled manner
    // i.e. not closing the entire browser window
    window.serverConnection.send(JSON.stringify({
        type: "leave",
        leaveType: "browser-back"
    }));

    try {
        document.onkeydown = null;
        document.onkeyup = null;
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


var myTimer;
var countdownVal = 40;
function tickTimer(startCountdown, props) {
    var timer = document.getElementById("time");

    try {
        if (countdownVal === 0) {
            timer.innerHTML = "-";
            window.closePeerConnection();
            props.history.push("/game-select");
            return;
        }

        if (startCountdown === false) {
            countdownVal = 40;
            timer.innerHTML = countdownVal;
        } else {
            countdownVal -= 1;
            timer.innerHTML = countdownVal;
        }
    } catch (e) {
        console.log(e);
    }

    myTimer = setTimeout(() => tickTimer(true, props), 1000);
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

        this.props.history.listen(function (location, action) {
            if (location.pathname === "/game-select" && action === "POP") {
                window.closePeerConnection();
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
                    window.closePeerConnection();
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
        tickTimer(false, this.props);
        console.log("Received answer: " + parsedMessage.answer.answer);
        this.setState({notificationMessage: "Game started!"});
        this.sendToServer({
            type: "user-start-game"
        });
    }

    // This will re-render the ENTIRE website for all users if it is called. 
    // For a start, I do not want to re-render while the user is in a game, they couldn't care less about the queue anyways.
    updateQueueHandler(parsedMessage) {
        if (parsedMessage.instruction === "normal-update") {
            // We do not update here if the RTC peer connection object is in the connected state.
            if (window.rtcPeerConnection == null) {
                // Continue with update if there is no window.rtcPeerConnection. This just means user is in queue
            } else {
                // rtcPeerConnection exists, however we want to check if it is in a connected state.
                // If it is, we do not update.
                if (window.rtcPeerConnection.connectionState === "connected") {
                    return; // We do not perform an update.
                }
            }
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

        //if (parsedMessage.instruction === "start-game") {
        //    document.getElementById("localRobotFeed").srcObject = window.myStream;
        //}
    }
}

export default withRouter(App);
