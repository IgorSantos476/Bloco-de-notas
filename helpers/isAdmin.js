module.exports = {
	isAdmin: function(req, res, next) {
		if(req.isAuthenticated()) {
			return next();
		}

		req.flash("error", "Você precisa primeiro se logar ou criar uma conta antes de acessar o app");
		res.redirect('/usuarios/login');
	}
}