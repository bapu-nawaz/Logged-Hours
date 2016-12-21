<?php

	include 'config.php';
	$id = $_REQUEST['id'];
	$comment = $_REQUEST['comment'];
	$query = mysql_query("UPDATE `logged_hours` SET `paid`=3, `notes`='$comment' WHERE id=$id");

?>