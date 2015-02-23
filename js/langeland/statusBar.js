


	function buildStatusBar(trackObject) {
        console.log(trackObject.getStatus());
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
	
				

