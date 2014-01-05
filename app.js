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
        x: 0,
        y: 393,
        spritewidth: 55
    };
    zombies.push(zombie);
    io.sockets.emit('spawnZombie', zombie);
};

zombieManager.zombieAttack = function () {
    console.log("players length " + players);
    _.each(zombies, function (z) {
        var closest_player = _.min(players, function (p) {
            return Math.abs(p.x - z.x);
        });
        console.log(closest_player);
        if (closest_player && closest_player.x !== z.x) {
            if (z.x < closest_player.x) {
                z.x += 10;
                z.walkLeft = false;
            } else {
                z.x += -10;
                z.walkLeft = true;
            }
            if (intersect(closest_player, z)) {
                closest_player.health -= 5;
                if(closest_player.health <= 0){
                    closest_player.isAlive = false;
                }
                var sock_id = io.sockets.sockets[closest_player.id];
                io.sockets.sockets[sock_id].emit("updatePlayerData", closest_player);
            }
            io.sockets.emit('updateZombieMovement', z);
        }
    });
};

function intersect(player, zombie) {
    var playerx1 = player.x;
    var playerx2 = player.x + player.spritewidth;
    var zombiex1 = zombie.x;
    var zombiex2 = zombie.x + zombie.spritewidth;
    console.log(player.y + " " +  zombie.y);
    if(player.y <  zombie.y){
        return false;
    }

    if ((playerx1 >= zombiex1 && playerx1 <= zombiex2) || (playerx2 >= zombiex1 && playerx2 < zombiex2)) {
        return true;
    }
    return false;
}
zombieManager.startSpawning();


var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
sessionSockets.on('connection', function (err, socket, session) {
    socket.on('init', function () {
        sessionSockets.getSession(socket, function (err, session) {
            if (session) {
                var player = {
                    id: session.md.id,
                    name: session.md.name,
                    health: 100,
                    spritewidth: 65,
                    isAlive: true
                }
                io.sockets.sockets[player.id] = socket.id;
                var sessionPlayer = _.find(players, function (p) {
                    return p.id == session.md.id;
                });
                if (!sessionPlayer) {
                   socket.broadcast.emit('spawnClientPlayer', player);
                    /*
                    send zombie and player data together
                    */
                    //socket.emit('currentPlayers', players);
                    //    socket.emit('currentZombies', zombies);
                    socket.emit('createClientEntities', {players: players, zombies:zombies});
                    players.push(player);
                }

            };
        });
    });
    socket.on('bulletFired', function (bullet) {
        socket.broadcast.emit('createClientBullet', bullet);
    });

    socket.on('disconnect', function () {
        sessionSockets.getSession(socket, function (err, session) {
            players = _.reject(players, function (z) {
                return z.id == session.md.id;
            });
        });
        socket.broadcast.emit('removeClientPlayer', session.md.id);
    });

    socket.on('playerMovedPosition', function (playerData) {
        var player = _.find(players, function (p) {
            return playerData.id == p.id;
        });
        if (player) {
            player.x = playerData.x;
            player.y = playerData.y;
            socket.broadcast.emit('updateClientOtherPlayerData', player);
        }
    });

    socket.on('enemyKilled', function (id) {
        zombies = _.reject(zombies, function (z) {
            return z.id == id;
        });
    });

    socket.on('playerKilled', function (id) {
        players = _.reject(players, function (p) {
            return p.id == id;
        });
        socket.broadcast.emit('removeClientPlayer', id);
    });
});

/*process.on('uncaughtException', function(err) {
  console.log(err);
});*/