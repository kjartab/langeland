<?php
error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

require_once('includes/api.lib.php'); 
require_once('includes/DatabaseHelper.php');
require_once('includes/DatabaseRestricted.php');
require_once('includes/db.php');


	$requestObj = new Controller();
	$dbHelper = new DatabaseHelper($db);
	$dbWriter = new DatabaseRestricted($db);
	$request = $requestObj->getRequest();

		$data = $requestObj->getData();
		switch( $requestObj->getMethod() ) {
			case 'get':
				
				$request = explode("/", $_SERVER['REQUEST_URI'] );
				
				$dbHelper->connect();
				
				$res = '';
				
				// if data -> show overview 	
				
				if (count($request) > 2) {
			
					switch($request[2]) {
					
						// ------------- Handle all geometry queries ------------- 
						case 'spatial':
							if (count($request) == 3) {
								$res = $dbHelper->getGeometryTables();
							} else if (count($request) > 4) {
								$res = $dbHelper->getRecordFromTable($request[3],$request[4]);
							}
							
							echo $res;
							
							break;
							
						// ------------- Handle the spatiotemporal queries ------------- 
						case 'spatiotemporal':

							$res = $dbHelper->getGeoJsonTracks();
							
							echo $res;
							break;
							
							
						case 'spatiotemporalewkb':

							$res = $dbHelper->getTemporalTracksEWKB();
							
							echo $res;
							break;
							
						case 'segmentmap':

							$res = $dbHelper->getTrackSegments();
							
							echo $res;
							break;
                        case 'test':
                            
                            $url = "http://api.yr.no/weatherapi/locationforecast/1.9/?lat=61.3999272955946;lon=5.76203078840252";
                            $res = getURL($url);
                            echo $res;
                            break;
                        
						case 'weather':
                            
                            $url = "http://api.yr.no/weatherapi/locationforecast/1.9/?lat=61.3999272955946;lon=5.76203078840252";
                            echo getWeatherInfo($url);
							
							break;

						case 'inserted':

							$res = $dbHelper->getInsertedPoints($data['numpoints'],$data['order']);
							
							echo $res;
							break;
						case 'tracks':

							$res = $dbHelper->getTracks();
							
							echo $res;
							break;
							
						case 'trackobjects':
						
							$res = $dbHelper->getTrackObjects();
							echo $res;
							break;
							
						case 'segments':

							$res = $dbHelper->getSegmentsWKB();
							
							echo $res;
							break;
						
						case 'segmentswkbandid':

							$res = $dbHelper->getSegmentswkbandid();
							
							echo $res;
							break;
							
						case 'rawdatahours': 
							
							$table = getVariable($_GET,'table', 'rawpositiondata');
							$hours =  getVariable($_GET,'hours', 24);
							$limit = getVariable($_GET, 'limit', 100);
							$order = getVariable($_GET, 'order', 'desc');
							
							$res = $dbHelper->getRawDataHours($table, $limit, $order, $hours);
							
							echo $res;
							
							
							break;
							
						case 'rawdataoninterval':
						
							$table = getVariable($_GET,'table', 'rawpositiondata');
							$startTime =  getVariable($_GET,'starttime', '2014-12-13 00:00:00');
							$endTime =  getVariable($_GET,'endtime', '2014-12-14 00:00:00');
							$limit = getVariable($_GET, 'limit', 100);
							$order = getVariable($_GET, 'order', 'desc');
							
							$res = $dbHelper->getRawDataOnInterval($table, $limit, $order, $startTime, $endTime);
							echo $res;
							break;
						
						break;
						
						case 'segments32632':

							$res = $dbHelper->getSegmentss32632();
							
							echo $res;
							break;	
							
							
						default:
						
								echo 'nothing	 ';
								break;
						
					
					}
					
				} else {
					header("Location: /data/langeland/data.html");
					die();
					
				} 
				
				
				break;
				
				
			default:
				Controller::respond( 405 );
				break;
	}
    
                
    function getURL($url, $urlvars = null) {
        
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		curl_setopt ($ch, CURLOPT_HTTPHEADER, Array("Content-Type: application/xml"));
        
        $res = curl_exec($ch);
        
        curl_close($ch);
        return $res;
    }
        
    function getWeatherInfo($url) {
        // store a string
		$c = new Cache();
        $c->store('hello', 'Hello World!');

        // generate a new cache file with the name 'newcache'
        $c->setCache('newcache');
        $url = "http://api.yr.no/weatherapi/locationforecast/1.9/?lat=61.3999272955946;lon=5.76203078840252";
        
        // store an array
        $c->store('movies', array(
          'description' => 'Movies on TV',
          'action' => array(
            'Tropic Thunder',
            'Bad Boys',
            'Crank'
          )
        ));

        // get cached data by its key
        $result = $c->retrieve('movies');

        // display the cached array
        echo '<pre>';
        print_r($result);
        echo '<pre>';

        // grab array entry
        $description = $result['description'];

        // switch back to the first cache
        $c->setCache('mycache');

        // update entry by simply overwriting an existing key
        $c->store('hello', 'Hello everybody out there!');

        // erase entry by its key
        $c->erase('hello');
    }
  
