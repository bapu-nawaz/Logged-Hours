<?php

	include 'config.php';

	$name = $_REQUEST['name'];
	$pass = base64_encode($_REQUEST['pass']);

	$query = mysql_query("SELECT id FROM `employees` WHERE name LIKE '%$name%' AND pass LIKE '$pass'");
	$result = [];
	while( $employee = mysql_fetch_assoc($query) ) {
		echo json_encode($employee);
		die();
	}

	echo "0";

?>