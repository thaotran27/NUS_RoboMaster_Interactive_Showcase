import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import Home from "./Home.js";
import GameSelect from "./GameSelect.js";
import Battle from "./Battle.js";

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
  }

  render() {
    return (
      <BrowserRouter>
        <div className="main">
          
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

          <Switch>
            <Route path="/" exact component={() => (<Home text="hello"/>)} />
            <Route path="/game-select/" exact component={GameSelect}/>
            <Route path="/game-select/battle" exact component={Battle}/>
          </Switch>
          
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
