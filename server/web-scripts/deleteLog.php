<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	mysql_query("DELETE FROM `logged_hours` WHERE id=$id");

?>