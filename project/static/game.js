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

        Crafty.socket.on('new_player', function(data) {
            Crafty.mapData = data;

            if (Crafty.yourPlayer) {
                console.log(`${data.newPlayer.name} just joined your game`);
                let other = Crafty.e('OtherPlayer').at(data.newPlayer.x, data.newPlayer.y);
                Crafty.otherPlayers[data.newPlayer.name] = other;
                return;
            } else {
                Crafty.yourPlayer = data.newPlayer.name;
            }

            // Start crafty and set a background color so that we can see it's working
            Crafty.init(Game.width(), Game.height());
            Crafty.background('rgb(249, 223, 125)');

            // Simply start the "Game" scene to get things going
            Crafty.scene('Game');

            // TODO: We need to emit 'player_position' based on each frame of the game
            // event loop. The event name is EnterFrame and each client should send its
            // board state to the server.
            Crafty.socket.emit('player_position', { x: 3, y: 4 });
            console.log("Test" + Crafty.player);
        });

        Crafty.socket.on('disconnect_player', function(playerName) {
            console.log(`${playerName} disconnected`);
            Crafty.otherPlayers[playerName].destroy();
            delete Crafty.otherPlayers.playerName;
            delete Crafty.mapData.players[playerName];
        });

    }
}