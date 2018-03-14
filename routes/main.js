// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

	// =====================================
    // HOME PAGE
    // =====================================
	router.get('/home', function(req, res){
		res.render('home', {
			pageName: "Homepage"
		});
	});
	

	router.get('/', function(req, res){
		res.render('home', {
			pageName: "Home"
		});
	});
	

	// =====================================
    // Resources Page
    // =====================================
	router.get('/resources', function(req, res){
		res.render('resources', {
			pageName: "Resources"
		});
	});

	// =====================================
    // About Page
    // =====================================
	router.get('/about', function(req, res){
		res.render('about', {
			pageName: "About"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/', router);
}
