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

        Crafty.socket.on('new_player', function (data) {
            Crafty.mapData = data;

            if (Crafty.yourPlayer) {
                // TODO: We need to spawn another OtherPlayer
                return;
            } else {
                Crafty.yourPlayer = data.newPlayer;
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
        });

    }
}