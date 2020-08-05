import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import './App.css';
import "./Animations.css";

function App() {
  return (

    <BrowserRouter>
      <div className="main">
        
        <Switch>
          <Route path="/" render={() => 
            <div>
              <div className="navBar">
                <img src={require("./imgs/luminus_logo.png")} className="luminusLogo"/>
                <div className="title">
                  <h1 align="center">NUS RoboMaster Interactive Showcase</h1>
                </div>
                <img src={require("./imgs/nus_engineering_logo.png")} className="nusEnginLogo"/>
              </div>

              <div className="welcomeContainer">
                <div className="welcomeBox init_right">
                  <img src={require("./imgs/rm_logo.png")}  className="rmLogo"/>
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

export default App;
