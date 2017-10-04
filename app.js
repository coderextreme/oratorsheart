var express = require('express');
var app = express();
var http = require('http').Server(app);
var port = process.env.PORT || 3000;
var fs = require("fs");
var bodyParser = require('body-parser');
var path = require('path');

var videos = [];
var videoId = 0;

app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

app.post("/form.html", function(req, res) {
	if (req.xhr && typeof req.body.video !== 'undefined' && req.body.video !== '' && searchAnd(req).length === 0) {
		req.body.id = ""+(videoId++);
		videos.push(req.body);
		console.log(videos);
		fs.writeFile("videos.json", JSON.stringify(videos));
		res.json(req.body);
	} else {
		res.redirect("/form.html");
	}
});

app.post("/search.html", function(req, res) {
	console.log(req.body);
	if (req.xhr) {
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
	} else {
		res.redirect("/search.html");
	}
});

app.post("/update.html", function(req, res) {
	console.log(req.body);
	if (req.xhr) {
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
	} else {
		res.redirect("/update.html");
	}
});

console.log("Now go to http://localhost:"+port+"/search.html to search for videos, http://localhost:"+port+"/form.html to add videos, http://localhost:"+port+"/update.html to update videos");
app.listen(port);
