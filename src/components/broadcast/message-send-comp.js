import React from 'react'
import { useState } from 'react'
import socket from './socket-config'
import './style/msg-send.css'

const SendMessage = () => {
    const [msg,setMsg] = useState("")

    const sendMsg = () => {
        let roomName = sessionStorage.getItem("roomName")
        if (msg !== "" && roomName !== ""){
            let newMsg = { 
                room : roomName,
                sender : "admin",
                msg: msg
            }
            socket.emit("new-msg",newMsg)
            console.log("message send",newMsg)
            setMsg("")
        }
    }

    return(
        <div className="send-msg">
            <input type="text" placeholder="msg" value={msg}
            onChange={(event) => setMsg(event.target.value)}/>
            <button onClick={sendMsg}>send</button>
        </div>
    )
}

export default SendMessage