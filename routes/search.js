var express = require('express');
var fs = require('fs');
var router = express.Router();

var videos = [];
var videoId = 0;


/* GET home page. */
router.get('/', function(req, res, next) {
  // load the vides on the first get
  videos = [];
  videoId = 0;
  readSecretAndVideos("client_secret.json");
  res.render('search', { title: 'Search Videos' });
});

router.post('/', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "coderextreme.net");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	console.log(req.body);
	try {
		var subvideos = [];
		// linear search through the videos
		for (video in videos) {
			var columns = [];
			colId = 0;
			for (field in videos[video]) {
				columns[colId++] = videos[video][field]
			}
			var terms = req.body.search.split(" ");
			for (t in terms) {
				var term = terms[t];
				if (columns.join(" ").includes(term)) {
					subvideos.push(videos[video]);
					break;
				}
			}
		}
		console.log(subvideos);
		res.json(subvideos);
	} catch (e) {
		console.log(e);
	}
    next();
});

var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/sheets.googleapis.com-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';
var TOKEN_PATH = TOKEN_DIR + 'sheets.googleapis.com-nodejs-quickstart.json';

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

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.installed.client_secret;
  var clientId = credentials.installed.client_id;
  var redirectUrl = credentials.installed.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    if (err) {
      getNewToken(oauth2Client, callback);
    } else {
      oauth2Client.credentials = JSON.parse(token);
      callback(oauth2Client);
    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Print the names and majors of students in a sample spreadsheet:
 * https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * 
 * Side effects: populates videos, an array of video objects and a videoId,
 * the number of videos, in the environment
 */
function readVideos(auth) {
  var sheets = google.sheets('v4');
  sheets.spreadsheets.values.get({
    auth: auth,
    spreadsheetId: '1X-RnAUgRRBNnWgS9_rsg1WlxPxWm7H-GFd-nAxWf7RY',
    range: 'Sheet1',
  }, function(err, response) {
    if (err) {
      console.log('The API returned an error: ' + err);
      return;
    }
    var rows = response.values;
	  console.log(rows);
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      for (var row in rows) {
	if (row == 0) {
	  var object = rows[row];
	} else {
          var video = {};
	  for (col in object) {
	    video[object[col]] = rows[row][col];
	  }
	  videos.push(video);
	  videoId++;
        }
      }
    }
  });
}
module.exports = router;
