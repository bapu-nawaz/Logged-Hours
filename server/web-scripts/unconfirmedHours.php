<?php

	include 'config.php';
	$details = array();
	$query = mysql_query("SELECT l.id, l.date, l.start, l.end, l.name, l.paid, e.name as emp, l.notes FROM `logged_hours` l,`employees` e WHERE paid<>1 AND l.user_id=e.id");
	while($logs = mysql_fetch_assoc($query))
		array_push($details, $logs);
	echo json_encode($details);

?>