const path = require('path')
const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
const socketio = require('socket.io')
const io = socketio(server);
const port = process.env.PORT || 9999

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('static'))
app.use(express.static('node_modules'))

app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/../index.html'));
})

server.listen(port, () => {
    console.log(`http://localhost:${port}`)
})

io.on('connection', function (socket) {
    console.log("Server connected to the socket ...");

    // TODO: We need to randomize these positions. We need to do something similar to scene.js
    // and put it into this structure. The server side should be handling the state of the game.
    // When a randomized state is created, each client needs to render the same objects.
    var positions = {
        'Player': {x: 0, y: 0},
        'Monster': {x: 5, y: 5}
    };

    io.emit('broadcast', positions);

    socket.on('player_position', function (data) {
        console.log(data);
        // TOOD: When a player sends their new position, we need to update our positions structure
        // and rebroadcast it to each player.
        io.emit('broadcast', positions);
    });
});
