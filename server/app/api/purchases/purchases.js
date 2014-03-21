var async = require("async");
var purchases = module.exports;

var dependency = null;

/*
    New purchase(s) entry depending on which items are chosen
    Auto-detect of promotions
*/


purchases.newPurchase = function(buyer_id, seller_id, point_id, cart, handleData){
    if (cart.length <= 0){
        handleData({error: "Nothing to buy"});
        return;
    }

    var buyer = dependency.users.getUserById(buyer_id);
    var seller = dependency.users.getUserById(seller_id);  

    if ((buyer != null) && (seller != null)){                                            //Check if buyer and seller has both swiped
        if (seller.logged){                                                              //Check if seller is logged
            if (dependency.users.checkRights(seller.id, 11, point_id).hasRight == true){ //Check if seller has Right 
                var totalPrice = 0;
                var queries = [];

                cart.forEach(function(item)
                {     
                    if ((item.product.obj_type != "product") && (item.product.obj_type != "promotion") && (item.product.obj_type != "category"))
                    {
                        handleData("Very akward ERROR : wrong product type in newPurchase... someone is trying to screw all up.");
                        return;
                    }

                    var price = item.product.price;
                    var fundation_id = item.product.fun_id;

                    totalPrice += price*item.quantity;


                    var query = "INSERT INTO t_purchase_pur VALUES('', NOW(), ?, ?, ?, ?, ?, ?, ?, 'wall-e API', '0')";
                    var params = [item.product.obj_type, item.product.obj_id, price, buyer_id, seller_id, point_id, fundation_id];

                    for (i = 0; i<item.quantity; i++){
                        queries.push({sql: query, "params": params});                               
                    }

                    //Check if promotion
                    if (item.product.obj_type == "promotion"){
                        console.log("Formule 1 euro");

                        item.content.forEach(function(child_product){
                            var params = [child_product.obj_type, child_product.obj_id, 0, buyer_id, seller_id, point_id, fundation_id];
                            queries.push({sql: query, "params": params});
                        });
                    }
                });


                if ((buyer.credit < totalPrice) && totalPrice > 0){
                    handleData({error: "Error: buyer has not enough money"});
                    return;
                }

                var query = "UPDATE ts_user_usr SET usr_credit=usr_credit-? WHERE usr_id=?";
                var params = [totalPrice, buyer.id];
                queries.push({sql: query, "params": params});
                
                buyer.credit -= totalPrice;

                queries.forEach(function(query){
                    dependency.dbConnection.query(query.sql, query.params, function(err, res){
                        if (err) throw err;
                    });                        
                });

                handleData({ok: "ok"});

                
            }  
            else{
                console.log("Seller has not the right to sell");
                handleData({ok: "Seller has not the right to sell"});
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
    Init module
*/
purchases.purchases = function(container){
    dependency = container;
    
    dependency.app.post("/api/purchases", function(req, res){
        console.log("POST on purchases");
        purchases.newPurchase(req.body.buyer_id, req.body.seller_id, req.body.point_id, req.body.products, function(data){
            res.json(data);
        });
    })

    ;
}