import io from 'socket.io-client'

const socket = io.connect("https://tele-backend.herokuapp.com/")

export default socket