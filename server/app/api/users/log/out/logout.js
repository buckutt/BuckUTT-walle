var logout = module.exports;

var dependency = null;


logout.logout = function(container){
    dependency = container;

    /*
        Logout user
    */
    dependency.app.get("/api/users/log/out/id=:id", function(req, res){
        var status = {logged: false};

        var user = dependency.users.getUserById(req.params.id);

        if ((user != null) && (user.logged == true)){
            if (user.inst > 0){
                user.inst--;
            }
            if (user.inst == 0){
                user.logged = false;
                res.json({logged: false});
            }
        }
        else{
            //Not swiped or not logged in
            res.json({error: "User not registered"});
        }
    })

    ;
}