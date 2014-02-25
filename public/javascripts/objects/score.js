game.Score = game.Score || {};

game.Score = game.Display.Container.extend({
	init: function(player){
		this.parent(player,game.data.width-120,25, "score", true);
	}
});