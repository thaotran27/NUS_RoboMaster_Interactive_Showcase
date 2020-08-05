import React, { Component } from 'react';

import "./Home.css";
import "./Animations.css";

class Home extends Component {
    constructor() {
        super();
        this.connection = new WebSocket("ws://54.179.2.91:3000");
        this.username = null;
    }

    componentDidMount() {
        this.usernameTextBox = document.getElementById("usernameTextBox");
    }

    parseUsername() {
        this.username = this.usernameTextBox.value;
        if (this.username == "") {
            window.alert("Please enter a username!");
        } else {
            window.alert("Username: " + this.username);
        }
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
                    <button onClick={this.parseUsername.bind(this)}>Start!</button>
                </div>
                </div>
            </div>
        );
    }

    sendToServer(jsonMessage) {
        
    }
}

export default Home;