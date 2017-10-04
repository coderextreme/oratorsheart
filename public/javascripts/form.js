
$('#form').submit(function(e) {
	e.preventDefault();
	$.post("/form", $(this).serialize(), function(data) {
		updateVideo(data.title, data.orator, data.video);
	});
});

function getId(url) {
    var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    var match = url.match(regExp);

    if (match && match[2].length == 11) {
        return match[2];
    } else {
        return 'error';
    }
}


function updateVideo(title, orator, video) {
	var videoId = getId(video);
	if (typeof videoId !== 'undefined' && videoId !== '') {
		$("#table").append('<div class="row">'+
				'<span class="cell">'+title+'</span>'+
				'<span class="cell">'+orator+'</span>'+
				'<span class="cell"><iframe width="420" height="315" src="//www.youtube.com/embed/'+
				videoId+'" frameborder="0" allowfullscreen></iframe></span></div>');
	}
	return false;
}

function displayVideos(videos) {
	for (v in videos) {
		updateVideo(videos[v].title, videos[v].orator, videos[v].video);
	}
	return false;
}
