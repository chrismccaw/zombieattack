//play screens state such as title, game over, play area
game.PlayScreen = me.ScreenObject.extend({
	onResetEvent: function() {	
		me.levelDirector.loadLevel("area");
        game.data.score = 0;
                        var player = new me.entityPool.newInstanceOf("player",150+100, 350);
                me.game.add(player, 20);
                me.game.sort();
        for(var i =0; i < 3;i++){
                var enemy = new me.entityPool.newInstanceOf("enemy",150+(i*50), 350);
                me.game.add(enemy, 10);
                me.game.sort();
        }
	},

	onDestroyEvent: function() {
	//components in the level like score, player kills etc
	}
});