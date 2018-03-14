// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // maps Page
    // =====================================
	router.get('/', function(req, res){
		res.render('maps', {
			pageName: "Maps"
		});
	});

  	// =====================================
    // Energy Maps Page
    // =====================================
	router.get('/energy-maps', function(req, res){
		res.render('./maps/energyMaps', {
			pageName: "Energy Maps"
		});
	});

	// =====================================
    // Demand Maps Page
	// =====================================
	
	router.get('/demand-maps', function(req, res){
		res.render('./maps/demandMaps', {
			pageName: "Demand Maps"
		});
	});
	

	// =====================================
    // Maps Methodology Page
	// =====================================
	
	router.get('/map-methods', function(req, res){
		res.render('./maps/mapMethods', {
			pageName: "Map Methodologies"
		});
	});

	// =====================================
    // Geoexchange
	// =====================================
	
	router.get('/geoexchange', function(req, res){
		res.render('./maps/geoexchange', {
			pageName: "Geoexchange"
		});
	});

	// =====================================
    // Sewage Heat
	// =====================================
	
	router.get('/sewage-heat', function(req, res){
		res.render('./maps/sewageheat', {
			pageName: "Sewage Heat"
		});
	});


	// Mount the router on the app
	// All routes relative to '/'
	app.use('/maps', router);
}
