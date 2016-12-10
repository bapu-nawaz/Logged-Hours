<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$query = mysql_query("SELECT * FROM `employees` WHERE id=$id");
	$details = mysql_fetch_assoc($query);
	$details["logs"] = array();
	$query = mysql_query("SELECT * FROM `logged_hours` WHERE user_id=$id AND paid<>1");
	while($logs = mysql_fetch_assoc($query))
		array_push($details["logs"], $logs);
	echo json_encode($details);

?>