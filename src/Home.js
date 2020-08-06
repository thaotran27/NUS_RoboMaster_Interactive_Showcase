import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";

import "./Home.css";
import "./Animations.css";

import SignallingServer from "./SignallingInterface.js";

class Home extends Component {
    constructor(props) {
        super(props);
        this.username = null;
        this.isUsernameValid = true;
    }

    componentDidMount() {
        /*this.serverConnection = new WebSocket("ws://54.179.2.91:49621");
        this.usernameTextBox = document.getElementById("usernameTextBox");

        this.serverConnection.onmessage = (receivedMessage) => {
            console.log("Got message from server: ", receivedMessage);
            var parsedMessage = JSON.parse(receivedMessage.data);

            switch (parsedMessage.type) {
                case "login":
                    if (parsedMessage.success) {
                        this.loginHandler();
                    } else {
                        window.alert("Username already in use, please pick a different one!");
                    }
                    break;
                default:
                    console.log("unknown message for now");
            }
        };*/
        SignallingServer.getInstance().testFunc();
    }

    loginHandler() {
        this.props.history.push({
            pathname: "/game-select",
            state: { name: this.username }
        });
    }

    parseUsername() {
        this.username = this.usernameTextBox.value;
        if (this.username == "") {
            window.alert("Please enter a username!");
            return;
        }

        var jsonMessage = {
            type: "login",
            name: this.username
        };
        this.serverConnection.send(JSON.stringify(jsonMessage));
    }

    render() {
        return (
            <div className="welcome-container">
                <div className="welcome-box init-left">
                    <img src={require("./imgs/rm_logo.png")} className="rm-logo"/>
                    <h2 align="center">Welcome to Team LumiNUS's Interactive Robot Showcase!</h2>
                    <p align="center">
                        Get ready to experience some of the exciting gameplay elements of the RoboMaster competition 
                        for yourself through our live robot control interfaces from the comfort of your home!
                    </p>
                    <p>To get started, please enter a username below to begin :)</p>
                    
                    <div className="usernameEntry">
                        <input id="usernameTextBox" type="text" placeholder="Enter a username..."></input>
                        <button onClick={this.parseUsername.bind(this)}>Start</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);