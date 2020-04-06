import React, { Component } from 'react'
import socket from './socket-config'
import './style/msg-render.css'

class RenderMessage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            allMsg : []
        }
    }

    componentDidMount = () => {
        socket.on("new-msg",newMsg => {
            this.setState({allMsg : [...this.state.allMsg,newMsg]})
            console.log("recived new msg",newMsg)
        })
    }

    render() {
        return (
            <div id="render-msg">
                {
                    this.state.allMsg.map((msg,key) => {
                        return(
                            <div key={key} className="msg">
                                <p>{msg.msg}</p>
                                <span>sender : {msg.sender}</span>
                            </div>
                        )
                    })
                }
            </div>
        )
    }
}

export default RenderMessage