var LS = LS || {};

LS.temporalColor = (function () {
	
	var minTime, maxTime;
	var chosen;
	
	var simpleColors = [
		'#000099',
		'#993399',
		'#D11919',
		'#800000',
		'#000000'
	];
	
	var simpleColors2 = [
		'#0000dd',
		'#993399',
		'#D11919',
		'#AF0000',
		'#800000',
		'#343434'
	];
	
	var simpleColors3 = [
		'rgba(0,0,255,0.8)',
		'rgba(0,0,255,0.8)',
		'rgba(0,0,255,0.8)',
		'rgba(0,0,255,0.8)',
		'rgba(0,0,255,0.8)',
		'rgba(0,0,255,0.8)'
	];
	
	
	function init() {
		chosen = simpleColors2;
		console.log('setScheme?');
	}
	
	
	/*
		Returns the color for a given time with the current color scheme
	*/
	function getTimeColor(timeString,alpha) {
		if (alpha===0.5) {
			chosen = simpleColors2;
		}
		var time = convertTime(timeString);
		var timeDiff = (new Date() - new Date(time))/1000;
		
		if(timeDiff < 3600*24) {
			return chosen[0];
			
		} else if (timeDiff >= 3600*24 && timeDiff < 3600*24*2) {
			return chosen[1];
			
		} else if (timeDiff >= 3600*24*2 && timeDiff < 3600*24*4) {
			return chosen[2];
			
		} else if (timeDiff >= 3600*24*4 && timeDiff < 3600*24*7) {
			return chosen[3];
			
		} else if (timeDiff >= 3600*7 && timeDiff < 3600*24*8) {
			return chosen[4];
		}
			
		return chosen[5];
		
		
		
		
		
		
		
	}
	
	
	
	function setTimeSpan(startTime, endTime) {
		
		
		
	}
	
	
	
	return {
		
		getTimeColor : getTimeColor,
		init : init
	
	}
	
	
	
	

})();



function TemporalColorScheme(startColor, endColor) {

	this.startColor = startColor;
	this.endColor = endColor;
	this.maxValue = maxValue;
	this.minValue = minvalue;
	
	
	function getTimeColor() {
	
	}
	


}	


