import React from 'react'
import SendMessage from './message-send-comp'
import RenderMessage from './message-render-comp'
import './style/msg-comp.css'

const Message = () => {
    return(
        <div className="msg-comp">
            <div className="render-msg">
                <RenderMessage />
            </div>
            <div className="send-msg">
                <SendMessage />
            </div>        
        </div>
    )
}

export default Message