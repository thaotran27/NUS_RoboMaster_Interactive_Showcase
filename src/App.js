import React, { Component } from 'react';
import { Route, Switch, withRouter } from "react-router-dom";

import Home from "./Home.js";
import GameSelect from "./GameSelect.js";
import Battle from "./Battle.js";
import Shooting from "./Shooting.js";

import './App.css';
import "./Animations.css";

import slide1 from "./imgs/robot-photo2.jpg";
import slide2 from "./imgs/aerial-robot2.jpg";
import slide3 from "./imgs/arena-2018.jpg";
import slide4 from "./imgs/robot-engineer.jpg";
import slide5 from "./imgs/robot-photo3.jpg";

window.initializePeerConnection = function() {
    window.rtcConfiguration = {
        "iceServers": [
            { "url": "stun:stun.1.google.com:19302" },
            { "url": "turn:54.179.2.91:3478",
            "username": "RaghavB",
            "credential": "RMTurnServer"}] 
    };
    window.rtcPeerConnection = new RTCPeerConnection(window.rtcConfiguration);
    window.rtcDataChannel = window.rtcPeerConnection.createDataChannel("control_channel", {
        reliable: true
    });
    console.log("Peer connection initialized");
}

var myTimer;
var countdownVal = 40;

window.closePeerConnection = function() {
    clearTimeout(myTimer);
    countdownVal = 40;
    window.serverConnection.send(JSON.stringify({
        type: "leave",
        leaveType: "browser_back"
    }));
    try {
        window.rtcDataChannel.close();
        window.rtcPeerConnection.close();
    } catch (e) {
        console.log("Peer connection was not yet initialized");
    }
    console.log("Peer connection ended");
}

class App extends Component {

    state = {
        isLoggedIn: false,
        userBattleQueue: [],
        userShootingQueue: []
    }

    constructor(props) {
        super(props);
        this.bgImageList = [slide1, slide2, slide3, slide4, slide5];
    }

    componentWillMount() {
        window.serverConnection = new WebSocket("ws://localhost:49621");

        this.props.history.listen(function(location, action) {
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
                    if (parsedMessage.success) {
                        this.setState({isLoggedIn: true});
                        this.props.history.push("/game-select");
                    } else {
                        window.alert("Username already in use, please pick a different one!");
                    }
                    break;

                case "request-offer": 
                    console.log("Robot requested offer from user");
                    
                    window.initializePeerConnection();

                    window.rtcPeerConnection.addEventListener("icegatheringstatechange", function() {                        
                        if (window.rtcPeerConnection.iceGatheringState === "complete") {
                            console.log("Sending offer to robot: " + parsedMessage.robotName);
                            window.serverConnection.send(JSON.stringify({
                                type: "offer",
                                name: parsedMessage.robotName,
                                offer: window.rtcPeerConnection.localDescription.sdp
                            }));
                        }
                    }, false);
                    
                    window.rtcPeerConnection.addEventListener("track", function(event) {
                        console.log("Incoming track detected");
                        window.myStream = event.streams[0];
                        document.getElementById("localRobotFeed").srcObject = window.myStream;
                    });

                    window.rtcPeerConnection.ondatachannel = function(event) {
                        event.channel.onerror = function(e) {
                            console.log("Data channel error: ", e);
                        };
                        event.channel.onmessage = function(e) {
                            console.log("Data received: ", e.data);
                        }
                    };

                    window.rtcPeerConnection.createOffer(function(sessionDescription) {
                        window.rtcPeerConnection.setLocalDescription(sessionDescription);
                    }, function(error) {
                        window.alert(error);
                    }, {
                        "mandatory": {
                            "OfferToReceiveAudio": false,
                            "OfferToReceiveVideo": true
                        }
                    });
                    break;


                case "answer":
                    window.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(parsedMessage.answer));
                    tickTimer(false, this.props);
                    console.log("Received answer: " + parsedMessage.answer.answer);
                    break;


                case "update-queue":
                    if (parsedMessage.game === "battle") {
                        console.log(parsedMessage.updatedQueue);
                        this.setState({userBattleQueue: parsedMessage.updatedQueue});
                    } else {
                        this.setState({userShootingQueue: parsedMessage.updatedQueue});
                    }
                    if (window.rtcPeerConnection == null) {
                        break;
                    }
                    if (window.rtcPeerConnection.connectionState === "connected") {
                        document.getElementById("localRobotFeed").srcObject = window.myStream;
                    }
                    break;    
                

                case "leave":
                    window.closePeerConnection();
                    console.log("Closing RTCPeerConnection to robot " + parsedMessage.name);
                    window.alert("Sorry, the robot has disconnected, please select a game again.");

                    this.props.history.push("/game-select");
                    break;


                default:
                    console.log("unknown message for now");
            }
        };
    }

    sendToServer(jsonObject) {
        window.serverConnection.send(JSON.stringify(jsonObject));
    }

    render() {
        return (
            <GlobalVals.Provider value={this.state}>
                <div className="main">
                            
                    <div className="nav-bar init-top">
                        <img src={require("./imgs/luminus_logo2.png")} className="luminus-logo" alt="team luminus logo"/>
                        <div className="title">
                            <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
                        </div>
                        <img src={require("./imgs/nus_engineering_logo.png")} className="nus-engin-logo" alt="nus engineering logo"/>
                    </div>

                    <div id="slides" className="slides">
                        <img src={this.bgImageList[0]} alt="background robot"></img>
                    </div>

                    <Switch>
                        <Route path="/" exact component={() => (<Home server={this.serverConnection} />)} />
                        <Route path="/game-select/" exact component={() => (<GameSelect server={this.serverConnection}/>)} />
                        <Route path="/game-select/battle" exact component={() => (<Battle placeholder={""}/>)} />
                        <Route path="/game-select/shooting" exact component={() => (<Shooting placeholder={""}/>)} />
                    </Switch>

                </div>
            </GlobalVals.Provider>

        );
    }
}

function tickTimer(startCountdown, props) {
    var timer = document.getElementById("time");
    
    try {
        if (countdownVal === 0) {
            timer.innerHTML = "-";
            //window.alert("Your turn has ended, please select a game again to continue :)");
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

export const GlobalVals = React.createContext();
export default withRouter(App);
