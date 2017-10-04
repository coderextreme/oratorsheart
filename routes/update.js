var express = require('express');
var fs = require('fs');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('update', { title: 'Update Video Information' });
});

router.post('/', function(req, res, next) {
	console.log(req.body);
	var string = fs.readFileSync("videos.json");
	videos = JSON.parse(string.toString());
	videoId = videos.length;
	// TODO, make sure req.body.id is the one that came from the server
	if (typeof req.body.id !== 'undefined' && req.body.id !== '') {
		videos[req.body.id] = req.body;
		fs.writeFile("videos.json", JSON.stringify(videos));
	}
	if (typeof req.body.videoId !== 'undefined' && req.body.videoId !== '') {
		req.body.id = req.body.videoId;
	}
	var subvideos = [];
	try {
		// linear search through the videos
		for (video in videos) {
			console.log(video);
			for (field in req.body) {
				// do an OR of fields
				console.log(field);
				console.log("Request");
				console.log(req.body);
				console.log("Video");
				console.log(videos[video]);
				if (req.body[field] === videos[video][field]) {
					subvideos.push(videos[video]);
					console.log(subvideos);
					break;
				}
			}
		}
	} catch (e) {
		console.log(e);
	}
	res.json(subvideos);
});

module.exports = router;
