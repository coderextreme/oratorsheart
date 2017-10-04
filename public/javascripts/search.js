
$('#form').submit(function(e) {
	e.preventDefault();
	$.post("/search", $(this).serialize(), function(videos) {
		for (video in videos) {
			updateVideo(videos[video]);
		}
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

function updateVideo(video) {
	var videoId = getId(video.video);
	if (typeof videoId !== 'undefined' && videoId !== '') {
		$("#table").append('<div class="row">'+
				'<span class="cell">'+video.id+'</span>&nbsp;'+
				'<span class="cell">'+video.title+'</span>&nbsp;'+
				'<span class="cell">'+video.date+'</span>&nbsp;'+
				'<span class="cell">'+video.orator+'</span>&nbsp;'+
				'<span class="cell"><iframe width="420" height="315" src="//www.youtube.com/embed/'+
				videoId+'" frameborder="0" allowfullscreen></iframe></span></div>');

	}
	return false;
}
