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

	// HOMEPAGE with side menu bar
	router.get('/sidebar', function(req, res){
		res.render('index-two', {
			pageName: "Homepage"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/', router);
}