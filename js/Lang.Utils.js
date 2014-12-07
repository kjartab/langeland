
	function hoverTrackElement(track_id) {
	
		var segment_ids = getSegments(track_id);
		var bounds = getTrackBounds(segment_ids);
		
		highlightSegments(segment_ids);

	}