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
 		this.floating = true;
 		this.displayObject = displayObject;
 		this.displayValue = -1;
 		this.autoAdjust = autoAdjust;
 		this.pos.x = 455;

 	},
 	update: function(){
/*		if(this.autoAdjust && this.displayValue){
			var space = game.data.display_value_size * ((this.displayValue+"").length);
			console.log(space);
			this.pos.x  =  game.data.width -space;
			console.log("score "+this.pos.x);
		}*/
 		if(this.displayValue !== this.player[this.displayObject]){
 			this.displayValue = this.player[this.displayObject];
 			return true;
 		}
 		return false;

 	},
	draw: function(context){
		//this.font.draw(context, this.displayValue, this.pos.x, this.pos.y);
      context.font = '20px Calibri bold';
      context.fillStyle = 'white';
      context.fillText(this.displayValue, this.pos.x, this.pos.y);
	}
 });
