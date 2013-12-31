
/*
 * GET home page.
 */

exports.index = function(req, res){
	console.log("LOGGED IN?");
	console.log(req.loggedIn);
	if(req.loggedIn) {
		res.render('index', { player_name: req.user.name });
	}else{
		res.render('login', { title: 'zombie runner' });
	}
};