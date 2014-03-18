var login = module.exports;

var dependency = null;


login.login = function(container){
    dependency = container;


    /*
        Check user PIN
    */
    dependency.app.get("/api/users/log/in/id=:id&pwd=:pwd", function(req, res){
        var status = {logged: false};

        var user = dependency.users.getUserById(req.params.id);

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