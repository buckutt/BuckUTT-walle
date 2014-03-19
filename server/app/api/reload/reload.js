var reload = module.exports;

var dependency = null;


/*
    Reload all reload Types available 
    Take a callback function to handle data
*/

reload.getReloadTypes = function(handleData){
    var query = "SELECT * FROM t_recharge_type_rty WHERE rty_type='PBUY' AND rty_removed=0";

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
}