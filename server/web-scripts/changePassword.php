<?php

	include 'config.php';

	$pass = base64_encode($_REQUEST['pass']);
	$id = $_REQUEST['id'];
	mysql_query("UPDATE `employees` SET pass='$pass' WHERE id=$id");

?>