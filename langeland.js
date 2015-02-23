


var lang = (function (divElement){
	
		var map = null, 
		geojson = null;
		
		var idMap = [],
		segmenttrack = [],
		tracks = [];
		
		/*
			Private functions
		*/
		
		function style(feature) {
		
			return {
				fillColor: '#0000ff',
				weight: 3,
				opacity: 1,
				color: '#0000ff',
				fillOpacity: 0.6
			};

		}

		function highlightFeature(e) {
		
			var object = e.target;
			object.setStyle({
				weight: 6,
				fillColor: object.options.fillColor,
				color: '#333333',
				fillOpacity: 0.7
			});

			if (!L.Browser.ie && !L.Browser.opera) {
				object.bringToFront();
			}
		}

				
		function onEachFeature(feature, layer) {
			
			layer.on({
				mouseover: highlightFeature,
				mouseout : resetHighlight,
				click : click
			});
		}
		
		
		function resetHighlight(e) {
			geojson.resetStyle(e.target);
		}
		
		function click(e) {
			console.log(e.target.feature.properties);
		}
		
		
		/*
			Public functions
		*/
		function init() {
		
			map = L.map('map').setView([61.3999272955946,5.76203078840252], 13);
			map.scrollWheelZoom.disable();
			map.addLayer(L.tileLayer.wms("http://opencache.statkart.no/gatekeeper/gk/gk.open?",{layers: 'topo2graatone', format: 'image/png'},{attribution:''}));
			
			map.on('layeradd', function(e) {

				if (e.layer.feature) {
					idMap.push({
						sid : e.layer.feature.properties.sid,
						lid : e.layer._leaflet_id
					});
				}
			});
		}
		
		function addSegments(featureCollection) {
			
			if (!geojson) {
				geojson = L.geoJson(featureCollection, {onEachFeature : onEachFeature, style : style}).addTo(map);
			} else {
				//geojson = L.geoJson(featureCollection, {onEachFeature : onEachFeature, style : style}).addTo(map);
			} 
			
		}
		
		function highlightSegments(segmentIds) {
			for (i=0; i<segmentIds.length; i++) {
				for (j=0; j<idMap.length; j++) {
					if (idMap[j].sid == segmentIds[i]) {
						map._layers[idMap[j].lid].setStyle({ color: '#343434', weight: 7}).bringToFront();
					}
				}
			}
		}	
		
		function resetAllStyles() {

			for(var layer in geojson._layers) {
				geojson.resetStyle(geojson._layers[layer]);
			}
			
		}
		
		function highlightTrack(trackId) {
			for (var i=0; i<tracks.length; i++) {
				if (tracks[i].id == trackId) {
					highlightSegments(tracks[i].segmentIds);
					break;
				}
			}
			
		}
		
		function getSegments() {
                
			var allSegments = [];
            console.log(geojson);
			for (var i=0; i<idMap.length; i++) {
				allSegments.push(map._layers[idMap[i].lid].feature);
			}
			return allSegments;
		}
		
		
		function addTrackObjects(trackObjects) {
			var tempsegments = getSegments();
				var newTrackObject = new Track(trackObjects);
				
				newTrackObject.buildInfo(tempsegments);
				tracks.push(newTrackObject);
			
		}
		
		function getTracks() {
			return tracks;
		}
		
		/*
			Return public functions
		*/
		return { 	
			init : init,
			addSegments : addSegments,
			addTrackObjects : addTrackObjects,
			getTracks : getTracks,
			highlightTrack : highlightTrack,
			resetAllStyles : resetAllStyles
		}
				
	})();
	
	
	
	
	function Track(trackInfo) {
        this.segmentArray = [];
		
        for (var i=0; i <trackInfo.segment_ids.length; i++) {
            this.segmentArray.push(
                {
                    'sid' : trackInfo.segment_ids[i],
                    'segment_order' : trackInfo.segment_order[i],
                    'track_defining' : trackInfo.defines_track[i]
                }
            );
        }
		this.segmentIds = trackInfo.segment_ids;
		this.segmentOrder = trackInfo.segment_order;
		this.id = trackInfo.track_id;
		this.name = trackInfo.name;
		this.trackLength = 0;
		this.status = [];
		
		this.buildInfo = function(segments) {
		
			var tempSegment;
			for (var i=0; i<segments.length; i++) {
			
				for (var j=0; j<this.segmentArray.length; j++) {
                    
					if (segments[i].properties.sid == this.segmentIds[j]) {
						this.trackLength += +segments[i].properties.length;
						this.status.push({
							segmentLength : segments[i].properties.length,
							segmentTime : segments[i].properties.segmenttime,
						});
					}
				}
			}
			
				
			for (var i = 0; i<this.status.length; i++) {
				this.status[i].segmentLength/this.trackLength;
			}
			
			
		}
			
		this.getLength = function() {
			return trackLength;
		}

	}
    
    function getLongestSubsegment(segmentId) {
        for (var i=0; i<segments.length; i++) {
            
        }   
    }
