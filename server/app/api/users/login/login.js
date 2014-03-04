var login = module.exports;


login.login = function(app, users){
    /*
        Check user PIN
    */
    app.get("/api/users/login/id=:id&pwd=:pwd", function(req, res){
        var status = {logged: false};

        var user = users.getUserById(req.params.id);

        if (user != null){
            //TODO hash password
            if (user.password == req.params.pwd){
                user.logged = true;
                status.logged = true;
            }
            res.json(status);
        }
        else{
            //Not swiped
            res.json({error: "User not registered"});
        }
    })

    ;
}