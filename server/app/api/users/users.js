var async = require('async');
var users = module.exports;


users.userlist = [];


users.getUserById = function(id){
	var user = null;

	users.userlist.filter(function(obj){
		if (obj.id == id){
			user = obj;
		}
	});
	return user;
};


/*
	1: bloqueur
	2: fund treso
	4: reloader
	5: buckutt admin
	6: fundation chief
	7: buckutt treso
	8: credit admin
	9: point admin
	10: sell admin
	11: seller /!\
	13: fundation admin
	14: group editor
	15: manual mode
*/
users.checkRights = function(userId, right_id, point_id, fun_id){
	if (!point_id) point_id = 0;
	if (!fun_id) fun_id = 0;

	var user = users.getUserById(userId);
	var data = {
		hasRight: false,
		admin: false
	}
	if (!user) return data;

	user.rights.filter(function(right){
		if ((point_id) && (fun_id)){
			if ((right.fun_id == fun_id) && (right.poi_id == point_id) && (right.rig_id == right_id)){
				data.hasRight = true;

				if (right.rig_admin){
					data.admin = true;
				}				
			}

		}
		else if (point_id){
			if ((right.poi_id == point_id) && (right.rig_id == right_id)){
				data.hasRight = true;

				if (right.rig_admin){
					data.admin = true;
				}
			}
		}
		else if (fun_id){
			if ((right.fun_id == fun_id) && (right.rig_id == right_id)){
				data.hasRight = true;

				if (right.rig_admin){
					data.admin = true;
				}
			}
		}
		else{
			if (right.rig_id == right_id){
				data.hasRight = true;

				if (right.rig_admin){
					data.admin = true;
				}
			}
		}
	});
	
	return data;
};


users.users = function(app, dbConnection){
	//instanciate children first
	users.login = require("./login/login.js").login(app, users);

	/*
		Get user info 
		Return useful user info
		Check and return selling right
	*/

	app.get("/api/users/data=:data&meanOfLogin=:meanOfLogin&point_id=:point_id", function(req, res){
		var error = null;

		//You MUST see async api.
		async.waterfall([
			function(callback){
				var query = "SELECT usr_id FROM tj_usr_mol_jum WHERE jum_data = ? AND mol_id = ?";
				var params = [req.params.data, req.params.meanOfLogin];

				dbConnection.query(query, params, function(err, rows, fields){
					if (err) throw err;
					if (rows.length > 1) console.log("ERROR api/users multiple entry for params:"+params);
					if (rows.length < 1){
						error = {error: "No entry"};
						callback(true);
					} 
					var user_id = rows[0].usr_id

					if (users.getUserById(user_id) != null){
						//Already swiped, go to end of waterfall with error
					// Disabled for developpement phase
					//	error = {error: "User has already swiped"};
					//	callback(true);
					}

					callback(null, user_id);
				});
			},

			function(user_id, callback){
				var query = "SELECT rig.rig_id As rig_id, rig.rig_name As rig_name, rig.rig_admin As rig_admin, jur.fun_id As fun_id, jur.poi_id As poi_id, fun_name FROM ts_right_rig rig, t_period_per per, tj_usr_rig_jur jur LEFT JOIN t_fundation_fun fun ON fun.fun_id = jur.fun_id WHERE jur.usr_id = ? AND rig.rig_id = jur.rig_id AND per.per_id = jur.per_id AND jur.jur_removed = '0' AND rig.rig_removed = '0' AND per.per_date_start <= NOW() AND per.per_date_end >= NOW()";
				var params = [user_id];

				dbConnection.query(query, params, function(err, rows, fields){
	  				if (err) throw err;
					callback(null, user_id, rows);
				});
			},

			function(user_id, rights, callback){
				var query = "SELECT usr_fail_auth, usr_blocked, usr_pwd, usr_firstname, usr_lastname, usr_nickname, usr_mail, usr_credit, img_id FROM ts_user_usr WHERE usr_id = ?";
				var params = [user_id];

				dbConnection.query(query, params, function(err, rows, fields){
					if (err) throw err;
					if (rows.length > 1) console.log("ERROR api/users multiple entry for params:"+params);

					var data = rows[0];
					var user = {
						id: user_id,
						password: data.usr_pwd,
						firstname: data.usr_firstname,
						lastname: data.usr_lastname,
						nickname: data.usr_nickname,
						mail: data.usr_mail,
						rights: rights,
						credit: data.usr_credit,
						img_id: data.img_id,
						rights: rights,
						temporary: 0,
						fail_auth: data.usr_fail_auth,
						blocked: data.usr_blocked,
						point_id: req.params.point_id,
						logged: false
					};		
					users.userlist.push(user);

					res.json({
						id: user_id,
						firstname: data.usr_firstname,
						lastname: data.usr_lastname,
						nickname: data.usr_nickname,
						credit: data.usr_credit,
						img_id: data.img_id,
						rights: rights
					});		

					callback(null);
				});


			}
		], function() { if(error) res.json(error); });  //Execute only if callback(true) is called, break the chain
	})

	;
};