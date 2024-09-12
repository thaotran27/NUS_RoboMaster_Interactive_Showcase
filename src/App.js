import React, { useState, useEffect } from "react";
import { Route, Switch, withRouter } from "react-router-dom";

import Notification from "./common/Notification";
import Home from "./components/Home.js";
import GameSelect from "./components/GameSelect.js";
import Battle from "./components/Battle.js";
import Shooting from "./components/Shooting.js";

import signallingServer from "./api/SignallingServer";

import "./App.css";
import "./common/Animations.css";

import slide1 from "./assets/robot-photo2.jpg";
import slide2 from "./assets/aerial-robot2.jpg";
import slide3 from "./assets/arena-2018.jpg";
import slide4 from "./assets/robot-engineer.jpg";
import slide5 from "./assets/robot-photo3.jpg";

function App() {
  const bgImageList = [slide1, slide2, slide3, slide4, slide5];
  window.appComponent = this;

  const [isChrome, setIsChrome] = useState(false);
  const [isEdge, setIsEdge] = useState(false);

  useEffect(() => {
    // Chrome 1 - 71
    setIsChrome(window.navigator.userAgent.indexOf("Chrome") > -1);
    setIsEdge(window.navigator.userAgent.indexOf("Edge") > -1);
    console.log("started");
    // signallingServer.initialize("localhost", 49621); // Comment this if running on AWS
    signallingServer.initialize("18.142.123.26", 49621); // Uncomment this if running on AWS
  }, []);

  if (isChrome || isEdge) {
    return (
      <div className="main">
        <div className="nav-bar init-top">
          <img
            src={require("./assets/luminus_logo2.png")}
            className="luminus-logo"
            alt="team luminus logo"
          />
          <div className="title">
            <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
          </div>
          <img
            src={require("./assets/nus_engineering_logo.png")}
            className="nus-engin-logo"
            alt="nus engineering logo"
          />
        </div>

        <div id="slides" className="slides">
          <img src={bgImageList[0]} alt="background robot"></img>
        </div>

        <Switch>
          <Route path="/" exact component={() => <Home />} />
          <Route path="/game-select/" exact component={() => <GameSelect />} />
          <Route
            path="/game-select/battle"
            exact
            component={() => <Battle placeholder={""} />}
          />
          <Route
            path="/game-select/shooting"
            exact
            component={() => <Shooting placeholder={""} />}
          />
        </Switch>
      </div>
    );
  } else {
    return <div>Please use Chrome!</div>;
  }
}

export default withRouter(App);
