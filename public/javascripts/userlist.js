game.userlist = game.userlist || {}
game.userlist.init = function(){
	this.healthbars = [];
    var team = new Team();
    this.teamView = new TeamView({
          collection: team
    });
};

game.userlist.storeGameHealthbar = function(healthbarObj){
	this.healthbars.push(healthbarObj)
}

game.userlist.calculateHealth = function(percent){
    	var colorLimit = 210;
    	var percentExtend = 0 + ((100-percent) * 4);
    	var halfWay = percentExtend >= colorLimit;
    	var r = !halfWay ? percentExtend : colorLimit;
    	var g = halfWay ?  (percent * 4): colorLimit;
    	var b = 0;
    	var rgb = 'rgb('+ r +',' + g +',' + b +')';
    	return rgb;
};

game.userlist.update = function () {
	if(this.healthbars){
		for(var i = 0; i < this.healthbars.length;i++){
			console.log("PLAYER UPDATE");
			this.healthbars[i].onPlayerUpdate();
		}
	}
    var children = _.where(me.game.world.children, {
        type: me.game.PLAYER_OBJECT
    });
    var that = this;
    _.each(children, function (player) {
        that.teamView.updatePlayerData(player);
    });
};

var Player = Backbone.Model.extend({});

var PlayerView = Backbone.View.extend({
    className: 'player',
    initialize: function () {
        _.bindAll(this, 'render', 'unrender', 'renderHealth', 'createStat');
        var that = this;
        this.model.on('change', function(){
        	that.render();
         });
    },
    render: function () {
    	this.$el.html(this.createPlayerStats());
        return this;
    },
    createPlayerStats: function(){
        this.createStat('playerScore', this.model.get('score'));
		this.createStat('playerName', this.model.get('name'));
		this.createStat('playerHealth', this.renderHealth(this.model.get('health')));
    },
    createStat: function (className, statContent) {
	    if (!$(this.el).find('div.'+className).length) {
	        $('<div/>', {
	            class: className
	        }).appendTo($(this.el)).html(statContent);
	    } else {
	        $(this.el).find('div.'+className).html(statContent);
	    }
	},
    unrender: function () {
        $(this.el).remove();
    },
    renderHealth: function(percent){
    	return $('<div/>', {
            class: 'healthbar'
        }).css({
        	'width': percent+"%",
        	'background-color':game.userlist.calculateHealth(percent)
        });
    }
});

var Team = Backbone.Collection.extend({
    model: Player
});

var TeamView = Backbone.View.extend({
    el: '#users',
    initialize: function () {
        _.bindAll(this, 'updatePlayerData', 'renderPlayer');
        this.collection.bind('add', this.renderPlayer); // collection event binder
        this._subviews = [];
    },
    updatePlayerData: function (playerEntity) {
    	var view = _(this._subviews).find(function(v){
    			return playerEntity.id == v.model.get('id');
    	});
    	if(view){
	    	view.model.set({
	            health: playerEntity.health,
	            score: playerEntity.score
	        });
	        view.render();
    		return;
    	}
        var playerModel = new Player();
        playerModel.set({
            id: playerEntity.id,
            name: playerEntity.name,
            health: playerEntity.health,
            score: playerEntity.score
        });
        this.collection.add(playerModel);
    },
    renderPlayer: function (player) {
        var playerView = new PlayerView({
            model: player
        });
        var playerHtml = playerView.render().el;
        $(this.el).html(playerHtml);
        this._subviews.push(playerView);
    }
});