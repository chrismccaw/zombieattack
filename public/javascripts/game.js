window.onReady(function onReady(){
	game.onload();
});

var game = {
	data : {
		score : 0,
		left : 'LEFT',
		right: 'RIGHT'
	},
	onload : function(){
		if(!me.video.init("screen", 540,380,true)){
			alert('You browser does not support HTML5 canvas');
			return;
		}
		//When loaded callback (this.loaded) is executed
		me.loader.onload = this.loaded.bind(this);
		me.loader.preload(game.resources);
		me.state.change(me.state.LOADING);
	},
	loaded : function(){
		//sets the states (title and play) and changes to the PLAY state
		me.state.set(me.state.MENU, new game.TitleScreen());
		me.state.set(me.state.PLAY, new game.PlayScreen());
		//storage of all entities. Used as object pool for each class. 
		//That way garbage collection is going to be reduced, since objects are going to be reused
		me.entityPool.add('player', game.PlayerEntity);
		me.entityPool.add('coin', game.CoinEntity);
		me.entityPool.add("enemy", game.EnemyEntity);
		me.entityPool.add("bullet", game.BulletEntity);
		//key binding
		me.input.bindKey(me.input.KEY.Z, 'shoot');
		me.input.bindKey(me.input.KEY.LEFT, 'left');
		me.input.bindKey(me.input.KEY.RIGHT, 'right');
		me.input.bindKey(me.input.KEY.X, 'jump', true);
		me.state.change(me.state.PLAY);
	}
}