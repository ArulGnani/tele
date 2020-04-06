import React from 'react'
import {BrowserRouter as Router,Link, Route} from 'react-router-dom'
import MainAuthPage from './auth-comp/main-page'
import LoginPage from './auth-comp/login-page'
import CreateRoom from './auth-comp/create-room-page'
import BroadCast from './broadcast/broadcast-main-page'

const Main = () => {
    return(
        <Router>
            <div>
                <Route exact path="/">
                    <MainAuthPage />
                </Route>
                <Route path="/login-room">
                    <LoginPage />
                </Route>
                <Route path="/create-room">
                    <CreateRoom />
                </Route>
                <Route path="/broadcast">
                    <BroadCast />
                </Route>
            </div>
        </Router>
    )
}

export default Main
