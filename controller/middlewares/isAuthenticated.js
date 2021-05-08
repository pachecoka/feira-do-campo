module.exports = {
    isAuthenticated: function(req, res, next) {
        if(req.isAuthenticated()){
            return next();
        }
        req.flash("error", "Você precisa realizar login");
        res.redirect("/login");
    },

    isProdutor: function(req, res, next) {
        if(req.isAuthenticated() && req.user.isProdutor){
            return next();
        }
        req.flash("error", "Você precisa ser um produtor");
        res.redirect("/");
    }
}