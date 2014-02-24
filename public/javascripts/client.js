game.client = {};

game.client.init = function () {
    socket = io.connect();
    socket.emit('init', "", function(player){
        var player = game.client.addEntity("player", player);
       game.userlist.update();
       var callback = function(healthObj){
            game.userlist.storeGameHealthbar(healthObj)
       }
        me.game.world.addChild(new game.Healthbar(player, callback));
        me.game.world.addChild(new game.Score(player));
    });
    socket.on('spawnClientPlayer', function (player) {
        player.x = game.data.playerStartingX;
        game.client.addEntity("dummy_player", player);
        game.userlist.update();
    });

    socket.on('spawnZombie', function (enemy) {
        game.client.addEntity("zombie", enemy);
    });

    socket.on('removeClientPlayer', function (id) {
        var player = game.client.findEntityById(id);
        me.game.remove(player);
    });

    socket.on('updateClientOtherPlayerMovement', function (playerData) {
        var player = game.client.findEntityById(playerData.id);
        if (player) {
            player.move(playerData.x);
            player.updateMovement();
            player.pos.y = playerData.y;
        }
    });

    socket.on('updatePlayerMetaData', function (playerData) {
        var player = game.client.findEntityById(playerData.id);
        if (player) {
            player.health = playerData.health;
            player.score = playerData.score;
            if (!playerData.isAlive) {
                me.game.remove(player);
            }
        }
        game.userlist.update();
    });

    socket.on('createClientEntities', function (entites) {
        _.each(entites.players, function (p) {
            game.client.addEntity('dummy_player', p);
        });

        _.each(entites.zombies, function (z) {
            game.client.addEntity('zombie', z);
        });
    });


    socket.on('createClientBullet', function (bulletData) {
        game.client.addEntity("bullet", bulletData);
    });

    socket.on('currentPlayers', function (players) {
        _.each(players, function (p) {
            game.client.addEntity("dummy_player", p);
        });
    });
    socket.on('currentZombies', function (zombies) {
        _.each(zombies, function (z) {
            game.client.addEntity("zombie", z);
            console.log(z);
        });
    });

    socket.on('updateZombieMovement', function (z) {
        var where = {
            id: z.id,
            type: me.game.ENEMY_OBJECT
        }
        var zombie = _.findWhere(me.game.world.children, where);
        if (zombie) {
            zombie.move(z.x);
        }
    });

    socket.on('killClientZombie', function (zombieId) {
        var where = {
            id: zombieId,
            type: me.game.ENEMY_OBJECT
        }
        var zombie = _.findWhere(me.game.world.children, where);
        if (zombie) {
            me.game.remove(zombie);
        }
    });

};

game.client.sendBullet = function (bullet) {
    socket.emit('bulletFired', bullet);
};

game.client.sendMovement = function (position) {
    socket.emit('playerMovedPosition', position);
};

game.client.disconnect = function () {
    socket.emit('disconnect');
};

game.client.playerKilled = function (id) {
    socket.emit('playerKilled', id);
};

game.client.enemyKilled = function (id) {
    socket.emit('enemyKilled', id);
};


game.client.findEntityById = function (id) {
    var entity = _.find(me.game.world.children, function (child) {
        return child.id == id;
    });
    return entity;
}

game.client.addEntity = function (entityName, settings) {
    var entity = new me.entityPool.newInstanceOf(entityName, settings);
    me.game.add(entity, 20);
    me.game.sort();
    return entity;
};