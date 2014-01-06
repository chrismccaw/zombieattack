game.Score = game.Score || {};

game.Score = game.Display.Container.extend({
	init: function(player){
		this.parent(player,game.data.width,10, "score", true);
	}
});