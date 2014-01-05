//play screens state such as title, game over, play area
game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
	me.levelDirector.loadLevel("area");
        game.data.health = 100;
        this.healthbar = new game.Healthbar.Container();
        me.game.world.addChild(this.healthbar);
        game.client.addEntity("player", {id: $('#user_id').val(),y:373});
        game.client.init();

},

	onDestroyEvent: function() {
	//components in the level like score, player kills etc
	}
});