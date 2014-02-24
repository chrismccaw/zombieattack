// game.Healthbar = game.Healthbar || {};

// game.Healthbar = game.Display.Container.extend({
// 	init: function(player){
// 		this.parent(player,10,10);
// 	}
// });


game.Healthbar = game.Healthbar || {};

game.Healthbar = me.ObjectContainer.extend({
	init: function(player, callback){
		this.parent();
		this.isPersistant = true;
		this.collidable = false;
		this.z = Infinity;
		this.invalidate = false;
		this.addChild(new game.Healthbar.display(player,callback));
	}
});

 game.Healthbar.display = me.Renderable.extend({
 	init: function(player, callback){
 		this.parent(new me.Vector2d(20,20),400,30);
 		this.player = player;
 		this.floating = true;
 		callback(this);
 	},
 	onPlayerUpdate: function(){
 		this.invalidate = true;
 	},
 	update: function(){
 		if(this.invalidate === true){
 			this.invalidate = false;
 			return true;
 		}
 		return false;
 	},
 	draw: function(context){
 		context.fillStyle = 'black';
 		context.fillRect(this.left, this.top, this.width, this.height);
 		var percent = this.player.health;

 		context.fillStyle =  game.userlist.calculateHealth(percent);
		context.fillRect(this.left, this.top, (this.width/100)*percent, this.height);
 	}
 });
