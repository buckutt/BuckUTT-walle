var async = require("async");

var products = module.exports;

var dependency = null;


/*
    Return the content of a promotion depending on:
        His ID
    Take a callback function to handle data
*/

products.getPromotionContent = function(id, handleData){
    var query = "SELECT *\
        FROM `tj_object_link_oli`\
        WHERE obj_id_parent =?";

        var params = [id];

        dependency.dbConnection.query(query, params, function(err, rows, fields){
            if (err) throw err;
            handleData(rows);
        });
}


/*
    Return one product info depending on:
        His ID
    Take a callback function to handle data
*/

products.getProduct = function(id, handleData){
    var query = "SELECT t_price_pri.pri_credit, tj_object_link_oli.obj_id_parent, t_object_obj.* FROM `t_price_pri`\
        LEFT JOIN `tj_object_link_oli`\
        ON t_price_pri.obj_id = tj_object_link_oli.obj_id_child\
        LEFT JOIN `t_object_obj`\
        ON t_price_pri.obj_id = t_object_obj.obj_id\
        WHERE t_price_pri.obj_id=?  AND t_price_pri.pri_removed != 1 AND (tj_object_link_oli.oli_removed != 1 OR tj_object_link_oli.oli_removed IS NULL)";

    var params = [id];

    dependency.dbConnection.query(query, params, function(err, rows, fields){
        if (err) throw err;
        handleData(rows);
    });
}


/*
    Return all products depending on:
        Who's buying
        Where he's buying
    Take a callback function to handle data
*/

products.getProductList = function(seller_id, point_id, handleData){
    async.waterfall([
        function(callback){
            var query = "SELECT @periods := group_concat(per.per_id) AS periods\
                FROM t_period_per per WHERE per.per_date_start <=  NOW()\
                AND per.per_date_end >=  NOW() AND per.per_removed = 0";

            dependency.dbConnection.query(query, null, function(err, rows, fields){
                if (err) throw err;
                callback(null, rows[0].periods);
            });     
        },

        function(periods, callback){
            var query = "SELECT obj.obj_id, obj.obj_name, obj.obj_type, obj.obj_stock,\
                obj.obj_single, oli.obj_id_parent, obj.img_id,\
                (select o.obj_name from t_object_obj o where o.obj_id = oli.obj_id_parent) AS category,\
                MIN(pri.pri_credit) AS price FROM t_object_obj obj\
                Left Join tj_object_link_oli oli ON oli.obj_id_child = obj.obj_id AND\
                oli.oli_step = '0' AND oli.oli_removed =  0\
                Inner Join t_price_pri pri ON pri.obj_id = obj.obj_id AND\
                pri.pri_removed = 0 Inner Join tj_obj_poi_jop jop\
                ON jop.obj_id = obj.obj_id\
                WHERE jop.poi_id = ? AND find_in_set(pri.per_id, ?)\
                AND pri.grp_id IN(SELECT jug.grp_id\
                                    FROM tj_usr_grp_jug jug\
                                    WHERE jug.usr_id =  ?\
                                    AND find_in_set(jug.per_id, ?))\
                AND exists(SELECT sal.sal_id FROM t_sale_sal sal\
                    WHERE find_in_set(sal.per_id, ?)\
                    AND sal.obj_id = obj.obj_id\
                    AND sal.sal_removed = 0 )\
                AND exists(SELECT jur.jur_id FROM tj_usr_rig_jur jur\
                    WHERE find_in_set(jur.per_id, ?)\
                    AND jur.poi_id =  ?\
                    AND jur.rig_id =  11\
                    AND jur.usr_id =  ?\
                    AND jur.jur_removed = 0 )\
                AND (obj.obj_stock > 0 OR obj.obj_stock = -1 ) AND obj.obj_removed = 0 AND pri.pri_removed = 0\
                GROUP BY obj.obj_id ORDER BY jop.jop_priority ASC, obj.obj_name ASC";

            var params = [point_id, periods, seller_id, periods, 
                periods, periods, point_id, seller_id];

            dependency.dbConnection.query(query, params, function(err, rows, fields){
                if (err) throw err;
                handleData(rows);
                callback(null);
            });               
        }
    ]);
}


/*
    Init module
*/

products.products = function(container){
    dependency = container;

	dependency.app.get("/api/products/seller_id=:seller_id&point_id=:point_id", function(req, res){
        products.getProductList(req.params.seller_id, req.params.point_id, function(data){
            res.json(data);
        });
    })

    .get("/api/products/product_id=:product_id", function(req, res){
        products.getProduct(req.params.product_id, function(data){
            res.json(data);
        });
    })

    .get("/api/products/promotion_id=:promotion_id", function(req, res){
        products.getPromotionContent(req.params.promotion_id, function(data){
            res.json(data);
        });
    })
    ;
};
