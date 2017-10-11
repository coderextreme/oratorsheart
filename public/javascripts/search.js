
$('#form').submit(function(e) {
	e.preventDefault();
	$("#table").empty();
	$.post("/search", $(this).serialize(), function(videos) {
		for (video in videos) {
			displayVideo(videos[video]);
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

function displayVideo(video) {
	var videoId = getId(video["Link"]);
	if (typeof videoId !== 'undefined' && videoId !== '') {
		$("#table").append('<div class="row">'+
				'<span class="cell"><iframe width="420" height="315" src="//www.youtube.com/embed/'+
				videoId+'" frameborder="0" allowfullscreen></iframe></span>'+
				'<div class="table">'+
				'<span class="row">'+video["ID"]+'</span>&nbsp;'+
				'<span class="row">'+video["Title"]+'</span>&nbsp;'+
				'<span class="row">'+video["Date on Link"]+'</span>&nbsp;'+
				'<span class="row">'+video["Author/Orator"]+'</span>&nbsp;'+
				'</div>'+
				'</div>');

	}
	return false;
}
