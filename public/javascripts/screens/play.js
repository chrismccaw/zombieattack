//play screens state such as title, game over, play area
game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
	me.levelDirector.loadLevel("area");
        game.data.score = 0;
        game.client.addEntity("player", {id: $('#user_id').val(),x:0, y:373});
        game.client.init();
},

	onDestroyEvent: function() {
	//components in the level like score, player kills etc
	}
});