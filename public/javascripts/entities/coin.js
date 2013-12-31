game.CoinEntity = me.CollectableEntity.extend({
	init : function(x, y, settings){
		this.parent(x, y, settings);
	},
	onCollision : function(){
		game.data.score += 250;
		this.collidable = false;
		me.game.remove(this);
	}
})