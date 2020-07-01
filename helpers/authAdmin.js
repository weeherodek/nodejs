module.exports = {
    authAdmin: function(req,res,next){

        if(req.isAuthenticated() && req.user.admin == true){
            return next()
        }
        req.flash("error_msg", "Faça seu login para acessar essa página !")
        res.redirect("/")
    
    }

}