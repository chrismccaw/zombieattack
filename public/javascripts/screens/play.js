//play screens state such as title, game over, play area
game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
	me.levelDirector.loadLevel("area");
/*        var player = game.client.addEntity("player", {id: $('#user_id').val(),y:373});
        me.game.world.addChild(new game.Healthbar(player));
        me.game.world.addChild(new game.Score(player));*/
        game.client.init();

},

	onDestroyEvent: function() {
	//components in the level like score, player kills etc
	}
});