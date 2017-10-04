var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('search', { title: 'Search Videos' });
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	var string = fs.readFileSync("videos.json");
	videos = JSON.parse(string.toString());
	videoId = videos.length;
	var subvideos = [];
	try {
		// linear search through the videos
		for (video in videos) {
			console.log(video);
			for (field in req.body) {
				// do an OR of fields
				if (req.body[field] === videos[video][field]) {
					subvideos.push(videos[video]);
					break;
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
	console.log(subvideos);
	res.json(subvideos);
});

module.exports = router;
