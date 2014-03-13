var async = require("async");
var products = module.exports;

/*
    Get product list
*/
products.products = function(app, dbConnection){
	app.get("/api/products/buyer_id=:buyer_id&point_id=:point_id", function(req, res){
		async.waterfall([
            function(callback){
                var query = "SELECT @periods := group_concat(per.per_id) AS periods\
                    FROM t_period_per per WHERE per.per_date_start <=  NOW()\
                    AND per.per_date_end >=  NOW() AND per.per_removed = 0";

                dbConnection.query(query, null, function(err, rows, fields){
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

                var params = [req.params.point_id, periods, req.params.buyer_id, periods, 
                    periods, periods, req.params.point_id, req.params.buyer_id];

                dbConnection.query(query, params, function(err, rows, fields){
                    if (err) throw err;
                    res.json(rows);
                    callback(null);
                });               
            }
		]);

	})

	;
};
