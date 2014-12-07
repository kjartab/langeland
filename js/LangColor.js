


function LangColor(){};


	LangColor.prototype.getRandomColor = function() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}

	Lang.prototype.getAgeColor = function(days) {
		if (age<1) {
			return "#3ABA58";
		}
		if (age<3) {
			return "#3ABAA9";
		}
		if (age<5) {
			return "#3A63BA";
		}
		if (age<7) {
			return "#693ABA";
		}
		if (age<10) {
			return "#BA3A5E";
		}
		if (age<14) {
			return "#FF0000";
		}
		
		return "#000000";
			
	}

	function getTrackDayAge(timeStamp) {
		return new Date()-timeStamp;
	}
	
