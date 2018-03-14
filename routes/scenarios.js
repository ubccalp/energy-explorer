// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // scenarios Page
    // =====================================
	router.get('/', function(req, res){
		res.render('scenarios', {
			pageName: "scenarios"
		});
	});

  	router.get('/scenario1', function(req, res){
		res.render('./scenarios/scenario-1', {
			pageName: "Scenario 1"
		});
	});

	router.get('/scenario2', function(req, res){
		res.render('./scenarios/scenario-2', {
			pageName: "Scenario 2"
		});
	});

	router.get('/scenario3', function(req, res){
		res.render('./scenarios/scenario-3', {
			pageName: "Scenario 3"
		});
	});

	router.get('/scenario4', function(req, res){
		res.render('./scenarios/scenario-4', {
			pageName: "Scenario 4"
		});
	});

	router.get('/scenario5', function(req, res){
		res.render('./scenarios/scenario-5', {
			pageName: "Scenario 5"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/scenarios', router);
}
