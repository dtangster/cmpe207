// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function () {
        this.attr({
            w: Crafty.mapData.grid.tile.width,
            h: Crafty.mapData.grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function (x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x / Crafty.mapData.grid.tile.width, y: this.y / Crafty.mapData.grid.tile.height }
        } else {
            this.attr({ x: x * Crafty.mapData.grid.tile.width, y: y * Crafty.mapData.grid.tile.height });
            return this;
        }
    }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function () {
        this.requires('2D, Canvas, Grid');
    },
});

// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
    init: function () {
        this.requires('Actor, Color, Solid')
            .color('rgb(20, 125, 40)');
    },
});

// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
    init: function () {
        this.requires('Actor, Color, Solid')
            .color('rgb(20, 185, 40)');
    },
});

// This is the player-controlled character
Crafty.c('Player', {
    init: function () {
        this.requires('Actor, Fourway, Color, Collision')
            .fourway(100)
            .color('rgb(20, 75, 40)')
            .onHit('Solid', this.stopMovement);
    },

    items: {
        "bombs": 0,
        "walls": 0
    },

    // Move the player back to its original position before the collision
    stopMovement: function () {
        this.x -= this.dx;
        this.y -= this.dy;
    }
});

// Any other player that is not you
Crafty.c('OtherPlayer', {
    init: function () {
        this.requires('Actor, Color, Collision')
            .color('rgb(182, 75, 80)')
            .onHit('Solid', this.stopMovement);
    },
});

// A monster that can kill any player on contact
Crafty.c('Monster', {
    init: function () {
        this.requires('Actor, Color, Collision')
            .color('rgb(105, 105, 105)')
            .onHit('Player', this.hitPlayer);
    },

    hitPlayer: function(players) {
        for (let i = 0; i < players.length; i++) {
            console.log(`${players[i].obj.name} killed!`)
            players[i].obj.destroy();
            Crafty.socket.emit('player_killed', players[i].obj.name);
        }
    }
});

// A bomb used to destroy a wall in front of you
Crafty.c('Bomb', {
    init: function () {
        this.requires('Actor, Color, Collision')
            .color('rgb(170, 125, 40)')
            .onHit('Player', this.collect);
    },

    collect: function (players) {
        players[0].obj.items.bombs += 1;
        this.destroy();
        Crafty.trigger('BombCollected', this);
    }
});