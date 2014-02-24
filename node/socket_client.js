module.exports = SocketClient;

function SocketClient(commonGameStore, zombieManager, sessionSockets) {

    players = commonGameStore.players;
    zombies = commonGameStore.zombies;
    io = commonGameStore.io;
    var connect = function () {
        sessionSockets.on('connection', function (err, socket, session) {
            socket.on('init', function (name, callback) {
                sessionSockets.getSession(socket, function (err, session) {

                    if (session) {
                        // io.sockets.sockets[player.id] = socket.id;
                        var sessionPlayer = _.find(players, function (p) {
                            return p.id == session.md.id;
                        });
                        if (sessionPlayer) {
                            players.push(sessionPlayer);
                        } else {
                            var player = {
                                id: session.md.id,
                                x: 200,
                                velX: 3,
                                velY: 15,
                                name: session.md.name,
                                health: 100,
                                spritewidth: 65,
                                isAlive: true,
                                type: 'PLAYER',
                                score: 0,
                                y: 393
                            }
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
                zombieManager.detectCollision(bullet);
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
    }

    return {
        connect: connect
    }

}