game.BulletEntity = me.ObjectEntity.extend({
	init: function(x, y, direction) {
		var settings = {
			 image: 'bullet', spritewidth: 12
		}
		this.parent(x, y, settings);
		this.collidable = true;
		this.endX = x + 500 - settings.spritewidth;
		this.gravity = 0;
		this.direction = direction;
		me.game.BULLET_OBJECT = 'BULLET';
		this.type = me.game.BULLET_OBJECT;
	},
	onCollision: function(res, obj) {
		console.log("TYPE " + res.type);
        if (res.type === me.game.ENEMY_OBJECT) {
            me.game.remove(this);
        }
    },
	update: function () {
	    if (!this.visible || this.pos.x > this.endX) {
	        // remove myself if not on the screen anymore
	        me.game.remove(this);
	        return false;
	    }
	    if(this.direction === 'l'){
	    	this.vel.x = -12;
	    }
	    if(this.direction === 'r'){
	    	this.vel.x = 12;
	    }
	    this.updateMovement();
	    var res = me.game.collide(this);
	    console.log("update");
	    return true;
	}
});
