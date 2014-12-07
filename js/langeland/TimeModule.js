var LS = LS || {};

LS.timeModule = (function() {
	
	function getTimeText(timeString) {
		var now = new Date();
		var time = convertTime(timeString);		
		
		var diff = now.getTime() - time.getTime();
		console.log(diff);
		if (diff < 1000*2*3600) {
			return Math.round(diff/(60*1000)) + ' min';
		} else if (diff < 1000*24*3600) {
		
			return Math.round(diff/(3600*1000)) + 'timar';
		} else if (diff < 1000*24*2*3600) {
			
			return  ;
		} else if (diff < 1000*24*14*3600) {
			return  Math.floor(diff/(24*3600*1000)) + ' dagar';
		} else if (diff < 1000*24*31*2*3600){
			
			return  Math.floor(diff/(24*3600*7)) + ' veker';
		} else if (diff < 1000*24*3600*180) {
			return  time.getDate() + '. '  + monthName(time.getMonth());
		} 

		return  'I fjor';
		
		
		
		
	}
	
	function monthName(monthInteger) {
		switch(monthInteger) {
			
			case 0:
				return 'januar';
			break;
			
			case 1:
				return 'februar';
			break;
			
			case 2:
				return 'mars';
			break;
			
			case 3:
				return 'april';
			break;
			
			case 4:
				return 'mai';
			break;	
			
			case 5:
				return 'juni';
			break;
			
			case 6:
				return 'juli';
			break;
			
			case 7:
				return 'august';
			break;
			
			case 8:
				return 'september';
			break;
			
			case 9:
				return 'oktober';
			break;
			
			case 10:
				return 'november';
			break;
			
			case 11:
				return 'desember';
			break;
			
		}
	}
	
	return {
		getTimeText : getTimeText
	}

})();