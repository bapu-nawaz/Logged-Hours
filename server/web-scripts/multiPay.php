<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$date = $_REQUEST['date'];
	$uid = mysql_fetch_assoc( mysql_query("SELECT user_id FROM `logged_hours` WHERE id=$id") )['user_id'];
	mysql_query("UPDATE `logged_hours` SET paid=1, paid_date='$date' WHERE user_id=$uid AND paid=0");

?>