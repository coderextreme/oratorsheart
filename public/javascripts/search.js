
$('#form').submit(function(e) {
	e.preventDefault();
	$("#table").empty();
	$.post("/search", $(this).serialize(), function(videos) {
		for (video in videos) {
			displayVideo(videos[video]);
		}
	});
});

function getYouTubeId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}

function displayVideo(video) {
	var videoId = getYouTubeId(video["Link"]);
	if (videoId === 'error') {
		videoId = 'https://www.facebook.com/0caa26a9-2921-4d85-80f5-f1fdea7a8e5f'.replace(/\//g, '%2F').replace(/:/g, '%3A');
	} else {
		videoId = '//www.youtube.com/embed/'+videoId;
	}
	if (typeof videoId !== 'undefined' && videoId !== '') {
		var row = $("#table")
			.append('<div class="row">')
		if (videoId.match(/facebook/)) {
			var left = row.apepnd('<span class="cell"><iframe src="https://www.facebook.com/plugins/video.php?href='+videoId+'&width=420&show_text=false&height=0&appId" width="420" height="315" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowTransparency="true" allowFullScreen="true"></iframe></sapn'
				left.attr("href", videoId);
		} else {
			var left = row.append('<span class="cell"><iframe width="420" height="315" frameborder="0" allowfullscreen></iframe></span>'))
			left.attr("src", videoId);
		}
		var right = row.append('<div class="table">');
		var cell = right.append('<span class="row">')
		row.text(video["ID"]+"&nbsp;");
		cell = right.append('<span class="row">')
		cell.text(video["Title"]+"&nbsp;");
		cell = right.append('<span class="row">')
		cell.text(video["Date on Link"]+"&nbsp;");
		cell = right.append('<span class="row">')
		cell.text(video["Author/Orator"]+"&nbsp;");

	}
	return false;
}
