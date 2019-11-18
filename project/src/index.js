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

var player = 0;


// TODO: The initial terrain and monster positions need to be randomized here.
// The work done in scenes.js need to be done here instead so the server side
// can keep track of the game state. When a new player joins, we should randomly
// spawn the new player in an unoccupied space.
var positions = {
    'Terrain': {
        'Bush': { x: 9, y: 10 },
        'Tree': { x: 20, y: 20 }
    },
    'Players': {
        'Monster': { x: 3, y: 3 }
    }
}

io.on('connection', function (socket) {
    console.log("Adding new player to scene ...");
    player += 1;
    positions['Players']['Player' + player] = { x: 5, y: 5 }
    io.emit('broadcast', positions);

    socket.on('player_position', function (data) {
        console.log(data);
        // TODO: When a player sends their new position, we need to update our positions structure
        // and rebroadcast it to each player.
        io.emit('broadcast', positions);
    });
});
