//play screens state such as title, game over, play area
game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
	me.levelDirector.loadLevel("area");
        game.data.score = 0;
        game.client.addEntity("player", 150, 350);
        game.client.init();
},

	onDestroyEvent: function() {
	//components in the level like score, player kills etc
	}
});