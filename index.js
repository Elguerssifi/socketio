const io = require("socket.io")(8900,{
    cors:{
        origin : "http://localhost:3000"
    }
})
let users = []
const addUser = (userPseudo,socketId) => {
    !users.some(user => user.userPseudo === userPseudo) &&
        users.push({userPseudo,socketId})
}
const removeUser = (socketId) => {
    users = users.filter(user => user.socketId !== socketId)
}
const getUser = (userPseudo) => {
    return users.find((user) => user.userPseudo === userPseudo)
}
io.on("connection" , (socket) => {
    // when Connect
    console.log('user connected')
    // Take UserPseudo and socketId from user
    socket.on("addUser",userPseudo => {
        addUser(userPseudo,socket.id)
        io.emit("getUsers",users)
    })
    // send and get Message 
    socket.on("sendMessage",({senderPseudo,receiverPseudo,text})=> {
        const user = getUser(receiverPseudo)
        if(user){
            io.to(user.socketId).emit("getMessage",{
                senderPseudo,
                text
            })
        } else {
            return
        }
    })
    // when disconnect
    socket.on("disconnect",() => {
        console.log("user disconnted")
        removeUser(socket.id)
        io.emit("getUsers",users)
    })
})