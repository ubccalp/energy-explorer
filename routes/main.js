// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

	// =====================================
    // HOME PAGE
    // =====================================
	router.get('/', function(req, res){
		res.render('index', {
			pageName: "Homepage"
		});
	});

	// =====================================
    // Community Energy Explained Page
    // =====================================
	router.get('/community-energy-explained', function(req, res){
		res.render('communityEnergyExplained', {
			pageName: "Homepage"
		});
	});

	// =====================================
    // Renewable Energy Supply Page
    // =====================================
	router.get('/renewable-energy-supply', function(req, res){
		res.render('renewableEnergySupply', {
			pageName: "Homepage"
		});
	});

	// =====================================
    // Energy Demand and Efficiency Page
    // =====================================
	router.get('/energy-demand-and-efficiency', function(req, res){
		res.render('energyDemandEfficiency', {
			pageName: "Homepage"
		});
	});
	
	// =====================================
    // Energy Maps Page
    // =====================================
	router.get('/energy-maps', function(req, res){
		res.render('energyMaps', {
			pageName: "Homepage"
		});
	});

	// =====================================
    // About Page
    // =====================================
	router.get('/about', function(req, res){
		res.render('about', {
			pageName: "Homepage"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/', router);
}
