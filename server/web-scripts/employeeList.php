<?php

	include 'config.php';
	$details = array();
	$query = mysql_query("SELECT * FROM `employees`");
	while($employee = mysql_fetch_assoc($query))
		array_push($details, $employee);
	echo json_encode($details);

?>