var users = module.exports;

users.userlist = [];


users.users = function (app){
	app.get("/api/users/data=:data&meanOfLogin=:meanOfLogin&point_id=:point_id", function(req, res){

		//TODO mysql query
		var user = {
			id: 1,
			passwd: "salut",
			firstname: "Youainn",
			lastname: "Piolet",
			nickname: "Secrépute",
			mail: "admin@brazzers.com",
			credit: 12,
			img_id: 1,
			temporary: 0,
			fail_auth: 0,
			blocked: 0,
			point_id: 0,
			logged: false
		};

		users.userlist.push(user);

		//send only useful information
		res.json({
			id: user.id,
			firstname: user.firstname,
			lastname: user.lastname,
			credit: user.credit,
			img_id: user.img_id,
			temporary: user.temporary
		});
	})

	.get("/api/users/login/id=:id&pwd=:pwd", function(req, res){
		var status = {logged: false};
		var user = users.userlist.filter(function(obj){
			if (obj.id == req.params.id){
				return obj
			}
		})[0];

		if (user != null){
			//TODO mysql query
			var logged = true;

			if(logged){
				user.logged = true;
				status.logged = true;
			}
		}
		res.json(status);
	})

	;
};

