<?php


    $latitude=61.3999272955946;
    $longitude=5.76203078840252;
    
    function getLocationWeatherUrl($latitude, $longitude) {
        $url = "http://api.yr.no/weatherapi/locationforecast/1.9/?lat=".$latitude. ";lon=" .$longitude;
        return $url;
    }
    
    function getSunRiseUrL($latitude, $longitude) {
        return "http://api.yr.no/weatherapi/sunrise/1.0/?lat=" .$latitude. ";lon=" .$longitude. ";date=". date('Y-m-d');
    }
    
    function getWeatherIconUrl($symbol_number, $is_night) {
        return "http://api.yr.no/weatherapi/weathericon/1.1/?symbol=" .$symbol_number. ";is_night=" .$is_night. ";content_type=image/svg%2Bxml";
    }
    
    function isSunUp() {
        return false;
    }
    
    function getImage($url,$saveto){
        $ch = curl_init ($url);
        curl_setopt($ch, CURLOPT_HEADER, 0);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        curl_setopt($ch, CURLOPT_BINARYTRANSFER,1);
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        $raw=curl_exec($ch);
        curl_close ($ch);
        if(file_exists($saveto)){
            unlink($saveto);
        }
        $fp = fopen($saveto,'x');
        fwrite($fp, $raw);
        fclose($fp);
    }
        
    function getXML($path){
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL,$path);
        curl_setopt($ch, CURLOPT_FAILONERROR,1);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION,1);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
        curl_setopt($ch, CURLOPT_TIMEOUT, 15);
        curl_setopt($ch, CURLOPT_IPRESOLVE, CURL_IPRESOLVE_V4);
        $retValue = curl_exec($ch);		
        
        curl_close($ch);
        
        return $retValue;
    }

    $response = getXML(getLocationWeatherUrl($latitude, $longitude));
    $xml = new SimpleXMLElement($response);
    
    $forecasts = $xml->product->children();
    
    $full = $forecasts[0]->location;
    $precipitation = $forecasts[1]->location->precipitation->attributes();
    $symbol = $forecasts[1]->location->symbol->attributes();
    
    $temperature = $full->temperature['value'];
    $wind_direction_deg = $full->windDirection['deg'];
    $wind_direction_name = $full->windDirection['name'];
    
    $wind_speed = $full->windSpeed['mps'];
    $wind_speed_beaufort = $full->windSpeed['beaufort'];
    
    $symbol_id = $symbol['id'];
    $symbol_number = $symbol['number'];
    $pres_unit = $precipitation['unit'];
    $pres_value = $precipitation['value'];
    
    getImage(getWeatherIconUrl($symbol_number, 0), 'weather_temp.svg');
    
    $current_weather = array(
        'timestamp' => 'test',
        'temperature' => (string)$temperature,
        'wind_direction' => (string)$wind_direction_deg,
        'wind_speed' => (string)$wind_speed,
        'symbol_number' => (string)$symbol_number,
        'precipitation' => (string)$pres_value
    );
    
    
    file_put_contents('weather_temp.json', json_encode($current_weather));
    
    
    
?>