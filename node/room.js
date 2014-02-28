module.exports = Room;

function Room(id, socketData){
	this.id = id;
	this.socketData = socketData;
	var init = function(){
        var zombies = new Array();
        var players = new Array();
        this.commonGameStore = {
            players : players,
            zombies : zombies,
            io : socketData.io
        }
    };

    var createZombieManager = function(){
        var ZombieManager = require("./zombie_manager");
        return new ZombieManager(commonGameStore);
    };

    var startSocketClient = function(zombieManager){
        var SessionSockets = require('session.socket.io');
        var sessionSockets = new SessionSockets(socketData.io, socketData.sessionStore, socketData.cookieParser);
        var SocketClient = require('./socket_client');
        var socketClient = new SocketClient(commonGameStore, zombieManager, sessionSockets);
        socketClient.connect();
    };

    var start = function(){
        init();
        var zombieManager = createZombieManager();
        startSocketClient(zombieManager);
        zombieManager.startSpawning();
    };

	this.getId = function(){
		return this.id;
	};

	this.getPlayers = function(){
		return this.commonGameStore.players;
	};

	this.addPlayer = function(player){
		this.playersInRoom.push(player);
	};

	return  {
		beginGame : start
	}
}