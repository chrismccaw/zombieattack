game.EnemyEntity = me.ObjectEntity.extend({
    init: function (enemy_data) {
        var settings = {
            image: 'zombie_right',
            spritewidth: 55,
            height: 55
        }
        var x = enemy_data.x;
        var y = game.data.baseY;
        this.id = enemy_data.id;
        this.parent(x, y, settings);
        this.collidable = true;
        this.pos.x = x;
        this.walkLeft = false;
        this.setVelocity(Math.random() * 2, 15);
        this.type = me.game.ENEMY_OBJECT;
        this.alwaysUpdate = true;
    },
    onCollision: function (res, obj) {
        if (obj.type === me.game.BULLET_OBJECT) {
            me.game.remove(this);
            me.game.remove(obj);
            game.client.enemyKilled(this.id);
        }
    }
});