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
		
            
        var _dayMeterCount = 0;
        var _lastUpdate;
		
		/*
			Public functions
		*/
		function init(divElement, temporalColor) {
			_temporalColor = temporalColor;
			map = L.map('map', {zoomControl: false}).setView([61.3999272955946,5.7503078840252], 14);
			
            
            _dayMeterCount = 0;
            
			L.control.zoom({
				 position:'topright'
			}).addTo(map);
			
			map.scrollWheelZoom.disable();
            L.tileLayer('http://www.webatlas.no/maptiles/tiles/webatlas-gray-vektor/wa_grid/{z}/{x}/{y}.png', {
                maxZoom: 20,
                zIndex: 0,
                attribution: '<a target=_blank href="http://www.norkart.no">Norkart AS</a>'
            }).addTo(map);
            
			//map.addLayer(L.tileLayer.wms("http://www.webatlas.no/maptiles/tiles/webatlas-gray-vektor/wa_grid/{z}/{x}/{y}.png"));
			//map.addLayer(L.tileLayer.wms("http://opencache.statkart.no/gatekeeper/gk/gk.open?",{layers: 'topo2graatone', format: 'image/png'},{attribution:''}));
			
			map.on('layeradd', function(e) {

				if (e.layer.feature) {	    
					idMap.push({
						sid : e.layer.feature.properties.sid,
						lid : e.layer._leaflet_id
					});
                    updateTopTrackInfo(e.layer.feature);
				}
			});
		}
		
		function addSegments(featureCollection) {
            geojson = L.geoJson(featureCollection, {onEachFeature : onEachFeature, style : style}).addTo(map);
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
        
        function updateTopInfo() {
           var str = 'Sist køyrd ';
           var today = new Date();
           var yesterday = new Date();
           yesterday.setDate(yesterday.getDate() - 1);
           console.log(yesterday.getDate());
           console.log(_lastUpdate.getDate());
           var str2;
           if (_lastUpdate.getDate() == today.getDate && _lastUpdate.getMonth() == today.getMonth()) {
               str2 = 'i dag';
           } else if (_lastUpdate.getDate() == yesterday.getDate() && _lastUpdate.getMonth() == yesterday.getMonth()) {
               str2 = 'i går';
           } else {
                str2 = LS.timeModule.getDateText(_lastUpdate);
           }
           str = str + str2
           var str2 = ' ' + (_dayMeterCount/1000).toPrecision(2) +  ' km vart preparert';
           $('#lang-track-status').html('<p class="tracks-info-text">' +str + '</p><p class="tracks-info-text">' + str2 + '</p>');
        }
        
        function daysCount(time) {
            return Math.floor(time/(1000*3600*24));
        }
        
        function updateTopTrackInfo(feature) {
            var temp = convertTime(feature.properties.segmenttime);
            if (typeof _lastUpdate === "undefined") {
                _dayMeterCount = feature.properties.length;
                _lastUpdate = temp;
            } else if (daysCount(temp) - daysCount(_lastUpdate) > 1) {
            
            //temp.getDate() > _lastUpdate.getDate() && temp.getMonth() == _lastUpdate.getMonth()) {
                _dayMeterCount = feature.properties.length;
                _lastUpdate = temp;
           // } else if (temp.getDate() == _lastUpdate.getDate()  && temp.getMonth() == _lastUpdate.getMonth()) {
            } else if (daysCount(temp) == daysCount(_lastUpdate)) {
                _dayMeterCount += feature.properties.length;
            }
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
			resetAllStyles : resetAllStyles,
            updateTopInfo : updateTopInfo
		}
				
	})();
	
    
	function convertTime(ts) {
		var time = new Date(1970,01,01,0,0,0,0);
		if (ts) {
			time = new Date(ts.substr(0,4),ts.substr(5,2)-1,ts.substr(8,2),ts.substr(11,2),ts.substr(14,2),ts.substr(17,2),0);
		}
		return time;
	}
	
	function Track(trackObject, segments) {
	
		this.trackId = trackObject.track_id;
		this.name = trackObject.name;
		this.trackSegments = {};
		for (var i = 0; i<trackObject.segment_ids.length; i++) {
			this.trackSegments[trackObject.segment_ids[i]] =
            {
                segmentOrder : trackObject.segment_order[i],
                isDefiningSegment : trackObject.defines_track[i] == '1' ? true : false,
                segments : [],
                segmentLength : 0,
                status : []
            };
		}
		this.lastUpdate = null;
		
		this.trackLength = 0;
		this.subSegments = [];
		this.status = [];
		this.temp = [];
		this.buildInfo = function(segments) {
		
			for (var trackSegmentId in this.trackSegments) {
                
				for (var i=0; i<segments.length; i++) {
                    if (trackSegmentId == segments[i].properties.sid) {
                        
                        this.trackSegments[trackSegmentId].segments.push({
                            subSegmentOrder : segments[i].properties.segmentorder, 
                            subSegmentLength : segments[i].properties.length,
                            subSegmentTime : segments[i].properties.segmenttime
                            
                        });
                        
                        this.trackSegments[trackSegmentId].segmentLength += segments[i].properties.length;
                        this.trackLength+= segments[i].properties.length;
                    }
				}
			}
            
            for (var trackSegmentId in this.trackSegments) {
                    var tempLength = 0;
                if (this.trackSegments[trackSegmentId].isDefiningSegment) {
                    var segmentList = this.trackSegments[trackSegmentId].segments;
                    for (i=0; i<segmentList.length; i++) {
                        if (i==0) {
                            this.lastUpdate = segmentList[i].subSegmentTime;
                            tempLength = segmentList[i].subSegmentLength;
                        } else {
                            if (segmentList[i].subSegmentLength > tempLength) {
                                this.lastUpdate = segmentList[i].subSegmentTime;
                                tempLength = segmentList[i].subSegmentLength;   
                                
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
            
            var status = [];
            for (segmentId in this.trackSegments) {
                var segment = this.trackSegments[segmentId];
                
                var subSegments = segment.segments.sort(function(a,b) {a.subSegmentOrder < b.subSegmentOrder });
                for (var i =0; i<subSegments.length; i++) {
                     status.push( {
                        segmentId : segmentId,
                        subSegmentTime : subSegments[i].subSegmentTime,
                        subSegmentLength : subSegments[i].subSegmentLength	
                    });
                }
                
            }
			return status;
		 }
		this.getSegmentIds = function() {
			var res = [];
			for (var id in this.trackSegments) {
				res.push(id);
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
	