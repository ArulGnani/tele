import React, { useEffect, useState } from 'react'
import { Redirect } from 'react-router-dom'
import VideoComp from './video-comp'
import Message from './message-comp'
import './style/broadcast.css'

const BroadCast = () => {
    const [autherised,setAutherised] = useState("null")
    const [toLogout,setLogout] = useState(false)

    useEffect(() => {
        let key = sessionStorage.getItem("key")
        let roomName = sessionStorage.getItem("roomName")
        if (key === "ca243$%AC#ADF" && roomName !== ""){
            setAutherised("true")
        }else{  
            setAutherised("false")
        }
    },[])

    if (autherised === "false" || toLogout === true){
        return (
            <Redirect to="/"/>
        )
    }

    return(
        <div className="broadcast-comp">
            <div id="video-comp">
                <VideoComp />
            </div>
            <div id="msg-comp">
                <Message/>
            </div>        
        </div>
    )
}

export default BroadCast