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

class App extends Component {

    state = {
        isLoggedIn: false
    }

    constructor(props) {
        super(props);
        this.bgImageList = [slide1, slide2, slide3, slide4, slide5];
    }

    componentWillMount() {
        this.serverConnection = new WebSocket("ws://localhost:49621");

        this.rtcConfiguration = {
            "iceServers": [
                { "url": "stun:stun.1.google.com:19302" },
                { "url": "turn:54.179.2.91:3478",
                "username": "RaghavB",
                "credential": "RMTurnServer"}] 
        };
        this.rtcPeerConnection = new RTCPeerConnection(this.rtcConfiguration);

        // Handle messages from the server.
        this.serverConnection.onmessage = (receivedMessage) => {
            console.log("Got message from server: ", receivedMessage);
            var parsedMessage = JSON.parse(receivedMessage.data);

            switch (parsedMessage.type) {
                
                case "login":
                    console.log("User attempting to login...");
                    if (parsedMessage.success) {
                        this.state.isLoggedIn = true;
                        this.props.history.push("/game-select");
                    } else {
                        window.alert("Username already in use, please pick a different one!");
                    }
                    break;


                case "request-offer": 
                    var rtcPtr = this.rtcPeerConnection;
                    var serverPtr = this.serverConnection;

                    this.rtcPeerConnection.addEventListener("icegatheringstatechange", function() {                        
                        if (rtcPtr.iceGatheringState === "complete") {
                            console.log("Sending offer to robot: " + parsedMessage.robotName);
                            serverPtr.send(JSON.stringify({
                                type: "offer",
                                name: parsedMessage.robotName,
                                offer: rtcPtr.localDescription.sdp
                            }));
                            console.log(rtcPtr);
                        }
                    }, false);

                    this.rtcDataChannel = this.rtcPeerConnection.createDataChannel("control_channel", {
                        reliable: true
                    });

                    this.rtcPeerConnection.ondatachannel = function(event) {
                        event.channel.onerror = function(e) {
                            console.log("Data channel error: ", e);
                        };
                        event.channel.onmessage = function(e) {
                            console.log("Data received: ", e.data);
                        }
                    };

                    rtcPtr.createOffer(function(sessionDescription) {
                        rtcPtr.setLocalDescription(sessionDescription);
                    }, function(error) {
                        window.alert(error);
                    }, {
                        "mandatory": {
                            "OfferToReceiveAudio": false,
                            "OfferToReceiveVideo": true
                        }
                    });
                    break;


                case "put-in-queue":
                    break;

                
                case "answer":
                    this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(parsedMessage.answer));
                    console.log("Received answer: " + parsedMessage.answer);
                    break;

                case "update-queue":


                default:
                    console.log("unknown message for now");
            }
        };
    }

    sendToServer(jsonObject) {
        this.serverConnection.send(JSON.stringify(jsonObject));
    }

    render() {
        return (
            <LoginContext.Provider value={this.state.isLoggedIn}>
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
                        <Route path="/game-select/battle" exact component={() => (
                            <Battle server={this.serverConnection} peerConnection={this.rtcPeerConnection}/>)} />
                        <Route path="/game-select/shooting" exact component={() => (<Shooting server={this.serverConnection}/>)} />
                    </Switch>

                </div>
            </LoginContext.Provider>

        );
    }
}

export const LoginContext = React.createContext();
export default withRouter(App);
