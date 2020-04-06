import React from 'react'
import { useState } from 'react'
import { Redirect } from 'react-router-dom'
import './style/create-room.css'

const CreateRoom = () => {
    const [err,setErr] = useState("")
    const [loading,setLoading] = useState(false)
    const [roomName,setRoomName] = useState("")
    const [admin,setAdmin] = useState("")
    const [roomType,setRoomType] = useState("")
    const [roomPassword,setRoomPassword] = useState("")
    const [roomPassword2,setRoomPassword2] = useState("")
    const [adminPassword,setAdminPassword] = useState("") 
    const [adminPassword2,setAdminPassword2] = useState("")
    const [login,setLogin] = useState(false)

    const validate = () => {
        if(roomName !== "" && admin !== "" && adminPassword !== "" 
           && adminPassword2 !== "" && adminPassword === adminPassword2){
            return true           
        }else{
            setErr("")
            setErr("all fields are required...")
        }
    }

    const validatePassword = () => {
        if (roomType === "public"){
            if (roomPassword === "" && roomPassword2 === ""){
                return true
            }
        }else if (roomType === "private"){
            if (roomPassword !== "" && roomPassword === roomPassword2){
                return true
            }else{
                setErr("")
                setErr("")
            }
        }
    }

    const createRoom = () => {
        let valid = validate()
        let validPassword = validatePassword()
        console.log(valid,validPassword)
        if (valid === true){
            setLoading(true)
            let createRoomObj = roomType === "public" ? 
            {
                roomName : roomName,
                createdBy : admin,
                admin : admin,
                roomType : roomType,
                adminPassword : adminPassword
            } : {
                roomName : roomName,
                createdBy : admin,
                admin : admin,
                roomType : roomType,
                roomPassword : roomPassword2,
                adminPassword : adminPassword
            }   
            console.log(createRoomObj)
            fetch("http://localhost:5000/api/create-room",{
                method : "POST",
                headers : {
                    "Content-Type" : "application/json",
                    "Accept" : "application/json"
                },
                body : JSON.stringify(createRoomObj)
            })
            .then(res => res.json())
            .then(data => {
                if (!data.err){
                    setLoading(false)
                    alert("room created login to access yout room")
                    setLogin(true)
                }else{
                    setLoading(false)
                    setErr(data.err)
                }
            })
            .catch(err => {
                if (err) {
                    setErr("")
                    setErr("something went wrong...")
                }   
            })
        }
    }

    if (login){
        return (
            <Redirect to="/login-room"/>
        )
    }   

    return(
        <div id="comp">
        <div className="create-comp">
            <p className={err ? "err" : "normal"}>
                {loading ? "loading..." : err}</p>
            <div>
                <input type="text" name="roomName" id="room-name" 
                    placeholder="room name" value={roomName} 
                    onChange={(event) => setRoomName(event.target.value)} 
                /><br/>
            </div>
            <div>
                <input type="text" name="admin" id="created-by" 
                    placeholder="created by" value={admin} 
                    onChange={(event) => setAdmin(event.target.value)} 
                /><br/>
            </div>
            <div>
                <label htmlFor="select">
                    room type : 
                </label>
                <select id="select" onChange={(event) => setRoomType(event.target.value)}>
                    <option>----</option>
                    <option value="private"> private </option>
                    <option value="public"> public </option>
                </select><br/>
            </div> 
            <div>           
                <input type="password" name="roomPassword" id="room-password"
                    placeholder="room password" value={roomPassword} 
                    disabled={roomType === "public" ? true : undefined}
                    onChange={(event) => setRoomPassword(event.target.value)}
                /><br/>
            </div>
            <div>
                <input type="password" name="roomPassword2" id="room-password2"
                    placeholder="conform room password" value={roomPassword2} 
                    disabled={roomType === "public" ? true : undefined}
                    onChange={(event) => setRoomPassword2(event.target.value)}
                /><br/> 
            </div>
            <div>
                <input type="password" name="adminPassword" id="admin-password"
                    placeholder="admin password" value={adminPassword}
                    onChange={(event) => setAdminPassword(event.target.value)}
                /><br/>
            </div>
            <div>
                <input type="password" name="adminPassword2" id="admin-password2"
                    placeholder="conform room password" value={adminPassword2}
                    onChange={(event) => setAdminPassword2(event.target.value)}
                /><br/>
            </div>
            <div>
                <button onClick={createRoom}>
                    create room
                </button>
            </div>
        </div>
        </div>
    )
}

export default CreateRoom