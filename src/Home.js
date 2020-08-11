import React, { Component } from 'react';
import { withRouter} from "react-router-dom";

import "./Home.css";
import "./Animations.css";

class Home extends Component {

    componentDidMount() {
        this.usernameTextBox = document.getElementById("usernameTextBox");
    }

    loginHandler() {
        this.props.history.push({
            pathname: "/game-select",
            state: { name: this.username }
        });
    }

    startButtonHandler() {
        if (this.usernameTextBox.value === "") {
            window.alert("Please enter a username!");
            return;
        }

        var message = {
            type: "user-login",
            name: this.usernameTextBox.value
        };
        window.serverConnection.send(JSON.stringify(message));
    }

    render() {
        return (
            <div className="welcome-container">
                <div className="welcome-box init-left">

                    <img src={require("./imgs/rm_logo.png")} className="rm-logo" alt="robomaster logo"/>
                    <h2 align="center">Welcome to Team LumiNUS's Interactive Robot Showcase!</h2>
                    <p align="center">
                        Get ready to experience some of the exciting gameplay elements of the RoboMaster competition 
                        for yourself through our live robot control interfaces from the comfort of your home!
                    </p>
                    <p>To get started, please enter a username below to begin :)</p>
                    
                    <div className="usernameEntry">
                        <input id="usernameTextBox" type="text" placeholder="Enter a username..."></input>
                        <button onClick={this.startButtonHandler.bind(this)}>Start!</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(Home);