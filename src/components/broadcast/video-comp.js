// import React from 'react'
import socket from './socket-config'
import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import './style/video-comp.css'

class Video extends Component {
    constructor(props){
        super(props)
        this.state = {
            noViews : 0,
            err : "",
            onLive : false,
            toLogout: false
        }
        this.peerConnections = {}
        this.videoStream = null
        this.config = {
            'iceServers' : [{ 
                'urls': ['stun:stun.l.google.com:19302']
            }]
        }
    }

    componentDidMount = () =>{
        // liston's for no of watcher's in room 
        socket.on("no-view",noWatcher => {
            console.log("no of viewers",noWatcher)
            this.setState({noViews : noWatcher})
        })

        // listion's for client sdp
        socket.on("answer",(id,description) => {
            console.log("answer")
            // console.log("client's sdp",description)
            this.peerConnections[id].setRemoteDescription(description)
                .then(res => console.log("res"))
        })

        // connect to client 
        socket.on("watcher",id => {
            console.log("watcher")
            let video = document.getElementById("video")
            const peerConnection = new RTCPeerConnection(this.config)
            this.peerConnections[id] = peerConnection
            console.log(this.peerConnections)
            let stream = video.srcObject
            console.log("sending track's to client")
            stream.getTracks().forEach(track => peerConnection.addTrack(track,stream))
            
            peerConnection.createOffer()
            .then(sdp => peerConnection.setLocalDescription(sdp))
            .then(() => {
                // console.log("sending sdp to client",peerConnection.localDescription)
                socket.emit("offer",id,peerConnection.localDescription)
            })
        
            peerConnection.onicecandidate = (event) => {
                if (event.candidate){
                    // console.log("send identity to client",event.candidate)
                    socket.emit("candidate",id,event.candidate)
                }
            }
        })

        // linking and storing client sdp and info 
        socket.on("candidate",(id,candidate) => {
            console.log("candidate")
            // console.log("add client to peer's",candidate)
            console.log(id,candidate)
            console.log("peer obj",this.peerConnections)
            this.peerConnections[id].addIceCandidate(new RTCIceCandidate(candidate))
        })

        // listion when a client close's connection 
        socket.on("bye",id => {
            console.log(`${id} offline`)
            this.peerConnections[id] && this.peerConnections[id].close()
            delete this.peerConnections[id]
        })  

        socket.on("refreshed",msg => {
            console.log(msg)
        })
    }

    start = () => {
        let videoElemenet = document.getElementById("video")
        let roomName = sessionStorage.getItem("roomName")
        socket.emit("refresh-room",roomName)
        this.videoStream = navigator.mediaDevices.getDisplayMedia({
            video : { cursor : "always" },
            audio : true
        })
            .then(stream => {
                this.videoStream = stream
                videoElemenet.srcObject = this.videoStream
            })
            .catch(err => {
                console.log(err)
                alert("an error occured...")
            })
    }

    goLive = () => {
        console.log("going live...")
        if (this.state.onLive === false){
            this.setState({onLive : true})
            let roomName = sessionStorage.getItem("roomName")
            socket.emit("broadcaster",roomName)
            let msg = {msg:"on live",sender:"admin",room : roomName}
            socket.emit("live-msg",msg)
            this.updateDB()
        }else{
            alert("ur already live")
        }
    }

    updateDB = () => {
        let roomID = sessionStorage.getItem("roomID")
        if (roomID !== ""){
            fetch(`http://locahost:5000/api/room-broadcast-start/${roomID}`,{
                method : "GET",
                headers : { "Accept" : "application/json" }
            })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
        }
    }

    stop = () => {
        console.log("stoped live steaming...")
        this.setState({onLive : false})
        this.videoStream.getTracks().forEach(track => {
            track.stop()
        })
        this.videoStream = null
    }

    logout = () => {
        let roomID = sessionStorage.getItem("roomID")
        if (roomID !== ""){
            fetch(`http://localhost:5000/api/room-admin-logout/${roomID}`,{
                method :"GET",
                headers : { "Accept" : "application/json" }
            })
            .then(res => res.json())
            .then(data => {
                if (!data.err){
                    this.setState({toLogout : true})
                    sessionStorage.removeItem("roomID")
                    sessionStorage.removeItem("roomName")
                    sessionStorage.removeItem("key")        
                }
            })
            .catch(err => { 
                if(err){ 
                    this.setState({toLogout : true})
                    sessionStorage.removeItem("roomID")
                    sessionStorage.removeItem("roomName")
                    sessionStorage.removeItem("key")
                 }
            })        

            
        }
    }


    render() {
        if (this.state.toLogout === true){
            return(
                <Redirect to="/"/>
            )
        }

        return (
            <div className="video-comp">
                <div className="video-ele">
                    <video autoPlay controls id="video"/>
                </div>
                <div className="controls">
                    <button onClick={this.start}>start</button>
                    <button onClick={this.goLive}>go live</button>
                    <button onClick={this.stop}>stop</button>
                    <button onClick={this.logout}>
                        logout
                    </button>
                    <button>
                        <p>
                            <b id="no">{this.state.noViews}</b> 
                        watchers
                        </p>
                    </button>          
                </div>
            </div>
        )
    }
}

export default Video