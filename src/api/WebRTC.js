



class WebRTC {
    constructor() {
    }

    initializePeerConnection() {
        return new Promise((resolve, reject) => {
            // Contains the ICE servers used for finding route through firewalls during initial
            // WebRTC handshaking with robot
            this.rtcConfiguration = {
                "iceServers": [
                    { "url": "stun:stun.1.google.com:19302" },
                    {
                        "url": "turn:18.142.123.26:3478",
                        "username": "RaghavB",
                        "credential": "RMTurnServer"
                    }]
            };

            this.rtcPeerConnection = new RTCPeerConnection(this.rtcConfiguration);
            // Data channel for transmitting keyboard controls to robot
            this.rtcDataChannel = this.rtcPeerConnection.createDataChannel("control_channel", {
                reliable: true
            });

            // Create offer for robot
            this.rtcPeerConnection.createOffer((sessionDescription) => {
                this.rtcPeerConnection.setLocalDescription(sessionDescription);
            }, (error) => {
                reject(error);
            }, {
                "mandatory": {
                    "OfferToReceiveAudio": false,
                    "OfferToReceiveVideo": true
                }
            });

            // Only when this successfully executes does the promise finish
            this.rtcPeerConnection.addEventListener("icegatheringstatechange", () => {
                if (this.rtcPeerConnection.iceGatheringState === "complete") {
                    resolve();
                }
            }, false);
        });
    }


    getOffer() {
        return this.rtcPeerConnection.localDescription.sdp;
    }

    setAnswer(answer) {
        this.rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
    }


    sendKeyPress(keysPressed) {
        this.rtcDataChannel.send(JSON.stringify(keysPressed));
    }


    // Pass a state setter into to this have the video stream bind to a <video> tag
    setVideoCallback(callback) {
        this.rtcPeerConnection.addEventListener("track", (event) => {
            console.log("Incoming track detected");
            callback(event.streams[0]);
        });
    }


    closePeerConnection() {
        try {
            // TODO Not sure why this sends an empty object
            this.rtcDataChannel.send(JSON.stringify({}));
            this.rtcDataChannel.close();
            this.rtcPeerConnection.close();
            console.log("Peer connection ended");
        } catch (e) {
            console.warn("Peer connection was not yet initialized");
        }
    }




}

const webRTC = new WebRTC();
export default webRTC;