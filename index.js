const socketIO = require("socket.io")
const Server = socketIO.Server

const io = new Server(3000, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
})

const characters = []

io.on("connection", (socket) => {

    console.log("connected with socket id", socket.id)

    characters.push({
        id: socket.id,
    })

    socket.emit("hello",{
        characters: characters,
        id: socket.id,
    })
    
    setInterval(() => {
        socket.emit("ping", {
            time : Date.now(),
            characters: characters
        })
    }, 100)

    socket.on("updateData", (data) => {
        const index = characters.findIndex(c => c.id === socket.id);
        if (index !== -1) {
            characters[index].position = data.position;
            characters[index].rotation = data.rotation;
        }

    });

    socket.on("disconnect", () => {
        console.log("disconnected with socket id", socket.id)

        characters.splice(characters.indexOf(characters.find(i => i.id == socket.id)), 1)
        
        io.emit("characters", characters)
    })
    

})