Crafty.scene('Game', function () {
    console.log(Crafty.mapData);
    this.otherPlayers = {}

    for (const [key, coord] of Object.entries(Crafty.mapData.players)) {
        if (key == 'Monster') {
            this.otherPlayers[key] = Crafty.e('Monster').at(coord.grid_x, coord.grid_y);
            this.otherPlayers[key].name = key;
        } else if (key == Crafty.yourPlayer.name) {
            this.player = Crafty.e('Player').at(coord.grid_x, coord.grid_y);
            this.player.name = key;
        } else {
            let other = Crafty.e('OtherPlayer').at(coord.grid_x, coord.grid_y);
            other.name = key;
            this.otherPlayers[coord.name] = other;
        }
    }

    for (var i = 0; i < Crafty.mapData.terrain.Tree.length; i++) {
        let coord = Crafty.mapData.terrain.Tree[i];
        Crafty.e('Tree').at(coord.x, coord.y);
    }

    for (var i = 0; i < Crafty.mapData.terrain.Bush.length; i++) {
        let coord = Crafty.mapData.terrain.Bush[i];
        Crafty.e('Bush').at(coord.x, coord.y);
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