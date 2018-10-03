// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // Topics Page
    // =====================================
	router.get('/', function(req, res){
		res.render('energy101', {
			pageName: "Energy101	"
		});
	});

	router.get('/energy101-2', function(req, res){
		res.render('./energy101/energy101-2', {
			pageName: "Energy101 2"
		});
	});

	router.get('/energy101-3', function(req, res){
		res.render('./energy101/energy101-3', {
			pageName: "Energy101 3"
		});
	});

	router.get('/energy101-4', function(req, res){
		res.render('./energy101/energy101-4', {
			pageName: "Energy101 4"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/energy101', router);
}
