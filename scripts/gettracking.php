<?php

$dbconn = pg_connect('host=localhost port=5432 dbname=mbe user=postgres password=kjartan');
$dbres = null;
if ($dbconn != null) {
	$dbres = pg_query(
	
	'SELECT row_to_json(feature_collection)
		FROM ( SELECT 'FeatureCollection' AS type, 
			array_to_json(array_agg(feature)) As features FROM (
			
				SELECT 'Feature' AS type, ST_AsGeoJson(ST_Transform(point,4326))::json AS geometry, 

				row_to_json((SELECT seg_id FROM (SELECT id, insertedtime) AS seg_id)) AS properties

				FROM (SELECT position as point, s.id as id, s.insertedtime FROM test_update_segment s) k


				) AS feature 

			) AS feature_collection;');
} else {
	echo 'No db connection';
}

$data = array();
	while ($row = pg_fetch_row($dbres)) {
		$data[] = $row;
	}
	
echo json_encode($data);

?>