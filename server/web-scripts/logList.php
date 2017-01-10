<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$details = array();
	$query = mysql_query("SELECT * FROM `logged_hours` WHERE user_id=$id");
	while($hour = mysql_fetch_assoc($query))
		array_push($details, $hour);
	echo json_encode($details);

?>