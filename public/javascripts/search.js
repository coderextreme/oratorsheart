$('#form').submit(function(e) {
	e.stopPropagation();
	e.preventDefault();
	$("#table").empty();
        let body = { search : $("#search").val() };
        console.log(body);


	$.ajax({
		// url: "https://arcane-stream-10108.herokuapp.com/search",
		url: "/search",
		type: 'post',
		data: body,
		/*
		headers: {
			"Access-Control-Allow-Origin": "*",
  	        	"Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept"
	 	},
		*/
		dataType: 'json',
		success: function(videos) {
			for (video in videos) {
				displayVideo(video, videos[video]);
			}
		}
	});
});

function getSrc(video) {
    // match against youtube URLs
    const ytregExp = /^(https?:\/\/)(.*youtu.?be.*\/)(v\/|u\/\w\/|embed\/|watch\?v=|\&v=|)([^#\&\?]*).*/;
    const ytmatch = video["Link"].match(ytregExp);
    const fbregExp = /^(https?:\/\/).*facebook\.com.*\/.*\/videos?\/([0-9]+)/;
    const fbmatch = video["Link"].match(fbregExp);

    let src = 'error';
    if (ytmatch && ytmatch[4].length === 11) {
      src = ytmatch[1] + 'www.youtube.com/embed/' + ytmatch[4];
    } else if (fbmatch) {
      src = fbmatch[1] + 'www.facebook.com/video/embed?video_id=' + fbmatch[2];
    } else {
      src = video["Link"]; // TODO BAD IDEA
    }
    
    console.log(src);
    return src;
}


function displayVideo(v, video) {
	var src = getSrc(video);
	if (typeof src !== 'undefined' && src !== '') {
		$('<div id="row'+v+'" class="row">').appendTo($("#table"));
		$('<span id="left'+v+'" class="cell">').appendTo($("#row"+v));
		$('<iframe id="iframe'+v+'" width="420" height="315" frameborder="0" allowfullscreen>').appendTo($("#left"+v));
		$("#iframe"+v).attr("src", src);
		$("#row"+v).append('<div id="right'+v+'" class="table">');
		$("#right"+v).append('<span id="id'+v+'" class="row">');
		$("#id"+v).text(video["ID"]);
		$("#right"+v).append('<span id="title'+v+'" class="row">');
		$("#title"+v).text(video["Title"]);
		$("#right"+v).append('<span id="date'+v+'" class="row">');
		$("#date"+v).text(video["Date on Link"]);
		$("#right"+v).append('<span id="orator'+v+'" class="row">');
		$("#orator"+v).text(video["Author/Orator"]);

	}
	return false;
}
