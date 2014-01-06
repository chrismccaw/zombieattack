
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.loggedIn) {
		res.render('index');
	}else{
		res.render('login');
	}
};