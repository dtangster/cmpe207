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

let map = {
    grid: {
        width: 40,
        height: 25,
        tile: {
            width: 16,
            height: 16
        }
    },
    terrain: { Tree: [], Bush: [] },
    players: {},
    items: { Bombs: [], Walls: [] },
    occupied: {},
    count: 0
}

function getUnoccupiedSlot() {
    var x = Math.floor(Math.random() * 1023 % map.grid.width);
    var y = Math.floor(Math.random() * 1023 % map.grid.height);

    while (map.occupied[x][y]) {
        x = Math.floor(Math.random() * 1023 % map.grid.width);
        y = Math.floor(Math.random() * 1023 % map.grid.height);
    }

    map.occupied[x][y] = true;
    return { x: x, y: y };
}

function newGame() {
    map.occupied = new Array(map.grid.width);
    for (let i = 0; i < map.grid.width; i++) {
        map.occupied[i] = new Array(map.grid.height);
        for (let y = 0; y < map.grid.height; y++) {
            map.occupied[i][y] = false;
        }
    }

    // Place a tree at every edge square on our grid of 16x16 tiles
    for (let x = 0; x < map.grid.width; x++) {
        for (let y = 0; y < map.grid.height; y++) {
            let at_edge = x == 0 || x == map.grid.width - 1 || y == 0 || y == map.grid.height - 1;

            if (at_edge) {
                // Place a tree entity at the current tile
                map.terrain.Tree.push({ x: x, y: y })
                map.occupied[x][y] = true;
            } else if (Math.random() < 0.06 && !map.occupied[x][y]) {
                // Place a bush entity at the current tile
                map.terrain.Bush.push({ x: x, y: y })
                map.occupied[x][y] = true;
            }
        }
    }

    // Create a monster at a random location
    let at = getUnoccupiedSlot();
    map.players.Monster = { x: at.x, y: at.y };

    // Generate up to five bombs on the map in random locations
    let max_bombs = 5;
    var bombs_placed = 0;
    for (let x = 0; x < map.grid.width; x++) {
        for (let y = 0; y < map.grid.height; y++) {
            if (Math.random() < 0.02) {
                if (bombs_placed < max_bombs && !map.occupied[x][y]) {
                    map.items.Bombs.push({ x: x, y: y })
                    map.occupied[x][y] = true;
                    bombs_placed++;
                }
            }
        }
    }
};

newGame();

io.on('connection', function (socket) {
    console.log("Adding new player to scene ...");
    map.count++;

    let at = getUnoccupiedSlot();
    let playerName = 'Player' + map.count;

    map.players[playerName] = { name: playerName, x: at.x, y: at.y };

    let mapInstance = {...map};
    mapInstance.newPlayer = playerName;
    socket.player = playerName;

    console.log(`New player: ${playerName}, All Players: ${JSON.stringify(map.players)}`);
    io.emit('new_player', mapInstance);

    socket.on('player_position', function (data) {
        console.log(data);
        // TODO: When a player sends their new position, we need to update our positions structure
        // and rebroadcast it to each player.
        //io.emit('broadcast', positions);
    });

    socket.on('disconnect', function() {
        console.log(`${socket.player} disconnected!`);
        io.emit('disconnect_player', socket.player);
        delete map.players[socket.player];
        console.log(`Remaining players ${JSON.stringify(map.players)}`);
    });
});
