<?php
	
Class DatabaseHelper {
		
	private $host;
	private $port;
	private $dbname;
	private $user;
	private $password;	
	private $dbconn;
	private $dbresult;
	
	
    public function __construct($db) {
		$this->dbArray = $db;
	}
	
	public function connect() {	
		if ($this->dbconn == null) {
			$this->dbconn = pg_connect($this->dbArray['connectionString']);
		} else {
			echo 'connection already established';	
		}
	}
	
	public function runQuery($queryText) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = pg_query($queryText);
		}
		return $this->transformResult($dbresult);
	}
	
	private function transformResult($dbres) {
		$data = array();
		while ($row = pg_fetch_row($dbres)) {
			$data[] = $row;
		}
		return json_encode($data);
	}
	
	public function getTable($table) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT id, ST_AsGeoJson(ST_Transform(geom,4326)) FROM ' .$table. '');
			if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	public function getGeometryTables() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('
				SELECT table_name FROM information_schema.columns WHERE table_schema =\'public\' AND udt_name=\'geometry\' and dtd_identifier !=\'16\'');
			if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
		
	
	public function getRecordFromTable($table,$id) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT * FROM ' .$table.' WHERE id=' .$id. ';');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	// --------------- Functions specifically dealing with Langeland database tables --------------- 
	
	public function getGeoJsonTracks() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT row_to_json(feature_collection)
									FROM ( SELECT \'FeatureCollection\' AS type, 
										array_to_json(array_agg(feature)) As features
										FROM (	
											SELECT \'Feature\' AS type, 
											ST_AsGeoJson(ST_Transform(k.segment,4326))::json AS geometry, 
											row_to_json((SELECT seg_id FROM (SELECT sid, segmenttime, length) AS seg_id)) AS properties
											FROM (SELECT segment, segmenttime, ST_Length(segment) length, s.segment_id as sid FROM prebuild_temporalsegment s) k
											) AS feature 
										) AS feature_collection;');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	public function getTracks() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT * from track_table;');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
		
	public function getSegmentsWKB() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT ST_AsBinary(track_line) FROM segment_table where id=101;');
		if ($dbresult === false) {
				return;
			}
		}
		
		$row = pg_fetch_row($dbresult);
		pg_free_result($dbresult);
		if ($row === false) return;
		return pg_unescape_bytea($row[0]);
	}
	
		
		
	public function getGeoJsonTracks3() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT row_to_json(feature) FROM (
	SELECT \'Feature\' AS type, 
	ST_AsGeoJson(ST_Transform(k.track_line,4326))::json AS geometry, 
	row_to_json((SELECT seg_id FROM (SELECT sid) AS seg_id)) AS properties
	FROM (SELECT track_line, s.id as sid FROM segment_table s) k) AS feature ;');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}

	
	public function getInsertedPoints($numtracks, $order) {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = @pg_query('SELECT id, ST_AsGeoJson(position), insertedtime, EXTRACT(EPOCH FROM now()-insertedtime) FROM testtracking order by insertedtime '.$order.' LIMIT '.$numtracks.'; ');
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	

	public function getTrackSegments() {
		$dbresult;
		if ($this->dbconn) {
			$dbresult = pg_query("select array_to_json(array_agg(row_to_json(t)))
						FROM ( SELECT id, segment_id, track_id, segment_order from track_segment_table) t");
		if ($dbresult === false) {
				return;
			}
		}
		return $this->transformResult($dbresult);
	}
	
	
	
	
}


?>