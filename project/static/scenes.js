Crafty.scene('Game', function () {
    //TODO: All this random generation should be done from the server side.

    // A 2D array to keep track of all occupied tiles
    this.occupied = new Array(Game.map_grid.width);
    for (var i = 0; i < Game.map_grid.width; i++) {
        this.occupied[i] = new Array(Game.map_grid.height);
        for (var y = 0; y < Game.map_grid.height; y++) {
            this.occupied[i][y] = false;
        }
    }

    // Monster placed in middle
    this.monster = Crafty.e('Monster').at(10, 10);
    this.occupied[this.monster.at().x][this.monster.at().y] = true;

    // Player character, placed at 5, 5 on our grid
    this.player = Crafty.e('Player').at(5, 5);
    this.occupied[this.player.at().x][this.player.at().y] = true;

    // Place a tree at every edge square on our grid of 16x16 tiles
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            var at_edge = x == 0 || x == Game.map_grid.width - 1 || y == 0 || y == Game.map_grid.height - 1;

            if (at_edge) {
                // Place a tree entity at the current tile
                Crafty.e('Tree').at(x, y);
                this.occupied[x][y] = true;
            } else if (Math.random() < 0.06 && !this.occupied[x][y]) {
                // Place a bush entity at the current tile
                Crafty.e('Bush').at(x, y);
                this.occupied[x][y] = true;
            }
        }
    }

    // Generate up to five bombs on the map in random locations
    var max_bombs = 5;
    for (var x = 0; x < Game.map_grid.width; x++) {
        for (var y = 0; y < Game.map_grid.height; y++) {
            if (Math.random() < 0.02) {
                if (Crafty('Bomb').length < max_bombs && !this.occupied[x][y]) {
                    Crafty.e('Bomb').at(x, y);
                }
            }
        }
    }

    this.show_victory = this.bind('BombCollected', function () {
        if (!Crafty('Bomb').length) {
            Crafty.scene('Victory');
        }
    });
}, function () {
    this.unbind('BombCollected', this.show_victory);
});

Crafty.scene('Victory', function () {
    Crafty.e('2D, DOM, Text')
        .attr({ x: 0, y: 0 })
        .text('Victory!');

    this.restart_game = this.bind('KeyDown', function () {
        Crafty.scene('Game');
    });
}, function () {
    this.unbind('KeyDown', this.restart_game);
});