var LS = LS || {};


LS.app = (function (){
	
		var map = null, 
		geojson = null;
		var _temporalColor; 
		var idMap = [],
		segmenttrack = [],
		tracks = [];
		
		/*
			Private functions
		*/
		
		function style(feature) {
			console.log(feature);
			console.log(feature.properties.segmenttime);
			return {
				fillColor: _temporalColor.getTimeColor(feature.properties.segmenttime),
				weight: 3,
				opacity: 1,
				color: _temporalColor.getTimeColor(feature.properties.segmenttime),
				fillOpacity: 0.6
			};

		}

		
		
		function highlightFeature(e) {
		
			var object = e.target;
			object.setStyle({
				weight: 6,
				fillColor: object.options.fillColor,
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
		function init(divElement, temporalColor) {
			_temporalColor = temporalColor;
			map = L.map('map', {zoomControl: false}).setView([61.3999272955946,5.76203078840252], 13);
			
			L.control.zoom({
				 position:'topright'
			}).addTo(map);
			
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
				for (var i=0; i<geojson.objects.length; i++) {
					if (segmentTime != segmentTime || lengt != length) {
					//	delete and add
					}
				}
				//geojson = L.geoJson(featureCollection, {onEachFeature : onEachFeature, style : style}).addTo(map);
			} 
			
		}
		
		function highlightSegments(segmentIds) {
			for (i=0; i<segmentIds.length; i++) {
				for (j=0; j<idMap.length; j++) {
				
					if (idMap[j].sid == segmentIds[i]) {
						map._layers[idMap[j].lid].setStyle({ weight: 6}).bringToFront();
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
				if (tracks[i].getId() == trackId) {
					highlightSegments(tracks[i].getSegmentIds());
					break;
				}
			}
			
		}
		
		function getAllSegments() {
			var allSegments = [];
			for (var i=0; i<idMap.length; i++) {
				allSegments.push(map._layers[idMap[i].lid].feature);
			}
			return allSegments;
		}
		
		
		function addTrackObjects(trackObjects) {
			var tempsegments = getAllSegments();
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
	
	
	function convertTime(ts) {
		var time = new Date(1970,01,01,0,0,0,0);
		if (ts) {
			time = new Date(ts.substr(0,4),ts.substr(5,2)-1,ts.substr(8,2),ts.substr(11,2),ts.substr(14,2),ts.substr(17,2),0);
		}
		return time;
	}
	
	function Track(trackObject) {
	
		this.trackId = trackObject.track_id;
		this.name = trackObject.name;
		this.trackSegments = [];
		console.log(trackObject);
		for (var i = 0; i<trackObject.segment_ids.length; i++) {
			this.trackSegments.push(
				{segmentId : trackObject.segment_ids[i], 
				segmentOrder : trackObject.segment_order[i],
				definingSegment : trackObject.defines_track[i]});
		}
		this.lastUpdate = null;
		
		this.trackLength = 0;
		this.subSegments = [];
		this.status = [];
		this.temp = [];
		console.log(trackObject);
		
		this.buildInfo = function(segments) {
		
			for (var j=0; j<this.trackSegments.length; j++) {
				for (var i=0; i<segments.length; i++) {
						
						if (segments[i].properties.sid == this.trackSegments[j].segmentId) {
						
							this.status.push({
								
								segmentid : segments[i].properties.sid,
								segmentOrder : this.trackSegments[j].segmentOrder,
								subSegmentOrder : segments[i].properties.segmentorder, 
								subSegmentLength : segments[i].properties.length,
								subSegmentTime : segments[i].properties.segmenttime
								
								});
								
							this.trackLength += segments[i].properties.length;
							console.log((this.trackSegments[j].definingSegment));
							
							if( segments[i].properties.segmenttime > this.lastUpdate || this.lastUpdate == null) {
								if (this.trackSegments[j].definingSegment) {
								this.lastUpdate = segments[i].properties.segmenttime;
								console.log(segments[i].properties.segmenttime);
								}
							}
						}
				}
				
				
			}
			
		}
		
		this.getLastUpdate = function() {
			return this.lastUpdate;
		}
		this.getStatus = function() {
			return this.status;
		 }
		this.getSegmentIds = function() {
			var res = [];
			for (var i=0; i<this.trackSegments.length; i++) {
				res.push(this.trackSegments[i].segmentId);
			}
			return res;
		}
		
		this.getId = function() {
			return this.trackId;
		}
		this.getLength = function() {
			return this.trackLength;
		}
	}
	