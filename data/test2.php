<?php


    require_once 'includes/Simple-PHP-Cache/cache.class.php';
    // setup 'default' cache
    $c = new Cache();
    
    
    $result = $c->retrieve('current_weather');
    
    print_r($result);

?>