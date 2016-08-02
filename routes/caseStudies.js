// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // Case Studies and Resources Page
    // =====================================
	router.get('/', function(req, res){
		res.render('caseStudiesAndResources', {
			pageName: "Homepage"
		});
	});

  router.get('/case-study-one', function(req, res){
		res.render('./caseStudies/casestudyone', {
			pageName: "Homepage"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/case-studies-and-resources', router);
}
