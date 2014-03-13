var logout = module.exports;


logout.logout = function(app, users){
    /*
        Logout user
    */
    app.get("/api/users/log/out/id=:id", function(req, res){
        var status = {logged: false};

        var user = users.getUserById(req.params.id);

        if ((user != null) && (user.logged == true)){
           user.logged = false;
           res.json({logged: false});
        }
        else{
            //Not swiped or not logged in
            res.json({error: "User not registered"});
        }
    })

    ;
}