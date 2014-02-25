var game = {
	onload : function(){
		me.device.getPixelRatio = function(){
			return 0;
		}
		if(!me.video.init("game", this.data.width, this.data.height,false,1,false)){
			alert('You browser does not support HTML5 canvas');
			return;
		}


		//When loaded callback (this.loaded) is executed
		me.sys.pauseOnBlur = false;
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(game.resources);
		me.state.change(me.state.LOADING);
		game.userlist.init();
	},
	loaded : function(){
		me.game.BULLET_OBJECT = 'BULLET';
		me.game.PLAYER_OBJECT = 'PLAYER';
		//sets the states (title and play) and changes to the PLAY state
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		//storage of all entities. Used as object pool for each class. 
		//That way garbage collection is going to be reduced, since objects are going to be reused
		me.entityPool.add('player', game.PlayerEntity);
		me.entityPool.add("dummy_player", game.DummyPlayerEntity);
		me.entityPool.add("zombie", game.EnemyEntity);
		me.entityPool.add("bullet", game.BulletEntity);
		//key binding
		me.input.bindKey(me.input.KEY.Z, 'shoot');
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');
		me.input.bindKey(me.input.KEY.X, 'jump', true);
		me.state.change(me.state.PLAY);
	}
}

window.onReady(function onReady(){
	game.data = {
		width: $("#game").width(),
		height: 400,
		score : 0,
		display_value_size: 50,
		health: 100,
		baseY: 393,
		playerStartingX: 100
	}
	game.onload();
});

$( window ).unload(function() {
  	game.client.disconnect();
});
