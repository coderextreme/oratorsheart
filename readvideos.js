
var videos = [];
var videoId = 0;

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
    if (rows.length == 0) {
      console.log('No data found.');
    } else {
      for (var row in rows) {
	if (row === 0) {
	  var object = row;
	} else {
          var video= {};
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
