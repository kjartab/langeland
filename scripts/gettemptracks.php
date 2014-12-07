<?php
	header('Content-Type: application/json');
	$dbconn = pg_connect("host=localhost port=5432 dbname=langeland user=postgres password=kjartan");
	if(!$dbconn) die('coud not connect to pgsql');


	
	// $result = pg_query($dbconn, "SELECT row_to_json(feature_collection)
		// FROM ( SELECT 'FeatureCollection' AS type, array_to_json(array_agg(feature)) As features
			// FROM (SELECT 'Feature' AS type, 'test1' AS name, ST_AsGeoJson(ST_Transform(track_segment.geom,4326))::json AS geometry, row_to_json((SELECT seg_id FROM (SELECT id) AS seg_id)) 
			// AS properties
				// FROM track_segment ) AS feature ) AS feature_collection;");
			

	$result = pg_query($dbconn, "select array_to_json(array_agg(row_to_json(t)))
    from (
      select id, segment_id, track_id, segment_order from track_segment_table
    ) t");
//	$result = pg_query($dbconn, "SELECT array_to_json(array_agg(track)) FROM (SELECT * from track_segment_table) track;");			

   

	if (!$result) {
	  echo "An error occured.\n";
	  exit;
	}
	
	$data = array();

	while ($row = pg_fetch_row($result)) {
		$data[] = $row;
	}
	
	pg_close($dbconn);
	
	print json_encode($data);

	?>

