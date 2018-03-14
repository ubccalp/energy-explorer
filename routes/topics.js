// This file contains the primary routes for the website
module.exports = function(express, app) {
	var router = express.Router();

  // =====================================
    // Topics Page
    // =====================================
	router.get('/', function(req, res){
		res.render('topics', {
			pageName: "Topics"
		});
	});

  	router.get('/topic1', function(req, res){
		res.render('./topics/topic-1', {
			pageName: "Topic 1"
		});
	});

	router.get('/topic2', function(req, res){
		res.render('./topics/topic-2', {
			pageName: "Topic 2"
		});
	});

	router.get('/topic3', function(req, res){
		res.render('./topics/topic-3', {
			pageName: "Topic 3"
		});
	});

	router.get('/topic4', function(req, res){
		res.render('./topics/topic-4', {
			pageName: "Topic 4"
		});
	});

	router.get('/topic5', function(req, res){
		res.render('./topics/topic-5', {
			pageName: "Topic 5"
		});
	});

	// Mount the router on the app
	// All routes relative to '/'
	app.use('/topics', router);
}
