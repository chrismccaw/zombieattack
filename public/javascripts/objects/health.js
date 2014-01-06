game.Healthbar = game.Healthbar || {};

game.Healthbar = game.Display.Container.extend({
	init: function(player){
		this.parent(player,10,10, "health");
	}
});