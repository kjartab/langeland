
				

	function buildStatusBar(trackObject) {
	
		console.log(LS.timeModule.getTimeText(trackObject.getLastUpdate()));
		var trackStatus = trackObject.getStatus();
		resultBar = "<div class=\"track-container\" id=tid_" + trackObject.getId() + " >" +
					"<div class=\"three-part-row\">" +
					"<div class=\"track-container-first\"><h6>" + trackObject.name + "</h6></div>" +
					"<div class=\"track-container-second\"><h6>" + LS.timeModule.getTimeText(trackObject.getLastUpdate()) + "</h6></div>" +
					"<div class=\"track-container-third\">";
						
					for (var i=0; i<trackStatus.length; i++) {
						
							extra = '';
						console.log(trackStatus[i]);
						resultBar+='<div class="progress-bar'+extra +'" style="background-color: ' + LS.temporalColor.getTimeColor(trackStatus[i].subSegmentTime,0.5) +'; width: '+ 100*trackStatus[i].subSegmentLength/trackObject.trackLength +'%"></div>';
						
					}
					

		return resultBar+"</div></div></div>";
	}
