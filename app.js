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

var zombies = [];
var players = [];
var zombieManager = {};
zombieManager.startSpawning = function () {
    setInterval(function () {
        var startPosition = _.random(1) === 1 ? 0 : 2000;
        while (players.length > 0 && zombies.length < (10 * players.length)) {
            zombieManager.spawnZombie(startPosition);
        }
        zombieManager.zombieAttack();
    }, 1000);
}
zombieManager.spawnZombie = function (startPosition) {
    var zombie = {
        id: uuid.v4(),
        x: startPosition,
        y: 393,
        velX: 1,
        spritewidth: 55,
        height: 55
    };
    zombies.push(zombie);
    io.sockets.emit('spawnZombie', zombie);
};

zombieManager.zombieAttack = function () {
    _.each(zombies, function (z) {
        var closest_player = _.min(players, function (p) {
            return Math.abs(p.x - z.x);
        });
        var distanceToTravel = _.random(30, 50)
        var closest_player_pos_x = closest_player.x;
        if (closest_player && closest_player.x !== z.x) {
            if (z.x < closest_player.x) {
                z.x += distanceToTravel * z.velX;
                z.walkLeft = false;
            } else {
                z.x -= distanceToTravel * z.velX;
                z.walkLeft = true;
            }
            if (intersects(closest_player, z)) {
                closest_player.health -= 1;
                if (closest_player.health <= 0) {
                    closest_player.health = 0;
                    closest_player.isAlive = false;
                }
                //  var sock_id = io.sockets.sockets[closest_player.id];
                //       io.sockets.sockets[sock_id].emit("updatePlayerMetaData", closest_player);
                io.sockets.emit("updatePlayerMetaData", closest_player);
            }
            io.sockets.emit('updateZombieMovement', z);
        }
    });
};

function intersects(player, zombie) {
    var playerx1 = player.x;
    var playerx2 = player.x + player.spritewidth;
    var zombiex1 = zombie.x;
    var zombiex2 = zombie.x + zombie.spritewidth;
    if (player.y < zombie.y) {
        return false;
    }
    if ((playerx1 >= zombiex1 && playerx1 <= zombiex2) || (playerx2 >= zombiex1 && playerx2 < zombiex2)) {
        return true;
    }
    return false;
}
zombieManager.startSpawning();

function detectCollision(bullet) {
    var bulletPathLength = 500;
    var bulletStartX = bullet['x'];
    var bulletStartY = bullet['y'];
    var bulletEndX = bullet['direction'] == 'r' ? bulletStartX + bulletPathLength : bulletStartX - bulletPathLength;
    var zombiesBetweenBullet = _.filter(zombies, function (z) {
        return Math.min(bulletStartX, bulletEndX) <= z['x'] && Math.max(bulletStartX, bulletEndX) >= z['x'] && (bulletStartY >= (z['y'] - z['height']));
    });
    if (zombiesBetweenBullet.length) {
        var closestZombieToBullet = _.min(zombiesBetweenBullet, function (z) {
            return Math.abs(bulletStartX - z.x);
        });
        if (closestZombieToBullet) {
            zombies = _.reject(zombies, function (z) {
                return closestZombieToBullet.id == z.id;
            });
            io.sockets.emit('killClientZombie', closestZombieToBullet.id);
            var playerWhoKilledZombie = _.find(players, function (p) {
                return bullet.playerId == p.id;
            });
            playerWhoKilledZombie.score += 10;
            io.sockets.emit('updatePlayerMetaData', playerWhoKilledZombie);
        }
    }
}

var SessionSockets = require('session.socket.io'),
    sessionSockets = new SessionSockets(io, sessionStore, cookieParser);
sessionSockets.on('connection', function (err, socket, session) {
    socket.on('init', function (name, callback) {
        sessionSockets.getSession(socket, function (err, session) {
            if (session) {
                var player = {
                    id: session.md.id,
                    x: 200,
                    velX : 3,
                    velY: 15,
                    name: session.md.name,
                    health: 100,
                    spritewidth: 65,
                    isAlive: true,
                    type: 'PLAYER',
                    score: 0,
                    y: 393
                }
                io.sockets.sockets[player.id] = socket.id;
                var sessionPlayer = _.find(players, function (p) {
                    return p.id == session.md.id;
                });
                if (!sessionPlayer) {
                    socket.broadcast.emit('spawnClientPlayer', player);
                    io.sockets.emit("updatePlayerMetaData", player);
                    socket.emit('createClientEntities', {
                        players: players,
                        zombies: zombies
                    });
                    players.push(player);
                }
                callback(player);
            };
        });

    });
    socket.on('bulletFired', function (bullet) {
        socket.broadcast.emit('createClientBullet', bullet);
        detectCollision(bullet);
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
            socket.broadcast.emit('updateClientOtherPlayerMovement', player);
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