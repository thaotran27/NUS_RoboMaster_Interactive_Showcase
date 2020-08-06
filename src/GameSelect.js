import React, { Component } from 'react';
import {BrowserRouter, Link, Route, Switch} from "react-router-dom";

import "./GameSelect.css";
import "./Animations.css";

class GameSelect extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
    }

    render() {
        return (this.props.location.state.name);
    }
}

export default GameSelect;