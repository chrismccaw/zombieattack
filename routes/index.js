
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.loggedIn) {
		res.render('index', { session_id: req.session.id });
	}else{
		res.render('login', { title: 'zombie runner' });
	}
};