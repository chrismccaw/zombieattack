game.PlayerEntity = me.ObjectEntity.extend({
	init : function(x, y){
		var settings = {
			image: "soldier_right",
			spriteheight: 55,
			spritewidth: 65
		};
		this.parent(x, y, settings);
		this.setVelocity(3,15);
		this.updateColRect(8, 48, -1, 0);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		this.direction = 'r';
		this.lastTick = 0;
	},
	update: function(){
		if(me.input.isKeyPressed('left')){
			//flip sprite image
			this.flipX(true);
			this.vel.x -= this.accel.x * me.timer.tick;
			this.direction = 'l';
		}else if(me.input.isKeyPressed('right')){
			this.flipX(false);
			this.vel.x += this.accel.x * me.timer.tick;
			this.direction = 'r';
		}else {
			this.vel.x = 0;
		}
		if(me.input.isKeyPressed('jump')){
			if(!this.jumping && !this.falling){
				this.vel.y = -this.maxVel.y * me.timer.tick;
				this.jumping = true;
			}
		}
		if(me.input.isKeyPressed('shoot')){
			if(this.lastTick + 350 < me.timer.getTime()){
				this.lastTick = me.timer.getTime();
				var shot = new me.entityPool.newInstanceOf("bullet", this.pos.x + 20, this.pos.y+16, this.direction);
            	me.game.add(shot, this.z);
            	me.game.sort();
        	}
		}
		//handle the player movement, "trying" to update his position
		this.updateMovement();
		var res = me.game.collide(this);
		if(res){
			if(res.obj.type == me.game.ENEMY_OBJECT){
				if((res.y > 0) && !this.jumping){
					this.falling = false;
					this.vel.y = -this.maxVel.y * me.timer.tick;
					this.jumping = true;
				}else {
					this.renderable.flicker(45);
				}
			}
		}
		if(this.vel.x != 0 || this.vel.y != 0){
			this.parent();
			return true;
		}
		return false;
	}
});