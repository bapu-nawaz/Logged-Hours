<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$date = $_REQUEST['date'];
	mysql_query("UPDATE `logged_hours` SET paid=1, paid_date='$date' WHERE id=$id");

?>