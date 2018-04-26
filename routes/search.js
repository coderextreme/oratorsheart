var express = require('express');
var router = express.Router();
var videos = [];
var videoId = 0;

const fs = require('fs');
const readline = require('readline');
// const google = require('googleapis');
// const OAuth2Client = google.auth.OAuth2;
const {google} = require('googleapis');
const OAuth2Client = google.auth.OAuth2;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
  });
  console.log('Authorize this app by visiting this url:', authUrl);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      if (err) return callback(err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) console.error(err);
        console.log('Token stored to', TOKEN_PATH);
      });
      callback(oAuth2Client);
    });
  });
}

router.loadVideos = function() {
	// load the vides on the first get, so the search will have them
	videos = [];
	videoId = 0;
	readSecretAndVideos("client_secret.json");
};

router.get('/', function(req, res, next) {
  	res.render('search', { title: "Search Videos" });
});

router.post('/', function(req, res, next) {
	console.log("Search terms", req.body);
	try {
		var subvideos = [];
		// linear search through the videos
		for (video in videos) {
			console.log(videos[video]);
			var columns = [];
			colId = 0;
			for (field in videos[video]) {
				columns[colId++] = videos[video][field]
			}
			var terms = req.body.params ? req.body.params.search.split(" ") : req.body.search ? req.body.search.split(" ") : '';
			for (t in terms) {
				var term = terms[t];
				if (columns.join(" ").includes(term)) {
					subvideos.push(videos[video]);
					console.log("Found", term, "in", columns.join(" "));
					break;
				} else {
					console.log("Not Found", term, "in", columns.join(" "));
				}
			}
		}
		console.log("Sending", subvideos);
		res.json(subvideos);
	} catch (e) {
		console.log(e);
	}
});

function readSecretAndVideos(secretFile) {
// Load client secrets from a local file.
fs.readFile(secretFile, function processClientSecrets(err, content) {
  if (err) {
    console.log('Error loading client secret file: ' + err);
    return;
  }
  // Authorize a client with the loaded credentials, then call the
  // Google Sheets API.
  try {
  	authorize(JSON.parse(content), readVideos);
  } catch (e) {
	  console.log(e);
  }
});
}


function readVideos(auth) {
  var sheets = google.sheets({version: 'v4', auth});
  sheets.spreadsheets.values.get({
    spreadsheetId: '1X-RnAUgRRBNnWgS9_rsg1WlxPxWm7H-GFd-nAxWf7RY',
    range: 'Sheet1',
  }, function(err, {data}) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = data.values;
    console.log(rows);
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      for (var row in rows) {
	console.log("row", row);
	if (row == 0) {
	  console.log("object", object);
	  var object = rows[row];
	} else {
          var video= {};
	  for (col in object) {
	    video[object[col]] = rows[row][col];
	  }
		console.log("Push", video);
	  videos.push(video);
	  videoId++;
        }
      }
    }
  });
}

module.exports = router;
