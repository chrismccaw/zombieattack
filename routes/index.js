
/*
 * GET home page.
 */

exports.index = function(req, res){
	if(req.loggedIn) {
		res.render('index', { id: req.session.md.id});
	}else{
		res.render('login', { title: 'zombie runner' });
	}
};