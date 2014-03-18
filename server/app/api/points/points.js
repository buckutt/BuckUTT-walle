var points = module.exports;

var dependency = null;


/*
    Return all the sell points
    Take a callback function to handle data  
*/

points.getPointList = function(handleData){
    var query = "SELECT poi_id, poi_name FROM t_point_poi WHERE poi_removed != 1";

    dependency.dbConnection.query(query, null, function(err, rows, fields){
        if(err) throw err;
        handleData(rows);
    });
}


points.points = function(container){
    dependency = container;

    dependency.app.get("/api/points/", function(req, res){
        points.getPointList(function(data){
            res.json(data);
        });
    })

    ;
}