game.client = {};

game.client.init = function () {


    var socket = io.connect('http://localhost:3000');
    socket.emit('init', $('#session_hacks').val());
    socket.on('spawnPlayer',function(player){
    	game.client.addEntity("player", 150, 350);
/*	    var player = new me.entityPool.newInstanceOf("player", 150 + 100, 350);
	    me.game.add(player, 20);
	    me.game.sort();*/
    });
    socket.on('spawnEnemy', function(enemy){
    	console.log('spawn enemy');
    	game.client.addEntity("enemy",  150 + 50, 350);
/*    	var enemy = new me.entityPool.newInstanceOf("enemy", 150 + (i * 50), 350);
        me.game.add(enemy, 10);
        me.game.sort();*/
    });
/*    for (var i = 0; i < 3; i++) {
    	 game.client.addEntity("enemy",  150 + (i * 50), 350);
        var enemy = new me.entityPool.newInstanceOf("enemy", 150 + (i * 50), 350);
        me.game.add(enemy, 10);
        me.game.sort();
    }
*/
}
    game.client.addEntity = function(entityName, x, y){
	    var entity = new me.entityPool.newInstanceOf(entityName, x, y);
	    me.game.add(entity, 20);
	    me.game.sort();
    }