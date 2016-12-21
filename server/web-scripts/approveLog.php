<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$query = mysql_query("UPDATE `logged_hours` SET paid=0 WHERE id=$id");

?>