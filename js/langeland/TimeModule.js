var LS = LS || {};

LS.timeModule = (function() {
	
	function getTimeTextOld(timeString) {
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
	
	function getTimeText(timeString) {
		var now = new Date();
		var time = convertTime(timeString);	
        console.log(time);
		return  time.getHours() + ':' +  (time.getMinutes()<10 ? '0' : '') + time.getMinutes()+ ' '  + time.getDate() + '. '  + monthName(time.getMonth());
	
		
	}
    
    function getDateText(time) {
        console.log(time);
		return time.getDate() + '. '  + monthName(time.getMonth());
    }
        
	function fullMonthName(monthInteger) {
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
	
	
	function monthName(monthInteger) {
		switch(monthInteger) {
			
			case 0:
				return 'jan';
			break;
			
			case 1:
				return 'feb';
			break;
			
			case 2:
				return 'mar';
			break;
			
			case 3:
				return 'apr';
			break;
			
			case 4:
				return 'mai';
			break;	
			
			case 5:
				return 'jun';
			break;
			
			case 6:
				return 'jul';
			break;
			
			case 7:
				return 'aug';
			break;
			
			case 8:
				return 'sept';
			break;
			
			case 9:
				return 'okt';
			break;
			
			case 10:
				return 'nov';
			break;
			
			case 11:
				return 'des';
			break;
			
		}
	}
	
	
	return {
		getTimeText : getTimeText,
        getDateText : getDateText
	}

})();
