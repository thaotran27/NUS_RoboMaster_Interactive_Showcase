import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import './App.css';
import "./Animations.css";

import slide1 from "./imgs/robot-photo2.jpg";
import slide2 from "./imgs/aerial-robot2.jpg";
import slide3 from "./imgs/arena-2018.jpg";
import slide4 from "./imgs/robot-engineer.jpg";
import slide5 from "./imgs/robot-photo3.jpg";

class App extends Component {
  constructor() {
    super();
    this.bgImageList = [slide1, slide2, slide3, slide4, slide5];
  }

  componentDidMount() {
    var test = document.getElementById("usernameTextBox");
  }

  render() {
    return (
      <BrowserRouter>
        <div className="main">

          <Switch>
            <Route path="/" render={() => 
              <div>
                <div className="nav-bar init-top">
                  <img src={require("./imgs/luminus_logo2.png")} className="luminus-logo"/>
                  <div className="title">
                    <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
                  </div>
                  <img src={require("./imgs/nus_engineering_logo.png")} className="nus-engin-logo"/>
                </div>
  
                <div id="slides" className="slides">
                  <img src={this.bgImageList[0]}></img>
                </div>

                <div className="welcome-container">
                  <div className="welcome-box init-left">
                    <img src={require("./imgs/rm_logo.png")} className="rm-logo"/>
                    <h2 align="center">Welcome to Team LumiNUS's Interactive Robot Showcase!</h2>
                    <p></p>
                    <p>Please enter your username below!</p>
                    <form>
                      <input id="usernameTextBox" type="text"></input>
                    </form>
                  </div>
                </div>
  
                <p id="sizeShow">Hell</p>
              </div>
            }/>
            
  
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
