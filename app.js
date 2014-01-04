/**
 * Module dependencies.
 */
var express = require('express');
routes = require('./routes'),
user = require('./routes/user'),
path = require('path'),
everyauth = require('everyauth'),
RedisStore = require('connect-redis')(express),
redis = require('redis').createClient(),
sessionStore = new RedisStore(),
conf = require('./node//conf'),
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
//app.get('/users', user.list);

server = server.listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});

var zombies = [];
var players = [];


var zombieManager = {};
zombieManager.startSpawning = function () {
    setInterval(function () {
        while (players.length > 0 && zombies.length < 10) {
            zombieManager.spawnZombie();
        }
        zombieManager.zombieAttack();
    }, 1000);
}
zombieManager.spawnZombie = function () {
    var zombie = {
        id: uuid.v4(),
        x: 0
    };
    zombies.push(zombie);
    io.sockets.emit('spawnEnemy', zombie);
};

zombieManager.zombieAttack = function () {
    _.each(zombies, function (z) {
        var closest_player = _.min(players, function (p) {
            return Math.abs(p.x - z.x);
        });
        if (closest_player && closest_player.x !== z.x) {
            z.x = closest_player.x;
            z.y = closest_player.y;
            io.sockets.emit('updateZombieMovement', z);
        }
    });
};
zombieManager.startSpawning();
var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
sessionSockets.on('connection', function (err, socket, session) {
    socket.on('init', function () {
        sessionSockets.getSession(socket, function (err, session) {
            if (session) {
                var player = {
                    id: session.md.id,
                    name: session.md.name
                }
                socket.broadcast.emit('spawnPlayer', player);
                socket.emit('currentPlayers', players);
            //    socket.emit('currentZombies', zombies);
                players.push(player);
            };
        });
    });
    socket.on('bulletFired', function (bullet) {
        socket.broadcast.emit('createClientBullet', bullet);
    });

    socket.on('enemyKilled', function (enemyData) {
        zombies = _.reject(zombies, function (z) {
            return z.id == enemyData.id;
        })
        // socket.broadcast.emit('rejectEnemy', enemydata);
    });

    socket.on('playerMovedPosition', function (playerData) {
        console.log(playerData);
        var player = _.find(players, function (p) {
            return playerData.id == p.id;
        });
        if(player){
            player.x = playerData.x;
            player.y = playerData.y;
            socket.broadcast.emit('updatePlayerData', player);
        }
    });

});