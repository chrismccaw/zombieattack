module.exports = function (players, zombies, io) {

    startSpawning = function () {
        setInterval(function () {
            var startPosition = _.random(1) === 1 ? 0 : 2000;
            while (players.length > 0 && zombies.length < (10 * players.length)) {
                spawnZombie(startPosition);
            }
            zombieAttack();
        }, 1000);
    };

    spawnZombie = function (startPosition) {
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

    zombieAttack = function () {
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

    intersects = function (player, zombie) {
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
    };

    detectCollision = function (bullet) {
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
    };

    return {
    	startSpawning : startSpawning,
    	detectCollision : detectCollision
    };
}