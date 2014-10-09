
<?php



header('Content-Type: application/json');
$dbconn = pg_pconnect("host=localhost port=5432 dbname=langeland user=postgres password=kjartan sslmode=disable") or die('Could not connect: ' . pg_last_error());

	$result = pg_query($dbconn, "with spending as (select * from rawtransactions where amount <0)

select to_char(transactiondate,'Mon') as mon,
       extract(year from transactiondate) as yyyy,
       sum("amount") as "amount"
from spending
group by 1,2;");			

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

