import React, { useContext, useEffect } from "react";

import { GlobalVals }  from "./GlobalVals.js";

import "./Notification.css";
import "./Animations.css";

class Notification extends React.Component {
    constructor(props) {
        super(props);
    }

    static contextType = GlobalVals;
    componentDidUpdate() {
        document.getElementById("notifBox").classList.add("notif-animation");
        if (this.context.notificationMessage === "") {
            document.getElementById("notifBox").classList.remove("notif-animation");
        } else {
            document.getElementById("notifBox").style.opacity = 1;
        }
    }

    animEnded() {
        document.getElementById("notifBox").classList.remove("notif-animation");
        document.getElementById("notifBox").style.opacity = 0;
    }

    render() {
        return (
            <div id="notifBox" className="notification-container notif-animation" key={this.context.notificationMessage} 
                    onAnimationEnd={this.animEnded} style={{opacity: 0}}>
                <span >{this.context.notificationMessage}</span>
            </div>
        );
    }
}


/*function Notification(props) {
    var innerText = useContext(GlobalVals).notificationMessage;

    useEffect(function() {
        document.getElementById("notifBox").classList.add("notif-animation");
        console.log(innerText);
        if (innerText === "") {
            document.getElementById("notifBox").classList.remove("notif-animation");
        } else {
            document.getElementById("notifBox").style.opacity = 1;
        }
    }, [innerText]);

    return (
        <div id="notifBox" className="notification-container notif-animation" key={useContext(GlobalVals).notificationMessage} 
                onAnimationEnd={animEnded} style={{opacity: 0}}>
            <span >{useContext(GlobalVals).notificationMessage}</span>
        </div>
    );
}*/

export default Notification;