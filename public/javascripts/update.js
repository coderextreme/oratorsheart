
$('#form').submit(function(e) {
	e.preventDefault();
	$.post("/update", $(this).serialize(), function(videos) {
		$("#table").empty();
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

function updateForm(video) {
	$("#title").val(video.title);
	$("#orator").val(video.orator);
	$("#date").val(video.date);
	$("#video").val(video.video);
	$("#id").val(video.id);
}

function updateVideo(video) {
	var videoId = getId(video.video);
	if (typeof videoId !== 'undefined' && videoId !== '') {
		$("#table").append('<div class="row">'+
				'<input class="cell" type="radio" name="videoId" value="'+video.id+'"></input>&nbsp;'+
				'<span class="cell">'+video.title+'</span>&nbsp;'+
				'<span class="cell">'+video.date+'</span>&nbsp;'+
				'<span class="cell">'+video.orator+'</span>&nbsp;'+
				'<span class="cell"><iframe width="420" height="315" src="//www.youtube.com/embed/'+
				videoId+'" frameborder="0" allowfullscreen></iframe></span></div>');
		$('input[name="videoId"]').click(function(e) {
			var formData = $(this).serialize();
			$.post("/update", formData, function(video) {
				updateForm(video[0]);
			});
		});

	}
	return false;
}
