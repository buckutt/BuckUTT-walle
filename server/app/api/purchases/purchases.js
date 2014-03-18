var async = require("async");
var purchases = module.exports;

var dependency = null;

/*
    New purchase(s) entry depending on which items are chosen
    Auto-detect of promotions
*/


purchases.newPurchase = function(buyer_id, seller_id, point_id, cart, handleData){
    if (cart.length <= 0){
        handleData.json({error: "Nothing to buy"});
        return;
    }

    var buyer = dependency.users.getUserById(buyer_id);
    var seller = dependency.users.getUserById(seller_id);  

    if ((buyer != null) && (seller != null)){                                        //Check if buyer and seller has both swiped
        if (seller.logged){                                                          //Check if seller is logged
            if (dependency.users.checkRights(seller.id, 11, point_id).hasRight == true){ //Check if seller has Right 
                //Preparing async tasks
                var tasks = [];
                var totalPrice = 0;

                cart.forEach(function(product)
                {
                    tasks.push(function(callback){
                        dependency.products.getProduct(product.id, function(data){
                            var price = data[0].pri_credit;
                            var fundation_id = data[0].fun_id;

                            totalPrice += price;

                            if ((product.type != "product") && (product.type != "promotion") && (product.type != "category"))
                            {
                                console.log("Very akward ERROR : wrong product type in newPurchase... someone is trying to screw all up.");
                            }

                            var query = "INSERT INTO t_purchase_pur VALUES('', NOW(), ?, ?, ?, ?, ?, ?, ?, 'LOLOLOL', '0')";
                            var params = [product.type, product.id, price, buyer_id, seller_id, point_id, fundation_id];

                            dependency.dbConnection.query(query, params, function(err, res){
                                if (err) throw err;
                            });
                            callback(null);
                        });
                    });
                });

                async.parallel(tasks, function(){
                    var query = "UPDATE ts_user_usr SET usr_credit=usr_credit-?";
                    var params = [totalPrice];

                    dependency.dbConnection.query(query, params, function(err, res){
                        if (err) throw err;
                        handleData({lol: "lol"});
                    })
                });
                
            }  
            else{
                handleData({error: "Seller has not the right to sell"});
            }
        }
        else{
            handleData({error: "Seller is not logged"});
        }
    }
    else{
        handleData({error: "Someone didn't swipe"});
    }
}


/*
    Init module
*/
purchases.purchases = function(container){
    dependency = container;

    /*
        body =         
        {
            buyer_id: 8871,
            seller_id: 8871,
            point_id: 3,
            dependency.products: 
            [
                {id: 27, type: "product"},
                {id: 12, type: "product"}
            ]
        }
    */
    
    dependency.app.post("/api/purchases/", function(req, res){
        purchases.newPurchase(req.body.buyer_id, req.body.seller_id, req.body.point_id, req.body.dependency.products, function(data){
            res.json(data);
        });
    })

    ;
}