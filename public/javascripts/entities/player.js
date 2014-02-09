game.PlayerEntity = me.ObjectEntity.extend({
	init : function(player_data){
		var settings = {
			image: "soldier_right",
			spriteheight: 55,
			spritewidth: 65
		};
		this.parent(player_data.x, player_data.y, settings);
		for(k in player_data) this[k] = player_data[k];
		this.setVelocity(player_data.velX, player_data.velY);
		this.updateColRect(8, 48, -1, 0);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
		this.direction = 'r';
		this.lastTick = 0;
		this.type = me.game.PLAYER_OBJECT;
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
				var bulletData = {x: this.pos.x + 20, y: this.pos.y+16, direction: this.direction, playerId:this.id};
				game.client.addEntity("bullet", bulletData);
            	game.client.sendBullet(bulletData);
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
			game.client.sendMovement({id: this.id, x: this.pos.x, y: this.pos.y});
			this.parent();
			return true;
		}
		return false;
	},
	onDestroyEvent: function(){
		game.client.playerKilled(this.id);
	}
});