import React from 'react'
import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './style/login-page.css'

const LoginPage = () => {
    const [login,setLogin] = useState(false)
    const [roomName,setRoomName] = useState("")
    const [password,setPassWord] = useState("")
    const [streamedBy,setStreamer] = useState("")
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)

    const loginUser = () => {
        if (roomName !== "" && password !== ""){
            setLoading(true)
            fetch("https://tele-backend.herokuapp.com/api/room-admin-login",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body : JSON.stringify({
                    roomName : roomName,
                    adminPassword : password,
                    streamedBy : streamedBy
                })
            })
            .then(res => res.json())
            .then(data => {
                setLoading(false)
                if (!data.err){
                    setErr("")
                    alert("you are logged in...")
                    setLogin(true)
                    sessionStorage.removeItem("key")
                    sessionStorage.removeItem("roomName")
                    sessionStorage.removeItem("roomID")
                    sessionStorage.setItem("key","ca243$%AC#ADF")
                    sessionStorage.setItem("roomName",data.roomName)
                    sessionStorage.setItem("roomID",data.roomID)
                }else{
                    setErr(data.err)
                }
            })
            .catch(err => {
                setErr("something went wrong...")
            }) 
        }else{
            setErr("all fields are required...")
        }
    }

    if (login) {
        return (
            <div>
                <Redirect to="/broadcast"/> 
            </div>    
        )
    }
    return (
        <div className="login-comp">
            <div className="login-form">
                <p className={err ? "err" : "loading"}>
                    {loading ? "loading..." : err}
                </p><br/>
                <input type="text" placeholder="room name" 
                value={roomName}
                onChange={(event) => setRoomName(event.target.value)}/><br/>
                <input type="password" id="password" placeholder="password"
                value={password}
                onChange={(event) => setPassWord(event.target.value)}/><br/>
                <input type="text" placeholder="streamer name" value={streamedBy}
                onChange={(event) => setStreamer(event.target.value)}/><br/>
                <button className="login-btn" onClick={loginUser}>
                    login
                </button>
            </div>
        </div>
    )
}   

export default LoginPage