game.client = {};

var socket = io.connect('http://localhost:3000');

game.client.init = function () {


    socket.emit('init', $('#session_hacks').val());
    socket.on('spawnPlayer',function(player){
    	game.client.addEntity("player", {id: player.id,x:150, y:350, name: player.name});
    });

    socket.on('spawnEnemy', function(enemy){
    	game.client.addEntity("enemy", {id:enemy.id, x: enemy.x, y:350});
    });
    
    socket.on('currentPlayers', function(players){
        _.each(players, function(player){
        
        
        });
    });

    socket.on('updatePlayerData', function(playerData){
        var player = _.find(me.game.world.children, function(child){
            return child.id == playerData.id;
        });
        player.pos.x = playerData.x;
        player.pos.y = playerData.y;
    });

    socket.on('createClientBullet', function(bulletData){
        game.client.addEntity("bullet", bulletData);
    });

    socket.on('updateZombieMovement', function(z){
        var where = {
            id: z.id,
            type: me.game.ENEMY_OBJECT
        }
        var zombie = _.findWhere(me.game.world.children, where);
        if(zombie){
            zombie.endX = z.x;
            zombie.endY = z.y;
        }
/*        var enemies = _.each(me.game.world.children, function(child){
                if(child.type == me.game.ENEMY_OBJECT && _.contains(zombieIds, child.id)){
                    console.log(child);
                    enemies.flipX(true);
                }
        });*/
    });
};

game.client.sendBullet = function(bullet){
    socket.emit('bulletFired', bullet);
};

game.client.sendMovement = function(data){
    socket.emit('playerMovedPosition', data);
};
    game.client.addEntity = function(entityName, settings){
	    var entity = new me.entityPool.newInstanceOf(entityName, settings);
	    me.game.add(entity, 20);
	    me.game.sort();
    };