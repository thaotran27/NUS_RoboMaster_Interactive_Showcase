import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch, withRouter} from "react-router-dom";

import "./Home.css";
import "./Animations.css";

class Home extends Component {
    constructor(props) {
        super(props);
        this.username = null;
    }

    componentDidMount() {
        this.connection = new WebSocket("ws://localhost:3000");
        this.usernameTextBox = document.getElementById("usernameTextBox");
    }

    parseUsername() {
        this.username = this.usernameTextBox.value;
        if (this.username == "") {
            window.alert("Please enter a username!");
            return;
        }

        this.props.history.push({
            pathname: "/game-select",
            state: { name: this.username }
        });
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

    sendToServer(jsonMessage) {
        
    }
}

export default withRouter(Home);