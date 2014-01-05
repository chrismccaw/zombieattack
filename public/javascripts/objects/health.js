game.Healthbar = game.Healthbar || {};

game.Healthbar.Container = me.ObjectContainer.extend({
	init: function(){
		this.parent();
		this.isPersistant = true;
		this.collidable = false;
		this.z = Infinity;
		this.name = "health";
		this.addChild(new game.Healthbar.health(10,10));
	}
});

 game.Healthbar.health = me.Renderable.extend({
 	init: function(x,y){
 		this.parent(new me.Vector2d(x,y),10,10);
 		this.font = new me.BitmapFont("32x32_font", 32);
 		this.floating = true;
 		this.font.set("left");
 		this.health = -1;

 	},
 	update: function(){
 		if(this.health !== game.data.health){
 			this.health = game.data.health;
 			return true;
 		}
 		return false;

 	},
	draw: function(context){
		this.font.draw(context, game.data.health, this.pos.x, this.pos.y);
	}
 })