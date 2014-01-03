game.BulletEntity = me.ObjectEntity.extend({
	init: function(bulletData) {
		var settings = {
			 image: 'bullet', spritewidth: 10
		}
		var x = bulletData.x;
		var y = bulletData.y;
		this.parent(x, y, settings);
		this.collidable = true;
		this.endX = x + 500 - settings.spritewidth;
		this.gravity = 0;
		this.direction = bulletData.direction;
		me.game.BULLET_OBJECT = 'BULLET';
		this.type = me.game.BULLET_OBJECT;
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
	    var updated = (this.vel.x!=0 || this.vel.y!=0);
	    if(!updated)
	    	me.game.remove(this);
	    return true;
	},
});
