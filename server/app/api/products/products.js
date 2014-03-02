var products = module.exports;


//Product list
products.products = function(app, dbConnection){
	app.get("/api/products/", function(req, res){
		//TODO mysql query
		 var products = {
	        "accueil" : [

	        ],
	        "canettes" : [
	            {
	                "id":"dinde",
	                "name":"Bande de dinde",
	                "price":"1"
	            },
	            {
	                "id":"oasis",
	                "name":"Oasis",
	                "price":"0.60"
	            }
	        ],
	        "barres" : [
	            {
	                "id":"mars",
	                "name":"Mars",
	                "price":"0.50"
	            }
	        ]
	    };

	    res.json(products);
	})

	;
};
