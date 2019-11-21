Crafty.scene('Game', function () {
    console.log(Crafty.mapData);

    // Place monster
    this.monster = Crafty.e('Monster').at(Crafty.mapData.players.Monster.x, Crafty.mapData.players.Monster.y);
    this.otherPlayers = {}

    for (const [key, coord] of Object.entries(Crafty.mapData.players)) {
        console.log(`Creating player ${key}, ${coord}`);
        if (key == 'Monster') {
            continue;
        } else if (key == Crafty.yourPlayer.name) {
            this.player = Crafty.e('Player').at(coord.x, coord.y);
        } else {
            let other = Crafty.e('OtherPlayer').at(coord.x, coord.y);
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