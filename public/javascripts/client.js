game.client = {};

game.client.init = function () {
    socket = io.connect();
    socket.emit('init');
    socket.on('spawnPlayer', function (player) {
        game.client.addEntity("dummy_player", {
            id: player.id,
            x: 150,
            y: 350,
            name: player.name
        });
    });

    socket.on('spawnEnemy', function (enemy) {
        game.client.addEntity("enemy", {
            id: enemy.id,
            x: enemy.x,
            y: 390
        });
    });

    socket.on('updatePlayerData', function (playerData) {
        var player = _.find(me.game.world.children, function (child) {
            return child.id == playerData.id;
        });
        if(player){
            player.move(playerData.x);
            player.updateMovement();
            player.pos.y = playerData.y;
        }
    });

    socket.on('createClientBullet', function (bulletData) {
        game.client.addEntity("bullet", bulletData);
    });

    socket.on('currentPlayers', function (players) {
        _.each(players, function(p) {
             game.client.addEntity("dummy_player", p);
        });
    });
        socket.on('currentZombies', function (zombies) {
        _.each(zombies, function(z) {
             game.client.addEntity("enemy", z);
        });
    });

    socket.on('updateZombieMovement', function (z) {
        var where = {
            id: z.id,
            type: me.game.ENEMY_OBJECT
        }
        var zombie = _.findWhere(me.game.world.children, where);
        if (zombie) {
            zombie.endX = z.x;
            zombie.endY = z.y;
        }
    });
};

game.client.sendBullet = function (bullet) {
    socket.emit('bulletFired', bullet);
};

game.client.sendMovement = function (data) {
    socket.emit('playerMovedPosition', data);
};

game.client.enemyKilled = function (id) {
    socket.emit('enemyKilled', {
        id: id
    });
};
game.client.addEntity = function (entityName, settings) {
    var entity = new me.entityPool.newInstanceOf(entityName, settings);
    me.game.add(entity, 20);
    me.game.sort();
};