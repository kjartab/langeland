<?php
	header('Content-Type: application/json');
	$dbconn = pg_pconnect("host=localhost port=5433 dbname=langeland user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());

	$result = pg_query($dbconn, 
		
		// FROM TABLE segment_track_updates - which is a static table - which pushes updates in and stores the audit trail in another table
	
			"Insert into testtracking(speed) values (15)");

   

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

