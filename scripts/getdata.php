<?php
	header('Content-Type: application/json');
$dbconn = pg_pconnect("host=localhost port=5432 dbname=langeland user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());


	
	// $result = pg_query($dbconn, "SELECT row_to_json(feature_collection)
		// FROM ( SELECT 'FeatureCollection' AS type, array_to_json(array_agg(feature)) As features
			// FROM (SELECT 'Feature' AS type, 'test1' AS name, ST_AsGeoJson(ST_Transform(track_segment.geom,4326))::json AS geometry, row_to_json((SELECT seg_id FROM (SELECT id) AS seg_id)) 
			// AS properties
				// FROM track_segment ) AS feature ) AS feature_collection;");
			

	$result = pg_query($dbconn, "SELECT row_to_json(feature_collection)
		FROM ( SELECT 'FeatureCollection' AS type, 
			array_to_json(array_agg(feature)) As features
			FROM (	

				SELECT 'Feature' AS type, 
			
				ST_AsGeoJson(ST_Transform(k.track_line,4326))::json AS geometry, 

				row_to_json((SELECT seg_id FROM (SELECT sid) AS seg_id)) AS properties

				FROM (SELECT track_line, s.id as sid FROM segment_table s) k


				) AS feature 

			) AS feature_collection;");			

   

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

