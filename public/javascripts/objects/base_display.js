game.Display = game.Display || {};

game.Display.Container = me.ObjectContainer.extend({
	init: function(player, x, y, displayObject, autoAdjust){
		this.parent();
		this.isPersistant = true;
		this.collidable = false;
		this.z = Infinity;
		this.name = name;
		this.addChild(new game.Display.baseDisplay(player, x,y, displayObject, autoAdjust));
	}
});

 game.Display.baseDisplay = me.Renderable.extend({
 	init: function(player, x,y, displayObject, autoAdjust){
 		this.parent(new me.Vector2d(x,y),10,10);
 		this.player = player;
 		this.font = new me.BitmapFont("32x32_font", 32);
 		this.floating = true;
 		this.font.set("left");
 		this.displayObject = displayObject;
 		this.displayValue = -1;
 		this.autoAdjust = autoAdjust;

 	},
 	update: function(){
		if(this.autoAdjust && this.displayValue){
			var space = game.data.display_value_size * ((this.displayValue+"").length);
			this.pos.x  =  game.data.width - space;
		}
 		if(this.displayValue !== this.player[this.displayObject]){
 			this.displayValue = this.player[this.displayObject];
 			return true;
 		}
 		return false;

 	},
	draw: function(context){
		this.font.draw(context, this.displayValue, this.pos.x, this.pos.y);
	}
 });
