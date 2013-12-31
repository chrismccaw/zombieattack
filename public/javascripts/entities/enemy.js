game.EnemyEntity = me.ObjectEntity.extend({
	init: function(x, y){
		var settings = {
			 image: 'zombie_right', spritewidth: 32, height:32
		}
		this.parent(x, y, settings);
		this.collidable = true;
		this.startX = x;
		this.pos.x = x + 100 - settings.spritewidth;
		this.endX = x + 100 - settings.spritewidth;
		this.walkLeft = true;
		this.setVelocity(1, 10);
		this.type = me.game.ENEMY_OBJECT;
	},
	onCollision: function(res, obj) {
        if (obj.type === me.game.BULLET_OBJECT) {
            me.game.remove(this);
            me.game.remove(obj);
        }
    },
	update: function(res, obj){
		if(!this.inViewport)
			return false;
		if(this.alive){
			if(!this.walkLeft && this.pos.x > this.endX){
				this.walkLeft = true;
			}
			this.flipX(this.walkLeft);
			this.vel.x += -this.accel.x * me.timer.tick;
		}else {
			this.vel.x = 0;
		}
		this.updateMovement();
		if(this.vel.x !=0 || this.vel.y != 0){
			this.hasStopped = false;
			this.parent();
			return true;
		}
		this.hasStopped = true;
		var res = me.game.collide(this);
		if(res && (res.obj.type == me.game.ENEMY_OBJECT)){
			this.vel.y = -this.maxVel.y;
		}
		return false;
	}
});