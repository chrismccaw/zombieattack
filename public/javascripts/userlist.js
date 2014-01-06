game.userlist = game.userlist || {}
game.userlist.update = function(){
	var children = _.where(me.game.world.children, {type:  me.game.PLAYER_OBJECT});
	users = "";
	//Just a quick ugly solution to get the player data to display
	_.each(children, function(player){
		users += "<p>";
		users += "<br />" + player.name;
		users += "<br /> Health - " + player.health;
		users += "<br /> Score - " + player.score;
		users += "</p>";
	});
	$('#users').html(users);
}