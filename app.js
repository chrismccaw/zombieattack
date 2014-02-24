/**
 * Module dependencies.
 */
var express = require('express');
routes = require('./routes'),
path = require('path'),
everyauth = require('everyauth'),
RedisStore = require('connect-redis')(express),
redis = require('redis').createClient(),
sessionStore = new RedisStore(),
conf = require('./node/conf'),
cookieParser = express.cookieParser('asddsfkjhs38975uy43tttsqldiu23joeey9834y58047yuopgppio5u6'),
facebook = require('./node/facebook_connection')
uuid = require('node-uuid'),
_ = require('underscore');

var app = express();

app.configure(function () {
    app.use(express.static(path.join(__dirname, '/public')));
    app.use(express.favicon());
    app.set('port', process.env.PORT || 3000);
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'jade');
    //json and urlencoded will be the body parser
    app.use(express.json());
    app.use(express.urlencoded());
    app.use(cookieParser);
    app.use(express.session({
        store: sessionStore
    }));
    app.use(everyauth.middleware());
    app.use(express.logger('dev'));
    app.use(app.router);
});

var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
app.get('/', routes.index);

server = server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});


var Game = function(){
    var init = function(){
        var zombies = new Array();
        var players = new Array();
        this.commonGameStore = {
            players : players,
            zombies : zombies,
            io : io
        }
    };
    var createZombieManager = function(){
        var ZombieManager = require("./node/zombie_manager");
        return new ZombieManager(commonGameStore);
    };
    var startSocketClient = function(zombieManager){
        var SessionSockets = require('session.socket.io');
        var sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
        var SocketClient = require('./node/socket_client');
        var socketClient = new SocketClient(commonGameStore, zombieManager, sessionSockets);
        socketClient.connect();
    };
    var start = function(){
        init();
        var zombieManager = createZombieManager();
        startSocketClient(zombieManager);
        zombieManager.startSpawning();
    }
    return {
        start : start
    }
}

var game = new Game();
game.start();

/*process.on('uncaughtException', function(err) {
  console.log(err);
});*/