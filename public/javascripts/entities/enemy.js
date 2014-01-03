game.EnemyEntity = me.ObjectEntity.extend({
    init: function (enemy_data) {
        var settings = {
            image: 'zombie_right',
            spritewidth: 55,
            height: 55
        }
        var x = enemy_data.x;
        var y = enemy_data.y;
        this.id = enemy_data.id;
        this.parent(x, y, settings);
        this.collidable = true;
        this.startX = x;
        this.pos.x = x + 100 - settings.spritewidth;
        this.walkLeft = true;
        this.setVelocity(Math.random() * 2, 10);
        this.type = me.game.ENEMY_OBJECT;
        this.alwaysUpdate = true;
    },
    onCollision: function (res, obj) {
        if (obj.type === me.game.BULLET_OBJECT) {
            me.game.remove(this);
            me.game.remove(obj);
        }
    },
    update: function (res, obj) {
        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(this.walkLeft);
            this.vel.x += (this.walkLeft) ? -this.accel.x * me.timer.tick : this.accel.x * me.timer.tick;
        } else {
            this.vel.x = 0;
        }
        this.updateMovement();
        if (this.vel.x != 0 || this.vel.y != 0) {
            this.parent();
            return true;
        }
        var res = me.game.collide(this);
        return false;
    }
});