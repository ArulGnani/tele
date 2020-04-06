import React from 'react'
import { Link } from 'react-router-dom'
import './style/main-page.css'

const MainAuthPage = () => {
    return (
        <div className="main-comp">
            <div className="ele">
                <Link to="/login-room">login page</Link>
            </div><br/>
            <div className="ele">
                <Link to="/create-room">create room</Link>
            </div>                
        </div>
    )
}

export default MainAuthPage