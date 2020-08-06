import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import "./GameSelect.css";
import "./Animations.css";

class GameSelect extends Component {
    constructor(props) {
        super(props);
        this.username = this.props.location.state.name;
    }

    componentDidMount() {
    }

    render() {
        return (
            <div className="selection-container">

            </div>
        );
    }
}

export default GameSelect;