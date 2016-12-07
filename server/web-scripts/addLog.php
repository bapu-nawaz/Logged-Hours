<?php

	include 'config.php';

	$name = $_REQUEST['name'];
	$date = $_REQUEST['date'];
	$start = $_REQUEST['start'];
	$end = $_REQUEST['end'];
	$notes = $_REQUEST['notes'];
	$user = $_REQUEST['user'];

	mysql_query("
		INSERT INTO 
		`logged_hours`(`user_id`,`name`,`date`,`start`,`end`,`notes`,`paid`) 
		VALUES($user,'$name','$date','$start','$end','$notes',0)") or die("0");
	echo "1";

?>