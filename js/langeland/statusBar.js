


	function buildStatusBar(trackObject) {
		var trackStatus = trackObject.getStatus();
		resultBar = "<div class=\"track-container\" id=tid_" + trackObject.getId() + " >" +
					"<div class=\"two-part-row\">" +
					"<div class=\"track-container-left\"><h6>" + trackObject.name + "</h6></div></div>" +
					"<div class=\"full-row\">";
					
					for (var i=0; i<trackStatus.length; i++) {
						if(i==0) { 
							extra = '-first progress-bar'
						} else if (i==trackStatus.length-1) {
							extra = '-last progress-bar'
						} else {
							extra = '';
						}
						console.log(extra);
						resultBar+='<div class="progress-bar'+extra +'" style="background-color: ' + temporalColor.getTimeColor(trackStatus[i].subSegmentTime,0.5) +'; width: '+ 100*trackStatus[i].subSegmentLength/trackObject.trackLength +'%"></div>';
						console.log( temporalColor.getTimeColor(trackStatus[i].subSegmentTime));
					}

					
		return resultBar+"</div>";
	}
	
	
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
						
						resultBar+='<div class="progress-bar'+extra +'" style="background-color: ' + LS.temporalColor.getTimeColor(trackStatus[i].subSegmentTime,0.5) +'; width: '+ 100*trackStatus[i].subSegmentLength/trackObject.trackLength +'%"></div>';
						
					}
					

		return resultBar+"</div></div></div>";
	}
	
				

