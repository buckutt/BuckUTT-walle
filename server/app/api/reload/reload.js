var reload = module.exports;

var dependency = null;


/*
    Add credit to a client depending on:
        His ID
    Take a callback function to handle data
*/

reload.reloadUser = function(buyer_id, seller_id, reload_type, credit, point_id, handleData){
    var buyer = dependency.users.getUserById(buyer_id);
    var seller = dependency.users.getUserById(seller_id);

    if ((buyer != null) && (seller != null)){                                            //Check if buyer and seller has both swiped
        if (seller.logged){                                                              //Check if seller is logged
            if (dependency.users.checkRights(seller.id, 4, point_id).hasRight == true){ //Check if seller has Right 
                buyer.credit += credit;
                
                var query = "UPDATE ts_user_usr SET usr_credit=usr_credit+? WHERE usr_id=?";
                var params = [credit, buyer.id];
                dependency.dbConnection.query(query, params, function(err, rows, fields){
                    if (err) throw err;
                });

                query = "INSERT INTO t_recharge_rec VALUES ('', ?, ?, ?, ?, NOW(), ?, 'TEST', 0)";
                params = [reload_type, buyer_id, seller_id, point_id, credit];
                dependency.dbConnection.query(query, params, function(err, rows, truc){
                    if (err) throw err;
                });

                handleData({ok: "ok"});
            }  
            else{
                console.log("Seller has not the right to sell");
                handleData({error: "Seller has not the right to sell"});
            }
        }
        else{
            console.log("Seller is not logged");
            handleData({error: "Seller is not logged"});
        }
    }
    else{
        console.log("Someone didn't swipe");
        handleData({error: "Someone didn't swipe"});
    }
}


/*
    Reload all reload Types available 
    Take a callback function to handle data
*/

reload.getReloadTypes = function(handleData){
    var query = "SELECT * FROM t_recharge_type_rty WHERE rty_type = 'PBUY' AND rty_removed = 0";

    dependency.dbConnection.query(query, null, function(err, rows, fields){
        handleData(rows);
    });
}


reload.reload = function(container){
    dependency = container;

    dependency.app.get("/api/reload/types", function(req, res){
        reload.getReloadTypes(function(data){
            res.json(data);
        });
    });

    dependency.app.post("/api/reload", function(req, res){
        reload.reloadUser(req.body.buyer_id, req.body.seller_id, req.body.reload_type, req.body.credit, req.body.point_id, function(data){
            res.json(data);
        });
    });
}