// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // Case Studies and Resources Page
    // =====================================
	router.get('/', function(req, res){
		res.render('caseStudiesAndResources', {
			pageName: "Case Study One Page"
		});
	});

  router.get('/case-study-one', function(req, res){
		res.render('./caseStudies/casestudyone', {
			pageName: "Case Study One Page"
		});
	});

	router.get('/case-study-two', function(req, res){
		res.render('./caseStudies/casestudytwo', {
			pageName: "Case Study Two Page"
		});
	});

	router.get('/case-study-three', function(req, res){
		res.render('./caseStudies/casestudythree', {
			pageName: "Case Study Three Page"
		});
	});

	router.get('/case-study-four', function(req, res){
		res.render('./caseStudies/casestudyfour', {
			pageName: "Case Study Four Page"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/case-studies-and-resources', router);
}
