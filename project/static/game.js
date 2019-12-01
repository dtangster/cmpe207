Game = {
    // The total width of the game screen. Since our grid takes up the entire screen
    // this is just the width of a tile times the width of the grid
    width: function () {
        return Crafty.mapData.grid.width * Crafty.mapData.grid.tile.width;
    },

    // The total height of the game screen. Since our grid takes up the entire screen
    // this is just the height of a tile times the height of the grid
    height: function () {
        return Crafty.mapData.grid.height * Crafty.mapData.grid.tile.height;
    },

    // Initialize and start our game
    start: function () {
        Crafty.socket = io();
        Crafty.yourPlayer = null;

        Crafty.socket.on('position_update', function (players) {
            if (!Crafty.player) {
                return;
            }
            Crafty.mapData.players = players
            for (const [name, info] of Object.entries(Crafty.mapData.players)) {
                if (name == Crafty.yourPlayer.name) {
                    continue;
                } else {
                    Crafty.otherPlayers[name].x = info.x;
                    Crafty.otherPlayers[name].y = info.y
                }
            }
        });

        Crafty.socket.on('new_player', function (data) {
            Crafty.mapData = data;

            if (Crafty.yourPlayer) {
                console.log(`${data.newPlayer.name} just joined your game`);
                let other = Crafty.e('OtherPlayer').at(data.newPlayer.x, data.newPlayer.y);
                Crafty.otherPlayers[data.newPlayer.name] = other;
                return;
            } else {
                Crafty.yourPlayer = data.newPlayer;
            }

            // Start crafty and set a background color so that we can see it's working
            Crafty.init(Game.width(), Game.height());
            Crafty.background('rgb(249, 223, 125)');

            // Simply start the "Game" scene to get things going
            Crafty.scene('Game');

            Crafty.player.bind('Move', function (data) {
                let positionData = { name: Crafty.yourPlayer.name, x: Crafty.player.x, y: Crafty.player.y}
                Crafty.socket.emit('player_position', positionData);
            });
        });

        Crafty.socket.on('disconnect_player', function (playerName) {
            if (Crafty.otherPlayers[playerName] == null) {
                return;
            }
            console.log(`${playerName} disconnected`);
            Crafty.otherPlayers[playerName].destroy();
        });

        Crafty.socket.on('kill_player', function (playerName) {
            if (Crafty.otherPlayers[playerName] == null) {
                return;
            }
            console.log(`Client received message that ${playerName} has been killed.`);
            Crafty.otherPlayers[playerName].destroy();
        });

    }
}