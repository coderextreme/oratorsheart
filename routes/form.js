var express = require('express');
var fs = require('fs');
var router = express.Router();

function searchAnd(req) {
	var subvideos = [];
	// linear search through the videos
	var string = fs.readFileSync("videos.json");
	videos = JSON.parse(string.toString());
	videoId = videos.length;
	for (video in videos) {
		if (req.body["orator"] === videos[video]["orator"]
		 && req.body["title"] === videos[video]["title"]
		 && req.body["video"] === videos[video]["video"]) {
			subvideos.push(videos[video]);
		}
	}
	return subvideos;
}

/* POST form */
router.post('/', function(req, res, next) {
	if (typeof req.body.video !== 'undefined' && req.body.video !== '' && searchAnd(req).length === 0) {
		console.log("Inserting");
		req.body.id = ""+(videoId++);
		videos.push(req.body);
		console.log(videos);
		fs.writeFile("videos.json", JSON.stringify(videos));
		res.json(req.body);
	} else {
		res.render('form', { title: 'Enter Video Information' });
	}
});

router.get('/', function(req, res, next) {
	res.render('form', { title: 'Enter Video Information' });
});

module.exports = router;
